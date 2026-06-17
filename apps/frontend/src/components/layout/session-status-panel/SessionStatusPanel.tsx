import { type FC, useEffect, useState } from "react";
import styles from "./sessionStatusPanel.module.css";
import { useUser } from "../../../api/hooks/useUser.hook";
import { useAuth } from "../../../api/hooks/useAuth.hook";

export const SessionStatusPanel: FC = () => {
  const { session, fetchSession, logout } = useAuth();
  const { user, loadUser } = useUser();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [tab, setTab] = useState<"session" | "user" | "debug">("session");

  const API_URL = import.meta.env.VITE_API_BASE_URL ?? "unknown";

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getExpiresIn = (exp?: number) => {
    if (!exp) return "—";
    const diff = exp * 1000 - Date.now();
    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${hours}h ${minutes}min ${seconds}s`;
  };

  const refresh = async () => {
    setLoading(true);
    setError(undefined);

    try {
      await fetchSession();
      await loadUser();
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message ?? "Failed to refresh session");
    }

    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      await refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isAuthenticated = Boolean(session && user);
  // const wallet = user?.wallet ?? 0; TODO replace when API layer is done
  const wallet = 0;

  return (
    <>
      <button
        className={styles.toggleBtn}
        aria-label="debug-panel"
        onClick={() => setVisible(v => !v)}
      >
        {visible ? "→" : "←"} 
      </button>

      <div className={`${styles.panel} ${visible ? styles.show : styles.hide}`}>
        <div className={styles.header}>
          <h3>Session Status</h3>
          <button
            onClick={refresh}
            className={styles.refreshBtn}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "session" ? styles.activeTab : ""}`}
            onClick={() => setTab("session")}
          >
            Session
          </button>
          <button
            className={`${styles.tab} ${tab === "user" ? styles.activeTab : ""}`}
            onClick={() => setTab("user")}
          >
            User
          </button>
          <button
            className={`${styles.tab} ${tab === "debug" ? styles.activeTab : ""}`}
            onClick={() => setTab("debug")}
          >
            Debug
          </button>
        </div>

        {/* Content area with scroll */}
        <div className={styles.content}>
          {loading ? (
            <p className={styles.loading}>Loading…</p>
          ) : !isAuthenticated ? (
            <p className={styles.error}>{error ?? "Not authenticated"}</p>
          ) : (
            <>
              {tab === "session" && (
                <div className={styles.info}>
                  <p><strong>User ID:</strong> <span className={styles.valueBox}>{session?.sub}</span></p>
                  <p><strong>Session ID:</strong> <span className={styles.valueBox}>{session?.sid}</span></p>
                  <p><strong>Issued At:</strong> <span className={styles.valueBox}>{formatDate(session?.iat)}</span></p>
                  <p><strong>Expires At:</strong> <span className={styles.valueBox}>{formatDate(session?.exp)}</span></p>
                  <p><strong>Expires In:</strong> <span className={styles.valueBox}>{getExpiresIn(session?.exp)}</span></p>
                  <p><strong>Permission:</strong> <span className={styles.valueBox}>{session?.permission ?? "none"}</span></p>
                </div>
              )}

              {tab === "user" && (
                <div className={styles.info}>
                  <p><strong>Username:</strong> <span className={styles.valueBox}>{user?.username}</span></p>
                  <p><strong>Email:</strong> <span className={styles.valueBox}>{user?.email}</span></p>
                  <p><strong>Avatar:</strong> <span className={styles.valueBox}>{user?.avatar ?? "none"}</span></p>
                  <p><strong>Wallet:</strong> <span className={styles.valueBox}>{wallet.toFixed(2)} €</span></p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    <span className={styles.valueBox}>{user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</span>
                  </p>
                </div>
              )}

              {tab === "debug" && (
                <div className={styles.info}>
                  <p><strong>API URL:</strong> <span className={styles.valueBox}>{API_URL}</span></p>
                  <p><strong>Environment:</strong> <span className={styles.valueBox}>{import.meta.env.MODE}</span></p>
                  <p><strong>Last Refresh:</strong> <span className={styles.valueBox}>{lastRefresh?.toLocaleString() ?? "—"}</span></p>
                </div>
              )}
            </>
          )}
        </div>

        {isAuthenticated && (
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </>
  );
};