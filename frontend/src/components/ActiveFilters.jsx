import { useSearchParams } from "react-router";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActiveFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const removeFilter = (key) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFilters = Array.from(searchParams.entries());

  return (
    <>
      {activeFilters.length > 0 ? (
        <div className="grid items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2 p-1">
          {activeFilters.map(([key, value]) => (
            <Badge
              key={key}
              className="flex items-center gap-1 px-3 text-xs bg-gray-200 text-gray-800 rounded-none justify-between hover:bg-gray-300"
            >
              {`${key}: ${value}`}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 p-0 hover:bg-gray-300"
                onClick={() => removeFilter(key)}
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
      ) : null}
    </>
  );
}
