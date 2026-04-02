import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./searchBar.module.css";
import { slugify } from "../../../../utils/formatters/slug.formatter";

export const SearchBar: FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = query.trim();
    if (!q) return;

    navigate(`/search/${encodeURIComponent(slugify(q))}`);
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Chercher dans le magasin..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.button}>
        <img src="/images/search-logo.png" alt="Rechercher" />
      </button>
    </form>
  );
};