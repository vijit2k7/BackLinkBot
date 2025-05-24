import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageTransition component 
 * 
 * This component wraps page content with smooth animations using Framer Motion.
 * It provides a consistent entrance and exit animation for pages.
 */
const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const variants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    enter: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.45, 0, 0.55, 1],
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.45, 0, 0.55, 1],
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 