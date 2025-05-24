import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, Loader2, Save, RefreshCw, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

const HeadlineAnalyzer = () => {
  const [headline, setHeadline] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<HeadlineAnalysis | null>(null);
  const [alternativeHeadlines, setAlternativeHeadlines] = useState<string[]>([]);
  const [savedHeadlines, setSavedHeadlines] = useState<{text: string, score: number}[]>([]);
  const [recentHeadlines, setRecentHeadlines] = useState<string[]>([]);

  // Interface for headline analysis
  interface HeadlineAnalysis {
    score: number;
    emotionalScore: number;
    powerScore: number;
    uncommWordScore: number;
    lengthScore: number;
    clarityScore: number;
    readabilityScore: number;
    sentimentScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    emotionalWords: string[];
    powerWords: string[];
    uncommonWords: string[];
  }

  // Handle headline input change
  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeadline(e.target.value);
  };

  // Analyze the headline
  const analyzeHeadline = () => {
    if (!headline.trim()) return;
    
    setLoading(true);
    setAnalyzing(true);

    // Add to recent headlines if not already present
    if (!recentHeadlines.includes(headline) && headline.trim() !== '') {
      setRecentHeadlines(prev => [headline, ...prev].slice(0, 5));
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      const result = generateMockAnalysis(headline);
      setAnalysis(result);
      
      // Generate alternative headlines
      const alternatives = generateAlternativeHeadlines(headline);
      setAlternativeHeadlines(alternatives);
      
      setLoading(false);
      setAnalyzing(false);
    }, 1500);
  };

  // Clear the current headline and analysis
  const clearHeadline = () => {
    setHeadline('');
    setAnalysis(null);
    setAlternativeHeadlines([]);
  };

  // Save a headline
  const saveHeadline = (headlineText: string, score: number) => {
    const newSavedHeadline = { text: headlineText, score };
    setSavedHeadlines(prev => [...prev, newSavedHeadline]);
    
    toast({
      title: "Headline saved!",
      description: "Your headline has been saved to your collection.",
    });
  };

  // Copy headline to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to clipboard!",
      description: "The headline has been copied to your clipboard.",
    });
  };

  // Select a recent headline
  const selectRecentHeadline = (text: string) => {
    setHeadline(text);
  };

  // Generate mock analysis results for demonstration
  const generateMockAnalysis = (text: string): HeadlineAnalysis => {
    // Basic scoring algorithm based on headline characteristics
    const length = text.length;
    const words = text.split(' ').length;
    const hasNumber = /\d/.test(text);
    const hasQuestion = text.includes('?');
    const capitalized = text.charAt(0) === text.charAt(0).toUpperCase();
    
    // Emotional words detection (basic)
    const emotionalWordList = ['amazing', 'incredible', 'stunning', 'remarkable', 'extraordinary', 'outstanding', 'exceptional', 'surprising', 'shocking', 'breathtaking', 'mind-blowing', 'unbelievable', 'wonderful', 'fantastic', 'terrific', 'sensational', 'astonishing', 'spectacular', 'impressive', 'marvelous'];
    const emotionalWords = emotionalWordList.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    
    // Power words detection (basic)
    const powerWordList = ['ultimate', 'essential', 'proven', 'powerful', 'instantly', 'guaranteed', 'exclusive', 'secret', 'premium', 'limited', 'effective', 'revolutionary', 'unlock', 'discover', 'transform', 'master', 'expert', 'revealed', 'official', 'approved'];
    const powerWords = powerWordList.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
    
    // Uncommon words (simplified approach)
    const commonWords = ['the', 'and', 'a', 'to', 'in', 'of', 'for', 'on', 'with', 'that', 'by', 'this', 'are', 'is', 'from', 'at', 'your', 'all', 'have', 'new', 'more', 'an', 'was'];
    const uncommonWords = text.toLowerCase().split(' ').filter(word => 
      !commonWords.includes(word) && word.length > 3
    );
    
    // Determine strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Length analysis
    if (length >= 40 && length <= 60) {
      strengths.push('Headline length is optimal for social sharing');
    } else if (length < 40) {
      strengths.push('Concise headline which is easy to read');
      if (length < 25) {
        weaknesses.push('Headline may be too short to convey complete value');
      }
    } else {
      weaknesses.push('Headline is longer than optimal (40-60 characters)');
    }
    
    // Word count analysis
    if (words >= 5 && words <= 9) {
      strengths.push('Word count is optimal for engagement');
    } else if (words < 5) {
      weaknesses.push('Consider adding more descriptive words');
    } else {
      weaknesses.push('Consider making the headline more concise');
    }
    
    // Power words analysis
    if (powerWords.length > 0) {
      strengths.push(`Uses powerful words: ${powerWords.join(', ')}`);
    } else {
      weaknesses.push('No power words detected - consider adding some');
    }
    
    // Emotional words analysis
    if (emotionalWords.length > 0) {
      strengths.push(`Uses emotional words: ${emotionalWords.join(', ')}`);
    } else {
      weaknesses.push('No emotional words detected - consider adding some');
    }
    
    // Other characteristics
    if (hasNumber) {
      strengths.push('Includes a number which can increase CTR');
    }
    
    if (hasQuestion) {
      strengths.push('Question headlines often drive curiosity');
    }
    
    if (capitalized) {
      strengths.push('Proper capitalization at the start');
    } else {
      weaknesses.push('Consider starting with a capital letter');
    }
    
    // Generate scores (somewhat arbitrary for demo)
    const emotionalScore = Math.min(100, emotionalWords.length * 25 + 30);
    const powerScore = Math.min(100, powerWords.length * 25 + 35);
    const uncommWordScore = Math.min(100, uncommonWords.length * 15 + 40);
    
    // Length score peaks at 50-60 chars
    let lengthScore = 0;
    if (length <= 30) lengthScore = length * 2;
    else if (length <= 60) lengthScore = 60 + (60 - length);
    else lengthScore = Math.max(0, 120 - length);
    
    // Calculate clarity based on word length and common structure
    const clarityScore = Math.min(100, 100 - (words > 12 ? (words-12)*5 : 0));
    
    // Readability (simplified)
    const readabilityScore = Math.min(100, 100 - (words > 10 ? (words-10)*3 : 0) - 
      (uncommonWords.length > 3 ? (uncommonWords.length-3)*5 : 0));
    
    // Sentiment (positive bias for demo)
    const sentimentScore = 50 + 
      (emotionalWords.length * 10) + 
      (powerWords.length * 5) + 
      (hasQuestion ? 5 : 0) - 
      (weaknesses.length * 5);
    
    // Overall score
    const score = Math.round((
      emotionalScore * 0.15 + 
      powerScore * 0.20 + 
      uncommWordScore * 0.15 + 
      lengthScore * 0.15 + 
      clarityScore * 0.15 + 
      readabilityScore * 0.10 + 
      Math.min(100, Math.max(0, sentimentScore)) * 0.10
    ));
    
    // Generate suggestions
    const suggestions: string[] = [];
    
    if (emotionalScore < 50) {
      suggestions.push('Add emotional words to create a stronger connection with readers');
    }
    
    if (powerScore < 50) {
      suggestions.push('Include power words to make your headline more compelling');
    }
    
    if (lengthScore < 70) {
      if (length > 60) {
        suggestions.push('Try shortening your headline to 40-60 characters for better engagement');
      } else {
        suggestions.push('Consider a slightly longer headline to convey more value');
      }
    }
    
    if (clarityScore < 70) {
      suggestions.push('Simplify your headline for better clarity and understanding');
    }
    
    return {
      score,
      emotionalScore,
      powerScore,
      uncommWordScore,
      lengthScore,
      clarityScore,
      readabilityScore,
      sentimentScore,
      strengths,
      weaknesses,
      suggestions,
      emotionalWords,
      powerWords,
      uncommonWords
    };
  };

  // Generate alternative headlines based on the original
  const generateAlternativeHeadlines = (original: string): string[] => {
    // For a real application, this would use an API or more sophisticated algorithm
    // For demo purposes, we'll just use templates
    
    const words = original.split(' ');
    const templates = [
      'How to [Action] Your [Topic] for Better [Outcome]',
      '[Number] Ways to [Action] Your [Topic] Like a Pro',
      'The Ultimate Guide to [Topic]: [Benefit]',
      'Why Your [Topic] Isn\'t [Desired Outcome] (And How to Fix It)',
      '[Action] Your [Topic] in [Timeframe]: A Step-by-Step Guide',
      'The Secret to [Desired Outcome]: [Action] Your [Topic]',
      '[Number] [Topic] Mistakes You\'re Making (And How to Avoid Them)',
      'How We [Action] Our [Topic] to [Measurable Result]'
    ];
    
    // Extract potential topic
    const potentialTopic = words.length > 3 ? words.slice(Math.floor(words.length/2), words.length).join(' ') : original;
    
    // Basic variations
    return [
      `How to Achieve ${potentialTopic} in 5 Simple Steps`,
      `7 Proven Ways to Improve Your ${potentialTopic}`,
      `The Ultimate Guide to ${potentialTopic} That Actually Works`,
      `Why Your ${potentialTopic} Strategy Needs a Refresh Now`,
      `Unlock the Secret to Amazing ${potentialTopic} Results Today`
    ];
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

  return (
    <ToolLayout
      title="Headline Analyzer"
      description="Analyze and improve your headlines for better engagement and click-through rates"
      icon={<FileText className="h-6 w-6 text-purple-500" />}
      helpText="Enter your headline to analyze its effectiveness. Get scores for emotional impact, clarity, and more, plus suggestions for improvement."
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="headline">Enter your headline to analyze</Label>
          <div className="flex gap-2">
            <Input
              id="headline"
              placeholder="Enter your headline here..."
              value={headline}
              onChange={handleHeadlineChange}
              className="flex-1"
            />
            <Button 
              onClick={analyzeHeadline}
              disabled={!headline.trim() || loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          {recentHeadlines.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Recent headlines:</p>
              <div className="flex flex-wrap gap-2">
                {recentHeadlines.map((text, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-purple-50"
                    onClick={() => selectRecentHeadline(text)}
                  >
                    {text.length > 30 ? text.substring(0, 30) + '...' : text}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {analysis && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Score Card */}
              <Card className="border-purple-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Overall Score</CardTitle>
                  <CardDescription>How effective is your headline?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center flex-col">
                    <div className={`text-6xl font-bold mb-3 ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                    <Progress value={analysis.score} className={`w-full h-2 ${getProgressColor(analysis.score)}`} />
                    <div className="mt-4 text-center">
                      {analysis.score >= 80 ? (
                        <div className="flex items-center justify-center text-green-600">
                          <ThumbsUp className="h-5 w-5 mr-2" />
                          <span>Excellent headline!</span>
                        </div>
                      ) : analysis.score >= 60 ? (
                        <div className="flex items-center justify-center text-yellow-600">
                          <ThumbsUp className="h-5 w-5 mr-2" />
                          <span>Good headline with room for improvement</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-red-600">
                          <ThumbsDown className="h-5 w-5 mr-2" />
                          <span>This headline needs work</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Component Scores */}
              <Card className="border-purple-100 lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Component Scores</CardTitle>
                  <CardDescription>Breakdown of your headline's performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Emotional Appeal</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.emotionalScore)}`}>
                          {analysis.emotionalScore}%
                        </span>
                      </div>
                      <Progress value={analysis.emotionalScore} className={`w-full h-1.5 ${getProgressColor(analysis.emotionalScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Power Words</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.powerScore)}`}>
                          {analysis.powerScore}%
                        </span>
                      </div>
                      <Progress value={analysis.powerScore} className={`w-full h-1.5 ${getProgressColor(analysis.powerScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Uncommon Words</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.uncommWordScore)}`}>
                          {analysis.uncommWordScore}%
                        </span>
                      </div>
                      <Progress value={analysis.uncommWordScore} className={`w-full h-1.5 ${getProgressColor(analysis.uncommWordScore)}`} />
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
                        <span className="text-sm font-medium">Clarity</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.clarityScore)}`}>
                          {analysis.clarityScore}%
                        </span>
                      </div>
                      <Progress value={analysis.clarityScore} className={`w-full h-1.5 ${getProgressColor(analysis.clarityScore)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Readability</span>
                        <span className={`text-sm font-semibold ${getScoreColor(analysis.readabilityScore)}`}>
                          {analysis.readabilityScore}%
                        </span>
                      </div>
                      <Progress value={analysis.readabilityScore} className={`w-full h-1.5 ${getProgressColor(analysis.readabilityScore)}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Details */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              <Card className="border-purple-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Analysis Details</CardTitle>
                  <CardDescription>Specific insights for your headline</CardDescription>
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
                    
                    {/* Stats */}
                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Character Count</p>
                        <p className="text-sm font-medium">{headline.length} characters</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Word Count</p>
                        <p className="text-sm font-medium">{headline.split(' ').length} words</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Headlines */}
              {alternativeHeadlines.length > 0 && (
                <Card className="border-purple-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Alternative Headlines</CardTitle>
                    <CardDescription>Try these alternatives for better results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alternativeHeadlines.map((altHeadline, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <p className="flex-1">{altHeadline}</p>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setHeadline(altHeadline)}
                              className="h-8 text-xs"
                            >
                              Use
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(altHeadline)}
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
                onClick={clearHeadline}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(headline)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Headline
                </Button>
                
                <Button 
                  onClick={() => saveHeadline(headline, analysis.score)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Headline
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Saved Headlines Section */}
        {savedHeadlines.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Saved Headlines</h3>
            <div className="space-y-3">
              {savedHeadlines.map((saved, idx) => (
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
                      onClick={() => setHeadline(saved.text)}
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
      </div>
    </ToolLayout>
  );
};

export default HeadlineAnalyzer; 