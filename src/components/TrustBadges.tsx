
import { Shield, CheckCircle, Award, Clock } from "lucide-react";

const TrustBadges = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-8 py-4">
          {/* <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700 font-medium">Secure Payment</span>
          </div> */}
          
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700 font-medium">Backlink Boost within 24hrs</span>
          </div>
          
          <div className="flex items-center">
            <Award className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700 font-medium">Trusted by 100+ startups</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700 font-medium">Verified directory backlinks</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6 py-4 border-t">
          {/* <img src="/phnumber1.png" alt="Visa" className="h-20 opacity-90" /> */}
          {/* <img src="/disrupt500.svg" alt="Mastercard" className="h-20 opacity-90" /> */}
          {/* <div className="flex items-center bg-gray-100 px-3 py-1 rounded-md">
            <span className="text-xs text-gray-600">256-bit SSL Encryption</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
