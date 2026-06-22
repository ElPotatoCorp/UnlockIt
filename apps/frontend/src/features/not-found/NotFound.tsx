import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./notFound.module.css";
import { Card } from "../../components/common/card/Card";
import { Button } from "../../components/common/button/Button";

export const NotFound: FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.notFoundPage}>
            <h1 className={styles.errorCode}>404</h1>

            <Card>
                <div className={styles.cardContent}>
                    <h2>Page introuvable</h2>

                    <p className={styles.message}>
                        Oups... Cette page n’existe pas ou a été déplacée.
                    </p>

                    <Button onClick={() => navigate("/")}>
                        Retour à l’accueil
                    </Button>
                </div>
            </Card>
        </div>
    );
};