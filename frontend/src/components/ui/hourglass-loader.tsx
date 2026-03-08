"use client";

import { useEffect, useState } from "react";

export default function HourglassLoader({
  label = "Loading...",
  size = 54,
  color = "#2563eb",
}: {
  label?: string;
  size?: number;
  color?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function registerLoader() {
      if (typeof window === "undefined") return;
      const { hourglass } = await import("ldrs");
      hourglass.register();
      if (active) setReady(true);
    }

    registerLoader().catch(() => {
      if (active) setReady(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-3 p-6 text-sm text-gray-500">
      {ready ? (
        <l-hourglass
          size={String(size)}
          bg-opacity="0.1"
          speed="1.75"
          color={color}
        ></l-hourglass>
      ) : (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      )}
      <span>{label}</span>
    </div>
  );
}
