import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X, Calendar as CalendarIcon } from "lucide-react";
import { useSearchParams } from "react-router";
import { format } from "date-fns";

const UserFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentFilters = {
    role: searchParams.get("role") || "",
    emailVerified: searchParams.get("emailVerified") || "",
    phoneVerified: searchParams.get("phoneVerified") || "",
    isActive: searchParams.get("isActive") || "",
    sort: searchParams.get("sort") || "newest",
    createdAtStart: searchParams.get("createdAtStart") || "",
    createdAtEnd: searchParams.get("createdAtEnd") || "",
    lastLoginStart: searchParams.get("lastLoginStart") || "",
    lastLoginEnd: searchParams.get("lastLoginEnd") || "",
    country: searchParams.get("country") || "",
  };

  const [filters, setFilters] = useState(currentFilters);
  useEffect(() => {
    setFilters(currentFilters);
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(filters).forEach(([key, value]) => {
      if (value === "" || value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });

    const page = searchParams.get("page");
    if (page) {
      newSearchParams.set("page", "1");
    }

    setSearchParams(newSearchParams);
    setOpen(false);
  };

  const clearFilters = () => {
    const defaultFilters = {
      role: "",
      emailVerified: "",
      phoneVerified: "",
      isActive: "",
      sort: "newest",
      createdAtStart: "",
      createdAtEnd: "",
      lastLoginStart: "",
      lastLoginEnd: "",
      country: "",
    };
    setFilters(defaultFilters);

    const newSearchParams = new URLSearchParams();
    const page = searchParams.get("page");
    if (page) newSearchParams.set("page", page);

    setSearchParams(newSearchParams);
    setOpen(false);
  };

  const activeFilterCount = Object.entries(filters).reduce(
    (count, [key, value]) => {
      if (key === "sort") return count;
      return value ? count + 1 : count;
    },
    0
  );

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>User Filters</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 mt-4 h-[calc(100vh-10rem)] overflow-y-auto">
            <Select
              value={filters.sort}
              onValueChange={(value) => handleFilterChange("sort", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="last-active">Last Active</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.role}
              onValueChange={(value) => handleFilterChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.emailVerified}
              onValueChange={(value) =>
                handleFilterChange("emailVerified", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Email Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Not Verified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.phoneVerified}
              onValueChange={(value) =>
                handleFilterChange("phoneVerified", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Phone Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Not Verified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.isActive}
              onValueChange={(value) => handleFilterChange("isActive", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Account Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* <div className="space-y-2">
              <p className="text-sm font-medium">Created Date Range</p>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.createdAtStart
                        ? format(new Date(filters.createdAtStart), "PPP")
                        : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filters.createdAtStart
                          ? new Date(filters.createdAtStart)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange(
                          "createdAtStart",
                          date?.toISOString()
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.createdAtEnd
                        ? format(new Date(filters.createdAtEnd), "PPP")
                        : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filters.createdAtEnd
                          ? new Date(filters.createdAtEnd)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange("createdAtEnd", date?.toISOString())
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Last Login Range</p>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.lastLoginStart
                        ? format(new Date(filters.lastLoginStart), "PPP")
                        : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filters.lastLoginStart
                          ? new Date(filters.lastLoginStart)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange(
                          "lastLoginStart",
                          date?.toISOString()
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.lastLoginEnd
                        ? format(new Date(filters.lastLoginEnd), "PPP")
                        : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        filters.lastLoginEnd
                          ? new Date(filters.lastLoginEnd)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange("lastLoginEnd", date?.toISOString())
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div> */}
          </div>

          <SheetFooter className="mt-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Clear Filters
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserFilter;
