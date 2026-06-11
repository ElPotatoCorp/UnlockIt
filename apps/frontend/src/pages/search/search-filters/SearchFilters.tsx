import { type FC } from "react";
import { Card } from "../../../components/common/card/Card";

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
    return (
        <aside style={{ width: "250px" }}>
            <Card>
                <h2>Filtres</h2>

                <div>
                    <label>Trier</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                        <option value="name">Nom</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                    </select>
                </div>

                <div>
                    <label>Prix min</label>
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>

                <div>
                    <label>Prix max</label>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </Card>
        </aside>
    );
};