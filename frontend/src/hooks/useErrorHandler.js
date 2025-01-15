import { useState } from "react";
import Logger from "@/utils/logger";

export const useErrorHandler = () => {
  const [error, setError] = useState({
    hasError: false,
    errorMessage: null,
  });

  const handleError = (errorMessage, originalError) => {
    Logger.error(errorMessage, originalError);
    setError({
      hasError: true,
      errorMessage,
    });
  };

  const clearError = () => {
    setError({
      hasError: false,
      errorMessage: null,
    });
  };

  return {
    error,
    handleError,
    clearError,
  };
};
