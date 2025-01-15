import "react-phone-number-input/style.css";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignupMutation } from "@/services/usersApi";
import LoadingSpinner from "./ui/loadingSpinner";
import { setCredentials } from "@/services/authSlice";
import useFormValidation from "@/hooks/useFormValidation";
import { signupSchema } from "@/validationSchemas/signup";
import FormError from "./FormError";
import Logger from "@/utils/logger";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useVerifyCaptchaMutation } from "@/services/recaptchaApi";

const siteKey = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY;

export default function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [captchaValue, setCaptchaValue] = useState(null);
  const { error, clearError, handleError } = useErrorHandler();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormValidation(signupSchema, {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [
    signup,
    { isLoading, isSuccess, isError, data: response, error: signupError },
  ] = useSignupMutation();
  const [verifyCaptcha, { isLoading: captchaLoading, isError: captchaError }] =
    useVerifyCaptchaMutation();

  useEffect(() => {
    if (isError && signupError) {
      handleError(signupError?.data?.message, signupError);
    }
    if (isSuccess && response) {
      Logger.success("Signed up successfully, Welcome 🎉");
      const {
        token,
        data: { name, email: userEmail, role, emailVerified, phoneVerified },
      } = response;
      clearError();
      dispatch(
        setCredentials({
          token,
          name,
          userEmail,
          role,
          emailVerified,
          phoneVerified,
        })
      );

      navigate("/check-email");
    }
  }, [isSuccess, response, isError, signupError]);

  const onSubmit = async (formData) => {
    if (!captchaValue) return Logger.error("Please complete the reCaptcha.");
    try {
      if (isLoading || captchaLoading) return;

      const { name: userName, email, phone, password } = formData;
      await verifyCaptcha({ token: captchaValue }).unwrap();
      await signup({
        name: userName,
        phone,
        email,
        password,
      }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 py-3">
        Create an Account
      </h2>
      <div>
        <Input
          disabled={isLoading}
          type="text"
          placeholder="Full Name"
          className="w-full"
          required
          {...register("name")}
        />
        {errors?.name && <FormError message={errors?.name?.message} />}
      </div>
      <div>
        <PhoneInputWithCountrySelect
          international
          countryCallingCodeEditable={false}
          defaultCountry="PK"
          disabled={isLoading}
          placeholder="phone"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          required
          {...register("phone")}
        />
        {errors?.phone && <FormError message={errors?.phone?.message} />}
      </div>
      <div>
        <Input
          disabled={isLoading}
          type="email"
          placeholder="Email"
          className="w-full"
          required
          {...register("email")}
        />
        {errors?.email && <FormError message={errors?.email?.message} />}
      </div>
      <div>
        <Input
          disabled={isLoading}
          type="password"
          placeholder="Password"
          className="w-full"
          required
          {...register("password")}
        />
        {errors?.password && <FormError message={errors?.password?.message} />}
      </div>
      <div>
        <Input
          disabled={isLoading}
          type="password"
          placeholder="Confirm Password"
          className="w-full"
          required
          {...register("confirmPassword")}
        />
        {errors?.confirmPassword && (
          <FormError message={errors?.confirmPassword?.message} />
        )}
      </div>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={(value) => setCaptchaValue(value)}
      />
      <Button
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {isLoading ? <LoadingSpinner /> : "Sign Up"}
      </Button>
      <p className="text-sm text-gray-500 text-center">
        Already have an account?{" "}
        <Link to={"/account/signin"} className="text-blue-600 hover:underline ">
          Sign in
        </Link>
      </p>
    </form>
  );
}
