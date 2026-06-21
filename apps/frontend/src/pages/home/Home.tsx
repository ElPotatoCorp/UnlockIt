import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./home.module.css";

import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import { GameScroller } from "./game-scroller/GameScroller";

import { useGames } from "../../api/hooks/useGames.hook";
import { useTags } from "../../api/hooks/useTags.hook";
import { gamesService } from "../../api/services/games.service";

import type { SummaryGame, GameTag, Paginated } from "@unlockit/shared";

const Home = () => {
    const navigate = useNavigate();

    const { games, fetchGames } = useGames();
    const { tags, fetchTags } = useTags();

    const [randomGame, setRandomGame] = useState<SummaryGame | null>(null);
    const [tagSections, setTagSections] = useState<Record<string, SummaryGame[]>>({});

    // Charger jeux + tags
    useEffect(() => {
        fetchGames(1, 50);
        fetchTags(1, 20);
    }, []);

    // Jeu aléatoire
    useEffect(() => {
        if (games?.data?.length) {
            const random = games.data[Math.floor(Math.random() * games.data.length)];
            setRandomGame(random);
        }
    }, [games]);

    // Sections par tags (4 tags aléatoires)
    useEffect(() => {
        const paginatedTags = tags as Paginated<GameTag> | null;

        if (!paginatedTags?.data?.length) return;

        const load = async () => {
            // Sélectionner 4 tags aléatoires
            const shuffled = [...paginatedTags.data].sort(() => Math.random() - 0.5);
            const selectedTags = shuffled.slice(0, 4);

            const sections: Record<string, SummaryGame[]> = {};

            for (const tag of selectedTags) {
                const slug = "all"; // slug neutre côté backend

                try {
                    const result = await gamesService.search(
                        slug,
                        {
                            tags: [tag.id],
                            order: { by: "popular", asc: false }
                        },
                        1,
                        20
                    );

                    sections[tag.name] = result.data;
                } catch {
                    sections[tag.name] = [];
                }
            }

            setTagSections(sections);
        };

        load();
    }, [tags]);

    if (!games?.data) return null;

    const popular = games.data.slice(0, 10);

    return (
        <div className={styles.home}>
            <UnlockItHelmet title="Accueil" path="/" />

            {/* BANNIÈRE */}
            {randomGame && (
                <div
                    className={styles.banner}
                    style={{ backgroundImage: `url(${randomGame.headerImage})` }}
                    onClick={() => navigate(`/games/${randomGame.id}`)}
                >
                    <div className={styles.bannerContent}>
                        <h1>{randomGame.name}</h1>
                        <p>{randomGame.shortDescription}</p>
                        <button>Voir le jeu</button>
                    </div>
                </div>
            )}

            {/* POPULAIRES */}
            <section className={styles.section}>
                <h2>Populaires</h2>
                <GameScroller
                    items={popular}
                    speed={35}
                    renderItem={(g) => (
                        <div
                            key={g.id}
                            className={styles.card}
                            onClick={() => navigate(`/games/${g.id}`)}
                        >
                            <img src={g.headerImage} alt={g.name} />
                            <h3>{g.name}</h3>
                        </div>
                    )}
                />
            </section>

            {/* SECTIONS PAR TAGS ALÉATOIRES */}
            {Object.entries(tagSections).map(([tagName, items]) => (
                <section className={styles.section} key={tagName}>
                    <h2>{tagName}</h2>
                    <GameScroller
                        items={items}
                        speed={30}
                        renderItem={(g) => (
                            <div
                                key={g.id}
                                className={styles.card}
                                onClick={() => navigate(`/games/${g.id}`)}
                            >
                                <img src={g.headerImage} alt={g.name} />
                                <h3>{g.name}</h3>
                            </div>
                        )}
                    />
                </section>
            ))}
        </div>
    );
};

export default Home;