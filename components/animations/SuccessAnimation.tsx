"use client";

import { motion } from "framer-motion";

interface SuccessAnimationProps {
  isCorrect: boolean;
}

export function SuccessAnimation({ isCorrect }: SuccessAnimationProps) {
  if (!isCorrect) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: 0,
        }}
        className="text-8xl"
      >
        ✓
      </motion.div>
    </motion.div>
  );
}

interface ShakeAnimationProps {
  children: React.ReactNode;
  shake: boolean;
}

export function ShakeAnimation({ children, shake }: ShakeAnimationProps) {
  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
