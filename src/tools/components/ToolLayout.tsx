import React, { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Share2, Bookmark, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  helpText?: string;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  title, 
  description, 
  icon, 
  children,
  helpText
}) => {
  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - BacklinkBot Business Tools`,
        text: description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back navigation */}
        <Link to="/business-tools" className="text-purple-600 hover:text-purple-800 inline-flex items-center mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to All Tools
        </Link>

        {/* Tool Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-purple-100 p-3 rounded-full">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-gray-600 mt-1 max-w-2xl">{description}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end mb-6 space-x-2">
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <HelpCircle className="h-4 w-4 mr-1" /> Help
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <Button variant="outline" size="sm" className="text-gray-600" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          
          <Button variant="outline" size="sm" className="text-gray-600">
            <Bookmark className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>

        {/* Tool Content */}
        <Card className="border border-gray-200 bg-white p-6 mb-8 rounded-xl shadow-sm">
          {children}
        </Card>

        {/* Related tools will go here */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* This will be populated dynamically in the future */}
            <Card className="p-4 border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer">
              <Link to="/tools/business-name-generator" className="block">
                <h3 className="font-medium text-purple-700">Business Name Generator</h3>
                <p className="text-sm text-gray-600 mt-1">Create unique business names in seconds</p>
              </Link>
            </Card>
            <Card className="p-4 border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer">
              <Link to="/tools/seo-analyzer" className="block">
                <h3 className="font-medium text-purple-700">SEO Analyzer</h3>
                <p className="text-sm text-gray-600 mt-1">Check your website's SEO health</p>
              </Link>
            </Card>
            <Card className="p-4 border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer">
              <Link to="/tools/social-media-strategy" className="block">
                <h3 className="font-medium text-purple-700">Social Media Strategy</h3>
                <p className="text-sm text-gray-600 mt-1">Build your social media roadmap</p>
              </Link>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default ToolLayout; 