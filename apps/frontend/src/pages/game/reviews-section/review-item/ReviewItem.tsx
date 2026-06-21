import styles from "./reviewItem.module.css";
import type { Review } from "@unlockit/shared";
import { useReviews } from "../../../../api/hooks/useReviews.hook";
import { ReviewAuthor } from "./ReviewAuthor";

interface Props {
    review: Review;
}

export const ReviewItem = ({ review }: Props) => {
    const { voteReview } = useReviews();

    return (
        <div className={styles.card}>
            <ReviewAuthor userId={review.userId} />

            <p className={styles.content}>{review.content}</p>

            <div className={styles.meta}>
                <span className={styles.rate}>Note : {review.rate}/10</span>
                <span>Utile : {review.helpfulCount}</span>
                <span>Pas utile : {review.unHelpfulCount}</span>
            </div>

            <div className={styles.actions}>
                <button onClick={() => voteReview(review.id, true)}>👍 Utile</button>
                <button onClick={() => voteReview(review.id, false)}>👎 Pas utile</button>
            </div>
        </div>
    );
};