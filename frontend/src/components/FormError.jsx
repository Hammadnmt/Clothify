export default function FormError({ message, className = "" }) {
  return (
    <p className={"text-red-500 text-sm mt-1" + className}>
      {message || "Something went wrong"}
    </p>
  );
}
