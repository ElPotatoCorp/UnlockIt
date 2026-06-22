import { useForm } from "react-hook-form";
import { useIdentifierValidation } from "../../../components/common/form/identifier-input/identifier.validator";
import { IdentifierInput } from "../../../components/common/form/identifier-input/IdentifierInput";
import { useUser } from "../../../api/hooks/useUser.hook";
import cardStyles from "../../../styles/card.module.css";
import styles from "./emailSettings.module.css";
import { Button } from "../../../components/common/button/Button";
import { Card } from "../../../components/common/card/Card";

type FormData = {
  email: string;
  confirm: string;
};

export const useEmailConditions = () => {
  return {
    hasAt: (v: string) => v.includes("@"),
    hasDomain: (v: string) => /\.[a-z]{2,}$/i.test(v),
    hasNoSpaces: (v: string) => !/\s/.test(v),
    hasMinLength: (v: string) => v.length >= 6,
  };
};

export const EmailSettings = () => {
  const { user, saveUser } = useUser();
  const emailRules = useIdentifierValidation({ mode: "email" });
  const conditions = useEmailConditions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormData>();

  const emailValue = watch("email", "");
  const confirmValue = watch("confirm", "");

  if (!user) return null;

  const maskedEmail = user.email
    ? user.email.replace(/(.{3}).+(@.+)/, "$1***$2")
    : "Non renseigné";

  const onSubmit = async ({ email, confirm }: FormData) => {
    if (email !== confirm) {
      setError("confirm", { message: "Les adresses ne correspondent pas." });
      return;
    }

    try {
      await saveUser({ email });
      reset();
    } catch (err: any) {
      setError("root", { message: err.message });
    }
  };

  return (
    <Card className={styles.emailCard}>
      <h2 className={cardStyles.cardTitle}>Adresse mail</h2>

      <form className={cardStyles.cardForm} onSubmit={handleSubmit(onSubmit)}>

        {/* Email actuel */}
        <div className={styles.inputWrapper}>
          <label className={cardStyles.cardLabel}>Adresse actuelle</label>
          <input
            type="text"
            value={maskedEmail}
            readOnly
            className={`${cardStyles.cardInput} ${styles.readonly}`}
          />
        </div>

        {/* Nouveau mail */}
        <IdentifierInput
          id="newEmail"
          label="Nouvelle adresse mail"
          placeholder="exemple@domaine.com"
          mode="email"
          register={register("email", emailRules)}
          error={errors.email?.message}
        />

        {/* Conditions live */}
        {emailValue && (
          <ul className={styles.emailConditionsList}>
            <li className={conditions.hasAt(emailValue) ? styles.ok : styles.ko}>
              Contient un @
            </li>
            <li className={conditions.hasDomain(emailValue) ? styles.ok : styles.ko}>
              Domaine valide (.com, .fr…)
            </li>
            <li className={conditions.hasNoSpaces(emailValue) ? styles.ok : styles.ko}>
              Pas d’espace
            </li>
            <li className={conditions.hasMinLength(emailValue) ? styles.ok : styles.ko}>
              Minimum 6 caractères
            </li>
          </ul>
        )}

        {/* Confirmation */}
        <IdentifierInput
          id="confirmEmail"
          label="Confirmer adresse mail"
          placeholder="Confirmer votre adresse"
          mode="email"
          register={register("confirm", {
            required: "Champ requis",
            validate: (v) =>
              v === emailValue || "Les adresses ne correspondent pas.",
          })}
          error={errors.confirm?.message}
        />

        {errors.root && (
          <p className={cardStyles.cardError}>{errors.root.message}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mise à jour…" : "Mettre à jour"}
        </Button>
      </form>
    </Card>
  );
};