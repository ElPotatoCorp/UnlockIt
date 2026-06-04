import styles from "./modal.module.css";

export type ModalOverlayMode = "none" | "blur" | "dim" | "blur-dim";
export type ModalPositionMode =
    | "top"
    | "center"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

interface ModalProps {
    children: React.ReactNode;
    isClosing?: boolean;
    onOverlayClick?: () => void;
    overlayMode?: ModalOverlayMode;
    position?: ModalPositionMode;
}

export function Modal({
    children,
    isClosing = false,
    onOverlayClick,
    overlayMode = "blur-dim",
    position = "center"
}: ModalProps) {
    const overlayVariantClass = (() => {
        switch (overlayMode) {
            case "none": return styles.overlayNone;
            case "blur": return styles.overlayBlur;
            case "dim": return styles.overlayDim;
            case "blur-dim":
            default: return styles.overlayBlurDim;
        }
    })();

    const positionClass = (() => {
        switch (position) {
            case "top": return styles.positionTop;
            case "bottom": return styles.positionBottom;
            case "top-left": return styles.positionTopLeft;
            case "top-right": return styles.positionTopRight;
            case "bottom-left": return styles.positionBottomLeft;
            case "bottom-right": return styles.positionBottomRight;
            default: return styles.positionCenter;
        }
    })();

    const handleOverlayClick = () => {
        if (onOverlayClick) onOverlayClick();
    };

    return (
        <div
            className={`${styles.overlayBase} ${overlayVariantClass} ${positionClass} ${isClosing ? styles.overlayClosing : ""}`}
            onClick={handleOverlayClick}
        >
            <div
                className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}