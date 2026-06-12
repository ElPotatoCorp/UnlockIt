import { type FC } from "react";
import { Card } from "../../../components/common/card/Card";
import styles from "./searchFilters.module.css";

interface Props {
    sortBy: "name" | "price_asc" | "price_desc";
    setSortBy: React.Dispatch<React.SetStateAction<"name" | "price_asc" | "price_desc">>;
    minPrice: string;
    setMinPrice: React.Dispatch<React.SetStateAction<string>>;
    maxPrice: string;
    setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchFilters: FC<Props> = ({
    sortBy,
    setSortBy,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
}) => {

    const handleMinChange = (value: string) => {
        const v = Math.max(0, Number(value));
        setMinPrice(String(v));

        if (maxPrice && v >= Number(maxPrice)) {
            setMaxPrice(String(v + 1));
        }
    };

    const handleMaxChange = (value: string) => {
        const v = Math.max(0, Number(value));
        setMaxPrice(String(v));

        if (minPrice && v <= Number(minPrice)) {
            setMinPrice(String(v - 1 >= 0 ? v - 1 : 0));
        }
    };

    return (
        <aside className={styles.sidebar}>
            <Card className={styles.card}>
                <h2 className={styles.title}>Filtres</h2>

                <div className={styles.field}>
                    <label>Trier</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="name">Nom</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Prix min</label>
                    <input
                        type="number"
                        min={0}
                        value={minPrice}
                        onChange={(e) => handleMinChange(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label>Prix max</label>
                    <input
                        type="number"
                        min={0}
                        value={maxPrice}
                        onChange={(e) => handleMaxChange(e.target.value)}
                    />
                </div>
            </Card>
        </aside>
    );
};