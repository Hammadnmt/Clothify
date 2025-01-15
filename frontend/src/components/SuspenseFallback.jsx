import React, { useState, useEffect } from "react";
import { motion, useAnimationControls, useSpring } from "framer-motion";
import { Sparkles, Scissors } from "lucide-react";

const GlowingOrb = ({ delay = 0 }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, []);

  return (
    <motion.div
      animate={controls}
      className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-rose-400 to-purple-500 blur-sm"
    />
  );
};

const FashionIcon = ({ index }) => {
  const yMotion = useSpring(0, {
    stiffness: 100,
    damping: 10,
  });

  useEffect(() => {
    const animation = setInterval(() => {
      yMotion.set(Math.random() * -20);
    }, 2000 + index * 500);

    return () => clearInterval(animation);
  }, []);

  return (
    <motion.div style={{ y: yMotion }} className="relative">
      <Sparkles className="w-6 h-6 text-purple-400" />
    </motion.div>
  );
};

const StitchLine = ({ index, total }) => {
  const position = (index / total) * 100;

  return (
    <motion.div
      className="absolute h-px w-8 bg-purple-300"
      style={{ left: `${position}%`, top: "50%" }}
      initial={{ scale: 0, rotate: 45 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay: index * 0.1,
        repeat: Infinity,
      }}
    />
  );
};

const RunwayLight = ({ position }) => {
  return (
    <motion.div
      className="absolute bottom-0 w-2 h-2 rounded-full bg-purple-400"
      style={{ left: `${position}%` }}
      initial={{ opacity: 0.3, scale: 1 }}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 2,
        delay: position / 100,
        repeat: Infinity,
      }}
    />
  );
};

const LoadingText = () => {
  const phrases = [
    "Curating Your Style",
    "Preparing the Runway",
    "Matching Colors",
    "Selecting Fabrics",
    "Finalizing Details",
  ];
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={phrases[currentPhrase]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-8 text-lg font-light text-purple-600"
    >
      {phrases[currentPhrase]}
    </motion.div>
  );
};

const ScissorsAnimation = () => {
  return (
    <motion.div
      animate={{
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="text-purple-600"
    >
      <Scissors className="w-12 h-12" />
    </motion.div>
  );
};

export default function SuspenseFallback() {
  const [progress, setProgress] = useState(0);
  const springProgress = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newProgress = progress + 1;
      if (newProgress <= 100) {
        setProgress(newProgress);
        springProgress.set(newProgress);
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Ambient Background Animation */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <GlowingOrb
            key={i}
            delay={i * 0.2}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Runway Lights */}
      <div className="absolute bottom-0 w-full h-px">
        {[...Array(10)].map((_, i) => (
          <RunwayLight key={i} position={i * 10} />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Brand Logo */}
        <motion.div
          className="text-6xl font-bold mb-12"
          animate={{
            backgroundImage: [
              "linear-gradient(to right, #f9a8d4, #e879f9)",
              "linear-gradient(to right, #e879f9, #f9a8d4)",
              "linear-gradient(to right, #f9a8d4, #e879f9)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Clothify
        </motion.div>

        {/* Fashion Icons Row */}
        <div className="flex space-x-8 mb-12">
          {[...Array(5)].map((_, i) => (
            <FashionIcon key={i} index={i} />
          ))}
        </div>

        {/* Scissors Animation */}
        <div className="mb-8">
          <ScissorsAnimation />
        </div>

        {/* Stitch Line Animation */}
        <div className="relative w-64 h-px mb-8">
          {[...Array(12)].map((_, i) => (
            <StitchLine key={i} index={i} total={12} />
          ))}
        </div>

        {/* Loading Text */}
        <LoadingText />

        {/* Progress Bar */}
        <div className="relative w-64 h-1 mt-8 rounded-full overflow-hidden bg-purple-950">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-rose-400 via-purple-400 to-rose-400 rounded-full"
            style={{ scaleX: springProgress.get() / 100, originX: 0 }}
          />
        </div>

        {/* Percentage */}
        <motion.div
          className="mt-4 text-purple-300 text-sm"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {Math.round(progress)}%
        </motion.div>
      </motion.div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/50 to-transparent" />
    </div>
  );
}
