import React, { useState } from 'react';
import { Map, ArrowRight, Loader2, Download, Copy, Check, Calendar, PlusCircle, Trash2, FileCode2 } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// URL entry interface
interface UrlEntry {
  url: string;
  changeFrequency: string;
  priority: string;
  lastModified: string;
}

const SitemapGenerator = () => {
  // State for form inputs
  const [domain, setDomain] = useState<string>('');
  const [urlList, setUrlList] = useState<string>('');
  const [generateMethod, setGenerateMethod] = useState<string>('manual');
  const [defaultChangeFrequency, setDefaultChangeFrequency] = useState<string>('monthly');
  const [defaultPriority, setDefaultPriority] = useState<string>('0.5');
  const [includeLastModified, setIncludeLastModified] = useState<boolean>(true);
  const [includePriority, setIncludePriority] = useState<boolean>(true);
  const [urlEntries, setUrlEntries] = useState<UrlEntry[]>([]);
  
  // State for generated sitemap
  const [generatedSitemap, setGeneratedSitemap] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  
  // Clean domain input
  const cleanDomain = (input: string): string => {
    let domain = input.trim();
    
    // Remove protocol if present
    domain = domain.replace(/^(https?:\/\/)/, '');
    
    // Remove trailing slash if present
    domain = domain.replace(/\/$/, '');
    
    return domain;
  };
  
  // Validate a URL
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };
  
  // Process URL list into entries
  const processUrlList = () => {
    if (!urlList.trim()) {
      toast({
        title: "URL list is empty",
        description: "Please enter at least one URL",
        variant: "destructive"
      });
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const urls = urlList
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
    
    const entries: UrlEntry[] = [];
    
    urls.forEach(url => {
      // Check if URL already has protocol, if not add it
      const fullUrl = url.startsWith('http') ? url : `https://${domain}${url.startsWith('/') ? url : `/${url}`}`;
      
      if (isValidUrl(fullUrl)) {
        entries.push({
          url: fullUrl,
          changeFrequency: defaultChangeFrequency,
          priority: defaultPriority,
          lastModified: today
        });
      } else {
        toast({
          title: "Invalid URL",
          description: `Skipping invalid URL: ${url}`,
          variant: "default"
        });
      }
    });
    
    if (entries.length > 0) {
      setUrlEntries(entries);
      setActiveTab('customize');
      
      toast({
        title: "URLs processed",
        description: `${entries.length} URLs ready to customize`,
      });
    }
  };
  
  // Add a new URL entry
  const addUrlEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setUrlEntries([...urlEntries, {
      url: domain ? `https://${domain}/` : 'https://',
      changeFrequency: defaultChangeFrequency,
      priority: defaultPriority,
      lastModified: today
    }]);
  };
  
  // Remove a URL entry
  const removeUrlEntry = (index: number) => {
    const newEntries = [...urlEntries];
    newEntries.splice(index, 1);
    setUrlEntries(newEntries);
  };
  
  // Update URL entry
  const updateUrlEntry = (index: number, field: keyof UrlEntry, value: string) => {
    const newEntries = [...urlEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setUrlEntries(newEntries);
  };
  
  // Generate sitemap XML
  const generateSitemap = () => {
    if (urlEntries.length === 0) {
      toast({
        title: "No URLs",
        description: "Please add at least one URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
      const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      const urlsetClose = '</urlset>';
      
      let urlElements = '';
      
      urlEntries.forEach(entry => {
        urlElements += '  <url>\n';
        urlElements += `    <loc>${entry.url}</loc>\n`;
        
        if (includeLastModified) {
          urlElements += `    <lastmod>${entry.lastModified}</lastmod>\n`;
        }
        
        urlElements += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
        
        if (includePriority) {
          urlElements += `    <priority>${entry.priority}</priority>\n`;
        }
        
        urlElements += '  </url>\n';
      });
      
      const sitemap = xmlHeader + urlsetOpen + urlElements + urlsetClose;
      
      setGeneratedSitemap(sitemap);
      setIsGenerating(false);
      setActiveTab('result');
      
      toast({
        title: "Sitemap generated!",
        description: `Successfully created sitemap with ${urlEntries.length} URLs.`,
      });
    }, 1500);
  };
  
  // Copy sitemap to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSitemap);
    setHasCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "The sitemap XML has been copied to your clipboard.",
    });
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };
  
  // Download sitemap as XML file
  const downloadSitemap = () => {
    const blob = new Blob([generatedSitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Sitemap downloaded!",
      description: "Your sitemap.xml file has been downloaded.",
    });
  };
  
  // Handle domain input
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove https://, http://, and trailing slash
    setDomain(cleanDomain(e.target.value));
  };
  
  return (
    <ToolLayout
      title="Sitemap Generator"
      description="Create XML sitemaps for your website to improve SEO"
      icon={<Map className="h-6 w-6 text-green-500" />}
      helpText="Generate an XML sitemap to help search engines discover and crawl your website pages."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="generator">1. Add URLs</TabsTrigger>
          <TabsTrigger 
            value="customize" 
            disabled={urlEntries.length === 0 && activeTab === 'generator'}
          >
            2. Customize
          </TabsTrigger>
          <TabsTrigger 
            value="result" 
            disabled={!generatedSitemap}
          >
            3. Get Sitemap
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add URLs to your Sitemap</CardTitle>
                  <CardDescription>
                    Enter your website domain and the URLs you want to include
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="domain">
                      Website Domain <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <span className="text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2">
                        https://
                      </span>
                      <Input
                        id="domain"
                        placeholder="example.com"
                        value={domain}
                        onChange={handleDomainChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter your domain name without http:// or https://
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>URL Collection Method</Label>
                    <RadioGroup value={generateMethod} onValueChange={setGenerateMethod} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual">Manual Entry</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" disabled />
                        <Label htmlFor="auto" className="text-gray-500">Automatic Crawl (Pro Feature)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {generateMethod === 'manual' && (
                    <div className="space-y-2">
                      <Label htmlFor="url-list">
                        Enter your URLs (one per line)
                      </Label>
                      <Textarea
                        id="url-list"
                        placeholder={`/about\n/contact\n/products\n/blog\n/blog/post-1`}
                        value={urlList}
                        onChange={(e) => setUrlList(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        You can enter full URLs or just paths (starting with /)
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Default Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="change-frequency">Default Change Frequency</Label>
                        <Select value={defaultChangeFrequency} onValueChange={setDefaultChangeFrequency}>
                          <SelectTrigger id="change-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Always</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Default Priority</Label>
                        <Select value={defaultPriority} onValueChange={setDefaultPriority}>
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                            <SelectItem value="0.9">0.9</SelectItem>
                            <SelectItem value="0.8">0.8</SelectItem>
                            <SelectItem value="0.7">0.7</SelectItem>
                            <SelectItem value="0.6">0.6</SelectItem>
                            <SelectItem value="0.5">0.5 (Medium)</SelectItem>
                            <SelectItem value="0.4">0.4</SelectItem>
                            <SelectItem value="0.3">0.3</SelectItem>
                            <SelectItem value="0.2">0.2</SelectItem>
                            <SelectItem value="0.1">0.1 (Lowest)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="include-last-modified" 
                          checked={includeLastModified}
                          onCheckedChange={setIncludeLastModified} 
                        />
                        <Label htmlFor="include-last-modified">Include Last Modified Date</Label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Recommended
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="include-priority" 
                          checked={includePriority}
                          onCheckedChange={setIncludePriority} 
                        />
                        <Label htmlFor="include-priority">Include Priority</Label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button 
                    type="button" 
                    onClick={processUrlList}
                    disabled={!domain || (!urlList.trim() && generateMethod === 'manual')}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  >
                    Continue to Customize
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why Use a Sitemap?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Improved Crawling</h4>
                      <p className="text-sm text-gray-500">Help search engines find and index all pages on your website.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Better Indexing</h4>
                      <p className="text-sm text-gray-500">Provide hints about page importance and update frequency.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Faster Content Discovery</h4>
                      <p className="text-sm text-gray-500">New content gets discovered and indexed more quickly.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">SEO Best Practice</h4>
                      <p className="text-sm text-gray-500">Implementing sitemaps is a recognized SEO best practice.</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">XML Sitemap Example</h4>
                    <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                      &lt;?xml version="1.0" encoding="UTF-8"?&gt;<br />
                      &lt;urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"&gt;<br />
                      &nbsp;&nbsp;&lt;url&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;loc&gt;https://example.com/&lt;/loc&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;lastmod&gt;2023-08-15&lt;/lastmod&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;changefreq&gt;monthly&lt;/changefreq&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;priority&gt;1.0&lt;/priority&gt;<br />
                      &nbsp;&nbsp;&lt;/url&gt;<br />
                      &lt;/urlset&gt;
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="customize">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Customize URL Properties</CardTitle>
                  <CardDescription>
                    Modify the properties for each URL in your sitemap
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addUrlEntry}
                  className="flex items-center"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add URL
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 bg-gray-50 p-3 border-b">
                    <div className="col-span-5 font-medium text-sm">URL</div>
                    <div className="col-span-2 font-medium text-sm">Last Modified</div>
                    <div className="col-span-2 font-medium text-sm">Change Frequency</div>
                    <div className="col-span-2 font-medium text-sm">Priority</div>
                    <div className="col-span-1 font-medium text-sm text-center">Actions</div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    {urlEntries.length > 0 ? (
                      urlEntries.map((entry, index) => (
                        <div 
                          key={index} 
                          className={`grid grid-cols-12 gap-2 p-3 items-center ${
                            index !== urlEntries.length - 1 ? 'border-b' : ''
                          }`}
                        >
                          <div className="col-span-5">
                            <Input
                              value={entry.url}
                              onChange={(e) => updateUrlEntry(index, 'url', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="date"
                              value={entry.lastModified}
                              onChange={(e) => updateUrlEntry(index, 'lastModified', e.target.value)}
                              className="text-sm"
                              disabled={!includeLastModified}
                            />
                          </div>
                          <div className="col-span-2">
                            <Select 
                              value={entry.changeFrequency} 
                              onValueChange={(value) => updateUrlEntry(index, 'changeFrequency', value)}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="always">Always</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Select 
                              value={entry.priority} 
                              onValueChange={(value) => updateUrlEntry(index, 'priority', value)}
                              disabled={!includePriority}
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1.0">1.0</SelectItem>
                                <SelectItem value="0.9">0.9</SelectItem>
                                <SelectItem value="0.8">0.8</SelectItem>
                                <SelectItem value="0.7">0.7</SelectItem>
                                <SelectItem value="0.6">0.6</SelectItem>
                                <SelectItem value="0.5">0.5</SelectItem>
                                <SelectItem value="0.4">0.4</SelectItem>
                                <SelectItem value="0.3">0.3</SelectItem>
                                <SelectItem value="0.2">0.2</SelectItem>
                                <SelectItem value="0.1">0.1</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeUrlEntry(index)}
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No URLs added yet. Click "Add URL" to get started.
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {urlEntries.length} URL{urlEntries.length !== 1 ? 's' : ''} in sitemap
                  </p>
                  
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('generator')}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={generateSitemap}
                      disabled={urlEntries.length === 0}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Generate Sitemap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="tips">
                <AccordionTrigger className="text-sm">Tips for Customizing Your Sitemap</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium">URL Priority:</h4>
                      <ul className="list-disc list-inside mt-1 text-gray-600">
                        <li>Home page: 1.0</li>
                        <li>Main category pages: 0.8</li>
                        <li>Important content pages: 0.6-0.7</li>
                        <li>Standard content pages: 0.5</li>
                        <li>Less important pages: 0.1-0.4</li>
                      </ul>
                      <p className="mt-1 text-gray-600">
                        Priority values range from 0.0 to 1.0 and help search engines understand the relative importance of pages.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Change Frequency:</h4>
                      <ul className="list-disc list-inside mt-1 text-gray-600">
                        <li>News/blog pages with frequent updates: "daily" or "hourly"</li>
                        <li>Regular content pages: "weekly" or "monthly"</li>
                        <li>About/contact pages: "yearly" or "never"</li>
                      </ul>
                      <p className="mt-1 text-gray-600">
                        Choose a frequency that accurately reflects how often each page is updated.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Last Modified Date:</h4>
                      <p className="text-gray-600">
                        Always include an accurate last modified date to help search engines identify when content was updated.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="result">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Generating Sitemap...</h3>
              <p className="text-gray-500 mt-2">This will just take a moment</p>
            </div>
          ) : generatedSitemap ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated XML Sitemap</CardTitle>
                  <CardDescription>
                    Your sitemap is ready to download and submit to search engines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border rounded-md p-4 font-mono text-xs overflow-x-auto max-h-[400px]">
                    <pre>{generatedSitemap}</pre>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{urlEntries.length}</span> URLs included in sitemap
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={copyToClipboard}
                      className="flex items-center"
                    >
                      {hasCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy XML
                        </>
                      )}
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={downloadSitemap}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Sitemap
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 font-medium flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Upload to Your Website</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Upload the sitemap.xml file to the root directory of your website.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 font-medium flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Add to robots.txt</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Add the following line to your robots.txt file:
                        </p>
                        <div className="bg-gray-50 p-2 mt-2 rounded-md font-mono text-xs">
                          Sitemap: https://{domain}/sitemap.xml
                        </div>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 font-medium flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Submit to Search Engines</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Submit your sitemap to search engines through their webmaster tools:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                          <li><a href="https://search.google.com/search-console" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Search Console</a></li>
                          <li><a href="https://www.bing.com/webmasters/home" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Bing Webmaster Tools</a></li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 font-medium flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Keep it Updated</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Update your sitemap whenever you add or remove content from your website.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
                <CardFooter className="bg-blue-50 border-t border-blue-100">
                  <div className="flex items-start gap-2">
                    <FileCode2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Pro Tip:</span> Consider generating separate sitemaps for different content types (e.g., blog posts, products) if your site has over 10,000 URLs.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertTitle>No sitemap generated yet</AlertTitle>
              <AlertDescription>
                Please go back to customize your URLs and generate a sitemap.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default SitemapGenerator; 