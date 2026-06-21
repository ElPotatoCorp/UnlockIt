import { Link } from "react-router-dom";
import styles from "./purchasedGameCard.module.css";
import type { Purchase } from "@unlockit/shared";
import { Card } from "../../../components/common/card/Card";

interface Props {
    purchase: Purchase;
}

export const PurchasedGameCard = ({ purchase }: Props) => {
    const { game, orderedAt, unitPrice, orderId } = purchase;

    return (
        <Card className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={game.headerImage} alt={game.name} />
            </div>

            <div className={styles.infoWrapper}>
                <h3 className={styles.title}>{game.name}</h3>

                <div className={styles.priceBlock}>
                    <span className={styles.price}>
                        {unitPrice === 0 ? "Gratuit" : `${unitPrice.toFixed(2)} €`}
                    </span>

                    <span className={styles.date}>
                        Acheté le {new Date(orderedAt).toLocaleDateString()}
                    </span>
                </div>

                <div className={styles.actions}>
                    <Link
                        to={`/purchase/${orderId}/${game.id}`}
                        className={styles.viewLink}
                    >
                        Voir l’achat →
                    </Link>
                </div>
            </div>
        </Card>
    );
};
