/**
 * password.validator.ts
 *
 * Each PasswordRule bundles the regex test AND its human-readable label
 * so the conditions list in the UI is always in sync with the actual rules.
 */

export interface PasswordRule {
  /** Human-readable label shown in the conditions list */
  label: string;
  /** Returns true when the condition is satisfied */
  test: (value: string) => boolean;
}

export interface PasswordValidationOptions {
  /**
   * Override the default rules entirely.
   * Each rule is both a validator AND a displayed condition.
   */
  rules?: PasswordRule[];
  /**
   * Minimum length shorthand (default: 8).
   * Only used when `rules` is not provided.
   */
  minLength?: number;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { label: "Au moins 8 caractères",           test: (v) => v.length >= 8 },
  { label: "Une lettre minuscule",             test: (v) => /[a-z]/.test(v) },
  { label: "Une lettre majuscule",             test: (v) => /[A-Z]/.test(v) },
  { label: "Un chiffre",                       test: (v) => /\d/.test(v) },
  { label: "Un caractère spécial",             test: (v) => /[\W_]/.test(v) },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface PasswordValidation {
  /** react-hook-form compatible rules object */
  rules: {
    required: string;
    validate: (value: string) => string | undefined;
  };
  /**
   * The ordered list of conditions (rules) — pass directly to PasswordInput.
   * Each item carries its label + a live `met` status when you pass a value.
   */
  conditions: PasswordRule[];
  /**
   * Evaluate conditions against a live value.
   * Returns an array of { label, met } objects ready for the UI.
   */
  evaluate: (value: string) => { label: string; met: boolean }[];
}

export function usePasswordValidation(
  options: PasswordValidationOptions = {}
): PasswordValidation {
  const conditions = options.rules ?? DEFAULT_PASSWORD_RULES;

  return {
    rules: {
      required: "required",
      validate: (value: string) => {
        const allMet = conditions.every((rule) => rule.test(value));
        return allMet ? undefined : "invalid";
      },
    },
    conditions,
    evaluate: (value: string) =>
      conditions.map((rule) => ({ label: rule.label, met: rule.test(value) })),
  };
}
