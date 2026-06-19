import { lazy, memo } from "react";
import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";

const Background = lazy(() => import("./background/Background"));

import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";
import { SessionStatusPanel } from "./session-status-panel/SessionStatusPanel";
import { useAuthStore } from "../../api/stores/auth.store";

export const Layout = memo(() => {
    const sid = useAuthStore((s) => s.session?.sid);

    return (
        <div className={styles.pageWrapper}>
            <Header />

            <main className={styles.mainContent}>
                <Background seedOverride={sid} />
                <Outlet />
                <SessionStatusPanel />
            </main>

            <Footer />
        </div>
    );
});