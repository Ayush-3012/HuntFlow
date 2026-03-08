export type ToastVariant = "success" | "error" | "info";

export type ToastEventDetail = {
  id: string;
  message: string;
  variant: ToastVariant;
  durationMs?: number;
};

const TOAST_EVENT_NAME = "app-toast";

function emitToast(detail: Omit<ToastEventDetail, "id">) {
  if (typeof window === "undefined") return;

  const eventDetail: ToastEventDetail = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...detail,
  };

  window.dispatchEvent(new CustomEvent<ToastEventDetail>(TOAST_EVENT_NAME, { detail: eventDetail }));
}

export const toast = {
  success(message: string, durationMs = 3000) {
    emitToast({ message, variant: "success", durationMs });
  },
  error(message: string, durationMs = 4000) {
    emitToast({ message, variant: "error", durationMs });
  },
  info(message: string, durationMs = 3000) {
    emitToast({ message, variant: "info", durationMs });
  },
};

export { TOAST_EVENT_NAME };
