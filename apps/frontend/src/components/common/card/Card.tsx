import { type FC, type ReactNode } from "react";
import styles from "./card.module.css";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export const Card: FC<CardProps> = ({
  children,
  hover = true,
  className = "",
}) => {
  return (
    <div
      className={`${styles.card} ${hover ? styles.hover : ""} ${className}`}
    >
      {children}
    </div>
  );
};