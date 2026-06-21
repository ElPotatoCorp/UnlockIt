import { api } from "../axios.instance";
import type { Paginated, Review } from "@unlockit/shared";

function handleError(err: any, messages: Record<number, string>): never {
    const status = err?.response?.status;
    if (status && messages[status]) {
        throw new Error(messages[status]);
    }
    throw new Error("Erreur serveur.");
}

export const reviewsService = {
    list: async (gameId: number, page = 1, limit = 20): Promise<Paginated<Review>> => {
        try {
            const res = await api.get(`/games/${gameId}/reviews`, {
                params: { page, limit },
            });
            return res.data;
        } catch (err) {
            handleError(err, {
                400: "Paramètres de pagination invalides.",
            });
        }
    },

    vote: async (reviewId: string, helpful: boolean): Promise<{ helpful: boolean }> => {
        try {
            const res = await api.post(`/reviews/${reviewId}/vote`, { helpful });
            return res.data;
        } catch (err) {
            handleError(err, {
                401: "Vous devez être connecté.",
                403: "Vous ne pouvez pas voter pour votre propre avis.",
            });
        }
    },
};