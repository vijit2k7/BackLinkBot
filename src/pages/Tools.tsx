import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, ArrowRight, Lightbulb, Globe, LineChart, FileText, Clock, Settings, Brush, BarChart3, FileImage, FileCode, Calculator } from 'lucide-react';
import ScrollToTopButton from '@/components/ScrollToTopButton';

// Tool interface
interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  route: string;
  tags: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

const BusinessTools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Initialize tools data
  useEffect(() => {
    // List of business tools with their details
    const toolsList: Tool[] = [
      // Marketing & Content Tools
      {
        id: 'business-idea-generator',
        name: 'Business Idea Generator',
        description: 'Generate innovative business ideas based on trends, interests, and market gaps.',
        icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
        category: 'Marketing',
        route: '/tools/business-idea-generator',
        tags: ['ideation', 'startup', 'brainstorming'],
        isPopular: true
      },
      {
        id: 'social-media-strategy',
        name: 'Social Media Strategy Creator',
        description: 'Create a customized social media strategy for your business goals and target audience.',
        icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
        category: 'Marketing',
        route: '/tools/social-media-strategy',
        tags: ['social media', 'marketing', 'content']
      },
      {
        id: 'headline-analyzer',
        name: 'Headline Analyzer',
        description: 'Analyze and improve your headlines for better engagement and click-through rates.',
        icon: <FileText className="h-6 w-6 text-purple-500" />,
        category: 'Marketing',
        route: '/tools/headline-analyzer',
        tags: ['content', 'copywriting', 'engagement']
      },
      {
        id: 'email-subject-tester',
        name: 'Email Subject Line Tester',
        description: 'Test and optimize your email subject lines for higher open rates.',
        icon: <FileText className="h-6 w-6 text-indigo-500" />,
        category: 'Marketing',
        route: '/tools/email-subject-tester',
        tags: ['email', 'marketing', 'copywriting']
      },
      {
        id: 'blog-idea-generator',
        name: 'Blog Post Idea Generator',
        description: 'Generate engaging blog post ideas tailored to your industry and audience.',
        icon: <FileText className="h-6 w-6 text-blue-500" />,
        category: 'Marketing',
        route: '/tools/blog-idea-generator',
        tags: ['content', 'blogging', 'ideas'],
        isNew: true
      },
      {
        id: 'marketing-copy-generator',
        name: 'Marketing Copy Generator',
        description: 'Generate persuasive marketing copy for various platforms and purposes.',
        icon: <FileText className="h-6 w-6 text-emerald-500" />,
        category: 'Marketing',
        route: '/tools/marketing-copy-generator',
        tags: ['copywriting', 'marketing', 'advertising']
      },
      
      // SEO Tools
      {
        id: 'domain-name-finder',
        name: 'Domain Name Finder',
        description: 'Find available and catchy domain names for your business.',
        icon: <Globe className="h-6 w-6 text-blue-500" />,
        category: 'SEO',
        route: '/tools/domain-name-finder',
        tags: ['domain', 'branding', 'website'],
        isPopular: true
      },
      {
        id: 'seo-analyzer',
        name: 'SEO Analyzer',
        description: 'Analyze your website for common SEO issues and get recommendations.',
        icon: <LineChart className="h-6 w-6 text-green-500" />,
        category: 'SEO',
        route: '/tools/seo-analyzer',
        tags: ['seo', 'website', 'analysis'],
        isPopular: true
      },
      {
        id: 'open-graph-tester',
        name: 'Open Graph Tester',
        description: 'Test how your website looks when shared on social media platforms.',
        icon: <FileImage className="h-6 w-6 text-pink-500" />,
        category: 'SEO',
        route: '/tools/open-graph-tester',
        tags: ['social media', 'seo', 'sharing']
      },
      {
        id: 'sitemap-generator',
        name: 'Sitemap Generator',
        description: 'Generate a sitemap for your website to improve search engine indexing.',
        icon: <FileCode className="h-6 w-6 text-orange-500" />,
        category: 'SEO',
        route: '/tools/sitemap-generator',
        tags: ['seo', 'website', 'technical']
      },
      {
        id: 'keyword-research',
        name: 'Keyword Research Tool',
        description: 'Find valuable keywords for your content and SEO strategy.',
        icon: <Search className="h-6 w-6 text-blue-500" />,
        category: 'SEO',
        route: '/tools/keyword-research-tool',
        tags: ['seo', 'content', 'keywords'],
        isNew: true
      },
      {
        id: 'meta-description-generator',
        name: 'Meta Description Generator',
        description: 'Generate effective meta descriptions to improve click-through rates from search results.',
        icon: <FileText className="h-6 w-6 text-teal-500" />,
        category: 'SEO',
        route: '/tools/meta-description-generator',
        tags: ['seo', 'copywriting', 'technical']
      },
      
      // Design Tools
      {
        id: 'color-palette-generator',
        name: 'Color Palette Generator',
        description: 'Create harmonious color palettes for your brand and marketing materials.',
        icon: <Brush className="h-6 w-6 text-rose-500" />,
        category: 'Design',
        route: '/tools/color-palette-generator',
        tags: ['design', 'branding', 'colors']
      },
      {
        id: 'image-resizer',
        name: 'Image Resizer',
        description: 'Resize images for various platforms and purposes while maintaining quality.',
        icon: <FileImage className="h-6 w-6 text-indigo-500" />,
        category: 'Design',
        route: '/tools/image-resizer',
        tags: ['images', 'design', 'optimization']
      },
      {
        id: 'favicon-generator',
        name: 'Favicon Generator',
        description: 'Create a favicon for your website from an image or text.',
        icon: <FileImage className="h-6 w-6 text-orange-500" />,
        category: 'Design',
        route: '/tools/favicon-generator',
        tags: ['design', 'website', 'branding']
      },
      {
        id: 'qr-code-generator',
        name: 'QR Code Generator',
        description: 'Generate customizable QR codes for your business, products, or URLs.',
        icon: <FileCode className="h-6 w-6 text-gray-500" />,
        category: 'Design',
        route: '/tools/qr-code-generator',
        tags: ['marketing', 'offline', 'mobile']
      },
      
      // Business Tools
      {
        id: 'invoice-generator',
        name: 'Invoice Generator',
        description: 'Create professional invoices quickly for your clients and customers.',
        icon: <FileText className="h-6 w-6 text-green-500" />,
        category: 'Business',
        route: '/tools/invoice-generator',
        tags: ['finance', 'clients', 'billing']
      },
      {
        id: 'business-name-generator',
        name: 'Business Name Generator',
        description: 'Generate creative and available business name ideas for your venture.',
        icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
        category: 'Business',
        route: '/tools/business-name-generator',
        tags: ['branding', 'startup', 'naming'],
        isPopular: true
      },
      {
        id: 'logo-idea-generator',
        name: 'Logo Idea Generator',
        description: 'Get logo design ideas and inspiration for your brand.',
        icon: <Brush className="h-6 w-6 text-blue-500" />,
        category: 'Business',
        route: '/tools/logo-idea-generator',
        tags: ['branding', 'design', 'identity']
      },
      {
        id: 'privacy-policy-generator',
        name: 'Privacy Policy Generator',
        description: 'Generate a compliant privacy policy for your website or app.',
        icon: <FileText className="h-6 w-6 text-slate-500" />,
        category: 'Business',
        route: '/tools/privacy-policy-generator',
        tags: ['legal', 'compliance', 'website']
      },
      {
        id: 'terms-of-service-generator',
        name: 'Terms of Service Generator',
        description: 'Create terms of service agreement for your website, app, or business.',
        icon: <FileText className="h-6 w-6 text-slate-500" />,
        category: 'Business',
        route: '/tools/terms-generator',
        tags: ['legal', 'compliance', 'website']
      },
      
      // Productivity Tools
      {
        id: 'readability-analyzer',
        name: 'Content Readability Analyzer',
        description: 'Analyze the readability of your content and get improvement suggestions.',
        icon: <FileText className="h-6 w-6 text-violet-500" />,
        category: 'Productivity',
        route: '/tools/readability-analyzer',
        tags: ['content', 'writing', 'optimization']
      },
      {
        id: 'website-speed-analyzer',
        name: 'Website Speed Analyzer',
        description: 'Analyze your website speed and get recommendations for improvement.',
        icon: <Clock className="h-6 w-6 text-red-500" />,
        category: 'Productivity',
        route: '/tools/website-speed-analyzer',
        tags: ['website', 'performance', 'technical']
      },
      {
        id: 'pricing-calculator',
        name: 'Pricing Strategy Calculator',
        description: 'Calculate optimal pricing for your products or services based on costs and market factors.',
        icon: <Calculator className="h-6 w-6 text-emerald-500" />,
        category: 'Productivity',
        route: '/tools/pricing-strategy-calculator',
        tags: ['pricing', 'finance', 'strategy']
      },
      {
        id: 'value-proposition-creator',
        name: 'Value Proposition Creator',
        description: 'Create a compelling value proposition for your business or product.',
        icon: <FileText className="h-6 w-6 text-amber-500" />,
        category: 'Productivity',
        route: '/tools/value-proposition-creator',
        tags: ['marketing', 'branding', 'messaging']
      },
      {
        id: 'elevator-pitch-generator',
        name: 'Elevator Pitch Generator',
        description: 'Create a concise and compelling elevator pitch for your business.',
        icon: <FileText className="h-6 w-6 text-cyan-500" />,
        category: 'Productivity',
        route: '/tools/elevator-pitch-generator',
        tags: ['pitch', 'marketing', 'presentation']
      }
    ];

    setTools(toolsList);
    setFilteredTools(toolsList);

    // Extract unique categories
    const uniqueCategories = [...new Set(toolsList.map(tool => tool.category))];
    setCategories(uniqueCategories);
  }, []);

  // Filter tools based on search query and selected category
  useEffect(() => {
    let filtered = [...tools];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tool => 
          tool.name.toLowerCase().includes(query) || 
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory, tools]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 pt-20">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 mix-blend-overlay"></div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
          
          <div className="relative">
            <Link to="/" className="text-white/90 hover:text-white inline-flex items-center mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-3 text-white">
              <span className="text-purple-200">Business Tools</span> for Daily Tasks
            </h1>
            <p className="text-white/80 text-lg max-w-3xl">
              A collection of free, practical tools to help small businesses and startups with everyday tasks.
              Save time, improve efficiency, and get immediate results with these simple yet powerful tools.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for tools by name, description, or tags..."
              className="pl-10 py-6 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200 transition-all"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 flex flex-wrap h-auto bg-purple-50 border border-purple-100 p-1 rounded-lg">
              <TabsTrigger 
                value="all" 
                onClick={() => handleCategorySelect('all')}
                className="mr-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-purple-100 transition-colors"
              >
                All Tools
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => handleCategorySelect(category)}
                  className="mr-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-purple-100 transition-colors"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Tools Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="mb-12">
            <div className="flex items-center mb-8">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800">Popular Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool.isPopular)
                .map(tool => (
                  <Link to={tool.route} key={tool.id} className="group">
                    <Card className="border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 hover:border-purple-300 h-full overflow-hidden group-hover:-translate-y-1">
                      <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-4">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              {tool.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl text-gray-800">{tool.name}</CardTitle>
                              <CardDescription className="text-gray-600 mt-1">
                                {tool.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="pt-4 flex justify-between items-center">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {tool.category}
                        </Badge>
                        <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm group-hover:shadow-md transition-all">
                          Use Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* All Tools Grid */}
        <section>
          <div className="flex items-center mb-8">
            <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? 'Search Results' : selectedCategory !== 'all' ? `${selectedCategory} Tools` : 'All Tools'}
            </h2>
          </div>
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <Link to={tool.route} key={tool.id} className="group">
                  <Card className="border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 hover:border-purple-300 h-full overflow-hidden group-hover:-translate-y-1">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg shadow-sm">
                            {tool.icon}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <CardTitle className="text-lg text-gray-800">{tool.name}</CardTitle>
                              {tool.isNew && (
                                <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">New</Badge>
                              )}
                            </div>
                            <CardDescription className="text-gray-600 mt-1">
                              {tool.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3 flex justify-between items-center">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {tool.category}
                      </Badge>
                      <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm group-hover:shadow-md transition-all">
                        Use Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-purple-100 shadow-sm">
              <Settings className="h-16 w-16 text-purple-200 mx-auto mb-6 animate-pulse" />
              <p className="text-gray-600 text-lg mb-6">No tools found matching your search criteria.</p>
              <Button 
                variant="outline" 
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 relative overflow-hidden rounded-2xl p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
          
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4 text-white">Need a Custom Tool?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80 text-lg">
              Don't see what you're looking for? We can help build custom tools tailored to your specific business needs.
            </p>
            <Button 
              variant="default" 
              className="bg-white text-purple-700 hover:bg-gray-100 hover:shadow-lg transition-all px-8 py-6 text-lg shadow-md"
              onClick={() => {
                window.location.href = '/contact';
              }}
            >
              Contact Us
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default BusinessTools; 