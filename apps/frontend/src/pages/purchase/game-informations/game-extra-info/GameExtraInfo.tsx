import styles from "./gameExtraInfo.module.css";
import { Link } from "react-router-dom";

import IconWindows from "../../../../assets/windows.svg?react";
import IconMac from "../../../../assets/mac-os.svg?react";
import IconLinux from "../../../../assets/linux.svg?react";
import IconIos from "../../../../assets/ios.svg?react";
import IconAndroid from "../../../../assets/android.svg?react";
import IconSwitch from "../../../../assets/switch.svg?react";
import IconPlayStation from "../../../../assets/playstation.svg?react";
import IconXboxOne from "../../../../assets/xbox-one.svg?react";
import IconXboxSeries from "../../../../assets/xbox-series.svg?react";


interface GameExtraInfoProps {
    game_id: number;
    short_description: string;
    platforms: Record<string, boolean>;
}

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

const VALID_PLATFORMS = [
    "windows", "mac", "linux", "ios", "android",
    "switch", "ps4", "ps5", "xboxOne", "xboxSeries"
];

export const GameExtraInfo = ({
    game_id,
    short_description,
    platforms
}: GameExtraInfoProps) => {

    const enabledPlatforms = VALID_PLATFORMS.filter(
        (key) => platforms[key]
    );

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
        </div>
    );
};