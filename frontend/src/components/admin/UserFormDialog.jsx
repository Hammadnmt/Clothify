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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "../ui/loadingSpinner";
import useFormValidation from "@/hooks/useFormValidation";
import { userAddSchema, userUpdateSchema } from "@/validationSchemas/user";
import FormError from "../FormError";
import { Trash2, Upload, X } from "lucide-react";

export default function UserFormDialog({
  onSubmit,
  data = {},
  isEdit = false,
  isLoading = false,
  // onImageUpload,
}) {
  const user = data || {};
  const [addresses, setAddresses] = useState(user.addresses || []);
  const [imagePreview, setImagePreview] = useState(user.image || "");
  const fileInputRef = useRef(null);

  const userSchema = isEdit ? userUpdateSchema : userAddSchema;
  const userStates = isEdit
    ? {
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        phone: user.phone || "",
        image: user.image || "",
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false,
        isActive: user.isActive || false,
      }
    : {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        phone: "",
        image: "",
        emailVerified: false,
        phoneVerified: false,
        isActive: true,
      };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useFormValidation(userSchema, userStates);

  const handleImagePreview = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    setValue("image", file);
  };

  const handleImageRemove = () => {
    URL.revokeObjectURL(imagePreview);
    setImagePreview("");
    setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        fullName: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
      },
    ]);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const updateAddress = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };

  const onSubmitForm = (data) => {
    if (isLoading) return;

    const imageFile = data.image;

    const formData = new FormData();

    for (const key in data) {
      if (key === "image") {
        formData.append("image", imageFile);
      } else {
        formData.append(key, data[key]);
      }
    }

    formData.append("addresses", JSON.stringify(addresses));

    if (isEdit) {
      onSubmit(formData, user._id);
    } else {
      onSubmit(formData);
    }

    reset();
    setAddresses([]);
    handleImageRemove();
  };

  const selectedRole = watch("role");

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Update User" : "Add User"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the details of the existing user."
            : "Fill in the details to add a new user."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-4 max-h-[70vh] overflow-y-auto px-2"
      >
        <div className="space-y-4">
          <Label htmlFor="image">Profile Image</Label>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            name="image"
            onChange={handleImagePreview}
          />

          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative w-24 h-24">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ) : (
              <div
                onClick={triggerFileInput}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
              >
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Upload</span>
              </div>
            )}

            {/* {!imagePreview && (
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                {isUploading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </>
                )}
              </Button>
            )} */}
          </div>
        </div>
        {/* <div>
          <Label htmlFor="image">Profile Image URL</Label>
          <Input
            id="image"
            type="url"
            placeholder="Enter image URL"
            disabled={isLoading}
            {...register("image")}
          />
          {errors.image && <FormError message={errors?.image?.message} />}
        </div> */}

        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            required={!isEdit}
            id="fullName"
            type="text"
            placeholder="Enter full name"
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && <FormError message={errors?.name?.message} />}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            required={!isEdit}
            id="email"
            type="email"
            placeholder="Enter email"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && <FormError message={errors?.email?.message} />}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            disabled={isLoading}
            {...register("phone")}
          />
          {errors.phone && <FormError message={errors?.phone?.message} />}
        </div>

        {!isEdit && (
          <>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                required={!isEdit}
                id="password"
                type="password"
                placeholder="Enter Password"
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <FormError message={errors?.password?.message} />
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                required={!isEdit}
                id="confirmPassword"
                type="password"
                placeholder="Enter Confirm Password"
                disabled={isLoading}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <FormError message={errors?.confirmPassword?.message} />
              )}
            </div>
          </>
        )}

        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            required={!isEdit}
            disabled={isLoading}
            onValueChange={(value) => setValue("role", value)}
            value={selectedRole}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <FormError message={errors?.role?.message} />}
        </div>

        <div className="flex gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailVerified"
              checked={watch("emailVerified")}
              onCheckedChange={(checked) => setValue("emailVerified", checked)}
            />
            <Label htmlFor="emailVerified">Email Verified</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="phoneVerified"
              checked={watch("phoneVerified")}
              onCheckedChange={(checked) => setValue("phoneVerified", checked)}
            />
            <Label htmlFor="phoneVerified">Phone Verified</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Addresses</Label>
            <Button type="button" variant="outline" onClick={addAddress}>
              Add Address
            </Button>
          </div>

          {addresses.map((address, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Address {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAddress(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={(e) =>
                      updateAddress(index, "fullName", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Address"
                    value={address.address}
                    onChange={(e) =>
                      updateAddress(index, "address", e.target.value)
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={address.city}
                      onChange={(e) =>
                        updateAddress(index, "city", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Postal Code"
                      value={address.postalCode}
                      onChange={(e) =>
                        updateAddress(index, "postalCode", e.target.value)
                      }
                    />
                  </div>
                  <Input
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) =>
                      updateAddress(index, "country", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
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
