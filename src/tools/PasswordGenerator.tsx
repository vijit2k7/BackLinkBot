import React, { useState, useEffect } from 'react';
import { KeyRound, RefreshCw, Copy, Check, BarChart, Shield, ShieldAlert, ShieldCheck, Info, Lock } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Toast } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';

const PasswordGenerator = () => {
  // Password settings
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  
  // Result
  const [password, setPassword] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  
  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+{}[]|:;"<>,.?/~`';
  const similarChars = 'il1Lo0O';
  const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
  
  // Generate a password on initial load
  useEffect(() => {
    generatePassword();
  }, []);
  
  // Calculate the estimated time to crack the password
  const calculateTimeToCrack = (password: string): string => {
    // This is a simplified estimate
    const possibleChars = calculatePossibleChars();
    const combinations = Math.pow(possibleChars, password.length);
    const guessesPerSecond = 1000000000; // Assume 1 billion guesses per second
    
    const seconds = combinations / guessesPerSecond;
    
    if (seconds < 1) return 'Less than a second';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    
    return 'Millions of years';
  };
  
  // Calculate total possible characters in the charset
  const calculatePossibleChars = (): number => {
    let chars = '';
    
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;
    
    if (excludeSimilar) {
      similarChars.split('').forEach(char => {
        chars = chars.replace(char, '');
      });
    }
    
    if (excludeAmbiguous) {
      ambiguousChars.split('').forEach(char => {
        chars = chars.replace(char, '');
      });
    }
    
    // Ensure we have at least 1 character
    return chars.length || 1;
  };
  
  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length contribution (max 40%)
    const lengthScore = Math.min(password.length / 20, 1) * 40;
    strength += lengthScore;
    
    // Character variety contribution (max 60%)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    const varietyScore = ((hasUppercase ? 15 : 0) + 
                          (hasLowercase ? 15 : 0) + 
                          (hasNumbers ? 15 : 0) + 
                          (hasSymbols ? 15 : 0));
    
    strength += varietyScore;
    
    return Math.min(Math.round(strength), 100);
  };
  
  // Get strength text and color
  const getStrengthInfo = (strength: number): { text: string; color: string; icon: JSX.Element } => {
    if (strength < 30) {
      return { 
        text: 'Very Weak', 
        color: 'bg-red-500', 
        icon: <ShieldAlert className="h-4 w-4 text-red-500" /> 
      };
    } else if (strength < 50) {
      return { 
        text: 'Weak', 
        color: 'bg-orange-500', 
        icon: <Shield className="h-4 w-4 text-orange-500" /> 
      };
    } else if (strength < 70) {
      return { 
        text: 'Moderate', 
        color: 'bg-yellow-500', 
        icon: <Shield className="h-4 w-4 text-yellow-500" /> 
      };
    } else if (strength < 90) {
      return { 
        text: 'Strong', 
        color: 'bg-green-500', 
        icon: <ShieldCheck className="h-4 w-4 text-green-500" /> 
      };
    } else {
      return { 
        text: 'Very Strong', 
        color: 'bg-blue-500', 
        icon: <ShieldCheck className="h-4 w-4 text-blue-500" /> 
      };
    }
  };
  
  // Generate a random password based on settings
  const generatePassword = () => {
    // Validation - ensure at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Invalid settings",
        description: "You must select at least one character type to include.",
        variant: "destructive"
      });
      return;
    }
    
    // Build character set based on options
    let chars = '';
    
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;
    
    // Remove similar characters if option is selected
    if (excludeSimilar) {
      similarChars.split('').forEach(char => {
        chars = chars.replace(char, '');
      });
    }
    
    // Remove ambiguous characters if option is selected
    if (excludeAmbiguous) {
      ambiguousChars.split('').forEach(char => {
        chars = chars.replace(char, '');
      });
    }
    
    // Generate random password
    let newPassword = '';
    let missingRequirements = true;
    
    while (missingRequirements) {
      newPassword = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        newPassword += chars[randomIndex];
      }
      
      // Ensure all requirements are met
      const hasUppercaseChar = !includeUppercase || /[A-Z]/.test(newPassword);
      const hasLowercaseChar = !includeLowercase || /[a-z]/.test(newPassword);
      const hasNumberChar = !includeNumbers || /[0-9]/.test(newPassword);
      const hasSymbolChar = !includeSymbols || /[^A-Za-z0-9]/.test(newPassword);
      
      missingRequirements = !(hasUppercaseChar && hasLowercaseChar && hasNumberChar && hasSymbolChar);
    }
    
    // Calculate strength
    const strength = calculatePasswordStrength(newPassword);
    
    // Update state
    setPassword(newPassword);
    setPasswordStrength(strength);
    setCopiedToClipboard(false);
    
    // Add to history, keeping only last 5 passwords
    setPasswordHistory(prev => {
      const updated = [newPassword, ...prev];
      return updated.slice(0, 5);
    });
  };
  
  // Copy password to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopiedToClipboard(true);
      
      toast({
        title: "Copied to clipboard!",
        description: "Your password has been copied to your clipboard.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedToClipboard(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy password:', err);
      toast({
        title: "Failed to copy",
        description: "There was a problem copying to clipboard. Please try again.",
        variant: "destructive"
      });
    });
  };
  
  const strengthInfo = getStrengthInfo(passwordStrength);
  
  return (
    <ToolLayout
      title="Password Generator"
      description="Create strong, secure passwords for your online accounts"
      icon={<KeyRound className="h-6 w-6 text-blue-500" />}
      helpText="Use the settings below to customize your password, then generate a new one or copy it to use."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Password Result Card */}
          <Card className="border-blue-100">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Your Secure Password</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  value={password}
                  className="pr-24 text-lg font-mono py-6 bg-gray-50"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generatePassword}
                    title="Generate new password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    {copiedToClipboard ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center text-sm mb-1">
                  <div className="flex items-center">
                    {strengthInfo.icon}
                    <span className="ml-1">{strengthInfo.text}</span>
                  </div>
                  <span className="text-gray-500">{passwordStrength}%</span>
                </div>
                <Progress value={passwordStrength} className={strengthInfo.color} />
              </div>
              
              <div className="mt-3 text-xs text-gray-500 flex items-start gap-1">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Estimated time to crack: {calculateTimeToCrack(password)}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Generator Settings */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg">Password Settings</CardTitle>
              <CardDescription>
                Customize your password preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Length */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password-length">Password Length</Label>
                  <span className="text-sm font-medium">{length} characters</span>
                </div>
                <Slider
                  id="password-length"
                  min={6}
                  max={32}
                  step={1}
                  value={[length]}
                  onValueChange={(values) => setLength(values[0])}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>6</span>
                  <span>12</span>
                  <span>18</span>
                  <span>24</span>
                  <span>32</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Character Types */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Character Types</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="include-uppercase" className="cursor-pointer">
                      Include Uppercase Letters (A-Z)
                    </Label>
                  </div>
                  <Switch
                    id="include-uppercase"
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="include-lowercase" className="cursor-pointer">
                      Include Lowercase Letters (a-z)
                    </Label>
                  </div>
                  <Switch
                    id="include-lowercase"
                    checked={includeLowercase}
                    onCheckedChange={setIncludeLowercase}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="include-numbers" className="cursor-pointer">
                      Include Numbers (0-9)
                    </Label>
                  </div>
                  <Switch
                    id="include-numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="include-symbols" className="cursor-pointer">
                      Include Symbols (!@#$%^&*)
                    </Label>
                  </div>
                  <Switch
                    id="include-symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Additional Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Additional Options</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="exclude-similar" className="cursor-pointer">
                      Exclude Similar Characters (i, l, 1, L, o, 0, O)
                    </Label>
                  </div>
                  <Switch
                    id="exclude-similar"
                    checked={excludeSimilar}
                    onCheckedChange={setExcludeSimilar}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="exclude-ambiguous" className="cursor-pointer">
                      Exclude Ambiguous Characters ({`{}`}[]()/ \ ' " ~ , ; : . &lt; &gt;)
                    </Label>
                  </div>
                  <Switch
                    id="exclude-ambiguous"
                    checked={excludeAmbiguous}
                    onCheckedChange={setExcludeAmbiguous}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 p-4 flex justify-center">
              <Button 
                onClick={generatePassword}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Password
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Password History */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg">Password History</CardTitle>
              <CardDescription>
                Your last 5 generated passwords
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordHistory.length > 0 ? (
                <ul className="space-y-2">
                  {passwordHistory.map((pwd, index) => (
                    <li key={index} className="relative group">
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded-md pr-10 truncate">
                        {pwd}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          navigator.clipboard.writeText(pwd);
                          toast({
                            title: "Copied to clipboard!",
                            description: "Password has been copied.",
                          });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Lock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No passwords generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Password Tips */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg">Password Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use a different password for each account</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Longer passwords are generally more secure than complex shorter ones</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use a password manager to store your passwords securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enable two-factor authentication when available</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Change your passwords regularly, especially for important accounts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PasswordGenerator; 