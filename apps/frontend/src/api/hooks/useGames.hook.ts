import { useGamesStore } from "../stores/games.store";
import { gamesService } from "../services/games.service";
import type {
    AdvancedSearchGameOptions,
    SearchBody,
} from "@unlockit/shared";

export function useGames() {
    const {
        games,
        selectedGame,
        setGames,
        setSelectedGame,
        clearSelectedGame,
    } = useGamesStore();

    const fetchGames = async (page = 1, limit = 20) => {
        const data = await gamesService.list(page, limit);
        setGames(data);
    };

    const fetchGameById = async (id: number) => {
        const data = await gamesService.getById(id);
        setSelectedGame(data);
    };

    const searchGames = async (
        slug: string,
        options: SearchBody,
        page = 1,
        limit = 20
    ) => {
        const data = await gamesService.search(slug, options, page, limit);
        setGames(data);
    };

    const advancedSearchGames = async (
        slug: string,
        options: AdvancedSearchGameOptions,
        page = 1,
        limit = 20
    ) => {
        const data = await gamesService.advancedSearch(slug, options, page, limit);
        setGames(data);
    };

    return {
        games,
        selectedGame,

        fetchGames,
        fetchGameById,
        searchGames,
        advancedSearchGames,

        clearSelectedGame,
    };
}