import Button from "./button";

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="h-12 w-12 rounded-full bg-gray-100 mb-4" />

      <h3 className="font-semibold">{title}</h3>

      {description && (
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          {description}
        </p>
      )}

      {actionLabel && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
