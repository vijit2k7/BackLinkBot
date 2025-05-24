import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { ArrowRight, DollarSign, Users, Award, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

// Tally Form Embed Component
const TallyFormEmbed = () => {
  return (
    <iframe
      src="https://tally.so/embed/wvKEN8?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
      width="100%"
      height="500"
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      title="Affiliate Program Application"
      style={{ border: "none", maxWidth: "100%" }}
    ></iframe>
  );
};

const Affiliate = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Affiliate Program | Backlink Bot";
  }, []);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              Join Our <span className="text-purple">Affiliate Program</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Earn 30% commission on every paying customer you refer to Backlink Bot. Simple, transparent, and rewarding!
            </p>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Apply to become an affiliate</h3>
              <TallyFormEmbed />
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Join Our Affiliate Program?</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-light text-purple mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">30% Commission</h3>
              <p className="text-gray-600">Earn a generous 30% commission on all referred customers for the lifetime of their subscription.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-light text-purple mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Easy Referrals</h3>
              <p className="text-gray-600">Get your unique affiliate link and start sharing it with your audience immediately.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-light text-purple mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Quality Product</h3>
              <p className="text-gray-600">Promote a service that delivers real value, making it easier to convert your referrals.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-purple-light text-purple mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Real-Time Dashboard</h3>
              <p className="text-gray-600">Track your referrals, conversions, and earnings in a user-friendly dashboard.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-purple text-white text-xl font-bold rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  1
                </div>
                <h3 className="text-xl font-medium text-gray-900">Sign Up</h3>
              </div>
              <p className="text-gray-600">
                Complete our simple affiliate registration form and get instant access to your affiliate dashboard.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-purple text-white text-xl font-bold rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  2
                </div>
                <h3 className="text-xl font-medium text-gray-900">Share</h3>
              </div>
              <p className="text-gray-600">
                Promote Backlink Bot using your unique affiliate link through your website, social media, email, or other channels.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-purple text-white text-xl font-bold rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  3
                </div>
                <h3 className="text-xl font-medium text-gray-900">Earn</h3>
              </div>
              <p className="text-gray-600">
                Earn 30% commission for every customer who signs up through your link and makes a purchase. Get paid monthly via PayPal or bank transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Who can join the affiliate program?</h3>
              <p className="text-gray-600 mb-6">
                Anyone with an audience interested in startups, marketing, or SEO can join our affiliate program. This includes bloggers, content creators, marketing consultants, and influencers.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How much can I earn?</h3>
              <p className="text-gray-600 mb-6">
                You earn 30% of every paying customer's subscription for as long as they remain a customer. For example, if you refer someone who purchases our $99 plan, you earn $29.70 for every month they stay subscribed.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">When and how do I get paid?</h3>
              <p className="text-gray-600 mb-6">
                We process payments monthly for all commissions earned in the previous month. Payments are made via PayPal or direct bank transfer, depending on your preference.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Is there a minimum payout threshold?</h3>
              <p className="text-gray-600 mb-6">
                Yes, there is a minimum payout threshold of $50. If your earnings don't reach $50 in a particular month, they'll roll over to the next month until you reach the threshold.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How long does the cookie last?</h3>
              <p className="text-gray-600 mb-6">
                Our tracking cookie lasts for 30 days. If someone clicks your affiliate link and makes a purchase within 30 days, you'll receive credit for the referral.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Do you provide marketing materials?</h3>
              <p className="text-gray-600 mb-6">
                Yes, we provide a variety of marketing materials including banners, email templates, social media posts, and product descriptions to help you promote Backlink Bot effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      {/* <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to start earning?</h2>
                <p className="text-xl text-purple-50 mb-6">
                  Fill out the form below to apply for our affiliate program and start earning commission on every referral.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <TallyFormEmbed />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      
      {/* Additional Support */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Have more questions?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Contact our affiliate support team for any questions or assistance.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center text-purple hover:text-purple-dark font-medium"
          >
            Contact Us <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Affiliate; 