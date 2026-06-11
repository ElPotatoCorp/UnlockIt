import { type FC } from "react";
import { SearchGameGrid } from "../search-game-grid/SearchGameGrid";
import { SearchGameCardSkeleton } from "./search-game-card-skeleton/SearchGameCardSkeleton";

interface Props {
    games: any[];
    loading: boolean;
    onAddToCart?: (id: number) => void;
    onToggleWishlist?: (id: number) => void;
}

export const SearchResults: FC<Props> = ({
    games,
    loading,
    onAddToCart,
    onToggleWishlist,
}) => {
    if (loading) {
        return (
            <div style={{
                padding: "2rem", display: "grid", gap: "1.5rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"
            }}>
                <SearchGameCardSkeleton />
                <SearchGameCardSkeleton />
                <SearchGameCardSkeleton />
                <SearchGameCardSkeleton />
            </div>
        );
    }

    if (!games.length) {
        return <p>Aucun résultat</p>;
    }

    return (
        <SearchGameGrid
            games={games}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
        />
    );
};