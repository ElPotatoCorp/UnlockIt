import { type FC } from "react";
import { Card } from "../../../components/common/card/Card";
import styles from "./searchFilters.module.css";
import type { SearchBody } from "@unlockit/shared";

interface Props {
    filters: SearchBody;
    setFilters: (f: SearchBody) => void;
}

export const SearchFilters: FC<Props> = ({ filters, setFilters }) => {
    const update = (patch: Partial<SearchBody>) =>
        setFilters({ ...filters, ...patch });

    return (
        <aside className={styles.sidebar}>
            <Card className={styles.card}>
                <h2 className={styles.title}>Filtres</h2>

                {/* TRI */}
                <div className={styles.field}>
                    <label>Trier</label>
                    <select
                        value={filters.order.by}
                        onChange={(e) =>
                            update({
                                order: {
                                    ...filters.order,
                                    by: e.target.value as "popular" | "price",
                                },
                            })
                        }
                    >
                        <option value="popular">Popularité</option>
                        <option value="price">Prix</option>
                    </select>
                </div>

                {/* PRIX */}
                <div className={styles.field}>
                    <label>Prix min</label>
                    <input
                        type="number"
                        value={filters.price?.min ?? ""}
                        onChange={(e) =>
                            update({
                                price: {
                                    ...filters.price,
                                    min: Number(e.target.value),
                                },
                            })
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Prix max</label>
                    <input
                        type="number"
                        value={filters.price?.max ?? ""}
                        onChange={(e) =>
                            update({
                                price: {
                                    min: filters.price?.min ?? 0,
                                    max: Number(e.target.value),
                                },
                            })
                        }
                    />
                </div>

                {/* TAGS */}
                <div className={styles.field}>
                    <label>Tags</label>
                    <input
                        type="text"
                        placeholder="IDs séparés par virgules"
                        onChange={(e) =>
                            update({
                                tags: e.target.value
                                    .split(",")
                                    .map((x) => Number(x.trim()))
                                    .filter(Boolean),
                            })
                        }
                    />
                </div>

                {/* COMING SOON */}
                <div className={styles.field}>
                    <label>Sortie</label>
                    <select
                        value={filters.release?.when ?? ""}
                        onChange={(e) =>
                            update({
                                release: {
                                    when: e.target.value as any,
                                },
                            })
                        }
                    >
                        <option value="">Toutes</option>
                        <option value="coming-soon">À venir</option>
                        <option value="before">Avant une date</option>
                        <option value="after">Après une date</option>
                        <option value="exact">Exacte</option>
                    </select>
                </div>
            </Card>
        </aside>
    );
};