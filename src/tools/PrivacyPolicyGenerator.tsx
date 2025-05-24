import React, { useState } from 'react';
import { FileText, ArrowRight, Loader2, Download, Copy, Save, CheckSquare, ShieldCheck, Info } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const PrivacyPolicyGenerator = () => {
  // Company information
  const [companyName, setCompanyName] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [country, setCountry] = useState<string>('United States');
  
  // Data collection practices
  const [collectsPersonalData, setCollectsPersonalData] = useState<boolean>(true);
  const [collectsLocation, setCollectsLocation] = useState<boolean>(false);
  const [collectsDeviceInfo, setCollectsDeviceInfo] = useState<boolean>(true);
  const [collectsCookies, setCollectsCookies] = useState<boolean>(true);
  const [collectsChildren, setCollectsChildren] = useState<boolean>(false);
  
  // Data usage
  const [usesAnalytics, setUsesAnalytics] = useState<boolean>(true);
  const [usesAdvertising, setUsesAdvertising] = useState<boolean>(true);
  const [sharesWithThirdParties, setSharesWithThirdParties] = useState<boolean>(true);
  const [thirdPartyServices, setThirdPartyServices] = useState<string>('Google Analytics, Google AdSense');
  
  // Compliance checkboxes
  const [ccpaCompliant, setCcpaCompliant] = useState<boolean>(false);
  const [gdprCompliant, setGdprCompliant] = useState<boolean>(false);
  const [caliOppaCompliant, setCaliOppaCompliant] = useState<boolean>(false);
  
  // Policy customization
  const [additionalClauses, setAdditionalClauses] = useState<string>('');
  const [policyStyle, setPolicyStyle] = useState<string>('standard');
  
  // Generated policy state
  const [generatedPolicy, setGeneratedPolicy] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('generator');
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim() || !websiteUrl.trim() || !companyEmail.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your company name, website URL, and contact email.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const policy = generatePrivacyPolicy();
      setGeneratedPolicy(policy);
      setActiveTab('preview');
      setIsGenerating(false);
      
      toast({
        title: "Privacy Policy generated!",
        description: "Your privacy policy has been created. Review and download it.",
      });
    }, 2000);
  };
  
  // Generate a privacy policy based on the provided information
  const generatePrivacyPolicy = (): string => {
    let policy = `# Privacy Policy for ${companyName}

**Effective Date:** ${effectiveDate}

## Introduction

Welcome to ${companyName}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (${websiteUrl}) and tell you about your privacy rights and how the law protects you.

`;

    // Add GDPR specific information if needed
    if (gdprCompliant) {
      policy += `## For European Union Residents (GDPR Compliance)

If you are a resident of the European Union, you have specific rights regarding your personal data under the General Data Protection Regulation (GDPR).

- **Right to Access:** You have the right to request copies of your personal data.
- **Right to Rectification:** You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
- **Right to Erasure:** You have the right to request that we erase your personal data, under certain conditions.
- **Right to Restrict Processing:** You have the right to request that we restrict the processing of your personal data, under certain conditions.
- **Right to Object to Processing:** You have the right to object to our processing of your personal data, under certain conditions.
- **Right to Data Portability:** You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.

For any GDPR-related requests, please contact us at ${companyEmail}.

`;
    }

    // Add CCPA specific information if needed
    if (ccpaCompliant) {
      policy += `## For California Residents (CCPA Compliance)

Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their personal information:

- **Right to Know:** You have the right to request disclosure of the categories and specific pieces of personal information we have collected about you, the categories of sources from which your personal information is collected, the business purpose for collecting your personal information, and the categories of third parties with whom we share your personal information.
- **Right to Delete:** You have the right to request deletion of your personal information, subject to certain exceptions.
- **Right to Opt-Out:** You have the right to opt-out of the sale of your personal information.
- **Right to Non-Discrimination:** We will not discriminate against you for exercising any of your CCPA rights.

To exercise your rights under the CCPA, please contact us at ${companyEmail}.

`;
    }

    policy += `## Information We Collect

`;

    if (collectsPersonalData) {
      policy += `### Personal Information

We may collect, use, store and transfer different kinds of personal information about you which we have grouped together as follows:

- **Identity Data:** Includes name, username or similar identifier.
- **Contact Data:** Includes email address and telephone numbers.
- **Technical Data:** Includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access this website.
- **Usage Data:** Includes information about how you use our website, products, and services.

`;
    }

    if (collectsLocation) {
      policy += `### Location Information

We may collect information about your location if you permit us to do so through your device settings. This helps us provide location-based services and improve our website.

`;
    }

    if (collectsDeviceInfo) {
      policy += `### Device Information

We collect information about the device you use to access our website, including the hardware model, operating system and version, unique device identifiers, and mobile network information.

`;
    }

    if (collectsCookies) {
      policy += `### Cookies and Similar Technologies

We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.

`;
    }

    if (collectsChildren) {
      policy += `### Children's Privacy

Our website is intended for use by individuals who are at least 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us at ${companyEmail} so that we can take necessary actions.

`;
    } else {
      policy += `### Children's Privacy

Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 13, please contact us at ${companyEmail}.

`;
    }

    policy += `## How We Use Your Information

We use the information we collect about you for various purposes, including:

`;

    const purposes = [];
    if (usesAnalytics) purposes.push("To analyze website usage and improve our services");
    if (usesAdvertising) purposes.push("To display personalized advertisements");
    if (sharesWithThirdParties) purposes.push("To share with our trusted third-party service providers");
    purposes.push("To respond to your requests or inquiries");
    purposes.push("To comply with applicable laws and regulations");

    purposes.forEach(purpose => {
      policy += `- ${purpose}\n`;
    });

    policy += `\n`;

    if (sharesWithThirdParties && thirdPartyServices) {
      policy += `## Third-Party Services

We may use third-party services such as ${thirdPartyServices} to support our website, assist us in analyzing how our website is used, and for advertising purposes. These third parties may use cookies and similar technologies to collect information about your use of our website and other websites.

`;
    }

    policy += `## Data Security

We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date at the top.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at ${companyEmail}.

`;

    if (additionalClauses.trim()) {
      policy += `## Additional Information

${additionalClauses}

`;
    }

    // Add a disclaimer
    policy += `---

*This privacy policy was generated using an automated tool and may need to be reviewed by a legal professional before implementation. ${companyName} is responsible for ensuring this policy complies with all applicable laws and regulations.*
`;

    return policy;
  };
  
  // Download policy as text file
  const downloadPolicy = () => {
    if (!generatedPolicy) return;
    
    const blob = new Blob([generatedPolicy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `privacy-policy-${companyName.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Privacy Policy downloaded!",
      description: "Your privacy policy has been downloaded as a Markdown file.",
    });
  };
  
  // Copy policy to clipboard
  const copyToClipboard = () => {
    if (!generatedPolicy) return;
    
    navigator.clipboard.writeText(generatedPolicy);
    
    toast({
      title: "Copied to clipboard!",
      description: "Your privacy policy has been copied to your clipboard.",
    });
  };
  
  // Create HTML version of the policy
  const getHtmlPolicy = (): string => {
    if (!generatedPolicy) return '';
    
    // Convert markdown to simple HTML
    let html = generatedPolicy
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n- (.*)/g, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul>/g, '')
      .replace(/\n\n/g, '<br><br>');
    
    return html;
  };
  
  // Download as HTML
  const downloadHtml = () => {
    if (!generatedPolicy) return;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - ${companyName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      font-size: 28px;
    }
    h2 {
      margin-top: 30px;
      font-size: 22px;
      color: #444;
    }
    h3 {
      font-size: 18px;
      color: #555;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  ${getHtmlPolicy()}
  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `privacy-policy-${companyName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "HTML version downloaded!",
      description: "Your privacy policy has been downloaded as an HTML file.",
    });
  };
  
  return (
    <ToolLayout
      title="Privacy Policy Generator"
      description="Create a custom privacy policy for your website or app"
      icon={<ShieldCheck className="h-6 w-6 text-teal-500" />}
      helpText="Fill in your business details and data practices to generate a professional privacy policy."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="generator">Generate Policy</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedPolicy}>
            Preview Generated Policy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Information</CardTitle>
                <CardDescription>
                  Provide basic information about your business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-name">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company-name"
                      placeholder="Acme Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website-url">
                      Website URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="website-url"
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-email">
                      Contact Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="privacy@example.com"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="effective-date">
                      Effective Date
                    </Label>
                    <Input
                      id="effective-date"
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">
                    Primary Country of Operation
                  </Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Collection Practices</CardTitle>
                <CardDescription>
                  Select what types of information you collect from users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="collects-personal-data" 
                      checked={collectsPersonalData}
                      onCheckedChange={(checked) => setCollectsPersonalData(checked as boolean)} 
                    />
                    <Label htmlFor="collects-personal-data">Collect personal information (name, email, etc.)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="collects-location" 
                      checked={collectsLocation}
                      onCheckedChange={(checked) => setCollectsLocation(checked as boolean)} 
                    />
                    <Label htmlFor="collects-location">Collect location information</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="collects-device-info" 
                      checked={collectsDeviceInfo}
                      onCheckedChange={(checked) => setCollectsDeviceInfo(checked as boolean)} 
                    />
                    <Label htmlFor="collects-device-info">Collect device information</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="collects-cookies" 
                      checked={collectsCookies}
                      onCheckedChange={(checked) => setCollectsCookies(checked as boolean)} 
                    />
                    <Label htmlFor="collects-cookies">Use cookies and similar tracking technologies</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="collects-children" 
                      checked={collectsChildren}
                      onCheckedChange={(checked) => setCollectsChildren(checked as boolean)} 
                    />
                    <Label htmlFor="collects-children">Collect information from children under 13</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Usage</CardTitle>
                <CardDescription>
                  How you use and share the collected information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="uses-analytics" 
                      checked={usesAnalytics}
                      onCheckedChange={(checked) => setUsesAnalytics(checked as boolean)} 
                    />
                    <Label htmlFor="uses-analytics">Use analytics services</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="uses-advertising" 
                      checked={usesAdvertising}
                      onCheckedChange={(checked) => setUsesAdvertising(checked as boolean)} 
                    />
                    <Label htmlFor="uses-advertising">Use targeted advertising</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shares-third-parties" 
                      checked={sharesWithThirdParties}
                      onCheckedChange={(checked) => setSharesWithThirdParties(checked as boolean)} 
                    />
                    <Label htmlFor="shares-third-parties">Share information with third parties</Label>
                  </div>
                </div>
                
                {sharesWithThirdParties && (
                  <div>
                    <Label htmlFor="third-party-services">
                      Third-Party Services (comma separated)
                    </Label>
                    <Input
                      id="third-party-services"
                      placeholder="Google Analytics, Facebook Pixel, etc."
                      value={thirdPartyServices}
                      onChange={(e) => setThirdPartyServices(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Requirements</CardTitle>
                <CardDescription>
                  Select applicable privacy regulations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="gdpr-compliant" 
                      checked={gdprCompliant}
                      onCheckedChange={(checked) => setGdprCompliant(checked as boolean)} 
                    />
                    <Label htmlFor="gdpr-compliant">
                      GDPR (General Data Protection Regulation - EU)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ccpa-compliant" 
                      checked={ccpaCompliant}
                      onCheckedChange={(checked) => setCcpaCompliant(checked as boolean)} 
                    />
                    <Label htmlFor="ccpa-compliant">
                      CCPA (California Consumer Privacy Act)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cali-oppa-compliant" 
                      checked={caliOppaCompliant}
                      onCheckedChange={(checked) => setCaliOppaCompliant(checked as boolean)} 
                    />
                    <Label htmlFor="cali-oppa-compliant">
                      CalOPPA (California Online Privacy Protection Act)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Customization</CardTitle>
                <CardDescription>
                  Add any additional clauses or information to your privacy policy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="additional-clauses">
                    Additional Information or Clauses
                  </Label>
                  <Textarea
                    id="additional-clauses"
                    placeholder="Enter any additional information or specific clauses you want to include in your privacy policy..."
                    value={additionalClauses}
                    onChange={(e) => setAdditionalClauses(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="policy-style">
                    Policy Style
                  </Label>
                  <Select value={policyStyle} onValueChange={setPolicyStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="simple">Simplified</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Privacy Policy...
                  </>
                ) : (
                  <>
                    Generate Privacy Policy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="disclaimer">
                <AccordionTrigger>
                  <div className="flex items-center text-amber-600">
                    <Info className="mr-2 h-4 w-4" />
                    <span>Important Disclaimer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>This privacy policy generator is provided as a tool to help you create a basic privacy policy for your website or application. While we strive to provide accurate and up-to-date information, we cannot guarantee that the generated policy will be legally compliant with all applicable laws and regulations.</p>
                    <p>The generated policy should be reviewed by a qualified legal professional before implementation. Privacy laws vary by jurisdiction and may change over time.</p>
                    <p>By using this tool, you acknowledge that we are not providing legal advice and that you are responsible for ensuring your privacy practices comply with all applicable laws and regulations.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          {generatedPolicy && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Privacy Policy Preview</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Text
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={downloadPolicy}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download as MD
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={downloadHtml}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download as HTML
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <div className="bg-gray-50 p-6 rounded-md overflow-auto max-h-[800px]">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{generatedPolicy}</pre>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <div className="flex items-center text-xs text-gray-500">
                    <ShieldCheck className="mr-2 h-4 w-4 text-teal-500" />
                    <p>This privacy policy was generated on {new Date().toLocaleDateString()}. We recommend having it reviewed by a legal professional.</p>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Next Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Review the generated policy and make any necessary changes to match your specific practices.</li>
                  <li>Consider having the policy reviewed by a legal professional familiar with privacy laws in your jurisdiction.</li>
                  <li>Add the privacy policy to your website, typically in the footer and during user registration.</li>
                  <li>Keep your privacy policy updated as your practices change or as privacy laws evolve.</li>
                </ol>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default PrivacyPolicyGenerator; 