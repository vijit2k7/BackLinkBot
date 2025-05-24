import React, { useState } from 'react';
import { LineChart, Search, ArrowRight, Loader2, CheckCircle, XCircle, AlertCircle, Download, RefreshCw, Link as LinkIcon } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/components/ui/use-toast';
import SeoHead from '@/components/SeoHead';
import { generateToolMetadata, generateToolJsonLd } from '@/lib/seo';

// Types for SEO analysis
interface SeoIssue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'warning';
  recommendation: string;
}

interface SeoAnalysisResult {
  url: string;
  score: number;
  timestamp: number;
  title: string;
  description: string;
  issues: SeoIssue[];
  meta: {
    pageTitle: string;
    metaDescription: string;
    h1Count: number;
    wordCount: number;
    pageSpeed: number;
    mobileOptimized: boolean;
  };
}

interface AnalysisHistory {
  id: string;
  url: string;
  score: number;
  timestamp: number;
}

const SeoAnalyzer = () => {
  // States
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('analysis');

  // Generate SEO metadata
  const toolName = "SEO Analyzer";
  const toolDescription = "Analyze your website for SEO issues and get recommendations to improve your search engine rankings.";
  const toolUrl = "/tools/seo-analyzer";
  
  // Generate structured data
  const structuredData = generateToolJsonLd(toolName, toolDescription, `https://backlinkbot.ai${toolUrl}`);
  
  // Get metadata for SEO
  const metadata = generateToolMetadata(toolName, toolDescription);

  // Regular expression for URL validation
  const urlRegex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format
    if (!urlRegex.test(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = performMockSeoAnalysis(url);
      setAnalysisResult(result);
      
      // Add to history
      const historyItem: AnalysisHistory = {
        id: `analysis-${Date.now()}`,
        url: result.url,
        score: result.score,
        timestamp: result.timestamp
      };
      
      setAnalysisHistory(prevHistory => [historyItem, ...prevHistory]);
      setLoading(false);
    }, 2500);
  };

  // Perform mock SEO analysis
  const performMockSeoAnalysis = (targetUrl: string): SeoAnalysisResult => {
    // In a real application, this would make API calls to analyze the URL
    // Here we'll generate mock data
    
    // Parse domain from URL for display purposes
    const domain = targetUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    
    // Generate random scores for various aspects
    const titleScore = Math.random();
    const descriptionScore = Math.random();
    const headingsScore = Math.random();
    const contentScore = Math.random();
    const speedScore = Math.random();
    const mobileScore = Math.random();
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (titleScore * 15 + 
       descriptionScore * 15 + 
       headingsScore * 10 + 
       contentScore * 25 + 
       speedScore * 20 + 
       mobileScore * 15) 
    );
    
    // Generate issues based on scores
    const issues: SeoIssue[] = [];
    
    // Title issues
    if (titleScore < 0.4) {
      issues.push({
        id: 'title-length',
        title: 'Page Title Too Short',
        description: 'Your page title is too short. It should be between 50-60 characters.',
        severity: 'high',
        status: 'fail',
        recommendation: 'Extend your title to include more relevant keywords while keeping it under 60 characters.'
      });
    } else if (titleScore > 0.4 && titleScore < 0.7) {
      issues.push({
        id: 'title-keywords',
        title: 'Title Missing Primary Keywords',
        description: 'Your title appears to be missing important keywords relevant to your content.',
        severity: 'medium',
        status: 'warning',
        recommendation: 'Include your primary keyword in the title, preferably near the beginning.'
      });
    }
    
    // Description issues
    if (descriptionScore < 0.4) {
      issues.push({
        id: 'description-missing',
        title: 'Meta Description Missing or Too Short',
        description: 'Your page is missing a meta description or it\'s too short.',
        severity: 'high',
        status: 'fail',
        recommendation: 'Add a compelling meta description between 120-155 characters that includes your target keywords.'
      });
    } else if (descriptionScore > 0.4 && descriptionScore < 0.7) {
      issues.push({
        id: 'description-quality',
        title: 'Meta Description Could Be Improved',
        description: 'Your meta description exists but could be more compelling or keyword-rich.',
        severity: 'medium',
        status: 'warning',
        recommendation: 'Enhance your meta description with a clear call-to-action and ensure it contains your target keywords.'
      });
    }
    
    // Headings issues
    if (headingsScore < 0.5) {
      issues.push({
        id: 'heading-structure',
        title: 'Poor Heading Structure',
        description: 'Your page doesn\'t use headings effectively or is missing H1 tags.',
        severity: 'medium',
        status: 'fail',
        recommendation: 'Ensure your page has a single H1 tag and uses H2-H6 tags to create a logical content hierarchy.'
      });
    }
    
    // Content issues
    if (contentScore < 0.3) {
      issues.push({
        id: 'content-thin',
        title: 'Thin Content',
        description: 'Your page has very little content, which may be seen as low value by search engines.',
        severity: 'high',
        status: 'fail',
        recommendation: 'Expand your content to at least 300 words, focusing on providing value to users.'
      });
    } else if (contentScore > 0.3 && contentScore < 0.6) {
      issues.push({
        id: 'content-keywords',
        title: 'Keyword Density Issues',
        description: 'Your content may not contain enough relevant keywords or they may not be used naturally.',
        severity: 'medium',
        status: 'warning',
        recommendation: 'Review your content to ensure your target keywords appear naturally throughout the text, with a density of 1-2%.'
      });
    }
    
    // Speed issues
    if (speedScore < 0.4) {
      issues.push({
        id: 'speed-slow',
        title: 'Slow Page Speed',
        description: 'Your page loads slowly, which negatively impacts user experience and SEO.',
        severity: 'high',
        status: 'fail',
        recommendation: 'Optimize images, minimize CSS/JS, and consider using a content delivery network (CDN).'
      });
    } else if (speedScore > 0.4 && speedScore < 0.7) {
      issues.push({
        id: 'speed-images',
        title: 'Image Optimization Needed',
        description: 'Your page contains images that are not properly optimized.',
        severity: 'medium',
        status: 'warning',
        recommendation: 'Compress images, use next-gen formats like WebP, and specify image dimensions.'
      });
    }
    
    // Mobile issues
    if (mobileScore < 0.5) {
      issues.push({
        id: 'mobile-viewport',
        title: 'Not Mobile Optimized',
        description: 'Your page is not properly optimized for mobile devices.',
        severity: 'high',
        status: 'fail',
        recommendation: 'Ensure your page uses responsive design and has a properly configured viewport meta tag.'
      });
    }
    
    // Always add some passed checks for a more balanced report
    issues.push({
      id: 'https-enabled',
      title: 'HTTPS is Enabled',
      description: 'Your website correctly uses HTTPS for secure connections.',
      severity: 'low',
      status: 'pass',
      recommendation: 'No action needed. Continue to maintain HTTPS configuration.'
    });
    
    if (Math.random() > 0.5) {
      issues.push({
        id: 'robots-valid',
        title: 'Valid Robots.txt',
        description: 'Your robots.txt file is properly configured.',
        severity: 'low',
        status: 'pass',
        recommendation: 'No action needed. Continue to maintain proper robots.txt configuration.'
      });
    }
    
    // Meta information (mock data)
    const meta = {
      pageTitle: `${domain} - ${Math.random() > 0.5 ? 'Home Page' : 'Welcome to our Website'}`,
      metaDescription: Math.random() > 0.3 
        ? `${domain} is a ${Math.random() > 0.5 ? 'leading provider of' : 'specialized company in'} solutions for businesses.` 
        : '',
      h1Count: Math.floor(Math.random() * 3),
      wordCount: Math.floor(Math.random() * 1500) + 100,
      pageSpeed: Math.floor(speedScore * 100),
      mobileOptimized: mobileScore > 0.5
    };
    
    return {
      url: targetUrl,
      score: overallScore,
      timestamp: Date.now(),
      title: `SEO Analysis for ${domain}`,
      description: `Comprehensive SEO audit for ${targetUrl}`,
      issues,
      meta
    };
  };

  // Analyze a new URL
  const startNewAnalysis = () => {
    setAnalysisResult(null);
    setUrl('');
  };

  // Load a previous analysis
  const loadAnalysis = (historyId: string) => {
    // In a real app, this would fetch the saved analysis from an API or local storage
    // Here we'll just generate a new one
    setActiveTab('analysis');
    setLoading(true);
    
    setTimeout(() => {
      const historyItem = analysisHistory.find(item => item.id === historyId);
      
      if (historyItem) {
        const result = performMockSeoAnalysis(historyItem.url);
        setAnalysisResult(result);
        setUrl(historyItem.url);
      }
      
      setLoading(false);
    }, 1000);
  };

  // Download analysis as PDF/CSV
  const downloadAnalysis = () => {
    // In a real implementation, this would generate and download a PDF or CSV
    toast({
      title: "Export Started",
      description: "Your SEO analysis would now download as a PDF file."
    });
  };

  // Get severity color
  const getSeverityColor = (severity: 'high' | 'medium' | 'low'): string => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': 
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail': 
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': 
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default: 
        return null;
    }
  };

  return (
    <>
      <SeoHead
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        canonicalUrl={toolUrl}
        type="website"
        structuredData={structuredData}
      />
      
      <ToolLayout
        title="SEO Analyzer"
        description="Analyze your website for SEO issues and get recommendations to improve your search engine rankings."
        icon={<LineChart className="h-6 w-6" />}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="history">History ({analysisHistory.length})</TabsTrigger>
          </TabsList>
        
          <TabsContent value="analysis">
            {!analysisResult ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Website URL to Analyze
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      type="url" 
                      placeholder="https://example.com" 
                      className="pl-10 py-6"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Enter the full URL including http:// or https://
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Website...
                    </>
                  ) : (
                    <>
                      Analyze Website <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">What We Analyze</h3>
                  <ul className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Meta Tags
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Heading Structure
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Content Quality
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Mobile Optimization
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Page Speed
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Security (HTTPS)
                    </li>
                  </ul>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Analysis Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{analysisResult.title}</h2>
                    <div className="flex items-center text-gray-500 text-sm">
                      <LinkIcon className="h-4 w-4 mr-1" /> 
                      <a 
                        href={analysisResult.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-purple-600 truncate max-w-md"
                      >
                        {analysisResult.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={startNewAnalysis}>
                      <RefreshCw className="h-4 w-4 mr-1" /> New Analysis
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadAnalysis}>
                      <Download className="h-4 w-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>
                
                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">SEO Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative flex flex-col items-center justify-center pt-4">
                        <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-gray-100">
                          <span className="text-4xl font-bold">
                            {analysisResult.score}
                          </span>
                        </div>
                        <div className="mt-4 text-center">
                          <Badge className={`
                            ${analysisResult.score < 40 ? 'bg-red-100 text-red-800' : 
                              analysisResult.score < 70 ? 'bg-amber-100 text-amber-800' : 
                              'bg-green-100 text-green-800'}
                          `}>
                            {analysisResult.score < 40 ? 'Poor' : 
                              analysisResult.score < 70 ? 'Average' : 
                              'Good'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-2">
                            Analyzed on {new Date(analysisResult.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Page Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Page Title</span>
                          <span className="font-medium">{analysisResult.meta.pageTitle.length} chars</span>
                        </div>
                        <p className="text-sm border p-2 rounded bg-gray-50 line-clamp-1">
                          {analysisResult.meta.pageTitle}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Meta Description</span>
                          <span className="font-medium">
                            {analysisResult.meta.metaDescription.length > 0 ? 
                              `${analysisResult.meta.metaDescription.length} chars` : 
                              'Missing'}
                          </span>
                        </div>
                        {analysisResult.meta.metaDescription ? (
                          <p className="text-sm border p-2 rounded bg-gray-50 line-clamp-2">
                            {analysisResult.meta.metaDescription}
                          </p>
                        ) : (
                          <p className="text-sm text-red-500 border border-red-100 p-2 rounded bg-red-50">
                            No meta description found. This is important for SEO!
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-600">Content Length</p>
                          <p className="font-medium">{analysisResult.meta.wordCount} words</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">H1 Headings</p>
                          <p className="font-medium">{analysisResult.meta.h1Count} found</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Page Speed</p>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{analysisResult.meta.pageSpeed}/100</span>
                            <Progress 
                              value={analysisResult.meta.pageSpeed} 
                              className="h-2 flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mobile Friendly</p>
                          <p className="font-medium flex items-center">
                            {analysisResult.meta.mobileOptimized ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Yes
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500 mr-1" /> No
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Issues List */}
                <div>
                  <h3 className="text-lg font-medium mb-4">SEO Issues & Recommendations</h3>
                  
                  <div className="mb-4 flex items-center gap-4">
                    <Badge variant="outline" className="gap-1 px-2 py-1">
                      <XCircle className="h-3 w-3 text-red-500" /> 
                      <span>Errors: {analysisResult.issues.filter(i => i.status === 'fail').length}</span>
                    </Badge>
                    <Badge variant="outline" className="gap-1 px-2 py-1">
                      <AlertCircle className="h-3 w-3 text-amber-500" /> 
                      <span>Warnings: {analysisResult.issues.filter(i => i.status === 'warning').length}</span>
                    </Badge>
                    <Badge variant="outline" className="gap-1 px-2 py-1">
                      <CheckCircle className="h-3 w-3 text-green-500" /> 
                      <span>Passed: {analysisResult.issues.filter(i => i.status === 'pass').length}</span>
                    </Badge>
                  </div>
                  
                  <Accordion type="multiple" className="space-y-2">
                    {analysisResult.issues.map((issue) => (
                      <AccordionItem 
                        key={issue.id} 
                        value={issue.id}
                        className={`border rounded-lg ${
                          issue.status === 'fail' ? 'border-red-200 bg-red-50' :
                          issue.status === 'warning' ? 'border-amber-200 bg-amber-50' :
                          'border-green-200 bg-green-50'
                        }`}
                      >
                        <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-opacity-10 hover:bg-black">
                          <div className="flex items-center text-left">
                            <div className="mr-3">
                              {getStatusIcon(issue.status)}
                            </div>
                            <div>
                              <p className="font-medium">{issue.title}</p>
                              <p className="text-xs">
                                Severity: <span className={getSeverityColor(issue.severity)}>
                                  {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3 pt-0">
                          <div className="pl-8">
                            <p className="text-sm mb-2">{issue.description}</p>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm font-medium">Recommendation:</p>
                              <p className="text-sm">{issue.recommendation}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {analysisHistory.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-4">Previous Analyses</h3>
                
                <div className="space-y-3">
                  {analysisHistory.map((item) => (
                    <Card 
                      key={item.id} 
                      className="hover:border-purple-200 cursor-pointer transition-colors"
                      onClick={() => loadAnalysis(item.id)}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.url}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <span className={`text-lg font-bold ${
                              item.score < 40 ? 'text-red-500' : 
                              item.score < 70 ? 'text-amber-500' : 
                              'text-green-500'
                            }`}>
                              {item.score}
                            </span>
                            <p className="text-xs text-gray-500">Score</p>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Analysis History</h3>
                <p className="text-gray-500 mb-6">You haven't performed any website analyses yet.</p>
                <Button 
                  variant="default"
                  onClick={() => setActiveTab('analysis')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </ToolLayout>
    </>
  );
};

export default SeoAnalyzer; 