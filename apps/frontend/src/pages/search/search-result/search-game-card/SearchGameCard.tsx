import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../../api/hooks/useWishlist.hook";
import styles from "./searchGameCard.module.css";

interface Props {
  game: {
    id: number;
    name: string;
    shortDescription: string;
    price: number;
    headerImage: string;
  };
  onAddToCart?: (id: number) => void;
  onToggleWishlist?: (id: number) => void;
}

export const SearchGameCard: FC<Props> = ({ game, onAddToCart, onToggleWishlist }) => {
  const navigate = useNavigate();
  const { isInWishlist, checkWishlist } = useWishlist();

  useEffect(() => {
    checkWishlist(game.id);
  }, [game.id]);

  return (
    <div
      className={styles.card}
      style={{ "--bg-image": `url(${game.headerImage})` } as React.CSSProperties}
    >
      <div className={styles.imageWrapper}>
        <img src={game.headerImage} alt={game.name} className={styles.image} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{game.name}</h3>
        <p className={styles.description}>{game.shortDescription}</p>
      </div>

      <strong className={styles.price}>
        {game.price === 0 ? "Gratuit" : `${game.price.toFixed(2)} €`}
      </strong>

      <div className={styles.actions}>
        <button onClick={() => onAddToCart?.(game.id)}>🛒</button>
        <button className={styles.viewButton} onClick={() => navigate(`/games/${game.id}`)}>👁 Voir</button>
        <button
          className={isInWishlist ? styles.wishActive : styles.wish}
          onClick={() => onToggleWishlist?.(game.id)}
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};