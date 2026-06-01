import { memo } from "react";
import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";

import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";
import { Background } from "./background/Background";
import { Suspense } from "react";
import { Loader } from "../../features/Loader";

export const Layout = memo(() => {
    return (
        <div className={styles.pageWrapper}>
            <Header />

            <main className={styles.mainContent}>
                <Background />

                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>

            </main>

            <Footer />
        </div>
    );
});