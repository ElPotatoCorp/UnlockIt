import type { ReactNode } from "react";
import styles from "./alert.module.css";

export type AlertType = "info" | "success" | "error";
export type AlertButtons = "none" | "ok" | "yes-no" | "ok-cancel";

export interface AlertProps {
  type?: AlertType;
  title: string;
  message: string;
  children?: ReactNode;
  buttons?: AlertButtons;
  showCloseButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onCloseButton?: () => void;
}

export function Alert({
  type = "info",
  title,
  message,
  children,
  buttons = "none",
  showCloseButton = true,
  onConfirm,
  onCancel,
  onCloseButton,
}: AlertProps) {
  return (
    <div className={styles.alertContainer}>
      <div className={`${styles.alert} ${styles[type]}`}>
        <div className={styles.alertHeader}>
          <h3 className={styles.alertTitle}>
            <span className={styles.alertIcon}>
              {type === "success" ? "✓" : type === "error" ? "✕" : "ⓘ"}
            </span>
            {title}
          </h3>
          {buttons === "none" && showCloseButton && (
            <button className={styles.closeButton} onClick={onCloseButton}>×</button>
          )}
        </div>

        <div className={styles.alertContent}>
          {message}
          {children && <div className={styles.alertChildren}>{children}</div>}
        </div>

        {buttons !== "none" && (
          <div className={styles.alertActions}>
            {buttons === "yes-no" && (
              <>
                <button className={`${styles.alertButton} ${styles.cancel}`} onClick={onCancel}>Non</button>
                <button className={styles.alertButton} onClick={onConfirm}>Oui</button>
              </>
            )}
            {buttons === "ok-cancel" && (
              <>
                <button className={`${styles.alertButton} ${styles.cancel}`} onClick={onCancel}>Annuler</button>
                <button className={styles.alertButton} onClick={onConfirm}>OK</button>
              </>
            )}
            {buttons === "ok" && (
              <button className={styles.alertButton} onClick={onConfirm}>OK</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}