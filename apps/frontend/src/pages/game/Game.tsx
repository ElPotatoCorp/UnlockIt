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
    shortDescription,
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

      <h1 className={styles.title}>{name}</h1>

      <div className={styles.main}>
        <div className={styles.carouselWrapper}>
          <MediaCarousel media={media} />
        </div>

        <div className={styles.summaryWrapper}>
          <GameSummary game={selectedGame} />
        </div>
      </div>

      <GameInfo game={selectedGame} />

      <section className={styles.section}>
        <h2>Commentaires</h2>
        <ReviewsSection gameId={selectedGame.id} />
      </section>
    </div>
  );
};

export default Game;