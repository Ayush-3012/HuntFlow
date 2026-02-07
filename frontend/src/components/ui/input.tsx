import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
}
