import { api } from "../axios.instance";
import type { GameTag, Paginated } from "@unlockit/shared";

export const tagsService = {
    list: async (page = 1, limit = 20): Promise<Paginated<GameTag>> => {
        const res = await api.get("/tags", {
            params: { page, limit }
        });

        return res.data;
    }
};