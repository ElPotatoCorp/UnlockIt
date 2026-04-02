import { type FC, useEffect } from "react";
import { ProfileMenu } from "./profile-menu/ProfileMenu";
import styles from "./rightPanel.module.css";

// import cartImg from "/images/cart-logo.png";
import { Link } from "react-router-dom";

// import defaultProfilePic from "/images/default_profile_picture.png";

export const RightPanel: FC = () => {
  const isAuthenticated = true;
  const wallet = 5.0;
  const profilePic = "";
  const defaultProfilePic = "";
  const cartImg = "";

  return (
    <div className={styles.rightPanel}>

      {isAuthenticated && (
        <Link to="/cart" className={styles.imgBasket}>
          <img src={cartImg} className={styles.cart} alt="Panier" />
        </Link>
      )}

      {isAuthenticated && (
        <div className={styles.wallet}>
          {wallet.toFixed(2)} €
        </div>
      )}

      <ProfileMenu
        profilePic={profilePic ?? defaultProfilePic}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};