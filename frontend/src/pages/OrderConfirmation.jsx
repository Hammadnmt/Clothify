import { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useParams, useNavigate } from "react-router";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import Logger from "@/utils/logger";
import { StripeWrapper } from "@/components/StripeWrapper";
import { useDispatch } from "react-redux";
import { resetCart } from "@/services/cartSlice";

function OrderConfirmationContent() {
  const stripe = useStripe();
  const dispatch = useDispatch();

  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      navigate(`/ordersummary/${orderId}`);
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent.status) {
          case "succeeded":
            setStatus("success");
            Logger.success("Payment successful!");

            setTimeout(() => {
              dispatch(resetCart());

              navigate(`/ordersummary/${orderId}`);
            }, 2000);
            break;
          case "processing":
            setStatus("processing");
            Logger.info("Your payment is processing.");
            setTimeout(() => {
              navigate(`/ordersummary/${orderId}`);
            }, 2000);
            break;
          case "requires_payment_method":
            setStatus("failed");
            Logger.error("Your payment was not successful, please try again.");
            setTimeout(() => {
              navigate("/checkout");
            }, 2000);
            break;
          default:
            setStatus("error");
            Logger.error("Something went wrong.");
            setTimeout(() => {
              navigate("/checkout");
            }, 2000);
            break;
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setStatus("error");
        Logger.error("An error occurred while processing your payment.");
        setTimeout(() => {
          navigate("/checkout");
        }, 2000);
      });
  }, [stripe, orderId, navigate]);

  const statusMessages = {
    processing: "Processing your payment...",
    success: "Payment successful! Redirecting to order summary...",
    failed: "Payment failed. Redirecting to checkout...",
    error: "An error occurred. Redirecting...",
  };

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <LoadingSpinner />
          <p className="text-center text-lg">{statusMessages[status]}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// The wrapper component that provides Stripe context
export default function OrderConfirmation() {
  return (
    <StripeWrapper>
      <OrderConfirmationContent />
    </StripeWrapper>
  );
}
