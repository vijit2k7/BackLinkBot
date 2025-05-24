import React, { useState } from 'react';
import { MessageSquareText, ArrowRight, Loader2, Copy, Check, Star, Lightbulb, RotateCcw, BookMarked } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// Sample tone examples
const toneExamples = {
  professional: "Our enterprise solution streamlines operations and enhances productivity across departments.",
  conversational: "Hey there! Our tool makes your day-to-day tasks way easier and helps everyone on your team get more done.",
  persuasive: "Don't miss this opportunity to transform your workflow. Act now and experience the difference our solution makes.",
  humorous: "Ready to kiss those productivity woes goodbye? Our tool is like having a personal assistant who never asks for coffee breaks!",
  enthusiastic: "We're incredibly excited to introduce our AMAZING new tool that will absolutely revolutionize how your team works!",
  formal: "We hereby present our comprehensive business solution designed to optimize organizational efficiency and interdepartmental collaboration."
};

const MarketingCopyGenerator = () => {
  // State for form inputs
  const [productName, setProductName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState<string>('');
  const [contentType, setContentType] = useState<string>('social');
  const [platform, setPlatform] = useState<string>('');
  const [tone, setTone] = useState<string>('conversational');
  const [length, setLength] = useState<string>('medium');
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(false);
  const [includeCTA, setIncludeCTA] = useState<boolean>(true);
  
  // State for generated copy
  const [generatedCopy, setGeneratedCopy] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean[]>([false, false, false]);
  const [activeTab, setActiveTab] = useState<string>('form');
  
  // Platform options based on content type
  const platformOptions = {
    social: ['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn', 'TikTok', 'Pinterest'],
    email: ['Newsletter', 'Promotional', 'Transactional', 'Welcome Series', 'Abandoned Cart'],
    advertising: ['Google Ads', 'Facebook Ads', 'Display Ads', 'LinkedIn Ads', 'YouTube Ads'],
    website: ['Homepage', 'Product Page', 'Landing Page', 'About Us', 'Features Page'],
    print: ['Brochure', 'Flyer', 'Magazine Ad', 'Direct Mail', 'Poster']
  };
  
  // Reset platform when content type changes
  const handleContentTypeChange = (value: string) => {
    setContentType(value);
    setPlatform('');
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !productDescription) {
      toast({
        title: "Required fields missing",
        description: "Please provide at least a product name and description",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setActiveTab('results');
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate copy (in a real app, this would come from an API)
      const copies = generateMarketingCopy();
      setGeneratedCopy(copies);
      setIsGenerating(false);
      setHasCopied([false, false, false]);
      
      toast({
        title: "Marketing copy generated!",
        description: "We've created 3 versions of copy for your review.",
      });
    }, 2500);
  };
  
  // Generate marketing copy based on inputs
  const generateMarketingCopy = (): string[] => {
    // In a real app, this would call an AI service API
    // For demo purposes, we'll use templates
    
    const copies: string[] = [];
    
    // Extract key points from unique selling points
    const uspPoints = uniqueSellingPoints
      .split('\n')
      .filter(point => point.trim() !== '')
      .map(point => point.trim().replace(/^-\s*/, ''));
      
    // Get random USPs if available
    const usps = uspPoints.length > 0 
      ? uspPoints 
      : ['saves time', 'increases efficiency', 'reduces costs'];
    
    const audience = targetAudience.trim() !== '' 
      ? targetAudience 
      : 'businesses looking to improve their operations';
    
    // Length multipliers
    const lengthMultipliers = {
      short: 0.6,
      medium: 1,
      long: 1.5
    };
    
    // Generate different versions based on tone and content type
    for (let i = 0; i < 3; i++) {
      let copy = '';
      const randomUsp = usps[Math.floor(Math.random() * usps.length)];
      
      // Base templates by tone
      switch (tone) {
        case 'professional':
          copy = `Introducing ${productName}: the professional solution designed for ${audience}. ${productDescription} Our clients report that it ${randomUsp}.`;
          break;
        case 'conversational':
          copy = `Hey there! Have you tried ${productName} yet? It's perfect for ${audience}. ${productDescription} You'll love how it ${randomUsp}!`;
          break;
        case 'persuasive':
          copy = `Don't miss out on ${productName} – the game-changer for ${audience}. ${productDescription} Imagine how much better your results will be when you ${randomUsp}.`;
          break;
        case 'humorous':
          copy = `Ready to stop struggling with outdated solutions? ${productName} is here to rescue ${audience}! ${productDescription} It's like having a superpower that ${randomUsp}!`;
          break;
        case 'enthusiastic':
          copy = `WOW! We're SUPER excited to share ${productName} with ${audience}! ${productDescription} You'll be AMAZED at how it ${randomUsp}!`;
          break;
        case 'formal':
          copy = `We hereby present ${productName}, a sophisticated solution formulated specifically for ${audience}. ${productDescription} Analysis demonstrates its capacity to ${randomUsp}.`;
          break;
        default:
          copy = `Introducing ${productName}: designed for ${audience}. ${productDescription} It helps you ${randomUsp}.`;
      }
      
      // Add content type and platform specific elements
      if (contentType === 'social') {
        if (platform === 'Twitter/X') {
          copy = copy.length > 280 ? copy.substring(0, 277) + '...' : copy;
          if (includeEmojis) copy += ' 🚀 #' + productName.replace(/\s+/g, '');
        } else if (platform === 'LinkedIn') {
          copy += ` Are you ready to transform your approach? See how ${productName} can help.`;
          if (includeCTA) copy += `\n\nLearn more in the comments or visit our website. #${productName.replace(/\s+/g, '')} #Innovation`;
        } else if (platform === 'Instagram' || platform === 'Facebook') {
          if (includeEmojis) copy += ` ✨ Double tap if you're excited! 👇`;
          if (includeCTA) copy += `\n\nClick the link in bio to learn more about ${productName}!`;
        }
      } else if (contentType === 'email') {
        copy = `Subject: Discover ${productName} - The Solution You've Been Waiting For\n\nHello,\n\n${copy}\n\n`;
        if (includeCTA) copy += `\nClick here to learn more about ${productName} and start your free trial today!\n\nBest regards,\nThe Team`;
      } else if (contentType === 'advertising') {
        copy = copy.substring(0, copy.length * 0.7); // Ads are typically shorter
        if (includeCTA) copy += ` Click now to learn more!`;
      } else if (contentType === 'website') {
        if (platform === 'Homepage') {
          copy = `${copy}\n\nTrusted by leading companies in your industry.`;
          if (includeCTA) copy += `\n\nGet Started Free`;
        } else if (platform === 'Product Page') {
          copy += `\n\nFeatures:\n- Feature 1\n- Feature 2\n- Feature 3`;
          if (includeCTA) copy += `\n\nBuy Now`;
        }
      }
      
      // Adjust length
      const targetLength = copy.length * (lengthMultipliers[length as keyof typeof lengthMultipliers] || 1);
      if (copy.length > targetLength) {
        copy = copy.substring(0, Math.floor(targetLength)) + (copy.length > targetLength + 10 ? '...' : '');
      }
      
      // Add emojis if selected (and not already added for social)
      if (includeEmojis && contentType !== 'social') {
        const emojis = ['🚀', '✨', '💯', '🔥', '👍', '💪', '⭐'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        copy = copy.replace(/\./g, `. ${randomEmoji}`);
      }
      
      copies.push(copy);
    }
    
    return copies;
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    
    const newHasCopied = [...hasCopied];
    newHasCopied[index] = true;
    setHasCopied(newHasCopied);
    
    toast({
      title: "Copied to clipboard!",
      description: "The marketing copy has been copied to your clipboard.",
    });
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      const resetCopied = [...hasCopied];
      resetCopied[index] = false;
      setHasCopied(resetCopied);
    }, 2000);
  };
  
  // Reset form
  const handleReset = () => {
    setActiveTab('form');
    setGeneratedCopy([]);
  };
  
  return (
    <ToolLayout
      title="Marketing Copy Generator"
      description="Create compelling marketing copy for ads, social media, emails, and more"
      icon={<MessageSquareText className="h-6 w-6 text-purple-500" />}
      helpText="Fill in your product details and preferences to generate marketing copy tailored to your needs."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="form">Create Copy</TabsTrigger>
          <TabsTrigger value="results" disabled={generatedCopy.length === 0 && !isGenerating}>
            View Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Information</CardTitle>
                    <CardDescription>Tell us about what you're promoting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">
                        Product/Service Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="product-name"
                        placeholder="e.g., Project Management Pro"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="product-description">
                        Product/Service Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="product-description"
                        placeholder="Describe what your product/service does in 1-2 sentences"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="min-h-[80px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="target-audience">
                        Target Audience
                      </Label>
                      <Input
                        id="target-audience"
                        placeholder="e.g., Small business owners, Marketing professionals"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="unique-selling-points">
                        Unique Selling Points (One per line)
                      </Label>
                      <Textarea
                        id="unique-selling-points"
                        placeholder="e.g.,
- Saves 10 hours per week on manual tasks
- Increases conversion rates by 25%
- Integrates with all your existing tools"
                        value={uniqueSellingPoints}
                        onChange={(e) => setUniqueSellingPoints(e.target.value)}
                        className="min-h-[120px] font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Copy Preferences</CardTitle>
                    <CardDescription>Customize the style and format of your marketing copy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="content-type">
                        Content Type
                      </Label>
                      <Select value={contentType} onValueChange={handleContentTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="social">Social Media Post</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="advertising">Advertising</SelectItem>
                          <SelectItem value="website">Website Copy</SelectItem>
                          <SelectItem value="print">Print Material</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="platform">
                        Platform
                      </Label>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platformOptions[contentType as keyof typeof platformOptions]?.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Tone of Voice</Label>
                      <RadioGroup value={tone} onValueChange={setTone} className="mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="professional" id="professional" />
                            <Label htmlFor="professional">Professional</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="conversational" id="conversational" />
                            <Label htmlFor="conversational">Conversational</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="persuasive" id="persuasive" />
                            <Label htmlFor="persuasive">Persuasive</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="humorous" id="humorous" />
                            <Label htmlFor="humorous">Humorous</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="enthusiastic" id="enthusiastic" />
                            <Label htmlFor="enthusiastic">Enthusiastic</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="formal" id="formal" />
                            <Label htmlFor="formal">Formal</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="tone-examples">
                        <AccordionTrigger className="text-sm text-gray-500">
                          See tone examples
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            {Object.entries(toneExamples).map(([key, example]) => (
                              <div key={key} className={`p-2 rounded-md ${tone === key ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                                <strong className="capitalize">{key}:</strong>
                                <p className="text-gray-600 mt-1">{example}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div>
                      <Label>Copy Length</Label>
                      <RadioGroup value={length} onValueChange={setLength} className="mt-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="short" id="short" />
                            <Label htmlFor="short">Short</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="long" id="long" />
                            <Label htmlFor="long">Long</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="include-emojis" 
                            checked={includeEmojis}
                            onCheckedChange={setIncludeEmojis} 
                          />
                          <Label htmlFor="include-emojis">Include Emojis</Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Optional
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="include-cta" 
                            checked={includeCTA}
                            onCheckedChange={setIncludeCTA} 
                          />
                          <Label htmlFor="include-cta">Include Call-to-Action</Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setProductName('');
                        setProductDescription('');
                        setTargetAudience('');
                        setUniqueSellingPoints('');
                        setContentType('social');
                        setPlatform('');
                        setTone('conversational');
                        setLength('medium');
                        setIncludeEmojis(false);
                        setIncludeCTA(true);
                      }}
                      className="w-full sm:w-auto"
                    >
                      Clear Form
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Generate Marketing Copy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Writing Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Know your audience</h4>
                      <p className="text-sm text-gray-500">The more specific you are about your target audience, the more effective your copy will be.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Focus on benefits</h4>
                      <p className="text-sm text-gray-500">Describe how your product or service improves the customer's life, not just its features.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Use action words</h4>
                      <p className="text-sm text-gray-500">Verbs like "discover," "transform," "unlock," and "boost" create a sense of momentum.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Create urgency</h4>
                      <p className="text-sm text-gray-500">Phrases like "limited time," "act now," or "don't miss out" can increase conversion rates.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-purple-50 flex items-center justify-center p-4">
                  <BookMarked className="h-5 w-5 text-purple-500 mr-2" />
                  <p className="text-sm text-center text-purple-700">
                    Great marketing copy focuses on solving customer problems, not just selling products.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Generating your marketing copy...</h3>
              <p className="text-gray-500 mt-2">This will just take a moment</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Generated Copy Options
                  <span className="ml-2 text-gray-500 text-sm font-normal">
                    (3 variations)
                  </span>
                </h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="flex items-center"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Create New Copy
                </Button>
              </div>
              
              {generatedCopy.map((copy, index) => (
                <Card key={index} className={index === 0 ? "border-purple-200 bg-purple-50" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CardTitle className="text-base">
                          Version {index + 1}
                        </CardTitle>
                        {index === 0 && (
                          <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(copy, index)}
                        className="h-8 px-2"
                      >
                        {hasCopied[index] ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-4 rounded-md border border-gray-100 whitespace-pre-line">
                      {copy}
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-gray-500 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {tone.charAt(0).toUpperCase() + tone.slice(1)} tone
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                      </Badge>
                      {platform && (
                        <Badge variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      )}
                    </div>
                    <div>
                      {copy.length} characters
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    Tips for Using This Copy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Testing & Optimization</h4>
                    <p className="text-sm text-gray-600">
                      Try different versions of your copy with small test audiences to see which performs better before rolling out more broadly.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Customization</h4>
                    <p className="text-sm text-gray-600">
                      Feel free to adapt and customize the generated copy to better match your brand voice and specific campaign needs.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Visual Elements</h4>
                    <p className="text-sm text-gray-600">
                      Pair your copy with relevant images, videos, or graphics to increase engagement and effectiveness.
                    </p>
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

export default MarketingCopyGenerator; 