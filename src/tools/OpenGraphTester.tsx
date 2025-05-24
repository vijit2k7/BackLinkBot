import React, { useState } from 'react';
import { Share2, ArrowRight, Loader2, RefreshCw, AlertCircle, Check, Globe, Facebook, Twitter, Linkedin } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// Mock API response for demonstration
interface OpenGraphData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
  error?: string;
  warnings?: string[];
}

const OpenGraphTester = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ogData, setOgData] = useState<OpenGraphData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('facebook');
  const [activeTestTab, setActiveTestTab] = useState<string>('test');
  
  // Handle URL submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a URL to test",
        variant: "destructive"
      });
      return;
    }
    
    // Check if URL is valid
    try {
      new URL(url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would be a fetch call to an API
      const mockResponse = getMockData(url);
      
      setOgData(mockResponse);
      setIsLoading(false);
      setActiveTestTab('results');
      
      if (mockResponse.error) {
        toast({
          title: "Error fetching Open Graph data",
          description: mockResponse.error,
          variant: "destructive"
        });
      } else if (mockResponse.warnings && mockResponse.warnings.length > 0) {
        toast({
          title: "Open Graph data retrieved with warnings",
          description: "Some recommended tags are missing. See details in results.",
          variant: "default"
        });
      } else {
        toast({
          title: "Open Graph data retrieved successfully",
          description: "Your link preview is now available",
        });
      }
    }, 2000);
  };
  
  // Mock data for demonstration purposes
  const getMockData = (testUrl: string): OpenGraphData => {
    // Simulate different responses based on URL for demo purposes
    if (testUrl.includes('example.com')) {
      return {
        url: testUrl,
        title: 'Example Domain',
        description: 'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
        image: 'https://via.placeholder.com/1200x630',
        siteName: 'Example',
        type: 'website',
        warnings: [
          'No og:image width and height specified',
          'Missing og:locale tag'
        ]
      };
    } else if (testUrl.includes('missing')) {
      return {
        url: testUrl,
        title: testUrl,
        description: '',
        image: '',
        siteName: '',
        type: 'website',
        warnings: [
          'Missing og:title tag',
          'Missing og:description tag',
          'Missing og:image tag',
          'Missing og:site_name tag'
        ]
      };
    } else if (testUrl.includes('error')) {
      return {
        url: testUrl,
        title: '',
        description: '',
        image: '',
        siteName: '',
        type: '',
        error: 'Could not fetch Open Graph data. The site may be blocking requests or the URL may be invalid.'
      };
    } else {
      // Generate somewhat random data for other URLs
      const domain = new URL(testUrl).hostname;
      const title = `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} - Official Website`;
      return {
        url: testUrl,
        title: title,
        description: `Welcome to ${domain}, where you can find all the information about our products and services. Learn more about what we offer and how we can help you.`,
        image: `https://via.placeholder.com/1200x630/4a90e2/ffffff?text=${domain}`,
        siteName: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
        type: 'website'
      };
    }
  };
  
  // Reset form
  const handleReset = () => {
    setUrl('');
    setOgData(null);
    setActiveTestTab('test');
  };
  
  // Get a score based on completeness of Open Graph data
  const getOgScore = (): { score: number, maxScore: number } => {
    if (!ogData) return { score: 0, maxScore: 0 };
    
    const maxScore = 6; // Title, description, image, type, url, site_name
    let score = 0;
    
    if (ogData.title) score++;
    if (ogData.description) score++;
    if (ogData.image) score++;
    if (ogData.type) score++;
    if (ogData.url) score++;
    if (ogData.siteName) score++;
    
    return { score, maxScore };
  };
  
  return (
    <ToolLayout
      title="Open Graph Tester"
      description="Test how your website appears when shared on social media"
      icon={<Share2 className="h-6 w-6 text-blue-500" />}
      helpText="Enter any URL to see how it will look when shared on Facebook, Twitter, and LinkedIn."
    >
      <Tabs value={activeTestTab} onValueChange={setActiveTestTab} className="space-y-8">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="test">Test URL</TabsTrigger>
          <TabsTrigger value="results" disabled={!ogData && !isLoading}>
            View Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="test">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test URL for Social Media Sharing</CardTitle>
                  <CardDescription>
                    Enter the URL of your webpage to check its Open Graph metadata
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="url">
                        Website URL <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex">
                        <Input
                          id="url"
                          placeholder="https://example.com/page"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="flex-1"
                          required
                        />
                        <Button 
                          type="submit" 
                          className="ml-2 bg-blue-600 hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Testing
                            </>
                          ) : (
                            <>
                              Test
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Enter the full URL including http:// or https://
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What is Open Graph?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Open Graph is a protocol that enables any web page to become a rich object in a social graph. It was originally created by Facebook but is now used by most social media platforms to display rich previews when links are shared.
                    </p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="key-tags">
                        <AccordionTrigger className="text-sm">
                          Key Open Graph Tags
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-5 gap-1">
                              <div className="col-span-1 font-medium">og:title</div>
                              <div className="col-span-4">The title of your page</div>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              <div className="col-span-1 font-medium">og:description</div>
                              <div className="col-span-4">A brief description of the content</div>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              <div className="col-span-1 font-medium">og:image</div>
                              <div className="col-span-4">The URL of the image that appears when shared</div>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              <div className="col-span-1 font-medium">og:url</div>
                              <div className="col-span-4">The canonical URL of the page</div>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              <div className="col-span-1 font-medium">og:type</div>
                              <div className="col-span-4">The type of content (website, article, etc.)</div>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              <div className="col-span-1 font-medium">og:site_name</div>
                              <div className="col-span-4">The name of the overall website</div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="code-example">
                        <AccordionTrigger className="text-sm">
                          Code Example
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs overflow-x-auto">
                            &lt;head&gt;<br />
                            &nbsp;&nbsp;&lt;meta property="og:title" content="Your Page Title" /&gt;<br />
                            &nbsp;&nbsp;&lt;meta property="og:description" content="Description of your page" /&gt;<br />
                            &nbsp;&nbsp;&lt;meta property="og:image" content="https://example.com/image.jpg" /&gt;<br />
                            &nbsp;&nbsp;&lt;meta property="og:url" content="https://example.com/page" /&gt;<br />
                            &nbsp;&nbsp;&lt;meta property="og:type" content="website" /&gt;<br />
                            &nbsp;&nbsp;&lt;meta property="og:site_name" content="Your Site Name" /&gt;<br />
                            &lt;/head&gt;
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why Test Open Graph?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Improved Click-Through Rates</h4>
                      <p className="text-sm text-gray-500">Links with rich previews get up to 2x more clicks than plain links.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Brand Control</h4>
                      <p className="text-sm text-gray-500">Control how your content looks when shared across social platforms.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">SEO Benefits</h4>
                      <p className="text-sm text-gray-500">Proper metadata can indirectly improve your search engine rankings.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Professional Appearance</h4>
                      <p className="text-sm text-gray-500">Well-configured links demonstrate attention to detail and professionalism.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-blue-50 flex items-center justify-center p-4">
                  <Globe className="h-5 w-5 text-blue-500 mr-2" />
                  <p className="text-sm text-center text-blue-700">
                    83% of marketers say social media is important for their business.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Fetching Open Graph data...</h3>
              <p className="text-gray-500 mt-2">This will just take a moment</p>
            </div>
          ) : ogData ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Results for {ogData.url}</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Another URL
                </Button>
              </div>
              
              {ogData.error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{ogData.error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Open Graph Score</CardTitle>
                      <CardDescription>
                        How well your page is optimized for social sharing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="relative w-20 h-20 mr-4">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              className="text-gray-200"
                              strokeWidth="10"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className={`${
                                getOgScore().score / getOgScore().maxScore >= 0.8
                                  ? 'text-green-500'
                                  : getOgScore().score / getOgScore().maxScore >= 0.5
                                  ? 'text-yellow-500'
                                  : 'text-red-500'
                              }`}
                              strokeWidth="10"
                              strokeDasharray={`${2 * Math.PI * 40 * (getOgScore().score / getOgScore().maxScore)} ${
                                2 * Math.PI * 40 * (1 - getOgScore().score / getOgScore().maxScore)
                              }`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                            {Math.round((getOgScore().score / getOgScore().maxScore) * 100)}%
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {getOgScore().score}/{getOgScore().maxScore} Tags Found
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {getOgScore().score === getOgScore().maxScore
                              ? 'Excellent! All essential Open Graph tags are present.'
                              : getOgScore().score / getOgScore().maxScore >= 0.8
                              ? 'Good job! Most essential Open Graph tags are present.'
                              : getOgScore().score / getOgScore().maxScore >= 0.5
                              ? 'Room for improvement. Some Open Graph tags are missing.'
                              : 'Needs work. Many essential Open Graph tags are missing.'}
                          </p>
                        </div>
                      </div>
                      
                      {ogData.warnings && ogData.warnings.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-yellow-700">Warnings:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                            {ogData.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Social Media Preview</CardTitle>
                      <CardDescription>
                        How your link appears when shared on different platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                          <TabsTrigger value="facebook" className="flex items-center">
                            <Facebook className="h-4 w-4 mr-2" />
                            Facebook
                          </TabsTrigger>
                          <TabsTrigger value="twitter" className="flex items-center">
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </TabsTrigger>
                          <TabsTrigger value="linkedin" className="flex items-center">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="facebook">
                          <div className="border rounded-md overflow-hidden max-w-lg mx-auto">
                            <div className="bg-[#f0f2f5] p-3">
                              <div className="flex items-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                <div className="ml-2">
                                  <div className="font-medium text-[#050505]">User Name</div>
                                  <div className="text-xs text-[#65676b]">Just now · Public</div>
                                </div>
                              </div>
                              <p className="text-sm text-[#050505]">Check out this link:</p>
                            </div>
                            <div className="bg-white border border-gray-300">
                              {ogData.image ? (
                                <div 
                                  className="h-52 bg-cover bg-center" 
                                  style={{ backgroundImage: `url(${ogData.image})` }}
                                ></div>
                              ) : (
                                <div className="h-52 flex items-center justify-center bg-gray-100 text-gray-400">
                                  No image available
                                </div>
                              )}
                              <div className="p-3">
                                <div className="text-xs uppercase text-gray-500">
                                  {ogData.siteName || new URL(ogData.url).hostname}
                                </div>
                                <div className="text-base font-medium text-[#050505] my-1">
                                  {ogData.title || 'No title available'}
                                </div>
                                <div className="text-sm text-[#65676b] line-clamp-2">
                                  {ogData.description || 'No description available'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="twitter">
                          <div className="border rounded-md overflow-hidden max-w-lg mx-auto">
                            <div className="bg-white p-3">
                              <div className="flex items-center mb-2">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div className="ml-2">
                                  <div className="flex items-center">
                                    <span className="font-bold text-[#0f1419]">User Name</span>
                                    <span className="text-[#536471] ml-1">@username</span>
                                  </div>
                                  <div className="text-[#536471]">Sharing a link</div>
                                </div>
                              </div>
                            </div>
                            <div className="border border-gray-200 rounded-xl overflow-hidden mx-3 mb-3">
                              {ogData.image ? (
                                <div 
                                  className="h-52 bg-cover bg-center" 
                                  style={{ backgroundImage: `url(${ogData.image})` }}
                                ></div>
                              ) : (
                                <div className="h-52 flex items-center justify-center bg-gray-100 text-gray-400">
                                  No image available
                                </div>
                              )}
                              <div className="p-3 bg-white">
                                <div className="text-sm font-bold text-[#0f1419] my-1">
                                  {ogData.title || 'No title available'}
                                </div>
                                <div className="text-sm text-[#536471] line-clamp-2">
                                  {ogData.description || 'No description available'}
                                </div>
                                <div className="text-[#536471] text-sm mt-2 flex items-center">
                                  <Globe className="h-3.5 w-3.5 mr-1" />
                                  {new URL(ogData.url).hostname}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="linkedin">
                          <div className="border rounded-md overflow-hidden max-w-lg mx-auto">
                            <div className="bg-white p-3">
                              <div className="flex items-center mb-2">
                                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                                <div className="ml-2">
                                  <div className="font-medium">User Name</div>
                                  <div className="text-xs text-gray-500">Just now</div>
                                </div>
                              </div>
                              <p className="text-sm mb-2">Interesting link I wanted to share:</p>
                            </div>
                            <div className="border border-gray-200">
                              {ogData.image ? (
                                <div 
                                  className="h-52 bg-cover bg-center" 
                                  style={{ backgroundImage: `url(${ogData.image})` }}
                                ></div>
                              ) : (
                                <div className="h-52 flex items-center justify-center bg-gray-100 text-gray-400">
                                  No image available
                                </div>
                              )}
                              <div className="p-3 bg-white">
                                <div className="text-base font-medium text-[#000000] my-1">
                                  {ogData.title || 'No title available'}
                                </div>
                                <div className="text-sm text-gray-600 line-clamp-2">
                                  {ogData.description || 'No description available'}
                                </div>
                                <div className="text-gray-500 text-sm mt-2 flex items-center">
                                  {new URL(ogData.url).hostname}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Detected Open Graph Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">og:title</Label>
                            <div className="mt-1 p-2 border rounded-md bg-gray-50 min-h-[40px]">
                              {ogData.title || <span className="text-gray-400">Not found</span>}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-gray-500">og:url</Label>
                            <div className="mt-1 p-2 border rounded-md bg-gray-50 min-h-[40px] break-all">
                              {ogData.url || <span className="text-gray-400">Not found</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">og:description</Label>
                          <div className="mt-1 p-2 border rounded-md bg-gray-50 min-h-[40px]">
                            {ogData.description || <span className="text-gray-400">Not found</span>}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">og:image</Label>
                          <div className="mt-1 p-2 border rounded-md bg-gray-50 min-h-[40px] break-all">
                            {ogData.image || <span className="text-gray-400">Not found</span>}
                          </div>
                          {ogData.image && (
                            <div className="mt-2 h-32 w-32 border rounded-md overflow-hidden">
                              <img 
                                src={ogData.image} 
                                alt="OG Image" 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">og:type</Label>
                            <div className="mt-1 p-2 border rounded-md bg-gray-50 min-h-[40px]">
                              {ogData.type || <span className="text-gray-400">Not found</span>}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-gray-500">og:site_name</Label>
                            <div className="mt-1 p-2 border rounded-md bg-gray-50 min-h-[40px]">
                              {ogData.siteName || <span className="text-gray-400">Not found</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">How to Fix Open Graph Issues</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">1. Add Missing Tags</h4>
                        <p className="text-sm text-gray-600">
                          Ensure all six essential Open Graph tags (title, description, image, url, type, and site_name) are included in your page's &lt;head&gt; section.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">2. Optimize Your Images</h4>
                        <p className="text-sm text-gray-600">
                          Use images at least 1200×630 pixels for best display across platforms. Include og:image:width and og:image:height tags.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">3. Use Content Management System Plugins</h4>
                        <p className="text-sm text-gray-600">
                          If you use WordPress, Shopify, or similar platforms, install SEO plugins that manage Open Graph tags automatically.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">4. Test After Changes</h4>
                        <p className="text-sm text-gray-600">
                          After updating your Open Graph tags, use this tool to verify they're working correctly. Some platforms cache Open Graph data, so you may need to use their debug tools to refresh.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-blue-50 border-t border-blue-100">
                      <div className="text-sm text-blue-800">
                        <span className="font-medium">Pro Tip:</span> Facebook has a <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="underline">Sharing Debugger</a> tool that allows you to refresh their cache of your Open Graph data.
                      </div>
                    </CardFooter>
                  </Card>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Share2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No URL Tested Yet</h3>
              <p className="text-gray-500 mb-4">
                Enter a URL to test how it appears when shared on social media
              </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTestTab('test')}
              >
                Test a URL
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default OpenGraphTester; 