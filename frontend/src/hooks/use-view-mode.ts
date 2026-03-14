"use client";

import { useEffect, useState } from "react";

export type ViewMode = "table" | "card";

function getInitialViewMode(storageKey: string): ViewMode {
  if (typeof window === "undefined") return "table";

  const saved = window.localStorage.getItem(storageKey);
  if (saved === "table" || saved === "card") {
    return saved;
  }

  return window.matchMedia("(max-width: 768px)").matches ? "card" : "table";
}

export function useViewMode(storageKey: string) {
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    getInitialViewMode(storageKey)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, viewMode);
  }, [storageKey, viewMode]);

  return { viewMode, setViewMode };
}
