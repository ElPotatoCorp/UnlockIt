import { type FC } from "react";
import { SearchGameCardSkeleton } from "./search-game-card-skeleton/SearchGameCardSkeleton";
import styles from "./searchResults.module.css";
import { SearchGameCard } from "./search-game-card/SearchGameCard";
import type { SummaryGame } from "@unlockit/shared";

interface Props {
    games: SummaryGame[];
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
            <div className={styles.grid}>
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
        <div className={styles.grid}>
            {
                games.map((g) => (
                    <SearchGameCard
                        key={g.id}
                        game={g}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                    />
                ))
            }
        </div>
    );
};