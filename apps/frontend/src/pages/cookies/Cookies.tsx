import { Card } from "../../components/common/card/Card";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import styles from "./cookies.module.css";

export default function Cookies() {
    return (
        <div className={styles.container}>
            <UnlockItHelmet
                title="Politique Cookies"
                description="Découvrez comment UnlockIt utilise uniquement des cookies essentiels, sans tracking ni publicité."
                path="/cookies"
                robots="noindex, nofollow"
                type="article"
            />

            <Card className={styles.card} hover={false}>
                <h1>Politique Cookies</h1>

                <p>
                    UnlockIt utilise uniquement des cookies essentiels au fonctionnement du site.
                    Nous ne faisons aucun suivi publicitaire ou analytique.
                </p>

                <h2>1. Cookies essentiels</h2>
                <p>
                    Le cookie de session permet de rester connecté et est automatiquement supprimé
                    lorsque vous vous déconnectez. Il est protégé en httpOnly, ce qui signifie
                    qu’il n’est pas accessible par JavaScript.
                </p>

                <p>
                    Un cookie de sécurité peut également être utilisé pour protéger votre compte
                    contre certaines attaques (comme le CSRF).
                </p>

                <h2>2. Aucun cookie non essentiel</h2>
                <p>
                    Nous n’utilisons pas de cookies publicitaires, pas de cookies analytics,
                    et aucun cookie tiers. Votre navigation n’est pas suivie.
                </p>

                <h2>3. Pourquoi si peu de cookies ?</h2>
                <p>
                    Parce que nous voulons un site simple, respectueux de la vie privée
                    et sans tracking inutile. Les recommandations de jeux sont basées
                    uniquement sur vos achats, jamais sur votre navigation.
                </p>

                <h2>4. Consentement</h2>
                <p>
                    Comme nous n’utilisons que des cookies essentiels, aucune bannière de consentement
                    n’est nécessaire.
                </p>

                <h2>5. Contact</h2>
                <p>
                    Pour toute question : <strong>support@unlockit.fr</strong>
                </p>
            </Card>
        </div>
    );
}