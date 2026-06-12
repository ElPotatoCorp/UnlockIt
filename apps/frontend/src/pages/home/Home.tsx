import { useEffect, useState } from "react";
import { useGames } from "../../api/hooks/useGames.hook";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import { GameScroller } from "./game-scroller/GameScroller";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";

const Home = () => {
    const { games, fetchGames } = useGames();
    const [randomGame, setRandomGame] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            await fetchGames(1, 50);
        };
        load();
    }, []);

    useEffect(() => {
        if (games?.data?.length) {
            const random = games.data[Math.floor(Math.random() * games.data.length)];
            setRandomGame(random);
        }
    }, [games]);

    if (!games?.data) return null;

    const popular = games.data.slice(0, 10);
    const tag1 = games.data.slice(10, 20);
    const tag2 = games.data.slice(20, 30);
    const tag3 = games.data.slice(30, 40);
    const tag4 = games.data.slice(40, 50);

    return (
        <div className={styles.home}>

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

            {/* TAGS */}
            <section className={styles.section}>
                <h2>Action</h2>
                <GameScroller
                    items={tag1}
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

            <section className={styles.section}>
                <h2>Aventure</h2>
                <GameScroller
                    items={tag2}
                    speed={32}
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

            <section className={styles.section}>
                <h2>Stratégie</h2>
                <GameScroller
                    items={tag3}
                    speed={28}
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

            <section className={styles.section}>
                <h2>RPG</h2>
                <GameScroller
                    items={tag4}
                    speed={34}
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
        </div>
    );
};

export default Home;