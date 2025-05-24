import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  from?: number;
  duration?: number;
  delay?: number;
  useInView?: boolean;
  once?: boolean;
  amount?: number;
}

/**
 * ScaleIn component
 * 
 * Animates elements scaling from a starting size to their normal size.
 * Useful for emphasizing important elements or buttons.
 */
const ScaleIn = ({
  children,
  className = "",
  from = 0.8,
  duration = 0.5,
  delay = 0,
  useInView = true,
  once = true,
  amount = 0.1,
}: ScaleInProps) => {
  const variants = {
    hidden: {
      opacity: 0,
      scale: from,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        duration,
        delay,
        bounce: 0.2,
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

export default ScaleIn; 