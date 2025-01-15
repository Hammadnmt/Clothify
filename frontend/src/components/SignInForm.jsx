import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useSigninMutation } from "@/services/usersApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/services/authSlice";
import useFormValidation from "@/hooks/useFormValidation";
import { signinSchema } from "@/validationSchemas/signin";
import LoadingSpinner from "./ui/loadingSpinner";
import FormError from "./FormError";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useEffect, useState } from "react";
import Logger from "@/utils/logger";
import { useVerifyCaptchaMutation } from "@/services/recaptchaApi";
import ReCAPTCHA from "react-google-recaptcha";

const siteKey = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY;

export default function SignInForm() {
  const [captchaValue, setCaptchaValue] = useState(null);

  const { error, clearError, handleError } = useErrorHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormValidation(signinSchema, {
    email: "sohaib@gmail.com",
    password: "password",
  });

  const [
    signin,
    { isLoading, isError, error: signinError, isSuccess, data: response },
  ] = useSigninMutation();
  const [verifyCaptcha, { isLoading: captchaLoading, isError: captchaError }] =
    useVerifyCaptchaMutation();

  useEffect(() => {
    if (isError && signinError) {
      handleError(signinError.data?.message, signinError);
    }
    if (isSuccess && response) {
      console.log(response);
      Logger.success("Welcome Back, Happy Shopping! 😊");
      const {
        token,
        data: { name, email: userEmail, role, emailVerified, phoneVerified },
      } = response;

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
      clearError();
      navigate("/");
    }
  }, [isSuccess, isError, signinError, response]);

  const onSubmit = async (data) => {
    if (!captchaValue) return Logger.error("Please complete the reCaptcha.");

    try {
      if (isLoading || captchaLoading) return;
      await verifyCaptcha({ token: captchaValue }).unwrap();

      await signin(data).unwrap();
    } catch (err) {
      // handleError(err.data?.message, err);
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 py-3">
        Welcome Back
      </h2>

      <div>
        <Input
          disabled={isLoading}
          type="email"
          placeholder="Email"
          className="w-full"
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
          {...register("password")}
        />
        {errors?.password && <FormError message={errors?.password?.message} />}
      </div>

      <div className="text-right text-sm">
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      <ReCAPTCHA
        sitekey={siteKey}
        onChange={(value) => setCaptchaValue(value)}
      />

      <Button
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? <LoadingSpinner /> : "Sign In"}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        Don't have an account?{" "}
        <Link to={"/account/signup"} className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
