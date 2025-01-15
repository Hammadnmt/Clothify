import { useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetProductsQuery } from "@/services/productsApi";
import { formatPrice } from "@/utils/helper";
import SearchBar from "./SearchBar";

export default function SearchSuggestions() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(
    { search: debouncedQuery },
    { skip: !debouncedQuery.trim() }
  );

  const results = debouncedQuery.trim() ? products?.data : [];
  const hasMoreResults = results?.length > 4;
  const displayedResults = results?.slice(0, 5);

  const handleViewMore = () => {
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          title="Search"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="top" className="p-4 bg-white border-b">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative flex items-center gap-2">
            <SearchBar
              placeholder="Search products..."
              className="flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : results?.length > 0 ? (
            <ScrollArea className="h-[60vh] md:h-[70vh] pr-4">
              <div className="space-y-2">
                {displayedResults.map((product) => (
                  <Card
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex items-center p-3 gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                        {product.price.sale && (
                          <Badge className="absolute top-0 right-0 bg-red-500">
                            Sale
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.ratings.average.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {product.ratings.count} reviews
                          </span>
                        </div>
                        <div className="mt-1">
                          {product.price.sale ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-500 font-medium">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice({ ...product.price, sale: null })}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                ))}

                {hasMoreResults && (
                  <Button
                    onClick={handleViewMore}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    View all results
                  </Button>
                )}
              </div>
            </ScrollArea>
          ) : (
            debouncedQuery.trim() !== "" && (
              <div className="text-center py-8 text-gray-500">
                No results found for "{debouncedQuery}"
              </div>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
