import { type FC } from "react";
import { Card } from "../../../components/common/card/Card";

interface Props {
  game: {
    id: number;
    name: string;
    shortDescription: string;
    price: number;
    headerImage: string;
  };
  onAddToCart?: (gameId: number) => void;
  onToggleWishlist?: (gameId: number) => void;
}

export const SearchGameCard: FC<Props> = ({ game, onAddToCart, onToggleWishlist }) => {
  return (
    <Card hover>
      <img src={game.headerImage} alt={game.name} />

      <h3>{game.name}</h3>

      {/* Description limitée */}
      <p style={{ maxHeight: "60px", overflowY: "auto" }}>
        {game.shortDescription}
      </p>

      {/* Prix formaté */}
      <strong>{game.price.toFixed(2)} €</strong>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button onClick={() => onAddToCart?.(game.id)}>🛒</button>
        <button onClick={() => onToggleWishlist?.(game.id)}>❤️</button>
      </div>
    </Card>
  );
};