import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./hamburgerDrawer.module.css";
import { DefaultPfpIcon } from "../../../../ui/icons/DefaultPfpIcon";
import { NAV_LINKS, PROFILE_LINKS } from "../../navigation.config";
import { useAuth } from "../../../../../api/hooks/useAuth.hook";

interface HamburgerDrawerProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  profilePic?: string;
}

const ChevronIcon: FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HamburgerDrawer: FC<HamburgerDrawerProps> = ({
  open,
  onClose,
  isAuthenticated,
  profilePic,
}) => {
  const [navOpen, setNavOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
      <div className={styles.drawerInner}>

        {/* === Section Navigation === */}
        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => setNavOpen((prev) => !prev)}
            aria-expanded={navOpen}
          >
            <span className={styles.sectionTitle}>Navigation</span>
            <ChevronIcon expanded={navOpen} />
          </button>

          <div className={`${styles.sectionBody} ${navOpen ? styles.sectionBodyOpen : ""}`}>
            <nav className={styles.navLinks}>
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className={styles.navItem} onClick={onClose}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className={styles.divider} />

        {/* === Section Profil === */}
        <div className={styles.section}>
          <button
            data-testid="drawer-profile-section"
            className={styles.sectionHeader}
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
          >
            <div className={styles.profileSectionLeft}>
              <div className={styles.profileAvatar}>
                {profilePic ? (
                  <img src={profilePic} alt="Profil" className={styles.avatarImg} />
                ) : (
                  <DefaultPfpIcon size={28} />
                )}
              </div>
              <span className={styles.sectionTitle}>Profil</span>
            </div>
            <ChevronIcon expanded={profileOpen} />
          </button>

          <div className={`${styles.sectionBody} ${profileOpen ? styles.sectionBodyOpen : ""}`}>
            {isAuthenticated ? (
              <ul className={styles.profileLinks}>
                {PROFILE_LINKS.map(({ to, label, comingSoon, isLogout }) => (
                  <li key={label}>
                    {comingSoon ? (
                      <button
                        type="button"
                        className={`${styles.profileItem} ${styles.comingSoon}`}
                        disabled
                      >
                        <span className={styles.defaultLabel}>{label}</span>
                        <span className={styles.comingSoonBadge}>Bientôt</span>
                      </button>
                    ) : isLogout ? (
                      <button
                        data-testid="logout-button"
                        type="button"
                        className={`${styles.profileItem} ${styles.danger}`}
                        onClick={handleLogout}
                      >
                        {label}
                      </button>
                    ) : (
                      <Link to={to!} className={styles.profileItem} onClick={onClose}>
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.profileLinks}>
                <li>
                  <Link
                    to="/login"
                    className={`${styles.profileItem} ${styles.success}`}
                    onClick={onClose}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};