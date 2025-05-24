import SparkleIcon from "./icons/SparkleIcon";
import NetworkIcon from "./icons/NetworkIcon";
import UserIcon from "./icons/UserIcon";
import BellIcon from "./icons/BellIcon";
import StaggerContainer from "./animations/StaggerContainer";
import StaggerItem from "./animations/StaggerItem";
import FadeIn from "./animations/FadeIn";

const FeatureCards = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-purple-dark">
              Why people choose Backlink Bot?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled productivity with tailored features, AI insights, and seamless team collaboration.
            </p>
          </div>
        </FadeIn>
        
        <StaggerContainer className="grid md:grid-cols-2 gap-10" staggerDelay={0.15}>
          <StaggerItem className="feature-card group hover:border-purple transition-all duration-300 border border-transparent hover:bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-purple-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-light/10 rounded-2xl group-hover:bg-purple-light/20 transition-all duration-300 group-hover:scale-110">
                  <SparkleIcon className="w-10 h-10 text-purple animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Identifies relevant directories</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Bot has database of 1500+ sites, it finds upto top relevant sites to list your product suited best for your niche
              </p>
            </div>
          </StaggerItem>
          
          <StaggerItem className="feature-card group hover:border-purple transition-all duration-300 border border-transparent hover:bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-purple-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-light/10 rounded-2xl group-hover:bg-purple-light/20 transition-all duration-300 group-hover:scale-110">
                  <NetworkIcon className="w-10 h-10 text-purple animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">No repeated listing</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Bot verifies existing backlinks using ahrefs, chooses the best directories where you aren't listed yet
              </p>
            </div>
          </StaggerItem>
          
          <StaggerItem className="feature-card group hover:border-purple transition-all duration-300 border border-transparent hover:bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-purple-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-light/10 rounded-2xl group-hover:bg-purple-light/20 transition-all duration-300 group-hover:scale-110">
                  <UserIcon className="w-10 h-10 text-purple animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Get your first 10 customers</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We have seen few startups get their first 10 customers within few days of submitting their startup
              </p>
            </div>
          </StaggerItem>
          
          <StaggerItem className="feature-card group hover:border-purple transition-all duration-300 border border-transparent hover:bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-purple-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-purple-light/10 rounded-2xl group-hover:bg-purple-light/20 transition-all duration-300 group-hover:scale-110">
                  <BellIcon className="w-10 h-10 text-purple animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Automated Status Updates</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Bot share the report with you with list of directories it listed your product within 24 hours.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
        
        <StaggerContainer className="mt-16 flex flex-wrap justify-center gap-4" delay={0.5} staggerDelay={0.1}>
          <StaggerItem>
            <div className="bg-white rounded-full px-6 py-3 flex items-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="mr-2 text-purple">✓</span>
              <span className="text-gray-700 font-medium">Rank Fast on Google</span>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="bg-white rounded-full px-6 py-3 flex items-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="mr-2 text-purple">✓</span>
              <span className="text-gray-700 font-medium">High Authority Backlinks</span>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="bg-white rounded-full px-6 py-3 flex items-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="mr-2 text-purple">✓</span>
              <span className="text-gray-700 font-medium">Collection of 500+ directories</span>
            </div>
          </StaggerItem>
          
          <StaggerItem>
            <div className="bg-white rounded-full px-6 py-3 flex items-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <span className="mr-2 text-purple">✓</span>
              <span className="text-gray-700 font-medium">Instant Traffic to your website</span>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
};

export default FeatureCards;
