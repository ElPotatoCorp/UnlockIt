import { type FC, useEffect, useState } from "react";
import styles from "./sessionTest.module.css";

interface SessionInfo {
    isAuthenticated: boolean;
    userId?: string;
    sessionId?: string;
    email?: string;
    username?: string;
    profilePicture?: string;
    loading: boolean;
    error?: string;
}

export const SessionTest: FC = () => {
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
        isAuthenticated: false,
        loading: true,
    });

    const [visible, setVisible] = useState(true);

    const checkSession = async () => {
        setSessionInfo(prev => ({ ...prev, loading: true, error: undefined }));

        try {
            const res = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include', // Important: include cookies
            });

            if (res.ok) {
                const body = await res.json();
                setSessionInfo({
                    isAuthenticated: true,
                    userId: body.data?.user?.id,
                    sessionId: body.data?.session_id,
                    email: body.data?.user?.email,
                    username: body.data?.user?.username,
                    profilePicture: body.data?.user?.profile_picture,
                    loading: false,
                });
            } else {
                setSessionInfo({
                    isAuthenticated: false,
                    loading: false,
                    error: `Session invalid (${res.status})`,
                });
            }
        } catch (err: any) {
            setSessionInfo({
                isAuthenticated: false,
                loading: false,
                error: err.message || 'Failed to check session',
            });
        }
    };

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                setSessionInfo({
                    isAuthenticated: false,
                    loading: false,
                });
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <button
                className={styles.toggleBtn}
                onClick={() => setVisible(v => !v)}
            >
                {visible ? "➡️" : "⬅️"}
            </button>

            <div className={`${styles.sessionTest} ${visible ? styles.show : styles.hide}`}>
                <div className={styles.header}>
                    <h3>🔐 Session Status</h3>
                    <button
                        onClick={checkSession}
                        className={styles.refreshBtn}
                        disabled={sessionInfo.loading}
                    >
                        🔄 Refresh
                    </button>
                </div>

                {sessionInfo.loading ? (
                    <p className={styles.loading}>Checking session...</p>
                ) : sessionInfo.isAuthenticated ? (
                    <div className={styles.authenticated}>
                        <div className={styles.status}>
                            <span className={styles.statusDot}></span>
                            <strong>Authenticated</strong>
                        </div>

                        <div className={styles.info}>
                            {sessionInfo.username && (
                                <p><strong>Username:</strong> {sessionInfo.username}</p>
                            )}
                            {sessionInfo.email && (
                                <p><strong>Email:</strong> {sessionInfo.email}</p>
                            )}
                            {sessionInfo.profilePicture && (
                                <p><strong>Profile Pic:</strong> {sessionInfo.profilePicture}</p>
                            )}
                            {sessionInfo.userId && (
                                <p><strong>User ID:</strong> {sessionInfo.userId.substring(0, 8)}...</p>
                            )}
                            {sessionInfo.sessionId && (
                                <p><strong>Session ID:</strong> {sessionInfo.sessionId.substring(0, 12)}...</p>
                            )}
                        </div>

                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className={styles.notAuthenticated}>
                        <div className={styles.status}>
                            <span className={`${styles.statusDot} ${styles.inactive}`}></span>
                            <strong>Not Authenticated</strong>
                        </div>
                        {sessionInfo.error && (
                            <p className={styles.error}>{sessionInfo.error}</p>
                        )}
                        <p className={styles.hint}>Please login to create a session</p>
                    </div>
                )}
            </div>
        </>
    );
};
