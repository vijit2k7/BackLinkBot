import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Loader2, Download, RefreshCw, Heart, Copy } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

// Business name types
interface BusinessName {
  id: string;
  name: string;
  description: string;
  type: string; // modern, traditional, playful, etc.
  domainAvailable?: boolean;
  favorite: boolean;
}

const BusinessNameGenerator = () => {
  // States
  const [industry, setIndustry] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [style, setStyle] = useState<string>('modern');
  const [includeDomainCheck, setIncludeDomainCheck] = useState<boolean>(true);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedNames, setGeneratedNames] = useState<BusinessName[]>([]);
  const [favorites, setFavorites] = useState<BusinessName[]>([]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const names = generateBusinessNames();
      setGeneratedNames(names);
      setLoading(false);
    }, 1500);
  };
  
  // Generate business names (mock function)
  const generateBusinessNames = (): BusinessName[] => {
    // This would normally call an AI service for creative names
    // We'll mock the results based on inputs
    
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
    const mockNames: BusinessName[] = [];
    
    // Generate names based on industry and keywords
    // Simple name generation logic for demo purposes
    
    // 1. Industry + keyword combinations
    if (industry && keywordList.length > 0) {
      const keyword1 = keywordList[0];
      mockNames.push({
        id: `name-${Date.now()}-1`,
        name: `${toTitleCase(keyword1)}${toTitleCase(industry)}`,
        description: `A modern name combining your main keyword with your industry.`,
        type: 'modern',
        domainAvailable: Math.random() > 0.5,
        favorite: false
      });
      
      if (keywordList.length > 1) {
        const keyword2 = keywordList[1];
        mockNames.push({
          id: `name-${Date.now()}-2`,
          name: `${toTitleCase(industry)}${toTitleCase(keyword2)}`,
          description: `Puts your industry first, followed by a key attribute.`,
          type: 'traditional',
          domainAvailable: Math.random() > 0.5,
          favorite: false
        });
      }
    }
    
    // 2. Creative combinations
    const prefixes = ['Nova', 'Evo', 'Aero', 'Viva', 'Prime', 'Peak', 'Ace', 'Zoom', 'Spark'];
    const suffixes = ['Hub', 'Lab', 'Works', 'Spot', 'Zone', 'Space', 'Link', 'Nexus', 'Pro'];
    
    // Add prefix + industry/keyword
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const baseWord = industry || (keywordList.length > 0 ? keywordList[0] : 'Business');
    
    mockNames.push({
      id: `name-${Date.now()}-3`,
      name: `${randomPrefix}${toTitleCase(baseWord)}`,
      description: `A modern, dynamic name with a strong prefix.`,
      type: 'modern',
      domainAvailable: Math.random() > 0.7,
      favorite: false
    });
    
    // Add keyword/industry + suffix
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    mockNames.push({
      id: `name-${Date.now()}-4`,
      name: `${toTitleCase(baseWord)}${randomSuffix}`,
      description: `A professional name that clearly communicates your focus area.`,
      type: style === 'professional' ? 'professional' : 'modern',
      domainAvailable: Math.random() > 0.6,
      favorite: false
    });
    
    // 3. Based on style preference
    if (style === 'creative' || style === 'playful') {
      // Creative word combinations or invented words
      const creativeWords = ['Blitz', 'Quirk', 'Zest', 'Bounce', 'Boost', 'Buzz'];
      const randomCreative = creativeWords[Math.floor(Math.random() * creativeWords.length)];
      
      mockNames.push({
        id: `name-${Date.now()}-5`,
        name: `${randomCreative}${toTitleCase(baseWord)}`,
        description: `A playful, memorable name with high brand potential.`,
        type: 'playful',
        domainAvailable: Math.random() > 0.4,
        favorite: false
      });
      
      // Invented word
      const baseStart = baseWord.substring(0, Math.min(4, baseWord.length));
      const randomEnd = suffixes[Math.floor(Math.random() * suffixes.length)].toLowerCase();
      
      mockNames.push({
        id: `name-${Date.now()}-6`,
        name: `${toTitleCase(baseStart)}${randomEnd}`,
        description: `A unique, invented word with good memorability.`,
        type: 'creative',
        domainAvailable: Math.random() > 0.3,
        favorite: false
      });
    }
    
    if (style === 'traditional' || style === 'professional') {
      // More formal naming conventions
      const professionalPrefixes = ['Summit', 'Elite', 'Premier', 'Legacy', 'Heritage'];
      const randomProPrefix = professionalPrefixes[Math.floor(Math.random() * professionalPrefixes.length)];
      
      mockNames.push({
        id: `name-${Date.now()}-7`,
        name: `${randomProPrefix} ${toTitleCase(baseWord)} Group`,
        description: `A traditional, professional name that conveys reliability.`,
        type: 'professional',
        domainAvailable: Math.random() > 0.5,
        favorite: false
      });
      
      if (keywordList.length > 0) {
        const keywordForName = keywordList[Math.floor(Math.random() * keywordList.length)];
        mockNames.push({
          id: `name-${Date.now()}-8`,
          name: `${toTitleCase(baseWord)} & ${toTitleCase(keywordForName)}`,
          description: `A classic naming convention that's straightforward and memorable.`,
          type: 'traditional',
          domainAvailable: Math.random() > 0.4,
          favorite: false
        });
      }
    }
    
    // 4. Unique, premium options
    // Two-letter combinations
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter1 = letters[Math.floor(Math.random() * letters.length)];
    const letter2 = letters[Math.floor(Math.random() * letters.length)];
    
    mockNames.push({
      id: `name-${Date.now()}-9`,
      name: `${letter1}${letter2} ${toTitleCase(baseWord)}`,
      description: `A premium, short name with high memorability.`,
      type: 'premium',
      domainAvailable: Math.random() > 0.8, // Less likely to be available
      favorite: false
    });
    
    // Add one based on notes if provided
    if (additionalNotes.trim()) {
      const noteWords = additionalNotes.split(' ');
      if (noteWords.length >= 2) {
        const word1 = noteWords[0];
        const word2 = noteWords[Math.min(1, noteWords.length - 1)];
        
        mockNames.push({
          id: `name-${Date.now()}-10`,
          name: `${toTitleCase(word1)}${toTitleCase(word2)}`,
          description: `A name inspired by your additional notes.`,
          type: 'custom',
          domainAvailable: Math.random() > 0.5,
          favorite: false
        });
      }
    }
    
    return mockNames;
  };
  
  // Toggle favorite status
  const toggleFavorite = (nameId: string) => {
    const updatedNames = generatedNames.map(name => {
      if (name.id === nameId) {
        const updatedName = {...name, favorite: !name.favorite};
        
        // Add to favorites if not already there
        if (updatedName.favorite && !favorites.some(fav => fav.id === nameId)) {
          setFavorites([...favorites, updatedName]);
        } 
        // Remove from favorites
        else if (!updatedName.favorite) {
          setFavorites(favorites.filter(fav => fav.id !== nameId));
        }
        
        return updatedName;
      }
      return name;
    });
    
    setGeneratedNames(updatedNames);
  };
  
  // Copy name to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to Clipboard",
      description: `"${text}" has been copied to your clipboard.`
    });
  };
  
  // Export favorites (simplified)
  const exportFavorites = () => {
    // In a real implementation, this would generate and download a file
    toast({
      title: "Export Started",
      description: "Your favorite names would now download as a text file."
    });
  };
  
  // Clear all generated names
  const clearNames = () => {
    setGeneratedNames([]);
  };
  
  // Helper function to convert string to title case
  const toTitleCase = (str: string): string => {
    return str.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  };
  
  // Business name card component
  const NameCard = ({ name }: { name: BusinessName }) => {
    return (
      <Card className="border hover:shadow-md transition-all">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{name.name}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleFavorite(name.id)}
              className={name.favorite ? "text-red-500" : "text-gray-400"}
            >
              <Heart className="h-5 w-5" fill={name.favorite ? "currentColor" : "none"} />
            </Button>
          </div>
          
          <p className="text-gray-600 my-3">{name.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-gray-50">
              {name.type}
            </Badge>
            
            {name.domainAvailable !== undefined && (
              <Badge 
                className={name.domainAvailable ? "bg-green-100 text-green-800 border-0" : "bg-amber-100 text-amber-800 border-0"}
              >
                {name.domainAvailable ? "Domain likely available" : "Domain may be taken"}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => copyToClipboard(name.name)}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            
            {name.domainAvailable && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-blue-600"
                onClick={() => {
                  window.open(`https://domains.google.com/registrar/search?searchTerm=${name.name.replace(/\s+/g, '')}`, '_blank');
                }}
              >
                Check Domain
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <ToolLayout
      title="Business Name Generator"
      description="Generate creative and available business name ideas for your venture."
      icon={<Lightbulb className="h-8 w-8 text-yellow-500" />}
      helpText="Enter information about your business to generate name suggestions. You can save your favorites and check domain availability."
    >
      <Tabs defaultValue="generate">
        <TabsList className="mb-6">
          <TabsTrigger value="generate">Generate Names</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
        </TabsList>
      
        <TabsContent value="generate">
          {generatedNames.length === 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <Select 
                    value={industry} 
                    onValueChange={setIndustry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="realestate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (comma separated)
                  </label>
                  <Input 
                    placeholder="e.g., innovative, sustainable, luxury" 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Naming Style
                  </label>
                  <Select 
                    value={style} 
                    onValueChange={setStyle}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select naming style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern & Trendy</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="creative">Creative & Unique</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="playful">Playful & Fun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="domain-check" 
                      checked={includeDomainCheck}
                      onCheckedChange={(checked) => setIncludeDomainCheck(checked as boolean)}
                    />
                    <Label htmlFor="domain-check" className="text-sm text-gray-700">
                      Include domain availability check
                    </Label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <Textarea 
                  placeholder="Any specific requirements or preferences for your business name..."
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Names...
                  </>
                ) : (
                  <>
                    Generate Name Ideas <Lightbulb className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Generated Business Names</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearNames}>
                    <RefreshCw className="h-4 w-4 mr-1" /> New Names
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedNames.map((name) => (
                  <NameCard key={name.id} name={name} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          {favorites.length > 0 ? (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Your Favorite Names</h3>
                <Button variant="outline" size="sm" onClick={exportFavorites}>
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((name) => (
                  <NameCard key={name.id} name={name} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Favorite Names Yet</h3>
              <p className="text-gray-500 mb-6">Generate and save business names you like to review them later.</p>
              <Button 
                variant="default"
                onClick={() => {
                  const generateTab = document.querySelector('[data-state="inactive"][value="generate"]');
                  if (generateTab && generateTab instanceof HTMLElement) {
                    generateTab.click();
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Generate New Names <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default BusinessNameGenerator; 