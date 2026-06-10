import { type FC, type ButtonHTMLAttributes } from "react";
import styles from "./button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = true,
  className = "",
  ...props
}) => {
  const variantClass =
    variant === "danger" ? styles.btnDanger : styles.btnPrimary;

  return (
    <button
      className={`${variantClass} ${fullWidth ? styles.fullWidth : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};