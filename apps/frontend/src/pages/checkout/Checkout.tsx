import { type FC, useEffect, useState } from "react";
import styles from "./checkout.module.css";
import { useCart } from "../../api/hooks/useCart.hook";
import { useWallet } from "../../api/hooks/useWallet.hook";
import { checkoutService } from "../../api/services/checkout.service";
import { Card } from "../../components/common/card/Card";
import { useToast } from "../../utils/hooks/useToast";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../api/hooks/useAuth.hook";

const Checkout: FC = () => {
    const toast = useToast();
    const { isLogged } = useAuth();

    const { cart, totalPrice, fetchCart, clearCart } = useCart();

    const items = cart?.data ?? [];
    const total = totalPrice ?? 0;

    const { balance, loadBalance } = useWallet();

    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            await fetchCart();
            await loadBalance();
            setLoading(false);
        };
        init();
    }, []);

    if (!isLogged) return <Navigate to="/login" replace />;

    if (loading) {
        return (
            <Card>
                <h2 className={styles.title}>Paiement</h2>
                <p className={styles.subtitle}>Chargement de votre panier...</p>
            </Card>
        );
    }

    if (items.length === 0) {
        return (
            <Card>
                <h2 className={styles.title}>Panier vide</h2>
                <p className={styles.subtitle}>Ajoutez des jeux avant de passer au paiement.</p>
                <Link to="/store" className={styles.backBtn}>Retour à la boutique</Link>
            </Card>
        );
    }

    const handlePay = async () => {
        setPaying(true);
        try {
            const res = await checkoutService.checkout(true);

            setOrderId(res.order.id);
            clearCart();
            loadBalance();

            toast.success("Paiement réussi !");
        } catch (err: any) {
            if (err.items) {
                toast.error("Stock insuffisant pour certains articles.");
            } else {
                toast.error(err.message ?? "Erreur lors du paiement.");
            }
        } finally {
            setPaying(false);
        }
    };

    // Paiement réussi
    if (orderId) {
        return (
            <Card>
                <h2 className={styles.title}>Paiement réussi</h2>
                <p className={styles.subtitle}>Votre commande a été créée avec succès.</p>

                <Link to={`/orders/${orderId}`} className={styles.successBtn}>
                    Voir la commande
                </Link>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className={styles.title}>Paiement</h2>
            <p className={styles.subtitle}>Vérifiez votre commande avant de payer.</p>

            {/* Résumé du panier */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Résumé du panier</h3>

                <ul className={styles.cartList}>
                    {items.map((item) => (
                        <li key={item.game.id} className={styles.cartItem}>
                            <span>{item.game.name}</span>
                            <span>{item.quantity} × {item.game.price.toFixed(2)} €</span>
                        </li>
                    ))}
                </ul>

                <div className={styles.totalRow}>
                    <span>Total :</span>
                    <span className={styles.totalValue}>{total.toFixed(2)} €</span>
                </div>
            </div>

            {/* Wallet */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Wallet</h3>

                <div className={styles.walletBox}>
                    <span>Solde disponible :</span>
                    <span className={styles.walletValue}>
                        {balance ? balance.balance.toFixed(2) : "0.00"} €
                    </span>
                </div>

                {balance && balance.balance < total && (
                    <p className={styles.warning}>
                        Votre solde est insuffisant pour payer cette commande.
                    </p>
                )}
            </div>

            {/* Bouton payer */}
            <button
                className={styles.payBtn}
                disabled={paying || !balance || balance.balance < total}
                onClick={handlePay}
            >
                {paying ? "Paiement..." : "Payer avec le wallet"}
            </button>

            <Link to="/cart" className={styles.backBtn}>
                Retour au panier
            </Link>
        </Card>
    );
};

export default Checkout;