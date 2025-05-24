import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FadeIn from "@/components/animations/FadeIn";
import SlideIn from "@/components/animations/SlideIn";
import ScaleIn from "@/components/animations/ScaleIn";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-gray-900 pt-0 pb-12 sm:pb-16 md:pb-24 relative overflow-hidden">
      {/* Background pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-purple rounded-full filter blur-3xl"
          style={{ 
            animation: "pulse 15s infinite alternate", 
            transformOrigin: "center" 
          }}
        >
        </div>
        <div 
          className="absolute top-1/2 right-1/3 w-60 sm:w-80 h-60 sm:h-80 bg-purple-light rounded-full filter blur-3xl"
          style={{ 
            animation: "pulse 10s infinite alternate-reverse", 
            animationDelay: "2s",
            transformOrigin: "center" 
          }}
        ></div>
      </div> */}
      
      <div className="responsive-container text-center relative z-10">
        <div className="flex flex-col items-center">
          <FadeIn delay={0.1} duration={0.6} useInView={false}>
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 mb-4 sm:mb-6 text-xs sm:text-sm font-medium rounded-full bg-purple-light/10 text-purple-dark border border-purple/20 overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%]">
              <span className="mr-2">⚡</span>
              <span className="truncate">#solopreneurs #linkbuilding #directories</span>
            </div>
          </FadeIn>
          
          <SlideIn delay={0.3} duration={0.8} distance={30} useInView={false}>
            <h1 className="text-responsive-xl font-bold mb-6 sm:mb-8 leading-tight max-w-4xl mx-auto px-2">
              Submit your Startup to <span className="text-purple">100+ directories</span> in 10 minutes
            </h1>
          </SlideIn>
          
          <FadeIn delay={0.5} duration={0.6} useInView={false}>
            <p className="text-responsive-base text-gray-600 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Submit your product to top directories that matter ⚡ We filter out the
              best 100 directories out of our 1500+ directories database to list
              your product.
            </p>
          </FadeIn>
          
          <ScaleIn delay={0.7} duration={0.5} from={0.9} useInView={false}>
            <div className="mb-6 sm:mb-10">
              <Button 
                className="bg-gradient-to-r from-purple to-purple-dark text-white hover:opacity-90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto font-medium rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple/20 touch-target" 
                // onClick={() => window.open('https://app.backlinkbot.ai', '_blank')}
                onClick={() => scrollToSection('pricing')}
              >
                Submit your Startup Now
              </Button>
            </div>
          </ScaleIn>
          
          <FadeIn delay={0.9} duration={0.6} direction="up" useInView={false}>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center bg-gray-50 px-4 sm:px-6 py-3 rounded-full border border-gray-200 mx-4">
              <div className="flex -space-x-2 mb-2 sm:mb-0 sm:mr-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="User"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white transition-transform duration-300 hover:-translate-y-1"
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-700">
                Trusted by <span className="font-semibold">100+</span> Indie Hackers / Entrepreneurs
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
