import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTopButton component
 * 
 * This component displays a button that appears when the user
 * scrolls down the page, and allows them to scroll back to the top
 * when clicked.
 */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinates to 0
  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default ScrollToTopButton; 