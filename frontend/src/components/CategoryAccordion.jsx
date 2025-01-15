import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import LoadingSpinner from "./ui/loadingSpinner";
import {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/services/categoryApi";

export default function CategoryAccordion({ className }) {
  const { data: categories, isLoading: loadingCategory } =
    useGetCategoriesQuery();
  const { data: subCategories, isLoading: loadingSubCategory } =
    useGetSubCategoriesQuery();

  return loadingCategory || loadingSubCategory ? (
    <div className="flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <Accordion type="single" collapsible>
      <div className={className}>
        {categories?.data?.map((category) => (
          <AccordionItem key={category._id} value={category?.name}>
            <AccordionTrigger>{category?.name}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 ml-1 overflow-y-auto md:overflow-hidden">
                {subCategories?.data
                  ?.filter((sub) => sub?.category?._id === category._id)
                  .map((subcategory) => (
                    <li key={subcategory._id}>
                      <Link
                        className="hover:underline text-slate-600"
                        to={`/shop?category=${category.name}&subCategory=${subcategory.name}`}
                      >
                        {subcategory.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </div>
    </Accordion>
  );
}
