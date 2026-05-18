import { Link } from "react-router-dom";
import styles from "./profileMenu.module.css";
import { useState, type FC } from "react";
import { DefaultPfpIcon } from "../default-profile-picture/DefaultPfpIcon";

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
              <>
                <li>
                  <Link to="/profile" className={styles.menuItem}>
                    <span className={styles.menuContent}>
                      Profile
                    </span>
                  </Link>
                </li>

                <li>
                  <Link to="/settings" className={styles.menuItem}>
                    <span className={styles.menuContent}>
                      Settings
                    </span>
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    className={`${styles.menuItem} ${styles.comingSoon}`}
                    disabled
                  >
                    <span className={styles.menuContent}>
                      <span className={styles.defaultLabel}>Theme</span>
                      <span className={styles.hoverLabel}>Coming Soon</span>
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className={`${styles.menuItem} ${styles.comingSoon}`}
                    disabled
                  >
                    <span className={styles.menuContent}>
                      <span className={styles.defaultLabel}>Language</span>
                      <span className={styles.hoverLabel}>Coming Soon</span>
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${styles.menuItem} ${styles.danger}`}
                  >
                    <span className={styles.menuContent}>
                      Logout
                    </span>
                  </button>
                </li>
              </>
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