import { type FC, useEffect, useState, useRef } from "react";
import styles from "./trapezoidMenu.module.css";
import { Link } from "react-router-dom";

export const TrapezoidMenu: FC = () => {
  const [visible, setVisible] = useState(true);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(false);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = window.setTimeout(() => {
        setVisible(true);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.trapezoid} ${visible ? styles.visible : ""}`}>
      <div className={styles.trapezoidButtons}>
        <Link to="/" className={styles.btn}>Magasin</Link>
        <Link to="/purchases" className={styles.btn}>Achats</Link>
        <Link to="/about" className={styles.btn}>À propos</Link>
        <Link to="/help" className={styles.btn}>Aide</Link>
      </div>
    </nav>
  );
};