import React, { useState, useEffect } from 'react';
import { Copy, Timer, Save, Zap, RefreshCw, Download, Twitter, Linkedin, MessageSquare } from 'lucide-react';

import { PitchInput, GeneratedPitch } from './types';
import { industryTypes, pitchTemplates, generatePitchVariations } from './utils';

import ToolLayout from '../components/ToolLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const ElevatorPitchCreator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState(pitchTemplates[0].id);
  const [generatedPitches, setGeneratedPitches] = useState<GeneratedPitch[]>([]);
  const [savedPitches, setSavedPitches] = useState<GeneratedPitch[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form inputs
  const [formInputs, setFormInputs] = useState<PitchInput>({
    businessName: '',
    industryType: '',
    targetAudience: '',
    mainProblem: '',
    solution: '',
    keyBenefits: [''],
    uniqueSellingPoints: [''],
    callToAction: '',
  });
  
  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle array input changes
  const handleArrayInputChange = (index: number, value: string, field: 'keyBenefits' | 'uniqueSellingPoints') => {
    setFormInputs((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  // Add new item to array fields
  const addArrayItem = (field: 'keyBenefits' | 'uniqueSellingPoints') => {
    setFormInputs((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (index: number, field: 'keyBenefits' | 'uniqueSellingPoints') => {
    setFormInputs((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray.length > 0 ? newArray : [''],
      };
    });
  };

  // Handle template selection
  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
  };

  // Generate pitches
  const handleGeneratePitch = () => {
    // Validate required fields
    if (!formInputs.businessName || !formInputs.targetAudience || !formInputs.solution) {
      toast({
        title: "Missing information",
        description: "Please fill in at least your business name, target audience, and solution.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation delay for UI feedback
    setTimeout(() => {
      const pitches = generatePitchVariations(formInputs);
      setGeneratedPitches(pitches);
      setIsGenerating(false);
      setActiveTab('results');
    }, 1500);
  };

  // Copy pitch to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Elevator pitch copied to clipboard successfully",
    });
  };

  // Save pitch
  const savePitch = (pitch: GeneratedPitch) => {
    if (!savedPitches.some(p => p.content === pitch.content)) {
      setSavedPitches(prev => [...prev, pitch]);
      toast({
        title: "Pitch saved",
        description: "Elevator pitch saved to your collection",
      });
    } else {
      toast({
        title: "Already saved",
        description: "This pitch is already in your saved collection",
      });
    }
  };

  // Remove saved pitch
  const removeSavedPitch = (index: number) => {
    setSavedPitches(prev => prev.filter((_, i) => i !== index));
    toast({
      description: "Pitch removed from your collection",
    });
  };

  // Share on social media
  const shareOnSocial = (platform: 'twitter' | 'linkedin', pitch: string) => {
    let url = '';
    const text = encodeURIComponent(pitch);
    
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=https://backlinkbot.com&summary=${text}`;
    }
    
    window.open(url, '_blank');
  };

  // Generate examples to show in the UI
  const generateExample = () => {
    const template = pitchTemplates.find(t => t.id === selectedTemplate);
    return template?.example || '';
  };

  return (
    <ToolLayout 
      title="Elevator Pitch Creator" 
      description="Create a compelling elevator pitch that clearly communicates your business value proposition in 30-60 seconds."
      icon={<MessageSquare className="h-8 w-8 text-cyan-500" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* CREATE TAB */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Elevator Pitch</CardTitle>
              <CardDescription>
                Fill in the information below to generate a compelling elevator pitch for your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="Your business name"
                      value={formInputs.businessName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industryType">Industry</Label>
                    <Select 
                      name="industryType" 
                      value={formInputs.industryType}
                      onValueChange={(value) => setFormInputs(prev => ({ ...prev, industryType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryTypes.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    name="targetAudience"
                    placeholder="Who is your ideal customer? (e.g., small business owners, marketing managers)"
                    value={formInputs.targetAudience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Problem and Solution */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Problem & Solution</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="mainProblem">The Problem You Solve</Label>
                  <Textarea
                    id="mainProblem"
                    name="mainProblem"
                    placeholder="What problem does your business solve for customers?"
                    value={formInputs.mainProblem}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="solution">Your Solution *</Label>
                  <Textarea
                    id="solution"
                    name="solution"
                    placeholder="How does your product or service solve this problem?"
                    value={formInputs.solution}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Benefits and USPs */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Benefits & Unique Selling Points</h3>
                
                <div className="space-y-3">
                  <Label>Key Benefits</Label>
                  {formInputs.keyBenefits.map((benefit, index) => (
                    <div key={`benefit-${index}`} className="flex gap-2">
                      <Input
                        placeholder={`Benefit ${index + 1} (e.g., increase sales by 30%)`}
                        value={benefit}
                        onChange={(e) => handleArrayInputChange(index, e.target.value, 'keyBenefits')}
                      />
                      {formInputs.keyBenefits.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeArrayItem(index, 'keyBenefits')}
                        >
                          -
                        </Button>
                      )}
                      {index === formInputs.keyBenefits.length - 1 && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => addArrayItem('keyBenefits')}
                        >
                          +
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <Label>Unique Selling Points</Label>
                  {formInputs.uniqueSellingPoints.map((usp, index) => (
                    <div key={`usp-${index}`} className="flex gap-2">
                      <Input
                        placeholder={`USP ${index + 1} (e.g., proprietary technology, 24/7 support)`}
                        value={usp}
                        onChange={(e) => handleArrayInputChange(index, e.target.value, 'uniqueSellingPoints')}
                      />
                      {formInputs.uniqueSellingPoints.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeArrayItem(index, 'uniqueSellingPoints')}
                        >
                          -
                        </Button>
                      )}
                      {index === formInputs.uniqueSellingPoints.length - 1 && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => addArrayItem('uniqueSellingPoints')}
                        >
                          +
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Call to Action and Template */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Input
                    id="callToAction"
                    name="callToAction"
                    placeholder="What do you want people to do? (e.g., Would you like to schedule a demo?)"
                    value={formInputs.callToAction}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Pitch Template Style</Label>
                  <div className="grid gap-2 md:grid-cols-3 sm:grid-cols-2">
                    {pitchTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer hover:bg-slate-50 transition ${selectedTemplate === template.id ? 'border-2 border-primary' : ''}`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-3 pb-3 pt-0">
                          <p className="text-xs text-muted-foreground">
                            {template.structure.split('\n')[0]}...
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="example">
                    <AccordionTrigger>View Example</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground p-3 bg-slate-50 rounded-md">
                        {generateExample()}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleGeneratePitch}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Elevator Pitch'} 
                {!isGenerating && <Zap className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* RESULTS TAB */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Your Elevator Pitches</CardTitle>
              <CardDescription>
                We've generated elevator pitch variations based on your inputs. Choose the ones you like and save them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="py-8 text-center space-y-4">
                  <Progress value={45} className="max-w-md mx-auto" />
                  <p>Generating your elevator pitches...</p>
                </div>
              ) : generatedPitches.length === 0 ? (
                <div className="py-12 text-center">
                  <h3 className="text-lg font-medium mb-2">No pitches generated yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Fill in your business details in the Create tab and generate your elevator pitch.
                  </p>
                  <Button onClick={() => setActiveTab('create')}>Create Elevator Pitch</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button 
                    variant="outline" 
                    onClick={handleGeneratePitch}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate Pitches
                  </Button>
                  
                  {generatedPitches.map((pitch, index) => (
                    <Card key={`pitch-${index}`} className="relative">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center">
                          {pitch.type}
                          <Badge 
                            variant="outline" 
                            className="ml-2 flex items-center"
                          >
                            <Timer className="h-3 w-3 mr-1" />
                            {pitch.durationSeconds}s
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-line">
                          {pitch.content}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between flex-wrap gap-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(pitch.content)}>
                            <Copy className="h-4 w-4 mr-1" /> Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => savePitch(pitch)}>
                            <Save className="h-4 w-4 mr-1" /> Save
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => shareOnSocial('twitter', pitch.content)}>
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => shareOnSocial('linkedin', pitch.content)}>
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SAVED TAB */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Pitches</CardTitle>
              <CardDescription>
                Access your saved elevator pitches and export them when needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedPitches.length === 0 ? (
                <div className="py-12 text-center">
                  <h3 className="text-lg font-medium mb-2">No saved pitches yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate and save elevator pitches to view them here.
                  </p>
                  <Button onClick={() => setActiveTab('create')}>Create Elevator Pitch</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {savedPitches.map((pitch, index) => (
                      <Card key={`saved-${index}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-md flex items-center">
                              {pitch.type}
                              <Badge 
                                variant="outline" 
                                className="ml-2 flex items-center"
                              >
                                <Timer className="h-3 w-3 mr-1" />
                                {pitch.durationSeconds}s
                              </Badge>
                            </CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeSavedPitch(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm whitespace-pre-line">
                            {pitch.content}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between flex-wrap gap-2">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(pitch.content)}>
                              <Copy className="h-4 w-4 mr-1" /> Copy
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                const blob = new Blob([pitch.content], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `elevator-pitch-${pitch.type.toLowerCase()}.txt`;
                                a.click();
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => shareOnSocial('twitter', pitch.content)}>
                              <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => shareOnSocial('linkedin', pitch.content)}>
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default ElevatorPitchCreator; 