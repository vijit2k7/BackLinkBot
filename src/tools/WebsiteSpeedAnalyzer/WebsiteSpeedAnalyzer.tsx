import React, { useState } from 'react';
import { Activity, Clock, History, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import ToolLayout from '../components/ToolLayout';
import ResultsDisplay from './ResultsDisplay';
import { generateMockSpeedTest, generateId, getScoreColor } from './utils';
import { SpeedTestResult, SpeedTestHistory } from './types';

const WebsiteSpeedAnalyzer: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('analyzer');
  const [testResult, setTestResult] = useState<SpeedTestResult | null>(null);
  const [history, setHistory] = useState<SpeedTestHistory[]>([]);
  
  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL to analyze",
        variant: "destructive",
      });
      return;
    }
    
    // Add protocol if not present
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = generateMockSpeedTest(formattedUrl);
      setTestResult(result);
      setIsLoading(false);
      
      toast({
        title: "Analysis complete",
        description: "Website speed analysis has been completed.",
      });
    }, 3000);
  };
  
  // Save result to history
  const saveResult = () => {
    if (!testResult) return;
    
    const historyItem: SpeedTestHistory = {
      id: generateId(),
      url: testResult.url,
      date: new Date().toISOString(),
      performanceScore: testResult.performanceScore
    };
    
    setHistory([historyItem, ...history]);
    
    toast({
      title: "Result saved",
      description: "The test result has been saved to your history.",
    });
  };
  
  // Reset the test
  const resetTest = () => {
    setTestResult(null);
    setUrl('');
  };
  
  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    
    toast({
      title: "History cleared",
      description: "Your test history has been cleared.",
    });
  };
  
  // Delete a single history item
  const deleteHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
    
    toast({
      title: "Item removed",
      description: "The test result has been removed from your history.",
    });
  };
  
  // Rerun a test from history
  const rerunTest = (url: string) => {
    setUrl(url);
    setActiveTab('analyzer');
    
    // Auto-submit the test
    setTimeout(() => {
      setIsLoading(true);
      
      setTimeout(() => {
        const result = generateMockSpeedTest(url);
        setTestResult(result);
        setIsLoading(false);
        
        toast({
          title: "Analysis complete",
          description: "Website speed analysis has been completed.",
        });
      }, 3000);
    }, 500);
  };

  return (
    <ToolLayout
      title="Website Speed Analyzer"
      description="Test and analyze your website's loading speed and performance"
      icon={<Activity className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="analyzer" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyzer">Speed Test</TabsTrigger>
          <TabsTrigger value="history">Test History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyzer" className="space-y-4 mt-4">
          {!testResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Website Speed Test</CardTitle>
                <CardDescription>
                  Enter your website URL below to analyze its loading speed and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL</Label>
                    <div className="flex w-full space-x-2">
                      <Input
                        id="url"
                        placeholder="e.g., example.com"
                        value={url}
                        onChange={handleUrlChange}
                        disabled={isLoading}
                      />
                      <Button type="submit" disabled={isLoading || !url.trim()}>
                        {isLoading ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : 'Analyze'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Protocol (http://, https://) will be automatically added if not specified
                    </p>
                  </div>
                </form>
                
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium">What This Tool Checks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">Page Loading Speed</div>
                      <p className="text-sm text-muted-foreground">
                        Measures how quickly your content loads and becomes interactive for users
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">Core Web Vitals</div>
                      <p className="text-sm text-muted-foreground">
                        Analyzes user experience metrics like LCP, FID, and CLS that impact SEO
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">Resource Analysis</div>
                      <p className="text-sm text-muted-foreground">
                        Examines JavaScript, CSS, images, and other resources that affect load time
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">Performance Issues</div>
                      <p className="text-sm text-muted-foreground">
                        Identifies critical problems slowing down your site with actionable advice
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">Optimization Opportunities</div>
                      <p className="text-sm text-muted-foreground">
                        Reveals opportunities to improve speed with estimated time savings
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-2">Mobile Performance</div>
                      <p className="text-sm text-muted-foreground">
                        Evaluates how your site performs on mobile devices and slower connections
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ResultsDisplay 
              result={testResult} 
              onSaveResult={saveResult} 
              onReset={resetTest} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Your Test History</CardTitle>
                <CardDescription>
                  Previous website speed tests you've performed
                </CardDescription>
              </div>
              {history.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearHistory}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No test history yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Your previous website speed tests will appear here. Run a test and save the results to build your history.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setActiveTab('analyzer')}
                  >
                    Run a Test
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[240px]">{item.url}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`text-lg font-bold ${getScoreColor(item.performanceScore)}`}>
                          {item.performanceScore}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => rerunTest(item.url)}
                          >
                            Rerun
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteHistoryItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default WebsiteSpeedAnalyzer; 