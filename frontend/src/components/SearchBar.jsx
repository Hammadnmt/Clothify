import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search...",
  className = "",
  value,
  onChange,
}) {
  return (
    <>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-lg shadow-sm py-4 ${className}`}
        autoFocus
      />
      <Search className="absolute right-3 text-gray-400" size={20} />
    </>
  );
}
