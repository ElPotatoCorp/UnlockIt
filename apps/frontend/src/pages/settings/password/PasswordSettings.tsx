import { useForm } from "react-hook-form";
import { useUser } from "../../../api/hooks/useUser.hook";
import { usePasswordValidation } from "../../../components/common/form/password-input/password.validator";

import { PasswordInput } from "../../../components/common/form/password-input/PasswordInput";
import { Card } from "../../../components/common/card/Card";
import { Button } from "../../../components/common/button/Button";

import styles from "./passwordSettings.module.css";

type FormData = {
  password: string;
  confirm: string;
};

export const PasswordSettings = () => {
  const { saveUser } = useUser();
  const passwordValidation = usePasswordValidation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormData>();

  const passwordValue = watch("password", "");
  const confirmValue = watch("confirm", "");

  const onSubmit = async ({ password, confirm }: FormData) => {
    if (password !== confirm) {
      setError("confirm", { message: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      await saveUser({ password });
      reset();
    } catch (err: any) {
      setError("root", { message: err.message });
    }
  };

  return (
    <Card hover={false} className={styles.card}>
      <h2 className={styles.title}>Mot de passe</h2>

      <p className={styles.text}>
        Définissez un mot de passe robuste pour protéger votre compte.
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          label="Nouveau mot de passe"
          register={register("password", passwordValidation.rules)}
          error={errors.password?.message}
          value={passwordValue}
        />

        <PasswordInput
          label="Confirmer le mot de passe"
          register={register("confirm", { required: "Champ requis" })}
          error={errors.confirm?.message}
          value={confirmValue}
        />

        {errors.root && (
          <p className={styles.error}>{errors.root.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Mise à jour…" : "Changer"}
        </Button>
      </form>
    </Card>
  );
};