import { type FC } from "react";
import { Link } from "react-router-dom";
import styles from "./notFound.module.css";
import { Card } from "../../components/common/card/Card";

export const NotFound: FC = () => {
    return (
        <div className={styles.notFoundPage}>
            <h1 className={styles.pageTitle}>Erreur 404</h1>

            <Card className={styles.card}>
                <h2>Page introuvable</h2>

                <p>
                    Oups… Il semble que cette page n’existe pas ou a été déplacée.
                </p>

                <ul>
                    <li>
                        <Link to="/">
                            Retour à l’accueil
                        </Link>
                    </li>
                    <li>
                        <Link to="/login">
                            Connexion
                        </Link>
                    </li>
                </ul>
            </Card>
        </div>
    );
};