import styles from "./searchPagination.module.css";

interface SearchPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function SearchPagination({ page, totalPages, onChange }: SearchPaginationProps) {
  return (
    <div className={styles.pagination}>
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        {`<`}
      </button>

      <span>
        Page {page} / {totalPages}
      </span>

      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        {`>`}
      </button>
    </div>
  );
}