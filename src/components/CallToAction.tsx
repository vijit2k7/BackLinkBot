import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, Globe, Target, Zap } from "lucide-react";

const CallToAction = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="cta" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-dark to-gray-900 text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-purple rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-purple-light rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="responsive-container relative z-10">
        <div className="text-center">
          <h2 className="text-responsive-lg md:text-responsive-xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            What does <span className="text-purple-light">Backlink Bot</span> do for your Startup?
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Get your startup in front of thousands of potential customers while building high-quality backlinks for SEO dominance
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 mb-10 sm:mb-16 px-4 sm:px-0">
            <div className="bg-white/10 rounded-xl backdrop-blur-md px-4 sm:px-6 py-4 sm:py-5 text-white border border-white/10 hover:border-purple-light/30 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="bg-purple/20 p-2 sm:p-2.5 rounded-lg mr-3 group-hover:bg-purple/30 transition-colors">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-light" />
                </div>
                <span className="font-semibold text-sm sm:text-base">Web Traffic Booms</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 pl-10 sm:pl-12">Increase targeted traffic from directory visitors</p>
            </div>
            
            <div className="bg-white/10 rounded-xl backdrop-blur-md px-4 sm:px-6 py-4 sm:py-5 text-white border border-white/10 hover:border-purple-light/30 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="bg-purple/20 p-2 sm:p-2.5 rounded-lg mr-3 group-hover:bg-purple/30 transition-colors">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-purple-light" />
                </div>
                <span className="font-semibold text-sm sm:text-base">Google Authority</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 pl-10 sm:pl-12">Build domain authority with quality backlinks</p>
            </div>
            
            <div className="bg-white/10 rounded-xl backdrop-blur-md px-4 sm:px-6 py-4 sm:py-5 text-white border border-white/10 hover:border-purple-light/30 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="bg-purple/20 p-2 sm:p-2.5 rounded-lg mr-3 group-hover:bg-purple/30 transition-colors">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-light" />
                </div>
                <span className="font-semibold text-sm sm:text-base">High Quality Traffic</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 pl-10 sm:pl-12">Attract visitors actively looking for solutions</p>
            </div>
            
            <div className="bg-white/10 rounded-xl backdrop-blur-md px-4 sm:px-6 py-4 sm:py-5 text-white border border-white/10 hover:border-purple-light/30 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="bg-purple/20 p-2 sm:p-2.5 rounded-lg mr-3 group-hover:bg-purple/30 transition-colors">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-light" />
                </div>
                <span className="font-semibold text-sm sm:text-base">Everything automated</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 pl-10 sm:pl-12">Save hours with our automated submission system</p>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-10 max-w-md mx-auto px-4 sm:px-0">
            <Button 
              className="w-full bg-gradient-to-r from-purple to-purple-dark hover:opacity-90 text-white px-6 sm:px-8 py-4 sm:py-6 h-auto font-medium text-base sm:text-lg rounded-xl shadow-lg shadow-purple/20 flex items-center justify-center group touch-target"
              // onClick={() => window.open('https://app.backlinkbot.ai')}
              onClick={() => scrollToSection('pricing')}
            >
              Submit your Startup Now
              <ArrowUpRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
            
            <p className="text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4">
              No credit card required. Join 1000+ startups growing their business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
