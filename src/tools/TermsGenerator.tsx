import React, { useState } from 'react';
import { FileText, ArrowRight, Loader2, Download, Copy, Scale, Info, Check } from 'lucide-react';
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

const TermsGenerator = () => {
  // Company information
  const [companyName, setCompanyName] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [country, setCountry] = useState<string>('United States');
  
  // Website type
  const [websiteType, setWebsiteType] = useState<string>('business');
  const [sellingProducts, setSellingProducts] = useState<boolean>(false);
  const [sellingServices, setSellingServices] = useState<boolean>(false);
  const [userAccounts, setUserAccounts] = useState<boolean>(true);
  const [userContent, setUserContent] = useState<boolean>(false);
  
  // Legal policies
  const [jurisdictionState, setJurisdictionState] = useState<string>('California');
  const [disputeResolution, setDisputeResolution] = useState<string>('arbitration');
  const [requireArbitration, setRequireArbitration] = useState<boolean>(true);
  const [limitLiability, setLimitLiability] = useState<boolean>(true);
  const [includeWarrantyDisclaimer, setIncludeWarrantyDisclaimer] = useState<boolean>(true);
  const [includeCopyright, setIncludeCopyright] = useState<boolean>(true);
  
  // Additional options
  const [minimumAge, setMinimumAge] = useState<string>('13');
  const [termination, setTermination] = useState<boolean>(true);
  const [additionalClauses, setAdditionalClauses] = useState<string>('');
  
  // Generated terms state
  const [generatedTerms, setGeneratedTerms] = useState<string>('');
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
      const terms = generateTerms();
      setGeneratedTerms(terms);
      setActiveTab('preview');
      setIsGenerating(false);
      
      toast({
        title: "Terms of Service generated!",
        description: "Your terms of service have been created. Review and download them.",
      });
    }, 2000);
  };
  
  // Generate terms of service based on the provided information
  const generateTerms = (): string => {
    let terms = `# Terms of Service for ${companyName}

**Effective Date:** ${effectiveDate}

## Introduction

Welcome to ${websiteUrl.replace(/^https?:\/\//, '')}. These Terms of Service ("Terms") govern your access to and use of ${companyName}'s website and services. By accessing or using our services, you agree to be bound by these Terms.

`;

    terms += `## Definitions

- "Company", "We", "Us", or "Our" refers to ${companyName}.
- "Website" refers to ${websiteUrl.replace(/^https?:\/\//, '')}.
- "User", "You", or "Your" refers to the individual accessing or using our services.
- "Services" refers to all products, services, content, features, technologies, or functions offered by ${companyName}.

`;

    if (userAccounts) {
      terms += `## User Accounts

You may need to create an account to use some of our Services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.

You are responsible for providing accurate and complete information when creating your account. You agree not to impersonate any person or entity or misrepresent your identity or affiliation with any person or entity.

`;
    }

    if (minimumAge) {
      terms += `## Age Restrictions

Our Services are available only to users who are at least ${minimumAge} years old. By using our Services, you represent and warrant that you meet this age requirement.

`;
    }

    if (userContent) {
      terms += `## User Content

Our Services may allow you to post, submit, or transmit content, including reviews, comments, feedback, and suggestions. By providing User Content, you grant us a worldwide, non-exclusive, royalty-free, fully-paid, perpetual, irrevocable, transferable, and fully sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content throughout the world in any media.

You represent and warrant that: (i) you own the User Content or have the right to grant the rights described above, and (ii) the User Content does not violate the privacy rights, publicity rights, copyright rights, or other rights of any person.

`;
    }

    if (sellingProducts || sellingServices) {
      terms += `## ${sellingProducts ? 'Products and ' : ''}${sellingServices ? 'Services' : ''}

${sellingProducts ? `The products available on our Website may be subject to shipping restrictions and return policies, which are described elsewhere on our Website.` : ''}

${sellingServices ? `We provide various services as described on our Website. We reserve the right to modify or discontinue any service with or without notice to you.` : ''}

All descriptions of products and services are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product or service at any time.

`;
    }

    terms += `## Prohibited Uses

You agree not to use our Services:

- In any way that violates any applicable federal, state, local, or international law or regulation.
- To transmit, or procure the sending of, any advertising or promotional material, including "spam".
- To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.
- To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services.
- To introduce any viruses, trojan horses, worms, or other material which is malicious or technologically harmful.

`;

    if (includeCopyright) {
      terms += `## Intellectual Property

The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by ${companyName}, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.

`;
    }

    if (includeWarrantyDisclaimer) {
      terms += `## Disclaimer of Warranties

YOUR USE OF THE WEBSITE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE IS AT YOUR OWN RISK. THE WEBSITE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE WEBSITE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

NEITHER THE COMPANY NOR ANY PERSON ASSOCIATED WITH THE COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE WEBSITE.

THE FOREGOING DOES NOT AFFECT ANY WARRANTIES THAT CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.

`;
    }

    if (limitLiability) {
      terms += `## Limitation of Liability

IN NO EVENT WILL THE COMPANY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE WEBSITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE WEBSITE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.

THE FOREGOING DOES NOT AFFECT ANY LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.

`;
    }

    if (disputeResolution === 'arbitration' && requireArbitration) {
      terms += `## Arbitration

Any dispute arising from or relating to these Terms or our Services shall be resolved through final and binding arbitration. The arbitration will be conducted by JAMS under its applicable rules, and the award of the arbitrator(s) shall be enforceable in any court having jurisdiction.

YOU UNDERSTAND THAT BY AGREEING TO THESE TERMS, YOU AND THE COMPANY ARE EACH WAIVING THE RIGHT TO A JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION.

`;
    } else {
      terms += `## Governing Law and Jurisdiction

These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of the State of ${jurisdictionState}, without regard to its conflict of law provisions.

${
  disputeResolution === 'litigation' 
    ? `Any legal suit, action, or proceeding arising out of or related to these Terms or our Services shall be instituted exclusively in the federal courts of the United States or the courts of the State of ${jurisdictionState}.` 
    : ''
}

`;
    }

    if (termination) {
      terms += `## Termination

We may terminate or suspend your account and bar access to our Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of these Terms.

If you wish to terminate your account, you may simply discontinue using our Services, or notify us that you wish to delete your account.

All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.

`;
    }

    terms += `## Changes to Terms

We may revise these Terms at any time by updating this page. All changes are effective immediately when we post them, and apply to all access to and use of the Website thereafter.

Your continued use of the Website following the posting of revised Terms means that you accept and agree to the changes.

## Contact Us

If you have any questions about these Terms, please contact us at ${companyEmail}.

`;

    if (additionalClauses.trim()) {
      terms += `## Additional Terms

${additionalClauses}

`;
    }

    // Add a disclaimer
    terms += `---

*These terms of service were generated using an automated tool and may need to be reviewed by a legal professional before implementation. ${companyName} is responsible for ensuring these terms comply with all applicable laws and regulations.*
`;

    return terms;
  };
  
  // Download terms as text file
  const downloadTerms = () => {
    if (!generatedTerms) return;
    
    const blob = new Blob([generatedTerms], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `terms-of-service-${companyName.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Terms of Service downloaded!",
      description: "Your terms of service have been downloaded as a Markdown file.",
    });
  };
  
  // Copy terms to clipboard
  const copyToClipboard = () => {
    if (!generatedTerms) return;
    
    navigator.clipboard.writeText(generatedTerms);
    
    toast({
      title: "Copied to clipboard!",
      description: "Your terms of service have been copied to your clipboard.",
    });
  };
  
  // Create HTML version of the terms
  const getHtmlTerms = (): string => {
    if (!generatedTerms) return '';
    
    // Convert markdown to simple HTML
    let html = generatedTerms
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
    if (!generatedTerms) return;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - ${companyName}</title>
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
  ${getHtmlTerms()}
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
    link.download = `terms-of-service-${companyName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "HTML version downloaded!",
      description: "Your terms of service have been downloaded as an HTML file.",
    });
  };
  
  return (
    <ToolLayout
      title="Terms of Service Generator"
      description="Create custom terms of service for your website or app"
      icon={<Scale className="h-6 w-6 text-indigo-500" />}
      helpText="Fill in your business details and requirements to generate professional terms of service."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="generator">Generate Terms</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedTerms}>
            Preview Generated Terms
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
                      placeholder="legal@example.com"
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
                
                {country === 'United States' && (
                  <div>
                    <Label htmlFor="jurisdiction">
                      Governing Law State
                    </Label>
                    <Select value={jurisdictionState} onValueChange={setJurisdictionState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Delaware">Delaware</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Website Type and Features</CardTitle>
                <CardDescription>
                  Select the options that apply to your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website-type">
                    Website Type
                  </Label>
                  <Select value={websiteType} onValueChange={setWebsiteType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select website type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business/Company Website</SelectItem>
                      <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                      <SelectItem value="blog">Blog or Content Website</SelectItem>
                      <SelectItem value="saas">SaaS or Web Application</SelectItem>
                      <SelectItem value="portfolio">Portfolio or Personal Website</SelectItem>
                      <SelectItem value="forum">Forum or Community</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="selling-products" 
                      checked={sellingProducts}
                      onCheckedChange={(checked) => setSellingProducts(checked as boolean)} 
                    />
                    <Label htmlFor="selling-products">Selling physical or digital products</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="selling-services" 
                      checked={sellingServices}
                      onCheckedChange={(checked) => setSellingServices(checked as boolean)} 
                    />
                    <Label htmlFor="selling-services">Offering services</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="user-accounts" 
                      checked={userAccounts}
                      onCheckedChange={(checked) => setUserAccounts(checked as boolean)} 
                    />
                    <Label htmlFor="user-accounts">Users can create accounts</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="user-content" 
                      checked={userContent}
                      onCheckedChange={(checked) => setUserContent(checked as boolean)} 
                    />
                    <Label htmlFor="user-content">Users can submit content (comments, reviews, etc.)</Label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="minimum-age">
                    Minimum Age Requirement
                  </Label>
                  <Select value={minimumAge} onValueChange={setMinimumAge}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select minimum age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13">13 years old</SelectItem>
                      <SelectItem value="16">16 years old</SelectItem>
                      <SelectItem value="18">18 years old</SelectItem>
                      <SelectItem value="21">21 years old</SelectItem>
                      <SelectItem value="0">No age restriction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Provisions</CardTitle>
                <CardDescription>
                  Select which legal provisions to include in your terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="limit-liability" 
                      checked={limitLiability}
                      onCheckedChange={(checked) => setLimitLiability(checked as boolean)} 
                    />
                    <Label htmlFor="limit-liability">Include limitation of liability clause</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="warranty-disclaimer" 
                      checked={includeWarrantyDisclaimer}
                      onCheckedChange={(checked) => setIncludeWarrantyDisclaimer(checked as boolean)} 
                    />
                    <Label htmlFor="warranty-disclaimer">Include warranty disclaimer</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="copyright-notice" 
                      checked={includeCopyright}
                      onCheckedChange={(checked) => setIncludeCopyright(checked as boolean)} 
                    />
                    <Label htmlFor="copyright-notice">Include intellectual property/copyright clauses</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="termination" 
                      checked={termination}
                      onCheckedChange={(checked) => setTermination(checked as boolean)} 
                    />
                    <Label htmlFor="termination">Include account termination provisions</Label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="dispute-resolution">
                    Dispute Resolution Method
                  </Label>
                  <Select value={disputeResolution} onValueChange={setDisputeResolution}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dispute resolution method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arbitration">Binding Arbitration</SelectItem>
                      <SelectItem value="litigation">Court Litigation</SelectItem>
                      <SelectItem value="mediation">Mediation</SelectItem>
                      <SelectItem value="none">No Specific Method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {disputeResolution === 'arbitration' && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id="arbitration-required" 
                      checked={requireArbitration}
                      onCheckedChange={(checked) => setRequireArbitration(checked as boolean)} 
                    />
                    <Label htmlFor="arbitration-required">Make arbitration mandatory (include class action waiver)</Label>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Customization</CardTitle>
                <CardDescription>
                  Add any additional clauses or information to your terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="additional-clauses">
                    Additional Information or Clauses
                  </Label>
                  <Textarea
                    id="additional-clauses"
                    placeholder="Enter any additional information or specific clauses you want to include in your terms of service..."
                    value={additionalClauses}
                    onChange={(e) => setAdditionalClauses(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Terms of Service...
                  </>
                ) : (
                  <>
                    Generate Terms of Service
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
                    <p>This terms of service generator is provided as a tool to help you create a basic terms of service document for your website or application. While we strive to provide accurate and up-to-date information, we cannot guarantee that the generated terms will be legally compliant with all applicable laws and regulations.</p>
                    <p>The generated terms should be reviewed by a qualified legal professional before implementation. Laws vary by jurisdiction and may change over time.</p>
                    <p>By using this tool, you acknowledge that we are not providing legal advice and that you are responsible for ensuring your terms of service comply with all applicable laws and regulations.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          {generatedTerms && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Terms of Service Preview</CardTitle>
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
                      onClick={downloadTerms}
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
                    <pre className="whitespace-pre-wrap text-sm font-mono">{generatedTerms}</pre>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <div className="flex items-center text-xs text-gray-500">
                    <Scale className="mr-2 h-4 w-4 text-indigo-500" />
                    <p>These terms of service were generated on {new Date().toLocaleDateString()}. We recommend having them reviewed by a legal professional.</p>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Next Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Review the generated terms and make any necessary changes to match your specific practices.</li>
                  <li>Consider having the terms reviewed by a legal professional familiar with the laws in your jurisdiction.</li>
                  <li>Add the terms of service to your website, typically in the footer and during user registration.</li>
                  <li>Update your terms as your business practices change or as laws and regulations evolve.</li>
                </ol>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default TermsGenerator; 