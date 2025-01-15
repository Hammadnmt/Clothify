import { useGetProductsQuery } from "@/services/productsApi";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./ui/loadingSpinner";
import { useNavigate } from "react-router";
import { useFavorites } from "@/hooks/useFavorites";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import Message from "./Message";

export default function ProductCardGrid() {
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();
  const {
    data: products,
    isLoading: loadingProducts,
    isError,
  } = useGetProductsQuery();
  const {
    favorites,
    isLoading: loadingFavorites,
    favoriteLoadingId,
    findFavorite,
    toggleFavorite,
  } = useFavorites();

  const isPageLoading = loadingProducts || loadingFavorites;

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleFav = async (e, productId) => {
    e.stopPropagation();

    try {
      await toggleFavorite(productId);
      clearError();
    } catch (error) {
      if (error.status === 401) {
        handleError("Please Login to add Favorites");
      } else {
        handleError(error?.data?.message || "Failed to handle favorite", error);
      }
    }
  };

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
        Latest Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.data.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={handleProductClick}
            handleFav={handleFav}
            isFavorite={!!findFavorite(product._id)}
            isLoading={favoriteLoadingId === product._id}
          />
        ))}
      </div>
    </div>
  );
}
