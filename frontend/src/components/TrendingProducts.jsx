import { useGetTrendingProductsQuery } from "@/services/productsApi";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./ui/loadingSpinner";
import { useNavigate } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useEffect, useState } from "react";
import VerticalProductCard from "./VerticalProductCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import Message from "./Message";

export default function TrendingProducts() {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();

  const { data: products, isLoading, isError } = useGetTrendingProductsQuery();
  const {
    favorites,
    isLoading: loadingFavorites,
    favoriteLoadingId,
    findFavorite,
    toggleFavorite,
  } = useFavorites();
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  const handleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleFav = async (e, productId) => {
    e.stopPropagation();

    try {
      await toggleFavorite(productId);
      clearError();
    } catch (error) {
      handleError(error?.message || "Failed to handle favorite", error);
    }
  };

  const isPageLoading = isLoading || loadingFavorites;

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (isError) {
    return <Message type="error" dismissible={false} title="👀 OOP's" />;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-900 font-semibold mb-6 relative after:absolute after:left-0 after:bottom-0 after:w-16 after:h-1 after:bg-pink-600 after:rounded-full">
        Trending Products
      </h2>
      <div className="py-6">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {products?.data.map((product) => (
              <CarouselItem
                key={product._id}
                className="md:basis-1/2 xl:basis-1/3"
              >
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={handleProduct}
                  handleFav={handleFav}
                  isFavorite={!!findFavorite(product._id)}
                  isLoading={favoriteLoadingId === product._id}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative w-full max-w-2xl h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-pink-600 transition-all"
              style={{ width: `${(current / count) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: count }, (_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  current === index + 1 ? "bg-pink-600" : "bg-gray-300"
                } transition-all`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
