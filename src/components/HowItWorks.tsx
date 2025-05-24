import { useEffect, useRef } from "react";
import SparkleIcon from "./icons/SparkleIcon";
import NetworkIcon from "./icons/NetworkIcon";
import ChartIcon from "./icons/ChartIcon";

const HowItWorks = () => {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add staggered animation to each step
            const steps = entry.target.querySelectorAll('.step-card');
            steps.forEach((step, index) => {
              setTimeout(() => {
                step.classList.add('animated');
              }, 150 * index); // Reduced delay for faster animations
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (stepsRef.current) {
      observer.observe(stepsRef.current);
    }

    return () => {
      if (stepsRef.current) {
        observer.unobserve(stepsRef.current);
      }
    };
  }, []);

  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-4">
            <SparkleIcon className="w-5 h-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">How Backlink Bot works</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Submit Your Web / Mobile App To Directories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You can submit website to directories with just one click
          </p>
        </div>
        
        <div 
          ref={stepsRef} 
          className="relative mt-16"
        >
          {/* Connection line */}
          <div className="absolute left-1/2 top-12 bottom-12 w-1 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-16 relative">
            <div className="step-card bg-gray-50 rounded-xl p-8 text-center transform opacity-0 transition-all duration-700 translate-y-8 md:translate-x-[-20px]">
              <div className="flex justify-center mb-6 relative">
                <div className="p-4 bg-black rounded-xl z-10">
                  <SparkleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute w-8 h-8 bg-purple-light/20 rounded-full -right-1 -top-1 animate-pulse"></div>
              </div>
              <div className="step-number bg-purple-light text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Submit Product Information</h3>
              <p className="text-gray-600">
                Share with us your product details, we verify all the details confirm with you and feed the information to the Bot
              </p>
            </div>
            
            <div className="step-card bg-gray-50 rounded-xl p-8 text-center transform opacity-0 transition-all duration-700 translate-y-8">
              <div className="flex justify-center mb-6 relative">
                <div className="p-4 bg-black rounded-xl z-10">
                  <NetworkIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute w-8 h-8 bg-purple-light/20 rounded-full -right-1 -top-1 animate-pulse"></div>
              </div>
              <div className="step-number bg-purple-light text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Bot figures out the directories</h3>
              <p className="text-gray-600">
                Bot filters out up to 100 directories to list your product among 500+ databases. In case the bot finds you are already listed on certain sites, then it looks for the next best directory to list
              </p>
            </div>
            
            <div className="step-card bg-gray-50 rounded-xl p-8 text-center transform opacity-0 transition-all duration-700 translate-y-8 md:translate-x-[20px]">
              <div className="flex justify-center mb-6 relative">
                <div className="p-4 bg-black rounded-xl z-10">
                  <ChartIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute w-8 h-8 bg-purple-light/20 rounded-full -right-1 -top-1 animate-pulse"></div>
              </div>
              <div className="step-number bg-purple-light text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">See your traffic grow</h3>
              <p className="text-gray-600">
                Prepare your product, you might start getting sales
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
