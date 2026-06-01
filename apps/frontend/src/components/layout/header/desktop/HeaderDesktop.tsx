import { type FC } from "react";
import styles from "./headerDesktop.module.css";
import { SearchBar } from "../search-bar/SearchBar";
import { RightPanel } from "./right-panel/RightPanel";
import { Logo } from "../../../ui/logo/Logo";

export const HeaderDesktop: FC = () => {
  const isDarkMode = true;

  return (
    <header className={styles.pageHeader}>
      <div className={styles.topRow}>
        <div className={styles.left}>
          <Logo color={isDarkMode ? "white" : "black"} size={140} link="/" />
        </div>

        <div className={styles.center}>
          <SearchBar />
        </div>

        <div className={styles.right}>
          <RightPanel />
        </div>
      </div>
    </header>
  );
};
