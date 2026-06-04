/**
 * PasswordInput.tsx
 *
 * Password input with show/hide toggle and an optional live conditions list.
 * The conditions are derived directly from the validator rules, so they are
 * always in sync — no separate translation layer needed.
 */

import { useState } from "react";
import formStyles from "../form.module.css";
import styles from "./passwordInput.module.css";
import type { PasswordRule } from "./password.validator";

// ─── Icon components (inline SVG — no extra assets required) ─────────────────

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
             a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8
             a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── Props ───────────────────────────────────────────────────────────────────

interface PasswordInputProps {
  id?: string;
  label?: string;
  /** react-hook-form register() spread */
  register: object;
  error?: string;
  /** Live value from the form (needed for conditions) */
  value?: string;
  /**
   * The rule objects from usePasswordValidation().
   * Each rule carries its own `label` and `test`, so no separate
   * conditions prop is needed — pass `validation.conditions` directly.
   */
  conditions?: PasswordRule[];
  /**
   * Show the conditions checklist while the user is typing.
   * Automatically hidden once all conditions are satisfied.
   */
  showConditions?: boolean;
  /** aria-label for the show/hide toggle (accessibility) */
  toggleLabel?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const PasswordInput = ({
  id = "password",
  label,
  register,
  error,
  value = "",
  conditions,
  showConditions = false,
  toggleLabel = "Afficher / masquer le mot de passe",
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  // Evaluate each rule against the current value
  const evaluated = conditions?.map((rule) => ({
    label: rule.label,
    met: rule.test(value),
  }));

  // Hide the list once every condition is met
  const allMet = evaluated?.every((c) => c.met) ?? false;
  const renderConditions = showConditions && !!evaluated && !!value && !allMet;

  return (
    <div className={formStyles.form}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputField}>
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="current-password"
          className={`${formStyles.formField} ${styles.input}`}
          placeholder="••••••••"
          {...register}
        />

        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setShow((s) => !s)}
          aria-label={toggleLabel}
          aria-pressed={show}
        >
          <span className={styles.icon}>
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </span>
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {renderConditions && (
        <ul className={styles.conditionsList} aria-live="polite">
          {evaluated!.map(({ label: condLabel, met }) => (
            <li key={condLabel} className={met ? styles.ok : styles.ko}>
              <span className={styles.conditionIcon} aria-hidden="true">
                {met ? "✓" : "✗"}
              </span>
              {condLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
