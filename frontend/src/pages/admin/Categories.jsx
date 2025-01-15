import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryForm from "@/components/admin/CategoryForm";
import SubCategoryForm from "@/components/admin/SubCategoryForm";

export default function Categories() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger
              value="category"
              className="w-1/2 text-center font-medium"
            >
              Category
            </TabsTrigger>
            <TabsTrigger
              value="subCategory"
              className="w-1/2 text-center font-medium"
            >
              Sub-Category
            </TabsTrigger>
          </TabsList>

          <CategoryForm />

          <SubCategoryForm />
        </Tabs>
      </div>
    </div>
  );
}
