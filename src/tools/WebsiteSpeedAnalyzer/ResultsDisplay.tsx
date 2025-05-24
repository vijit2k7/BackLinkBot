import React from 'react';
import { SpeedTestResult } from './types';
import { formatTime, formatSize, getScoreColor, getProgressColor } from './utils';
import { AlertTriangle, Check, ChevronRight, Download, ExternalLink, Info, Star, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ResultsDisplayProps {
  result: SpeedTestResult;
  onSaveResult: () => void;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onSaveResult, onReset }) => {
  const scoreColor = getScoreColor(result.performanceScore);
  const progressColor = getProgressColor(result.performanceScore);
  
  // Get score label based on performance score
  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Fast';
    if (score >= 70) return 'Moderate';
    if (score >= 50) return 'Slow';
    return 'Very Slow';
  };
  
  // Get icon for issue type
  const getIssueIcon = (type: 'critical' | 'warning' | 'info') => {
    switch(type) {
      case 'critical':
        return <X className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle>Performance Score</CardTitle>
            <CardDescription>Based on lab data analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={`w-32 h-32 rounded-full border-8 ${scoreColor.replace('text', 'border')} flex items-center justify-center`}>
                  <span className={`text-4xl font-bold ${scoreColor}`}>{result.performanceScore}</span>
                </div>
                <Badge className="absolute bottom-0 right-0 transform translate-x-1/3">
                  {getScoreLabel(result.performanceScore)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Values are estimated and may vary. The performance score is calculated based on lab data.
              </p>
              <div className="flex gap-3 mt-4">
                <Button size="sm" onClick={onSaveResult}>
                  <Star className="h-4 w-4 mr-1" />
                  Save Result
                </Button>
                <Button size="sm" variant="outline" onClick={onReset}>
                  <X className="h-4 w-4 mr-1" />
                  New Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle>Core Web Vitals</CardTitle>
            <CardDescription>User experience metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>First Contentful Paint (FCP)</span>
                <span className={result.metrics.fcp < 1.8 ? "text-green-500" : result.metrics.fcp < 3 ? "text-yellow-500" : "text-red-500"}>
                  {result.metrics.fcp.toFixed(1)}s
                </span>
              </div>
              <Progress value={(1 / result.metrics.fcp) * 100} max={100} className={result.metrics.fcp < 1.8 ? "bg-green-500" : result.metrics.fcp < 3 ? "bg-yellow-500" : "bg-red-500"} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Largest Contentful Paint (LCP)</span>
                <span className={result.metrics.lcp < 2.5 ? "text-green-500" : result.metrics.lcp < 4 ? "text-yellow-500" : "text-red-500"}>
                  {result.metrics.lcp.toFixed(1)}s
                </span>
              </div>
              <Progress value={(2.5 / result.metrics.lcp) * 100} max={100} className={result.metrics.lcp < 2.5 ? "bg-green-500" : result.metrics.lcp < 4 ? "bg-yellow-500" : "bg-red-500"} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time to First Byte (TTFB)</span>
                <span className={result.metrics.ttfb < 0.8 ? "text-green-500" : result.metrics.ttfb < 1.2 ? "text-yellow-500" : "text-red-500"}>
                  {result.metrics.ttfb.toFixed(1)}s
                </span>
              </div>
              <Progress value={(0.8 / result.metrics.ttfb) * 100} max={100} className={result.metrics.ttfb < 0.8 ? "bg-green-500" : result.metrics.ttfb < 1.2 ? "bg-yellow-500" : "bg-red-500"} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cumulative Layout Shift (CLS)</span>
                <span className={result.metrics.cls < 0.1 ? "text-green-500" : result.metrics.cls < 0.25 ? "text-yellow-500" : "text-red-500"}>
                  {result.metrics.cls.toFixed(3)}
                </span>
              </div>
              <Progress value={100 - (result.metrics.cls * 1000)} max={100} className={result.metrics.cls < 0.1 ? "bg-green-500" : result.metrics.cls < 0.25 ? "bg-yellow-500" : "bg-red-500"} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Resource Breakdown</CardTitle>
          <CardDescription>Overview of resources loaded by page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex flex-col items-center border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{result.resourceCounts.total}</p>
              <p className="text-xs">{formatSize(result.resourceSizes.total)}</p>
            </div>
            
            <div className="flex flex-col items-center border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">JavaScript</p>
              <p className="text-xl font-bold">{result.resourceCounts.js}</p>
              <p className="text-xs">{formatSize(result.resourceSizes.js)}</p>
            </div>
            
            <div className="flex flex-col items-center border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">CSS</p>
              <p className="text-xl font-bold">{result.resourceCounts.css}</p>
              <p className="text-xs">{formatSize(result.resourceSizes.css)}</p>
            </div>
            
            <div className="flex flex-col items-center border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Images</p>
              <p className="text-xl font-bold">{result.resourceCounts.images}</p>
              <p className="text-xs">{formatSize(result.resourceSizes.images)}</p>
            </div>
            
            <div className="flex flex-col items-center border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Fonts</p>
              <p className="text-xl font-bold">{result.resourceCounts.fonts}</p>
              <p className="text-xs">{formatSize(result.resourceSizes.fonts)}</p>
            </div>
            
            <div className="flex flex-col items-center border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Other</p>
              <p className="text-xl font-bold">{result.resourceCounts.other}</p>
              <p className="text-xs">{formatSize(result.resourceSizes.other)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Issues and Opportunities */}
      <Accordion type="single" collapsible className="w-full">
        {/* Issues */}
        <AccordionItem value="issues">
          <AccordionTrigger>
            <div className="flex items-center">
              <span>Issues Found</span>
              <Badge variant="outline" className="ml-2">
                {result.issues.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {result.issues.map((issue, index) => (
                <div key={index} className="flex gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getIssueIcon(issue.type)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <Badge variant="outline">Impact: {issue.impact}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Opportunities */}
        <AccordionItem value="opportunities">
          <AccordionTrigger>
            <div className="flex items-center">
              <span>Opportunities</span>
              <Badge variant="outline" className="ml-2">
                {result.opportunities.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {result.opportunities.map((opportunity, index) => (
                <div key={index} className="flex gap-3 p-3 border rounded-lg">
                  <div className="flex-grow">
                    <h4 className="font-semibold">{opportunity.title}</h4>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end justify-center">
                    <div className="text-sm font-semibold text-green-500">
                      Save {formatTime(opportunity.savingsMs)}
                    </div>
                    {opportunity.savingsKb && (
                      <div className="text-xs text-muted-foreground">
                        {formatSize(opportunity.savingsKb)} potential savings
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Passed Audits */}
        <AccordionItem value="passed">
          <AccordionTrigger>
            <div className="flex items-center">
              <span>Passed Audits</span>
              <Badge variant="outline" className="ml-2">
                {result.passed.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {result.passed.map((item, index) => (
                <div key={index} className="flex gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Additional Resources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn How to Fix These Issues
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Check Core Web Vitals Guidelines
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay; 