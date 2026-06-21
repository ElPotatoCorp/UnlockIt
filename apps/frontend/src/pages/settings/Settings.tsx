import { type FC, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../api/hooks/useAuth.hook";
import { useUser } from "../../api/hooks/useUser.hook";
import styles from "./settings.module.css";

import { Profile } from "./profile/Profile";
import { AccountDangerZone } from "./danger-zone/AccountDangerZone";
import Loading from "../../components/common/loading/Loading";
import { AccountDetails } from "./account-details/AccountDetails";
import { Wallet } from "./wallet/Wallet";
import { EmailSettings } from "./email/EmailSettings";
import { PasswordSettings } from "./password/PasswordSettings";

const Settings: FC = () => {
  const { isLogged, fetchSession } = useAuth();
  const { user, loadUser, loadProfile, loadBilling } = useUser();

  const [checkingSession, setCheckingSession] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchSession().finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (checkingSession || !isLogged) return;

    setLoadingData(true);
    Promise.all([loadUser(), loadProfile(), loadBilling()]).finally(() => setLoadingData(false));
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
        <AccountDetails />
      </div>

      <div className={styles.cardGrid}>
        <EmailSettings />
        <PasswordSettings />
      </div>
      
      <div className={styles.cardGrid}>
        <Wallet />
      </div>

      <AccountDangerZone />
    </div>
  );
};

export default Settings;