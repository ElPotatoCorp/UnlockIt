import { api } from "../axios.instance";
import type { Paginated, Purchase, PurchaseKeys } from "@unlockit/shared";

function handleError(err: any, messages: Record<number, string>): never {
    const status = err?.response?.status;
    if (status && messages[status]) {
        throw new Error(messages[status]);
    }
    throw new Error("Erreur serveur.");
}

export const purchaseService = {
    list: async (page = 1, limit = 20): Promise<Paginated<Purchase>> => {
        try {
            const res = await api.get("/purchases", { params: { page, limit } });
            return res.data;
        } catch (err) {
            handleError(err, {
                400: "Paramètres de pagination invalides.",
            });
        }
    },

    getOne: async (orderId: string, gameId: number): Promise<Purchase> => {
        try {
            const res = await api.get(`/purchases/${orderId}/${gameId}`);
            return res.data;
        } catch (err) {
            handleError(err, {
                400: "Identifiants invalides.",
                404: "Achat introuvable.",
            });
        }
    },

    getKeys: async (orderId: string, gameId: number): Promise<PurchaseKeys> => {
        try {
            const res = await api.get(`/purchases/${orderId}/${gameId}/keys`);
            return res.data;
        } catch (err) {
            handleError(err, {
                400: "Identifiants invalides.",
                404: "Aucun achat trouvé pour récupérer les clés.",
            });
        }
    },

    createReview: async (
        orderId: string,
        gameId: number,
        review: { content: string; rate: number }
    ): Promise<void> => {
        try {
            await api.post(`/purchases/${orderId}/${gameId}/review`, review);
        } catch (err) {
            handleError(err, {
                400: "Données invalides.",
                404: "Achat introuvable.",
                409: "Un avis existe déjà pour cet achat.",
            });
        }
    },

    updateReview: async (
        orderId: string,
        gameId: number,
        review: { content: string; rate: number }
    ): Promise<void> => {
        try {
            await api.patch(`/purchases/${orderId}/${gameId}/review`, review);
        } catch (err) {
            handleError(err, {
                400: "Données invalides.",
                404: "Aucun avis existant pour cet achat.",
            });
        }
    },

    deleteReview: async (orderId: string, gameId: number): Promise<void> => {
        try {
            await api.delete(`/purchases/${orderId}/${gameId}/review`);
        } catch (err) {
            handleError(err, {
                404: "Aucun avis à supprimer.",
            });
        }
    },
};