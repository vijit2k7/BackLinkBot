import React, { useState } from 'react';
import { Globe, Search, Loader2, Check, X, RefreshCw, ArrowRight } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Domain suggestion types
interface DomainSuggestion {
  id: string;
  domain: string;
  tld: string;
  availability: boolean;
  price: string;
  isFavorite: boolean;
  relevanceScore: number;
}

interface KeywordGroup {
  category: string;
  keywords: string[];
}

const DomainNameFinder = () => {
  const [businessName, setBusinessName] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showUnavailable, setShowUnavailable] = useState<boolean>(true);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(false);
  const [includeTrending, setIncludeTrending] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [favorites, setFavorites] = useState<DomainSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>('domain-finder');

  // Domain extensions
  const commonTLDs = ['.com', '.net', '.org', '.io', '.co'];
  const specializedTLDs = ['.app', '.dev', '.tech', '.ai', '.store', '.shop'];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const generatedSuggestions = generateDomainSuggestions();
      setSuggestions(generatedSuggestions);
      setLoading(false);
    }, 1500);
  };

  // Generate domain suggestions (mock)
  const generateDomainSuggestions = (): DomainSuggestion[] => {
    const businessNameClean = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const businessTypeClean = businessType.toLowerCase().replace(/[^a-z0-9]/g, '');
    const keywordsArray = keywords.split(',').map(k => k.trim().toLowerCase());
    
    // Create variations of domain names
    const variations: DomainSuggestion[] = [];
    
    // Business name with common TLDs
    commonTLDs.forEach(tld => {
      variations.push({
        id: `domain-${Date.now()}-${Math.random()}`,
        domain: businessNameClean,
        tld,
        availability: Math.random() > 0.6, // 40% chance of being available
        price: '$12.99/year',
        isFavorite: false,
        relevanceScore: 95
      });
    });
    
    // Business name + business type with TLDs
    if (businessTypeClean) {
      // Main combinations
      ['.com', '.io', '.co'].forEach(tld => {
        variations.push({
          id: `domain-${Date.now()}-${Math.random()}`,
          domain: `${businessNameClean}${businessTypeClean}`,
          tld,
          availability: Math.random() > 0.4, // 60% chance of being available
          price: tld === '.io' ? '$39.99/year' : '$14.99/year',
          isFavorite: false,
          relevanceScore: 90
        });
        
        // With hyphen if enabled
        if (includeHyphens) {
          variations.push({
            id: `domain-${Date.now()}-${Math.random()}`,
            domain: `${businessNameClean}-${businessTypeClean}`,
            tld,
            availability: Math.random() > 0.2, // 80% chance of being available
            price: tld === '.io' ? '$39.99/year' : '$14.99/year',
            isFavorite: false,
            relevanceScore: 85
          });
        }
      });
    }
    
    // Keywords combinations
    if (keywordsArray.length > 0) {
      keywordsArray.forEach(keyword => {
        // Skip empty keywords
        if (!keyword) return;
        
        // Use specialized TLDs for keywords
        specializedTLDs.forEach(tld => {
          // Match specialized TLDs with relevant keywords
          if ((tld === '.tech' && (businessTypeClean.includes('tech') || keyword.includes('tech'))) ||
              (tld === '.app' && (businessTypeClean.includes('app') || keyword.includes('app'))) ||
              (tld === '.dev' && (businessTypeClean.includes('dev') || keyword.includes('software'))) ||
              (tld === '.ai' && (businessTypeClean.includes('ai') || keyword.includes('ai') || keyword.includes('intelligence'))) ||
              (tld === '.store' && (businessTypeClean.includes('store') || keyword.includes('shop') || keyword.includes('retail'))) ||
              (tld === '.shop' && (businessTypeClean.includes('shop') || keyword.includes('store') || keyword.includes('retail')))) {
            
            // Add name + keyword combination
            variations.push({
              id: `domain-${Date.now()}-${Math.random()}`,
              domain: `${businessNameClean}${keyword}`,
              tld,
              availability: Math.random() > 0.3, // 70% chance of being available
              price: tld === '.ai' ? '$69.99/year' : '$24.99/year',
              isFavorite: false,
              relevanceScore: 80
            });
            
            // With hyphen if enabled
            if (includeHyphens) {
              variations.push({
                id: `domain-${Date.now()}-${Math.random()}`,
                domain: `${businessNameClean}-${keyword}`,
                tld,
                availability: Math.random() > 0.2, // 80% chance of being available
                price: tld === '.ai' ? '$69.99/year' : '$24.99/year',
                isFavorite: false,
                relevanceScore: 75
              });
            }
          }
        });
        
        // Add keyword + name with common TLDs
        const randomTLD = commonTLDs[Math.floor(Math.random() * commonTLDs.length)];
        variations.push({
          id: `domain-${Date.now()}-${Math.random()}`,
          domain: `${keyword}${businessNameClean}`,
          tld: randomTLD,
          availability: Math.random() > 0.4, // 60% chance of being available
          price: randomTLD === '.io' ? '$39.99/year' : '$14.99/year',
          isFavorite: false,
          relevanceScore: 70
        });
      });
    }
    
    // Add trending domain patterns if enabled
    if (includeTrending) {
      const trendingPatterns = [
        { prefix: 'get', tld: '.io' },
        { prefix: 'try', tld: '.app' },
        { prefix: 'use', tld: '.co' },
        { prefix: 'my', tld: '.com' },
        { prefix: 'the', tld: '.co' },
      ];
      
      trendingPatterns.forEach(pattern => {
        variations.push({
          id: `domain-${Date.now()}-${Math.random()}`,
          domain: `${pattern.prefix}${businessNameClean}`,
          tld: pattern.tld,
          availability: Math.random() > 0.3, // 70% chance of being available
          price: pattern.tld === '.io' ? '$39.99/year' : '$14.99/year',
          isFavorite: false,
          relevanceScore: 65
        });
      });
    }
    
    // Filter out unavailable domains if the option is not checked
    let filteredVariations = variations;
    if (!showUnavailable) {
      filteredVariations = variations.filter(domain => domain.availability);
    }
    
    // Sort by relevance score
    return filteredVariations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  // Toggle favorite status of a domain
  const toggleFavorite = (domainId: string) => {
    const updatedSuggestions = suggestions.map(suggestion => {
      if (suggestion.id === domainId) {
        const updated = {...suggestion, isFavorite: !suggestion.isFavorite};
        
        // Add to favorites if not already there
        if (updated.isFavorite && !favorites.some(fav => fav.id === domainId)) {
          setFavorites([...favorites, updated]);
        } 
        // Remove from favorites
        else if (!updated.isFavorite) {
          setFavorites(favorites.filter(fav => fav.id !== domainId));
        }
        
        return updated;
      }
      return suggestion;
    });
    
    setSuggestions(updatedSuggestions);
  };

  // Get relevant keywords suggestions (would normally come from an API)
  const getKeywordSuggestions = (): KeywordGroup[] => {
    return [
      {
        category: 'Business Type',
        keywords: ['consulting', 'agency', 'solutions', 'services', 'group', 'partners']
      },
      {
        category: 'Industry',
        keywords: ['tech', 'design', 'creative', 'digital', 'media', 'health']
      },
      {
        category: 'Features',
        keywords: ['smart', 'pro', 'fast', 'easy', 'simple', 'premium']
      },
    ];
  };

  // Add keyword to the input
  const addKeyword = (keyword: string) => {
    const currentKeywords = keywords.split(',').map(k => k.trim()).filter(k => k);
    if (!currentKeywords.includes(keyword)) {
      const updatedKeywords = [...currentKeywords, keyword];
      setKeywords(updatedKeywords.join(', '));
    }
  };

  // Clear all domain suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
  };

  // New search with the same parameters
  const refreshSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const refreshedSuggestions = generateDomainSuggestions();
      setSuggestions(refreshedSuggestions);
      setLoading(false);
    }, 1000);
  };

  return (
    <ToolLayout
      title="Domain Name Finder"
      description="Find available and catchy domain names for your business or project."
      icon={<Globe className="h-8 w-8 text-blue-500" />}
      helpText="Enter your business name and relevant keywords to generate domain name suggestions. You can favorite domains you like and filter results based on availability."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="domain-finder">Domain Finder</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
        </TabsList>
      
        <TabsContent value="domain-finder">
          {suggestions.length === 0 ? (
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business/Project Name <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="e.g., Acme, TechSolutions, GreenLeaf" 
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <Input 
                      placeholder="e.g., consulting, software, retail" 
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keywords (comma separated)
                    </label>
                    <Input 
                      placeholder="e.g., innovative, tech, global" 
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested Keywords</h3>
                    <div className="space-y-3">
                      {getKeywordSuggestions().map((group, idx) => (
                        <div key={idx}>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">{group.category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {group.keywords.map((keyword, kidx) => (
                              <Badge 
                                key={kidx} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => addKeyword(keyword)}
                              >
                                + {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-unavailable" 
                      checked={showUnavailable}
                      onCheckedChange={(checked) => setShowUnavailable(checked as boolean)}
                    />
                    <label
                      htmlFor="include-unavailable"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show unavailable domains
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-hyphens" 
                      checked={includeHyphens}
                      onCheckedChange={(checked) => setIncludeHyphens(checked as boolean)}
                    />
                    <label
                      htmlFor="include-hyphens"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include hyphenated domains
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-trending" 
                      checked={includeTrending}
                      onCheckedChange={(checked) => setIncludeTrending(checked as boolean)}
                    />
                    <label
                      htmlFor="include-trending"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include trending patterns
                    </label>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading || !businessName}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding Domains...
                    </>
                  ) : (
                    <>
                      Find Available Domains <Search className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  We'll check domain availability across multiple TLDs and suggest relevant alternatives
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-semibold">Domain Suggestions</h3>
                  <p className="text-sm text-gray-500">
                    Found {suggestions.length} domain suggestions for "{businessName}"
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearSuggestions}>
                    <ArrowRight className="h-4 w-4 mr-1" /> New Search
                  </Button>
                  <Button variant="outline" size="sm" onClick={refreshSearch}>
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh Results
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Favorite</TableHead>
                      <TableHead>Domain Name</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Relevance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.map(suggestion => (
                      <TableRow key={suggestion.id}>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={suggestion.isFavorite ? "text-yellow-500" : "text-gray-300"}
                            onClick={() => toggleFavorite(suggestion.id)}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="18" 
                              height="18" 
                              viewBox="0 0 24 24" 
                              fill={suggestion.isFavorite ? "currentColor" : "none"} 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{suggestion.domain}{suggestion.tld}</TableCell>
                        <TableCell>
                          {suggestion.availability ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                              <Check className="h-3 w-3 mr-1" /> Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">
                              <X className="h-3 w-3 mr-1" /> Taken
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{suggestion.price}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center">
                            <span className="mr-2">{suggestion.relevanceScore}%</span>
                            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-600" 
                                style={{ width: `${suggestion.relevanceScore}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          {favorites.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold mb-6">Your Favorite Domains</h3>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Remove</TableHead>
                      <TableHead>Domain Name</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {favorites.map(favorite => (
                      <TableRow key={favorite.id}>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => toggleFavorite(favorite.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{favorite.domain}{favorite.tld}</TableCell>
                        <TableCell>
                          {favorite.availability ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                              <Check className="h-3 w-3 mr-1" /> Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">
                              <X className="h-3 w-3 mr-1" /> Taken
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{favorite.price}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-600"
                            onClick={() => {
                              window.open(`https://domains.google.com/registrar/search?searchTerm=${favorite.domain}${favorite.tld}`, '_blank');
                            }}
                          >
                            Check Domain
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Favorite Domains Yet</h3>
              <p className="text-gray-500 mb-6">Save domain names you like to compare and check their availability later.</p>
              <Button 
                variant="default"
                onClick={() => setActiveTab('domain-finder')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Find Domains
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default DomainNameFinder; 