import { useEmailValidation } from "./email.validator";
import { useUsernameValidation } from "./username.validator";

export function useIdentifierValidation() {
  const emailRules = useEmailValidation();
  const usernameRules = useUsernameValidation();

  return {
    required: "required",
    validate: (value: string) => {
      const emailValid = !emailRules.pattern || emailRules.pattern.value.test(value);
      const usernameValid = !usernameRules.pattern || usernameRules.pattern.value.test(value);

      if (!emailValid && !usernameValid) {
        return "invalid";
      }
    }
  };
}