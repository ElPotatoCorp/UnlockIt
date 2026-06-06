import { Link } from "react-router-dom";
import styles from "./profileMenu.module.css";
import { useState, type FC } from "react";
import { DefaultPfpIcon } from "../../../../../ui/icons/DefaultPfpIcon";
import { PROFILE_LINKS } from "../../../navigation.config";
import { useAuth } from "../../../../../../api/hooks/useAuth.hook";

interface ProfileMenuProps {
  profilePic?: string;
  isLogged: boolean;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({ profilePic, isLogged }) => {
  const [open, setOpen] = useState(false);

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
    <>
      <div id="profile-menu-button" onClick={() => setOpen(!open)} className={styles.profileIcon}>
        {profilePic ? (
          <img src={profilePic} alt="Profil" />
        ) : (
          <DefaultPfpIcon size={40} />
        )}
      </div>

      {open && (
        <div id="profile-menu" className={styles.profileMenu}>
          <ul className={styles.menuList}>
            {isLogged ? (
              PROFILE_LINKS.map(({ to, label, comingSoon, isLogout }) => (
                <li key={label}>
                  {comingSoon ? (
                    <button
                      type="button"
                      className={`${styles.menuItem} ${styles.comingSoon}`}
                      disabled
                    >
                      <span className={styles.menuContent}>
                        <span className={styles.defaultLabel}>{label}</span>
                        <span className={styles.hoverLabel}>Bientôt</span>
                      </span>
                    </button>
                  ) : isLogout ? (
                    <button
                      type="button"
                      id="logout-button"
                      onClick={handleLogout}
                      className={`${styles.menuItem} ${styles.danger}`}
                    >
                      <span className={styles.menuContent}>{label}</span>
                    </button>
                  ) : (
                    <Link id={`${to!.slice(1)}-button`} to={to!} className={styles.menuItem}>
                      <span className={styles.menuContent}>{label}</span>
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li>
                <Link
                  to="/login"
                  className={`${styles.menuItem} ${styles.success}`}
                >
                  <span className={styles.menuContent}>Se connecter</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};