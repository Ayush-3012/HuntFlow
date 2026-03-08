import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

export default function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) {
  if (!active) {
    return <FaSort className="text-xs text-gray-400" />;
  }

  return direction === "asc" ? (
    <FaSortUp className="text-xs text-gray-600" />
  ) : (
    <FaSortDown className="text-xs text-gray-600" />
  );
}
