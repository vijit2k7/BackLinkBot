import React, { useState } from 'react';
import { FileText, ArrowRight, Loader2, Copy, Check, ThumbsUp, ThumbsDown, Save, RefreshCw, Search } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const MetaDescriptionGenerator = () => {
  // Form states
  const [pageTitle, setPageTitle] = useState<string>('');
  const [pageContent, setPageContent] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [industryType, setIndustryType] = useState<string>('');
  const [targetLength, setTargetLength] = useState<string>('150');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedDescriptions, setGeneratedDescriptions] = useState<MetaDescription[]>([]);
  const [savedDescriptions, setSavedDescriptions] = useState<MetaDescription[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<MetaDescription | null>(null);
  const [clipboardCopied, setClipboardCopied] = useState<boolean>(false);

  // Interface for meta description
  interface MetaDescription {
    id: string;
    text: string;
    score: number;
    characters: number;
    strengths: string[];
    improvements?: string[];
    keywordsUsed: string[];
  }

  // Industry options
  const industryOptions = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'travel', label: 'Travel & Hospitality' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'legal', label: 'Legal Services' },
    { value: 'nonprofit', label: 'Non-profit' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'fitness', label: 'Fitness & Wellness' },
    { value: 'other', label: 'Other' }
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pageTitle.trim()) {
      toast({
        title: "Page title required",
        description: "Please enter at least a page title to generate descriptions.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const descriptions = generateMetaDescriptions();
      setGeneratedDescriptions(descriptions);
      
      // Select the highest scoring description by default
      const bestDescription = descriptions.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      setSelectedDescription(bestDescription);
      
      setLoading(false);
      
      toast({
        title: "Meta descriptions generated!",
        description: `We've created ${descriptions.length} meta description options for you.`
      });
    }, 2000);
  };

  // Reset form
  const resetForm = () => {
    setPageTitle('');
    setPageContent('');
    setKeywords('');
    setIndustryType('');
    setTargetLength('150');
    setGeneratedDescriptions([]);
    setSelectedDescription(null);
  };

  // Save a description
  const saveDescription = (description: MetaDescription) => {
    if (!savedDescriptions.some(d => d.id === description.id)) {
      setSavedDescriptions(prev => [...prev, description]);
      
      toast({
        title: "Description saved!",
        description: "The meta description has been added to your saved list."
      });
    } else {
      toast({
        title: "Already saved",
        description: "This description is already in your saved list."
      });
    }
  };

  // Remove a saved description
  const removeSavedDescription = (id: string) => {
    setSavedDescriptions(prev => prev.filter(d => d.id !== id));
    
    toast({
      title: "Description removed",
      description: "The meta description has been removed from your saved list."
    });
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "The meta description has been copied to your clipboard."
    });
    
    setTimeout(() => {
      setClipboardCopied(false);
    }, 2000);
  };

  // Generate HTML meta tag
  const generateHtmlTag = (description: string) => {
    return `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`;
  };

  // Generate meta descriptions
  const generateMetaDescriptions = (): MetaDescription[] => {
    const descriptions: MetaDescription[] = [];
    const numToGenerate = 5;
    
    // Extract important terms from content if available
    let contentTerms: string[] = [];
    if (pageContent) {
      // Simple extraction of potentially important terms
      contentTerms = pageContent
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 4)
        .filter((word, i, arr) => arr.indexOf(word) === i)
        .slice(0, 10);
    }
    
    // Extract keywords
    const keywordList = keywords
      ? keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k)
      : [];
    
    // Determine target length
    const targetLengthNum = parseInt(targetLength) || 150;
    
    // Options for description templates based on industry
    const getIndustryTemplates = () => {
      const generic = [
        `Learn about {title}. {keywords} and more. Discover why our {solution} is right for you.`,
        `Everything you need to know about {title}. Explore {keywords} and start {action} today.`,
        `{title} - Expert information and resources on {keywords}. Find the best {solution} for your needs.`,
        `Discover {title} - Professional {industry} solutions featuring {keywords}. Get started now!`,
        `{title}: The ultimate guide to {keywords}. Learn how to {action} effectively and efficiently.`
      ];
      
      const industrySpecific: Record<string, string[]> = {
        'ecommerce': [
          `Shop the best {title} selection. Free shipping, secure payments, and easy returns on all {keywords}.`,
          `Find premium {title} products at competitive prices. Browse our {keywords} collection today.`,
          `Discover high-quality {title} with fast delivery. Exclusive deals on {keywords} available now.`,
          `Best-selling {title} for every budget. Shop our curated collection of {keywords} with satisfaction guaranteed.`,
          `Premium {title} with exceptional customer service. Explore our {keywords} and enjoy hassle-free shopping.`
        ],
        'tech': [
          `Cutting-edge {title} solutions for modern businesses. Leverage our {keywords} to drive innovation.`,
          `Advanced {title} technology designed for performance. Our {keywords} help businesses achieve digital transformation.`,
          `Streamline operations with our {title} platform. Featuring {keywords} to increase productivity and efficiency.`,
          `Enterprise-grade {title} built for scalability. Our {keywords} help businesses stay ahead of the competition.`,
          `Innovative {title} solutions that solve real problems. Discover how our {keywords} can transform your business.`
        ],
        'finance': [
          `Expert {title} services to secure your financial future. Our approach to {keywords} delivers proven results.`,
          `Trusted {title} advisors helping you make informed decisions. Specialized in {keywords} for long-term growth.`,
          `Professional {title} solutions tailored to your goals. Our {keywords} strategies maximize returns while managing risk.`,
          `Comprehensive {title} planning for individuals and businesses. Our {keywords} expertise helps protect and grow your assets.`,
          `Strategic {title} management with personalized service. Our {keywords} approach delivers financial peace of mind.`
        ],
        'healthcare': [
          `Quality {title} care centered on patient well-being. Our specialists provide top-rated {keywords} services.`,
          `Compassionate {title} services with cutting-edge medical expertise. Leading provider of {keywords} treatments.`,
          `Advanced {title} care with personalized treatment plans. Our {keywords} solutions improve patient outcomes.`,
          `Trusted {title} professionals dedicated to your health. Specializing in {keywords} with evidence-based approaches.`,
          `Holistic {title} services focused on comprehensive wellness. Our {keywords} programs support your health journey.`
        ]
      };
      
      if (industryType && industrySpecific[industryType]) {
        return [...industrySpecific[industryType], ...generic];
      }
      
      return generic;
    };
    
    const templates = getIndustryTemplates();
    
    // Generate descriptions
    for (let i = 0; i < numToGenerate; i++) {
      // Select a template
      const templateIndex = Math.floor(Math.random() * templates.length);
      let template = templates[templateIndex];
      
      // Replace placeholders
      let text = template
        .replace(/{title}/g, pageTitle)
        .replace(/{keywords}/g, keywordList.length > 0 
          ? keywordList.slice(0, 2).join(' and ') 
          : contentTerms.slice(0, 2).join(' and '))
        .replace(/{industry}/g, industryOptions.find(opt => opt.value === industryType)?.label || 'professional')
        .replace(/{solution}/g, ['solution', 'service', 'product', 'approach', 'system'][Math.floor(Math.random() * 5)])
        .replace(/{action}/g, ['get started', 'succeed', 'improve', 'learn', 'grow'][Math.floor(Math.random() * 5)]);
      
      // Ensure proper length
      if (text.length > targetLengthNum) {
        text = text.substring(0, targetLengthNum - 3) + '...';
      } else if (text.length < targetLengthNum - 50) {
        // Add some filler if too short
        text += ` Contact us today to learn more about our ${pageTitle} solutions.`;
        if (text.length > targetLengthNum) {
          text = text.substring(0, targetLengthNum - 3) + '...';
        }
      }
      
      // Calculate which keywords were used
      const keywordsUsed = keywordList.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Assess strengths and potential improvements
      const strengths: string[] = [];
      const improvements: string[] = [];
      
      // Length assessment
      if (text.length >= 120 && text.length <= 155) {
        strengths.push('Optimal length for Google search results');
      } else if (text.length < 120) {
        improvements.push('Consider adding more details to reach optimal length (120-155 characters)');
      } else {
        improvements.push('May get truncated in search results (over 155 characters)');
      }
      
      // Keyword usage
      if (keywordsUsed.length > 0) {
        strengths.push(`Includes ${keywordsUsed.length} target keywords`);
      } else if (keywordList.length > 0) {
        improvements.push('Does not include specified keywords');
      }
      
      // Call-to-action assessment
      const ctaPhrases = ['learn', 'discover', 'find', 'get', 'start', 'shop', 'explore', 'contact', 'today', 'now'];
      if (ctaPhrases.some(phrase => text.toLowerCase().includes(phrase))) {
        strengths.push('Includes a call-to-action');
      } else {
        improvements.push('Consider adding a clear call-to-action');
      }
      
      // Uniqueness
      if (pageTitle && text.includes(pageTitle)) {
        strengths.push('Includes page title for relevance');
      }
      
      // Clarity check - simple proxy for clarity is sentence length
      const avgWordsPerSentence = text.split('. ').reduce((acc, sentence) => 
        acc + sentence.split(' ').length, 0) / text.split('. ').length;
      
      if (avgWordsPerSentence <= 20) {
        strengths.push('Good readability with concise sentences');
      } else {
        improvements.push('Consider shorter sentences for better readability');
      }
      
      // Calculate score based on criteria (0-100)
      const lengthScore = text.length >= 120 && text.length <= 155 ? 25 : 
                          text.length > 155 ? Math.max(0, 25 - (text.length - 155) / 5) :
                          Math.max(0, text.length / 120 * 25);
      
      const keywordScore = keywordList.length > 0 ? 
                          (keywordsUsed.length / Math.min(keywordList.length, 3)) * 25 : 15;
      
      const ctaScore = ctaPhrases.some(phrase => text.toLowerCase().includes(phrase)) ? 25 : 10;
      
      const clarityScore = avgWordsPerSentence <= 20 ? 25 : Math.max(0, 25 - (avgWordsPerSentence - 20));
      
      const totalScore = Math.min(100, Math.round(lengthScore + keywordScore + ctaScore + clarityScore));
      
      descriptions.push({
        id: `desc-${Date.now()}-${i}`,
        text,
        score: totalScore,
        characters: text.length,
        strengths,
        improvements,
        keywordsUsed
      });
    }
    
    // Sort by score (highest first)
    return descriptions.sort((a, b) => b.score - a.score);
  };

  // Get score label and color
  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 75) return { label: 'Very Good', color: 'text-green-500' };
    if (score >= 60) return { label: 'Good', color: 'text-yellow-500' };
    if (score >= 40) return { label: 'Fair', color: 'text-orange-500' };
    return { label: 'Needs Work', color: 'text-red-500' };
  };

  // Get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 75) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <ToolLayout
      title="Meta Description Generator"
      description="Create SEO-optimized meta descriptions for your web pages"
      icon={<Search className="h-6 w-6 text-green-500" />}
      helpText="Fill in your page details below to generate compelling meta descriptions optimized for search engines."
    >
      <Tabs defaultValue="generate">
        <TabsList className="mb-6">
          <TabsTrigger value="generate">Generate Descriptions</TabsTrigger>
          <TabsTrigger value="saved" disabled={savedDescriptions.length === 0}>
            Saved Descriptions ({savedDescriptions.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <div className="space-y-6">
            <Card className="border border-green-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Create Meta Descriptions</CardTitle>
                <CardDescription>
                  Enter your page details to generate optimized meta descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="page-title" className="text-base">
                          Page Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="page-title"
                          placeholder="E.g., 10 Effective SEO Strategies for Small Businesses"
                          value={pageTitle}
                          onChange={(e) => setPageTitle(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="keywords" className="text-base">
                          Focus Keywords (comma separated)
                        </Label>
                        <Input
                          id="keywords"
                          placeholder="E.g., SEO, small business, marketing strategies"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="industry-type" className="text-base">
                          Industry (Optional)
                        </Label>
                        <Select value={industryType} onValueChange={setIndustryType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industryOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="page-content" className="text-base">
                          Page Content Sample (Optional)
                        </Label>
                        <Textarea
                          id="page-content"
                          placeholder="Paste a sample of your page content to help generate more relevant descriptions..."
                          value={pageContent}
                          onChange={(e) => setPageContent(e.target.value)}
                          className="h-32"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="target-length" className="text-base">
                          Target Length (characters)
                        </Label>
                        <Select value={targetLength} onValueChange={setTargetLength}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="120">120 characters (Minimum)</SelectItem>
                            <SelectItem value="150">150 characters (Recommended)</SelectItem>
                            <SelectItem value="155">155 characters (Maximum)</SelectItem>
                            <SelectItem value="170">170 characters (May truncate)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Google typically displays the first 155-160 characters of a meta description
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-center">
                    <Button 
                      type="submit"
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                      disabled={loading || !pageTitle.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Descriptions...
                        </>
                      ) : (
                        <>
                          Generate Meta Descriptions
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Generated Descriptions */}
            {generatedDescriptions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Generated Descriptions</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetForm}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Over
                  </Button>
                </div>
                
                {/* Selected Description */}
                {selectedDescription && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Selected Description
                          <Badge className="ml-2 bg-green-600">
                            {getScoreLabel(selectedDescription.score).label}
                          </Badge>
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveDescription(selectedDescription)}
                          className="text-green-600 border-green-200 hover:bg-green-100"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={selectedDescription.score} 
                          className={`w-24 h-2 ${getProgressColor(selectedDescription.score)}`} 
                        />
                        <span className={`text-sm font-semibold ${getScoreLabel(selectedDescription.score).color}`}>
                          {selectedDescription.score}/100
                        </span>
                        <span className="text-xs text-gray-500">
                          • {selectedDescription.characters} characters
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white p-4 rounded-md border border-green-200 mb-4">
                        <p className="text-gray-800">{selectedDescription.text}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">HTML Meta Tag:</h3>
                          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                            {generateHtmlTag(selectedDescription.text)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-green-700 mb-1">Strengths:</h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {selectedDescription.strengths.map((strength, idx) => (
                              <li key={idx} className="text-gray-700">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {selectedDescription.improvements && selectedDescription.improvements.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-orange-700 mb-1">Potential Improvements:</h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {selectedDescription.improvements.map((improvement, idx) => (
                                <li key={idx} className="text-gray-700">{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end bg-green-50">
                      <Button 
                        variant="outline"
                        onClick={() => copyToClipboard(selectedDescription.text)}
                        className="mr-2"
                      >
                        {clipboardCopied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Text
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => copyToClipboard(generateHtmlTag(selectedDescription.text))}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy HTML
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {/* Other generated descriptions */}
                <h3 className="text-lg font-semibold">Alternative Options</h3>
                <div className="grid grid-cols-1 gap-4">
                  {generatedDescriptions
                    .filter(desc => !selectedDescription || desc.id !== selectedDescription.id)
                    .map(description => (
                      <Card key={description.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${getProgressColor(description.score)} text-white`}>
                                  {description.score}/100
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {description.characters} characters
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedDescription(description)}
                                className="text-blue-600"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => saveDescription(description)}
                                className="text-green-600"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-800">{description.text}</p>
                          
                          <div className="mt-3 flex flex-wrap gap-1">
                            {description.keywordsUsed.map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="space-y-6">
            {savedDescriptions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {savedDescriptions.map(description => (
                  <Card key={description.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getProgressColor(description.score)} text-white`}>
                              {description.score}/100
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {description.characters} characters
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(description.text)}
                            className="text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeSavedDescription(description.id)}
                            className="text-red-600"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-800">{description.text}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {description.keywordsUsed.map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t flex justify-between py-2">
                      <p className="text-xs text-gray-500">HTML: <code>{`<meta name="description" content="..."/>`}</code></p>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateHtmlTag(description.text))}
                      >
                        Copy HTML
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved descriptions</h3>
                <p className="text-gray-500 mb-6">Generate and save some meta descriptions to see them here.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const generateTab = document.querySelector('[data-value="generate"]') as HTMLElement;
                    if (generateTab) generateTab.click();
                  }}
                >
                  Generate Descriptions
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* SEO Tips Section */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Meta Description SEO Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-3">Length & Format</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Keep between 120-155 characters to avoid truncation in search results</li>
                <li>Each page on your site should have a unique meta description</li>
                <li>Avoid using quotes as they can cut off your description</li>
                <li>Don't stuff with keywords – write for humans first</li>
                <li>Use sentence case and proper punctuation</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-3">Content Strategy</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Include your primary keyword naturally, preferably near the beginning</li>
                <li>Accurately summarize the page content – no misleading descriptions</li>
                <li>Include a clear call-to-action when appropriate</li>
                <li>Highlight unique value propositions or benefits</li>
                <li>Consider including structured information like price, manufacturer, etc. for products</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-3">Optimization Tips</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Make it compelling – create curiosity or highlight benefits</li>
                <li>Test and measure click-through rates from search results</li>
                <li>Update descriptions for seasonal promotions or time-sensitive content</li>
                <li>Include local information for location-based businesses</li>
                <li>Remember that Google may choose to display different text from your page</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default MetaDescriptionGenerator; 