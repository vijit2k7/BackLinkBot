import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const PricingSection = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-purple-dark">Pricing to suit your site</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your startup's growth needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="border border-gray-200 rounded-2xl p-8 flex flex-col bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-semibold mb-4">Starter</h3>
            <div className="flex items-end mb-6">
              <span className="text-5xl font-bold">$99</span>
              <span className="text-gray-500 ml-2">/ Startup</span>
            </div>
            <p className="text-gray-600 mb-6">Best if you are starting up</p>
            
            <Button className="w-full mb-8 bg-gradient-to-r from-gray-800 to-black hover:opacity-90 text-white py-6 h-auto rounded-xl shadow-sm" 
              onClick={() => window.open('https://backlinkbotai.lemonsqueezy.com/buy/003163bc-7cac-4bc8-b52a-9aae6dc0af61')}>
              Get started
            </Button>
            
            <h4 className="font-semibold mb-4 text-gray-800">What's Included</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Submisson to 100+ directories</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Handpicked Listings</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Submission Report</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Email Support</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Paid Directory Listing</span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Discount</span>
              </li>
            </ul>
          </div>
          
          {/* Pro Plan */}
          <div className="border-2 border-purple rounded-2xl p-8 flex flex-col relative bg-white shadow-lg shadow-purple/10 transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -top-4 inset-x-0 mx-auto w-max bg-gradient-to-r from-purple to-purple-dark text-white text-sm px-6 py-1 rounded-full font-medium">
              Most Popular
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-purple-dark">Pro</h3>
            <div className="flex items-end mb-6">
              <span className="text-5xl font-bold">$167</span>
              <span className="text-gray-500 ml-2">/ Startup</span>
            </div>
            <p className="text-gray-600 mb-6">Best for growing startups</p>
            
            <Button className="w-full mb-8 bg-gradient-to-r from-purple to-purple-dark hover:opacity-90 text-white py-6 h-auto rounded-xl shadow-md" 
              onClick={() => window.open('https://backlinkbotai.lemonsqueezy.com/buy/594d9430-cbc5-45d8-9565-1ac960deb18e')}>
              Go Pro
            </Button>
            
            <h4 className="font-semibold mb-4 text-gray-800">What's Included</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Submisson to 200+ directories</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Handpicked Listings</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Submission Report</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority Email Support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Paid Directory Listings</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">15% discount</span>
              </li>
            </ul>
          </div>
          
          {/* Elite Plan */}
          <div className="border border-gray-200 rounded-2xl p-8 flex flex-col bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-semibold mb-4">Elite</h3>
            <div className="flex items-end mb-6">
              <span className="text-5xl font-bold">$357</span>
              <span className="text-gray-500 ml-2">/ Startup</span>
            </div>
            <p className="text-gray-600 mb-6">Best for hypergrowing startups</p>
            
            <Button className="w-full mb-8 bg-gradient-to-r from-gray-800 to-black hover:opacity-90 text-white py-6 h-auto rounded-xl shadow-sm" 
              onClick={() => window.open('https://backlinkbotai.lemonsqueezy.com/buy/c4d51672-94a0-45f5-9a9f-5aab8b35e020')}>
              Go Elite
            </Button>
            
            <h4 className="font-semibold mb-4 text-gray-800">What's Included</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Submission to all available directories</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Over 500+ relevant directories</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Submission Report</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Priority Email Support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Paid Directory Listings</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">27% discount</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12 py-6 px-6 bg-gray-50 rounded-2xl max-w-3xl mx-auto border border-gray-200">
          <p className="text-gray-600">Need a custom plan for enterprise? <a href="/contact" className="text-purple-dark font-semibold hover:underline">Contact us</a> for a tailored solution.</p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
