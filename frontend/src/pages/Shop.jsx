import { useNavigate, useSearchParams } from "react-router";
import { useGetProductsQuery } from "@/services/productsApi";
import ShopFilterSidebar from "@/components/ShopFilterSidebar";
import ProductCard from "@/components/ProductCard";
import Paginate from "@/components/Paginate";
import TrendingProducts from "@/components/TrendingProducts";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useFavorites } from "@/hooks/useFavorites";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import Message from "@/components/Message";

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());
  const { error, handleError, clearError } = useErrorHandler();

  const { data: products, isLoading, isError } = useGetProductsQuery(filters);
  const {
    favorites,
    isLoading: loadingFavorites,
    favoriteLoadingId,
    findFavorite,
    toggleFavorite,
  } = useFavorites();

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  const handleProduct = (id) => {
    return navigate(`/product/${id}`);
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
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Message
          type="error"
          dismissible={false}
          title="👀 OOP's"
          description="Error loading products"
        />
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <img
          src="/shop-cover-2.webp"
          alt="shop-cover"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-700 ease-out"
        />
        <div className="container mx-auto h-full relative z-20">
          <div className="flex items-center h-full px-6 lg:px-16">
            <div className="max-w-xl">
              <h1 className="text-white text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">
                  <span className="absolute top-1 left-1 text-pink-900 -z-10">
                    Clothify
                  </span>
                  Clothify
                </span>
              </h1>

              <p className="text-gray-200 text-sm sm:text-lg lg:text-xl mt-4 font-medium max-w-md">
                Redefine your wardrobe with our latest collection of styles and
                trends.
              </p>
              <p className="hidden sm:block text-gray-300 sm:text-base lg:text-lg mt-2 max-w-lg">
                From casuals to formals, we've got you covered!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        <ShopFilterSidebar />
        <div className="flex-1 pl-0 lg:pl-6">
          {products.data?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.data?.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={handleProduct}
                  handleFav={handleFav}
                  isFavorite={!!findFavorite(product._id)}
                  isLoading={favoriteLoadingId === product._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pb-4 border-b-2">
        <Paginate
          currentPage={products?.pagination?.currentPage}
          totalPages={products?.pagination?.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <TrendingProducts />
    </>
  );
}
