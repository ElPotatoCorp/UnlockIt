import { api } from "../axios.instance";

export const authService = {
    login: async (identifier: string, password: string) => {
        try {
            await api.post("/auth/login", { identifier, password });
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 401) throw { message: "Identifiants invalides." };
            if (s === 429) throw { message: "Trop de tentatives. Réessayez plus tard." };
            throw { message: "Erreur serveur." };
        }
    },

    register: async (username: string, email: string, password: string) => {
        try {
            await api.post("/auth/register", { username, email, password });
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 400) throw { message: "Données invalides." };
            if (s === 409) throw { message: "Email ou nom d'utilisateur déjà utilisé." };
            if (s === 429) throw { message: "Trop de tentatives. Réessayez plus tard." };
            throw { message: "Erreur serveur." };
        }
    },

    forgottenPassword: async (identifier: string) => {
        try {
            const res = await api.post("/auth/forgotten-password", { identifier });
            return res.data.resetToken; // DEV ONLY
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 400) throw { message: "Identifiant invalide." };
            if (s === 429) throw { message: "Trop de demandes. Réessayez plus tard." };
            throw { message: "Erreur serveur." };
        }
    },

    resetPassword: async (resetToken: string, password: string) => {
        try {
            await api.post(`/auth/reset-password/${resetToken}`, { password });
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 400) throw { message: "Mot de passe trop faible ou invalide." };
            if (s === 404) throw { message: "Lien de réinitialisation invalide ou expiré." };
            if (s === 422) throw { message: "Utilisateur introuvable." };
            if (s === 429) throw { message: "Trop de tentatives. Réessayez plus tard." };
            throw { message: "Erreur serveur." };
        }
    },

    fetchSession: async () => {
        try {
            const res = await api.get("/auth/me");
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 401) throw { message: "Non authentifié." };
            throw { message: "Erreur serveur." };
        }
    },

    refresh: async () => {
        try {
            await api.post("/auth/refresh");
        } catch (err: any) {
            const s = err.response?.status;

            if (s === 401) throw { message: "Session expirée." };
            throw { message: "Erreur serveur." };
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            throw { message: "Erreur serveur." };
        }
    },
};
