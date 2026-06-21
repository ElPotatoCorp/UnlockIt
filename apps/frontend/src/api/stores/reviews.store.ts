import { create } from "zustand";
import type { Paginated, Review } from "@unlockit/shared";

interface ReviewsState {
    reviews: Paginated<Review> | null;

    setReviews: (data: Paginated<Review>) => void;
    updateReview: (reviewId: string, update: Partial<Review>) => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
    reviews: null,

    setReviews: (data) => set({ reviews: data }),

    updateReview: (reviewId, update) =>
        set((state) => {
            if (!state.reviews) return state;

            return {
                reviews: {
                    ...state.reviews,
                    data: state.reviews.data.map((r) =>
                        r.id === reviewId ? { ...r, ...update } : r
                    ),
                },
            };
        }),
}));