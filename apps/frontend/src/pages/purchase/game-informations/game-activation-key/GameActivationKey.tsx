import { useState } from "react";
import styles from "./gameActivationKey.module.css";
import iconCopy from "./copy.png";
import { RevealCard } from "../../../../components/ui/reveal-card/RevealCard";
import { purchaseService } from "../../../../api/services/purchase.service";

interface GameActivationKeyProps {
    orderId: string;
    gameId: number;
    keys?: string[];
}

export const GameActivationKey = ({ orderId, gameId }: GameActivationKeyProps) => {
    const [revealed, setRevealed] = useState(false);
    const [keys, setKeys] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchKeys = async () => {
        try {
            setLoading(true);
            const res = await purchaseService.getKeys(orderId, gameId);
            setKeys(res.keys);
        } catch (err: any) {
            setError("Impossible de récupérer la clé.");
        } finally {
            setLoading(false);
        }
    };

    const handleReveal = async () => {
        await fetchKeys();
        setRevealed(true);
    };

    const handleCopy = () => {
        if (keys && keys.length > 0) {
            navigator.clipboard.writeText(keys.join("\n"));
        }
    };

    return (
        <div className={styles.section}>
            <span className={styles.subtitle}>Vos clés d'activation :</span>

            <RevealCard
                buttonLabel="Révéler les clés"
                onReveal={handleReveal}
                hiddenContent={
                    <div className={styles.keyContainer}>
                        {!revealed ? (
                            <div className={styles.placeholder}>
                                XXXXX-XXXXX-XXXXX
                            </div>
                        ) : loading ? (
                            <div className={styles.placeholder}>Chargement…</div>
                        ) : error ? (
                            <div className={styles.placeholder}>{error}</div>
                        ) : keys && keys.length > 0 ? (
                            <div className={styles.keysList}>
                                {keys.map((k, i) => (
                                    <div key={i} className={styles.keyItem}>
                                        {k}
                                    </div>
                                ))}

                                <button className={styles.copyBtn} onClick={handleCopy}>
                                    <img src={iconCopy} className={styles.icon} />
                                </button>
                            </div>
                        ) : (
                            <div className={styles.placeholder}>Aucune clé disponible</div>
                        )}
                    </div>
                }
            />
        </div>
    );
};