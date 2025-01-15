import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "../ui/tabs";
import {
  useCreateSubCategoryMutation,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/services/categoryApi";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LoadingSpinner from "../ui/loadingSpinner";
import { useToast } from "@/hooks/use-toast";
import Message from "../Message";

export default function SubCategoryForm() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const { toast } = useToast();
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const {
    data: subCategories,
    isLoading,
    isError,
  } = useGetSubCategoriesQuery();

  const [
    createSubCategory,
    {
      isLoading: createLoading,
      isError: createError,
      isSuccess: createSuccess,
    },
  ] = useCreateSubCategoryMutation();

  const handleCreateSubCategory = async () => {
    if (!newSubCategory || !selectedCategory)
      return toast({
        variant: "destructive",
        title: "Please enter sub-category or select category",
      });
    try {
      await createSubCategory({
        name: newSubCategory,
        category: selectedCategory,
      });
      setNewSubCategory("");
    } catch (error) {
      // console.log(error);
    }
  };

  if (isLoading || categoriesLoading || createLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <TabsContent value="subCategory">
      {isError || categoriesError || createError ? (
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
      <h2 className="text-lg font-bold mb-4">Add a Sub-Category</h2>
      <div className="space-y-4">
        <Select
          onValueChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.data?.map((category) => (
              <SelectItem key={category._id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Enter sub-category name"
          value={newSubCategory}
          onChange={(e) => setNewSubCategory(e.target.value)}
        />
        <Button onClick={handleCreateSubCategory} className="w-full">
          Add
        </Button>
      </div>
      <h3 className="text-lg font-semibold mt-6 mb-2">
        Existing Sub-Categories for {selectedCategory || ""}
      </h3>
      <ul className="space-y-2 overflow-y-auto h-32">
        {subCategories?.data
          ?.filter((sub) => sub?.category?.name === selectedCategory)
          ?.map((sub) => (
            <li key={sub._id} className="p-2 bg-gray-100 rounded">
              {sub.name}{" "}
              <span className="text-sm text-gray-500">
                ({sub?.category?.name})
              </span>
            </li>
          ))}
      </ul>
    </TabsContent>
  );
}
