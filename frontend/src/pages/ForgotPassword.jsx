import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForgotPasswordMutation } from "@/services/usersApi";
import useFormValidation from "@/hooks/useFormValidation";
import { userEmailSchema } from "@/validationSchemas/user";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import FormError from "@/components/FormError";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Logger from "@/utils/logger";

export default function ForgotPassword() {
  const [forgotPassword, { isLoading, isSuccess, isError }] =
    useForgotPasswordMutation();
  const { error, clearError, handleError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormValidation(userEmailSchema, {
    email: "",
  });

  useEffect(() => {
    if (isSuccess) {
      Logger.success(
        "✉ Password reset email sended successfully, Kindly Check your mail!"
      );
      clearError();
      reset();
    }
  }, [isSuccess]);

  const submitForm = async (formData) => {
    if (isLoading) return;
    try {
      const { email } = formData;
      await forgotPassword({ email }).unwrap();
    } catch (error) {
      handleError(error?.data?.message, error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Forgot Your Password?
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email address below and we’ll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-4">
            <Input
              disabled={isLoading}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full"
              required
              {...register("email")}
            />
            {errors?.email && <FormError message={errors?.email?.message} />}
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          >
            {isLoading ? <LoadingSpinner /> : "Send"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?
            <Link to="/account" className="text-green-600 hover:underline ml-1">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
