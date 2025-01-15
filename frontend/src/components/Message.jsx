import { cn } from "@/lib/utils";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";

/**
 * @typedef {"success" | "error" | "warning" | "info"} MessageType
 */

/**
 * A reusable message component to display alerts.
 *
 * @param {Object} props
 * @param {MessageType} props.type - The type of the message ("success", "error", "warning", "info").
 * @param {string} [props.title="Default Message"] - The title of the message.
 * @param {string} [props.description="Something happened. Please try again."] - The description of the message.
 * @param {string} [props.className=""] - Additional CSS classes for styling.
 * @param {boolean} [props.dismissible=true] - Whether the message can be dismissed.
 * @param {() => void} [props.onDismiss] - Callback function when dismissed.
 */
export default function Message({
  type = "info",
  title = "Default Message",
  description = "Something happened. Please try again.",
  className = "",
  dismissible = true,
  onDismiss,
}) {
  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <Alert
      className={cn(
        "w-full max-w-md p-4 rounded-lg shadow-md border flex items-start gap-4",
        getAlertStyles(),
        className
      )}
    >
      <div>
        <AlertTitle className="font-semibold">{title}</AlertTitle>
        <AlertDescription className="text-sm">{description}</AlertDescription>
      </div>
      {dismissible && (
        <button
          className="ml-auto text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </Alert>
  );
}
