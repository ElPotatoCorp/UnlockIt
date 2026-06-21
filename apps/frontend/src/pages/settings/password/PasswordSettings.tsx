import { type FC, type FormEvent, useState } from "react";
import cardStyles from "../../../styles/card.module.css";
import styles from "./passwordSettings.module.css";
import { useUser } from "../../../api/hooks/useUser.hook";

export const PasswordSettings: FC = () => {
  const { saveUser } = useUser();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[\W_]/.test(password);

  const isStrong = hasMinLength && hasLower && hasUpper && hasDigit && hasSymbol;
  const isMatch = password.length > 0 && password === confirm;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isStrong || !isMatch) return;

    setStatus("loading");
    try {
      await saveUser({ password });
      setStatus("success");
      setPassword("");
      setConfirm("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Une erreur est survenue côté serveur");
    }
  };

  return (
    <section className={cardStyles.card}>
      <h2 className={cardStyles.cardTitle}>Mot de passe</h2>
      <p className={cardStyles.cardText}>
        Redéfinissez un mot de passe robuste pour protéger votre compte.
      </p>
      <p className={cardStyles.cardText}>
        Il doit contenir au minimum 8 caractères, avec des minuscules, majuscules, chiffres et symboles.
      </p>

      <form className={cardStyles.cardForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <label htmlFor="newPassword" className={cardStyles.cardLabel}>
            Nouveau mot de passe
          </label>

          <div className={styles.inputField}>
            <input
              id="newPassword"
              type={show ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cardStyles.cardInput}
            />
            <button type="button" className={styles.toggleBtn} onClick={() => setShow(!show)}>
              {show ? (
                <img src="/images/password_hidden.png" alt="Masquer" className={styles.icon} />
              ) : (
                <img src="/images/password_view.png" alt="Afficher" className={styles.icon} />
              )}
            </button>
          </div>

          {password && (
            <ul className={styles.passwordConditionsList}>
              <li className={hasMinLength ? styles.passwordConditionsSuccess : styles.passwordConditionsError}>
                Au moins 8 caractères
              </li>
              <li className={hasLower ? styles.passwordConditionsSuccess : styles.passwordConditionsError}>
                Inclure une lettre minuscule
              </li>
              <li className={hasUpper ? styles.passwordConditionsSuccess : styles.passwordConditionsError}>
                Inclure une lettre majuscule
              </li>
              <li className={hasDigit ? styles.passwordConditionsSuccess : styles.passwordConditionsError}>
                Inclure un chiffre
              </li>
              <li className={hasSymbol ? styles.passwordConditionsSuccess : styles.passwordConditionsError}>
                Inclure un symbole
              </li>
            </ul>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="confirmPassword" className={cardStyles.cardLabel}>
            Confirmez mot de passe
          </label>
          <input
            id="confirmPassword"
            type={show ? "text" : "password"}
            placeholder="********"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={cardStyles.cardInput}
          />
          {!isMatch && confirm && (
            <p className={`${cardStyles.cardMessage} ${cardStyles.cardError}`}>
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>

        {status === "error" && errorMessage && (
          <p className={`${cardStyles.cardMessage} ${cardStyles.cardError}`}>{errorMessage}</p>
        )}
        {status === "success" && (
          <p className={`${cardStyles.cardMessage} ${cardStyles.cardSuccess}`}>
            Votre mot de passe a été mis à jour avec succès
          </p>
        )}

        <button
          type="submit"
          className={cardStyles.cardButton}
          disabled={!isStrong || !isMatch || status === "loading"}
        >
          {status === "loading" ? "Mise à jour..." : "Changer"}
        </button>
      </form>
    </section>
  );
};
