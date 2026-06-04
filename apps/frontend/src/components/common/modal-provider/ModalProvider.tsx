import { Alert, type AlertProps } from "../alert/Alert";
import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    type ReactNode
} from "react";
import { Modal, type ModalOverlayMode, type ModalPositionMode } from "../modal/Modal";

// ── Types ────────────────────────────────────────────────────────────────────

export type ModalStackMode = "hide" | "show";

interface ModalEntry {
    id: number;
    element: ReactNode;
    options: {
        closeOnOverlay: boolean;
        autoClose?: number;
        overlay: ModalOverlayMode;
        position: ModalPositionMode;
        stackMode: ModalStackMode;
    };
}

interface OpenModalOptions {
    closeOnOverlay?: boolean;
    autoClose?: number;
    overlay?: ModalOverlayMode;
    position?: ModalPositionMode;
    stackMode?: ModalStackMode;
}

interface ModalContextType {
    openModal: (content: ReactNode, options?: OpenModalOptions) => void;
    /**
     * Ferme la modale du dessus.
     * @param afterAnimation — callback exécuté APRÈS l'animation (250 ms),
     *   une fois le verrou libéré. Utile pour enchaîner un second closeModal
     *   sans collision (ex : fermer l'Alert puis fermer ImageDetail).
     */
    closeModal: (afterAnimation?: () => void) => void;
    stackSize: number;
}

// ── Context ──────────────────────────────────────────────────────────────────

const tml_Context = createContext<ModalContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function ModalProvider({ children }: { children: ReactNode }) {
    const [stack, setStack] = useState<ModalEntry[]>([]);
    const [closingId, setClosingId] = useState<number | null>(null);

    // Verrou : empêche deux fermetures simultanées de retirer deux entrées
    // du stack au lieu d'une seule (ex : onConfirm + onDeleted en cascade).
    const closingRef = useRef(false);

    const openModal = useCallback(
        (element: ReactNode, options?: OpenModalOptions) => {
            setStack(prev => [
                ...prev,
                {
                    id: Date.now() + Math.random(),
                    element,
                    options: {
                        closeOnOverlay: options?.closeOnOverlay ?? true,
                        autoClose: options?.autoClose,
                        overlay: options?.overlay ?? "blur-dim",
                        position: options?.position ?? "center",
                        stackMode: options?.stackMode ?? "hide",
                    }
                }
            ]);
        },
        []
    );

    const closeModal = useCallback((afterAnimation?: () => void) => {
        if (closingRef.current) return;
        closingRef.current = true;

        setStack(prev => {
            if (prev.length === 0) {
                closingRef.current = false;
                return prev;
            }
            const top = prev[prev.length - 1];
            setClosingId(top.id);
            return prev;
        });

        setTimeout(() => {
            setStack(s => (s.length === 0 ? s : s.slice(0, -1)));
            setClosingId(null);
            closingRef.current = false;
            // afterAnimation s'exécute ici, après les 250 ms et après la
            // libération du verrou — un second closeModal peut être appelé
            // sans être bloqué.
            afterAnimation?.();
        }, 250);
    }, []);

    // Auto-close sur le top
    const top = stack[stack.length - 1] ?? null;
    useEffect(() => {
        if (!top?.options.autoClose) return;
        const timer = setTimeout(() => closeModal(), top.options.autoClose);
        return () => clearTimeout(timer);
    }, [top, closeModal]);

    // ── Visibilité ───────────────────────────────────────────────────────────
    //
    // stackMode est porté par l'élément du DESSOUS.
    // Il dit : "si quelqu'un est au-dessus de moi, est-ce que je reste visible ?"
    //   "show" → je reste visible
    //   "hide" → je disparais (et tout ce qui est encore plus bas aussi)
    //
    // On parcourt de haut (top) vers le bas.
    // Pour chaque élément i qui n'est PAS le top (i < stack.length-1),
    // on lit son stackMode pour décider si on continue vers le bas.
    const visibleIds = new Set<number>();
    let blocked = false;
    for (let i = stack.length - 1; i >= 0; i--) {
        if (blocked) break;
        visibleIds.add(stack[i].id);
        if (i < stack.length - 1 && stack[i].options.stackMode === "hide") {
            blocked = true;
        }
    }

    return (
        <tml_Context.Provider value={{ openModal, closeModal, stackSize: stack.length }}>
            {children}

            {stack.map((entry, index) => {
                if (!visibleIds.has(entry.id)) return null;

                const isTop = index === stack.length - 1;
                const isClosing = entry.id === closingId;

                return (
                    <Modal
                        key={entry.id}
                        isClosing={isClosing}
                        onOverlayClick={
                            isTop && entry.options.closeOnOverlay ? () => closeModal() : undefined
                        }
                        overlayMode={entry.options.overlay}
                        position={entry.options.position}
                    >
                        {entry.element}
                    </Modal>
                );
            })}
        </tml_Context.Provider>
    );
}

// ── useModal ──────────────────────────────────────────────────────────────────

export function useModal() {
    const ctx = useContext(tml_Context);
    if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
    return ctx;
}

// ── useAlert ──────────────────────────────────────────────────────────────────

interface ShowAlertOptions extends Omit<AlertProps, "onConfirm" | "onCancel" | "onCloseButton"> {
    autoClose?: number;
    overlay?: ModalOverlayMode;
    position?: ModalPositionMode;
    closeOnOverlay?: boolean;
    stackMode?: ModalStackMode;
    onConfirm?: () => void;
    onCancel?: () => void;
    /**
     * Exécuté après la fermeture complète de l'Alert (animation incluse).
     * Utiliser ici pour enchaîner un second closeModal, ex :
     *   afterClose: () => closeModal()  ← ferme ImageDetail après l'Alert
     */
    afterClose?: () => void;
}

export function useAlert() {
    const { openModal, closeModal } = useModal();

    const showAlert = (options: ShowAlertOptions) => {
        const {
            autoClose,
            overlay = "blur-dim",
            position = "top",
            closeOnOverlay = false,
            stackMode = "hide",
            onConfirm,
            onCancel,
            afterClose,
            ...alertProps
        } = options;

        openModal(
            <Alert
                {...alertProps}
                onConfirm={() => {
                    onConfirm?.();
                    // afterClose est passé à closeModal — il s'exécutera
                    // APRÈS les 250ms d'animation, verrou déjà libéré.
                    closeModal(afterClose);
                }}
                onCancel={() => {
                    onCancel?.();
                    closeModal(); // afterClose ne s'exécute que sur onConfirm
                }}
                onCloseButton={() => closeModal()} // idem
            />,
            { autoClose, overlay, position, closeOnOverlay, stackMode }
        );
    };

    return { showAlert };
}