import { type FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { GameType } from "@unlockit/shared";
import { useGames } from "../../api/hooks/useGames.hook";
import { SearchFilters } from "./search-filters/SearchFilters";
import { SearchResults } from "./search-result/SearchResults";

const Search: FC = () => {
  const { term } = useParams<{ term: string }>();
  const { games, searchGames, fetchGames } = useGames();

  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState<"name" | "price_asc" | "price_desc">("name");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [debouncedTerm] = useDebounce(term, 300);
  const [debouncedSortBy] = useDebounce(sortBy, 300);
  const [debouncedMinPrice] = useDebounce(minPrice, 300);
  const [debouncedMaxPrice] = useDebounce(maxPrice, 300);

  const buildSearchOptions = () => ({
    type: GameType.GAME,
    price:
      debouncedMinPrice || debouncedMaxPrice
        ? {
          min: Number(debouncedMinPrice || 0),
          max: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
        }
        : undefined,
    order: {
      by: (debouncedSortBy === "name" ? "popular" : "price") as "popular" | "price",
      asc: debouncedSortBy !== "price_desc",
    },
  });

  useEffect(() => {
    const options = buildSearchOptions();
    setLoading(true);

    const run = async () => {
      if (!debouncedTerm) {
        await fetchGames(1, 20);
      } else {
        await searchGames(debouncedTerm, options, 1, 20);
      }
      setLoading(false);
    };

    run();
  }, [debouncedTerm, debouncedSortBy, debouncedMinPrice, debouncedMaxPrice]);

  const handleAddToCart = (id: number) => {
    console.log("Add to cart:", id);
  };

  const handleToggleWishlist = (id: number) => {
    console.log("Toggle wishlist:", id);
  };

  return (
    <div>
      <h1>{term ? `Résultats pour "${term}"` : "Tous les jeux"}</h1>

      <div style={{ display: "flex", gap: "2rem" }}>
        <SearchFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        <SearchResults
          games={games?.data || []}
          loading={loading}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      </div>
    </div>
  );
};


export default Search;