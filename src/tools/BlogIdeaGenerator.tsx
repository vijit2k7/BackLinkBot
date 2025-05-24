import React, { useState } from 'react';
import { FileText, ArrowRight, Loader2, Download, Save, Plus, RefreshCw, Trash2, Check, Heart } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const BlogIdeaGenerator = () => {
  // Form states
  const [industry, setIndustry] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [contentType, setContentType] = useState<string>('all');
  const [count, setCount] = useState<string>('10');
  const [contentGoals, setContentGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<BlogPostIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<BlogPostIdea[]>([]);
  const [customIdea, setCustomIdea] = useState<string>('');

  // Interface for blog post idea
  interface BlogPostIdea {
    id: string;
    title: string;
    description: string;
    type: string;
    keywords: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: string;
    isSaved?: boolean;
    isLiked?: boolean;
  }

  // Content type options
  const contentTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'how-to', label: 'How-To Guides' },
    { value: 'list', label: 'List-Based Articles' },
    { value: 'problem-solution', label: 'Problem-Solution' },
    { value: 'case-study', label: 'Case Studies' },
    { value: 'opinion', label: 'Opinion Pieces' },
    { value: 'interview', label: 'Expert Interviews' },
    { value: 'news', label: 'Industry News Analysis' },
    { value: 'comparison', label: 'Comparison Articles' },
    { value: 'ultimate-guide', label: 'Ultimate Guides' }
  ];

  // Content goal options
  const contentGoalOptions = [
    { id: 'traffic', label: 'Drive Traffic' },
    { id: 'education', label: 'Educate Audience' },
    { id: 'brand_awareness', label: 'Build Brand Awareness' },
    { id: 'lead_generation', label: 'Generate Leads' },
    { id: 'engagement', label: 'Increase Engagement' },
    { id: 'authority', label: 'Establish Authority' },
    { id: 'seo', label: 'Improve SEO' },
    { id: 'conversion', label: 'Drive Conversions' }
  ];

  // Handle content goal selection
  const handleGoalChange = (goalId: string) => {
    setContentGoals(current => 
      current.includes(goalId) 
        ? current.filter(id => id !== goalId)
        : [...current, goalId]
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate blog post ideas based on inputs
      const ideas = generateMockBlogIdeas();
      setGeneratedIdeas(ideas);
      setLoading(false);
    }, 2000);
  };

  // Add custom idea
  const addCustomIdea = () => {
    if (!customIdea.trim()) return;
    
    const newIdea: BlogPostIdea = {
      id: `custom-${Date.now()}`,
      title: customIdea,
      description: 'Custom idea added by you',
      type: 'custom',
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      difficulty: 'medium',
      estimatedTime: '30-60 minutes',
      isSaved: true
    };
    
    setSavedIdeas(prev => [...prev, newIdea]);
    setCustomIdea('');
    
    toast({
      title: "Custom idea added!",
      description: "Your custom idea has been added to your saved ideas.",
    });
  };

  // Save an idea
  const saveIdea = (idea: BlogPostIdea) => {
    if (savedIdeas.some(saved => saved.id === idea.id)) {
      // Remove from saved
      setSavedIdeas(prev => prev.filter(saved => saved.id !== idea.id));
      // Update generated ideas list
      setGeneratedIdeas(prev => 
        prev.map(item => 
          item.id === idea.id ? { ...item, isSaved: false } : item
        )
      );
      
      toast({
        title: "Idea removed from saved!",
        description: "The idea has been removed from your saved list.",
      });
    } else {
      // Add to saved
      setSavedIdeas(prev => [...prev, { ...idea, isSaved: true }]);
      // Update generated ideas list
      setGeneratedIdeas(prev => 
        prev.map(item => 
          item.id === idea.id ? { ...item, isSaved: true } : item
        )
      );
      
      toast({
        title: "Idea saved!",
        description: "The idea has been added to your saved list.",
      });
    }
  };

  // Toggle like on an idea
  const toggleLike = (ideaId: string) => {
    // Update in generated ideas
    setGeneratedIdeas(prev => 
      prev.map(item => 
        item.id === ideaId ? { ...item, isLiked: !item.isLiked } : item
      )
    );
    
    // Update in saved ideas if present
    setSavedIdeas(prev => 
      prev.map(item => 
        item.id === ideaId ? { ...item, isLiked: !item.isLiked } : item
      )
    );
  };

  // Generate mock blog post ideas for demonstration
  const generateMockBlogIdeas = (): BlogPostIdea[] => {
    // Base templates for different content types
    const templates: Record<string, string[]> = {
      'how-to': [
        `How to Optimize Your ${industry} Strategy for Better Results`,
        `The Step-by-Step Guide to Mastering ${keywords} in ${industry}`,
        `How to Solve Common ${industry} Problems in Just 10 Minutes`,
        `A Beginner's Guide to ${keywords} in ${industry}`,
        `How to Create a Winning ${industry} Strategy That ${targetAudience} Will Love`
      ],
      'list': [
        `10 Essential ${keywords} Tips Every ${targetAudience} Should Know`,
        `7 Proven ${industry} Strategies That Increased Our Revenue by 150%`,
        `5 Common ${industry} Mistakes and How to Avoid Them`,
        `12 Creative Ways to Use ${keywords} in Your ${industry} Strategy`,
        `8 ${industry} Trends That Will Dominate This Year`
      ],
      'problem-solution': [
        `Struggling with ${keywords}? Here's How to Fix It`,
        `The Biggest Challenge in ${industry} and How to Overcome It`,
        `Solving the ${targetAudience}'s Biggest Pain Points in ${industry}`,
        `Why Your ${industry} Strategy Isn't Working (And How to Fix It)`,
        `The Solution to Your ${keywords} Problems That No One Talks About`
      ],
      'case-study': [
        `How [Company] Achieved a 200% ROI with Their ${industry} Strategy`,
        `${industry} Success Story: How [Brand] Conquered ${keywords}`,
        `Case Study: Transforming ${targetAudience} Engagement Through ${keywords}`,
        `From Struggling to Success: A ${industry} Transformation Story`,
        `${industry} ROI Case Study: $10K Investment to $100K Return`
      ],
      'opinion': [
        `Why ${keywords} Is Overrated in ${industry} (And What to Focus on Instead)`,
        `The Future of ${industry}: Predictions for the Next 5 Years`,
        `Why Most ${industry} Advice Is Wrong (And What Actually Works)`,
        `Unpopular Opinion: ${keywords} Isn't Essential for ${industry} Success`,
        `Is ${keywords} Worth the Investment for ${targetAudience}? Our Take`
      ],
      'interview': [
        `Expert Interview: ${industry} Insights from [Expert Name]`,
        `Q&A with a ${industry} Leader: Secrets to Mastering ${keywords}`,
        `Inside Look: How ${industry} Experts Approach ${keywords}`,
        `[Expert] Shares Their Top ${industry} Tips for ${targetAudience}`,
        `Exclusive Interview: How [Expert] Built a Successful ${industry} Business`
      ],
      'news': [
        `Breaking: How the Latest ${industry} Update Affects Your Strategy`,
        `${industry} News: What the Recent Changes Mean for ${targetAudience}`,
        `The Impact of [Recent Event] on the Future of ${industry}`,
        `New Research Reveals Surprising Insights About ${keywords} in ${industry}`,
        `${industry} Policy Update: What You Need to Know Now`
      ],
      'comparison': [
        `${keywords} vs. Alternative Approaches: Which is Best for ${targetAudience}?`,
        `Comparing the Top 5 ${industry} Tools in 2023`,
        `Traditional vs. Modern ${industry} Methods: A Complete Comparison`,
        `${keywords} Showdown: Which Strategy Delivers Better Results?`,
        `Comparing ${industry} Strategies: What Works Best for Different Goals`
      ],
      'ultimate-guide': [
        `The Ultimate Guide to ${keywords} for ${targetAudience}`,
        `Everything You Need to Know About ${industry} in 2023`,
        `The Complete ${targetAudience}'s Handbook to ${keywords}`,
        `${industry} Mastery: The Definitive Guide for Beginners to Experts`,
        `The A-Z Guide of ${industry} Success: From Strategy to Implementation`
      ]
    };
    
    // Generate appropriate descriptions
    const generateDescription = (title: string, type: string): string => {
      switch(type) {
        case 'how-to':
          return `A practical, step-by-step guide that shows ${targetAudience} exactly how to implement or achieve the results they want. Include actionable tips, examples, and potential pitfalls to avoid.`;
        case 'list':
          return `A comprehensive collection of tips, strategies, or examples that provide value to ${targetAudience}. Each point should be substantive and provide unique insights.`;
        case 'problem-solution':
          return `Identify a common problem faced by ${targetAudience} in the ${industry} space, then provide a thorough solution with practical implementation steps.`;
        case 'case-study':
          return `An in-depth analysis of a real success story, focusing on strategies, implementation, results, and lessons learned that ${targetAudience} can apply to their own situation.`;
        case 'opinion':
          return `A thought-provoking perspective on a topic relevant to ${targetAudience}, backed by experience, data, or research to substantiate your viewpoint.`;
        case 'interview':
          return `A conversation with an industry expert sharing valuable insights, tips, and experiences that ${targetAudience} can learn from and apply.`;
        case 'news':
          return `Timely analysis of recent developments in ${industry}, explaining what happened and why it matters to ${targetAudience}.`;
        case 'comparison':
          return `A detailed evaluation of different options, approaches, or tools, helping ${targetAudience} make informed decisions by highlighting pros, cons, and best use cases.`;
        case 'ultimate-guide':
          return `An exhaustive resource covering all aspects of the topic, serving as a one-stop reference for ${targetAudience} at any knowledge level.`;
        default:
          return `Explore this ${industry} topic in depth, providing valuable insights and actionable advice for ${targetAudience}.`;
      }
    };
    
    // Generate difficulty and time estimates
    const getDifficulty = (): 'easy' | 'medium' | 'hard' => {
      const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
      return difficulties[Math.floor(Math.random() * difficulties.length)];
    };
    
    const getEstimatedTime = (difficulty: 'easy' | 'medium' | 'hard'): string => {
      switch(difficulty) {
        case 'easy':
          return '1-2 hours';
        case 'medium':
          return '2-4 hours';
        case 'hard':
          return '4-8 hours';
        default:
          return '2-4 hours';
      }
    };
    
    // Extract keywords for each idea
    const extractKeywords = (title: string): string[] => {
      // Start with user provided keywords
      const baseKeywords = keywords.split(',').map(k => k.trim()).filter(k => k);
      
      // Extract potential keywords from title
      const words = title.split(' ');
      const potentialKeywords = words.filter(word => 
        word.length > 4 && 
        !['about', 'these', 'those', 'their', 'there', 'which', 'what', 'when', 'where', 'with'].includes(word.toLowerCase())
      );
      
      // Combine and ensure uniqueness
      const combinedKeywords = [...baseKeywords];
      potentialKeywords.forEach(keyword => {
        if (!combinedKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())) {
          combinedKeywords.push(keyword);
        }
      });
      
      // Add industry as a keyword if not already included
      if (industry && !combinedKeywords.some(k => k.toLowerCase() === industry.toLowerCase())) {
        combinedKeywords.push(industry);
      }
      
      // Limit to 5 keywords
      return combinedKeywords.slice(0, 5);
    };
    
    // Determine which content types to include
    let typesToInclude: string[] = [];
    if (contentType === 'all') {
      typesToInclude = Object.keys(templates);
    } else {
      typesToInclude = [contentType];
    }
    
    // Generate ideas
    const ideas: BlogPostIdea[] = [];
    const countNum = parseInt(count) || 10;
    
    // Distribute ideas across selected types
    const ideasPerType = Math.max(1, Math.ceil(countNum / typesToInclude.length));
    
    typesToInclude.forEach(type => {
      const typeTemplates = templates[type] || templates['how-to']; // Fallback to how-to
      
      for (let i = 0; i < ideasPerType && ideas.length < countNum; i++) {
        const randomIndex = Math.floor(Math.random() * typeTemplates.length);
        const title = typeTemplates[randomIndex]
          .replace(/\${industry}/g, industry || 'your industry')
          .replace(/\${keywords}/g, keywords.split(',')[0] || 'your topic')
          .replace(/\${targetAudience}/g, targetAudience || 'your audience');
        
        const difficulty = getDifficulty();
        
        ideas.push({
          id: `idea-${Date.now()}-${ideas.length}`,
          title,
          description: generateDescription(title, type),
          type,
          keywords: extractKeywords(title),
          difficulty,
          estimatedTime: getEstimatedTime(difficulty),
          isSaved: false,
          isLiked: false
        });
      }
    });
    
    return ideas.slice(0, countNum);
  };

  // Export ideas to CSV
  const exportIdeas = () => {
    const ideasToExport = savedIdeas.length > 0 ? savedIdeas : generatedIdeas;
    
    // Create CSV content
    let csvContent = "Title,Type,Keywords,Difficulty,Estimated Time,Description\n";
    
    ideasToExport.forEach(idea => {
      // Format each field properly for CSV
      const formattedTitle = `"${idea.title.replace(/"/g, '""')}"`;
      const formattedType = `"${idea.type}"`;
      const formattedKeywords = `"${idea.keywords.join(', ')}"`;
      const formattedDifficulty = `"${idea.difficulty}"`;
      const formattedTime = `"${idea.estimatedTime}"`;
      const formattedDescription = `"${idea.description.replace(/"/g, '""')}"`;
      
      csvContent += `${formattedTitle},${formattedType},${formattedKeywords},${formattedDifficulty},${formattedTime},${formattedDescription}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element with proper typing
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = 'blog_post_ideas.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Ideas exported!",
      description: "Your blog post ideas have been exported to CSV.",
    });
  };

  // Get badge color for content type
  const getTypeBadgeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'how-to': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'list': 'bg-green-100 text-green-800 hover:bg-green-200',
      'problem-solution': 'bg-red-100 text-red-800 hover:bg-red-200',
      'case-study': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'opinion': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      'interview': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      'news': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      'comparison': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'ultimate-guide': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      'custom': 'bg-pink-100 text-pink-800 hover:bg-pink-200'
    };
    
    return colors[type] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  // Get badge color for difficulty
  const getDifficultyBadgeColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    };
    
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <ToolLayout
      title="Blog Post Idea Generator"
      description="Generate engaging blog post ideas tailored to your industry and audience"
      icon={<FileText className="h-6 w-6 text-blue-500" />}
      helpText="Fill in the form with your industry, target audience, and keywords to generate relevant blog post ideas."
    >
      <Tabs defaultValue="generate">
        <TabsList className="mb-6">
          <TabsTrigger value="generate">Generate Ideas</TabsTrigger>
          <TabsTrigger value="saved" disabled={savedIdeas.length === 0}>Saved Ideas ({savedIdeas.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <div className="space-y-6">
            <Card className="border border-blue-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Generate Blog Post Ideas</CardTitle>
                <CardDescription>
                  Fill in the details below to generate blog post ideas tailored to your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="industry">Your Industry or Niche</Label>
                        <Input 
                          id="industry"
                          placeholder="E.g., Digital Marketing, Fitness, Software Development" 
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="target-audience">Target Audience</Label>
                        <Input 
                          id="target-audience"
                          placeholder="E.g., Small Business Owners, Marketing Managers, Fitness Beginners" 
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="keywords">Primary Keywords (comma separated)</Label>
                        <Input 
                          id="keywords"
                          placeholder="E.g., SEO, content marketing, social media" 
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="content-type">Content Type</Label>
                        <Select value={contentType} onValueChange={setContentType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            {contentTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="count">Number of Ideas</Label>
                        <Select value={count} onValueChange={setCount}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 ideas</SelectItem>
                            <SelectItem value="10">10 ideas</SelectItem>
                            <SelectItem value="15">15 ideas</SelectItem>
                            <SelectItem value="20">20 ideas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Content Goals (Optional)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {contentGoalOptions.map(goal => (
                            <div key={goal.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`goal-${goal.id}`} 
                                checked={contentGoals.includes(goal.id)}
                                onCheckedChange={() => handleGoalChange(goal.id)} 
                              />
                              <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer">
                                {goal.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-center">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                      disabled={loading || !industry || !targetAudience}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Ideas...
                        </>
                      ) : (
                        <>
                          Generate Blog Post Ideas
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {generatedIdeas.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Generated Ideas</h2>
                  <Button 
                    variant="outline" 
                    onClick={exportIdeas}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {generatedIdeas.map(idea => (
                    <Card key={idea.id} className="border-blue-100 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg pr-4">{idea.title}</CardTitle>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className={`h-8 w-8 rounded-full ${idea.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                              onClick={() => toggleLike(idea.id)}
                            >
                              <Heart className="h-5 w-5" fill={idea.isLiked ? "currentColor" : "none"} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className={`h-8 w-8 rounded-full ${idea.isSaved ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
                              onClick={() => saveIdea(idea)}
                            >
                              {idea.isSaved ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{idea.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getTypeBadgeColor(idea.type)}>
                            {contentTypeOptions.find(t => t.value === idea.type)?.label || idea.type}
                          </Badge>
                          <Badge className={getDifficultyBadgeColor(idea.difficulty)}>
                            {idea.difficulty.charAt(0).toUpperCase() + idea.difficulty.slice(1)}
                          </Badge>
                          <Badge variant="outline">
                            {idea.estimatedTime}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {idea.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700">
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
            <Card className="border border-blue-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Your Saved Ideas</CardTitle>
                <CardDescription>
                  Manage your saved blog post ideas or add custom ones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label htmlFor="custom-idea">Add Custom Idea</Label>
                    <Input 
                      id="custom-idea"
                      placeholder="Enter your own blog post idea..." 
                      value={customIdea}
                      onChange={(e) => setCustomIdea(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={addCustomIdea}
                    disabled={!customIdea.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSavedIdeas([])}
                  disabled={savedIdeas.length === 0}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={exportIdeas}
                  disabled={savedIdeas.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              </CardFooter>
            </Card>

            {savedIdeas.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {savedIdeas.map(idea => (
                  <Card key={idea.id} className="border-blue-100 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg pr-4">{idea.title}</CardTitle>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className={`h-8 w-8 rounded-full ${idea.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            onClick={() => toggleLike(idea.id)}
                          >
                            <Heart className="h-5 w-5" fill={idea.isLiked ? "currentColor" : "none"} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50"
                            onClick={() => saveIdea(idea)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{idea.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeBadgeColor(idea.type)}>
                          {contentTypeOptions.find(t => t.value === idea.type)?.label || idea.type}
                        </Badge>
                        {idea.difficulty && (
                          <Badge className={getDifficultyBadgeColor(idea.difficulty)}>
                            {idea.difficulty.charAt(0).toUpperCase() + idea.difficulty.slice(1)}
                          </Badge>
                        )}
                        {idea.estimatedTime && (
                          <Badge variant="outline">
                            {idea.estimatedTime}
                          </Badge>
                        )}
                      </div>
                      {idea.keywords && idea.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {idea.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved ideas</h3>
                <p className="text-gray-500 mb-6">You haven't saved any blog post ideas yet. Generate some ideas or add custom ones.</p>
                <Button 
                  variant="outline" 
                  onClick={() => document.querySelector('[data-value="generate"]')?.click()}
                >
                  Generate Ideas
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Writing Tips Section */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Blog Writing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
                <h4 className="font-semibold">Structure for Engagement</h4>
              </div>
              <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                <li>Write compelling headlines (6-10 words)</li>
                <li>Start with a hook in the first paragraph</li>
                <li>Use subheadings to break up content</li>
                <li>Keep paragraphs short (3-4 sentences)</li>
                <li>End with a clear call-to-action</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-green-700" />
                </div>
                <h4 className="font-semibold">SEO Best Practices</h4>
              </div>
              <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                <li>Include target keyword in title & first 100 words</li>
                <li>Add internal and external links</li>
                <li>Optimize images with alt text</li>
                <li>Aim for 1,500+ words for in-depth topics</li>
                <li>Create meta descriptions with keywords</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Heart className="h-5 w-5 text-purple-700" />
                </div>
                <h4 className="font-semibold">Reader Engagement</h4>
              </div>
              <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                <li>Address the reader directly using "you"</li>
                <li>Include relevant examples and stories</li>
                <li>Add visuals: images, infographics, videos</li>
                <li>Ask questions to encourage comments</li>
                <li>Make content scannable with bullet points</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default BlogIdeaGenerator; 