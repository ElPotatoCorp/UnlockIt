import { type FC, useState } from "react";
import styles from "./profileMenu.module.css";
import cardStyles from "../../../../../styles/card.module.css";

import { Link } from "react-router-dom";

interface ProfileMenuProps {
  profilePic: string;
  isAuthenticated: boolean;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({ profilePic, isAuthenticated }) => {
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
    <div className={styles.profile}>
      <img
        src={profilePic}
        alt="Profil"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className={styles.profileMenu}>
          <ul className={cardStyles.colList}>
            {isAuthenticated && (
              <>
              <li>
                <Link to="/settings" className={styles.menuLink}>
                  Paramètres
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className={styles.menuLink}>
                  Liste de souhaits
                </Link>
              </li>
              </>
            )}
            <li>
              <Link to="/settings" className={styles.menuLink}>
                Langue
              </Link>
            </li>
            <li>
              <Link to="/settings" className={styles.menuLink}>
                Thème
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
              <Link to="/login" onClick={handleLogout} className={styles.logOutLink}>
                Déconnexion
              </Link>
            </li>
            ) : (
              <li>
                <Link to="/login" className={styles.logInLink}>
                  Connexion
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};