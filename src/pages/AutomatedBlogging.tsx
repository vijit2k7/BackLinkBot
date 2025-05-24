
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const AutomatedBlogging = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <div className="bg-dark text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full bg-purple-dark/20 text-purple-light">
                <span className="mr-1">🔥</span>
                <span>Launching new AI Blogging Agent - Automate keyword research, writing and publishing 🔥</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Automated Blogging
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Generate high-quality, SEO-optimized blog content that ranks on Google with our AI-powered blog writing service
              </p>
              
              <Button className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 h-auto font-medium rounded-md">
                Start
              </Button>
            </div>
          </div>
        </div>
        
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How Automated Blogging Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform handles everything from keyword research to content creation and optimization
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple mb-4">
                  <span className="text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Keyword Research</h3>
                <p className="text-gray-600">
                  Our AI analyzes search trends and identifies keywords with high search volume and low competition
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple mb-4">
                  <span className="text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Content Creation</h3>
                <p className="text-gray-600">
                  Generate well-researched, engaging blog posts optimized for both readers and search engines
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple mb-4">
                  <span className="text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Publish & Promote</h3>
                <p className="text-gray-600">
                  Automatically publish to your blog and promote content across relevant platforms to increase visibility
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Pricing Plans</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the perfect plan for your blogging needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 border flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-2">$49<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">Perfect for small businesses just getting started with content marketing</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>5 blog posts per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic keyword research</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>1,000 words per article</span>
                  </li>
                </ul>
                
                <Button className="mt-auto w-full bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </div>
              
              <div className="bg-white rounded-xl p-8 border border-purple flex flex-col relative">
                <div className="absolute -top-3 right-8 bg-purple text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <div className="text-4xl font-bold mb-2">$99<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">Ideal for growing businesses with regular content needs</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>12 blog posts per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced keyword research</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>1,500 words per article</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Social media promotion</span>
                  </li>
                </ul>
                
                <Button className="mt-auto w-full bg-purple hover:bg-purple-dark text-white">
                  Get Started
                </Button>
              </div>
              
              <div className="bg-white rounded-xl p-8 border flex flex-col">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-2">$199<span className="text-lg font-normal text-gray-500">/month</span></div>
                <p className="text-gray-600 mb-6">For businesses with extensive content marketing needs</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>25 blog posts per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Premium keyword research</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>2,000 words per article</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Social media & email promotion</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Content calendar planning</span>
                  </li>
                </ul>
                
                <Button className="mt-auto w-full bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AutomatedBlogging;
