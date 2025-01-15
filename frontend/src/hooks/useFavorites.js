import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetMineFavoritesQuery,
} from "@/services/favoriteApi";
import { useState } from "react";

export function useFavorites() {
  const {
    data: favorites,
    isLoading: loadingFavorites,
    isError: errorFavorites,
  } = useGetMineFavoritesQuery();
  const [createFavorite] = useCreateFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);

  const isLoading = loadingFavorites;

  const findFavorite = (productId) =>
    favorites?.data.find((item) => item.productId._id === productId);

  const toggleFavorite = async (productId) => {
    setFavoriteLoadingId(productId);

    try {
      const favorite = findFavorite(productId);
      if (favorite) {
        await deleteFavorite(favorite._id).unwrap();
      } else {
        await createFavorite({ productId }).unwrap();
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
      throw error;
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  return {
    favorites: favorites?.data || [],
    isLoading,
    errorFavorites,
    favoriteLoadingId,
    findFavorite,
    toggleFavorite,
  };
}
