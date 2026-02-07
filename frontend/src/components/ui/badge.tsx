import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "blue"
  | "yellow"
  | "purple"
  | "red"
  | "green";

const styles: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-700",
  blue: "bg-blue-50 text-blue-700",
  yellow: "bg-yellow-50 text-yellow-700",
  purple: "bg-purple-50 text-purple-700",
  red: "bg-red-50 text-red-700",
  green: "bg-green-50 text-green-700",
};

export default function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs rounded-md font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
