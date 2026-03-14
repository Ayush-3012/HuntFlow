"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { ViewMode } from "@/hooks/use-view-mode";

type ViewModeToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
};

export default function ViewModeToggle({
  value,
  onChange,
  className = "",
}: ViewModeToggleProps) {
  return (
    <div
      className={`inline-flex items-center rounded-lg border border-white/60 bg-white/70 p-1 shadow-[0_8px_24px_rgba(90,70,170,0.12)] backdrop-blur ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("table")}
        className={`inline-flex items-center gap-1 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
          value === "table"
            ? "bg-indigo-600 text-white"
            : "text-slate-700 hover:bg-white"
        }`}
      >
        <Table2 className="h-4 w-4" />
        <span className="max-md:hidden">Table</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("card")}
        className={`inline-flex items-center gap-1 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
          value === "card"
            ? "bg-indigo-600 text-white"
            : "text-slate-700 hover:bg-white"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="max-md:hidden">Card</span>
      </button>
    </div>
  );
}
