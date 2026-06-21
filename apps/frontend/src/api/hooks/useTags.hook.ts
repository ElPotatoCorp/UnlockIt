import { useState } from "react";
import { tagsService } from "../services/tags.service";
import type { GameTag, Paginated } from "@unlockit/shared";

export function useTags() {
    const [tags, setTags] = useState<Paginated<GameTag> | null>(null);

    const fetchTags = async (page = 1, limit = 20) => {
        const data = await tagsService.list(page, limit);
        setTags(data);
    };

    return {
        tags,
        fetchTags
    };
}