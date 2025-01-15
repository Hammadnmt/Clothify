import { useState } from "react";
import UserFormDialog from "@/components/admin/UserFormDialog";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/services/usersApi";
import { useSearchParams } from "react-router";
import Paginate from "@/components/Paginate";
import ReusableDataTable from "@/components/admin/ReusableDataTable";
import SingleUser from "./SingleUser";
import { userTableConfig } from "@/utils/tableConfig";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import Logger from "@/utils/logger";
import SearchBar from "@/components/SearchBar";
import InventoryLayout from "@/components/admin/InventoryLayout";
import { useDebounce } from "@/hooks/useDebounce";
import { useUploadUserProfileImageMutation } from "@/services/uploadApi";
import UserFilter from "@/components/admin/UserFilter";

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { error, handleError, clearError } = useErrorHandler();

  const filters = Object.fromEntries(searchParams.entries());

  const {
    data: users,
    isLoading,
    isError,
  } = useGetUsersQuery({ ...filters, search: debouncedQuery });

  const [
    createUser,
    { isLoading: createLoading, error: createError, isSuccess: createSuccess },
  ] = useCreateUserMutation();

  const [
    deleteUser,
    {
      isLoading: deleteLoading,
      isError: deleteError,
      isSuccess: deleteSuccess,
    },
  ] = useDeleteUserMutation();

  const [
    updateUser,
    {
      isLoading: updateLoading,
      isError: updateError,
      isSuccess: updateSuccess,
    },
  ] = useUpdateUserMutation();

  const [
    uploadUserProfileImage,
    {
      isLoading: uploadLoading,
      isError: uploadError,
      isSuccess: uploadSuccess,
    },
  ] = useUploadUserProfileImageMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  const handlePageChange = (page) => {
    Logger.debug(`Changing to page: ${page}`);
    setSearchParams({ page });
  };

  const handleUserDelete = async (id) => {
    if (deleteLoading) return;

    try {
      await deleteUser(id).unwrap();
      Logger.success("User deleted successfully");
      clearError();
    } catch (err) {
      handleError("Failed to delete user", err);
    }
  };

  const handleUserUpdate = async (updatedData, id) => {
    if (updateLoading) return;

    try {
      await updateUser({ data: updatedData, id }).unwrap();
      Logger.success("User updated successfully");
      setDialogOpen(false);
      clearError();
    } catch (err) {
      handleError("Failed to update user", err);
    }
  };

  const handleUserCreation = async (data) => {
    if (createLoading) return;

    try {
      await createUser(data).unwrap();
      Logger.success("User created successfully");
      setDialogOpen(false);
      clearError();
    } catch (err) {
      handleError("Failed to create user", err);
    }
  };

  // const handleImageUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   const response = await uploadUserProfileImage(formData).unwrap();
  //   console.log(response);
  //   return response.imageUrl;
  // };

  const handleDialogChange = (isOpen) => {
    if (!createLoading) {
      setDialogOpen(isOpen);
    }
  };

  return (
    <InventoryLayout
      title="Users"
      isDialogOpen={isDialogOpen}
      handleDialogChange={handleDialogChange}
      handleAddClick={() => !createLoading && setDialogOpen(true)}
      isLoading={isLoading || createLoading || updateLoading || deleteLoading}
      DialogComponent={
        <UserFormDialog
          // onImageUpload={handleImageUpload}
          onSubmit={handleUserCreation}
          isLoading={createLoading}
          isEdit={false}
        />
      }
      FilterComponent={<UserFilter />}
      SearchComponent={
        <SearchBar
          placeholder="Search Users..."
          className="flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      }
      TableComponent={
        <ReusableDataTable
          data={users?.data}
          columns={userTableConfig}
          onView={(id) => console.log("Viewing", id)}
          onEdit={(user, id) => handleUserUpdate(user, id)}
          onDelete={(id) => handleUserDelete(id)}
          ViewComponent={SingleUser}
          EditFormComponent={UserFormDialog}
          caption="A list of registered users."
          isLoading={
            isLoading || createLoading || updateLoading || deleteLoading
          }
        />
      }
      PaginationComponent={
        <Paginate
          currentPage={users?.pagination?.currentPage}
          totalPages={users?.pagination?.totalPages}
          onPageChange={(page) => handlePageChange(page)}
        />
      }
    />
  );
}
