import { Link } from "react-router-dom";
import { Mail, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="responsive-container py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-4 md:mb-0">
            <Link to="/" className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-purple">
                Backlink Bot
              </span>
            </Link>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              Submit your startup to 100+ directories in just 10 minutes
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/whatsuppiyush" target="_blank" rel="noopener noreferrer" 
                className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-purple hover:bg-gray-200 transition-colors touch-target">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="mailto:amplifyxlabsteam@gmail.com"
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-purple hover:bg-gray-200 transition-colors touch-target">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link to="/#features" className="text-gray-600 hover:text-purple transition-colors">App Features</Link>
              </li>
              <li>
                <Link to="/glossary" className="text-gray-600 hover:text-purple transition-colors">SEO Glossary</Link>
              </li>
              <li>
                <Link to="/seo-tools" className="text-gray-600 hover:text-purple transition-colors">SEO Tools</Link>
              </li>
              <li>
                <Link to="/tools" className="text-gray-600 hover:text-purple transition-colors">Tools</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-purple transition-colors">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link to="/affiliate" className="text-gray-600 hover:text-purple transition-colors">Affiliate Program</Link>
              </li>
              <li>
                <Link to="/submit-directory" className="text-gray-600 hover:text-purple transition-colors">Submit your Directory</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-purple transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-purple transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-purple transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Useful Tools</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link to="/tools" className="text-gray-600 hover:text-purple transition-colors">Tools</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-gray-200 gap-4 md:gap-0">
          <div className="flex items-center mb-2 md:mb-0">
            <img 
              src="piyushh.jpeg" 
              alt="Creator" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 border border-gray-200" 
            />
            <p className="text-gray-600 text-sm sm:text-base">
              Built with love by <span className="font-medium">Piyushh Patel</span>
            </p>
          </div>
          
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <a href="mailto:amplifyxlabsteam@gmail.com" className="text-gray-600 hover:text-purple-dark transition-colors text-sm sm:text-base">
              amplifyxlabsteam@gmail.com
            </a>
          </div>
          
          <p className="text-gray-500 text-xs sm:text-sm mt-2 md:mt-0">
            © {new Date().getFullYear()} Backlink Bot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
