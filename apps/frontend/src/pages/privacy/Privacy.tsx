import { Card } from "../../components/common/card/Card";
import { UnlockItHelmet } from "../../features/helmet/UnlockItHelmet";
import styles from "./privacy.module.css";

export default function Privacy() {
    return (
        <div className={styles.container}>
            <UnlockItHelmet
                title="Politique de confidentialité"
                description="Découvrez comment UnlockIt protège vos données personnelles et respecte votre vie privée."
                path="/privacy"
                robots="noindex, nofollow"
                type="article"
            />

            <Card className={styles.card} hover={false}>
                <h1>Politique de confidentialité</h1>
                <p>Dernière mise à jour : 2025</p>

                <p>
                    Chez <strong>UnlockIt</strong>, nous attachons une grande importance à la transparence.
                    Nous ne revendons pas vos données, nous ne faisons pas de publicité ciblée,
                    et nous ne collectons que ce qui est strictement nécessaire au fonctionnement du site.
                </p>

                <h2>1. Les informations que nous collectons</h2>
                <p>
                    Lorsque vous créez un compte, nous vous demandons un pseudo, une adresse email et un mot de passe.
                    Le mot de passe est systématiquement chiffré et n’est jamais stocké en clair.
                    Vous pouvez également indiquer votre âge, ce qui est optionnel, mais nécessaire pour afficher les jeux classés 18+.
                </p>

                <p>
                    Lorsque vous utilisez UnlockIt, certaines informations sont enregistrées automatiquement :
                    votre adresse IP (pour la sécurité), votre historique d’achats, votre wishlist,
                    vos avis laissés, votre dernière connexion et, si vous le souhaitez, une courte biographie.
                </p>

                <h2>2. Paiements</h2>
                <p>
                    Les paiements sont gérés par des prestataires externes comme Stripe ou PayPal.
                    UnlockIt ne stocke jamais vos informations bancaires.
                    Nous recevons uniquement la confirmation que le paiement a été validé.
                </p>

                <h2>3. Cookies utilisés</h2>
                <p>
                    Nous utilisons uniquement des cookies essentiels au fonctionnement du site,
                    comme le cookie de session (httpOnly) qui permet de rester connecté,
                    ou un cookie de sécurité pour protéger votre compte.
                    Aucun cookie publicitaire, aucun cookie analytics, aucun suivi externe.
                </p>

                <h2>4. Pourquoi nous collectons ces données</h2>
                <p>
                    Ces informations nous permettent de faire fonctionner votre compte,
                    d’afficher vos jeux achetés, de vous fournir vos clés d’activation,
                    de sécuriser votre accès et d’améliorer votre expérience.
                </p>

                <p>
                    Par exemple, si vous avez acheté plusieurs jeux de rôle,
                    nous pouvons vous suggérer d’autres jeux du même genre.
                    Ces recommandations sont basées uniquement sur vos achats,
                    jamais sur votre navigation ou des données externes.
                </p>

                <h2>5. Où vos données sont stockées</h2>
                <p>
                    Vos données sont hébergées en France, chez OVHcloud (2 rue Kellermann, 59100 Roubaix).
                    Elles ne quittent pas l’Union Européenne.
                </p>

                <h2>6. Vos droits</h2>
                <p>
                    Conformément au RGPD, vous pouvez accéder à vos données, les modifier,
                    demander leur suppression, télécharger une copie de vos informations,
                    ou retirer votre consentement aux emails marketing.
                </p>

                <p>
                    Pour exercer vos droits : <strong>support@unlockit.fr</strong>
                </p>

                <h2>7. Durée de conservation</h2>
                <p>
                    Votre compte reste actif tant que vous l’utilisez.
                    Les achats sont conservés pour des raisons légales.
                    Les cookies essentiels expirent automatiquement à la fin de votre session.
                </p>

                <h2>8. Contact</h2>
                <p>
                    UnlockIt Team<br />
                    12 rue du Pixel, 75001 Paris, France<br />
                    support@unlockit.fr
                </p>
            </Card>
        </div>
    );
}