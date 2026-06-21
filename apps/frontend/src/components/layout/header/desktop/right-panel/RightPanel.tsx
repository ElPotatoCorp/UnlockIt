import { useEffect, type FC } from "react";
import { Link } from "react-router-dom";
import { ProfileMenu } from "./profile-menu/ProfileMenu";
import { CartIcon } from "../../../../ui/icons/CartIcon";
import styles from "./rightPanel.module.css";
import { useAuth } from "../../../../../api/hooks/useAuth.hook";
import { useUser } from "../../../../../api/hooks/useUser.hook";
import { useWallet } from "../../../../../api/hooks/useWallet.hook";

export const RightPanel: FC = () => {
  const { session } = useAuth();
  const { user } = useUser();
  const { balance, loadBalance } = useWallet();

  useEffect(() => {
    loadBalance();
  }, []);

  const isAuthenticated = Boolean(session && user);
  const profilePic = user?.avatar ?? "";

  return (
    <div className={styles.rightPanel}>
      {isAuthenticated && (
        <Link
          id="cart"
          to="/cart"
          className={styles.imgBasket}
          aria-label="Voir le panier"
        >
          <div className={styles.cartWrapper}>
            <CartIcon className={styles.cart} size={32} />
          </div>
        </Link>
      )}

      {isAuthenticated && (
        <h3 id="wallet">
          {(balance?.balance ?? 0).toFixed(2)} €
        </h3>
      )}

      <ProfileMenu
        profilePic={profilePic}
        isLogged={isAuthenticated}
      />
    </div>
  );
};