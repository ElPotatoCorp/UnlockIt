import { type FC, useEffect, useState } from "react";
import styles from "./cart.module.css";
import { useCart } from "../../api/hooks/useCart.hook";
import { Card } from "../../components/common/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../utils/hooks/useToast";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import { Button } from "../../components/common/button/Button";

const Cart: FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { cart, totalPrice, fetchCart, fetchTotal, addToCart, removeFromCart, toggleItem, clearCart } = useCart();

    const items = cart?.data ?? [];
    const total = totalPrice ?? 0;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await fetchCart();
            await fetchTotal();
            setLoading(false);
        };
        init();
    }, []);

    if (loading) {
        return (
            <div className={styles.cartPage}>
                <h2>Panier</h2>
                <Card>
                    <p className={styles.subtitle}>Chargement du panier...</p>
                </Card>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.cartPage}>
                <h2>Panier</h2>
                <Card>
                    <p className={styles.subtitle}>Ajoutez des jeux pour continuer.</p>
                    <Link to="/store" className={styles.backBtn}>Retour à la boutique</Link>
                </Card>
            </div>
        );
    }

    const handleIncrease = async (id: number) => {
        await addToCart(id, 1);
    };

    const handleDecrease = async (id: number) => {
        await removeFromCart(id, 1);
    };

    const handleToggle = async (id: number, selected: boolean) => {
        await toggleItem(id, !selected);
    };

    const handleClear = async () => {
        await clearCart();
        toast.success("Panier vidé");
    };

    return (
        <div className={styles.cartPage}>
            <h2>Panier</h2>
            <Card>
                <UnlockItHelmet
                    title="Panier"
                    description="Votre panier UnlockIt."
                    path="/cart"
                />

                <p className={styles.subtitle}>Modifiez vos articles avant de passer au paiement.</p>

                <ul className={styles.list}>
                    {items.map((item) => (
                        <li key={item.game.id} className={styles.item}>
                            <div className={styles.left}>
                                <input
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={() => handleToggle(item.game.id, item.selected)}
                                />

                                <img
                                    src={item.game.headerImage}
                                    alt={item.game.name}
                                    className={styles.image}
                                />

                                <div className={styles.info}>
                                    <h4 className={styles.gameName}>{item.game.name}</h4>
                                    <p className={styles.price}>{item.game.price.toFixed(2)} €</p>
                                </div>
                            </div>

                            <div className={styles.right}>
                                <div className={styles.quantity}>
                                    <button onClick={() => handleDecrease(item.game.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleIncrease(item.game.id)}>+</button>
                                </div>

                                <span className={styles.lineTotal}>
                                    {(item.quantity * item.game.price).toFixed(2)} €
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={styles.totalRow}>
                    <span>Total sélectionné :</span>
                    <span className={styles.totalValue}>{total.toFixed(2)} €</span>
                </div> 

                <div className={styles.actions}>
                    <Button onClick={handleClear} variant="danger">Vider le panier</Button>
                    <Button onClick={() => navigate("/checkout")}>Passer au paiement</Button>
                </div>
            </Card>
        </div>
    );
};

export default Cart;