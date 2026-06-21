import { api } from "../axios.instance";
import type {
    WalletBalance,
    WalletTransaction,
    Paginated
} from "@unlockit/shared";

export const walletService = {
    getBalance: async (): Promise<WalletBalance> => {
        try {
            const res = await api.get("/wallet");
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 401) throw { message: "Non authentifié." };
            throw { message: "Erreur serveur." };
        }
    },

    getTransactions: async (
        page = 1,
        limit = 20
    ): Promise<Paginated<WalletTransaction>> => {
        try {
            const res = await api.get("/wallet/transactions", {
                params: { page, limit },
            });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Paramètres invalides." };
            if (s === 401) throw { message: "Non authentifié." };
            throw { message: "Erreur serveur." };
        }
    },

    topUp: async (amount: number): Promise<WalletBalance> => {
        try {
            const res = await api.post("/wallet/top-up", { amount });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Montant invalide." };
            if (s === 401) throw { message: "Non authentifié." };
            throw { message: "Erreur serveur." };
        }
    },
};