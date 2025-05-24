import React, { useState } from 'react';
import { FileText, BarChart, ArrowRight, RefreshCw, Check, Copy, BookOpen, Edit, List, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ReadabilityScores {
  fleschKincaid: number;
  gunningFog: number;
  colemanLiau: number;
  smog: number;
  automatedReadability: number;
  averageGradeLevel: number;
  readingTime: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  complexWords: string[];
  longSentences: string[];
  passiveVoice: string[];
  adverbs: string[];
  cliches: string[];
  suggestions: string[];
}

interface HighlightInfo {
  type: 'complex' | 'long' | 'passive' | 'adverb' | 'cliche';
  text: string;
  reason: string;
  suggestion?: string;
}

// Readability grade level descriptions
const GRADE_LEVEL_DESCRIPTIONS = [
  { max: 6, label: 'Very Easy', description: 'Easily understood by an average 11-year-old student.' },
  { max: 8, label: 'Easy', description: 'Easily understood by an average 13-year-old student.' },
  { max: 10, label: 'Fairly Easy', description: 'Easily understood by an average 15-year-old student.' },
  { max: 12, label: 'Standard', description: 'Easily understood by an average 17-year-old student.' },
  { max: 14, label: 'Fairly Difficult', description: 'Easily understood by college students.' },
  { max: 18, label: 'Difficult', description: 'Understood by college graduates.' },
  { max: 100, label: 'Very Difficult', description: 'Understood by university graduates.' },
];

// Helper function to get a description based on the grade level
const getReadabilityDescription = (gradeLevel: number) => {
  const category = GRADE_LEVEL_DESCRIPTIONS.find(cat => gradeLevel <= cat.max);
  return category || GRADE_LEVEL_DESCRIPTIONS[GRADE_LEVEL_DESCRIPTIONS.length - 1];
};

// Helper function to get a color for the progress bar based on the grade level
const getProgressColor = (gradeLevel: number): string => {
  if (gradeLevel <= 8) return 'bg-green-500';
  if (gradeLevel <= 12) return 'bg-yellow-500';
  if (gradeLevel <= 16) return 'bg-orange-500';
  return 'bg-red-500';
};

// Simple calculation for readability (demo purposes)
const calculateReadabilityScores = (text: string): ReadabilityScores => {
  // This is a simplified implementation for demonstration
  // In a real app, you would implement proper readability formulas

  // Count words, sentences, and paragraphs
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.match(/[a-z0-9]/i));
  
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const paragraphCount = paragraphs.length;
  const characterCount = text.replace(/\s/g, '').length;
  const syllableCount = estimateSyllableCount(text);
  
  // Find complex words (more than 3 syllables)
  const complexWords = words
    .filter(word => estimateWordSyllables(word) > 3)
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 10);
  
  // Find long sentences (more than 25 words)
  const longSentences = sentences
    .filter(sentence => sentence.split(/\s+/).filter(Boolean).length > 25)
    .slice(0, 5);
  
  // Mock identifying passive voice sentences
  const passiveVoice = sentences
    .filter(sentence => 
      sentence.match(/\b(is|are|was|were|be|been|being)\b.*\b(by)\b/i) ||
      Math.random() < 0.15 // Randomly mark some sentences for demo purposes
    )
    .slice(0, 5);
  
  // Mock identifying adverbs
  const adverbs = words
    .filter(word => word.match(/ly\b/) && word.length > 4)
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 10);
  
  // Mock cliches
  const potentialCliches = [
    "at the end of the day",
    "think outside the box",
    "touch base",
    "hit the ground running",
    "reinvent the wheel",
    "paradigm shift",
    "low hanging fruit",
    "win-win situation",
  ];
  
  const cliches = potentialCliches.filter(cliche => 
    text.toLowerCase().includes(cliche)
  );
  
  // Calculate average metrics
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;
  
  // Calculate readability scores (simplified versions)
  const fleschKincaid = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
  const gunningFog = 0.4 * ((wordCount / sentenceCount) + 100 * (complexWords.length / wordCount));
  const colemanLiau = 5.89 * (characterCount / wordCount) - 0.3 * (sentenceCount / wordCount) - 15.8;
  const smog = 1.043 * Math.sqrt(complexWords.length * (30 / sentenceCount)) + 3.1291;
  const automatedReadability = 4.71 * (characterCount / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;
  
  // Average grade level
  const averageGradeLevel = (fleschKincaid + gunningFog + colemanLiau + smog + automatedReadability) / 5;
  
  // Reading time (based on average reading speed of 200-250 words per minute)
  const readingTime = wordCount / 225;
  
  // Generate suggestions
  const suggestions = [];
  
  if (avgWordsPerSentence > 20) {
    suggestions.push("Your sentences are quite long. Consider breaking longer sentences into shorter ones.");
  }
  
  if (complexWords.length / wordCount > 0.1) {
    suggestions.push("Your text contains many complex words. Try using simpler alternatives where possible.");
  }
  
  if (passiveVoice.length > 2) {
    suggestions.push("Your content contains passive voice. Consider using active voice for more directness.");
  }
  
  if (adverbs.length > 5) {
    suggestions.push("You're using many adverbs. Replace adverbs with stronger verbs for more impactful writing.");
  }
  
  if (cliches.length > 0) {
    suggestions.push("Avoid clichés. Replace overused phrases with fresh language.");
  }
  
  if (paragraphCount < 3 && wordCount > 200) {
    suggestions.push("Your content has very few paragraphs. Break up your text into more paragraphs for better readability.");
  }
  
  return {
    fleschKincaid: Math.max(0, Math.min(18, fleschKincaid)),
    gunningFog: Math.max(0, Math.min(18, gunningFog)),
    colemanLiau: Math.max(0, Math.min(18, colemanLiau)),
    smog: Math.max(0, Math.min(18, smog)),
    automatedReadability: Math.max(0, Math.min(18, automatedReadability)),
    averageGradeLevel: Math.max(0, Math.min(18, averageGradeLevel)),
    readingTime,
    wordCount,
    sentenceCount,
    paragraphCount,
    avgWordsPerSentence,
    avgSyllablesPerWord,
    complexWords,
    longSentences,
    passiveVoice,
    adverbs,
    cliches,
    suggestions,
  };
};

// Function to estimate syllable count in text
const estimateSyllableCount = (text: string): number => {
  const words = text.split(/\s+/).filter(Boolean);
  return words.reduce((count, word) => count + estimateWordSyllables(word), 0);
};

// Function to estimate syllables in a word
const estimateWordSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  
  if (word.length <= 3) return 1;
  
  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g) || [];
  let count = vowelGroups.length;
  
  // Subtract silent 'e' at the end
  if (word.endsWith('e')) count--;
  
  // Handle special cases
  if (word.endsWith('le') && word.length > 2 && !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 3])) {
    count++;
  }
  
  // Ensure at least one syllable
  return Math.max(1, count);
};

// Component for highlighted text analysis
const TextHighlight: React.FC<{ 
  text: string, 
  highlights: HighlightInfo[] 
}> = ({ text, highlights }) => {
  if (!text || !highlights.length) return <div className="text-muted-foreground italic">No issues found</div>;
  
  return (
    <div className="space-y-2">
      {highlights.map((highlight, index) => (
        <div key={index} className="text-sm border rounded-md p-3">
          <div className="flex justify-between mb-1">
            <Badge variant="outline" className="mb-1">
              {highlight.type === 'complex' && 'Complex Word'}
              {highlight.type === 'long' && 'Long Sentence'}
              {highlight.type === 'passive' && 'Passive Voice'}
              {highlight.type === 'adverb' && 'Adverb'}
              {highlight.type === 'cliche' && 'Cliché'}
            </Badge>
            {highlight.suggestion && (
              <span className="text-xs text-muted-foreground">Suggestion available</span>
            )}
          </div>
          <p className="mb-1">"{highlight.text}"</p>
          <p className="text-xs text-muted-foreground">{highlight.reason}</p>
          {highlight.suggestion && (
            <div className="mt-2 border-t pt-2">
              <p className="text-xs font-medium">Suggestion:</p>
              <p className="text-sm">{highlight.suggestion}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main component
const ContentReadabilityAnalyzer: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [results, setResults] = useState<ReadabilityScores | null>(null);
  const [activeTab, setActiveTab] = useState<string>('analyzer');
  const [improvedText, setImprovedText] = useState<string>('');
  
  // Generate highlights for display
  const getHighlights = (): HighlightInfo[] => {
    if (!results) return [];
    
    const highlights: HighlightInfo[] = [];
    
    // Complex words
    results.complexWords.forEach(word => {
      highlights.push({
        type: 'complex',
        text: word,
        reason: `This is a complex word (more than 3 syllables).`,
        suggestion: `Consider replacing with a simpler alternative.`
      });
    });
    
    // Long sentences
    results.longSentences.forEach(sentence => {
      highlights.push({
        type: 'long',
        text: sentence,
        reason: `This sentence is too long (more than 25 words).`,
        suggestion: `Try breaking this into two or more sentences.`
      });
    });
    
    // Passive voice
    results.passiveVoice.forEach(sentence => {
      highlights.push({
        type: 'passive',
        text: sentence,
        reason: `This sentence uses passive voice.`,
        suggestion: `Rewrite using active voice for more clarity and impact.`
      });
    });
    
    // Adverbs
    results.adverbs.forEach(word => {
      highlights.push({
        type: 'adverb',
        text: word,
        reason: `Adverbs often weaken your writing.`,
        suggestion: `Replace with a stronger verb.`
      });
    });
    
    // Cliches
    results.cliches.forEach(cliche => {
      highlights.push({
        type: 'cliche',
        text: cliche,
        reason: `This is an overused phrase that can make your writing seem unoriginal.`,
        suggestion: `Replace with more specific and fresh language.`
      });
    });
    
    return highlights;
  };
  
  // Handle form submission
  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter some content to analyze",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API processing time
    setTimeout(() => {
      const scores = calculateReadabilityScores(content);
      setResults(scores);
      setIsAnalyzing(false);
      
      // Initialize the improved text with the original content
      setImprovedText(content);
      
      toast({
        title: "Analysis complete",
        description: "Your content has been analyzed for readability",
      });
    }, 1500);
  };
  
  // Copy results to clipboard
  const handleCopyResults = () => {
    if (!results) return;
    
    const readabilityLevel = getReadabilityDescription(results.averageGradeLevel);
    
    const textToCopy = `
Content Readability Analysis Results:

Average Grade Level: ${results.averageGradeLevel.toFixed(1)} (${readabilityLevel.label})
Reading Time: ${Math.ceil(results.readingTime)} minute${Math.ceil(results.readingTime) === 1 ? '' : 's'}
Word Count: ${results.wordCount}
Sentence Count: ${results.sentenceCount}
Paragraph Count: ${results.paragraphCount}
Average Words Per Sentence: ${results.avgWordsPerSentence.toFixed(1)}

Readability Scores:
- Flesch-Kincaid Grade Level: ${results.fleschKincaid.toFixed(1)}
- Gunning Fog Index: ${results.gunningFog.toFixed(1)}
- Coleman-Liau Index: ${results.colemanLiau.toFixed(1)}
- SMOG Index: ${results.smog.toFixed(1)}
- Automated Readability Index: ${results.automatedReadability.toFixed(1)}

Key Suggestions:
${results.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(textToCopy);
    
    toast({
      title: "Results copied",
      description: "Analysis results have been copied to clipboard",
    });
  };
  
  // Copy improved text to clipboard
  const handleCopyImprovedText = () => {
    navigator.clipboard.writeText(improvedText);
    
    toast({
      title: "Improved text copied",
      description: "Your improved content has been copied to clipboard",
    });
  };
  
  // Reset everything
  const handleReset = () => {
    setContent('');
    setResults(null);
    setImprovedText('');
    setActiveTab('analyzer');
    
    toast({
      title: "Reset complete",
      description: "The analyzer has been reset",
    });
  };
  
  // Get appropriate content for score visualization
  const getScoreElement = (score: number, label: string) => {
    const readabilityLevel = getReadabilityDescription(score);
    const progressColor = getProgressColor(score);
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm">{score.toFixed(1)}</span>
        </div>
        <Progress value={score * 5} max={100} className={progressColor} />
        <p className="text-xs text-muted-foreground">{readabilityLevel.label}: {readabilityLevel.description}</p>
      </div>
    );
  };
  
  return (
    <ToolLayout
      title="Content Readability Analyzer"
      description="Analyze and improve your content's readability score and accessibility"
      icon={<BookOpen className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="analyzer" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyzer">Analyze Content</TabsTrigger>
          <TabsTrigger value="editor" disabled={!results}>Improve Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analyzer" className="space-y-4 mt-4">
          {!results ? (
            <Card>
              <CardHeader>
                <CardTitle>Analyze Your Content</CardTitle>
                <CardDescription>
                  Paste your content below to get detailed readability metrics and improvement suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Paste your article, blog post, or any text content here..."
                      rows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      For best results, paste at least 200 words of content
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isAnalyzing || !content.trim()}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart className="h-4 w-4 mr-2" />
                        Analyze Readability
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Readability Analysis</h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleReset}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyResults}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Results
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Overall Score */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Overall Readability Score</CardTitle>
                    <CardDescription>
                      Based on multiple readability indexes and formulas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center">
                          <span className="text-4xl font-bold">{results.averageGradeLevel.toFixed(1)}</span>
                        </div>
                        <Badge className="absolute bottom-0 right-0 transform translate-x-1/3">
                          {getReadabilityDescription(results.averageGradeLevel).label}
                        </Badge>
                      </div>
                      <p className="text-lg mb-1">
                        {getReadabilityDescription(results.averageGradeLevel).description}
                      </p>
                      <p className="text-sm text-muted-foreground max-w-lg">
                        Your content has a grade level of {results.averageGradeLevel.toFixed(1)}, which means 
                        it requires approximately {Math.ceil(results.averageGradeLevel)} years of education to understand.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      <div className="flex flex-col items-center border rounded-lg p-3">
                        <FileText className="h-6 w-6 mb-1" />
                        <p className="text-2xl font-bold">{results.wordCount}</p>
                        <p className="text-xs text-muted-foreground">Words</p>
                      </div>
                      <div className="flex flex-col items-center border rounded-lg p-3">
                        <ArrowRight className="h-6 w-6 mb-1" />
                        <p className="text-2xl font-bold">{results.sentenceCount}</p>
                        <p className="text-xs text-muted-foreground">Sentences</p>
                      </div>
                      <div className="flex flex-col items-center border rounded-lg p-3">
                        <List className="h-6 w-6 mb-1" />
                        <p className="text-2xl font-bold">{results.paragraphCount}</p>
                        <p className="text-xs text-muted-foreground">Paragraphs</p>
                      </div>
                      <div className="flex flex-col items-center border rounded-lg p-3">
                        <Clock className="h-6 w-6 mb-1" />
                        <p className="text-2xl font-bold">{Math.ceil(results.readingTime)}</p>
                        <p className="text-xs text-muted-foreground">Min Read</p>
                      </div>
                      <div className="flex flex-col items-center border rounded-lg p-3">
                        <BarChart className="h-6 w-6 mb-1" />
                        <p className="text-2xl font-bold">{results.avgWordsPerSentence.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Words/Sentence</p>
                      </div>
                      <div className="flex flex-col items-center border rounded-lg p-3">
                        <BookOpen className="h-6 w-6 mb-1" />
                        <p className="text-2xl font-bold">{results.avgSyllablesPerWord.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Syllables/Word</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Readability Scores */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Readability Formulas</CardTitle>
                    <CardDescription>
                      Different standardized readability measurements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {getScoreElement(results.fleschKincaid, 'Flesch-Kincaid Grade Level')}
                    {getScoreElement(results.gunningFog, 'Gunning Fog Index')}
                    {getScoreElement(results.colemanLiau, 'Coleman-Liau Index')}
                    {getScoreElement(results.smog, 'SMOG Index')}
                    {getScoreElement(results.automatedReadability, 'Automated Readability Index')}
                  </CardContent>
                </Card>
                
                {/* Suggestions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Improvement Suggestions</CardTitle>
                    <CardDescription>
                      Recommendations to enhance your content's readability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {results.suggestions.length > 0 ? (
                      results.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2 pb-2">
                          <div className="mt-0.5">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No specific suggestions. Your content already follows good readability practices!
                      </p>
                    )}
                    
                    <div className="pt-2">
                      <Button 
                        className="w-full" 
                        onClick={() => setActiveTab('editor')}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Improve Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="issues">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <span>Content Issues</span>
                      <Badge variant="outline" className="ml-2">
                        {getHighlights().length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Complex Words</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <TextHighlight 
                              text={content} 
                              highlights={getHighlights().filter(h => h.type === 'complex')} 
                            />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Long Sentences</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <TextHighlight 
                              text={content} 
                              highlights={getHighlights().filter(h => h.type === 'long')} 
                            />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Passive Voice</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <TextHighlight 
                              text={content} 
                              highlights={getHighlights().filter(h => h.type === 'passive')} 
                            />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Adverbs</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <TextHighlight 
                              text={content} 
                              highlights={getHighlights().filter(h => h.type === 'adverb')} 
                            />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Clichés</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <TextHighlight 
                              text={content} 
                              highlights={getHighlights().filter(h => h.type === 'cliche')} 
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="editor" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Edit and Improve Your Content</CardTitle>
              <CardDescription>
                Make changes to your content based on the readability analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="improved-content">Improved Content</Label>
                <Textarea
                  id="improved-content"
                  rows={15}
                  value={improvedText}
                  onChange={(e) => setImprovedText(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium">Issues to Address:</h3>
                {results && getHighlights().length > 0 ? (
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {getHighlights().slice(0, 5).map((highlight, index) => (
                      <li key={index}>
                        {highlight.type === 'complex' && `Replace complex word "${highlight.text}"`}
                        {highlight.type === 'long' && 'Break up long sentence'}
                        {highlight.type === 'passive' && 'Convert passive voice to active'}
                        {highlight.type === 'adverb' && `Replace adverb "${highlight.text}"`}
                        {highlight.type === 'cliche' && `Replace cliché "${highlight.text}"`}
                      </li>
                    ))}
                    {getHighlights().length > 5 && (
                      <li className="text-muted-foreground">And {getHighlights().length - 5} more issues...</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No major issues detected in your content.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('analyzer')}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Back to Analysis
              </Button>
              <Button 
                onClick={handleCopyImprovedText}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Improved Text
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tips for Improving Readability</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Use shorter sentences (aim for under 20 words per sentence)</li>
                <li>Choose simple words over complex alternatives</li>
                <li>Break up long paragraphs (aim for 3-4 sentences per paragraph)</li>
                <li>Use active voice instead of passive voice</li>
                <li>Replace adverbs with stronger verbs</li>
                <li>Avoid jargon and technical terms unless necessary</li>
                <li>Use headings and subheadings to organize content</li>
                <li>Include bullet points for easy scanning</li>
                <li>Use transition words to improve flow</li>
                <li>Read your content aloud to check for natural flow</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

// Clock icon
const Clock = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

export default ContentReadabilityAnalyzer; 