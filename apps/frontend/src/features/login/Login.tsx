import { type FC } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../api/hooks/useAuth.hook";
import { useUser } from "../../api/hooks/useUser.hook";
import { Link, useNavigate } from "react-router-dom";
import { useIdentifierValidation } from "../../components/common/form/identifier-input/identifier.validator";
import { usePasswordValidation } from "../../components/common/form/password-input/password.validator";
import { IdentifierInput } from "../../components/common/form/identifier-input/IdentifierInput";
import { PasswordInput } from "../../components/common/form/password-input/PasswordInput";
import { Card } from "../../components/common/card/Card";
import styles from "./login.module.css";
import { UnlockItHelmet } from "../helmet/UnlockItHelmet";
import { Button } from "../../components/common/button/Button";

type FormData = {
  identifier: string;
  password: string;
};

const Login: FC = () => {
  const navigate = useNavigate();

  const { session, login, logout } = useAuth();
  const { user, loadUser } = useUser();

  const identifierRules = useIdentifierValidation();
  const passwordValidation = usePasswordValidation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>();

  const passwordValue = watch("password", "");

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const onSubmit = async ({ identifier, password }: FormData) => {
    try {
      await login(identifier, password); // crée la session
      await loadUser();                  // charge /user
      navigate("/");
    } catch (err: any) {
      setError("root", { message: err.message ?? "Erreur de connexion." });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ─── Already logged in ─────────────────────────────────────────────────────
  // On est connecté si :
  // - session existe (JWT valide)
  // - user existe (core user chargé)
  if (session && user) {
    return (
      <div className={styles.loginPage}>
        <UnlockItHelmet
          title="Connexion"
          description="Connectez-vous à votre compte UnlockIt."
          path="/login"
        />

        <h1 className={styles.pageTitle}>Déjà connecté</h1>

        <Card hover={false}>
          <p className={styles.cardText}>
            Vous êtes connecté en tant que <strong>{user.username}</strong>.
          </p>

          <div className={styles.actions}>
            <Link to="/" className={styles.link}>
              Retour à l'accueil
            </Link>

            <button id="logout-button" onClick={handleLogout} className={styles.btnDanger}>
              Se déconnecter
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ─── Login form ────────────────────────────────────────────────────────────

  return (
    <div className={styles.loginPage}>
      <UnlockItHelmet
        title="Connexion"
        description="Connectez-vous à votre compte UnlockIt."
        path="/login"
      />

      <h1 className={styles.pageTitle}>Connexion</h1>

      <Card hover={false}>
        <p className={styles.cardText}>
          Entrez vos identifiants pour accéder à votre compte.
        </p>

        <Link to="/register" className={styles.link}>
          Pas encore de compte ? Inscrivez-vous
        </Link>

        <form id="login-form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <IdentifierInput
            label="Email ou pseudo"
            placeholder="you@example.com"
            register={register("identifier", identifierRules)}
            error={errors.identifier?.message}
          />

          <PasswordInput
            label="Mot de passe"
            register={register("password", passwordValidation.rules)}
            error={errors.password?.message}
            value={passwordValue}
          />

          <Link to="/forgotten-password" className={styles.linkSmall}>
            Mot de passe oublié ?
          </Link>

          {errors.root && (
            <p className={styles.errorMessage}>{errors.root.message}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;