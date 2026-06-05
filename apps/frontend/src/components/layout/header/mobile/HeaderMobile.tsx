import { type FC, useState } from "react";
import styles from "./headerMobile.module.css";
import { Logo } from "../../../ui/logo/Logo";
import { SearchBar } from "../search-bar/SearchBar";
import { HamburgerDrawer } from "./hamburger-drawer/HamburgerDrawer";
import { useAuth } from "../../../../api/hooks/useAuth.hook";
import { useUser } from "../../../../api/hooks/useUser.hook";

export const HeaderMobile: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { session } = useAuth();
  const { user } = useUser();

  const isAuthenticated = Boolean(session && user);
  const profilePic = user?.avatar ?? "";

  const isDarkMode = true; // TODO : Thèmes

  return (
    <header className={styles.pageHeader}>
      <div className={styles.topRow}>
        <div className={styles.left}>
          <Logo color={isDarkMode ? "white" : "black"} size={110} link="/" />
        </div>

        <div className={styles.right}>
          <button
            data-testid="header-hamburger-button"
            className={`${styles.hamburger} ${drawerOpen ? styles.open : ""}`}
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-label="Menu"
            aria-expanded={drawerOpen}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <SearchBar />
      </div>

      <HamburgerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        profilePic={profilePic}
      />
    </header>
  );
};