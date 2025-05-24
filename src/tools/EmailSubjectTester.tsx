import React, { useState } from 'react';
import { FileText, ArrowRight, Loader2, Save, RefreshCw, ThumbsUp, ThumbsDown, Copy, Mail } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

const EmailSubjectTester = () => {
  const [subjectLine, setSubjectLine] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [audienceType, setAudienceType] = useState<string>('');
  const [emailType, setEmailType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<SubjectLineAnalysis | null>(null);
  const [alternativeSubjects, setAlternativeSubjects] = useState<string[]>([]);
  const [savedSubjects, setSavedSubjects] = useState<{text: string, score: number}[]>([]);

  // Interface for subject line analysis
  interface SubjectLineAnalysis {
    score: number;
    openRatePrediction: number;
    spamScore: number;
    lengthScore: number;
    urgencyScore: number;
    personalizedScore: number;
    clarityScore: number;
    curiosityScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    spamTriggerWords: string[];
  }

  // Industry options
  const industryOptions = [
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'nonprofit', label: 'Non-profit' },
    { value: 'travel', label: 'Travel & Hospitality' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'other', label: 'Other' }
  ];

  // Handle subject line input change
  const handleSubjectLineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubjectLine(e.target.value);
  };

  // Test the subject line
  const testSubjectLine = () => {
    if (!subjectLine.trim()) return;
    
    setLoading(true);
    setTesting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = generateMockAnalysis(subjectLine);
      setAnalysis(result);
      
      // Generate alternative subject lines
      const alternatives = generateAlternativeSubjects(subjectLine);
      setAlternativeSubjects(alternatives);
      
      setLoading(false);
      setTesting(false);
    }, 1500);
  };

  // Clear the current subject line and analysis
  const clearSubjectLine = () => {
    setSubjectLine('');
    setAnalysis(null);
    setAlternativeSubjects([]);
  };

  // Save a subject line
  const saveSubjectLine = (text: string, score: number) => {
    const newSavedSubject = { text, score };
    setSavedSubjects(prev => [...prev, newSavedSubject]);
    
    toast({
      title: "Subject line saved!",
      description: "Your subject line has been saved to your collection.",
    });
  };

  // Copy subject line to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to clipboard!",
      description: "The subject line has been copied to your clipboard.",
    });
  };

  // Generate mock analysis results for demonstration
  const generateMockAnalysis = (text: string): SubjectLineAnalysis => {
    // Basic scoring algorithm based on subject characteristics
    const length = text.length;
    const words = text.split(' ').length;
    const hasNumber = /\d/.test(text);
    const hasQuestion = text.includes('?');
    const hasPersonalization = text.toLowerCase().includes('you') || text.toLowerCase().includes('your');
    const hasEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(text);
    const isAllCaps = text === text.toUpperCase() && text.length > 5;
    
    // Spam trigger words (simplified list)
    const spamWords = [
      'free', 'guaranteed', 'no risk', 'winner', 'cash', 'discount', 'save', 'offer', 
      'limited time', 'act now', 'urgent', 'amazing', 'incredible', 'congratulations',
      'buy now', 'order now', 'click here', 'click below', 'sign up free'
    ];
    
    const spamTriggerWords = spamWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    
    // Urgency words
    const urgencyWords = [
      'now', 'today', 'hurry', 'limited', 'fast', 'quick', 'urgent', 'deadline', 
      'soon', 'ends', 'last chance', 'don\'t miss', 'exclusive', 'expires'
    ];
    
    const hasUrgency = urgencyWords.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    
    // Curiosity triggers
    const curiosityPhrases = [
      'how to', 'secrets', 'revealed', 'discover', 'finally', 'unexpected', 'surprising',
      'what no one tells you', 'truth about', 'why you should', 'reasons why', 'what if'
    ];
    
    const hasCuriosity = curiosityPhrases.some(phrase => 
      text.toLowerCase().includes(phrase.toLowerCase())
    );
    
    // Determine strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Length analysis (subject lines have different optimal lengths than headlines)
    if (length >= 30 && length <= 50) {
      strengths.push('Subject length is optimal for most email clients');
    } else if (length < 30) {
      if (length < 10) {
        weaknesses.push('Subject may be too short to provide enough context');
      } else {
        strengths.push('Concise subject which is easy to read on mobile');
      }
    } else {
      weaknesses.push('Subject is longer than optimal (30-50 characters) and may get cut off in some email clients');
    }
    
    // Word count analysis
    if (words >= 3 && words <= 7) {
      strengths.push('Word count is optimal for email subjects');
    } else if (words < 3) {
      weaknesses.push('Consider adding more context with a few more words');
    } else {
      weaknesses.push('Consider making the subject more concise');
    }
    
    // Personalization analysis
    if (hasPersonalization) {
      strengths.push('Uses personalization which can increase open rates');
    } else {
      weaknesses.push('No personalization detected - consider adding "you" or "your"');
    }
    
    // Urgency analysis
    if (hasUrgency) {
      strengths.push('Creates a sense of urgency which can prompt action');
      if (spamTriggerWords.length > 2) {
        weaknesses.push('Combines too many urgency and promotional words which may trigger spam filters');
      }
    }
    
    // Spam analysis
    if (spamTriggerWords.length > 0) {
      if (spamTriggerWords.length > 3) {
        weaknesses.push('Contains multiple spam trigger words which may affect deliverability');
      } else {
        weaknesses.push(`Contains potential spam trigger words: ${spamTriggerWords.join(', ')}`);
      }
    } else {
      strengths.push('Avoids common spam trigger words');
    }
    
    // Other characteristics
    if (hasNumber) {
      strengths.push('Includes a number which can increase open rates');
    }
    
    if (hasQuestion) {
      strengths.push('Question format can drive curiosity and engagement');
    }
    
    if (hasEmoji) {
      strengths.push('Emojis can increase visibility in crowded inboxes');
      if (text.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)?.length > 2) {
        weaknesses.push('Too many emojis may look unprofessional or trigger spam filters');
      }
    }
    
    if (isAllCaps) {
      weaknesses.push('All caps may trigger spam filters and appears like shouting');
    }
    
    if (hasCuriosity) {
      strengths.push('Creates curiosity which can improve open rates');
    }
    
    // Generate scores (somewhat arbitrary for demo)
    // Calculate spam score (lower is better)
    const spamScore = Math.min(100, 
      (spamTriggerWords.length * 15) + 
      (isAllCaps ? 30 : 0) + 
      (spamTriggerWords.length > 2 && hasUrgency ? 20 : 0) +
      (hasEmoji && text.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)?.length > 2 ? 15 : 0)
    );
    
    // Length score 
    let lengthScore = 0;
    if (length <= 20) lengthScore = length * 3;
    else if (length <= 50) lengthScore = 60 + ((50 - length) * 0.8);
    else lengthScore = Math.max(0, 100 - ((length - 50) * 2));
    
    // Urgency score
    const urgencyScore = hasUrgency ? 80 : 40;
    
    // Personalization score
    const personalizedScore = hasPersonalization ? 90 : 40;
    
    // Clarity based on word length and common structure
    const clarityScore = Math.min(100, 100 - (words > 10 ? (words-10)*5 : 0));
    
    // Curiosity score
    const curiosityScore = hasCuriosity || hasQuestion ? 85 : 50;
    
    // Overall score - weighs multiple factors
    const rawScore = (
      (100 - spamScore) * 0.25 + // Inverted spam score (lower spam score is better)
      lengthScore * 0.15 + 
      urgencyScore * 0.15 + 
      personalizedScore * 0.20 + 
      clarityScore * 0.15 + 
      curiosityScore * 0.10
    );
    
    const score = Math.round(Math.min(100, Math.max(0, rawScore)));
    
    // Predict open rate based on score
    const openRatePrediction = Math.round(15 + (score / 100 * 35)); // Range from ~15% to ~50%
    
    // Generate suggestions
    const suggestions: string[] = [];
    
    if (spamScore > 40) {
      suggestions.push('Remove or replace spam trigger words to improve deliverability');
    }
    
    if (lengthScore < 60) {
      if (length > 50) {
        suggestions.push('Shorten your subject line to 30-50 characters for optimal visibility');
      } else if (length < 20) {
        suggestions.push('Consider a slightly longer subject line to provide more context');
      }
    }
    
    if (personalizedScore < 60) {
      suggestions.push('Add personalization elements like "you" or "your" to connect with the reader');
    }
    
    if (urgencyScore < 60 && emailType === 'promotional') {
      suggestions.push('Consider adding a sense of urgency if appropriate for your message');
    }
    
    if (curiosityScore < 60) {
      suggestions.push('Try phrasing that creates curiosity or adds intrigue');
    }
    
    if (isAllCaps) {
      suggestions.push('Avoid using all capital letters as it may trigger spam filters');
    }
    
    return {
      score,
      openRatePrediction,
      spamScore,
      lengthScore,
      urgencyScore,
      personalizedScore,
      clarityScore,
      curiosityScore,
      strengths,
      weaknesses,
      suggestions,
      spamTriggerWords
    };
  };

  // Generate alternative subject lines based on the original
  const generateAlternativeSubjects = (original: string): string[] => {
    // Extract keywords
    const words = original.split(' ');
    const keyWords = words.filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'from', 'your', 'have', 'will', 'about', 'what'].includes(word.toLowerCase())
    );
    
    const keyword = keyWords.length > 0 
      ? keyWords[Math.floor(Math.random() * keyWords.length)] 
      : (words.length > 0 ? words[0] : 'product');
    
    // Account for industry if selected
    const industryTerm = industry 
      ? industryOptions.find(option => option.value === industry)?.label || industry
      : 'business';
      
    // Templates for different types of subject lines
    const templates = [
      // Question templates
      `Have you seen our latest ${keyword}?`,
      `Are you making these ${keyword} mistakes?`,
      `What if you could improve your ${keyword} today?`,
      
      // Urgency templates
      `Last chance: ${capitalize(keyword)} offer ends today`,
      `[Limited time] ${original}`,
      `Only 24 hours left to get your ${keyword}`,
      
      // Benefit templates
      `Boost your ${keyword} in 5 simple steps`,
      `The easiest way to improve your ${keyword}`,
      `${capitalize(industry || 'business')} secrets: Transform your ${keyword}`,
      
      // Curiosity templates
      `The truth about ${keyword} nobody tells you`,
      `We analyzed 1,000 ${keyword}s - here's what we found`,
      `Why most ${keyword} strategies fail (and how to fix yours)`
    ];
    
    // Select 5 random unique templates
    const selectedTemplates = [];
    const usedIndices = new Set();
    
    while (selectedTemplates.length < 5 && usedIndices.size < templates.length) {
      const idx = Math.floor(Math.random() * templates.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        selectedTemplates.push(templates[idx]);
      }
    }
    
    return selectedTemplates;
  };

  // Helper function to capitalize first letter
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get a score display color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get a progress bar color based on value
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  // Get a progress bar color based on spam score (inverted - lower is better)
  const getSpamScoreColor = (score: number) => {
    if (score < 30) return 'bg-green-600';
    if (score < 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <ToolLayout
      title="Email Subject Line Tester"
      description="Test and optimize your email subject lines for higher open rates"
      icon={<Mail className="h-6 w-6 text-indigo-500" />}
      helpText="Enter your email subject line to analyze its effectiveness. Get predictions for open rates and discover how to improve deliverability."
    >
      <div className="space-y-8">
        <div className="space-y-6">
          <Card className="border-indigo-100">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="subject-line" className="text-base">Enter your email subject line</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="subject-line"
                      placeholder="Enter your email subject line here..."
                      value={subjectLine}
                      onChange={handleSubjectLineChange}
                      className="flex-1"
                    />
                    <Button 
                      onClick={testSubjectLine}
                      disabled={!subjectLine.trim() || loading}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {testing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          Test Subject
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="audience">Audience Type (Optional)</Label>
                    <Select value={audienceType} onValueChange={setAudienceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="b2b">B2B (Business)</SelectItem>
                        <SelectItem value="b2c">B2C (Consumer)</SelectItem>
                        <SelectItem value="nonprofit">Non-profit / NGO</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="email-type">Email Type (Optional)</Label>
                    <RadioGroup
                      value={emailType}
                      onValueChange={setEmailType}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="newsletter" id="newsletter" />
                        <Label htmlFor="newsletter" className="cursor-pointer">Newsletter</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="promotional" id="promotional" />
                        <Label htmlFor="promotional" className="cursor-pointer">Promotional</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="transactional" id="transactional" />
                        <Label htmlFor="transactional" className="cursor-pointer">Transactional</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="announcement" id="announcement" />
                        <Label htmlFor="announcement" className="cursor-pointer">Announcement</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {analysis && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Score Card */}
              <Card className="border-indigo-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Overall Score</CardTitle>
                  <CardDescription>How effective is your subject line?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center flex-col">
                    <div className={`text-6xl font-bold mb-3 ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                    <Progress value={analysis.score} className={`w-full h-2 ${getProgressColor(analysis.score)}`} />
                    <div className="mt-6 text-center">
                      <div className="text-lg font-medium">Predicted Open Rate</div>
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.openRatePrediction * 2)}`}>
                        {analysis.openRatePrediction}%
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Industry average: ~21%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Component Scores */}
              <Card className="border-indigo-100 lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Component Scores</CardTitle>
                  <CardDescription>Breakdown of your subject line's performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Spam Safety</span>
                        <span className={`text-sm font-semibold ${getScoreColor(100 - analysis.spamScore)}`}>
                          {100 - analysis.spamScore}%
                        </span>
                      </div>
                      <Progress value={100 - analysis.spamScore} className={`w-full h-1.5 ${getSpamScoreColor(analysis.spamScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Length Optimization</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.lengthScore)}`}>
                          {analysis.lengthScore}%
                        </span>
                      </div>
                      <Progress value={analysis.lengthScore} className={`w-full h-1.5 ${getProgressColor(analysis.lengthScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Personalization</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.personalizedScore)}`}>
                          {analysis.personalizedScore}%
                        </span>
                      </div>
                      <Progress value={analysis.personalizedScore} className={`w-full h-1.5 ${getProgressColor(analysis.personalizedScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Clarity</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.clarityScore)}`}>
                          {analysis.clarityScore}%
                        </span>
                      </div>
                      <Progress value={analysis.clarityScore} className={`w-full h-1.5 ${getProgressColor(analysis.clarityScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Urgency</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.urgencyScore)}`}>
                          {analysis.urgencyScore}%
                        </span>
                      </div>
                      <Progress value={analysis.urgencyScore} className={`w-full h-1.5 ${getProgressColor(analysis.urgencyScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Curiosity</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.curiosityScore)}`}>
                          {analysis.curiosityScore}%
                        </span>
                      </div>
                      <Progress value={analysis.curiosityScore} className={`w-full h-1.5 ${getProgressColor(analysis.curiosityScore)}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Details */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              <Card className="border-indigo-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Analysis Details</CardTitle>
                  <CardDescription>Specific insights for your subject line</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Strengths</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.strengths.map((strength, idx) => (
                            <li key={idx} className="text-green-600">{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Weaknesses */}
                    {analysis.weaknesses.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Areas for Improvement</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="text-red-600">{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Suggestions</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-blue-600">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Spam trigger words */}
                    {analysis.spamTriggerWords.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Potential Spam Trigger Words</h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.spamTriggerWords.map((word, idx) => (
                            <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Character Count</p>
                        <p className="text-sm font-medium">{subjectLine.length} characters</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Word Count</p>
                        <p className="text-sm font-medium">{subjectLine.split(' ').length} words</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Subject Lines */}
              {alternativeSubjects.length > 0 && (
                <Card className="border-indigo-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Alternative Subject Lines</CardTitle>
                    <CardDescription>Try these alternatives for better results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alternativeSubjects.map((altSubject, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <p className="flex-1">{altSubject}</p>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSubjectLine(altSubject)}
                              className="h-8 text-xs"
                            >
                              Use
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(altSubject)}
                              className="h-8 text-xs"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={clearSubjectLine}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(subjectLine)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Subject
                </Button>
                
                <Button 
                  onClick={() => saveSubjectLine(subjectLine, analysis.score)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Subject
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Saved Subject Lines Section */}
        {savedSubjects.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Saved Subject Lines</h3>
            <div className="space-y-3">
              {savedSubjects.map((saved, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Badge className={`mr-3 ${getProgressColor(saved.score)} text-white`}>
                      {saved.score}
                    </Badge>
                    <p>{saved.text}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSubjectLine(saved.text)}
                      className="h-8 text-xs"
                    >
                      Use
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(saved.text)}
                      className="h-8 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Practices Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Email Subject Line Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-indigo-50 border-indigo-100">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-indigo-800 mb-3">Do:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900">
                  <li>Keep subject lines under 50 characters</li>
                  <li>Create a sense of urgency when appropriate</li>
                  <li>Use personalization when possible</li>
                  <li>Be specific about what's inside the email</li>
                  <li>Use questions to engage readers</li>
                  <li>Test different subject lines with A/B testing</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-red-800 mb-3">Don't:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-red-900">
                  <li>Use ALL CAPS or excessive punctuation!!!</li>
                  <li>Include spammy words like "free," "buy now," or "cash"</li>
                  <li>Make false promises or use clickbait</li>
                  <li>Be too vague (e.g., "Newsletter #5")</li>
                  <li>Overuse emojis or special characters</li>
                  <li>Forget to proofread for spelling and grammar</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default EmailSubjectTester; 