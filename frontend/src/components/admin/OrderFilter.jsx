import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X, CalendarIcon } from "lucide-react";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

const OrderFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilters = {
    orderStatus: searchParams.get("orderStatus") || "",
    paymentStatus: searchParams.get("paymentStatus") || "",
    paymentMethod: searchParams.get("paymentMethod") || "",
    minTotal: Number(searchParams.get("minTotal")) || 0,
    maxTotal: Number(searchParams.get("maxTotal")) || 10000,
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    sortBy: searchParams.get("sortBy") || "",
  };

  const [filters, setFilters] = useState(currentFilters);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFilters(currentFilters);
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        (key === "minTotal" && value === 0) ||
        (key === "maxTotal" && value === 10000)
      ) {
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
      orderStatus: "",
      paymentStatus: "",
      paymentMethod: "",
      minTotal: 0,
      maxTotal: 10000,
      startDate: "",
      endDate: "",
      sortBy: "",
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
      if (key === "sortBy") return count;
      if (key === "minTotal" && value === 0) return count;
      if (key === "maxTotal" && value === 10000) return count;
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
            <SheetTitle>Order Filters</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 mt-4 h-[calc(100vh-10rem)] overflow-y-auto">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date: Newest First</SelectItem>
                <SelectItem value="date-asc">Date: Oldest First</SelectItem>
                <SelectItem value="total-desc">Total: High to Low</SelectItem>
                <SelectItem value="total-asc">Total: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.orderStatus}
              onValueChange={(value) =>
                handleFilterChange("orderStatus", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.paymentStatus}
              onValueChange={(value) =>
                handleFilterChange("paymentStatus", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.paymentMethod}
              onValueChange={(value) =>
                handleFilterChange("paymentMethod", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Cash on Delivery">
                  Cash on Delivery
                </SelectItem>
              </SelectContent>
            </Select>

            <div>
              <p className="text-sm mb-2">Total Amount Range</p>
              <Slider
                defaultValue={[filters.minTotal, filters.maxTotal]}
                max={10000}
                step={100}
                className="w-full"
                onValueChange={([min, max]) => {
                  handleFilterChange("minTotal", min);
                  handleFilterChange("maxTotal", max);
                }}
              />
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>${filters.minTotal}</span>
                <span>${filters.maxTotal}</span>
              </div>
            </div>

            {/* <div className="space-y-2">
              <p className="text-sm">Start Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.startDate && "text-muted-foreground"
                    )}
                  >
                    {filters.startDate ? (
                      format(new Date(filters.startDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.startDate
                        ? new Date(filters.startDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      handleFilterChange(
                        "startDate",
                        date ? date.toISOString() : ""
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <p className="text-sm">End Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.endDate && "text-muted-foreground"
                    )}
                  >
                    {filters.endDate ? (
                      format(new Date(filters.endDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.endDate ? new Date(filters.endDate) : undefined
                    }
                    onSelect={(date) =>
                      handleFilterChange(
                        "endDate",
                        date ? date.toISOString() : ""
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

export default OrderFilter;
