import { type FC, type FormEvent, useState } from "react";
import cardStyles from "../../../styles/card.module.css";
import styles from "./emailSettings.module.css";
import { useUser } from "../../../api/hooks/useUser.hook";

export const EmailSettings: FC = () => {
  const { user, saveUser } = useUser();
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) return null;

  const currentEmail = user.email || "Non renseigné";
  const maskedEmail = user.email
    ? currentEmail.replace(/(.{3}).+(@.+)/, "$1***$2")
    : "Non renseigné";

  const hasAt = email.includes("@");
  const hasDomain = /\.[a-z]{2,}$/.test(email);
  const hasNoSpaces = !/\s/.test(email);
  const hasMinLength = email.length >= 6;

  const isValidFormat = hasAt && hasDomain && hasNoSpaces && hasMinLength;
  const isMatch = email.length > 0 && email === confirm;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValidFormat || !isMatch) return;

    setStatus("loading");
    try {
      await saveUser({ email });
      setStatus("success");
      setEmail("");
      setConfirm("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Une erreur est survenue côté serveur");
    }
  };

  return (
    <section className={`${cardStyles.card} ${styles.emailCard}`}>
      <h2 className={cardStyles.cardTitle}>Adresse mail</h2>

      <p className={cardStyles.cardText}>
        Gérez l’adresse mail liée à votre compte. Vous pouvez la mettre à jour et la confirmer pour rester
        joignable.
      </p>

      <form className={cardStyles.cardForm} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <label htmlFor="currentEmail" className={cardStyles.cardLabel}>
            Adresse actuelle
          </label>
          <input
            id="currentEmail"
            type="text"
            value={maskedEmail}
            readOnly
            className={`${cardStyles.cardInput} ${styles.readonly}`}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="newEmail" className={cardStyles.cardLabel}>
            Nouvelle adresse mail
          </label>
          <input
            id="newEmail"
            type="email"
            placeholder="exemple@domaine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cardStyles.cardInput}
          />

          {email && (
            <ul className={styles.emailConditionsList}>
              <li className={hasAt ? styles.emailConditionsSuccess : styles.emailConditionsError}>
                Contient un @
              </li>
              <li className={hasDomain ? styles.emailConditionsSuccess : styles.emailConditionsError}>
                Domaine valide (.com, .fr, etc.)
              </li>
              <li className={hasNoSpaces ? styles.emailConditionsSuccess : styles.emailConditionsError}>
                Ne contient pas d’espace
              </li>
              <li className={hasMinLength ? styles.emailConditionsSuccess : styles.emailConditionsError}>
                Au moins 6 caractères
              </li>
            </ul>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <label htmlFor="confirmEmail" className={cardStyles.cardLabel}>
            Confirmer adresse mail
          </label>
          <input
            id="confirmEmail"
            type="email"
            placeholder="Confirmer votre adresse"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={cardStyles.cardInput}
          />

          {!isMatch && confirm && (
            <p className={`${cardStyles.cardMessage} ${cardStyles.cardError}`}>
              Les adresses ne correspondent pas
            </p>
          )}
        </div>

        {status === "error" && errorMessage && (
          <p className={`${cardStyles.cardMessage} ${cardStyles.cardError}`}>{errorMessage}</p>
        )}

        {status === "success" && (
          <p className={`${cardStyles.cardMessage} ${cardStyles.cardSuccess}`}>
            Votre adresse mail a été mise à jour avec succès
          </p>
        )}

        <button
          type="submit"
          className={cardStyles.cardButton}
          disabled={!isValidFormat || !isMatch || status === "loading"}
        >
          {status === "loading" ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </section>
  );
};