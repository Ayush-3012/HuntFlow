"use client";

import { useEffect } from "react";
import { hourglass } from "ldrs";

export default function HourglassLoader({
  label = "Loading...",
  size = 54,
  color = "#2563eb",
}: {
  label?: string;
  size?: number;
  color?: string;
}) {
  useEffect(() => {
    hourglass.register();
  }, []);

  return (
    <div className="p-6 text-sm text-gray-500 flex items-center gap-3">
      <l-hourglass
        size={String(size)}
        bg-opacity="0.1"
        speed="1.75"
        color={color}
      ></l-hourglass>
      <span>{label}</span>
    </div>
  );
}
