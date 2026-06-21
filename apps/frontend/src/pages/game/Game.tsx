import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGames } from "../../api/hooks/useGames.hook";
import styles from "./game.module.css";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import { MediaCarousel } from "./media-carousel/MediaCarousel";
import { GameSummary } from "./game-summary/GameSummary";
import { GameInfo } from "./game-info/GameInfo";
import { ReviewsSection } from "./reviews-section/ReviewsSection";

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedGame, fetchGameById, clearSelectedGame } = useGames();

  useEffect(() => {
    if (id) fetchGameById(Number(id));
    return () => clearSelectedGame();
  }, [id]);

  if (!selectedGame) return <p>Chargement...</p>;

  const {
    name,
    headerImage,
    backgroundImage,
    detailedDescription,
    shortDescription,
    price,
    media,
  } = selectedGame;

  return (
    <div className={styles.page}>
      <UnlockItHelmet
        title={name}
        description={shortDescription}
        path={`/games/${id}`}
        image={headerImage}
        type="article"
      />

      {/* TITRE */}
      <h1 className={styles.title}>{name}</h1>

      {/* SECTION PRINCIPALE */}
      <div className={styles.main}>
        <MediaCarousel media={media} />

        <GameSummary game={selectedGame} />
      </div>

      <GameInfo game={selectedGame} />

      {/* COMMENTAIRES */}
      <section className={styles.section}>
        <h2>Commentaires</h2>
        <ReviewsSection gameId={selectedGame.id} />
      </section>
    </div>
  );
};

export default Game;