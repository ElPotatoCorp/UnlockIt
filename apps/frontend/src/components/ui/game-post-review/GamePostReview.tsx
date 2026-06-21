import { useState } from "react";
import styles from "./gamePostReview.module.css";
import { StarRating } from "./star-rating/StarRating";
import type { Purchase } from "@unlockit/shared";
import { usePurchases } from "../../../api/hooks/usePurchases.hook";
import { useToast } from "../../../utils/hooks/useToast";

interface GamePostReviewProps {
    purchase: Purchase;
}

export const GamePostReview = ({ purchase }: GamePostReviewProps) => {
    const { createReview, updateReview, deleteReview } = usePurchases();
    const { error, success } = useToast();

    const [comment, setComment] = useState(purchase.review?.content ?? "");
    const [rating, setRating] = useState(purchase.review?.rate ?? 0);
    const [loading, setLoading] = useState(false);

    const isEditing = Boolean(purchase.review);

    const handleSubmit = async () => {
        if (rating === 0) {
            error("Veuillez donner une note.");
            return;
        }

        if (comment.trim().length < 20) {
            error("Votre avis doit contenir au moins 20 caractères.");
            return;
        }

        setLoading(true);

        const payload = { content: comment, rate: rating };

        try {
            if (isEditing) {
                await updateReview(purchase.orderId, purchase.game.id, payload);
                success("Avis modifié !");
            } else {
                await createReview(purchase.orderId, purchase.game.id, payload);
                success("Avis publié !");
            }
        } catch (err: any) {
            error(err.message);
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        await deleteReview(purchase.orderId, purchase.game.id);
        setComment("");
        setRating(0);
        setLoading(false);
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
                maxLength={500}
            />

            <button
                className={styles.button}
                onClick={handleSubmit}
                disabled={loading || rating === 0}
            >
                {isEditing ? "Modifier" : "Envoyer"}
            </button>

            {isEditing && (
                <button
                    className={`${styles.button} ${styles.delete}`}
                    onClick={handleDelete}
                    disabled={loading}
                >
                    Supprimer
                </button>
            )}
        </div>
    );
};