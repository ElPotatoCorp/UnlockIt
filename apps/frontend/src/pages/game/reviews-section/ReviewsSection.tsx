import { useEffect } from "react";
import styles from "./reviewsSection.module.css";

import { useReviews } from "../../../api/hooks/useReviews.hook";
import { ReviewItem } from "./review-item/ReviewItem";

interface Props {
    gameId: number;
}

export const ReviewsSection = ({ gameId }: Props) => {
    const { reviews, fetchReviews } = useReviews();

    useEffect(() => {
        fetchReviews(gameId, 1, 20);
    }, [gameId]);

    if (!reviews) return <p>Chargement des avis…</p>;

    return (
        <div className={styles.wrapper}>
            {/* LISTE DES REVIEWS */}
            <div className={styles.list}>
                {reviews.data.length === 0 ? (
                    <p>Aucun avis pour ce jeu pour le moment.</p>
                ) : (
                    reviews.data.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))
                )}
            </div>
        </div>
    );
};