import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Mail, Phone, MessageSquare, MessageCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

// Add TypeScript interface for Tawk_API
declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      // Add other Tawk_API methods as needed
    };
    Tawk_LoadStart?: Date;
  }
}

const Contact = () => {
  const [isChatClicked, setIsChatClicked] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Contact Us | Backlink Bot";
    
    // Load Tawk.to script
    const loadTawkTo = () => {
      const existingTawkAPI = window.Tawk_API;
      const existingTawkLoadStart = window.Tawk_LoadStart;
      
      window.Tawk_LoadStart = new Date();
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/67bdba71197a90190fc5c67e/1im5ngq6d';
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      if (existingTawkAPI) window.Tawk_API = existingTawkAPI;
      if (existingTawkLoadStart) window.Tawk_LoadStart = existingTawkLoadStart;
      
      document.head.appendChild(script);
    };
    
    if (!window.Tawk_API) {
      loadTawkTo();
    }
  }, []);

  // Function to open tawk.to chat widget
  const openTawkToChat = () => {
    setIsChatClicked(true);
    
    if (window.Tawk_API) {
      window.Tawk_API.maximize();
    } else {
      console.log("Tawk.to chat widget is not available");
    }
    
    setTimeout(() => {
      setIsChatClicked(false);
    }, 1000);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond to all inquiries within 24-48 business hours. For urgent matters, please indicate this in your subject line."
    },
    {
      question: "I'm having technical issues. What should I do?",
      answer: "For technical support, please provide details about the issue you're experiencing, including any error messages and the steps to reproduce the problem."
    },
    {
      question: "Do you offer custom solutions?",
      answer: "Yes, we can discuss custom requirements for your specific needs. Please reach out with details about what you're looking for."
    },
    {
      question: "Can I schedule a call with your team?",
      answer: "Absolutely! Please mention that you'd like to schedule a call in your message, along with your availability, and we'll arrange a time that works for both parties."
    }
  ];

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-gray-50 to-white py-20 mt-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Get in Touch</h1>
            <p className="text-xl text-gray-600">
              Have questions or feedback? We'd love to hear from you. Our team is here to help.
            </p>
          </div>
          
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Contact Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <a href="mailto:amplifyxlabsteam@gmail.com" className="text-gray-600 hover:text-purple-600 transition-colors text-base">
                    amplifyxlabsteam@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                  <button 
                    onClick={openTawkToChat}
                    className={`text-gray-600 hover:text-purple-600 transition-colors flex items-center text-base ${isChatClicked ? 'text-purple-600' : ''}`}
                    disabled={isChatClicked}
                  >
                    <span>{isChatClicked ? 'Opening chat...' : 'Chat with our team'}</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Social</h3>
                  <a 
                    href="https://twitter.com/whatsuppiyush" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-base"
                  >
                    Twitter @whatsuppiyush
                  </a>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Support Hours</h3>
                  <p className="text-gray-600 text-base">
                    24*7 available over email
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg">
                Choose any method above to reach out to us. We're here to help you succeed!
              </p>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-1">Find quick answers to common questions</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full p-5 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <div className="ml-2 flex-shrink-0">
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-purple-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      expandedFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="p-5 pt-0 border-t border-gray-100">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Contact; 