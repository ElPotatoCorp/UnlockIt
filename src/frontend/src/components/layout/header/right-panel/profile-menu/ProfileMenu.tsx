import { type FC, useState } from "react";
import styles from "./profileMenu.module.css";
import cardStyles from "../../../../../styles/card.module.css";

import { Link } from "react-router-dom";
import { DefaultPfpIcon } from "../default-profile-picture/DefaultPfpIcon";

interface ProfileMenuProps {
  profilePic?: string;
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
      <div onClick={() => setOpen(!open)}>
        {profilePic ? (
          <img src={profilePic} alt="Profil" />
        ) : (
          <DefaultPfpIcon size={40} />
        )}
      </div>

      {open && (
        <div className={styles.profileMenu}>
          <ul className={cardStyles.colList}>
            {isAuthenticated && (
              <>
                <li><Link to="/settings">Paramètres</Link></li>
                <li><Link to="/wishlist">Liste de souhaits</Link></li>
              </>
            )}

            <li><Link to="/settings">Langue</Link></li>
            <li><Link to="/settings">Thème</Link></li>

            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout} className={styles.logOutLink}>
                  Déconnexion
                </button>
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
