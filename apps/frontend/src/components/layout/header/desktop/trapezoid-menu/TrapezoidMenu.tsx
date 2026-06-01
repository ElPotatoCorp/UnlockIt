import { type FC, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./trapezoidMenu.module.css";
import { NAV_LINKS } from "../../navigation.config";

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
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} className={styles.btn}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
