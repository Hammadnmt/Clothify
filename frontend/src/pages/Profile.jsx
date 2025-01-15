import { Card } from "@/components/ui/card";
import { Smile } from "lucide-react";
import ProfileSection from "@/components/ProfileSection";
import AddressSection from "@/components/AddressSection";
import OrdersSection from "@/components/OrdersSection";
import FavoritesSection from "@/components/FavoritesSection";
import {
  useDeleteAddressMutation,
  useGetMineQuery,
  useUpdateAddressMutation,
  useUpdateMineMutation,
} from "@/services/usersApi";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useGetMineOrderQuery } from "@/services/ordersApi";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useFavorites } from "@/hooks/useFavorites";
import Logger from "@/utils/logger";
import { useSearchParams } from "react-router";

const WelcomeBanner = ({ username }) => (
  <Card className="p-6 shadow-lg bg-gradient-to-r from-pink-400 to-purple-500 text-white">
    <div className="flex flex-col md:flex-row items-center gap-4">
      <Smile className="w-12 h-12" />
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {username}!
        </h1>
        <p className="text-sm md:text-base mt-2">
          Manage your profile, orders, and favorites all in one place.
        </p>
      </div>
    </div>
  </Card>
);

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  const { error, handleError, clearError } = useErrorHandler();
  const {
    data: user,
    isLoading: loadingUser,
    isError: errorUser,
    isSuccess: successUser,
  } = useGetMineQuery();
  const {
    data: orders,
    isLoading: loadingOrder,
    isError: errorOrder,
    isSuccess: successOrder,
  } = useGetMineOrderQuery({ ...filters });
  const {
    favorites,
    isLoading: loadingFav,
    favoriteLoadingId,
    findFavorite,
    toggleFavorite,
  } = useFavorites();
  const [updateMine, { isLoading: loadingUpdateMine }] =
    useUpdateMineMutation();
  const [updateAddress, { isLoading: loadingUpdateAddress }] =
    useUpdateAddressMutation();
  const [deleteAddress, { isLoading: loadingDeleteAddress }] =
    useDeleteAddressMutation();

  const pageLoading = loadingUser || loadingOrder || loadingFav;
  const pageError = errorUser || errorOrder;
  const pageSuccess = successUser || successOrder;

  if (pageLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  // if (pageError) {
  //   handleError("Unable to fetch data, Please try again!");
  // }

  // if (pageSuccess) {
  //   clearError();
  // }

  const handlePageChange = (page) => {
    Logger.debug(`Changing to page: ${page}`);
    setSearchParams({ page });
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      if (loadingDeleteAddress) return;
      await deleteAddress({ _id: addressId }).unwrap();
      Logger.success("Address deleted successfully");
    } catch (error) {
      handleError(error.message || "An error occurred while deleting.");
    }
  };

  const handleUpdateAddress = async (address, id) => {
    try {
      if (loadingUpdateAddress) return;
      await updateAddress({ address, _id: id }).unwrap();
      Logger.success("Address updated successfully");
    } catch (error) {
      handleError(error.message || "An error occurred while updating");
    }
  };

  const handleUpdateMine = async (data) => {
    try {
      // console.log([...data.entries()]);
      if (loadingUpdateMine) return;
      await updateMine(data).unwrap();
      Logger.success("Updated Successfully");
    } catch (error) {
      handleError(error.message || "Update Failed");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <WelcomeBanner username={user.data?.name} />
      <ProfileSection user={user.data} onUpdateProfile={handleUpdateMine} />
      <AddressSection
        addresses={user.data.addresses}
        onAddAddress={handleUpdateAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
      />
      <OrdersSection
        orders={orders.data}
        pagination={orders.pagination}
        onPageChange={handlePageChange}
      />
      <FavoritesSection
        favorites={favorites}
        onRemove={(productId) => toggleFavorite(productId)}
      />
    </div>
  );
}
