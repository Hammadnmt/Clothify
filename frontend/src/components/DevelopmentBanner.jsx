import { useState } from "react";

export default function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-200 text-yellow-900 p-4 text-center flex justify-between items-center sticky top-0 z-50">
      <p className="text-sm md:text-base">
        🚧 This website is under development. Some features may not work or are
        yet to be added. Stay tuned for updates! 🚀
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className="text-yellow-900 hover:text-yellow-700 font-bold text-lg px-2"
        aria-label="Close banner"
      >
        ✕
      </button>
    </div>
  );
}
