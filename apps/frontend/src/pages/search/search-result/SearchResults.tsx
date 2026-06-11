import { type FC } from "react";
import { SearchGameGrid } from "../search-game-grid/SearchGameGrid";
import Loading from "../../../components/common/loading/Loading";

interface Props {
    games: any[];
    loading: boolean;
    onAddToCart?: (id: number) => void;
    onToggleWishlist?: (id: number) => void;
}

export const SearchResults: FC<Props> = ({ games, loading, onAddToCart, onToggleWishlist }) => {
    if (loading) {
        return (
            <div style={{ padding: "2rem" }}>
                <Loading variant="spinner" size={48} showText text="Chargement..." />
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