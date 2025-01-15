import { useState, useRef } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, Plus, Upload, X } from "lucide-react";
import LoadingSpinner from "../ui/loadingSpinner";
import {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/services/categoryApi";
import { Textarea } from "../ui/textarea";
import useFormValidation from "@/hooks/useFormValidation";
import { productValidationSchema } from "@/validationSchemas/product";
import FormError from "../FormError";
import { useFieldArray } from "react-hook-form";
import { useGetBrandsQuery } from "@/services/brandApi";
import { MAX_PRODUCT_IMAGES, SIZES } from "@/constants";

export default function ProductFormDialog({
  onSubmit,
  data = {},
  isEdit = false,
  isLoading = false,
}) {
  const product = data || {};
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(() => {
    if (isEdit && product.images) {
      return product.images.reduce((acc, imageUrl) => {
        acc[imageUrl] = { isExisting: true, url: imageUrl };
        return acc;
      }, {});
    }
    return {};
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useFormValidation(productValidationSchema, {
    name: product.name || "",
    description: product.description || "",
    price: {
      base: product.price?.base?.toFixed(2) || 0,
      sale: product.price?.sale?.toFixed(2) || null,
      currency: product.price?.currency || "USD",
    },
    category: product.category?._id || "",
    subCategory: product.subCategory?._id || "",
    brand: product.brand?._id || "",
    variants: product.variants || [{ sizes: [], color: "" }],
    materials: product.materials || [],
    tags: product.tags || [],
    seasonality: product.seasonality || "",
    gender: product.gender || "",
    images: product.images || [],
  });

  const {
    fields: variants,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const { data: categories } = useGetCategoriesQuery();
  const { data: subCategories } = useGetSubCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const currentImages = watch("images") || [];

    if (currentImages.length + files.length > MAX_PRODUCT_IMAGES) {
      alert(`Maximum ${MAX_PRODUCT_IMAGES} images allowed`);
      return;
    }

    const newImagePreviews = {};
    const newImages = files.map((file) => {
      const imageUrl = URL.createObjectURL(file);
      newImagePreviews[imageUrl] = file;
      return file;
    });

    setImagePreview((prev) => ({
      ...prev,
      ...newImagePreviews,
    }));

    setValue("images", [...currentImages, ...newImages]);
  };

  const removeImage = ({ imageUrl, imageFile }) => {
    if (imageFile?.isExisting) {
      const newPreviews = { ...imagePreview };
      delete newPreviews[imageUrl];
      setImagePreview(newPreviews);

      const currentImages = watch("images") || [];
      setValue(
        "images",
        currentImages.filter((img) => img !== imageUrl)
      );
    } else {
      const currentImages = watch("images") || [];
      const newImages = currentImages.filter(
        (image) => image.name !== imageFile.name
      );
      setValue("images", newImages);
      URL.revokeObjectURL(imageUrl);

      const newPreviews = { ...imagePreview };
      delete newPreviews[imageUrl];
      setImagePreview(newPreviews);
    }
  };

  const handleSizeStockChange = (variantIndex, size, stock) => {
    const currentSizes = watch(`variants.${variantIndex}.sizes`) || [];
    const sizeIndex = currentSizes.findIndex((s) => s.size === size);

    if (sizeIndex === -1) {
      setValue(`variants.${variantIndex}.sizes`, [
        ...currentSizes,
        { size, stock: parseInt(stock) || 0 },
      ]);
    } else {
      const newSizes = [...currentSizes];
      newSizes[sizeIndex].stock = parseInt(stock) || 0;
      setValue(`variants.${variantIndex}.sizes`, newSizes);
    }
  };

  const removeSize = (variantIndex, sizeToRemove) => {
    const currentSizes = watch(`variants.${variantIndex}.sizes`) || [];
    setValue(
      `variants.${variantIndex}.sizes`,
      currentSizes.filter((s) => s.size !== sizeToRemove)
    );
  };

  const onSubmitForm = (formData) => {
    if (isLoading) return;

    const data = new FormData();

    formData.images.forEach((image) => {
      if (typeof image === "string") {
        data.append("existingImages", image);
      } else {
        data.append("images", image);
      }
    });

    const processedData = {
      ...formData,
      materials: Array.isArray(formData.materials)
        ? formData.materials
        : formData.materials?.split(","),
      tags: Array.isArray(formData.tags)
        ? formData.tags
        : formData.tags?.split(","),
      variants: formData.variants.map((variant) => ({
        color: variant.color,
        sizes: variant.sizes.map((size) => ({
          size: size.size,
          stock: parseInt(size.stock),
        })),
      })),
    };

    for (const [key, value] of Object.entries(processedData)) {
      if (key !== "images" && key !== "existingImages") {
        data.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      }
    }

    if (isEdit) {
      onSubmit(data, product._id);
    } else {
      onSubmit(data);
    }

    reset();
    setImagePreview({});
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Update Product" : "Add Product"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the details of the existing product."
            : "Fill in the details to add a new product."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-4 max-h-[70vh] overflow-y-auto px-2"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            required
            id="name"
            type="text"
            placeholder="Enter product name"
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && <FormError message={errors?.name?.message} />}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows="3"
            placeholder="Enter product description"
            disabled={isLoading}
            {...register("description")}
          />
          {errors.description && (
            <FormError message={errors?.description?.message} />
          )}
        </div>

        <div className="space-y-4">
          <Label>Product Images ({MAX_PRODUCT_IMAGES} max)</Label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          <div className="flex flex-wrap gap-4">
            {Object.entries(imagePreview).map(([imageUrl, imageFile]) => (
              <div key={imageUrl} className="relative w-24 h-24">
                <img
                  src={imageFile.isExisting ? imageUrl : imageUrl}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage({ imageUrl, imageFile })}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}

            {Object.keys(imagePreview).length < MAX_PRODUCT_IMAGES && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
              >
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Upload</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Price Details</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                required
                placeholder="Base Price"
                type="number"
                step="0.01"
                disabled={isLoading}
                {...register("price.base")}
              />
              {errors.price?.base && (
                <FormError message={errors.price.base.message} />
              )}
            </div>
            <div>
              <Input
                placeholder="Sale Price (optional)"
                type="number"
                step="0.01"
                disabled={isLoading}
                {...register("price.sale")}
              />
            </div>
          </div>
          <Select
            value={watch("price.currency")}
            onValueChange={(value) => setValue("price.currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Variants</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ sizes: [], color: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>

          {variants.map((variant, variantIndex) => (
            <div key={variant.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Variant {variantIndex + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(variantIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <Label>Color</Label>
                <Input
                  {...register(`variants.${variantIndex}.color`)}
                  placeholder="Color"
                />
                {errors.variants?.[variantIndex]?.color && (
                  <FormError
                    message={errors.variants[variantIndex].color.message}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Sizes and Stock</Label>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(size) => {
                      const currentSizes =
                        watch(`variants.${variantIndex}.sizes`) || [];
                      if (!currentSizes.find((s) => s.size === size)) {
                        handleSizeStockChange(variantIndex, size, 0);
                      }
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Add size" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES.filter(
                        (size) =>
                          !watch(`variants.${variantIndex}.sizes`)?.find(
                            (s) => s.size === size
                          )
                      ).map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  {watch(`variants.${variantIndex}.sizes`)?.map((sizeObj) => (
                    <div key={sizeObj.size} className="flex items-center gap-2">
                      <div className="bg-gray-100 px-3 py-1 rounded-full min-w-[4rem] text-center">
                        {sizeObj.size}
                      </div>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        className="w-24"
                        value={sizeObj.stock}
                        onChange={(e) =>
                          handleSizeStockChange(
                            variantIndex,
                            sizeObj.size,
                            e.target.value
                          )
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSize(variantIndex, sizeObj.size)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            required
            disabled={isLoading}
            value={watch("category")}
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.data.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <FormError message={errors.category.message} />}
        </div>

        <div>
          <Label htmlFor="subCategory">SubCategory</Label>
          <Select
            required
            disabled={isLoading}
            value={watch("subCategory")}
            onValueChange={(value) => setValue("subCategory", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a sub-category" />
            </SelectTrigger>
            <SelectContent>
              {subCategories?.data
                ?.filter((sub) => sub?.category?._id === watch("category"))
                .map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.subCategory && (
            <FormError message={errors.subCategory.message} />
          )}
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Select
            disabled={isLoading}
            value={watch("brand")}
            onValueChange={(value) => setValue("brand", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {brands?.data.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.brand && <FormError message={errors.brand.message} />}
        </div>

        <div>
          <Label htmlFor="materials">Materials</Label>
          <Input
            id="materials"
            placeholder="Enter materials (comma-separated)"
            disabled={isLoading}
            {...register("materials")}
          />
          {errors.materials && <FormError message={errors.materials.message} />}
        </div>

        <div>
          <Label htmlFor="seasonality">Seasonality</Label>
          <Select
            disabled={isLoading}
            value={watch("seasonality")}
            onValueChange={(value) => setValue("seasonality", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select seasonality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spring">Spring</SelectItem>
              <SelectItem value="Summer">Summer</SelectItem>
              <SelectItem value="Autumn">Autumn</SelectItem>
              <SelectItem value="Winter">Winter</SelectItem>
              <SelectItem value="All-Season">All Season</SelectItem>
            </SelectContent>
          </Select>
          {errors.seasonality && (
            <FormError message={errors.seasonality.message} />
          )}
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            disabled={isLoading}
            value={watch("gender")}
            onValueChange={(value) => setValue("gender", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Men">Men</SelectItem>
              <SelectItem value="Women">Women</SelectItem>
              <SelectItem value="Kids">Kids</SelectItem>
              <SelectItem value="Unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <FormError message={errors.gender.message} />}
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Enter tags (comma-separated)"
            disabled={isLoading}
            {...register("tags")}
          />
          {errors.tags && <FormError message={errors.tags.message} />}
        </div>

        <div className="mt-4">
          <Button disabled={isLoading} className="w-full">
            {isLoading ? <LoadingSpinner /> : isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
