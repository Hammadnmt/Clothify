import React, { useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "../ui/loadingSpinner";
import useFormValidation from "@/hooks/useFormValidation";
import FormError from "../FormError";

// Field type definitions
const FIELD_TYPES = {
  TEXT: "text",
  NUMBER: "number",
  EMAIL: "email",
  PASSWORD: "password",
  SELECT: "select",
  TEXTAREA: "textarea",
  NESTED: "nested",
};

export default function DynamicForm({
  formConfig,
  onSubmit,
  initialData = {},
  isEdit = false,
  isLoading = false,
}) {
  // Prepare initial state and validation schema from form configuration
  const { initialState, validationSchema } = useMemo(() => {
    const state = {};
    const schemaFields = {};

    formConfig.fields.forEach((field) => {
      // Handle nested fields
      if (field.type === FIELD_TYPES.NESTED) {
        state[field.name] = {};
        schemaFields[field.name] = {};

        field.nestedFields.forEach((nestedField) => {
          state[field.name][nestedField.name] =
            initialData[field.name]?.[nestedField.name] ||
            nestedField.defaultValue ||
            "";

          if (nestedField.validation) {
            schemaFields[field.name][nestedField.name] = nestedField.validation;
          }
        });
      } else {
        // Regular fields
        state[field.name] = initialData[field.name] || field.defaultValue || "";

        if (field.validation) {
          schemaFields[field.name] = field.validation;
        }
      }
    });

    return {
      initialState: state,
      validationSchema: formConfig.validationSchema || {},
    };
  }, [formConfig, initialData]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useFormValidation(validationSchema, initialState);

  const onSubmitForm = (data) => {
    if (isLoading) return;

    const processedData = formConfig.transformData
      ? formConfig.transformData(data, isEdit)
      : data;

    onSubmit(processedData, isEdit ? initialData._id : undefined);

    reset();
  };

  const renderField = (field) => {
    const watchedValue = watch(field.name);

    switch (field.type) {
      case FIELD_TYPES.SELECT:
        return (
          <Select
            required={field.required}
            disabled={isLoading || field.disabled}
            onValueChange={(value) => setValue(field.name, value)}
            value={watchedValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case FIELD_TYPES.TEXTAREA:
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            disabled={isLoading || field.disabled}
            rows={field.rows || 3}
            {...register(field.name)}
          />
        );

      case FIELD_TYPES.NESTED:
        return field.nestedFields.map((nestedField) => (
          <div key={nestedField.name}>
            <Label htmlFor={nestedField.name}>{nestedField.label}</Label>
            <Input
              required={nestedField.required}
              id={nestedField.name}
              type={nestedField.type || "text"}
              placeholder={nestedField.placeholder}
              disabled={isLoading || nestedField.disabled}
              {...register(`${field.name}.${nestedField.name}`)}
            />
            {errors[field.name]?.[nestedField.name] && (
              <FormError
                message={errors[field.name]?.[nestedField.name]?.message}
              />
            )}
          </div>
        ));

      default:
        return (
          <Input
            required={field.required}
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            disabled={isLoading || field.disabled}
            step={field.type === "number" ? "any" : undefined}
            {...register(field.name)}
          />
        );
    }
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {formConfig.title || (isEdit ? "Update Entry" : "Add New Entry")}
        </DialogTitle>
        <DialogDescription>
          {formConfig.description ||
            (isEdit
              ? "Update the details of the existing entry."
              : "Fill in the details to add a new entry.")}
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-4 max-h-[70vh] overflow-y-auto px-2"
      >
        {formConfig.fields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {renderField(field)}
            {errors[field.name] && (
              <FormError message={errors[field.name]?.message} />
            )}
          </div>
        ))}

        <div className="mt-4">
          <Button disabled={isLoading} className="w-full">
            {isLoading ? <LoadingSpinner /> : isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

DynamicForm.FIELD_TYPES = FIELD_TYPES;
