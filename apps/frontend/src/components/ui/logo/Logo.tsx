import { Link } from "react-router-dom";
import styles from "./logo.module.css";

type LogoProps = {
    color?: string;
    size?: number;
    link?: string;
    className?: string;
};

export function Logo({ color = "white", size = 64, link, className }: LogoProps) {
    const height = (size * 77) / 325;

    const svg = (
        <svg
            width={size}
            height={height}
            viewBox="0 0 325 77"
            xmlns="http://www.w3.org/2000/svg"
            className={`${styles.logoSvg} ${className || ""}`}
            style={{ color }}
        >
            <path d="M303 59.5H311V33.5H325V26H311V14.5H303V26H292.5V33.5H303V59.5Z" fill="currentColor" />
            <path d="M178 59.5H201V51.5H178.5C175.5 51.5 175.5 50 175.5 49L175.5 36.5C175.5 34.5 177 33.5 178.5 33.5H201V26H177C171 26 167.5 32.5 167.5 36.5C167.333 40 167.5 43.7846 167.5 49C167.5 56.5 175 59.5 178 59.5Z" fill="currentColor" />
            <path d="M216 59.5H208V11.5H216V59.5Z" fill="currentColor" />
            <path d="M220.5 37C220.5 37 218 38.5 218 40.5C218 42.5 220.5 44.5 220.5 44.5L236 59.5H247.5L228.5 41L247.5 25.5H235L220.5 37Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M273 12.5C274.932 12.5 276 13.567 276 15.5C276 17.433 274.933 18.5 273 18.5C271.067 18.5 270 17.433 270 15.5C270 13.567 271.067 12.5 273 12.5ZM273 14C272.172 14 271.5 14.6716 271.5 15.5C271.5 16.3284 272.172 17 273 17C273.828 17 274.5 16.3284 274.5 15.5C274.5 14.6716 273.828 14 273 14Z" fill="currentColor" />
            <path d="M273.024 4.49999C276.425 4.50552 279.724 5.66735 282.378 7.79393C285.033 9.92057 286.886 12.886 287.633 16.2041C288.381 19.5223 287.978 22.9963 286.492 26.0557C285.095 28.9305 281.318 31.5133 278.5 33V52H284.5V56L278.5 56V60L286.5 60V64L278.5 64V68L284.5 68V72H274.5L274.5 30.5C275.034 30.3522 276.541 29.9226 277.5 29.5C280.87 27.8917 284 23.4826 284 19.5C284 13.9772 278.522 8.5 273 8.5C267.477 8.50028 262 13.9773 262 19.5C262 23.4706 265.147 27.8855 268.5 29.5C269.434 29.9116 270.945 30.343 271.5 30.5V40.5H267.5V33C264.667 31.5053 260.882 28.9062 259.487 26.0117C258.01 22.9476 257.619 19.472 258.377 16.1562C259.136 12.8407 260.998 9.88061 263.66 7.76268C266.321 5.64503 269.623 4.49457 273.024 4.49999Z" fill="currentColor" />
            <path d="M274.5 72H277V76.5H270V69.5H269V73.5H264V68.5H266V60.5H271V57.5H266V59.5H259V52.5H266V49.5H263V42.5H267.5V40.5H271.5L271.5 44.5H270V48.5H274.5L274.5 72Z" fill="url(#paint0_linear_5_206)" />
            <path d="M274.5 72H277V76.5H270V69.5H269V73.5H264V68.5H266V60.5H271V57.5H266V59.5H259V52.5H266V49.5H263V42.5H267.5V40.5H271.5L271.5 44.5H270V48.5H274.5L274.5 72Z" fill="url(#paint1_linear_5_206)" fillOpacity="0.5" />
            <path d="M274.5 72H277V76.5H270V69.5H269V73.5H264V68.5H266V60.5H271V57.5H266V59.5H259V52.5H266V49.5H263V42.5H267.5V40.5H271.5L271.5 44.5H270V48.5H274.5L274.5 72Z" fill="url(#paint2_linear_5_206)" fillOpacity="0.2" />
            <path d="M260 74.5H256V70.5H260V74.5Z" fill="url(#paint3_linear_5_206)" />
            <path d="M260 74.5H256V70.5H260V74.5Z" fill="url(#paint4_linear_5_206)" fillOpacity="0.5" />
            <path d="M260 74.5H256V70.5H260V74.5Z" fill="url(#paint5_linear_5_206)" fillOpacity="0.2" />
            <path d="M263 67.5H259V63.5H263V67.5Z" fill="url(#paint6_linear_5_206)" />
            <path d="M263 67.5H259V63.5H263V67.5Z" fill="url(#paint7_linear_5_206)" fillOpacity="0.5" />
            <path d="M263 67.5H259V63.5H263V67.5Z" fill="url(#paint8_linear_5_206)" fillOpacity="0.2" />
            <path d="M253 66.5H250V63.5H253V66.5Z" fill="url(#paint9_linear_5_206)" />
            <path d="M253 66.5H250V63.5H253V66.5Z" fill="url(#paint10_linear_5_206)" fillOpacity="0.5" />
            <path d="M253 66.5H250V63.5H253V66.5Z" fill="url(#paint11_linear_5_206)" fillOpacity="0.2" />
            <path d="M257 60.5H252V55.5H257V60.5Z" fill="url(#paint12_linear_5_206)" />
            <path d="M257 60.5H252V55.5H257V60.5Z" fill="url(#paint13_linear_5_206)" fillOpacity="0.5" />
            <path d="M257 60.5H252V55.5H257V60.5Z" fill="url(#paint14_linear_5_206)" fillOpacity="0.2" />
            <path d="M250 52.5H246V48.5H250V52.5Z" fill="url(#paint15_linear_5_206)" />
            <path d="M250 52.5H246V48.5H250V52.5Z" fill="url(#paint16_linear_5_206)" fillOpacity="0.5" />
            <path d="M250 52.5H246V48.5H250V52.5Z" fill="url(#paint17_linear_5_206)" fillOpacity="0.2" />
            <path d="M260 49.5H255V44.5H260V49.5Z" fill="url(#paint18_linear_5_206)" />
            <path d="M260 49.5H255V44.5H260V49.5Z" fill="url(#paint19_linear_5_206)" fillOpacity="0.5" />
            <path d="M260 49.5H255V44.5H260V49.5Z" fill="url(#paint20_linear_5_206)" fillOpacity="0.2" />
            <path d="M253 42.5H249V38.5H253V42.5Z" fill="url(#paint21_linear_5_206)" />
            <path d="M253 42.5H249V38.5H253V42.5Z" fill="url(#paint22_linear_5_206)" fillOpacity="0.5" />
            <path d="M253 42.5H249V38.5H253V42.5Z" fill="url(#paint23_linear_5_206)" fillOpacity="0.2" />
            <path d="M263 39.5H259V35.5H263V39.5Z" fill="url(#paint24_linear_5_206)" />
            <path d="M263 39.5H259V35.5H263V39.5Z" fill="url(#paint25_linear_5_206)" fillOpacity="0.5" />
            <path d="M263 39.5H259V35.5H263V39.5Z" fill="url(#paint26_linear_5_206)" fillOpacity="0.2" />
            <path d="M257 32.5H254V29.5H257V32.5Z" fill="url(#paint27_linear_5_206)" />
            <path d="M257 32.5H254V29.5H257V32.5Z" fill="url(#paint28_linear_5_206)" fillOpacity="0.5" />
            <path d="M257 32.5H254V29.5H257V32.5Z" fill="url(#paint29_linear_5_206)" fillOpacity="0.2" />
            <path d="M113 59.5V51.5H109.5C107.5 51.5 106.5 49.5 106.5 47.5V11.5H98.5V45.5C98.5 56 103 59.5 108.5 59.5H113Z" fill="currentColor" />
            <path d="M8 14.5H0V38.5C0 49 10.5 59.5 20 59.5H37.5C43.5 59.5 45 57.5 45 54.5V14.5H37V51.4994H20.3905C13.5 51.5 8 44.5 8 38.0795V14.5Z" fill="currentColor" />
            <path d="M84 59.5H91V41.9C91 34.2 82.7778 26 74.9667 26H60.5778C55.6444 26 53.5 27.9667 53.5 30.1667V59.5H60.5778V32.3671H74.2345C79.9 32.3667 84 37.5 84 42.2083V59.5Z" fill="currentColor" />
            <path d="M140.5 0C154.9 0 158.5 13 158.5 16.5V24.5C156.5 24.6667 152.5 23.5 152.5 22C152.5 17.5 152.5 6.5 140.5 6.5C130 6.5 128.5 15.4997 128.5 18.9297V27.5C132.015 26.8471 136.174 26 140.5 26C152.1 26 163 29.5 163 31.5V56C163 58 154.1 62 140.5 62C126.9 62 118.5 58 118.5 56V31.5C118.5 30.5501 120.002 29.5283 122.5 28.626V17.5C122.5 13.5 126.1 0 140.5 0ZM134.5 51C133.395 52.1046 133 54.5 133 54.5H148C148 54.5 147.605 52.1046 146.5 51C145.5 50 135.5 50 134.5 51ZM140.5 33.5C138.015 33.5 136 35.5147 136 38C136 39.9591 137.253 41.6243 139 42.2422V47.5C139 47.5 138.052 47.4477 137.5 48C136.948 48.5523 137 49.5 137 49.5C137 49.5 139.133 49.5 140.5 49.5C141.867 49.5 144 49.5 144 49.5C144 49.5 144.052 48.5523 143.5 48C142.948 47.4477 142 47.5 142 47.5V42.2422C143.747 41.6243 145 39.9591 145 38C145 35.5147 142.985 33.5 140.5 33.5Z" fill="currentColor" />
            <defs>
                <linearGradient id="paint0_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint1_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint2_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint3_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint4_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint5_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint6_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint7_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint8_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint9_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint10_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint11_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint12_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint13_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint14_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint15_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint16_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint17_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint18_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint19_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint20_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint21_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint22_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint23_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint24_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint25_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint26_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint27_linear_5_206" x1="250.5" y1="26.5625" x2="277.429" y2="75.7002" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1793D7" />
                    <stop offset="0.572115" stopColor="#1F6FEB" />
                    <stop offset="0.764423" stopColor="#00FF9F" />
                </linearGradient>
                <linearGradient id="paint28_linear_5_206" x1="259.5" y1="67.4688" x2="273.063" y2="48.5759" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
                <linearGradient id="paint29_linear_5_206" x1="274.5" y1="61.0938" x2="272.271" y2="54.7999" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00FF9F" />
                    <stop offset="1" stopColor="#1F6FEB" />
                </linearGradient>
            </defs>
        </svg>
    );

    if (link) {
        return (
            <Link
                id="logo"
                to={link}
                className={styles.logoWrapper}
                aria-label="Aller à l'accueil"
            >
                {svg}
            </Link>
        );
    }

    return svg;
}