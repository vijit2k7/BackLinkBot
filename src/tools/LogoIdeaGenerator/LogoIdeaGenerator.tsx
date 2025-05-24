import React, { useState } from 'react';
import { Palette, Lightbulb, RefreshCw, Download, Bookmark, BookmarkCheck, Copy, Trash2, Plus, Minus, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import ToolLayout from '../components/ToolLayout';
import { LogoIdea, LogoGenerationOptions } from './types';
import { 
  industries, 
  logoStyles, 
  colorOptions, 
  generateLogoIdeas 
} from './utils';

const LogoIdeaGenerator: React.FC = () => {
  // Default options
  const defaultOptions: LogoGenerationOptions = {
    businessName: '',
    industry: 'Technology',
    keywords: [],
    colorPreference: 'Blue tones',
    stylePreference: 'Modern'
  };
  
  // State
  const [options, setOptions] = useState<LogoGenerationOptions>(defaultOptions);
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [logoIdeas, setLogoIdeas] = useState<LogoIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<LogoIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('generate');
  
  // Handle input changes
  const handleInputChange = (field: keyof LogoGenerationOptions, value: string) => {
    setOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle keyword input
  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };
  
  // Add keyword
  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    
    // Check if keyword already exists
    if (options.keywords.includes(keywordInput.trim())) {
      toast({
        title: 'Keyword already exists',
        description: 'This keyword is already in your list.',
        variant: 'destructive',
      });
      return;
    }
    
    // Add keyword
    setOptions(prev => ({
      ...prev,
      keywords: [...prev.keywords, keywordInput.trim()]
    }));
    
    // Clear input
    setKeywordInput('');
  };
  
  // Remove keyword
  const handleRemoveKeyword = (keyword: string) => {
    setOptions(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!options.businessName.trim()) {
      toast({
        title: 'Business name required',
        description: 'Please enter your business name.',
        variant: 'destructive',
      });
      return;
    }
    
    // Generate logo ideas
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const ideas = generateLogoIdeas(options, 5);
        setLogoIdeas(ideas);
        setActiveTab('results');
        
        toast({
          title: 'Logo ideas generated',
          description: `${ideas.length} logo ideas have been created for ${options.businessName}.`,
        });
      } catch (error) {
        console.error('Error generating logo ideas:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate logo ideas.',
          variant: 'destructive',
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };
  
  // Regenerate logo ideas
  const handleRegenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const ideas = generateLogoIdeas(options, 5);
        setLogoIdeas(ideas);
        
        toast({
          title: 'New logo ideas generated',
          description: `${ideas.length} new logo ideas have been created.`,
        });
      } catch (error) {
        console.error('Error regenerating logo ideas:', error);
        toast({
          title: 'Error',
          description: 'Failed to regenerate logo ideas.',
          variant: 'destructive',
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };
  
  // Save logo idea
  const handleSaveIdea = (idea: LogoIdea) => {
    // Check if already saved
    if (savedIdeas.some(saved => saved.id === idea.id)) {
      toast({
        title: 'Already saved',
        description: 'This logo idea is already in your saved collection.',
        variant: 'destructive',
      });
      return;
    }
    
    // Add to saved ideas
    setSavedIdeas(prev => [...prev, idea]);
    
    toast({
      title: 'Logo idea saved',
      description: 'The logo idea has been added to your saved collection.',
    });
  };
  
  // Remove saved idea
  const handleRemoveSavedIdea = (id: string) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== id));
    
    toast({
      title: 'Logo idea removed',
      description: 'The logo idea has been removed from your saved collection.',
    });
  };
  
  // Copy logo description
  const handleCopyDescription = (description: string) => {
    navigator.clipboard.writeText(description);
    
    toast({
      title: 'Copied to clipboard',
      description: 'Logo description has been copied to your clipboard.',
    });
  };
  
  // Render color palette
  const renderColorPalette = (colors: string[]) => {
    return (
      <div className="flex space-x-1">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    );
  };
  
  // Render logo idea card
  const renderLogoIdeaCard = (idea: LogoIdea, isSaved: boolean = false) => {
    const isAlreadySaved = savedIdeas.some(saved => saved.id === idea.id);
    
    return (
      <Card key={idea.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{idea.name}</CardTitle>
          <CardDescription>
            <Badge variant="outline" className="mr-1">
              {idea.style}
            </Badge>
            <Badge variant="outline">
              {idea.industry}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Color Palette</div>
              {renderColorPalette(idea.colors)}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Elements</div>
              <div className="flex flex-wrap gap-1">
                {idea.elements.map((element, index) => (
                  <Badge key={index} variant="secondary">
                    {element}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Description</div>
              <p className="text-sm text-muted-foreground">
                {idea.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleCopyDescription(idea.description)}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          
          {isSaved ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleRemoveSavedIdea(idea.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          ) : (
            <Button 
              variant={isAlreadySaved ? 'ghost' : 'ghost'} 
              size="sm"
              onClick={() => handleSaveIdea(idea)}
              disabled={isAlreadySaved}
            >
              {isAlreadySaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-1 text-green-500" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <ToolLayout
      title="Logo Idea Generator"
      description="Generate creative logo concepts for your brand"
      icon={<Lightbulb className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="generate" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="results" disabled={logoIdeas.length === 0}>Results</TabsTrigger>
          <TabsTrigger value="saved" disabled={savedIdeas.length === 0}>
            Saved
            {savedIdeas.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {savedIdeas.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Information</CardTitle>
              <CardDescription>
                Provide details about your business to generate logo ideas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Acme Corporation"
                    value={options.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                  />
                </div>
                
                {/* Industry */}
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={options.industry}
                    onValueChange={(value) => handleInputChange('industry', value)}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (Optional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="keywords"
                      placeholder="e.g., professional, trustworthy"
                      value={keywordInput}
                      onChange={handleKeywordInputChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleAddKeyword}
                      disabled={!keywordInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add keywords that describe your brand values and personality
                  </p>
                  
                  {options.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {options.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                          {keyword}
                          <button
                            type="button"
                            className="ml-1 rounded-full hover:bg-muted"
                            onClick={() => handleRemoveKeyword(keyword)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Color Preference */}
                <div className="space-y-2">
                  <Label htmlFor="colorPreference">Color Preference</Label>
                  <Select
                    value={options.colorPreference}
                    onValueChange={(value) => handleInputChange('colorPreference', value)}
                  >
                    <SelectTrigger id="colorPreference">
                      <SelectValue placeholder="Select color preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Style Preference */}
                <div className="space-y-2">
                  <Label htmlFor="stylePreference">Logo Style</Label>
                  <Select
                    value={options.stylePreference}
                    onValueChange={(value) => handleInputChange('stylePreference', value)}
                  >
                    <SelectTrigger id="stylePreference">
                      <SelectValue placeholder="Select logo style" />
                    </SelectTrigger>
                    <SelectContent>
                      {logoStyles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isGenerating || !options.businessName.trim()}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Ideas...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Generate Logo Ideas
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Logo Design Tips</CardTitle>
              <CardDescription>
                Best practices for effective logo design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Keep It Simple</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple logos are more recognizable and versatile across different mediums and sizes.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Make It Memorable</h3>
                  <p className="text-sm text-muted-foreground">
                    A distinctive logo helps your brand stand out and stick in customers' minds.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Ensure Versatility</h3>
                  <p className="text-sm text-muted-foreground">
                    Your logo should work across various applications, sizes, and in both color and black and white.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Consider Timelessness</h3>
                  <p className="text-sm text-muted-foreground">
                    Avoid trendy designs that may quickly become outdated. Aim for longevity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Logo Ideas for {options.businessName}
            </h2>
            <Button 
              variant="outline" 
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logoIdeas.map((idea) => renderLogoIdeaCard(idea))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                Steps to take after finding logo ideas you like
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Save Your Favorites</h3>
                    <p className="text-sm text-muted-foreground">
                      Bookmark the logo ideas that resonate with your brand for future reference.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Refine Your Concept</h3>
                    <p className="text-sm text-muted-foreground">
                      Use these ideas as a starting point and refine them to better match your vision.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Work with a Designer</h3>
                    <p className="text-sm text-muted-foreground">
                      Share these concepts with a professional designer to create your final logo.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Saved Tab */}
        <TabsContent value="saved" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Saved Logo Ideas
              <Badge variant="secondary" className="ml-2">
                {savedIdeas.length}
              </Badge>
            </h2>
            {savedIdeas.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setSavedIdeas([])}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
          
          {savedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedIdeas.map((idea) => renderLogoIdeaCard(idea, true))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved logo ideas yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  When you find logo ideas you like, save them here for future reference.
                </p>
                <Button onClick={() => setActiveTab('generate')}>
                  Generate Logo Ideas
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default LogoIdeaGenerator; 