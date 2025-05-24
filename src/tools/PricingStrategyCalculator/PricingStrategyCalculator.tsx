import React, { useState } from 'react';
import { Calculator, DollarSign, PieChart, TrendingUp, Download, Copy, BarChart4, Plus, Trash2, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ToolLayout from '../components/ToolLayout';
import { 
  CostBreakdown, 
  CompetitorPrice, 
  PricingInputs, 
  PricingAnalysis, 
  PricingStrategy 
} from './types';
import { 
  customerSegments, 
  marketPositions, 
  pricingModels, 
  generatePricingAnalysis, 
  formatCurrency, 
  formatPercentage 
} from './utils';

const PricingStrategyCalculator: React.FC = () => {
  // Default cost breakdown
  const defaultCosts: CostBreakdown = {
    materials: 0,
    labor: 0,
    overhead: 0,
    shipping: 0,
    marketing: 0,
    other: 0
  };
  
  // Default inputs
  const defaultInputs: PricingInputs = {
    productName: '',
    costs: defaultCosts,
    targetProfit: 30,
    competitorPrices: [],
    valuePerception: 7,
    priceElasticity: 5,
    customerSegment: 'Consumers',
    marketPosition: 'Mid-market',
    pricingModel: 'One-time Purchase'
  };
  
  // State
  const [inputs, setInputs] = useState<PricingInputs>(defaultInputs);
  const [competitorName, setCompetitorName] = useState<string>('');
  const [competitorPrice, setCompetitorPrice] = useState<string>('');
  const [analysis, setAnalysis] = useState<PricingAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>('inputs');
  
  // Handle text input change
  const handleInputChange = (field: keyof PricingInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle cost input change
  const handleCostChange = (costField: keyof CostBreakdown, value: string) => {
    // Convert to number, default to 0 if not a number
    const numValue = parseFloat(value) || 0;
    
    setInputs(prev => ({
      ...prev,
      costs: {
        ...prev.costs,
        [costField]: numValue
      }
    }));
  };
  
  // Handle slider changes
  const handleSliderChange = (field: 'targetProfit' | 'valuePerception' | 'priceElasticity', value: number[]) => {
    setInputs(prev => ({
      ...prev,
      [field]: value[0]
    }));
  };
  
  // Handle competitor name input
  const handleCompetitorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompetitorName(e.target.value);
  };
  
  // Handle competitor price input
  const handleCompetitorPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompetitorPrice(e.target.value);
  };
  
  // Add competitor
  const handleAddCompetitor = () => {
    // Validate inputs
    if (!competitorName.trim()) {
      toast({
        title: 'Competitor name required',
        description: 'Please enter a name for the competitor.',
        variant: 'destructive',
      });
      return;
    }
    
    const price = parseFloat(competitorPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid price greater than zero.',
        variant: 'destructive',
      });
      return;
    }
    
    // Add competitor
    const newCompetitor: CompetitorPrice = {
      name: competitorName.trim(),
      price
    };
    
    setInputs(prev => ({
      ...prev,
      competitorPrices: [...prev.competitorPrices, newCompetitor]
    }));
    
    // Clear inputs
    setCompetitorName('');
    setCompetitorPrice('');
    
    toast({
      title: 'Competitor added',
      description: `${newCompetitor.name} has been added to your competitor list.`,
    });
  };
  
  // Remove competitor
  const handleRemoveCompetitor = (index: number) => {
    setInputs(prev => ({
      ...prev,
      competitorPrices: prev.competitorPrices.filter((_, i) => i !== index)
    }));
    
    toast({
      title: 'Competitor removed',
      description: 'The competitor has been removed from your list.',
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!inputs.productName.trim()) {
      toast({
        title: 'Product name required',
        description: 'Please enter your product name.',
        variant: 'destructive',
      });
      return;
    }
    
    // Generate pricing analysis
    const pricingAnalysis = generatePricingAnalysis(inputs);
    setAnalysis(pricingAnalysis);
    setActiveTab('results');
    
    toast({
      title: 'Analysis complete',
      description: 'Pricing strategies have been generated for your product.',
    });
  };
  
  // Reset form
  const handleReset = () => {
    setInputs(defaultInputs);
    setCompetitorName('');
    setCompetitorPrice('');
    setAnalysis(null);
    setActiveTab('inputs');
    
    toast({
      title: 'Form reset',
      description: 'The pricing calculator has been reset.',
    });
  };
  
  // Copy pricing strategy to clipboard
  const handleCopyStrategy = (strategy: PricingStrategy) => {
    const text = `
Pricing Strategy: ${strategy.name}
Description: ${strategy.description}
Suggested Price: ${formatCurrency(strategy.suggestedPrice)}
Profit Margin: ${formatPercentage(strategy.profitMargin)}

Pros:
${strategy.pros.map(pro => `- ${pro}`).join('\n')}

Cons:
${strategy.cons.map(con => `- ${con}`).join('\n')}

Recommendation: ${strategy.recommendation}
    `.trim();
    
    navigator.clipboard.writeText(text);
    
    toast({
      title: 'Copied to clipboard',
      description: 'The pricing strategy has been copied to your clipboard.',
    });
  };
  
  // Download pricing analysis as CSV
  const handleDownloadCSV = () => {
    if (!analysis) return;
    
    // Create CSV content
    let csvContent = 'Strategy,Suggested Price,Profit Margin,Recommendation\n';
    
    analysis.recommendedStrategies.forEach(strategy => {
      csvContent += `"${strategy.name}",${strategy.suggestedPrice.toFixed(2)},${(strategy.profitMargin).toFixed(2)}%,"${strategy.recommendation}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${inputs.productName.replace(/\s+/g, '_')}_pricing_strategies.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'CSV downloaded',
      description: 'The pricing analysis has been downloaded as a CSV file.',
    });
  };
  
  // Render strategy card
  const renderStrategyCard = (strategy: PricingStrategy, index: number) => {
    return (
      <Card key={index} className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>{strategy.name}</span>
            {index === 0 && (
              <Badge variant="default" className="ml-2">
                Recommended
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{strategy.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Suggested Price</div>
              <div className="text-2xl font-bold">{formatCurrency(strategy.suggestedPrice)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Profit Margin</div>
              <div className="text-2xl font-bold text-green-600">{formatPercentage(strategy.profitMargin)}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="font-medium mb-1">Pros</div>
              <ul className="text-sm space-y-1">
                {strategy.pros.map((pro, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-medium mb-1">Cons</div>
              <ul className="text-sm space-y-1">
                {strategy.cons.map((con, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-medium mb-1">Recommendation</div>
              <p className="text-sm">{strategy.recommendation}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => handleCopyStrategy(strategy)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Strategy
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <ToolLayout
      title="Pricing Strategy Calculator"
      description="Calculate optimal pricing strategies for your products and services"
      icon={<BarChart4 className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="inputs" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysis}>Results</TabsTrigger>
        </TabsList>
        
        {/* Inputs Tab */}
        <TabsContent value="inputs" className="space-y-4 mt-4">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Basic details about your product or service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Premium SaaS Solution"
                    value={inputs.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerSegment">Target Customer Segment</Label>
                  <Select
                    value={inputs.customerSegment}
                    onValueChange={(value) => handleInputChange('customerSegment', value)}
                  >
                    <SelectTrigger id="customerSegment">
                      <SelectValue placeholder="Select customer segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerSegments.map((segment) => (
                        <SelectItem key={segment} value={segment}>
                          {segment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marketPosition">Market Position</Label>
                    <Select
                      value={inputs.marketPosition}
                      onValueChange={(value) => handleInputChange('marketPosition', value)}
                    >
                      <SelectTrigger id="marketPosition">
                        <SelectValue placeholder="Select market position" />
                      </SelectTrigger>
                      <SelectContent>
                        {marketPositions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricingModel">Pricing Model</Label>
                    <Select
                      value={inputs.pricingModel}
                      onValueChange={(value) => handleInputChange('pricingModel', value)}
                    >
                      <SelectTrigger id="pricingModel">
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                      <SelectContent>
                        {pricingModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Cost Structure */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Cost Structure</CardTitle>
                <CardDescription>
                  Breakdown of costs associated with your product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials/COGS</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="materials"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        placeholder="0.00"
                        value={inputs.costs.materials || ''}
                        onChange={(e) => handleCostChange('materials', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="labor">Labor</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="labor"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        placeholder="0.00"
                        value={inputs.costs.labor || ''}
                        onChange={(e) => handleCostChange('labor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="overhead">Overhead</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="overhead"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        placeholder="0.00"
                        value={inputs.costs.overhead || ''}
                        onChange={(e) => handleCostChange('overhead', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping">Shipping/Fulfillment</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="shipping"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        placeholder="0.00"
                        value={inputs.costs.shipping || ''}
                        onChange={(e) => handleCostChange('shipping', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marketing">Marketing</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="marketing"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        placeholder="0.00"
                        value={inputs.costs.marketing || ''}
                        onChange={(e) => handleCostChange('marketing', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="other">Other Costs</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="other"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        placeholder="0.00"
                        value={inputs.costs.other || ''}
                        onChange={(e) => handleCostChange('other', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="targetProfit">Target Profit Margin (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="targetProfit"
                      min={1}
                      max={80}
                      step={1}
                      value={[inputs.targetProfit]}
                      onValueChange={(value) => handleSliderChange('targetProfit', value)}
                      className="flex-grow"
                    />
                    <span className="font-medium w-10 text-center">{inputs.targetProfit}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    The desired profit margin as a percentage of the selling price
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Competitor Prices */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Competitor Prices</CardTitle>
                <CardDescription>
                  Analyze your competitors' pricing to inform your strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="space-y-2 flex-grow">
                    <Label htmlFor="competitorName">Competitor Name</Label>
                    <Input
                      id="competitorName"
                      placeholder="e.g., Competitor Inc."
                      value={competitorName}
                      onChange={handleCompetitorNameChange}
                    />
                  </div>
                  
                  <div className="space-y-2 w-full md:w-1/3">
                    <Label htmlFor="competitorPrice">Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="competitorPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        placeholder="0.00"
                        value={competitorPrice}
                        onChange={handleCompetitorPriceChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="mb-2 md:mb-0"
                      onClick={handleAddCompetitor}
                      disabled={!competitorName.trim() || !competitorPrice.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                
                {inputs.competitorPrices.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2 text-sm">Competitor</th>
                          <th className="text-right p-2 text-sm">Price</th>
                          <th className="text-right p-2 text-sm w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inputs.competitorPrices.map((competitor, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2 text-sm">{competitor.name}</td>
                            <td className="p-2 text-sm text-right">{formatCurrency(competitor.price)}</td>
                            <td className="p-2 text-right">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveCompetitor(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md text-muted-foreground">
                    <p>No competitors added yet.</p>
                    <p className="text-sm">Add your competitors' prices to compare</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Market Factors */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Market Factors</CardTitle>
                <CardDescription>
                  Additional factors that influence optimal pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="valuePerception">Value Perception</Label>
                    <span className="text-sm text-muted-foreground">{inputs.valuePerception}/10</span>
                  </div>
                  <Slider
                    id="valuePerception"
                    min={1}
                    max={10}
                    step={1}
                    value={[inputs.valuePerception]}
                    onValueChange={(value) => handleSliderChange('valuePerception', value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How strongly do customers perceive the value of your product? (1 = Low, 10 = High)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="priceElasticity">Price Elasticity</Label>
                    <span className="text-sm text-muted-foreground">{inputs.priceElasticity}/10</span>
                  </div>
                  <Slider
                    id="priceElasticity"
                    min={1}
                    max={10}
                    step={1}
                    value={[inputs.priceElasticity]}
                    onValueChange={(value) => handleSliderChange('priceElasticity', value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How sensitive are customers to price changes? (1 = Highly elastic/sensitive, 10 = Inelastic/insensitive)
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
              >
                Reset Form
              </Button>
              <Button type="submit">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Pricing
              </Button>
            </div>
          </form>
        </TabsContent>
        
        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 mt-4">
          {analysis && (
            <>
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Analysis Summary</CardTitle>
                  <CardDescription>
                    Key metrics and recommended price points for {inputs.productName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 border p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Cost-Based Price</div>
                      <div className="text-2xl font-bold">{formatCurrency(analysis.costBasedPrice)}</div>
                      <div className="text-xs text-muted-foreground">
                        Based on your costs plus {inputs.targetProfit}% profit margin
                      </div>
                    </div>
                    
                    <div className="space-y-2 border p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Competitor-Based Price</div>
                      <div className="text-2xl font-bold">
                        {inputs.competitorPrices.length > 0 
                          ? formatCurrency(analysis.competitorBasedPrice)
                          : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {inputs.competitorPrices.length > 0 
                          ? `Based on competitor average of ${formatCurrency(analysis.averageCompetitorPrice)}`
                          : 'No competitor data provided'}
                      </div>
                    </div>
                    
                    <div className="space-y-2 border p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Value-Based Price</div>
                      <div className="text-2xl font-bold">{formatCurrency(analysis.valueBasedPrice)}</div>
                      <div className="text-xs text-muted-foreground">
                        Based on perceived value and market position
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Total Cost: {formatCurrency(analysis.totalCost)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sum of all cost components including materials, labor, overhead, etc.
                      </p>
                    </div>
                    
                    <Button variant="outline" onClick={handleDownloadCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommended Strategies */}
              <div>
                <h3 className="text-lg font-medium mb-4">Recommended Pricing Strategies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.recommendedStrategies.map((strategy, index) => (
                    renderStrategyCard(strategy, index)
                  ))}
                </div>
              </div>
              
              {/* Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Margin Comparison</CardTitle>
                  <CardDescription>
                    Visual comparison of profit margins across different pricing strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.recommendedStrategies.map((strategy, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>{strategy.name}</span>
                          <span>{formatPercentage(strategy.profitMargin)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${Math.min(100, strategy.profitMargin)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* What to Do Next */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>
                    Suggested actions to finalize your pricing strategy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium">Test Your Pricing</h3>
                        <p className="text-sm text-muted-foreground">
                          Consider A/B testing different price points with real customers to measure response.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium">Gather Customer Feedback</h3>
                        <p className="text-sm text-muted-foreground">
                          Directly ask potential customers about their willingness to pay at different price points.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium">Monitor Competitive Response</h3>
                        <p className="text-sm text-muted-foreground">
                          Keep an eye on how competitors react to your pricing and be prepared to adjust if necessary.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium">Review Regularly</h3>
                        <p className="text-sm text-muted-foreground">
                          Set a schedule to review and potentially adjust your pricing as market conditions change.
                        </p>
                      </div>
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

export default PricingStrategyCalculator; 