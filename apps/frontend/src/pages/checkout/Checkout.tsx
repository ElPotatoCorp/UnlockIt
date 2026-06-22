import { type FC, useEffect, useState } from "react";
import styles from "./checkout.module.css";
import { useCart } from "../../api/hooks/useCart.hook";
import { useWallet } from "../../api/hooks/useWallet.hook";
import { checkoutService } from "../../api/services/checkout.service";
import { Card } from "../../components/common/card/Card";
import { useToast } from "../../utils/hooks/useToast";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../api/hooks/useAuth.hook";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import { useDebounce } from "use-debounce";
import { Button } from "../../components/common/button/Button";

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

    // méthode de paiement sélectionnée
    const [method, setMethod] = useState<"wallet" | "stripe">("wallet");

    /** Debounce du paiement */
    const [debouncedPaying] = useDebounce(paying, 300);

    /** Chargement initial (debounce pour éviter double fetch) */
    useEffect(() => {
        const init = async () => {
            await fetchCart();
            await loadBalance();
            setLoading(false);
        };

        const timeout = setTimeout(init, 150); // léger debounce
        return () => clearTimeout(timeout);
    }, []);

    if (!isLogged) return <Navigate to="/login" replace />;

    if (loading) {
        return (
            <div className={styles.checkoutPage}>
                <h1>Paiement</h1>
                <Card>
                    <p className={styles.subtitle}>Chargement de votre panier...</p>
                </Card>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.checkoutPage}>
                <h1>Paiement</h1>
                <Card>
                    <h2 className={styles.title}>Panier vide</h2>
                    <p className={styles.subtitle}>Ajoutez des jeux avant de passer au paiement.</p>
                    <Link to="/store" className={styles.backBtn}>Retour à la boutique</Link>
                </Card>
            </div>
        );
    }

    /** Paiement */
    const handlePay = async () => {
        if (debouncedPaying) return; // empêche double clic

        // Si l'utilisateur a choisi Stripe (indisponible), on ne lance pas le paiement
        if (method === "stripe") {
            toast.error("Stripe n'est pas disponible pour le moment.");
            return;
        }

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

    /** Paiement réussi */
    if (orderId) {
        return (
            <div className={styles.checkoutPage}>
                <h1>Paiement</h1>
                <Card>
                    <h2 className={styles.title}>Paiement réussi</h2>
                    <p className={styles.subtitle}>Votre commande a été créée avec succès.</p>

                    <Link to={`/orders/${orderId}`} className={styles.successBtn}>
                        Voir la commande
                    </Link>
                </Card>
            </div>
        );
    }

    const walletInsufficient = !balance || balance.balance < total;

    return (
        <div className={styles.checkoutPage}>
            <h1>Paiement</h1>
            <Card>
                <UnlockItHelmet
                    title="Paiement"
                    description="Finalisez votre achat de jeux vidéo sur UnlockIt."
                    path="/checkout"
                />

                <p className={styles.subtitle}>Vérifiez votre commande avant de payer.</p>

                {/* Layout en deux colonnes : résumé à gauche, méthode de paiement à droite */}
                <div className={styles.columns}>
                    {/* Colonne gauche : résumé du panier */}
                    <div className={styles.leftColumn}>
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Résumé du panier</h3>

                            <ul className={styles.list}>
                                {items.map((item) => (
                                    <li key={item.game.id} className={styles.item}>
                                        <div className={styles.left}>
                                            <img
                                                src={item.game.headerImage}
                                                alt={item.game.name}
                                                className={styles.image}
                                            />

                                            <div className={styles.info}>
                                                <h4 className={styles.gameName}>{item.game.name}</h4>
                                                <p className={styles.price}>
                                                    {item.quantity} × {item.game.price.toFixed(2)} €
                                                </p>
                                            </div>
                                        </div>

                                        <span className={styles.lineTotal}>
                                            {(item.quantity * item.game.price).toFixed(2)} €
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className={styles.totalRow}>
                                <span>Total :</span>
                                <span className={styles.totalValue}>{total.toFixed(2)} €</span>
                            </div>
                        </div>

                        <Link to="/cart" className={styles.backBtn}>
                            Retour au panier
                        </Link>
                    </div>

                    {/* Colonne droite : panneau de paiement */}
                    <aside className={styles.rightColumn}>
                        <div className={styles.paymentPanel}>
                            <h3 className={styles.sectionTitle}>Méthode de paiement</h3>

                            <div className={styles.methods}>
                                <label
                                    className={`${styles.method} ${method === "wallet" ? styles.methodActive : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={method === "wallet"}
                                        onChange={() => setMethod("wallet")}
                                    />
                                    <div className={styles.methodInfo}>
                                        <strong>Wallet</strong>
                                        <span className={styles.methodSub}>
                                            Solde : {balance ? balance.balance.toFixed(2) : "0.00"} €
                                        </span>
                                    </div>
                                </label>

                                <label
                                    className={`${styles.method} ${styles.methodDisabled}`}
                                    title="Indisponible pour le moment"
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={method === "stripe"}
                                        onChange={() => setMethod("stripe")}
                                        disabled
                                    />
                                    <div className={styles.methodInfo}>
                                        <strong>Stripe</strong>
                                        <span className={styles.methodSub}>Indisponible</span>
                                    </div>
                                </label>
                            </div>

                            {walletInsufficient && (
                                <p className={styles.warning}>
                                    Votre solde est insuffisant pour payer cette commande.
                                </p>
                            )}

                            <Button
                                disabled={
                                    debouncedPaying ||
                                    method === "stripe" ||
                                    walletInsufficient
                                }
                                onClick={handlePay}
                            >
                                {debouncedPaying ? "Paiement..." : "Payer maintenant"}
                            </Button>

                            <div className={styles.smallNote}>
                                <span>Vous pouvez utiliser votre wallet pour payer immédiatement.</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </Card>
        </div>
    );
};

export default Checkout;