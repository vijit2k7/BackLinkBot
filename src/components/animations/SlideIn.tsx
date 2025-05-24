import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  distance?: number;
  useInView?: boolean;
  once?: boolean;
  amount?: number;
}

/**
 * SlideIn component
 * 
 * Animates elements sliding into view from a specified direction.
 * Configurable for timing, distance, and when to trigger.
 */
const SlideIn = ({
  children,
  className = "",
  direction = "up",
  duration = 0.6,
  delay = 0,
  distance = 50,
  useInView = true,
  once = true,
  amount = 0.1,
}: SlideInProps) => {
  const getDirection = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getDirection(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        duration,
        delay,
        bounce: 0.15,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={useInView ? undefined : "visible"}
      whileInView={useInView ? "visible" : undefined}
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn; 