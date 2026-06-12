import { type FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { GameType } from "@unlockit/shared";
import { useGames } from "../../api/hooks/useGames.hook";
import { SearchFilters } from "./search-filters/SearchFilters";
import { SearchResults } from "./search-result/SearchResults";
import { useWishlist } from "../../api/hooks/useWishlist.hook";
import { useAuth } from "../../api/hooks/useAuth.hook";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import styles from "./search.module.css";

const Search: FC = () => {
  const { term } = useParams<{ term: string }>();
  const { games, searchGames } = useGames();
  const { isLogged } = useAuth();
  const { addToWishlist, removeFromWishlist } = useWishlist();
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
    if (!isLogged) {
      navigate("/login");
      return;
    }

    console.log("TODO : ADD Cart API frontend layer:", id);
  };

  const handleToggleWishlist = async (gameId: number) => {
    if (!isLogged) {
      navigate("/login");
      return;
    }

    if (!games?.data) return;

    const updatedGames = [...(games?.data || [])];
    const index = updatedGames.findIndex((g) => g.id === gameId);

    if (index === -1) return;

    const game = updatedGames[index];
    const wasWishlisted = game.wishlisted === true;

    updatedGames[index] = { ...game, wishlisted: !wasWishlisted };
    games.data = updatedGames;

    try {
      if (wasWishlisted) {
        await removeFromWishlist(gameId);
      } else {
        await addToWishlist(gameId);
      }
    } catch {
      updatedGames[index] = { ...game, wishlisted: wasWishlisted };
      games.data = updatedGames;
    }
  };

  return (
    <div className={styles.searchPage}>
      <UnlockItHelmet
        title={term ? `Recherche : ${term}` : "Tous les jeux"}
        description={
          term
            ? `Résultats de recherche pour "${term}" sur UnlockIt. Trouvez vos jeux PC au meilleur prix.`
            : "Découvrez tous les jeux PC disponibles sur UnlockIt."
        }
        path={term ? `/search/${term}` : "/search"}
      />

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
          onAddToCart={(id) => handleAddToCart(id)}
          onToggleWishlist={(id) => handleToggleWishlist(id)}
        />
      </div>
    </div>
  );
};

export default Search;