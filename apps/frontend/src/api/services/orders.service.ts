import { api } from "../axios.instance";
import type { Order, OrderSummary, Paginated } from "@unlockit/shared";

export const ordersService = {
    getOrders: async (page = 1, limit = 20): Promise<Paginated<OrderSummary>> => {
        try {
            const res = await api.get("/orders", { params: { page, limit } });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Paramètres invalides." };
            if (s === 401) throw { message: "Non authentifié." };
            throw { message: "Erreur serveur." };
        }
    },

    getOrder: async (id: string): Promise<Order> => {
        try {
            const res = await api.get(`/orders/${id}`);
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "ID invalide." };
            if (s === 401) throw { message: "Non authentifié." };
            if (s === 404) throw { message: "Commande introuvable." };
            throw { message: "Erreur serveur." };
        }
    },
};