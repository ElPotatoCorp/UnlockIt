import { type FC, useEffect } from "react";
import { ProfileMenu } from "./profile-menu/ProfileMenu";
import styles from "./rightPanel.module.css";

import { Link } from "react-router-dom";
import { CartIcon } from "./cart-icon/CartIcon";

export const RightPanel: FC = () => {
  const isAuthenticated = true;
  const wallet = 5.0;
  const profilePic = "";

  return (
    <div className={styles.rightPanel}>
      {isAuthenticated && (
        <Link to="/cart" className={styles.imgBasket}>
          <div className={styles.cartWrapper}>
            <CartIcon className={styles.cart} size={32} />
          </div>
        </Link>

      )}

      {isAuthenticated && (
        <h3>
          {wallet.toFixed(2)} €
        </h3>
      )}

      <ProfileMenu
        profilePic={profilePic}
        isLogged={isAuthenticated}
      />
    </div>
  );
};