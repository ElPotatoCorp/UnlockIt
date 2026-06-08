import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { useIdentifierValidation } from "../../components/common/form/identifier-input/identifier.validator";
import { usePasswordValidation } from "../../components/common/form/password-input/password.validator";
import { Card } from "../../components/common/card/Card";
import { useAuth } from "../../api/hooks/useAuth.hook";
import { IdentifierInput } from "../../components/common/form/identifier-input/IdentifierInput";
import { PasswordInput } from "../../components/common/form/password-input/PasswordInput";
import { useUser } from "../../api/hooks/useUser.hook";
import { UnlockItHelmet } from "../helmet/UnlockItHelmet";

type ContactMode = "email" | "phone";

type FormData = {
  username: string;
  password: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
};

const Register: FC = () => {
  const navigate = useNavigate();

  const { session, register: authRegister, logout } = useAuth();
  const { user } = useUser();

  const [contactMode, setContactMode] = useState<ContactMode>("email");

  const usernameRules = useIdentifierValidation({ mode: "username" });
  const emailRules = useIdentifierValidation({ mode: "email" });
  const passwordValidation = usePasswordValidation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>();

  const passwordValue = watch("password", "");

  // ─── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    try {
      await authRegister(data.username, data.email, data.password);

      navigate("/login");
    } catch (err: any) {
      setError("root", { message: err.message ?? "Erreur d'inscription." });
    }
  };

  // ─── Already logged in ────────────────────────────────────────────────────
  // On est connecté si :
  // - session existe (JWT valide)
  // - user existe (core user chargé)
  if (session && user) {
    return (
      <div className={styles.registerPage}>
        <UnlockItHelmet
          title="Inscription"
          description="Créez votre compte UnlockIt."
          path="/login"
        />

        <h1 className={styles.pageTitle}>Déjà connecté</h1>

        <Card hover={false}>
          <p className={styles.cardText}>
            Vous êtes connecté en tant que <strong>{user.username}</strong>.
            Vous ne pouvez pas créer un nouveau compte en étant connecté.
          </p>

          <div className={styles.actions}>
            <Link to="/" className={styles.link}>Retour à l'accueil</Link>

            <button id="logout-button" onClick={logout} className={styles.btnDanger}>
              Se déconnecter
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.registerPage}>
      <UnlockItHelmet
        title="Inscription"
        description="Créez votre compte UnlockIt."
        path="/login"
      />

      <h1 className={styles.pageTitle}>Inscription</h1>

      <Card hover={false}>
        <p className={styles.cardText}>
          Créez votre compte pour accéder à la plateforme.
        </p>

        <Link to="/login" className={styles.link}>
          Déjà un compte ? Connectez-vous
        </Link>

        <form id="register-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>

          {/* ── Username ── */}
          <IdentifierInput
            id="username"
            label="Nom d'utilisateur"
            placeholder="votre_pseudo"
            mode="username"
            register={register("username", usernameRules)}
            error={errors.username?.message}
          />

          {/* ── Password + conditions live ── */}
          <PasswordInput
            label="Mot de passe"
            register={register("password", passwordValidation.rules)}
            error={errors.password?.message}
            value={passwordValue}
            conditions={passwordValidation.conditions}
            showConditions
          />

          {/* ── Contact mode toggle ── */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Méthode de contact</span>

            <div className={styles.modeToggle}>
              <button
                type="button"
                className={`${styles.modeBtn} ${contactMode === "email" ? styles.modeBtnActive : ""}`}
                onClick={() => setContactMode("email")}
              >
                Email
              </button>

              <button
                type="button"
                className={`${styles.modeBtn} ${styles.modeBtnDisabled}`}
                disabled
              >
                Téléphone (bientôt)
              </button>
            </div>
          </div>

          {/* ── Email ── */}
          {contactMode === "email" && (
            <IdentifierInput
              id="email"
              label="Email"
              placeholder="you@example.com"
              mode="email"
              register={register("email", {
                ...emailRules,
                required: "Email requis",
              })}
              error={errors.email?.message}
            />
          )}

          {/* ── Phone ── */}
          {contactMode === "phone" && (
            <p className={styles.infoMessage}>L'inscription par téléphone sera bientôt disponible.</p>
          )}

          {/* ── Global error ── */}
          {errors.root && (
            <p className={styles.errorMessage}>{errors.root.message}</p>
          )}

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscription…" : "S'inscrire"}
          </button>

        </form>
      </Card>
    </div>
  );
};

export default Register;