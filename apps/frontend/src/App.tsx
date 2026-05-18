import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./layout.module.css";

import { Header } from './components/layout/header/Header';
import { Footer } from './components/layout/footer/Footer';
import { Background } from './components/layout/background/Background';
import { Privacy } from "./pages/privacy/Privacy";
import { Legal } from "./pages/legal/Legal";
import { Cookies } from "./pages/cookies/Cookies";
import { Refunds } from "./pages/refunds/Refunds";

function App() {
  return (
    <BrowserRouter>
      <div className={styles.pageWrapper}>
        <Header />

        <main className={styles.mainContent}>
          <Background />
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/home" element={<></>} />
            <Route path="/legal" element={<Legal/>} />
            <Route path="/privacy" element={<Privacy/>} />
            <Route path="/cookies" element={<Cookies/>} />
            <Route path="/refunds" element={<Refunds/>} />

            <Route path="/playground" element={<></>} />

            {/* Catch-all route */}
            <Route path="*" element={<></>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
