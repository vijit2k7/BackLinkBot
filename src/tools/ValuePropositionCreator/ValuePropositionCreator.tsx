import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Trash2, RefreshCw, Copy, Download, Check, X, PenTool, Target, Heart, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import ToolLayout from '../components/ToolLayout';
import { 
  CustomerProfile, 
  ValueMap, 
  FormInputs, 
  ValueProposition 
} from './types';
import { 
  industries, 
  generateValueProposition, 
  getExampleData
} from './utils';

const ValuePropositionCreator: React.FC = () => {
  // Default customer profile
  const defaultCustomerProfile: CustomerProfile = {
    pains: [''],
    gains: [''],
    jobs: ['']
  };
  
  // Default value map
  const defaultValueMap: ValueMap = {
    painRelievers: [''],
    gainCreators: [''],
    products: ['']
  };
  
  // Default form inputs
  const defaultInputs: FormInputs = {
    businessName: '',
    industry: '',
    targetAudience: '',
    uniqueFeatures: [''],
    competitorWeaknesses: [''],
    customerProfile: defaultCustomerProfile,
    valueMap: defaultValueMap
  };
  
  // State
  const [inputs, setInputs] = useState<FormInputs>(defaultInputs);
  const [activeTab, setActiveTab] = useState<string>('info');
  const [valueProposition, setValueProposition] = useState<ValueProposition | null>(null);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  
  // Handle basic input change
  const handleInputChange = (field: keyof FormInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle change of items in array fields
  const handleArrayItemChange = (
    field: 'uniqueFeatures' | 'competitorWeaknesses',
    index: number,
    value: string
  ) => {
    setInputs(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };
  
  // Add item to array fields
  const handleAddArrayItem = (field: 'uniqueFeatures' | 'competitorWeaknesses') => {
    setInputs(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  // Remove item from array fields
  const handleRemoveArrayItem = (
    field: 'uniqueFeatures' | 'competitorWeaknesses',
    index: number
  ) => {
    setInputs(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      // Ensure there's always at least one empty item
      if (newArray.length === 0) {
        newArray.push('');
      }
      return {
        ...prev,
        [field]: newArray
      };
    });
  };
  
  // Handle customer profile field change
  const handleProfileChange = (
    field: keyof CustomerProfile,
    index: number,
    value: string
  ) => {
    setInputs(prev => {
      const newProfile = { ...prev.customerProfile };
      const newArray = [...newProfile[field]];
      newArray[index] = value;
      newProfile[field] = newArray;
      
      return {
        ...prev,
        customerProfile: newProfile
      };
    });
  };
  
  // Add item to customer profile fields
  const handleAddProfileItem = (field: keyof CustomerProfile) => {
    setInputs(prev => {
      const newProfile = { ...prev.customerProfile };
      newProfile[field] = [...newProfile[field], ''];
      
      return {
        ...prev,
        customerProfile: newProfile
      };
    });
  };
  
  // Remove item from customer profile fields
  const handleRemoveProfileItem = (field: keyof CustomerProfile, index: number) => {
    setInputs(prev => {
      const newProfile = { ...prev.customerProfile };
      // Ensure there's always at least one empty item
      if (newProfile[field].length > 1) {
        newProfile[field] = newProfile[field].filter((_, i) => i !== index);
      } else {
        newProfile[field] = [''];
      }
      
      return {
        ...prev,
        customerProfile: newProfile
      };
    });
  };
  
  // Handle value map field change
  const handleValueMapChange = (
    field: keyof ValueMap,
    index: number,
    value: string
  ) => {
    setInputs(prev => {
      const newValueMap = { ...prev.valueMap };
      const newArray = [...newValueMap[field]];
      newArray[index] = value;
      newValueMap[field] = newArray;
      
      return {
        ...prev,
        valueMap: newValueMap
      };
    });
  };
  
  // Add item to value map fields
  const handleAddValueMapItem = (field: keyof ValueMap) => {
    setInputs(prev => {
      const newValueMap = { ...prev.valueMap };
      newValueMap[field] = [...newValueMap[field], ''];
      
      return {
        ...prev,
        valueMap: newValueMap
      };
    });
  };
  
  // Remove item from value map fields
  const handleRemoveValueMapItem = (field: keyof ValueMap, index: number) => {
    setInputs(prev => {
      const newValueMap = { ...prev.valueMap };
      // Ensure there's always at least one empty item
      if (newValueMap[field].length > 1) {
        newValueMap[field] = newValueMap[field].filter((_, i) => i !== index);
      } else {
        newValueMap[field] = [''];
      }
      
      return {
        ...prev,
        valueMap: newValueMap
      };
    });
  };
  
  // Load example data for the selected industry
  const loadExamples = () => {
    if (!inputs.industry) {
      toast({
        title: 'Industry not selected',
        description: 'Please select an industry to load examples.',
        variant: 'destructive',
      });
      return;
    }
    
    const examples = getExampleData(inputs.industry);
    
    setInputs(prev => ({
      ...prev,
      customerProfile: {
        jobs: examples.jobs,
        pains: examples.pains,
        gains: examples.gains
      },
      valueMap: {
        painRelievers: examples.painRelievers,
        gainCreators: examples.gainCreators,
        products: prev.valueMap.products // Keep existing products
      }
    }));
    
    toast({
      title: 'Examples loaded',
      description: `Example data for ${inputs.industry} has been loaded.`,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!inputs.businessName.trim()) {
      toast({
        title: 'Business name required',
        description: 'Please enter your business name.',
        variant: 'destructive',
      });
      return;
    }
    
    // Generate value proposition
    const result = generateValueProposition(inputs);
    setValueProposition(result);
    
    // Switch to results tab
    setActiveTab('result');
    
    toast({
      title: 'Value proposition created',
      description: 'Your value proposition has been generated successfully.',
    });
  };
  
  // Regenerate value proposition
  const handleRegenerate = () => {
    if (!inputs.businessName.trim()) return;
    
    setRegenerating(true);
    
    // Simulate a delay
    setTimeout(() => {
      const result = generateValueProposition(inputs);
      setValueProposition(result);
      setRegenerating(false);
      
      toast({
        title: 'Value proposition regenerated',
        description: 'A new variation of your value proposition has been created.',
      });
    }, 500);
  };
  
  // Copy value proposition to clipboard
  const handleCopyFullProposition = () => {
    if (!valueProposition) return;
    
    const text = `
# ${valueProposition.headline}

${valueProposition.subheadline}

## Value Statement
${valueProposition.valueStatement}

## For Our Target Audience
${valueProposition.targetAudienceStatement}

## The Problem
${valueProposition.problemStatement}

## Our Solution
${valueProposition.solutionStatement}

## What Makes Us Different
${valueProposition.differentiatorStatement}

## Key Benefits
${valueProposition.keyBenefits.map(benefit => `- ${benefit}`).join('\n')}

## Next Steps
${valueProposition.callToAction}
    `.trim();
    
    navigator.clipboard.writeText(text);
    
    toast({
      title: 'Copied to clipboard',
      description: 'The complete value proposition has been copied to your clipboard.',
    });
  };
  
  // Copy a specific section to clipboard
  const handleCopySection = (section: keyof ValueProposition, label: string) => {
    if (!valueProposition) return;
    
    // Handle array for keyBenefits
    const text = Array.isArray(valueProposition[section])
      ? (valueProposition[section] as string[]).map(item => `- ${item}`).join('\n')
      : valueProposition[section] as string;
    
    navigator.clipboard.writeText(text);
    
    toast({
      title: 'Copied to clipboard',
      description: `${label} has been copied to your clipboard.`,
    });
  };
  
  // Download as text file
  const handleDownload = () => {
    if (!valueProposition) return;
    
    const text = `
# VALUE PROPOSITION: ${inputs.businessName.toUpperCase()}

## HEADLINE
${valueProposition.headline}

## SUBHEADLINE
${valueProposition.subheadline}

## VALUE STATEMENT
${valueProposition.valueStatement}

## TARGET AUDIENCE
${valueProposition.targetAudienceStatement}

## PROBLEM STATEMENT
${valueProposition.problemStatement}

## SOLUTION STATEMENT
${valueProposition.solutionStatement}

## DIFFERENTIATOR
${valueProposition.differentiatorStatement}

## KEY BENEFITS
${valueProposition.keyBenefits.map(benefit => `- ${benefit}`).join('\n')}

## CALL TO ACTION
${valueProposition.callToAction}

---
Generated with Value Proposition Creator
    `.trim();
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${inputs.businessName.replace(/\s+/g, '_')}_value_proposition.txt`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Value proposition downloaded',
      description: 'Your value proposition has been downloaded as a text file.',
    });
  };
  
  // Listen for industry change to update examples
  useEffect(() => {
    // Optionally auto-load examples when industry changes
    // (commented out to let users explicitly load examples)
    // if (inputs.industry) {
    //   loadExamples();
    // }
  }, [inputs.industry]);
  
  // Render array input fields with add/remove buttons
  const renderArrayInputs = (
    field: 'uniqueFeatures' | 'competitorWeaknesses',
    label: string,
    placeholder: string
  ) => {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {inputs[field].map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => handleArrayItemChange(field, index, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveArrayItem(field, index)}
              disabled={inputs[field].length === 1 && !item}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddArrayItem(field)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {label.replace(/s$/, '')}
        </Button>
      </div>
    );
  };
  
  // Render customer profile inputs
  const renderProfileInputs = (
    field: keyof CustomerProfile,
    label: string,
    placeholder: string,
    icon: React.ReactNode
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          {icon}
          <Label className="ml-2">{label}</Label>
        </div>
        {inputs.customerProfile[field].map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => handleProfileChange(field, index, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveProfileItem(field, index)}
              disabled={inputs.customerProfile[field].length === 1 && !item}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddProfileItem(field)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {label.replace(/s$/, '')}
        </Button>
      </div>
    );
  };
  
  // Render value map inputs
  const renderValueMapInputs = (
    field: keyof ValueMap,
    label: string,
    placeholder: string,
    icon: React.ReactNode
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          {icon}
          <Label className="ml-2">{label}</Label>
        </div>
        {inputs.valueMap[field].map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => handleValueMapChange(field, index, e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveValueMapItem(field, index)}
              disabled={inputs.valueMap[field].length === 1 && !item}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddValueMapItem(field)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {label.replace(/s$/, '')}
        </Button>
      </div>
    );
  };
  
  return (
    <ToolLayout
      title="Value Proposition Creator"
      description="Build a compelling value proposition for your business, product, or service"
      icon={<Lightbulb className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="info" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="customer">Customer Profile</TabsTrigger>
          <TabsTrigger value="value">Value Map</TabsTrigger>
          <TabsTrigger value="result" disabled={!valueProposition}>Result</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Enter basic information about your business and offerings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business or Product Name</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Acme Solutions"
                  value={inputs.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={inputs.industry}
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadExamples}
                    disabled={!inputs.industry}
                  >
                    Load Industry Examples
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small business owners, IT managers"
                  value={inputs.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                />
              </div>
              
              {renderArrayInputs(
                'uniqueFeatures',
                'Unique Features / Strengths',
                'e.g., AI-powered automation, 24/7 customer support'
              )}
              
              {renderArrayInputs(
                'competitorWeaknesses',
                'Competitor Weaknesses',
                'e.g., Complex pricing, poor customer service'
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => setActiveTab('customer')}>
                  Next: Customer Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Value Proposition Canvas Overview</CardTitle>
              <CardDescription>
                Understanding the key components of a strong value proposition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="text-lg font-medium">Customer Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Understanding your customers' needs, wants, and pain points
                    </p>
                    <ul className="space-y-1 text-sm pl-5 list-disc">
                      <li>Customer Jobs: What tasks are they trying to complete?</li>
                      <li>Pains: What frustrations or challenges do they face?</li>
                      <li>Gains: What positive outcomes do they want to achieve?</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="text-lg font-medium">Value Map</h3>
                    <p className="text-sm text-muted-foreground">
                      How your offerings create value for customers
                    </p>
                    <ul className="space-y-1 text-sm pl-5 list-disc">
                      <li>Products & Services: What you offer to customers</li>
                      <li>Pain Relievers: How you solve customer problems</li>
                      <li>Gain Creators: How you help customers achieve gains</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    A strong value proposition emerges when there's a clear match between what your customers need and what your business delivers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customer Profile Tab */}
        <TabsContent value="customer" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Profile</CardTitle>
              <CardDescription>
                Understand your target customers' needs, challenges, and desired outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderProfileInputs(
                'jobs',
                'Customer Jobs',
                'e.g., Increase team productivity',
                <Target className="h-5 w-5 text-blue-500" />
              )}
              
              {renderProfileInputs(
                'pains',
                'Customer Pains',
                'e.g., Time-consuming manual processes',
                <X className="h-5 w-5 text-red-500" />
              )}
              
              {renderProfileInputs(
                'gains',
                'Customer Gains',
                'e.g., Reduce operational costs',
                <Heart className="h-5 w-5 text-green-500" />
              )}
              
              <div className="flex justify-between space-x-2 pt-4">
                <Button variant="outline" onClick={() => setActiveTab('info')}>
                  Previous: Basic Info
                </Button>
                <Button onClick={() => setActiveTab('value')}>
                  Next: Value Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Value Map Tab */}
        <TabsContent value="value" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Value Map</CardTitle>
              <CardDescription>
                Describe how your products and services create value for customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderValueMapInputs(
                'products',
                'Products & Services',
                'e.g., Cloud-based project management software',
                <PenTool className="h-5 w-5 text-purple-500" />
              )}
              
              {renderValueMapInputs(
                'painRelievers',
                'Pain Relievers',
                'e.g., Automated reporting to save time',
                <Zap className="h-5 w-5 text-amber-500" />
              )}
              
              {renderValueMapInputs(
                'gainCreators',
                'Gain Creators',
                'e.g., Real-time collaboration features',
                <Sparkles className="h-5 w-5 text-blue-500" />
              )}
              
              <div className="flex justify-between space-x-2 pt-4">
                <Button variant="outline" onClick={() => setActiveTab('customer')}>
                  Previous: Customer Profile
                </Button>
                <Button onClick={handleSubmit}>
                  Generate Value Proposition
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Result Tab */}
        <TabsContent value="result" className="space-y-6 mt-4">
          {valueProposition && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Your Value Proposition
                </h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleRegenerate}
                    disabled={regenerating}
                  >
                    {regenerating ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyFullProposition}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              
              {/* Headline & Subheadline */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold">
                        {valueProposition.headline}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('headline', 'Headline')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-lg text-muted-foreground">
                        {valueProposition.subheadline}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('subheadline', 'Subheadline')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Main Value Proposition Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Value Statement */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">Value Statement</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('valueStatement', 'Value Statement')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{valueProposition.valueStatement}</p>
                  </CardContent>
                </Card>
                
                {/* Target Audience */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">Target Audience</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('targetAudienceStatement', 'Target Audience Statement')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{valueProposition.targetAudienceStatement}</p>
                  </CardContent>
                </Card>
                
                {/* Problem Statement */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">Problem Statement</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('problemStatement', 'Problem Statement')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{valueProposition.problemStatement}</p>
                  </CardContent>
                </Card>
                
                {/* Solution Statement */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">Solution Statement</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('solutionStatement', 'Solution Statement')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{valueProposition.solutionStatement}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Key Benefits */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Key Benefits</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopySection('keyBenefits', 'Key Benefits')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {valueProposition.keyBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Differentiator & Call to Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Differentiator */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">What Makes Us Different</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('differentiatorStatement', 'Differentiator Statement')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{valueProposition.differentiatorStatement}</p>
                  </CardContent>
                </Card>
                
                {/* Call to Action */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">Call to Action</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySection('callToAction', 'Call to Action')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{valueProposition.callToAction}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* How to Use This Value Proposition */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Use Your Value Proposition</CardTitle>
                  <CardDescription>
                    Tips for implementing your value proposition across different channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Website</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Use the headline on your homepage</li>
                        <li>• Feature key benefits in product sections</li>
                        <li>• Include the call to action on landing pages</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Marketing Materials</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Include key points in brochures and flyers</li>
                        <li>• Use the value statement in presentations</li>
                        <li>• Adapt benefits for different audience segments</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Sales Conversations</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Start with the problem statement</li>
                        <li>• Follow with your unique solution</li>
                        <li>• Emphasize differentiators with prospects</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Email Campaigns</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Use the headline as email subject lines</li>
                        <li>• Break down benefits into a series of emails</li>
                        <li>• End each email with your call to action</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Social Media</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Share individual benefits as separate posts</li>
                        <li>• Create visual content based on key points</li>
                        <li>• Use the value statement in your profile</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Internal Communications</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Share with employees to align messaging</li>
                        <li>• Use in onboarding materials for new hires</li>
                        <li>• Incorporate into company mission statements</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default ValuePropositionCreator; 