import { useAlert } from "../../components/common/modal-provider/ModalProvider";

export function useToast() {
  const { showAlert } = useAlert();

  const base = {
    autoClose: 2000,
    overlay: "none" as const,
    position: "top" as const,
    closeOnOverlay: true,
    stackMode: "show" as const,
  };

  return {
    success: (message: string, title = "Succès") =>
      showAlert({
        ...base,
        type: "success",
        title,
        message,
      }),

    error: (message: string, title = "Erreur") =>
      showAlert({
        ...base,
        type: "error",
        title,
        message,
        autoClose: 2500,
      }),

    info: (message: string, title = "Info") =>
      showAlert({
        ...base,
        type: "info",
        title,
        message,
      }),
  };
}