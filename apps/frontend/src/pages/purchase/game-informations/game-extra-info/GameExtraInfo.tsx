import styles from "./gameExtraInfo.module.css";
import { Link } from "react-router-dom";

import iconMacOs from "/images/mac-os.png";
import iconLinux from "/images/linux.png";
import iconWindows from "/images/windows.png";

interface GameExtraInfoProps {
    game_id: number;
    short_description: string;
    platforms: Record<string, boolean>; 
}

export const GameExtraInfo = ({
    game_id,
    short_description,
    platforms
}: GameExtraInfoProps) => {

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "windows": return iconWindows;
            case "macos": return iconMacOs;
            case "linux": return iconLinux;
            default: return null;
        }
    };

    const platformList = Object.entries(platforms)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => name);

    return (
        <div className={styles.section}>
            <span className={styles.subtitle}>Informations supplémentaires :</span>

            <div className={styles.box}>
                <span className={styles.label}>Description :</span>

                <div className={styles.valueWrapper}>
                    <span className={styles.value}>{short_description}</span>
                </div>

                <Link to={`/games/${game_id}`} className={styles.link}>
                    Voir la page du jeu
                </Link>

                <span className={styles.label}>Plateformes :</span>

                <ul className={styles.rowList}>
                    {platformList.map((p, i) => (
                        <li key={i} className={styles.platformItem}>
                            {p}
                            {getPlatformIcon(p) && (
                                <img src={getPlatformIcon(p)!} className={styles.platformIcon} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};