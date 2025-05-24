import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Loader2, DownloadIcon, RefreshCw } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
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

const BusinessIdeaGenerator = () => {
  // Form states
  const [industry, setIndustry] = useState<string>('');
  const [interestArea, setInterestArea] = useState<string>('');
  const [budget, setBudget] = useState<number[]>([5000]);
  const [businessType, setBusinessType] = useState<string>('');
  const [trendFocus, setTrendFocus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<BusinessIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);

  // Interface for business idea
  interface BusinessIdea {
    id: string;
    title: string;
    description: string;
    investment: string;
    targetAudience: string;
    potentialChallenges: string[];
    keyBenefits: string[];
    isSaved?: boolean;
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate business ideas based on inputs
      const ideas = generateMockBusinessIdeas();
      setGeneratedIdeas(ideas);
      setLoading(false);
    }, 1500);
  };

  // This function mocks an AI response with business ideas
  const generateMockBusinessIdeas = (): BusinessIdea[] => {
    // These would normally come from an AI service like OpenAI
    const mockIdeas: BusinessIdea[] = [
      {
        id: `idea-${Date.now()}-1`,
        title: `${industry} Subscription Box Service`,
        description: `A curated monthly subscription box service focused on ${interestArea} within the ${industry} industry. Each box contains hand-picked products, exclusive content, and early access to new ${industry} innovations.`,
        investment: budget[0] < 3000 ? 'Low' : budget[0] < 7000 ? 'Medium' : 'High',
        targetAudience: `${industry} enthusiasts, professionals, and hobbyists interested in ${interestArea}`,
        potentialChallenges: [
          'Supply chain management', 
          'Subscription retention', 
          'Curating unique offerings each month'
        ],
        keyBenefits: [
          'Recurring revenue model', 
          'Strong community building potential', 
          'Opportunities for brand partnerships'
        ],
        isSaved: false
      },
      {
        id: `idea-${Date.now()}-2`,
        title: `Mobile ${interestArea} Consulting`,
        description: `A specialized on-demand consulting service that brings ${interestArea} expertise directly to clients. Using a mobile app, clients can book consultations, get personalized advice, and implement solutions related to ${industry}.`,
        investment: budget[0] < 5000 ? 'Low to Medium' : 'Medium to High',
        targetAudience: `Small businesses and individuals seeking expertise in ${industry} without hiring full-time specialists`,
        potentialChallenges: [
          'Building a network of qualified consultants', 
          'Developing a reliable booking platform', 
          'Ensuring consistent service quality'
        ],
        keyBenefits: [
          'Low overhead costs', 
          'Scalable business model', 
          'Ability to operate virtually or in-person'
        ],
        isSaved: false
      },
      {
        id: `idea-${Date.now()}-3`,
        title: `${industry} Educational Platform`,
        description: `An online learning platform specifically designed for ${interestArea} education within the ${industry} sector. Courses range from beginner to expert levels, featuring certifications, community forums, and practical projects.`,
        investment: budget[0] < 6000 ? 'Medium' : 'High',
        targetAudience: `Students, career changers, and professionals looking to advance their skills in ${industry}`,
        potentialChallenges: [
          'Content creation and maintenance', 
          'Standing out in the educational market', 
          'Building credibility and partnerships'
        ],
        keyBenefits: [
          'Multiple revenue streams (subscriptions, one-time purchases, enterprise plans)', 
          'High scalability potential', 
          'Opportunity to become an industry authority'
        ],
        isSaved: false
      },
    ];
    
    return mockIdeas;
  };

  // Toggle saving an idea
  const toggleSaveIdea = (ideaId: string) => {
    const updatedIdeas = generatedIdeas.map(idea => {
      if (idea.id === ideaId) {
        const updatedIdea = {...idea, isSaved: !idea.isSaved};
        
        // If saving, add to saved ideas
        if (updatedIdea.isSaved && !savedIdeas.some(saved => saved.id === ideaId)) {
          setSavedIdeas([...savedIdeas, updatedIdea]);
        } 
        // If unsaving, remove from saved ideas
        else if (!updatedIdea.isSaved) {
          setSavedIdeas(savedIdeas.filter(saved => saved.id !== ideaId));
        }
        
        return updatedIdea;
      }
      return idea;
    });
    
    setGeneratedIdeas(updatedIdeas);
  };

  // Clear all generated ideas
  const clearIdeas = () => {
    setGeneratedIdeas([]);
  };

  // Export ideas as PDF or text (mock functionality)
  const exportIdeas = () => {
    alert('Export functionality would save these ideas as PDF or text file');
    // In a real implementation, this would generate and download a file
  };

  // Idea card component
  const IdeaCard = ({ idea }: { idea: BusinessIdea }) => (
    <Card className="mb-6 hover:shadow-md transition-all">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{idea.title}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleSaveIdea(idea.id)}
            className={idea.isSaved ? "text-yellow-500" : "text-gray-400"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={idea.isSaved ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </Button>
        </div>
        
        <p className="text-gray-700 mb-4">{idea.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Investment Level</p>
            <p className="text-gray-800">{idea.investment}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Target Audience</p>
            <p className="text-gray-800">{idea.targetAudience}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Key Benefits</p>
          <div className="flex flex-wrap gap-2">
            {idea.keyBenefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Potential Challenges</p>
          <div className="flex flex-wrap gap-2">
            {idea.potentialChallenges.map((challenge, index) => (
              <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-100">
                {challenge}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ToolLayout
      title="Business Idea Generator"
      description="Generate innovative business ideas based on your interests, industry, and investment level."
      icon={<Lightbulb className="h-8 w-8 text-amber-500" />}
      helpText="Enter your preferences and click 'Generate Ideas' to receive customized business suggestions. Save ideas you like and export them for future reference."
    >
      <Tabs defaultValue="generate">
        <TabsList className="mb-6">
          <TabsTrigger value="generate">Generate Ideas</TabsTrigger>
          <TabsTrigger value="saved">Saved Ideas ({savedIdeas.length})</TabsTrigger>
        </TabsList>
      
        <TabsContent value="generate">
          {generatedIdeas.length === 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <Select 
                    onValueChange={setIndustry} 
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area of Interest
                  </label>
                  <Input 
                    placeholder="e.g., mobile apps, vegan food, financial literacy" 
                    value={interestArea}
                    onChange={(e) => setInterestArea(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <Select onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product-based</SelectItem>
                      <SelectItem value="service">Service-based</SelectItem>
                      <SelectItem value="online">Online/Digital</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="any">Any type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Trends
                  </label>
                  <Select onValueChange={setTrendFocus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trend focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">Artificial Intelligence</SelectItem>
                      <SelectItem value="remote">Remote Work</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="personalization">Personalization</SelectItem>
                      <SelectItem value="subscription">Subscription Economy</SelectItem>
                      <SelectItem value="any">No specific trend focus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Investment Level (up to ${budget[0]})
                </label>
                <Slider
                  defaultValue={[5000]}
                  max={20000}
                  step={500}
                  onValueChange={setBudget}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>$0</span>
                  <span>${budget[0].toLocaleString()}</span>
                  <span>$20,000+</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <Textarea 
                  placeholder="Any specific requirements or preferences for your business idea..."
                  rows={3}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Ideas...
                  </>
                ) : (
                  <>
                    Generate Ideas <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Generated Business Ideas</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearIdeas}>
                    <RefreshCw className="h-4 w-4 mr-1" /> New Ideas
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportIdeas}>
                    <DownloadIcon className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {generatedIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          {savedIdeas.length > 0 ? (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Your Saved Ideas</h3>
                <Button variant="outline" size="sm" onClick={exportIdeas}>
                  <DownloadIcon className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
              
              <div className="space-y-4">
                {savedIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Saved Ideas Yet</h3>
              <p className="text-gray-500 mb-6">Generate and save business ideas to review them later.</p>
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
                Generate New Ideas
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default BusinessIdeaGenerator; 