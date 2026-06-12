import { type FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { GameType } from "@unlockit/shared";
import { useGames } from "../../api/hooks/useGames.hook";
import { SearchFilters } from "./search-filters/SearchFilters";
import { SearchResults } from "./search-result/SearchResults";
import styles from "./search.module.css";
import { useWishlist } from "../../api/hooks/useWishlist.hook";
import { useAuth } from "../../api/hooks/useAuth.hook";

const Search: FC = () => {
  const { term } = useParams<{ term: string }>();
  const { games, searchGames } = useGames();
  const { isLogged } = useAuth();
  const { checkWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

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
      const slug =
        debouncedTerm && debouncedTerm.trim() !== ""
          ? debouncedTerm
          : "_"; // "tous les jeux"

      await searchGames(slug, options, 1, 20);

      setLoading(false);
    };

    run();
  }, [debouncedTerm, debouncedSortBy, debouncedMinPrice, debouncedMaxPrice]);

  const handleAddToCart = (id: number) => {
    console.log("TODO : ADD Cart API frontend layer:", id);
  };

  const handleToggleWishlist = async (gameId: number) => {
    if (!isLogged) {
      navigate("/login");
      return;
    }

    const current = await checkWishlist(gameId);

    if (current) {
      await removeFromWishlist(gameId);
    } else {
      await addToWishlist(gameId);
    }
  };

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.title}>
        {term ? `Résultats pour "${term}"` : "Tous les jeux"}
      </h1>

      <div className={styles.layout}>
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
          onAddToCart={(id) => console.log("Add to cart:", id)}
          onToggleWishlist={(id) => handleToggleWishlist(id)}
        />
      </div>
    </div>
  );
};

export default Search;