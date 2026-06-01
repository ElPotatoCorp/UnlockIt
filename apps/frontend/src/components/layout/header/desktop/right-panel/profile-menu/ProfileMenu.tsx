import { Link } from "react-router-dom";
import styles from "./profileMenu.module.css";
import { useState, type FC } from "react";
import { DefaultPfpIcon } from "../../../../../ui/icons/DefaultPfpIcon";
import { PROFILE_LINKS } from "../../../navigation.config";

interface ProfileMenuProps {
  profilePic?: string;
  isLogged: boolean;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({ profilePic, isLogged }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(!open)} className={styles.profileIcon}>
        {profilePic ? (
          <img src={profilePic} alt="Profil" />
        ) : (
          <DefaultPfpIcon size={40} />
        )}
      </div>
      {open && (
        <div className={styles.profileMenu}>
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
                        <span className={styles.hoverLabel}>Coming Soon</span>
                      </span>
                    </button>
                  ) : isLogout ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`${styles.menuItem} ${styles.danger}`}
                    >
                      <span className={styles.menuContent}>{label}</span>
                    </button>
                  ) : (
                    <Link to={to!} className={styles.menuItem}>
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
                  <span className={styles.menuContent}>
                    Login
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}