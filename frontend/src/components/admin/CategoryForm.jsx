import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
} from "@/services/categoryApi";
import { useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import { useToast } from "@/hooks/use-toast";
import Message from "../Message";

export default function CategoryForm() {
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const [
    createCategory,
    {
      isLoading: createLoading,
      isError: createError,
      isSuccess: createSuccess,
    },
  ] = useCreateCategoryMutation();

  const handleCreateCategory = async () => {
    if (!newCategory)
      return toast({
        variant: "destructive",
        title: "Please enter category",
      });

    try {
      await createCategory({ name: newCategory });
      setNewCategory("");
    } catch (error) {
      // console.log(error)
    }
  };

  if (isLoading || createLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <TabsContent value="category">
      {isError || createError ? (
        <Message
          type="error"
          title="Failed"
          className="mb-4"
          dismissible={false}
        />
      ) : null}
      {createSuccess ? (
        <Message
          type="success"
          title="Success"
          description="sub-category created successfully."
          dismissible={false}
          className="mb-4"
        />
      ) : null}
      <h2 className="text-lg font-bold mb-4">Add a Category</h2>
      <div className="space-y-4">
        <Input
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <Button onClick={handleCreateCategory} className="w-full">
          Add
        </Button>
      </div>
      <h3 className="text-lg font-semibold mt-6 mb-2">Existing Categories</h3>
      <ul className="space-y-2 overflow-y-auto h-32">
        {categories?.data?.map((category) => (
          <li key={category._id} className="p-2 bg-gray-100 rounded">
            {category.name}
          </li>
        ))}
      </ul>
    </TabsContent>
  );
}
