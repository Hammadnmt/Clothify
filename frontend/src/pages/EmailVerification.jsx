import EmailVerificationFailed from "@/components/EmailVerificationFailed";
import EmailVerificationSuccess from "@/components/EmailVerificationSuccess";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useVerifyEmailQuery } from "@/services/usersApi";
import { useParams } from "react-router";

export default function EmailVerification() {
  const { token } = useParams();
  const { isLoading, isSuccess } = useVerifyEmailQuery(token);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      {isSuccess ? <EmailVerificationSuccess /> : <EmailVerificationFailed />}
    </div>
  );
}
