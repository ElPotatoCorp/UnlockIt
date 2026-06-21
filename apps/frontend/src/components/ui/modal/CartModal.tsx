import { type FC } from "react";
import styles from "./cartModal.module.css";
import { useCart } from "../../../api/hooks/useCart.hook";

interface Props {
    onCheckout: () => void;
}

export const CartModal: FC<Props> = ({ onCheckout }) => {
    const { cart, totalPrice } = useCart();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Panier</h2>

            {!cart?.data?.length && (
                <p className={styles.empty}>Votre panier est vide.</p>
            )}

            {cart?.data?.length ? (
                <div className={styles.items}>
                    {cart.data.map((item) => (
                        <div key={item.game.id} className={styles.item}>
                            <img
                                src={item.game.headerImage}
                                alt={item.game.name}
                                className={styles.image}
                            />

                            <div className={styles.info}>
                                <strong>{item.game.name}</strong>
                                <span>Quantité : {item.quantity}</span>
                                <span>
                                    {item.game.price === 0
                                        ? "Gratuit"
                                        : `${Number(item.game.price).toFixed(2)} €`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            <div className={styles.footer}>
                <strong className={styles.total}>
                    Total : {Number(totalPrice).toFixed(2)} €
                </strong>

                <button className={styles.checkout} onClick={onCheckout}>
                    <p>Aller au paiement</p>
                </button>
            </div>
        </div>
    );
};