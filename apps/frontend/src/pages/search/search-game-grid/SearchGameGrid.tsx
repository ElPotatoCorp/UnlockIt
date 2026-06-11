import { type FC } from "react";
import { SearchGameCard } from "../search-game-card/SearchGameCard";

interface Props {
  games: any[];
  onAddToCart?: (id: number) => void;
  onToggleWishlist?: (id: number) => void;
}

export const SearchGameGrid: FC<Props> = ({ games, onAddToCart, onToggleWishlist }) => {
  return (
    <div style={{
      display: "grid",
      gap: "1.5rem",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    }}>
      {games.map((g) => (
        <SearchGameCard
          key={g.id}
          game={g}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
};
