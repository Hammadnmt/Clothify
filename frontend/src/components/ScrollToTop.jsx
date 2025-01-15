import { useEffect } from "react";
import { useLocation } from "react-router";
import { animate } from "framer-motion";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      const controls = animate(window.scrollY, 0, {
        duration: 0.5,
        onUpdate: (value) => {
          window.scrollTo(0, value);
        },
      });

      return () => controls.stop();
    };

    scrollToTop();
  }, [location]);

  return null;
}
