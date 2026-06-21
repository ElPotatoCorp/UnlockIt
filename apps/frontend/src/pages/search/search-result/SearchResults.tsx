import { type FC } from "react";
import { SearchGameCardSkeleton } from "./search-game-card-skeleton/SearchGameCardSkeleton";
import styles from "./searchResults.module.css";
import { SearchGameCard } from "./search-game-card/SearchGameCard";
import type { SummaryGame, Paginated } from "@unlockit/shared";
import { SearchPagination } from "./search-pagination/SearchPagination";

interface Props {
    games: Paginated<SummaryGame>;
    loading: boolean;
    onAddToCart?: (id: number) => void;
    onToggleWishlist?: (id: number) => void;
    onPageChange?: (page: number) => void;
}

export const SearchResults: FC<Props> = ({
    games,
    loading,
    onAddToCart,
    onToggleWishlist,
    onPageChange,
}) => {
    if (loading) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.grid}>
                    <SearchGameCardSkeleton />
                    <SearchGameCardSkeleton />
                    <SearchGameCardSkeleton />
                    <SearchGameCardSkeleton />
                </div>
            </div>
        );
    }

    if (!games.data.length) {
        return <p>Aucun résultat</p>;
    }

    return (
        <div className={styles.wrapper}>
            {onPageChange && (
                <SearchPagination
                    page={games.page}
                    totalPages={Math.ceil(games.total / games.limit)}
                    onChange={onPageChange}
                />
            )}

            <div className={styles.grid}>
                {games.data.map((g) => (
                    <SearchGameCard
                        key={g.id}
                        game={g}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                    />
                ))}
            </div>

            {onPageChange && (
                <SearchPagination
                    page={games.page}
                    totalPages={Math.ceil(games.total / games.limit)}
                    onChange={onPageChange}
                />
            )}
        </div>
    );
};