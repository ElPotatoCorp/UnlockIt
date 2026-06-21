import cardStyles from "../../../styles/card.module.css";
import styles from "./gameSummary.module.css";
import { useAuth } from "../../../api/hooks/useAuth.hook";
import { useNavigate } from "react-router-dom";
import type { GameDetail } from "@unlockit/shared";

// import iconHeart from "/images/heart.png";
// import iconCart from "/images/cart.png";
const iconHeart = "❤️";
const iconCart = "🛒";

interface GameSummaryProps {
    game: GameDetail;
}

export const GameSummary = ({ game }: GameSummaryProps) => {
    const navigate = useNavigate();
    const { isLogged } = useAuth();

    const handleWishlistToggle = () => {
        if (!isLogged) {
            navigate("/login");
            return;
        }

        console.log("TODO: add to wishlist", game.id);
    };

    const handleAddToCart = async () => {
        if (!isLogged) {
            navigate("/login");
            return;
        }

        console.log("TODO: add to cart", game.id);
    };

    return (
        <div className={`${styles.rightColumn} ${cardStyles.card}`}>
            <div className={styles.topRow}>
                <div className={styles.imageContainer}>
                    <img src={game.headerImage} alt={game.name} />
                </div>

                <div className={styles.infoContainer}>
                    <div className={styles.metaRow}>
                        <div className={styles.priceWrapper}>
                            {game.price === 0 ? (
                                <span className={styles.priceFree}>Gratuit</span>
                            ) : (
                                <span className={styles.priceDiscount}>{game.price.toFixed(2)} €</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.buttonsRow}>
                <button
                    type="button"
                    className={`${cardStyles.cardButton} ${styles.wishlistButton} ${game.wishlisted ? styles.active : ""}`}
                    onClick={handleWishlistToggle}
                >
                    <img
                        src={iconHeart}
                        className={`${styles.icon} ${game.wishlisted ? styles.iconActive : styles.iconInvert}`}
                        alt=""
                    />
                </button>

                <button
                    type="button"
                    className={`${cardStyles.cardButton} ${styles.addButton}`}
                    onClick={handleAddToCart}
                >
                    <img src={iconCart} className={styles.icon} alt="" />
                    Ajouter au panier
                </button>
            </div>

            <div className={cardStyles.cardBox}>
                <span className={cardStyles.cardLabel}>Résumé :</span>
                <div className={styles.valueWrapper}>
                    <span className={cardStyles.boxValue}>{game.shortDescription}</span>
                </div>
            </div>

            <div className={cardStyles.cardBox}>
                <span className={cardStyles.cardLabel}>Date de sortie :</span>
                <div className={styles.valueWrapper}>
                    <span className={cardStyles.boxValue}>{game.releaseDate}</span>
                </div>
            </div>
        </div>
    );
};