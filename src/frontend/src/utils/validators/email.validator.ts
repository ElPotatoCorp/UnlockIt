export function useEmailValidation() {
  return {
    required: "required",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "invalid"
    }
  };
}