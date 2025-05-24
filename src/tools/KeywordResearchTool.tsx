import React, { useState } from 'react';
import { Search, ArrowRight, Loader2, Download, BarChart3, TrendingUp, Bookmark, Info, Zap, Shuffle } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

// Keyword data interface
interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: number;
  cpc: number;
  difficultyScore: number;
  trend: 'up' | 'down' | 'stable';
}

// Mock data for keyword suggestions
const generateKeywordSuggestions = (
  seed: string, 
  country: string, 
  count: number = 15
): KeywordData[] => {
  if (!seed) return [];
  
  // Generate variations of the seed keyword
  const variations = [
    seed,
    `best ${seed}`,
    `${seed} online`,
    `${seed} for beginners`,
    `how to ${seed}`,
    `affordable ${seed}`,
    `${seed} vs`,
    `${seed} near me`,
    `${seed} tips`,
    `${seed} guide`,
    `top ${seed}`,
    `cheap ${seed}`,
    `professional ${seed}`,
    `${seed} services`,
    `${seed} ideas`,
    `${seed} examples`,
    `${seed} software`,
    `${seed} tools`,
    `${seed} course`,
    `learn ${seed}`,
  ];
  
  // Randomize and pick count variations
  const shuffled = variations
    .filter(v => v !== seed) // Remove the exact seed
    .sort(() => 0.5 - Math.random()) // Shuffle array
    .slice(0, count - 1); // Get count-1 items
  
  // Add the seed keyword back at the beginning
  shuffled.unshift(seed);
  
  // Generate mock data for each keyword
  return shuffled.slice(0, count).map(keyword => {
    // Generate random data based on the keyword length as seed
    const seedValue = keyword.length + keyword.charCodeAt(0);
    const rand = (min: number, max: number) => Math.floor((seedValue * Math.sin(keyword.length)) % (max - min + 1)) + min;
    
    // Higher volume for exact match and shorter keywords
    const volumeBase = keyword === seed ? 10000 : 5000;
    const volumeMod = Math.max(1, (20 - keyword.length) / 10);
    let searchVolume = Math.floor(volumeBase * volumeMod * (0.7 + Math.random() * 0.6));
    
    // Adjust volume based on country
    if (country === 'United States') {
      searchVolume = Math.floor(searchVolume * 1.5);
    } else if (country === 'United Kingdom' || country === 'Canada' || country === 'Australia') {
      searchVolume = Math.floor(searchVolume * 0.8);
    } else {
      searchVolume = Math.floor(searchVolume * 0.6);
    }
    
    // Competition is higher for keywords with higher volume
    const competition = Math.min(0.95, 0.3 + (searchVolume / 20000) + Math.random() * 0.3);
    
    // CPC is related to competition
    const cpc = ((competition * 2) + Math.random() * 0.5).toFixed(2);
    
    // Difficulty is a factor of volume and competition
    const difficultyScore = Math.floor((searchVolume / 1000 + competition * 80) + Math.random() * 20);
    
    // Trend is random but weighted
    const trendRandom = Math.random();
    let trend: 'up' | 'down' | 'stable';
    if (trendRandom > 0.7) {
      trend = 'up';
    } else if (trendRandom > 0.4) {
      trend = 'stable';
    } else {
      trend = 'down';
    }
    
    return {
      keyword,
      searchVolume,
      competition,
      cpc: parseFloat(cpc),
      difficultyScore,
      trend
    };
  });
};

// Get competition level label
const getCompetitionLevel = (value: number): string => {
  if (value < 0.3) return 'Low';
  if (value < 0.7) return 'Medium';
  return 'High';
};

// Get difficulty level label
const getDifficultyLevel = (value: number): string => {
  if (value < 30) return 'Easy';
  if (value < 60) return 'Medium';
  return 'Hard';
};

// Get color for difficulty
const getDifficultyColor = (value: number): string => {
  if (value < 30) return 'bg-green-500';
  if (value < 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Format number with commas
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const KeywordResearchTool = () => {
  // State for search inputs
  const [seedKeyword, setSeedKeyword] = useState<string>('');
  const [country, setCountry] = useState<string>('United States');
  const [searchType, setSearchType] = useState<string>('keyword');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for results
  const [keywordResults, setKeywordResults] = useState<KeywordData[]>([]);
  const [savedKeywords, setSavedKeywords] = useState<KeywordData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('research');
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seedKeyword.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a keyword to research",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = generateKeywordSuggestions(seedKeyword.trim(), country);
      setKeywordResults(results);
      setIsLoading(false);
      
      toast({
        title: "Keyword research complete",
        description: `Found ${results.length} keyword suggestions for "${seedKeyword}"`,
      });
    }, 2000);
  };
  
  // Save keyword to list
  const saveKeyword = (keyword: KeywordData) => {
    // Check if already saved
    if (!savedKeywords.some(k => k.keyword === keyword.keyword)) {
      setSavedKeywords([...savedKeywords, keyword]);
      
      toast({
        title: "Keyword saved",
        description: `"${keyword.keyword}" has been added to your saved keywords`,
      });
    } else {
      toast({
        title: "Already saved",
        description: `"${keyword.keyword}" is already in your saved keywords`,
        variant: "default"
      });
    }
  };
  
  // Remove keyword from saved list
  const removeKeyword = (keyword: string) => {
    setSavedKeywords(savedKeywords.filter(k => k.keyword !== keyword));
    
    toast({
      title: "Keyword removed",
      description: `"${keyword}" has been removed from your saved keywords`,
    });
  };
  
  // Download saved keywords as CSV
  const downloadCSV = () => {
    if (savedKeywords.length === 0) {
      toast({
        title: "No keywords to download",
        description: "Save some keywords first",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    const headers = ['Keyword', 'Search Volume', 'Competition', 'CPC ($)', 'Difficulty'];
    const rows = savedKeywords.map(k => [
      k.keyword,
      k.searchVolume.toString(),
      k.competition.toFixed(2),
      k.cpc.toString(),
      k.difficultyScore.toString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keyword-research-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded successfully",
      description: `Saved ${savedKeywords.length} keywords to CSV file`,
    });
  };
  
  // Get related keywords based on a particular keyword
  const getRelatedKeywords = (keyword: string) => {
    setIsLoading(true);
    setSeedKeyword(keyword);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = generateKeywordSuggestions(keyword, country);
      setKeywordResults(results);
      setIsLoading(false);
      
      toast({
        title: "Related keywords found",
        description: `Found ${results.length} keywords related to "${keyword}"`,
      });
    }, 1500);
  };
  
  // Shuffle seed keyword to get new ideas
  const shuffleKeywordIdeas = () => {
    if (!seedKeyword.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a keyword first",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = generateKeywordSuggestions(seedKeyword, country);
      setKeywordResults(results);
      setIsLoading(false);
      
      toast({
        title: "New keyword ideas",
        description: `Generated fresh keyword suggestions for "${seedKeyword}"`,
      });
    }, 1000);
  };
  
  return (
    <ToolLayout
      title="Keyword Research Tool"
      description="Find and analyze the best keywords for your content"
      icon={<Search className="h-6 w-6 text-indigo-500" />}
      helpText="Discover keywords that your audience is searching for and analyze their potential."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="research">Research Keywords</TabsTrigger>
          <TabsTrigger value="saved">
            Saved Keywords
            {savedKeywords.length > 0 && (
              <Badge 
                className="ml-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                variant="secondary"
              >
                {savedKeywords.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="research">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyword Research</CardTitle>
                  <CardDescription>
                    Enter a seed keyword to find related keywords and analyze their potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="seed-keyword">Seed Keyword</Label>
                        <div className="flex mt-1">
                          <Input
                            id="seed-keyword"
                            placeholder="e.g. digital marketing"
                            value={seedKeyword}
                            onChange={(e) => setSeedKeyword(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            type="submit" 
                            className="ml-2 bg-indigo-600 hover:bg-indigo-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Researching
                              </>
                            ) : (
                              <>
                                Research
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="md:w-1/4">
                        <Label htmlFor="country">Country</Label>
                        <Select value={country} onValueChange={setCountry}>
                          <SelectTrigger id="country" className="mt-1">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Global">Global</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-1">
                        <RadioGroup 
                          value={searchType} 
                          onValueChange={setSearchType}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="keyword" id="keyword" />
                            <Label htmlFor="keyword">Keyword Ideas</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="questions" id="questions" />
                            <Label htmlFor="questions">Questions</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {seedKeyword && keywordResults.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={shuffleKeywordIdeas}
                          disabled={isLoading}
                          className="flex items-center"
                        >
                          <Shuffle className="mr-2 h-3 w-3" />
                          Refresh Ideas
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Researching Keywords...</h3>
                  <p className="text-gray-500 mt-2">
                    Analyzing search volume, competition, and keyword difficulty
                  </p>
                </div>
              ) : keywordResults.length > 0 ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Keyword Suggestions</CardTitle>
                      <Badge variant="outline">
                        {keywordResults.length} results
                      </Badge>
                    </div>
                    <CardDescription>
                      Explore keyword opportunities based on search volume, competition, and difficulty
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">Keyword</TableHead>
                            <TableHead>Search Volume</TableHead>
                            <TableHead>Competition</TableHead>
                            <TableHead>CPC ($)</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {keywordResults.map((keyword, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  {keyword.keyword}
                                  {keyword.trend === 'up' && (
                                    <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatNumber(keyword.searchVolume)}
                                <span className="ml-1 text-xs text-gray-500">/ mo</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="w-14">{(keyword.competition * 100).toFixed(0)}%</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      keyword.competition < 0.3 
                                        ? 'border-green-200 text-green-800 bg-green-50' 
                                        : keyword.competition < 0.7 
                                        ? 'border-yellow-200 text-yellow-800 bg-yellow-50' 
                                        : 'border-red-200 text-red-800 bg-red-50'
                                    }`}
                                  >
                                    {getCompetitionLevel(keyword.competition)}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>${keyword.cpc.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="w-7 text-sm">{keyword.difficultyScore}</span>
                                    <Progress 
                                      className="h-2 w-24"
                                      value={keyword.difficultyScore} 
                                      max={100}
                                      style={{ backgroundColor: getDifficultyColor(keyword.difficultyScore) }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {getDifficultyLevel(keyword.difficultyScore)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => getRelatedKeywords(keyword.keyword)}
                                    className="h-8 px-2"
                                  >
                                    <Zap className="h-3.5 w-3.5 mr-1" />
                                    Related
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => saveKeyword(keyword)}
                                    className="h-8 px-2"
                                  >
                                    <Bookmark className="h-3.5 w-3.5 mr-1" />
                                    Save
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No keyword results yet</h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    Enter a seed keyword above to find related keywords, search volumes, and competition metrics.
                  </p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-3">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tips">
                  <AccordionTrigger className="text-sm">
                    <span className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-indigo-500" />
                      Keyword Research Tips
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
                      <div className="space-y-2">
                        <h4 className="font-medium">Search Volume</h4>
                        <p className="text-sm text-gray-600">
                          The average number of monthly searches for the keyword. Higher volume means more potential traffic, but often comes with higher competition.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Competition</h4>
                        <p className="text-sm text-gray-600">
                          Indicates how difficult it would be to rank for this keyword. Lower competition keywords may be easier to rank for despite lower search volumes.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Keyword Difficulty</h4>
                        <p className="text-sm text-gray-600">
                          A score from 1-100 estimating how hard it would be to rank in the top 10 for this keyword. Look for a mix of medium difficulty keywords for best results.
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Strategy Recommendations:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Focus on <strong>long-tail keywords</strong> (3+ words) for specific content targeting</li>
                        <li>Use a mix of <strong>high volume</strong> and <strong>low competition</strong> keywords</li>
                        <li>Check for <strong>trending</strong> keywords (🔺) that are gaining popularity</li>
                        <li>Group related keywords into <strong>topic clusters</strong> for your content strategy</li>
                        <li>Consider keyword <strong>search intent</strong> - is it informational, navigational, or transactional?</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Saved Keywords</CardTitle>
                  <CardDescription>
                    Manage your saved keywords and export them for your content strategy
                  </CardDescription>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadCSV}
                  disabled={savedKeywords.length === 0}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {savedKeywords.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Keyword</TableHead>
                        <TableHead>Search Volume</TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead>CPC ($)</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedKeywords.map((keyword, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {keyword.keyword}
                              {keyword.trend === 'up' && (
                                <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatNumber(keyword.searchVolume)}
                            <span className="ml-1 text-xs text-gray-500">/ mo</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="w-14">{(keyword.competition * 100).toFixed(0)}%</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  keyword.competition < 0.3 
                                    ? 'border-green-200 text-green-800 bg-green-50' 
                                    : keyword.competition < 0.7 
                                    ? 'border-yellow-200 text-yellow-800 bg-yellow-50' 
                                    : 'border-red-200 text-red-800 bg-red-50'
                                }`}
                              >
                                {getCompetitionLevel(keyword.competition)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>${keyword.cpc.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="w-7 text-sm">{keyword.difficultyScore}</span>
                                <Progress 
                                  className="h-2 w-24"
                                  value={keyword.difficultyScore} 
                                  max={100}
                                  style={{ backgroundColor: getDifficultyColor(keyword.difficultyScore) }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">
                                {getDifficultyLevel(keyword.difficultyScore)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeKeyword(keyword.keyword)}
                              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved keywords yet</h3>
                  <p className="text-gray-500 mb-4">
                    Save keywords from your research to build your content strategy
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('research')}
                  >
                    Start Researching
                  </Button>
                </div>
              )}
            </CardContent>
            {savedKeywords.length > 0 && (
              <CardFooter className="bg-indigo-50 border-t">
                <div className="flex items-start space-x-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <p className="text-sm text-indigo-700">
                    Your saved keywords have an average search volume of {
                      formatNumber(
                        Math.round(
                          savedKeywords.reduce((sum, k) => sum + k.searchVolume, 0) / 
                          savedKeywords.length
                        )
                      )
                    } and an average difficulty score of {
                      Math.round(
                        savedKeywords.reduce((sum, k) => sum + k.difficultyScore, 0) / 
                        savedKeywords.length
                      )
                    }.
                  </p>
                </div>
              </CardFooter>
            )}
          </Card>
          
          {savedKeywords.length > 0 && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Strategy Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Recommended Content Types</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {savedKeywords.some(k => k.keyword.includes('how') || k.keyword.includes('guide') || k.keyword.includes('tutorial')) && (
                          <div className="border rounded-md p-4">
                            <h5 className="font-medium text-sm mb-2">How-to Guides</h5>
                            <p className="text-xs text-gray-600">
                              Create step-by-step tutorials based on keywords like "{
                                savedKeywords.find(k => k.keyword.includes('how') || k.keyword.includes('guide') || k.keyword.includes('tutorial'))?.keyword
                              }"
                            </p>
                          </div>
                        )}
                        
                        {savedKeywords.some(k => k.keyword.includes('best') || k.keyword.includes('top')) && (
                          <div className="border rounded-md p-4">
                            <h5 className="font-medium text-sm mb-2">List Articles</h5>
                            <p className="text-xs text-gray-600">
                              Create "best of" or "top" list content based on keywords like "{
                                savedKeywords.find(k => k.keyword.includes('best') || k.keyword.includes('top'))?.keyword
                              }"
                            </p>
                          </div>
                        )}
                        
                        {savedKeywords.some(k => k.keyword.includes('vs')) && (
                          <div className="border rounded-md p-4">
                            <h5 className="font-medium text-sm mb-2">Comparison Content</h5>
                            <p className="text-xs text-gray-600">
                              Create comparison articles based on keywords like "{
                                savedKeywords.find(k => k.keyword.includes('vs'))?.keyword
                              }"
                            </p>
                          </div>
                        )}
                        
                        <div className="border rounded-md p-4">
                          <h5 className="font-medium text-sm mb-2">Informational Content</h5>
                          <p className="text-xs text-gray-600">
                            Create in-depth articles targeting your medium-difficulty keywords to build authority
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Prioritization Strategy</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Badge className="mt-0.5 bg-green-100 text-green-800">1</Badge>
                          <div>
                            <h5 className="text-sm font-medium">Quick Wins</h5>
                            <p className="text-xs text-gray-600">
                              Target these low competition keywords first: {
                                savedKeywords
                                  .filter(k => k.competition < 0.3)
                                  .slice(0, 2)
                                  .map(k => `"${k.keyword}"`)
                                  .join(', ')
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Badge className="mt-0.5 bg-yellow-100 text-yellow-800">2</Badge>
                          <div>
                            <h5 className="text-sm font-medium">Growth Opportunities</h5>
                            <p className="text-xs text-gray-600">
                              Focus on these medium competition keywords: {
                                savedKeywords
                                  .filter(k => k.competition >= 0.3 && k.competition < 0.7)
                                  .slice(0, 2)
                                  .map(k => `"${k.keyword}"`)
                                  .join(', ')
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Badge className="mt-0.5 bg-red-100 text-red-800">3</Badge>
                          <div>
                            <h5 className="text-sm font-medium">Long-term Goals</h5>
                            <p className="text-xs text-gray-600">
                              Build content around these competitive keywords as your site gains authority: {
                                savedKeywords
                                  .filter(k => k.competition >= 0.7)
                                  .slice(0, 2)
                                  .map(k => `"${k.keyword}"`)
                                  .join(', ')
                              }
                            </p>
                          </div>
                        </div>
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

export default KeywordResearchTool; 