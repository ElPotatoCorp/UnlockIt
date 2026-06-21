import { type FC, useEffect, useState } from "react";
import styles from "./wishlist.module.css";
import { WishlistedGame } from "./wishlisted-game/WishlistedGame";
import { useWishlist } from "../../api/hooks/useWishlist.hook";
import { useUser } from "../../api/hooks/useUser.hook";
import { Link } from "react-router-dom";
import { useToast } from "../../utils/hooks/useToast.ts";
import { Card } from "../../components/common/card/Card.tsx";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet.tsx";

const Wishlist: FC = () => {
    const { user, loadUser } = useUser();
    const { wishlist, fetchWishlist } = useWishlist();
    const { error } = useToast();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        const load = async () => {
            try {
                await fetchWishlist(1, 50);
            } catch {
                error("Impossible de charger la wishlist.");
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
                    <p>
                        Vous devez être connecté pour accéder à votre liste de souhaits.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <Link to="/login">
                            Se connecter
                        </Link>

                        <Link to="/register">
                            Pas encore de compte ? Créez un compte
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    if (loading) {
        return <p>Chargement…</p>;
    }

    return (
        <div className={styles.historyWrapper}>
            <UnlockItHelmet
                title="Liste de souhaits"
                description="Retrouvez tous les jeux que vous souhaitez acheter sur UnlockIt."
                path="/wishlist"
            />

            <h2 className={styles.title}>Ma liste de souhaits</h2>

            <div className={styles.list}>
                {wishlist?.data?.length ? (
                    wishlist.data.map((item) => {
                        // TODO FIX when api is fixed
                        const game = item.game ?? item;
                        const addedAt = item.addedAt ?? null;

                        return (
                            <WishlistedGame
                                key={game.id}
                                game={game}
                                addedAt={addedAt}
                            />
                        );
                    })
                ) : (
                    <Card>
                        Votre wishlist est vide.
                        Explorez le <Link to="/">Magasin</Link> pour découvrir des jeux,
                        ou utilisez la <Link to="/search">Recherche</Link> pour trouver vos titres préférés.
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Wishlist;