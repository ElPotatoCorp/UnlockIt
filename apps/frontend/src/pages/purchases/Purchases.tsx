import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./purchases.module.css";

import { useUser } from "../../api/hooks/useUser.hook";
import { usePurchases } from "../../api/hooks/usePurchases.hook";
import { Card } from "../../components/common/card/Card";
import { useToast } from "../../utils/hooks/useToast";
import { PurchasedGameCard } from "./purchased-game-card/PurchasedGameCard";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";

const Purchases = () => {
    const { user, loadUser } = useUser();
    const { purchases, fetchPurchases } = usePurchases();
    const { error } = useToast();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        const load = async () => {
            try {
                await fetchPurchases(1, 50);
            } catch {
                error("Impossible de charger vos achats.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user]);

    if (!user) {
        return (
            <div className={styles.loginRequiredPage}>
                <h2 className={styles.title}>Connexion requise</h2>

                <section>
                    <p>Vous devez être connecté pour accéder à vos achats.</p>

                    <div className={styles.loginLinks}>
                        <Link to="/login">Se connecter</Link>
                        <Link to="/register">Créer un compte</Link>
                    </div>
                </section>
            </div>
        );
    }

    if (loading) return <p>Chargement…</p>;

    return (
        <div className={styles.wrapper}>
            <UnlockItHelmet
                title="Vos achats"
                description="Historique de vos achats de jeux sur UnlockIt."
                path="/purchases"
            />

            <h2 className={styles.title}>Mes achats</h2>

            <div className={styles.list}>
                {purchases?.data?.length ? (
                    purchases.data.map((purchase) => (
                        <PurchasedGameCard key={purchase.orderId + purchase.game.id} purchase={purchase} />
                    ))
                ) : (
                    <Card>
                        Vous n’avez encore rien acheté.
                        Explorez le <Link to="/">Magasin</Link> pour découvrir des jeux.
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Purchases;