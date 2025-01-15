import FormError from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import useFormValidation from "@/hooks/useFormValidation";
import { useResetPasswordMutation } from "@/services/usersApi";
import Logger from "@/utils/logger";
import { userPasswordSchema } from "@/validationSchemas/user";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading, isSuccess, isError }] =
    useResetPasswordMutation();
  const { error, clearError, handleError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormValidation(userPasswordSchema, {
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isSuccess) {
      Logger.success("😀 Password reset successfully, Kindly sign in!");
      clearError();
      reset();
      navigate("/account");
    }
  }, [isSuccess]);

  const submitForm = async (formData) => {
    if (isLoading) return;
    try {
      const { password } = formData;
      await resetPassword({ data: { password }, token }).unwrap();
    } catch (error) {
      handleError(error?.data?.message, error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Reset Your Password
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your new password below to reset your account password.
        </p>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-4">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </Label>
            <Input
              disabled={isLoading}
              type="password"
              id="password"
              placeholder="Enter your new password"
              className="w-full border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
              {...register("password")}
            />
            {errors?.password && (
              <FormError message={errors?.password?.message} />
            )}
          </div>
          <div className="mb-4">
            <Label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </Label>
            <Input
              disabled={isLoading}
              type="password"
              id="confirm-password"
              placeholder="Confirm your new password"
              className="w-full border-gray-300 focus:ring-green-500 focus:border-green-500"
              required
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword && (
              <FormError message={errors?.confirmPassword?.message} />
            )}
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          >
            {isLoading ? <LoadingSpinner /> : "Reset"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Back to
            <Link to="/account" className="text-green-600 hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
