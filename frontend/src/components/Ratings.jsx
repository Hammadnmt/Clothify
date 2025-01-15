import { Star } from "lucide-react";

export default function Rating({
  average = 0,
  count = 0,
  className = "",
  starSize = "h-4 w-4",
}) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < average
                ? "fill-yellow-400 stroke-yellow-400"
                : "fill-gray-200 stroke-gray-200"
            }`}
          />
        ))}
      </div>

      {count > 0 && <span className="text-xs text-gray-500">({count})</span>}
    </div>
  );
}
