import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop component
 * 
 * This component uses React Router's useLocation hook to detect
 * when the route changes, and automatically scrolls to the top
 * of the page when that happens.
 * 
 * It also handles ensuring homepage content is correctly displayed
 * when navigating back to the homepage.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Check if we're navigating to the homepage
    if (pathname === '/' && !hash) {
      // Ensure homepage sections are visible
      setTimeout(() => {
        document.querySelectorAll('.section-fade-in').forEach(section => {
          section.classList.add('force-visible');
          section.classList.add('appear');
        });
      }, 50);
    }

    // If there's a hash, scroll to that element
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Otherwise, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null; // This component doesn't render anything
}

export default ScrollToTop;
