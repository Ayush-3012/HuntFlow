"use client";

import { ComponentType, useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { ToastEventDetail, TOAST_EVENT_NAME } from "@/lib/toast";

type ToastItem = ToastEventDetail;

const variantStyles: Record<ToastItem["variant"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

const variantIcon: Record<ToastItem["variant"], ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastItem>;
      const detail = customEvent.detail;
      if (!detail) return;

      setToasts((prev) => [...prev, detail]);
      const duration = detail.durationMs ?? 3000;

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== detail.id));
      }, duration);
    };

    window.addEventListener(TOAST_EVENT_NAME, handleToast as EventListener);
    return () => {
      window.removeEventListener(TOAST_EVENT_NAME, handleToast as EventListener);
    };
  }, []);

  const visibleToasts = useMemo(() => toasts.slice(-4), [toasts]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-100 flex w-[min(92vw,380px)] flex-col gap-2">
      {visibleToasts.map((toast) => {
        const Icon = variantIcon[toast.variant];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm ${variantStyles[toast.variant]}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="leading-5">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
