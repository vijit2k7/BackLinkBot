import React, { useState } from 'react';
import { Palette, RefreshCw, Download, Copy, Bookmark, CheckCircle2, Search, FileImage, ImagePlus, Shuffle, ArrowRight } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Logo style options
const LOGO_STYLES = [
  { id: 'minimal', name: 'Minimal & Clean', description: 'Simple, clean designs with minimal elements' },
  { id: 'modern', name: 'Modern & Bold', description: 'Contemporary designs with bold shapes and colors' },
  { id: 'vintage', name: 'Vintage & Retro', description: 'Classic designs with a nostalgic feel' },
  { id: 'playful', name: 'Playful & Fun', description: 'Vibrant and energetic designs with creative elements' },
  { id: 'luxurious', name: 'Luxurious & Elegant', description: 'Sophisticated designs with premium aesthetics' },
  { id: 'tech', name: 'Tech & Digital', description: 'Futuristic designs for tech-focused brands' },
  { id: 'handcrafted', name: 'Handcrafted & Organic', description: 'Artisanal designs with a handmade feel' },
  { id: 'abstract', name: 'Abstract & Geometric', description: 'Distinctive designs using geometric shapes' },
];

// Industry options
const INDUSTRIES = [
  'Technology',
  'Fashion',
  'Food & Beverage',
  'Health & Wellness',
  'Education',
  'Finance',
  'Real Estate',
  'Entertainment',
  'Travel',
  'Retail',
  'Manufacturing',
  'Agriculture',
  'Automotive',
  'Sports',
  'Art & Design',
  'Beauty & Cosmetics',
  'Construction',
  'Consulting',
  'Marketing',
  'Media',
];

// Color palette options
const COLOR_PALETTES = [
  { 
    id: 'blue-professional', 
    name: 'Professional Blue', 
    colors: ['#1E3A8A', '#3B82F6', '#93C5FD', '#DBEAFE', '#FFFFFF'],
    tags: ['corporate', 'professional', 'trustworthy']
  },
  { 
    id: 'green-natural', 
    name: 'Natural Green', 
    colors: ['#064E3B', '#10B981', '#6EE7B7', '#D1FAE5', '#FFFFFF'],
    tags: ['eco-friendly', 'fresh', 'growth']
  },
  { 
    id: 'purple-creative', 
    name: 'Creative Purple', 
    colors: ['#581C87', '#8B5CF6', '#C4B5FD', '#EDE9FE', '#FFFFFF'],
    tags: ['creative', 'imaginative', 'luxury']
  },
  { 
    id: 'red-energetic', 
    name: 'Energetic Red', 
    colors: ['#7F1D1D', '#EF4444', '#FCA5A5', '#FEE2E2', '#FFFFFF'],
    tags: ['bold', 'energetic', 'passionate']
  },
  { 
    id: 'yellow-optimistic', 
    name: 'Optimistic Yellow', 
    colors: ['#854D0E', '#F59E0B', '#FCD34D', '#FEF3C7', '#FFFFFF'],
    tags: ['cheerful', 'optimistic', 'warm']
  },
  { 
    id: 'teal-balanced', 
    name: 'Balanced Teal', 
    colors: ['#115E59', '#14B8A6', '#5EEAD4', '#CCFBF1', '#FFFFFF'],
    tags: ['balanced', 'calm', 'reliable']
  },
  { 
    id: 'gray-neutral', 
    name: 'Neutral Gray', 
    colors: ['#1F2937', '#4B5563', '#9CA3AF', '#E5E7EB', '#FFFFFF'],
    tags: ['neutral', 'timeless', 'versatile']
  },
  { 
    id: 'pink-playful', 
    name: 'Playful Pink', 
    colors: ['#831843', '#EC4899', '#F9A8D4', '#FCE7F3', '#FFFFFF'],
    tags: ['fun', 'playful', 'youthful']
  },
];

// Logo element options
const LOGO_ELEMENTS = [
  { id: 'icon', name: 'Icon-based', description: 'A distinctive symbol or icon as the main element' },
  { id: 'wordmark', name: 'Wordmark', description: 'Typography-focused design with stylized text' },
  { id: 'combination', name: 'Combination mark', description: 'Icon and text combined into one logo' },
  { id: 'emblem', name: 'Emblem', description: 'Text inside a symbol or icon (badge-like)' },
  { id: 'lettermark', name: 'Lettermark', description: 'Initials or monogram-based design' },
  { id: 'abstract', name: 'Abstract mark', description: 'Non-recognizable symbols that represent the brand' },
  { id: 'mascot', name: 'Mascot', description: 'Character-based logo that represents the brand' },
];

// Interface for logo idea
interface LogoIdea {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  elements: string;
  imageUrl: string;
}

// Mock logo ideas
const mockLogoIdeas: LogoIdea[] = [
  {
    title: "Dynamic Letterform",
    description: "A minimalist design using the first letter of your business name with fluid, dynamic shapes to represent motion and innovation.",
    tags: ["minimal", "lettermark", "modern"],
    elements: "Typography with custom letterform, clean lines, sense of movement",
    imageUrl: "https://via.placeholder.com/400x300/1E40AF/FFFFFF?text=AB",
  },
  {
    title: "Geometric Icon Mark",
    description: "A bold, geometric mark composed of simple shapes that create an abstract representation related to your industry.",
    tags: ["modern", "abstract", "tech"],
    elements: "Geometric shapes, balanced composition, distinctive silhouette",
    imageUrl: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=△○□",
  },
  {
    title: "Elegant Wordmark",
    description: "A sophisticated wordmark using a custom typeface with subtle modifications to letterforms to create unique character.",
    tags: ["minimal", "wordmark", "luxurious"],
    elements: "Custom typography, refined spacing, subtle uniqueness",
    imageUrl: "https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=BRAND",
  },
  {
    title: "Nature-Inspired Symbol",
    description: "An organic symbol drawing inspiration from natural forms related to your field, paired with clean typography.",
    tags: ["handcrafted", "combination", "playful"],
    elements: "Natural motifs, organic shapes, harmonious flow",
    imageUrl: "https://via.placeholder.com/400x300/059669/FFFFFF?text=⦿",
  },
  {
    title: "Shield Emblem",
    description: "A modern emblem format using a shield or similar container shape with elements representing your business values.",
    tags: ["emblem", "modern", "professional"],
    elements: "Contained shape, balanced internal elements, strong outline",
    imageUrl: "https://via.placeholder.com/400x300/DC2626/FFFFFF?text=⛊",
  },
  {
    title: "Versatile Monogram",
    description: "A distinctive monogram that works well across both digital and physical applications, with a strong focus on versatility.",
    tags: ["lettermark", "minimal", "versatile"],
    elements: "Interlocking letters, balanced negative space, scalable design",
    imageUrl: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=MN",
  },
];

// Interface for saved logo ideas
interface SavedLogoIdea extends LogoIdea {
  id: string;
  notes?: string;
}

// Main component
const LogoIdeaGenerator: React.FC = () => {
  const [businessName, setBusinessName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [businessDescription, setBusinessDescription] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('minimal');
  const [selectedElement, setSelectedElement] = useState<string>('combination');
  const [selectedPalette, setSelectedPalette] = useState<string>('blue-professional');
  const [keywords, setKeywords] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoIdeas, setLogoIdeas] = useState<LogoIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<SavedLogoIdea[]>([]);
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [includeBusinessName, setIncludeBusinessName] = useState<boolean>(true);

  // Process form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real implementation, this would make an API call
    // For the demo, we're using a timeout and mock data
    setTimeout(() => {
      // Simulate generating ideas based on inputs
      const ideas = [...mockLogoIdeas].sort(() => 0.5 - Math.random()).slice(0, 4);
      
      // Customize ideas based on input
      const customizedIdeas = ideas.map(idea => {
        // Create a new object to avoid modifying the original
        const customized = { ...idea };
        
        // If a business name is provided, use it in the placeholder image
        if (businessName && includeBusinessName) {
          const initials = businessName
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
            
          customized.imageUrl = customized.imageUrl.replace(/text=.*$/, `text=${initials}`);
          
          // Update the title and description if it's a wordmark or lettermark
          if (customized.tags.includes('wordmark')) {
            customized.title = `${businessName} Wordmark`;
            customized.description = `A custom typographic treatment of "${businessName}" with unique character and balance.`;
          } else if (customized.tags.includes('lettermark')) {
            customized.title = `${businessName} Monogram`;
            customized.description = `A distinctive monogram based on the initials "${initials}" with a clean, memorable design.`;
          }
        }
        
        // Ensure the selected style is included in the tags
        if (!customized.tags.includes(selectedStyle)) {
          customized.tags = [selectedStyle, ...customized.tags.slice(0, 2)];
        }
        
        // Add a unique ID
        customized.id = `logo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        return customized;
      });
      
      setLogoIdeas(customizedIdeas);
      setIsLoading(false);
      
      toast({
        title: "Logo ideas generated",
        description: "4 logo concepts have been created based on your inputs",
      });
    }, 2000);
  };

  // Save a logo idea
  const handleSaveIdea = (idea: any) => {
    // Check if already saved
    if (savedIdeas.some(saved => saved.id === idea.id)) {
      toast({
        title: "Already saved",
        description: "This logo idea is already in your saved collection",
      });
      return;
    }
    
    // Add to saved ideas
    setSavedIdeas(prev => [...prev, { ...idea, notes: '' }]);
    
    toast({
      title: "Logo idea saved",
      description: "The logo concept has been added to your saved ideas",
    });
  };

  // Remove a saved idea
  const handleRemoveIdea = (id: string) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== id));
    
    toast({
      title: "Logo idea removed",
      description: "The logo concept has been removed from your saved ideas",
    });
  };

  // Update notes for a saved idea
  const handleUpdateNotes = (id: string, notes: string) => {
    setSavedIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, notes } : idea
      )
    );
  };

  // Generate new ideas
  const handleGenerateNew = () => {
    setLogoIdeas([]);
  };

  return (
    <ToolLayout
      title="Logo Idea Generator"
      description="Generate creative logo concepts for your brand or business"
      icon={<Palette className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="generator" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generate Ideas</TabsTrigger>
          <TabsTrigger value="saved" disabled={savedIdeas.length === 0}>
            Saved Ideas {savedIdeas.length > 0 && `(${savedIdeas.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-4 mt-4">
          {logoIdeas.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Generate Logo Ideas</CardTitle>
                <CardDescription>
                  Fill out the form below to get creative logo concepts for your brand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input
                          id="business-name"
                          placeholder="Enter your business name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select 
                          value={industry} 
                          onValueChange={setIndustry}
                        >
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map(ind => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Briefly describe what your business does and its values"
                        rows={3}
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords (optional)</Label>
                      <Input
                        id="keywords"
                        placeholder="Enter keywords separated by commas (e.g., professional, innovative)"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-name"
                        checked={includeBusinessName}
                        onCheckedChange={setIncludeBusinessName}
                      />
                      <Label htmlFor="include-name">Include business name in logo concepts</Label>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Preferred Logo Style</Label>
                      <RadioGroup 
                        value={selectedStyle} 
                        onValueChange={setSelectedStyle}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
                      >
                        {LOGO_STYLES.map(style => (
                          <div key={style.id} className="flex items-start space-x-2 border rounded-md p-2">
                            <RadioGroupItem value={style.id} id={`style-${style.id}`} className="mt-1" />
                            <div>
                              <Label htmlFor={`style-${style.id}`} className="font-medium">{style.name}</Label>
                              <p className="text-xs text-muted-foreground">{style.description}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Logo Element Type</Label>
                      <RadioGroup 
                        value={selectedElement} 
                        onValueChange={setSelectedElement}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
                      >
                        {LOGO_ELEMENTS.map(element => (
                          <div key={element.id} className="flex items-start space-x-2 border rounded-md p-2">
                            <RadioGroupItem value={element.id} id={`element-${element.id}`} className="mt-1" />
                            <div>
                              <Label htmlFor={`element-${element.id}`} className="font-medium">{element.name}</Label>
                              <p className="text-xs text-muted-foreground">{element.description}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Color Palette</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {COLOR_PALETTES.map(palette => (
                          <div 
                            key={palette.id}
                            className={`flex flex-col border rounded-md p-3 cursor-pointer transition-all hover:border-primary 
                              ${selectedPalette === palette.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelectedPalette(palette.id)}
                          >
                            <div className="flex space-x-1 mb-2">
                              {palette.colors.map((color, index) => (
                                <div 
                                  key={index}
                                  className="h-6 flex-1 rounded-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <p className="text-sm font-medium">{palette.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {palette.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !businessName.trim()}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Generate Logo Ideas
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Logo Concepts</h2>
                <Button 
                  variant="outline" 
                  onClick={handleGenerateNew}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start New
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {logoIdeas.map(idea => (
                  <Card key={idea.id} className="overflow-hidden">
                    <div className="aspect-video flex items-center justify-center bg-muted">
                      <img
                        src={idea.imageUrl}
                        alt={idea.title}
                        className="object-contain max-h-full"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{idea.title}</CardTitle>
                      <CardDescription>{idea.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-0">
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Key Elements:</p>
                        <p className="text-sm">{idea.elements}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSaveIdea(idea)}
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save This Idea
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Save your favorite concepts to refine them further</li>
                    <li>Consider how each logo would look in different sizes and contexts</li>
                    <li>Test the logo concepts with your target audience if possible</li>
                    <li>Think about how the logo will be used across different media</li>
                    <li>Once you've selected a concept, work with a designer to finalize it</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Saved Ideas</h2>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('generator')}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Generate More
            </Button>
          </div>
          
          {savedIdeas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No saved logo ideas yet.</p>
                <p className="text-muted-foreground text-center mb-4">Generate and save logo concepts to see them here.</p>
                <Button onClick={() => setActiveTab('generator')}>
                  Start Generating Ideas
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedIdeas.map(idea => (
                <Card key={idea.id} className="overflow-hidden">
                  <div className="aspect-video flex items-center justify-center bg-muted">
                    <img
                      src={idea.imageUrl}
                      alt={idea.title}
                      className="object-contain max-h-full"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{idea.title}</CardTitle>
                    <CardDescription>{idea.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-0">
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Key Elements:</p>
                      <p className="text-sm">{idea.elements}</p>
                    </div>
                    
                    <div className="pt-2">
                      <Label htmlFor={`notes-${idea.id}`} className="text-xs font-medium text-muted-foreground">
                        Notes:
                      </Label>
                      <Textarea
                        id={`notes-${idea.id}`}
                        placeholder="Add notes about this logo concept..."
                        rows={3}
                        className="mt-1"
                        value={idea.notes || ''}
                        onChange={(e) => handleUpdateNotes(idea.id, e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveIdea(idea.id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default LogoIdeaGenerator; 