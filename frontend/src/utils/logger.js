import { toast } from "@/hooks/use-toast";

class Logger {
  static error(message, error) {
    console.error(message, error);

    toast({
      variant: "destructive",
      title: message,
      // description: error?.message || "An unexpected error occurred",
    });
  }

  static success(message) {
    console.log(message);

    toast({
      title: message,
    });
  }

  static info(message) {
    console.info(message);
  }

  static debug(message, data) {
    if (process.env.NODE_ENV === "development") {
      console.debug(message, data);
    }
  }
}

export default Logger;
