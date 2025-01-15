import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";
import CategoryAccordion from "./CategoryAccordion";
import { useSearchParams } from "react-router";
import ActiveFilters from "./ActiveFilters";

const sortOptions = [
  { id: "a-z", label: "Alphabetically, A-Z" },
  { id: "z-a", label: "Alphabetically, Z-A" },
  { id: "low-high", label: "Price, low to high" },
  { id: "high-low", label: "Price, high to low" },
  { id: "new-old", label: "Date, new to old" },
  { id: "old-new", label: "Date, old to new" },
];

export default function ShopFilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleCheckboxChange = (paramKey, value) => {
    const currentValues = searchParams.getAll(paramKey);

    if (currentValues.includes(value)) {
      searchParams.delete(paramKey);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => searchParams.append(paramKey, v));
    } else {
      searchParams.append(paramKey, value);
    }

    setSearchParams(searchParams);
  };

  const FilterContent = () => (
    <div className="space-y-6 p-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <CategoryAccordion
              className={"grid gap-3 p-4 scroll-smooth overflow-y-auto"}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sort">
          <AccordionTrigger>Sort</AccordionTrigger>
          <AccordionContent
            className={"flex flex-col justify-start items-start gap-2"}
          >
            {sortOptions.map((option) => (
              <div key={option.id} className="flex space-x-2">
                <Checkbox
                  id={option.id}
                  checked={searchParams.get("sort") === option.id}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      searchParams.set("sort", option.id);
                    } else {
                      searchParams.delete("sort");
                    }
                    setSearchParams(searchParams);
                  }}
                />
                <label className="text-slate-700" htmlFor={option.id}>
                  {option.label}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sizes">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent
            className={"flex flex-col justify-start items-start gap-2"}
          >
            {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(
              (size) => (
                <div key={size} className="flex space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={searchParams.getAll("size").includes(size)}
                    onCheckedChange={() => handleCheckboxChange("size", size)}
                  />
                  <label
                    htmlFor={`size-${size}`}
                    className="text-sm font-medium leading-none"
                  >
                    {size}
                  </label>
                </div>
              )
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <Slider
              className={"mt-2"}
              defaultValue={[0, 1000]}
              max={1000}
              step={10}
              onValueChange={(value) => {
                searchParams.set("priceMin", value[0]);
                searchParams.set("priceMax", value[1]);
                setSearchParams(searchParams);
              }}
            />
            <div className="flex justify-between text-sm mt-3">
              <span>${searchParams.get("priceMin") || 0}</span>
              <span>${searchParams.get("priceMax") || 1000}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="ratings">
          <AccordionTrigger>Ratings</AccordionTrigger>
          <AccordionContent
            className={"flex flex-col justify-start items-start gap-2"}
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={searchParams
                    .getAll("ratings")
                    .includes(rating.toString())}
                  onCheckedChange={() =>
                    handleCheckboxChange("ratings", rating.toString())
                  }
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-medium leading-none flex items-center"
                >
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent
            className={"flex flex-col justify-start items-start gap-2"}
          >
            <div className="flex space-x-2">
              <Checkbox
                id={"stock"}
                checked={searchParams.get("stock") === "in"}
                onCheckedChange={(checked) => {
                  if (checked) {
                    searchParams.set("stock", "in");
                  } else {
                    searchParams.delete("stock");
                  }
                  setSearchParams(searchParams);
                }}
              />
              <label
                htmlFor={"stock"}
                className="text-sm font-medium leading-none flex items-center"
              >
                Stock
              </label>
            </div>
            <div className="flex space-x-2">
              <Checkbox
                id={"out-of-stock"}
                checked={searchParams.get("stock") === "out"}
                onCheckedChange={(checked) => {
                  if (checked) {
                    searchParams.set("stock", "out");
                  } else {
                    searchParams.delete("stock");
                  }
                  setSearchParams(searchParams);
                }}
              />
              <label
                htmlFor={"out-of-stock"}
                className="text-sm font-medium leading-none flex items-center"
              >
                Out of Stock
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      <div className="space-y-2">
        <ActiveFilters />
        <div className="lg:hidden flex justify-between items-center">
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="mb-2">
                <Filter className="mr-1" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block w-64 border-r pr-4">
          <FilterContent />
        </div>
      </div>
    </>
  );
}
