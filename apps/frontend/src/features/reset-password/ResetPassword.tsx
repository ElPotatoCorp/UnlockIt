import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../api/hooks/useAuth.hook";
import { usePasswordValidation } from "../../components/common/form/password-input/password.validator";

import { PasswordInput } from "../../components/common/form/password-input/PasswordInput";
import { Card } from "../../components/common/card/Card";
import { Button } from "../../components/common/button/Button";
import { UnlockItHelmet } from "../helmet/UnlockItHelmet";

import styles from "./resetPassword.module.css";

type FormData = {
    password: string;
};

const ResetPassword = () => {
    const { resetToken } = useParams<{ resetToken: string }>();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const passwordValidation = usePasswordValidation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<FormData>();

    const passwordValue = watch("password", "");

    const onSubmit = async ({ password }: FormData) => {
        try {
            await resetPassword(resetToken!, password);
            navigate("/login");
        } catch (err: any) {
            setError("root", { message: err.message ?? "Erreur inconnue." });
        }
    };

    return (
        <div className={styles.page}>
            <UnlockItHelmet
                title="Réinitialiser le mot de passe"
                description="Définissez un nouveau mot de passe pour votre compte UnlockIt."
                path={`/reset-password/${resetToken}`}
            />

            <h1 className={styles.pageTitle}>Nouveau mot de passe</h1>

            <Card hover={false}>
                <p className={styles.cardText}>
                    Choisissez un nouveau mot de passe pour votre compte.
                </p>

                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <PasswordInput
                        label="Nouveau mot de passe"
                        register={register("password", passwordValidation.rules)}
                        error={errors.password?.message}
                        value={passwordValue}
                    />

                    {errors.root && (
                        <p className={styles.errorMessage}>{errors.root.message}</p>
                    )}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Mise à jour…" : "Réinitialiser"}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ResetPassword;