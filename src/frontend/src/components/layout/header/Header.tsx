import { type FC } from "react";
import styles from "./header.module.css";
import { SearchBar } from "./search-bar/SearchBar";
import { RightPanel } from "./right-panel/RightPanel";
import { TrapezoidMenu } from "./trapezoid-menu/TrapezoidMenu";
import { Logo } from "../../ui/logo/Logo";

export const Header: FC = () => {
  const isDarkMode = true;

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.topRow}>
          <div className={styles.left}>
            <Logo color={isDarkMode ? "white" : "black"} size={140}/>
          </div>

          <div className={styles.center}>
            <SearchBar />
          </div>

          <div className={styles.right}>
            <RightPanel />
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.centerMobile}>
            <SearchBar />
          </div>
        </div>
      </header>

      <TrapezoidMenu />
    </>
  );
};