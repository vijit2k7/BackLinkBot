import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  bannerVisible?: boolean;
}

const Header = ({ bannerVisible = false }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Add effect to prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    // Check if we're on the home page
    const isHomePage = window.location.pathname === '/';
    
    if (!isHomePage) {
      // If not on home page, navigate to home then scroll
      // Add a flag to indicate navigating from another page
      sessionStorage.setItem('navigatingToHome', 'true');
      window.location.href = `/#${id}`;
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Add effect to handle navigation back to homepage
  useEffect(() => {
    const handleNavigation = () => {
      const isNavigatingToHome = sessionStorage.getItem('navigatingToHome') === 'true';
      
      if (isNavigatingToHome && window.location.pathname === '/') {
        // Make all sections immediately visible without animation
        document.querySelectorAll('.section-fade-in').forEach(section => {
          section.classList.add('already-visible');
          section.classList.add('appear');
        });
        
        // Clear the flag
        sessionStorage.removeItem('navigatingToHome');
      }
    };
    
    // Run immediately and add listener for route changes
    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Adjust the top positioning based on whether banner is visible
  const headerTopClass = bannerVisible ? "top-10" : "top-0";

  return (
    <div className={`w-full flex justify-center px-4 fixed ${headerTopClass} z-40 transition-all duration-300 ${scrolled ? 'pt-2' : 'pt-4'}`}>
      <header className={`bg-navbg/95 backdrop-blur-md rounded-full text-white w-full max-w-5xl transition-all duration-300 ${
        scrolled ? 'shadow-lg shadow-black/20' : ''
      } lg:w-3/4 md:w-[90%] w-[95%]`}>
        <div className="px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex-shrink-0 text-lg sm:text-xl font-bold hover:text-purple-light transition-colors duration-200"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-light">
                  Backlink Bot
                </span>
              </Link>
              <nav className="hidden md:ml-10 md:flex items-center space-x-1">
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 hover:text-purple-light transition-all duration-200"
                >
                  How It Works
                </button>
                <Link 
                  to="/blog" 
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 hover:text-purple-light transition-all duration-200"
                >
                  Blogs
                </Link>
                <Link 
                  to="/tools" 
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 hover:text-purple-light transition-all duration-200"
                >
                  Tools
                </Link>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 hover:text-purple-light transition-all duration-200"
                >
                  Pricing
                </button>
              </nav>
            </div>
            
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 rounded-full px-5"
                onClick={() => scrollToSection('product-directories')}
              >
                Directories
              </Button>
              {/* <Button 
                variant="default" 
                className="bg-gradient-to-r from-purple to-purple-dark text-white font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 rounded-full px-6"
                onClick={() => window.open('https://app.backlinkbot.ai', '_blank')}
              >
                Get Started
              </Button> */}
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-purple to-purple-dark text-white font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 rounded-full px-6"
                onClick={() => scrollToSection('pricing')}
              >
                Get Started
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-light focus:outline-none"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, toggle based on menu state */}
        <div 
          className={`md:hidden fixed inset-0 top-[4.5rem] z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className={`px-4 py-5 space-y-3 bg-navbg/95 backdrop-blur-md border border-gray-800 rounded-2xl mt-2 mx-4 transform transition-all duration-300 ${
              mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/10 w-full text-left transition-colors"
            >
              How It Works
            </button>
            <Link
              to="/blog"
              className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/10 w-full text-left transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/tools"
              className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/10 w-full text-left transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/10 w-full text-left transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('product-directories')}
              className="block px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-white/10 w-full text-left transition-colors"
            >
              Directories
            </button>
            <div className="pt-2">
              <button
                onClick={() => {
                  window.open('https://app.aiblogsbot.com', '_blank');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-purple to-purple-dark text-white hover:opacity-90 transition-all"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
