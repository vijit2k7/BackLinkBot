import React, { useState } from 'react';
import { Link2, ExternalLink, Clipboard, Copy, Check, BarChart3, Clock, RefreshCw, Loader2, Share2 } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Mock data for URL history
interface UrlData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  clicks: number;
  active: boolean;
}

// Generate a random short code
const generateShortCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

// Format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Generate mock click data for demo purposes
const generateMockClicks = (): number => {
  return Math.floor(Math.random() * 1000);
};

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [customAlias, setCustomAlias] = useState<string>('');
  const [useCustomAlias, setUseCustomAlias] = useState<boolean>(false);
  const [trackClicks, setTrackClicks] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('create');
  const [copiedShortUrl, setCopiedShortUrl] = useState<string | null>(null);
  
  // Store URL history (mock data)
  const [urlHistory, setUrlHistory] = useState<UrlData[]>([
    {
      id: '1',
      originalUrl: 'https://example.com/very/long/url/that/is/difficult/to/share/in/messages',
      shortUrl: 'https://short.url/abc123',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      clicks: 423,
      active: true
    },
    {
      id: '2',
      originalUrl: 'https://example.com/another/very/long/url/for/a/marketing/campaign',
      shortUrl: 'https://short.url/def456',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      clicks: 189,
      active: true
    },
    {
      id: '3',
      originalUrl: 'https://example.com/blog/10-tips-for-increasing-your-website-traffic',
      shortUrl: 'https://short.url/ghi789',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      clicks: 1247,
      active: false
    }
  ]);
  
  // Validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to shorten.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if URL is valid
    if (!isValidUrl(originalUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
      return;
    }
    
    // Check if custom alias is provided and enabled
    if (useCustomAlias && !customAlias.trim()) {
      toast({
        title: "Custom alias required",
        description: "Please enter a custom alias or disable the custom alias option.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const shortCode = useCustomAlias ? customAlias : generateShortCode();
      const shortUrl = `https://short.url/${shortCode}`;
      
      // Add new URL to history
      const newUrl: UrlData = {
        id: (urlHistory.length + 1).toString(),
        originalUrl,
        shortUrl,
        createdAt: new Date(),
        clicks: 0,
        active: true
      };
      
      setUrlHistory([newUrl, ...urlHistory]);
      setIsGenerating(false);
      setActiveTab('history');
      
      toast({
        title: "URL shortened!",
        description: "Your shortened URL has been created successfully.",
      });
      
      // Reset form
      setOriginalUrl('');
      setCustomAlias('');
      setUseCustomAlias(false);
    }, 1500);
  };
  
  // Copy URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShortUrl(url);
      
      toast({
        title: "Copied to clipboard!",
        description: "The shortened URL has been copied to your clipboard.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedShortUrl(null);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy URL:', err);
      toast({
        title: "Failed to copy",
        description: "There was a problem copying to clipboard. Please try again.",
        variant: "destructive"
      });
    });
  };
  
  // Toggle URL active status
  const toggleUrlStatus = (id: string) => {
    setUrlHistory(urlHistory.map(url => 
      url.id === id ? { ...url, active: !url.active } : url
    ));
    
    toast({
      title: "Status updated",
      description: "The URL status has been updated successfully.",
    });
  };
  
  // Handle URL regeneration
  const regenerateUrl = (id: string) => {
    const newShortCode = generateShortCode();
    const newShortUrl = `https://short.url/${newShortCode}`;
    
    setUrlHistory(urlHistory.map(url => 
      url.id === id ? { ...url, shortUrl: newShortUrl, clicks: 0 } : url
    ));
    
    toast({
      title: "URL regenerated",
      description: "A new shortened URL has been generated.",
    });
  };
  
  // Delete URL from history
  const deleteUrl = (id: string) => {
    setUrlHistory(urlHistory.filter(url => url.id !== id));
    
    toast({
      title: "URL deleted",
      description: "The URL has been removed from your history.",
    });
  };

  // Calculate total clicks
  const totalClicks = urlHistory.reduce((sum, url) => sum + url.clicks, 0);
  
  // Calculate average clicks per URL
  const averageClicks = urlHistory.length > 0 
    ? Math.round(totalClicks / urlHistory.length) 
    : 0;
  
  return (
    <ToolLayout
      title="URL Shortener"
      description="Create shortened URLs for easier sharing and tracking"
      icon={<Link2 className="h-6 w-6 text-blue-500" />}
      helpText="Enter a long URL to generate a shortened version. Track clicks and manage your shortened URLs."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Short URL</TabsTrigger>
          <TabsTrigger value="history">URL History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shorten a Long URL</CardTitle>
                  <CardDescription>
                    Create a shortened URL that's easy to share and track
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="original-url">
                        Original URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="original-url"
                        placeholder="https://example.com/your/long/url"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Enter the full URL including http:// or https://
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="custom-alias"
                        checked={useCustomAlias}
                        onCheckedChange={setUseCustomAlias}
                      />
                      <Label htmlFor="custom-alias">Use custom alias</Label>
                    </div>
                    
                    {useCustomAlias && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-alias-input">Custom Alias</Label>
                        <div className="flex gap-2 items-center">
                          <div className="text-sm text-gray-500 whitespace-nowrap">
                            https://short.url/
                          </div>
                          <Input
                            id="custom-alias-input"
                            placeholder="my-custom-url"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value)}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Use only letters, numbers, and hyphens
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="track-clicks"
                        checked={trackClicks}
                        onCheckedChange={setTrackClicks}
                      />
                      <Label htmlFor="track-clicks">Track clicks (analytics)</Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Shorten URL
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">URL Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">{urlHistory.length}</div>
                      <div className="text-sm text-gray-500">Total URLs</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">{totalClicks}</div>
                      <div className="text-sm text-gray-500">Total Clicks</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">{averageClicks}</div>
                    <div className="text-sm text-gray-500">Avg. Clicks Per URL</div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Benefits of Short URLs</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Easier to share on social media</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Track click-through rates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>More professional appearance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Conserve character space in messages</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Shortened URLs</CardTitle>
              <CardDescription>
                Manage and track your shortened URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {urlHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[400px]">Original URL</TableHead>
                        <TableHead>Short URL</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urlHistory.map((url) => (
                        <TableRow key={url.id}>
                          <TableCell className="font-medium">
                            <div className="truncate max-w-xs" title={url.originalUrl}>
                              {url.originalUrl}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <a 
                                href={url.shortUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                              >
                                {url.shortUrl.replace('https://', '')}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" 
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => copyToClipboard(url.shortUrl)}
                                    >
                                      {copiedShortUrl === url.shortUrl ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy to clipboard</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              {formatDate(url.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3 text-gray-400" />
                              {url.clicks}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={url.active ? "default" : "secondary"}
                              className={url.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                            >
                              {url.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" 
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => toggleUrlStatus(url.id)}
                                    >
                                      {url.active ? (
                                        <span className="text-xs">Deactivate</span>
                                      ) : (
                                        <span className="text-xs">Activate</span>
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{url.active ? "Deactivate URL" : "Activate URL"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" 
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => regenerateUrl(url.id)}
                                    >
                                      <RefreshCw className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Generate new short URL</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost" 
                                      size="icon"
                                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => deleteUrl(url.id)}
                                    >
                                      <span className="text-xs">Delete</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete URL</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Link2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first shortened URL to see it here
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('create')}
                  >
                    Create a short URL
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {urlHistory.length > 0 && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Using Shortened URLs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Use in social media posts</h4>
                        <p className="text-sm text-gray-600">
                          Shortened URLs are perfect for platforms with character limits like Twitter, and they look cleaner in all social posts.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Include in printed materials</h4>
                        <p className="text-sm text-gray-600">
                          Short URLs are easier to type from business cards, flyers, and other printed materials.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Track marketing campaigns</h4>
                        <p className="text-sm text-gray-600">
                          Create different shortened URLs for different marketing channels to track which ones perform best.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Use custom aliases for brand recognition</h4>
                        <p className="text-sm text-gray-600">
                          When possible, use custom aliases that relate to your content for better brand recognition and user trust.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default UrlShortener; 