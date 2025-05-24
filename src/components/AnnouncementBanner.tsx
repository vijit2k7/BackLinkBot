import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnnouncementBannerProps {
  isEnabled?: boolean;
  message?: string;
  redirectUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}

const AnnouncementBanner = ({
  isEnabled = true,
  message = "🎉 Check out our latest SEO case study: 3x traffic increase in 60 days!",
  redirectUrl = "#",
  backgroundColor = "#6B46C1",
  textColor = "white"
}: AnnouncementBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Only show banner if enabled
    if (isEnabled) {
      // Add a small delay before showing for a smooth entry
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isEnabled]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Match transition duration
  };

  if (!isEnabled || !isVisible) return null;

  return (
    <div 
      className={`w-full py-3 px-4 text-center sticky top-0 left-0 right-0 transition-all duration-300 ease-in-out ${
        isClosing ? 'opacity-0 transform -translate-y-full' : 'opacity-100'
      }`}
      style={{ 
        backgroundColor, 
        color: textColor,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px',
        zIndex: 50
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <p className="text-sm md:text-base font-medium text-center mx-auto pr-8">
          {message}{' '}
          {redirectUrl && (
            <a 
              href={redirectUrl}
              className="underline font-bold hover:opacity-90 transition-opacity inline-flex items-center"
              onClick={(e) => {
                // If it's a hash link, handle smooth scrolling
                if (redirectUrl.startsWith('#')) {
                  e.preventDefault();
                  const element = document.getElementById(redirectUrl.substring(1));
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              Learn more 
              <svg className="w-3.5 h-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full absolute right-2 top-1/2 transform -translate-y-1/2 text-current hover:bg-white/20"
          onClick={handleClose}
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
