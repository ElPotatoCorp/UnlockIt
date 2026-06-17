import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./searchBar.module.css";
import { SearchIcon } from "../../../ui/icons/SearchIcon";
import { slugify } from "@unlockit/shared";

export const SearchBar: FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = query.trim();

    navigate(`/search/${encodeURIComponent(slugify(q))}`, { "replace": true });
  };

  return (
    <form id="searchbar-form" className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Chercher dans le magasin..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" aria-label="Search" className={styles.button}>
        <SearchIcon size={22} color="white" />
      </button>
    </form>
  );
};