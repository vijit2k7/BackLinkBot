
import { ExternalLink, CheckCircle2, TrendingUp, Search } from "lucide-react";

const WhyBacklinks = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Backlinks Matter For Your Business</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Backlinks are a crucial ranking factor for search engines and can significantly boost your website's authority and visibility
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="SEO Growth Chart" 
              className="rounded-xl shadow-md"
            />
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Improves Search Engine Rankings</h3>
                <p className="text-gray-600">
                  Search engines like Google consider backlinks as votes of confidence. The more quality backlinks your site has, the higher it will rank in search results.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Increases Domain Authority</h3>
                <p className="text-gray-600">
                  Backlinks from high-authority websites boost your site's domain authority, making it easier to rank for competitive keywords.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-purple-100 rounded-full">
                  <ExternalLink className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Drives Referral Traffic</h3>
                <p className="text-gray-600">
                  Quality backlinks from relevant directories bring targeted traffic directly to your website from users browsing those directories.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-orange-100 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Builds Credibility & Trust</h3>
                <p className="text-gray-600">
                  Being listed in reputable directories signals to users and search engines that your business is legitimate and trustworthy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyBacklinks;
