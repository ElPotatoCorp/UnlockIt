import { api } from "../axios.instance";
import type {
    SummaryGame,
    GameDetail,
    Paginated,
    AdvancedSearchGameOptions,
    CreateGame,
    UpdateGame,
    SearchBody,
} from "@unlockit/shared";

export const gamesService = {
    list: async (page = 1, limit = 20): Promise<Paginated<SummaryGame>> => {
        try {
            const res = await api.get("/games", { params: { page, limit } });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Paramètres de pagination invalides." };
            throw { message: "Erreur serveur." };
        }
    },

    getById: async (id: number): Promise<GameDetail> => {
        try {
            const res = await api.get(`/games/${id}`);
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "ID invalide." };
            if (s === 404) throw { message: "Jeu introuvable." };
            throw { message: "Erreur serveur." };
        }
    },

    search: async (
        slug: string,
        options: SearchBody,
        page = 1,
        limit = 20
    ): Promise<Paginated<SummaryGame>> => {
        try {
            const res = await api.post(`/games/search/${slug}`, options, {
                params: { page, limit },
            });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Paramètres de recherche invalides." };
            throw { message: "Erreur serveur." };
        }
    },

    advancedSearch: async (
        slug: string,
        options: AdvancedSearchGameOptions,
        page = 1,
        limit = 20
    ): Promise<Paginated<SummaryGame>> => {
        try {
            const res = await api.post(`/games/search/${slug}`, options, {
                params: { page, limit },
            });
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Paramètres de recherche invalides." };
            throw { message: "Erreur serveur." };
        }
    },

    create: async (payload: CreateGame): Promise<GameDetail> => {
        try {
            const res = await api.post("/games", payload);
            return res.data;
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Données invalides." };
            if (s === 401) throw { message: "Non autorisé." };
            throw { message: "Erreur serveur." };
        }
    },

    update: async (id: number, payload: UpdateGame): Promise<void> => {
        try {
            await api.patch(`/games/${id}`, payload);
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Données invalides." };
            if (s === 401) throw { message: "Non autorisé." };
            if (s === 404) throw { message: "Jeu introuvable." };
            throw { message: "Erreur serveur." };
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`/games/${id}`);
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 401) throw { message: "Non autorisé." };
            if (s === 404) throw { message: "Jeu introuvable." };
            throw { message: "Erreur serveur." };
        }
    },
};