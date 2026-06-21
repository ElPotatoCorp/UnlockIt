import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./purchasePage.module.css";

import { usePurchases } from "../../api/hooks/usePurchases.hook";
import { useGames } from "../../api/hooks/useGames.hook";

import { NotFound } from "../../features/not-found/NotFound";
import { GameInformations } from "./game-informations/GameInformations";

import type { Purchase } from "@unlockit/shared";

const Purchase = () => {
    const { orderId, gameId } = useParams<{ orderId: string; gameId: string }>();

    const { fetchPurchase, fetchKeys } = usePurchases();
    const { fetchGameById, selectedGame } = useGames();

    const [purchase, setPurchase] = useState<Purchase | null>(null);
    const [keys, setKeys] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId || !gameId) return;

        const load = async () => {
            try {
                const p = await fetchPurchase(orderId, Number(gameId));
                setPurchase(p);

                const k = await fetchKeys(orderId, Number(gameId));
                setKeys(k.keys);

                await fetchGameById(Number(gameId));
            } catch (err: any) {
                setError(err.message);
            }
        };

        load();
    }, [orderId, gameId]);

    if (error === "Achat introuvable.") return <NotFound />;
    if (!purchase || !selectedGame) return <p className={styles.loading}>Chargement…</p>;

    return (
        <div className={styles.pageContent}>
            <GameInformations
                purchase={purchase}
                keys={keys}
                game={selectedGame}
            />
        </div>
    );
};

export default Purchase;