import { memo } from "react";
import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";

import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";
import { Background } from "./background/Background";
import { SessionStatusPanel } from "./session-status-panel/SessionStatusPanel";

export const Layout = memo(() => {
    return (
        <div className={styles.pageWrapper}>
            <Header />

            <main className={styles.mainContent}>
                <Background />
                <Outlet />
                <SessionStatusPanel />
            </main>

            <Footer />
        </div>
    );
});