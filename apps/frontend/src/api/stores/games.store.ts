import { create } from "zustand";
import type {
    SummaryGame,
    GameDetail,
    Paginated,
} from "@unlockit/shared";

interface GamesState {
    games: Paginated<SummaryGame> | null;
    selectedGame: GameDetail | null;

    setGames: (data: Paginated<SummaryGame>) => void;
    setSelectedGame: (game: GameDetail) => void;
    clearSelectedGame: () => void;
}

export const useGamesStore = create<GamesState>((set) => ({
    games: null,
    selectedGame: null,

    setGames: (data) => set({ games: data }),
    setSelectedGame: (game) => set({ selectedGame: game }),
    clearSelectedGame: () => set({ selectedGame: null }),
}));