import { Card } from "../../components/common/card/Card";
import styles from "./legal.module.css";

export default function Legal() {
    return (
        <div className={styles.container}>
            <Card className={styles.card} hover={false}>
                <h1>Mentions légales</h1>

                <h2>1. Éditeur du site</h2>
                <p>
                    Le site UnlockIt est édité par <strong>UnlockIt Team</strong>,
                    un collectif de développement basé en France.
                </p>
                <p>
                    Adresse : 12 rue du Pixel, 75001 Paris, France<br />
                    Email : support@unlockit.fr
                </p>

                <h2>2. Hébergeur</h2>
                <p>
                    OVHcloud<br />
                    2 rue Kellermann<br />
                    59100 Roubaix<br />
                    France
                </p>

                <h2>3. Propriété intellectuelle</h2>
                <p>
                    Le logo UnlockIt, l’identité visuelle et le design du site sont la propriété de UnlockIt Team.
                    Les images, logos et marques des jeux appartiennent à leurs éditeurs respectifs.
                </p>

                <h2>4. Responsabilité</h2>
                <p>
                    UnlockIt vend des clés d’activation officielles fournies par des partenaires ou éditeurs.
                    Nous ne sommes pas responsables des interruptions de service des plateformes tierces
                    (Steam, Ubisoft Connect, EA App, etc.) ni des restrictions régionales propres à ces services.
                </p>

                <h2>5. Comptes utilisateurs</h2>
                <p>
                    Les utilisateurs doivent fournir des informations exactes et respecter les règles de la communauté.
                    Les comptes peuvent être suspendus en cas de fraude, d’abus ou de comportement inapproprié.
                </p>

                <h2>6. Contact</h2>
                <p>
                    Pour toute question : <strong>support@unlockit.fr</strong>
                </p>
            </Card>
        </div>
    );
}