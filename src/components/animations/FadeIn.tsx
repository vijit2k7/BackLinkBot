import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  useInView?: boolean;
  once?: boolean;
  amount?: number;
}

/**
 * FadeIn component
 * 
 * A versatile animation component that fades in elements with optional direction.
 * Can be configured to animate when in view or on mount.
 */
const FadeIn = ({
  children,
  className = "",
  direction = "up",
  duration = 0.4,
  delay = 0,
  useInView = true,
  once = true,
  amount = 0.1,
}: FadeInProps) => {
  const getDirection = () => {
    switch (direction) {
      case "up":
        return { y: 20 };
      case "down":
        return { y: -20 };
      case "left":
        return { x: 20 };
      case "right":
        return { x: -20 };
      default:
        return { y: 20 };
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
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
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

export default FadeIn; 