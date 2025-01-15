import React, { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/services/categoryApi";
import { useGetBrandsQuery } from "@/services/brandApi";
import LoadingSpinner from "../ui/loadingSpinner";

const ProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilters = {
    category: searchParams.get("category") || "",
    subCategory: searchParams.get("subCategory") || "",
    brand: searchParams.get("brand") || "",
    priceMin: Number(searchParams.get("priceMin")) || 0,
    priceMax: Number(searchParams.get("priceMax")) || 1000,
    sort: searchParams.get("sort") || "new-old",
    size: searchParams.get("size") || "",
    color: searchParams.get("color") || "",
    gender: searchParams.get("gender") || "",
    seasonality: searchParams.get("seasonality") || "",
    stock: searchParams.get("stock") || "",
  };

  const [filters, setFilters] = useState(currentFilters);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFilters(currentFilters);
  }, [searchParams]);

  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: subCategories, isLoading: subCategoriesLoading } =
    useGetSubCategoriesQuery();

  const { data: brands, isLoading: brandsLoading } = useGetBrandsQuery();

  const pageLoading =
    categoriesLoading || subCategoriesLoading || brandsLoading;

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        (key === "priceMin" && value === 0) ||
        (key === "priceMax" && value === 1000)
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
      category: "",
      subCategory: "",
      brand: "",
      priceMin: 0,
      priceMax: 1000,
      sort: "new-old",
      size: "",
      color: "",
      gender: "",
      seasonality: "",
      stock: "",
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
      if (key === "priceMin" && value === 0) return count;
      if (key === "priceMax" && value === 1000) return count;
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
            <SheetTitle>Filters</SheetTitle>
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
                <SelectItem value="low-high">Price: Low to High</SelectItem>
                <SelectItem value="high-low">Price: High to Low</SelectItem>
                <SelectItem value="new-old">Newest First</SelectItem>
                <SelectItem value="old-new">Oldest First</SelectItem>
                <SelectItem value="a-z">Name: A to Z</SelectItem>
                <SelectItem value="z-a">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.data.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.subCategory}
              onValueChange={(value) =>
                handleFilterChange("subCategory", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sub Category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.data.map((subCategory) => (
                  <SelectItem key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.brand}
              onValueChange={(value) => handleFilterChange("brand", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.data.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.gender}
              onValueChange={(value) => handleFilterChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Men">Men</SelectItem>
                <SelectItem value="Women">Women</SelectItem>
                <SelectItem value="Kids">Kids</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.size}
              onValueChange={(value) => handleFilterChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(
                  (size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={filters.seasonality}
              onValueChange={(value) =>
                handleFilterChange("seasonality", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                {["Spring", "Summer", "Autumn", "Winter", "All-Season"].map(
                  (season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={filters.stock}
              onValueChange={(value) => handleFilterChange("stock", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <p className="text-sm mb-2">Price Range</p>
              <Slider
                defaultValue={[filters.priceMin, filters.priceMax]}
                max={1000}
                step={10}
                className="w-full"
                onValueChange={([min, max]) => {
                  handleFilterChange("priceMin", min);
                  handleFilterChange("priceMax", max);
                }}
              />
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>${filters.priceMin}</span>
                <span>${filters.priceMax}</span>
              </div>
            </div>
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

export default ProductFilters;
