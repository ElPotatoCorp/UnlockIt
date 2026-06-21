import { useState } from "react";
import styles from "./gamePostReview.module.css";
import { StarRating } from "./star-rating/StarRating";
import { usePurchases } from "../../../../api/hooks/usePurchases.hook";
import type { Purchase } from "@unlockit/shared";

interface GamePostReviewProps {
    purchase: Purchase;
}

export const GamePostReview = ({ purchase }: GamePostReviewProps) => {
    const { createReview, updateReview, deleteReview } = usePurchases();

    const [comment, setComment] = useState(purchase.review?.content ?? "");
    const [rating, setRating] = useState(purchase.review?.rate ?? 0);

    const isEditing = Boolean(purchase.review);

    const handleSubmit = async () => {
        const payload = { content: comment, rate: rating };

        if (isEditing) {
            await updateReview(purchase.orderId, purchase.game.id, payload);
        } else {
            await createReview(purchase.orderId, purchase.game.id, payload);
        }
    };

    const handleDelete = async () => {
        await deleteReview(purchase.orderId, purchase.game.id);
    };

    return (
        <div className={styles.section}>
            <span className={styles.subtitle}>Votre avis sur ce jeu :</span>

            <StarRating value={rating} onChange={setRating} />

            <textarea
                className={styles.textarea}
                placeholder="Écrivez votre avis..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <button className={styles.button} onClick={handleSubmit}>
                {isEditing ? "Modifier" : "Envoyer"}
            </button>

            {isEditing && (
                <button className={`${styles.button} ${styles.delete}`} onClick={handleDelete}>
                    Supprimer
                </button>
            )}
        </div>
    );
};