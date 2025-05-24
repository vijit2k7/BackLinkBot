
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import QuestionSection from "@/components/QuestionSection";

const FAQs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center mb-4">
                <div className="p-1 rounded-full bg-gray-200 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">FAQ's</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about BacklinkBot and how it can help improve your website's visibility and traffic.
              </p>
            </div>
          </div>
        </div>
        
        <FAQSection />
        <QuestionSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQs;
