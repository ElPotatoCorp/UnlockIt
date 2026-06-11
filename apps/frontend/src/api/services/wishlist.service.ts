import { api } from "../axios.instance";
import type { Wishlist, Paginated } from "@unlockit/shared";

export const wishlistService = {
    list: async (page = 1, limit = 20): Promise<Paginated<Wishlist>> => {
        try {
            const res = await api.get("/wishlist", { params: { page, limit } });
            return res.data;
        } catch {
            throw { message: "Erreur serveur." };
        }
    },

    isInWishlist: async (gameId: number): Promise<boolean> => {
        try {
            const res = await api.get(`/wishlist/${gameId}`);
            return res.data === true;
        } catch {
            throw { message: "Erreur serveur." };
        }
    },

    add: async (gameId: number): Promise<void> => {
        try {
            await api.post(`/wishlist/${gameId}`);
        } catch {
            throw { message: "Erreur serveur." };
        }
    },

    remove: async (gameId: number): Promise<void> => {
        try {
            await api.delete(`/wishlist/${gameId}`);
        } catch {
            throw { message: "Erreur serveur." };
        }
    },
};