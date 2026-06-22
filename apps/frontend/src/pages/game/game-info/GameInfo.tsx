import { Link } from "react-router-dom";
import styles from "./gameInfo.module.css";
import type { GameDetail, GamePlatform } from "@unlockit/shared";

// Import des icônes
import IconWindows from "../../../assets/windows.svg?react";
import IconMac from "../../../assets/mac-os.svg?react";
import IconLinux from "../../../assets/linux.svg?react";
import IconIos from "../../../assets/ios.svg?react";
import IconAndroid from "../../../assets/android.svg?react";
import IconSwitch from "../../../assets/switch.svg?react";
import IconPlayStation from "../../../assets/playstation.svg?react";
import IconXboxOne from "../../../assets/xbox-one.svg?react";
import IconXboxSeries from "../../../assets/xbox-series.svg?react";
import { Card } from "../../../components/common/card/Card";

// Mapping plateforme → icône
const PLATFORM_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    windows: IconWindows,
    mac: IconMac,
    linux: IconLinux,
    ios: IconIos,
    android: IconAndroid,
    switch: IconSwitch,
    ps4: IconPlayStation,
    ps5: IconPlayStation,
    xboxOne: IconXboxOne,
    xboxSeries: IconXboxSeries,
};

type PlatformKey = keyof GamePlatform;

const VALID_PLATFORMS: PlatformKey[] = [
    "windows", "mac", "linux", "ios", "android",
    "switch", "ps4", "ps5", "xboxOne", "xboxSeries"
];


export const GameInfo = ({ game }: { game: GameDetail }) => {
    const enabledPlatforms = VALID_PLATFORMS.filter(
        (key) => game.platforms?.[key]
    );

    return (
        <Card className={styles.card}>
            {/* DESCRIPTION */}
            <div className={styles.infoBlock}>
                <span className={styles.label}>Description :</span>
                <div
                    className={`${styles.value} ${styles.richText}`}
                    dangerouslySetInnerHTML={{ __html: game.detailedDescription }}
                />
            </div>

            {/* CLASSIFICATION */}
            <div className={styles.infoBlock}>
                <span className={styles.label}>Classification :</span>
                <span className={styles.value}>{game.ageRating}</span>
            </div>

            {/* TAGS */}
            <div className={styles.infoBlock}>
                <span className={styles.label}>Tags :</span>
                <ul className={styles.rowList}>
                    {game.tags.map((tag) => (
                        <li key={tag.id}>{tag.name}</li>
                    ))}
                </ul>
            </div>

            {/* PLATEFORMES */}
            <div className={styles.infoBlock}>
                <span className={styles.label}>Plateformes :</span>
                <ul className={styles.rowList}>
                    {enabledPlatforms.map((platform) => {
                        const Icon = PLATFORM_ICONS[platform];
                        return (
                            <li key={platform} className={styles.platformItem}>
                                {platform}
                                {Icon && <Icon className={styles.platformIcon} />}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* LANGUES */}
            <div className={styles.infoBlock}>
                <span className={styles.label}>Langues supportées :</span>
                <ul className={styles.rowList}>
                    {game.supportedLanguages?.map((lang) => (
                        <li key={lang}>{lang.toUpperCase()}</li>
                    ))}
                </ul>
            </div>

            {/* CONFIGURATION PC */}
            {game.pcRequirements && (
                <div className={styles.infoBlock}>
                    <span className={styles.label}>Configuration PC :</span>
                    <div
                        className={`${styles.value} ${styles.richText}`}
                        dangerouslySetInnerHTML={{ __html: game.pcRequirements }}
                    />
                </div>
            )}

            {/* DÉVELOPPEURS */}
            <div className={styles.infoBlock}>
                <span className={styles.label}>Développeur :</span>
                <span className={styles.value}>
                    {game.developers.map((d) => d.name).join(", ")}
                </span>
            </div>

            {/* ÉDITEURS */}
            <div className={styles.infoBlock}>
                <span className={styles.label}>Éditeur :</span>
                <span className={styles.value}>
                    {game.publishers.map((p) => p.name).join(", ")}
                </span>
            </div>

            {/* SITE OFFICIEL */}
            {game.website && (
                <Link
                    to={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    Site officiel →
                </Link>
            )}
        </Card>
    );
};