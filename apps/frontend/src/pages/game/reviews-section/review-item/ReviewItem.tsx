import { useState, useEffect } from "react";
import styles from "./reviewItem.module.css";
import type { Review } from "@unlockit/shared";
import { useReviews } from "../../../../api/hooks/useReviews.hook";
import { ReviewAuthor } from "./ReviewAuthor";

import IconLike from "../../../../assets/like.svg?react";
import IconDislike from "../../../../assets/dislike.svg?react";

import { useDebounce } from "use-debounce";
import { Card } from "../../../../components/common/card/Card";
import { useAuth } from "../../../../api/hooks/useAuth.hook";
import { useNavigate } from "react-router-dom";

interface Props {
    review: Review;
}

export const ReviewItem = ({ review }: Props) => {
    const { voteReview } = useReviews();
    const { isLogged } = useAuth();
    const navigate = useNavigate();


    // Vote actif
    const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);

    // Compteurs instantanés
    const [helpful, setHelpful] = useState(review.helpfulCount);
    const [unHelpful, setUnHelpful] = useState(review.unHelpfulCount);

    // Vote en attente (non débouncé)
    const [pendingVote, setPendingVote] = useState<"like" | "dislike" | null>(null);

    // Valeur débouncée (500ms)
    const [debouncedVote] = useDebounce(pendingVote, 500);

    // Déclenche l'appel API quand la valeur débouncée change
    useEffect(() => {
        if (!debouncedVote) return;

        const sendVote = async () => {
            await voteReview(review.id, debouncedVote === "like");
        };

        sendVote();
    }, [debouncedVote]);

    const handleVote = (helpfulVote: boolean) => {
        if (!isLogged) {
            navigate("/login");
            return;
        }

        const voteType = helpfulVote ? "like" : "dislike";

        if (userVote === voteType) {
            if (voteType === "like") setHelpful((v) => v - 1);
            else setUnHelpful((v) => v - 1);

            setUserVote(null);
            setPendingVote(null);
            return;
        }

        if (userVote === "like" && voteType === "dislike") {
            setHelpful((v) => v - 1);
            setUnHelpful((v) => v + 1);
        } else if (userVote === "dislike" && voteType === "like") {
            setUnHelpful((v) => v - 1);
            setHelpful((v) => v + 1);
        }

        // Cas 3 : premier vote
        if (userVote === null) {
            if (voteType === "like") setHelpful((v) => v + 1);
            else setUnHelpful((v) => v + 1);
        }

        setUserVote(voteType);
        setPendingVote(voteType);
    };

    return (
        <Card>
            <ReviewAuthor userId={review.userId} />

            <p className={styles.content}>{review.content}</p>

            <div className={styles.meta}>
                <span className={styles.rate}>Note : {review.rate}/10</span>
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.actionButton} ${userVote === "like" ? styles.active : ""
                        }`}
                    onClick={() => handleVote(true)}
                >
                    <IconLike className={styles.icon} />
                    <span>{helpful}</span>
                </button>

                <button
                    className={`${styles.actionButton} ${userVote === "dislike" ? styles.active : ""
                        }`}
                    onClick={() => handleVote(false)}
                >
                    <IconDislike className={styles.icon} />
                    <span>{unHelpful}</span>
                </button>
            </div>
        </Card>
    );
};