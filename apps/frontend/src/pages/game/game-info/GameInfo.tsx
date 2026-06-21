import { Link } from "react-router-dom";
import cardStyles from "../../../styles/card.module.css";
import styles from "./gameInfo.module.css";

/*
import iconMacOs from "/images/mac-os.png";
import iconLinux from "/images/linux.png";
import iconWindows from "/images/windows.png";
*/
const iconMacOs = "";
const iconLinux = "";
const iconWindows = "";

import type { GameDetail } from "@unlockit/shared";

export const GameInfo = ({ game }: { game: GameDetail }) => (
    <div className={cardStyles.card}>
        <div className={cardStyles.cardBox}>

            {/* DESCRIPTION */}
            <span className={cardStyles.cardLabel}>Description :</span>
            <div
                className={`${styles.valueWrapper} ${styles.richText}`}
                dangerouslySetInnerHTML={{ __html: game.detailedDescription }}
            />

            {/* CLASSIFICATION */}
            <span className={cardStyles.cardLabel}>Classification :</span>
            <div className={styles.valueWrapper}>
                <span className={cardStyles.boxValue}>{game.ageRating}</span>
            </div>

            {/* TAGS */}
            <span className={cardStyles.cardLabel}>Tags :</span>
            <ul className={styles.rowList}>
                {game.tags.map((tag) => (
                    <li key={tag.id}>{tag.name}</li>
                ))}
            </ul>

            {/* PLATEFORMES */}
            <span className={cardStyles.cardLabel}>Plateformes :</span>
            <ul className={styles.rowList}>
                {game.platforms?.windows && (
                    <li>
                        Windows <img src={iconWindows} className={styles.platformIcon} />
                    </li>
                )}
                {game.platforms?.mac && (
                    <li>
                        MacOS <img src={iconMacOs} className={styles.platformIcon} />
                    </li>
                )}
                {game.platforms?.linux && (
                    <li>
                        Linux <img src={iconLinux} className={styles.platformIcon} />
                    </li>
                )}
            </ul>

            {/* LANGUES */}
            <span className={cardStyles.cardLabel}>Langues supportées :</span>
            <ul className={styles.rowList}>
                {game.supportedLanguages?.map((lang) => (
                    <li key={lang}>{lang.toUpperCase()}</li>
                ))}
            </ul>

            {/* CONFIGURATION PC */}
            {game.pcRequirements && (
                <>
                    <span className={cardStyles.cardLabel}>Configuration PC :</span>
                    <div
                        className={`${styles.valueWrapper} ${styles.richText}`}
                        dangerouslySetInnerHTML={{ __html: game.pcRequirements }}
                    />
                </>
            )}

            {/* DÉVELOPPEURS */}
            <span className={cardStyles.cardLabel}>Développeur :</span>
            <div className={styles.valueWrapper}>
                <span className={cardStyles.boxValue}>
                    {game.developers.map((d) => d.name).join(", ")}
                </span>
            </div>

            {/* ÉDITEURS */}
            <span className={cardStyles.cardLabel}>Éditeur :</span>
            <div className={styles.valueWrapper}>
                <span className={cardStyles.boxValue}>
                    {game.publishers.map((p) => p.name).join(", ")}
                </span>
            </div>

            {/* SITE OFFICIEL */}
            {game.website && (
                <Link
                    to={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardStyles.cardLink}
                >
                    Site officiel →
                </Link>
            )}
        </div>
    </div>
);