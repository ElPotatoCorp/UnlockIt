import { api } from "../axios.instance";
import type { CheckoutResult } from "@unlockit/shared";

export const checkoutService = {
    checkout: async (useWallet: boolean): Promise<CheckoutResult> => {
        try {
            const res = await api.post("/checkout", { useWallet });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 400) throw { message: "Aucun article dans le panier." };
            if (s === 401) throw { message: "Non authentifié." };
            if (s === 404) throw { message: "Utilisateur introuvable." };
            if (s === 409) throw err.response.data;
            if (s === 501) throw { message: "Paiement Stripe non disponible." };

            throw { message: "Erreur serveur." };
        }
    },
};