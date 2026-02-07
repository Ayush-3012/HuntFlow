import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  ghost: "hover:bg-gray-100 text-gray-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
