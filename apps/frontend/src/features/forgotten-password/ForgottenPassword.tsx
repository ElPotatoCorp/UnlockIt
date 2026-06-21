import { useState } from "react";
import { useToast } from "../../utils/hooks/useToast";
import { useAuth } from "../../api/hooks/useAuth.hook";
import styles from "./forgotPassword.module.css";
import { Card } from "../../components/common/card/Card";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/button/Button";

const ForgottenPassword = () => {
    const { error, success } = useToast();
    const { forgottenPassword } = useAuth();
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");

    const handleSubmit = async () => {
        try {
            const resetToken = await forgottenPassword(identifier);

            success("Email envoyé !");
            navigate(`/reset-password/${resetToken}`);
        } catch (err: any) {
            error(err.message);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>Mot de passe oublié</h1>

            <Card hover={false}>
                <p className={styles.cardText}>
                    Entrez votre email ou votre pseudo pour recevoir un lien de réinitialisation.
                </p>

                <div className={styles.form}>
                    <label className={styles.label}>Identifiant</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Email ou nom d'utilisateur"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <Button className={styles.button} onClick={handleSubmit}>
                        Envoyer
                    </Button>

                    <p className={styles.disclaimer}>
                        En théorie, vous êtes censé recevoir un email contenant un lien pour
                        réactiver votre compte et changer votre mot de passe.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ForgottenPassword;