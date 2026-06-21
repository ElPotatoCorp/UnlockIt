import { type FC } from "react";
import { Card } from "../../../components/common/card/Card";
import styles from "./searchFilters.module.css";
import type { SearchBody, GameType, PartialGamePlatform } from "@unlockit/shared";

interface Props {
    filters: SearchBody;
    setFilters: (f: SearchBody) => void;
}

export const SearchFilters: FC<Props> = ({ filters, setFilters }) => {
    const update = (patch: Partial<SearchBody>) =>
        setFilters({ ...filters, ...patch });

    const updatePlatforms = (patch: PartialGamePlatform) =>
        update({
            platforms: {
                ...filters.platforms,
                ...patch,
            },
        });

    return (
        <aside className={styles.sidebar}>
            <Card className={styles.card}>
                <h2 className={styles.title}>Filtres</h2>

                {/* TYPE */}
                <div className={styles.field}>
                    <label>Type</label>
                    <select
                        value={filters.type ?? ""}
                        onChange={(e) =>
                            update({
                                type: e.target.value
                                    ? (e.target.value as GameType)
                                    : undefined,
                            })
                        }
                    >
                        <option value="">Tous</option>
                        <option value="game">Jeu</option>
                        <option value="dlc">DLC</option>
                        <option value="bundle">Bundle</option>
                    </select>
                </div>

                {/* TRI */}
                <div className={styles.field}>
                    <label>Trier par</label>
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

                {/* ASC / DESC */}
                <div className={styles.field}>
                    <label>Ordre</label>
                    <select
                        value={filters.order.asc ? "asc" : "desc"}
                        onChange={(e) =>
                            update({
                                order: {
                                    ...filters.order,
                                    asc: e.target.value === "asc",
                                },
                            })
                        }
                    >
                        <option value="desc">Décroissant</option>
                        <option value="asc">Croissant</option>
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

                {/* DEVELOPERS */}
                <div className={styles.field}>
                    <label>Développeurs</label>
                    <input
                        type="text"
                        placeholder="IDs séparés par virgules"
                        onChange={(e) =>
                            update({
                                developers: e.target.value
                                    .split(",")
                                    .map((x) => Number(x.trim()))
                                    .filter(Boolean),
                            })
                        }
                    />
                </div>

                {/* PUBLISHERS */}
                <div className={styles.field}>
                    <label>Éditeurs</label>
                    <input
                        type="text"
                        placeholder="IDs séparés par virgules"
                        onChange={(e) =>
                            update({
                                publishers: e.target.value
                                    .split(",")
                                    .map((x) => Number(x.trim()))
                                    .filter(Boolean),
                            })
                        }
                    />
                </div>

                {/* RELEASE WHEN */}
                <div className={styles.field}>
                    <label>Sortie</label>
                    <select
                        value={filters.release?.when ?? ""}
                        onChange={(e) =>
                            update({
                                release: e.target.value
                                    ? { when: e.target.value as any }
                                    : undefined,
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

                {/* RELEASE DATE */}
                {filters.release?.when &&
                    filters.release.when !== "coming-soon" && (
                        <div className={styles.field}>
                            <label>Date</label>
                            <input
                                type="date"
                                onChange={(e) =>
                                    update({
                                        release: {
                                            ...filters.release,
                                            date: e.target.value
                                                ? new Date(e.target.value)
                                                : undefined,
                                        },
                                    })
                                }
                            />
                        </div>
                    )}

                {/* PLATFORMS */}
                <div className={styles.field}>
                    <label>Plateformes</label>

                    {[
                        "windows",
                        "mac",
                        "linux",
                        "ios",
                        "android",
                        "switch",
                        "ps4",
                        "ps5",
                        "xboxOne",
                        "xboxSeries",
                    ].map((platform) => (
                        <label key={platform}>
                            <input
                                type="checkbox"
                                checked={
                                    (filters.platforms as any)?.[platform] ??
                                    false
                                }
                                onChange={(e) =>
                                    updatePlatforms({
                                        [platform]: e.target.checked,
                                    } as any)
                                }
                            />
                            {platform}
                        </label>
                    ))}
                </div>
            </Card>
        </aside>
    );
};