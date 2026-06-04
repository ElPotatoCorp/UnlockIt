/**
 * identifier.validator.ts
 *
 * Supports three built-in modes (email, username, text) and accepts
 * a fully custom rules object to override any of them.
 */

export type IdentifierMode = "email" | "username" | "text";

export interface IdentifierRules {
  required?: string;
  pattern?: { value: RegExp; message: string };
  validate?: (value: string) => string | undefined;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
}

export interface IdentifierValidationOptions {
  mode?: IdentifierMode;
  /** Completely overrides the built-in rules for the chosen mode */
  rules?: IdentifierRules;
}

// ─── Built-in presets ─────────────────────────────────────────────────────────

const EMAIL_RULES: IdentifierRules = {
  required: "required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "invalid",
  },
};

const USERNAME_RULES: IdentifierRules = {
  required: "required",
  pattern: {
    value: /^[a-zA-Z0-9_]{3,20}$/,
    message: "invalid",
  },
};

const TEXT_RULES: IdentifierRules = {
  required: "required",
};

// ─── "email OR username" composite ────────────────────────────────────────────

function makeEmailOrUsernameRules(): IdentifierRules {
  return {
    required: "required",
    validate: (value: string) => {
      const emailOk = EMAIL_RULES.pattern!.value.test(value);
      const usernameOk = USERNAME_RULES.pattern!.value.test(value);
      return emailOk || usernameOk ? undefined : "invalid";
    },
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIdentifierValidation(
  options: IdentifierValidationOptions = {}
): IdentifierRules {
  // Custom rules always win
  if (options.rules) return options.rules;

  switch (options.mode) {
    case "email":    return EMAIL_RULES;
    case "username": return USERNAME_RULES;
    case "text":     return TEXT_RULES;
    default:
      // No mode specified → accept email OR username
      return makeEmailOrUsernameRules();
  }
}
