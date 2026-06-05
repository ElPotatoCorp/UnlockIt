import { type FC } from "react";
import { Link } from "react-router-dom";
import { ProfileMenu } from "./profile-menu/ProfileMenu";
import { CartIcon } from "../../../../ui/icons/CartIcon";
import styles from "./rightPanel.module.css";
import { useAuth } from "../../../../../api/hooks/useAuth.hook";
import { useUser } from "../../../../../api/hooks/useUser.hook";

export const RightPanel: FC = () => {
  const { session } = useAuth();
  const { user } = useUser();

  const isAuthenticated = Boolean(session && user);
  const wallet = user?.wallet ?? 0;
  const profilePic = user?.avatar ?? "";

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
        <h3>{wallet.toFixed(2)} €</h3>
      )}

      <ProfileMenu
        profilePic={profilePic}
        isLogged={isAuthenticated}
      />
    </div>
  );
};