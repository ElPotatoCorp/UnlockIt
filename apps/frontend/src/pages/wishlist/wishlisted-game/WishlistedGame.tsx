import { type FC } from "react";
import styles from "./wishlistedGame.module.css";
import { Link } from "react-router-dom";
import { useWishlist } from "../../../api/hooks/useWishlist.hook";
import type { SummaryGame } from "@unlockit/shared";
import { Card } from "../../../components/common/card/Card";
import { useToast } from "../../../utils/hooks/useToast";

interface Props {
  game: SummaryGame;
  addedAt?: Date | string | null;
}

export const WishlistedGame: FC<Props> = ({ game, addedAt }) => {
  const { removeFromWishlist } = useWishlist();

  const { success } = useToast();

  const handleRemove = async () => {
    await removeFromWishlist(game.id);
    success(`${game.name} retiré de votre wishlist.`);
  };

  return (
    <Card className={styles.card}>
      <button className={styles.removeButton} onClick={handleRemove}>
        ✕
      </button>

      <div className={styles.imageWrapper}>
        <img src={game.headerImage} alt={game.name} />
      </div>

      <div className={styles.infoWrapper}>
        <h3 className={styles.title}>{game.name}</h3>

        <div className={styles.priceBlock}>
          <span className={styles.price}>
            {game.price === 0 ? "Gratuit" : `${game.price.toFixed(2)} €`}
          </span>

          {addedAt && (
            <span className={styles.addedAt}>
              Ajouté le {new Date().toLocaleDateString()}
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <Link to={`/games/${game.id}`} className={styles.viewLink}>
            Voir le jeu →
          </Link>
        </div>
      </div>
    </Card>
  );
};