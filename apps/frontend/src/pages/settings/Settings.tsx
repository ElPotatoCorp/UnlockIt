import { type FC, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../api/hooks/useAuth.hook";
import { useUser } from "../../api/hooks/useUser.hook";
import styles from "./settings.module.css";

/*
import { AccountDetails } from "./account-details/AccountDetails";
import { PasswordSettings } from "./password/PasswordSettings";
import { EmailSettings } from "./email/EmailSettings";
import { Wallet } from "./wallet/Wallet";
*/
import { Profile } from "./profile/Profile";
import { AccountDangerZone } from "./danger-zone/AccountDangerZone";
import Loading from "../../components/common/loading/Loading";

const Settings: FC = () => {
  const { isLogged, fetchSession } = useAuth();
  const { user, loadUser, loadProfile, loadBilling } = useUser();

  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Ensures session state is fresh if this page is hit directly (e.g. on refresh).
  // TODO: if there's already an app-level bootstrap that calls fetchSession on mount
  // (e.g. in App.tsx), this is redundant and can be dropped in favor of just reading isLogged.
  useEffect(() => {
    fetchSession().finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (checkingSession || !isLogged) return;

    setLoadingData(true);
    Promise.all([loadUser(), loadProfile(), loadBilling()]).finally(() => setLoadingData(false));
    // Note: loadUser/loadProfile/loadBilling swallow non-auth errors silently (see useUser.hook.ts),
    // so there's no real error message to surface here if e.g. the server 500s — only a generic
    // fallback below if `user` ends up empty.
  }, [checkingSession, isLogged]);

  if (checkingSession || loadingData) {
    return (
      <div className={styles.settingsPage}>
        <h1>Paramètres du compte</h1>
        <Loading />
      </div>
    );
  }

  if (!isLogged) {
    return (
      <Navigate to="/login" replace />
    );
  }

  if (!user) {
    return (
      <div className={styles.settingsPage}>
        <h1>Paramètres du compte</h1>
        <p style={{ color: "red" }}>Impossible de charger vos informations. Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      <h1>Paramètres du compte</h1>


      <div className={styles.cardGrid}>
        <Profile />
        {/*
        <AccountDetails />
        */}
      </div>

      {/*
      <div className={styles.cardGrid}>
        <EmailSettings />
        <PasswordSettings />
      </div>

      <div className={styles.cardGrid}>
        <Wallet />
      </div>
      */}

      <AccountDangerZone />
    </div>
  );
};

export default Settings;