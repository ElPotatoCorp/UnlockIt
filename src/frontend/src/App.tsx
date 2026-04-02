import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./layout.module.css";

import { Header } from './components/layout/header/Header';
import { Footer } from './components/layout/footer/Footer';
import { Background } from './components/layout/background/Background';

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
