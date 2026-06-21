import { useReviewsStore } from "../stores/reviews.store";
import { reviewsService } from "../services/reviews.service";

export function useReviews() {
    const { reviews, setReviews, updateReview } = useReviewsStore();

    const fetchReviews = async (gameId: number, page = 1, limit = 20) => {
        const data = await reviewsService.list(gameId, page, limit);
        setReviews(data);
    };

    const voteReview = async (reviewId: string, helpful: boolean) => {
        await reviewsService.vote(reviewId, helpful);

        updateReview(reviewId, {
            helpfulCount: helpful
                ? (reviews?.data.find((r) => r.id === reviewId)?.helpfulCount ?? 0) + 1
                : undefined,
            unHelpfulCount: !helpful
                ? (reviews?.data.find((r) => r.id === reviewId)?.unHelpfulCount ?? 0) + 1
                : undefined,
        });
    };

    return {
        reviews,
        fetchReviews,
        voteReview,
    };
}