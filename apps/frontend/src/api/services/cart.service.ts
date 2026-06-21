import { api } from "../axios.instance";
import type { CartItem, Paginated } from "@unlockit/shared";

export const cartService = {
    list: async (page = 1, limit = 20): Promise<Paginated<CartItem>> => {
        try {
            const res = await api.get("/cart", { params: { page, limit } });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Paramètres de pagination invalides." };
            if (s === 401) throw { message: "Non autorisé." };
            throw { message: "Erreur serveur." };
        }
    },

    getTotal: async (): Promise<number> => {
        try {
            const res = await api.get("/cart/total");
            return res.data.total;
        } catch (err: any) {
            if (err.response?.status === 401) throw { message: "Non autorisé." };
            throw { message: "Erreur serveur." };
        }
    },

    add: async (id: number, quantity = 1): Promise<void> => {
        try {
            await api.post(`/cart/${id}`, undefined, { params: { quantity } });
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 404) throw { message: "Jeu introuvable." };
            if (s === 401) throw { message: "Non autorisé." };
            throw { message: "Erreur serveur." };
        }
    },

    remove: async (id: number, quantity = 1): Promise<void> => {
        try {
            await api.delete(`/cart/${id}`, { params: { quantity } });
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 404) throw { message: "Jeu introuvable." };
            if (s === 401) throw { message: "Non autorisé." };
            throw { message: "Erreur serveur." };
        }
    },

    toggle: async (id: number, state?: boolean): Promise<void> => {
        try {
            await api.post(`/cart/${id}/toggle`, undefined, {
                params: state !== undefined ? { state } : {},
            });
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 404) throw { message: "Jeu introuvable." };
            if (s === 401) throw { message: "Non autorisé." };
            throw { message: "Erreur serveur." };
        }
    },

    clear: async (): Promise<void> => {
        try {
            await api.delete("/cart/clear");
        } catch (err: any) {
            if (err.response?.status === 401) throw { message: "Non autorisé." };
            throw { message: "Erreur serveur." };
        }
    },
};