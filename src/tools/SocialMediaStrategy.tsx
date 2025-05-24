import React, { useState } from 'react';
import { BarChart3, ArrowRight, Loader2, DownloadIcon, RefreshCw, Save } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const SocialMediaStrategy = () => {
  // Form states
  const [businessName, setBusinessName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [goals, setGoals] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('');
  const [currentStrategy, setCurrentStrategy] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<SocialMediaStrategyPlan | null>(null);

  // Interface for strategy plan
  interface SocialMediaStrategyPlan {
    overview: string;
    platforms: PlatformStrategy[];
    contentIdeas: string[];
    postingSchedule: ScheduleItem[];
    kpis: string[];
    toolRecommendations: string[];
  }

  interface PlatformStrategy {
    platform: string;
    strategy: string;
    contentTypes: string[];
    frequency: string;
    audienceInsights: string;
  }

  interface ScheduleItem {
    day: string;
    platforms: string[];
    contentTypes: string[];
    bestTimes: string[];
  }

  // Available options
  const platformOptions = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'pinterest', label: 'Pinterest' }
  ];

  const goalOptions = [
    { id: 'brand_awareness', label: 'Brand Awareness' },
    { id: 'lead_generation', label: 'Lead Generation' },
    { id: 'sales', label: 'Sales/Conversions' },
    { id: 'customer_retention', label: 'Customer Retention' },
    { id: 'community_building', label: 'Community Building' },
    { id: 'traffic', label: 'Website Traffic' }
  ];

  const budgetOptions = [
    { value: 'low', label: 'Low (< $500/month)' },
    { value: 'medium', label: 'Medium ($500-$2000/month)' },
    { value: 'high', label: 'High ($2000-$5000/month)' },
    { value: 'enterprise', label: 'Enterprise (> $5000/month)' }
  ];

  // Handle goal selection
  const handleGoalChange = (goalId: string) => {
    setGoals(current => 
      current.includes(goalId) 
        ? current.filter(id => id !== goalId)
        : [...current, goalId]
    );
  };

  // Handle platform selection
  const handlePlatformChange = (platformId: string) => {
    setPlatforms(current => 
      current.includes(platformId) 
        ? current.filter(id => id !== platformId)
        : [...current, platformId]
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate strategy based on inputs
      const strategy = generateMockStrategy();
      setGeneratedStrategy(strategy);
      setLoading(false);
    }, 2000);
  };

  // Generate mock strategy for demonstration
  const generateMockStrategy = (): SocialMediaStrategyPlan => {
    const selectedPlatformNames = platforms.map(p => 
      platformOptions.find(po => po.id === p)?.label || p
    );
    
    const selectedGoalNames = goals.map(g => 
      goalOptions.find(go => go.id === g)?.label || g
    );

    return {
      overview: `Based on your ${industry} business "${businessName}" targeting ${targetAudience}, we've created a strategic social media plan focused on ${selectedGoalNames.join(', ')}. This strategy maximizes your ${budget} budget while optimizing engagement and conversion rates.`,
      platforms: platforms.map(p => {
        const platformName = platformOptions.find(po => po.id === p)?.label || p;
        return {
          platform: platformName,
          strategy: `Build a strong ${platformName} presence by focusing on authentic content that resonates with ${targetAudience}.`,
          contentTypes: getContentTypesForPlatform(p),
          frequency: getFrequencyForPlatform(p),
          audienceInsights: `${targetAudience} on ${platformName} typically engage most with content that is both educational and entertaining.`
        };
      }),
      contentIdeas: [
        `"Day in the life" at ${businessName}`,
        "Customer success stories and testimonials",
        `${industry} tips and tricks`,
        "Behind-the-scenes content",
        "Q&A sessions addressing common questions",
        "Industry news and updates",
        "Product/service demonstrations",
        "User-generated content campaigns"
      ],
      postingSchedule: [
        {
          day: "Monday",
          platforms: platforms.slice(0, 2).map(p => platformOptions.find(po => po.id === p)?.label || p),
          contentTypes: ["Motivational content", "Weekly tips"],
          bestTimes: ["9:00 AM", "5:00 PM"]
        },
        {
          day: "Wednesday",
          platforms: platforms.slice(0, 3).map(p => platformOptions.find(po => po.id === p)?.label || p),
          contentTypes: ["Educational content", "Engagement posts"],
          bestTimes: ["12:00 PM", "6:00 PM"]
        },
        {
          day: "Friday",
          platforms: platforms.slice(0, 2).map(p => platformOptions.find(po => po.id === p)?.label || p),
          contentTypes: ["Fun/casual content", "Weekend inspiration"],
          bestTimes: ["3:00 PM", "7:00 PM"]
        }
      ],
      kpis: [
        "Engagement rate (likes, comments, shares)",
        "Follower growth rate",
        "Click-through rate to website",
        "Conversion rate from social traffic",
        "Share of voice compared to competitors",
        "Social media ROI"
      ],
      toolRecommendations: [
        "Buffer or Hootsuite for scheduling",
        "Canva for graphic design",
        "Later for Instagram planning",
        "Mentionlytics for social listening",
        "Google Analytics for tracking website traffic from social"
      ]
    };
  };

  // Helper function to get content types based on platform
  const getContentTypesForPlatform = (platformId: string): string[] => {
    switch(platformId) {
      case 'instagram':
        return ["Reels", "Carousel posts", "Stories", "IGTV"];
      case 'facebook':
        return ["Videos", "Text posts", "Live streams", "Events"];
      case 'twitter':
        return ["Polls", "Text posts", "GIFs", "Thread stories"];
      case 'linkedin':
        return ["Articles", "Professional updates", "Industry insights", "Company news"];
      case 'tiktok':
        return ["Trending content", "Challenges", "Educational videos", "Behind-the-scenes"];
      case 'youtube':
        return ["Tutorials", "Vlogs", "Interviews", "Product reviews"];
      case 'pinterest':
        return ["Infographics", "Product pins", "Step-by-step guides", "Inspiration boards"];
      default:
        return ["Photos", "Videos", "Text content"];
    }
  };

  // Helper function to get posting frequency based on platform
  const getFrequencyForPlatform = (platformId: string): string => {
    switch(platformId) {
      case 'instagram':
        return "3-4 posts per week, daily stories";
      case 'facebook':
        return "4-5 posts per week";
      case 'twitter':
        return "Daily, 2-3 tweets per day";
      case 'linkedin':
        return "2-3 posts per week";
      case 'tiktok':
        return "Daily if possible, minimum 3x per week";
      case 'youtube':
        return "1-2 videos per week";
      case 'pinterest':
        return "5-10 pins per day";
      default:
        return "3-4 posts per week";
    }
  };

  // Export to PDF functionality (mock)
  const exportStrategy = () => {
    alert("Export functionality would generate a PDF of your social media strategy plan.");
  };

  return (
    <ToolLayout
      title="Social Media Strategy Creator"
      description="Create a customized social media strategy for your business goals and target audience."
      icon={<BarChart3 className="h-6 w-6 text-blue-500" />}
      helpText="Fill in the form with your business details, target audience, and goals to generate a tailored social media strategy."
    >
      <Tabs defaultValue="create">
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create Strategy</TabsTrigger>
          <TabsTrigger value="results" disabled={!generatedStrategy}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input 
                    id="business-name"
                    placeholder="Your business name" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry"
                    placeholder="E.g., Retail, SaaS, Healthcare" 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Textarea 
                    id="target-audience"
                    placeholder="Describe your ideal customer (age, interests, pain points)"
                    value={targetAudience} 
                    onChange={(e) => setTargetAudience(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget">Marketing Budget</Label>
                  <Select onValueChange={setBudget} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map(option => (
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
                  <Label className="mb-2 block">Business Goals (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {goalOptions.map(goal => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`goal-${goal.id}`} 
                          checked={goals.includes(goal.id)}
                          onCheckedChange={() => handleGoalChange(goal.id)} 
                        />
                        <Label htmlFor={`goal-${goal.id}`} className="cursor-pointer">
                          {goal.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Target Platforms (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {platformOptions.map(platform => (
                      <div key={platform.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`platform-${platform.id}`} 
                          checked={platforms.includes(platform.id)}
                          onCheckedChange={() => handlePlatformChange(platform.id)} 
                        />
                        <Label htmlFor={`platform-${platform.id}`} className="cursor-pointer">
                          {platform.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="current-strategy">Current Strategy (Optional)</Label>
                  <Textarea 
                    id="current-strategy"
                    placeholder="Briefly describe what you're currently doing on social media"
                    value={currentStrategy} 
                    onChange={(e) => setCurrentStrategy(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex justify-center">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={loading || !businessName || !industry || !targetAudience || goals.length === 0 || platforms.length === 0 || !budget}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    Generate Social Media Strategy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="results">
          {generatedStrategy && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Social Media Strategy</h2>
                <p className="text-gray-700">{generatedStrategy.overview}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Platform Strategies</h3>
                <div className="grid grid-cols-1 gap-4">
                  {generatedStrategy.platforms.map((platform, index) => (
                    <Card key={index} className="border-blue-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-3">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{platform.platform}</Badge>
                          <h4 className="font-semibold ml-2">{platform.strategy}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Content Types</p>
                            <ul className="list-disc pl-5 text-sm">
                              {platform.contentTypes.map((type, i) => (
                                <li key={i}>{type}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Posting Frequency</p>
                            <p className="text-sm">{platform.frequency}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Audience Insights</p>
                            <p className="text-sm">{platform.audienceInsights}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Content Ideas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedStrategy.contentIdeas.map((idea, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <p>{idea}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Posting Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platforms</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Types</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Times</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {generatedStrategy.postingSchedule.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.day}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.platforms.join(', ')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.contentTypes.join(', ')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bestTimes.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Performance Indicators</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {generatedStrategy.kpis.map((kpi, index) => (
                      <li key={index}>{kpi}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Recommended Tools</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {generatedStrategy.toolRecommendations.map((tool, index) => (
                      <li key={index}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setGeneratedStrategy(null)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Create New Strategy
                </Button>
                
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={exportStrategy}
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
                
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Strategy
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default SocialMediaStrategy; 