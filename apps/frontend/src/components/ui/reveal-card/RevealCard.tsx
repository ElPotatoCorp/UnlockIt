import React, { useState, type ReactNode } from "react";
import styles from "./revealCard.module.css";

interface RevealCardProps {
    hiddenContent: ReactNode;
    buttonLabel: string;
    onReveal?: () => void | Promise<void>;
}

export const RevealCard: React.FC<RevealCardProps> = ({ hiddenContent, buttonLabel, onReveal }) => {
    const [revealed, setRevealed] = useState(false);

    const handleReveal = async () => {
        if (onReveal) {
            await onReveal(); // fonctionne même si onReveal retourne void
        }
        setRevealed(true);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.contentWrapper}>
                <div className={`${styles.hiddenContent} ${revealed ? styles.revealed : ""}`}>
                    {hiddenContent}
                </div>

                {!revealed && (
                    <button className={styles.revealButton} onClick={handleReveal}>
                        {buttonLabel}
                    </button>
                )}
            </div>
        </div>
    );
};