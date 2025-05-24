import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  distance?: number;
}

/**
 * StaggerItem component
 * 
 * Child component for StaggerContainer.
 * Each item will animate based on the stagger timing of its parent.
 */
const StaggerItem = ({
  children,
  className = "",
  direction = "up",
  duration = 0.5,
  distance = 30,
}: StaggerItemProps) => {
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

  const itemVariants = {
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
        bounce: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
};

export default StaggerItem; 