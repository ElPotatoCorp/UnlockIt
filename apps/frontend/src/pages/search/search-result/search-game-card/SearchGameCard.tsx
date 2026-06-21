import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./searchGameCard.module.css";
import type { SummaryGame } from "@unlockit/shared";

import CartIcon from "../../../../assets/cart-add.svg?react";
import EyeIcon from "../../../../assets/view.svg?react";
import HeartIcon from "../../../../assets/heart-outlined.svg?react";
import HeartFilledIcon from "../../../../assets/heart-filled.svg?react";

interface Props {
  game: SummaryGame;
  onAddToCart?: (id: number) => void;
  onToggleWishlist?: (id: number) => void;
}

export const SearchGameCard: FC<Props> = ({ game, onAddToCart, onToggleWishlist }) => {
  const navigate = useNavigate();

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
        <button onClick={() => onAddToCart?.(game.id)}>
          <CartIcon className={styles.icon} />
        </button>

        <button className={styles.viewButton} onClick={() => navigate(`/games/${game.id}`)}>
          <EyeIcon className={styles.icon} /> <p>Voir</p>
        </button>

        <button
          className={game.wishlisted ? styles.wishActive : styles.wish}
          onClick={() => onToggleWishlist?.(game.id)}
        >
          {game.wishlisted ? <HeartFilledIcon className={styles.icon} /> : <HeartIcon className={styles.icon}/>}
        </button>
      </div>
    </div>
  );
};