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