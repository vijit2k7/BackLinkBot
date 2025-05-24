import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  useInView?: boolean;
  once?: boolean;
  amount?: number;
}

/**
 * StaggerContainer component
 * 
 * Creates staggered animations for child elements.
 * Used to animate lists, grids, or any group of elements with a sequential effect.
 */
const StaggerContainer = ({
  children,
  className = "",
  delay = 0.1,
  staggerDelay = 0.1,
  useInView = true,
  once = true,
  amount = 0.1,
}: StaggerContainerProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
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
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
};

export default StaggerContainer; 