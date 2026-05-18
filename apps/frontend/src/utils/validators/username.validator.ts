export function useUsernameValidation() {
  return {
    required: "required",
    pattern: {
      value: /^[a-zA-Z0-9_]{3,20}$/,
      message: "invalid"
    }
  };
}