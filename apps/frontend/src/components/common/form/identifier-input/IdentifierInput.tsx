/**
 * IdentifierInput.tsx
 *
 * Generic text-like input (email, username, plain text…).
 * Works with react-hook-form's `register` return value.
 */

import styles from "./identifierInput.module.css";
import formStyles from "../form.module.css";
import type { IdentifierMode } from "./identifier.validator";

interface IdentifierInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  /** react-hook-form register() spread */
  register: object;
  error?: string;
  /**
   * Drives the <input type="…"> attribute.
   * Defaults to "email" when mode is "email", "text" otherwise.
   */
  mode?: IdentifierMode;
  /** Override the HTML input type directly if needed */
  type?: "text" | "email";
  autoComplete?: string;
}

export const IdentifierInput = ({
  id = "identifier",
  label,
  placeholder,
  register,
  error,
  mode,
  type,
  autoComplete,
}: IdentifierInputProps) => {
  // Derive a sensible default type from the mode
  const resolvedType = type ?? (mode === "email" ? "email" : "text");
  const resolvedAutoComplete =
    autoComplete ?? (mode === "email" ? "email" : "username");

  return (
    <div className={formStyles.form}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <input
        id={id}
        type={resolvedType}
        autoComplete={resolvedAutoComplete}
        className={`${formStyles.formField} ${styles.input}`}
        placeholder={placeholder}
        {...register}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
