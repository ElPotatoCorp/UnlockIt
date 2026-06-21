import { Card } from "../../../components/common/card/Card";
import { GamePostReview } from "../../../components/ui/game-post-review/GamePostReview";
import { GameActivationKey } from "./game-activation-key/GameActivationKey";
import { GameExtraInfo } from "./game-extra-info/GameExtraInfo";
import styles from "./gameInformations.module.css";

import type { Purchase, GameDetail } from "@unlockit/shared";

interface GameInformationsProps {
    purchase: Purchase;
    keys: string[];
    game: GameDetail;
}

export const GameInformations = ({ purchase, keys, game }: GameInformationsProps) => {
    return (
        <Card>
            <div className={styles.purchaseId}>
                <p>{purchase.orderId}</p>
            </div>

            <img src={game.headerImage} alt={game.name} className={styles.gameImage} />

            <h2 className={styles.title}>{game.name}</h2>

            <h2 className={styles.subtitle}>
                Acheté le {new Date(purchase.orderedAt).toLocaleDateString()} à{" "}
                {purchase.unitPrice.toFixed(2)}€
            </h2>

            <div className={styles.columns}>
                <div className={styles.leftColumn}>
                    <GameActivationKey
                        orderId={purchase.orderId}
                        gameId={purchase.game.id}
                        keys={keys}
                    />

                    <GameExtraInfo
                        game_id={game.id}
                        short_description={game.shortDescription}
                        platforms={game.platforms}
                    />
                </div>

                <div className={styles.rightColumn}>
                    <GamePostReview purchase={purchase} />
                </div>
            </div>
        </Card>
    );
};