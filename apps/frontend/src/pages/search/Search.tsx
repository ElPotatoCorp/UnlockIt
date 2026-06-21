import { type FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { GameType, type SearchBody } from "@unlockit/shared";
import { useGames } from "../../api/hooks/useGames.hook";
import { SearchFilters } from "./search-filters/SearchFilters";
import { SearchResults } from "./search-result/SearchResults";
import { useWishlist } from "../../api/hooks/useWishlist.hook";
import { useAuth } from "../../api/hooks/useAuth.hook";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import { useCart } from "../../api/hooks/useCart.hook";
import styles from "./search.module.css";

const Search: FC = () => {
  const { games, searchGames } = useGames();
  const { isLogged } = useAuth();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const { term } = useParams<{ term: string }>();
  const [filters, setFilters] = useState<SearchBody>({
    order: { by: "popular", asc: true },
    price: undefined,
    type: GameType.GAME,
    tags: [],
    developers: [],
    publishers: [],
    platforms: {},
    release: undefined,
  });
  const [page, setPage] = useState(1);

  const [debouncedTerm] = useDebounce(term, 300);
  const [debouncedFilters] = useDebounce(filters, 300);
  const [debouncedPage] = useDebounce(page, 300);

  const buildSearchOptions = (): SearchBody => {
    const opts: SearchBody = {
      ...debouncedFilters,
      price: debouncedFilters.price?.min || debouncedFilters.price?.max
        ? {
          min: Number(debouncedFilters.price.min || 0),
          max: debouncedFilters.price.max
            ? Number(debouncedFilters.price.max)
            : undefined,
        }
        : undefined,
    };

    if (!opts.tags?.length) delete opts.tags;
    if (!opts.developers?.length) delete opts.developers;
    if (!opts.publishers?.length) delete opts.publishers;

    if (opts.release?.when && !opts.release.date) delete opts.release?.date;

    if (opts.platforms && Object.values(opts.platforms).every((v) => !v))
      delete opts.platforms;

    return opts;
  };

  useEffect(() => {
    const options = buildSearchOptions();
    setLoading(true);

    const run = async () => {
      const slug =
        debouncedTerm && debouncedTerm.trim() !== ""
          ? debouncedTerm
          : "_"; // "tous les jeux"

      await searchGames(slug, options, debouncedPage, 20);

      setLoading(false);
    };

    run();
  }, [debouncedTerm, debouncedPage, debouncedFilters]);

  const handleAddToCart = async (id: number) => {
    if (!isLogged) {
      navigate("/login");
      return;
    }

    try {
      await addToCart(id);
    } catch (err) {
      console.error(`Erreur lors de l'ajout au panier : ${id}`, err);
    }
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
        <SearchFilters filters={filters} setFilters={setFilters} />

        <SearchResults
          games={{
            data: games?.data || [],
            page: games?.page || 1,
            limit: games?.limit || 20,
            total: games?.total || 0,
          }}
          loading={loading}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default Search;