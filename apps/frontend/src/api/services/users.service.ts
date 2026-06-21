import { api } from "../axios.instance";
import type { PublicUser, Paginated } from "@unlockit/shared";
import { normalizeAvatar } from "./user.service";

export const usersService = {
    list: async (page = 1, limit = 20): Promise<Paginated<PublicUser>> => {
        try {
            const res = await api.get("/users", { params: { page, limit } });

            return {
                ...res.data,
                data: res.data.data.map((u: PublicUser) => normalizeAvatar(u)),
            };
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "Paramètres de pagination invalides." };
            throw { message: "Erreur serveur." };
        }
    },

    getById: async (id: string): Promise<PublicUser> => {
        try {
            const res = await api.get(`/users/${id}`);
            return normalizeAvatar(res.data); // <-- normalisation ici
        } catch (err: any) {
            const s = err.response?.status;
            if (s === 400) throw { message: "UUID invalide." };
            if (s === 404) throw { message: "Utilisateur introuvable." };
            throw { message: "Erreur serveur." };
        }
    },
};