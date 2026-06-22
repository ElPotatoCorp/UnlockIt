import styles from "./gameSummary.module.css";
import { useAuth } from "../../../api/hooks/useAuth.hook";
import { useNavigate } from "react-router-dom";
import type { GameDetail } from "@unlockit/shared";

import HeartIcon from "../../../assets/heart-outlined.svg?react";
import HeartFilledIcon from "../../../assets/heart-filled.svg?react";
import CartIcon from "../../../assets/cart-add.svg?react";

import { useCart } from "../../../api/hooks/useCart.hook";
import { useWishlist } from "../../../api/hooks/useWishlist.hook";
import { useToast } from "../../../utils/hooks/useToast";
import { useModal } from "../../../components/common/modal-provider/ModalProvider";
import { CartModal } from "../../../components/ui/modal/CartModal";
import { Card } from "../../../components/common/card/Card";
import { Button } from "../../../components/common/button/Button";
import { useState } from "react";

interface GameSummaryProps {
    game: GameDetail;
}

export const GameSummary = ({ game }: GameSummaryProps) => {
    const navigate = useNavigate();
    const { isLogged } = useAuth();
    const { addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { success, error, info } = useToast();
    const { openModal, closeModal } = useModal();

    const [wishlisted, setWishlisted] = useState(game.wishlisted ?? false);

    const handleAddToCart = async () => {
        if (!isLogged) return navigate("/login");

        try {
            await addToCart(game.id);

            openModal(
                <CartModal
                    onCheckout={() => closeModal(() => navigate("/checkout"))}
                />,
                {
                    overlay: "blur-dim",
                    position: "center",
                    closeOnOverlay: true,
                    stackMode: "show",
                }
            );
        } catch {
            error("Impossible d'ajouter au panier.");
        }
    };

    const handleToggleWishlist = async () => {
        if (!isLogged) return navigate("/login");

        try {
            if (wishlisted) {
                setWishlisted(false);
                await removeFromWishlist(game.id);
                info("Retiré de votre wishlist.");
            } else {
                setWishlisted(true);
                await addToWishlist(game.id);
                success("Ajouté à votre wishlist.");
            }
        } catch {
            error("Une erreur est survenue.");
        }
    };

    return (
        <Card className={styles.rightColumn}>
            <div className={styles.topRow}>
                <div className={styles.imageContainer}>
                    <img src={game.headerImage} alt={game.name} />
                </div>

                <div className={styles.infoContainer}>
                    <div className={styles.priceWrapper}>
                        {game.price === 0 ? (
                            <span className={styles.priceFree}>Gratuit</span>
                        ) : (
                            <span className={styles.priceDiscount}>
                                {game.price.toFixed(2)} €
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.buttonsRow}>
                <button
                    type="button"
                    className={`${styles.wishlistButton} ${wishlisted ? styles.active : ""}`}
                    onClick={handleToggleWishlist}
                >
                    {wishlisted ? (
                        <HeartFilledIcon className={styles.icon} />
                    ) : (
                        <HeartIcon className={styles.icon} />
                    )}
                </button>

                <Button
                    type="button"
                    className={styles.addButton}
                    onClick={handleAddToCart}
                >
                    <CartIcon className={styles.icon} />
                    <p>Ajouter au panier</p>
                </Button>
            </div>

            <div className={styles.infoBox}>
                <span className={styles.label}>Résumé :</span>
                <p className={styles.value}>{game.shortDescription}</p>
            </div>

            <div className={styles.infoBox}>
                <span className={styles.label}>Date de sortie :</span>
                <p className={styles.value}>{game.releaseDate}</p>
            </div>
        </Card>
    );
};