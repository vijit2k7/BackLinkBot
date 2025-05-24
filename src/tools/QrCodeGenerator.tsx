import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ArrowRight, Loader2, Download, Copy, RefreshCw, Settings, Palette, Smartphone, Wifi, Mail, User, MapPin, FileText } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const QrCodeGenerator = () => {
  // Form states for different QR code types
  const [qrType, setQrType] = useState<string>('url');
  const [url, setUrl] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    website: '',
  });
  const [wifiInfo, setWifiInfo] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  
  // QR Code customization options
  const [qrSize, setQrSize] = useState<number>(200);
  const [qrColor, setQrColor] = useState<string>('#000000');
  const [qrBackgroundColor, setQrBackgroundColor] = useState<string>('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState<string>('M');
  const [includeMargin, setIncludeMargin] = useState<boolean>(true);
  
  // Canvas ref for rendering QR code
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function to generate QR code content based on type
  const generateQrContent = (): string => {
    switch (qrType) {
      case 'url':
        return url;
      case 'text':
        return text;
      case 'contact':
        // Generate vCard format
        let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
        if (contactInfo.name) vCard += `FN:${contactInfo.name}\n`;
        if (contactInfo.company) vCard += `ORG:${contactInfo.company}\n`;
        if (contactInfo.phone) vCard += `TEL:${contactInfo.phone}\n`;
        if (contactInfo.email) vCard += `EMAIL:${contactInfo.email}\n`;
        if (contactInfo.address) vCard += `ADR:;;${contactInfo.address};;;\n`;
        if (contactInfo.website) vCard += `URL:${contactInfo.website}\n`;
        vCard += 'END:VCARD';
        return vCard;
      case 'wifi':
        // Generate WiFi connection string
        let wifi = 'WIFI:';
        wifi += `T:${wifiInfo.encryption};`;
        wifi += `S:${wifiInfo.ssid};`;
        if (wifiInfo.password) wifi += `P:${wifiInfo.password};`;
        wifi += `H:${wifiInfo.hidden};`;
        wifi += ';';
        return wifi;
      default:
        return '';
    }
  };
  
  // Function to validate inputs
  const validateInputs = (): boolean => {
    switch (qrType) {
      case 'url':
        if (!url.trim()) {
          toast({
            title: "URL required",
            description: "Please enter a URL to generate a QR code.",
            variant: "destructive"
          });
          return false;
        }
        
        // Simple URL validation
        try {
          new URL(url.startsWith('http') ? url : `https://${url}`);
          return true;
        } catch (e) {
          toast({
            title: "Invalid URL",
            description: "Please enter a valid URL (e.g., https://example.com).",
            variant: "destructive"
          });
          return false;
        }
        
      case 'text':
        if (!text.trim()) {
          toast({
            title: "Text required",
            description: "Please enter some text to generate a QR code.",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      case 'contact':
        // At least name or phone should be provided
        if (!contactInfo.name.trim() && !contactInfo.phone.trim()) {
          toast({
            title: "Contact information required",
            description: "Please enter at least a name or phone number.",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      case 'wifi':
        if (!wifiInfo.ssid.trim()) {
          toast({
            title: "Network name required",
            description: "Please enter the WiFi network name (SSID).",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      default:
        return false;
    }
  };
  
  // Generate QR code
  const handleGenerateQrCode = () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    
    // We'll use a setTimeout to simulate API processing
    // In a real app, you'd use an actual QR code library like qrcode.js or call an API
    setTimeout(() => {
      try {
        // For this demo, we'll fake the QR code generation using a free API
        const content = encodeURIComponent(generateQrContent());
        const errorCorrectionMap: Record<string, string> = {
          'L': 'L',  // Low - 7%
          'M': 'M',  // Medium - 15%
          'Q': 'Q',  // Quartile - 25%
          'H': 'H',  // High - 30%
        };
        
        // Generate QR code using the QR Server API
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${content}&size=${qrSize}x${qrSize}&color=${qrColor.replace('#', '')}&bgcolor=${qrBackgroundColor.replace('#', '')}&ecc=${errorCorrectionMap[errorCorrection]}&margin=${includeMargin ? '10' : '0'}`;
        
        setQrCodeDataUrl(qrCodeUrl);
        setLoading(false);
        
        toast({
          title: "QR Code generated!",
          description: "Your QR code is ready to use.",
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast({
          title: "Error generating QR code",
          description: "There was a problem generating your QR code. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    }, 1500);
  };
  
  // Download QR code as image
  const downloadQrCode = () => {
    if (!qrCodeDataUrl) return;
    
    // Create a temporary link element
    const downloadLink = document.createElement('a');
    
    // Set attributes
    downloadLink.href = qrCodeDataUrl;
    downloadLink.download = `qrcode-${Date.now()}.png`;
    
    // Append to document, trigger click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "QR Code downloaded!",
      description: "Your QR code has been downloaded as a PNG image.",
    });
  };
  
  // Reset form
  const resetForm = () => {
    setUrl('');
    setText('');
    setContactInfo({
      name: '',
      phone: '',
      email: '',
      company: '',
      address: '',
      website: '',
    });
    setWifiInfo({
      ssid: '',
      password: '',
      encryption: 'WPA',
      hidden: false,
    });
    setQrCodeDataUrl('');
  };
  
  // Copy QR code URL to clipboard
  const copyQrCodeUrl = () => {
    if (!qrCodeDataUrl) return;
    
    navigator.clipboard.writeText(qrCodeDataUrl);
    
    toast({
      title: "URL copied to clipboard!",
      description: "The QR code URL has been copied to your clipboard.",
    });
  };
  
  // Get content label based on QR type
  const getContentLabel = (): string => {
    switch (qrType) {
      case 'url': return 'URL';
      case 'text': return 'Text Content';
      case 'contact': return 'Contact Information';
      case 'wifi': return 'WiFi Network';
      default: return 'Content';
    }
  };
  
  // Get icon based on QR type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url': return <FileText className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'contact': return <User className="h-4 w-4" />;
      case 'wifi': return <Wifi className="h-4 w-4" />;
      default: return <QrCode className="h-4 w-4" />;
    }
  };
  
  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate QR codes for websites, text, contact information, and WiFi networks"
      icon={<QrCode className="h-6 w-6 text-purple-500" />}
      helpText="Select the type of QR code you want to create, fill in the details, and customize your QR code appearance."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-6">
          <Card className="border border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Create QR Code</CardTitle>
              <CardDescription>
                Choose what information you want to encode in your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">QR Code Type</Label>
                  <RadioGroup
                    value={qrType}
                    onValueChange={(value) => {
                      setQrType(value);
                      resetForm();
                    }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="url" />
                      <Label htmlFor="url" className="cursor-pointer flex items-center gap-1">
                        <FileText className="h-4 w-4" /> URL
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text" className="cursor-pointer flex items-center gap-1">
                        <FileText className="h-4 w-4" /> Text
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="contact" id="contact" />
                      <Label htmlFor="contact" className="cursor-pointer flex items-center gap-1">
                        <User className="h-4 w-4" /> Contact
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wifi" id="wifi" />
                      <Label htmlFor="wifi" className="cursor-pointer flex items-center gap-1">
                        <Wifi className="h-4 w-4" /> WiFi
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Tabs value={qrType} className="w-full">
                  {/* URL Form */}
                  <TabsContent value="url" className="space-y-4 mt-0">
                    <div>
                      <Label htmlFor="url-input">Website URL</Label>
                      <Input
                        id="url-input"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the full URL including https:// for best results
                      </p>
                    </div>
                  </TabsContent>
                  
                  {/* Text Form */}
                  <TabsContent value="text" className="space-y-4 mt-0">
                    <div>
                      <Label htmlFor="text-input">Text Content</Label>
                      <Textarea
                        id="text-input"
                        placeholder="Enter any text you want to encode in the QR code"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Keep text concise for better scanning reliability
                      </p>
                    </div>
                  </TabsContent>
                  
                  {/* Contact Form */}
                  <TabsContent value="contact" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Name</Label>
                        <Input
                          id="contact-name"
                          placeholder="John Doe"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Phone</Label>
                        <Input
                          id="contact-phone"
                          placeholder="+1 (555) 123-4567"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          placeholder="john@example.com"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-company">Company</Label>
                        <Input
                          id="contact-company"
                          placeholder="Acme Inc."
                          value={contactInfo.company}
                          onChange={(e) => setContactInfo({...contactInfo, company: e.target.value})}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="contact-address">Address</Label>
                        <Input
                          id="contact-address"
                          placeholder="123 Main St, City, State, Zip"
                          value={contactInfo.address}
                          onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="contact-website">Website</Label>
                        <Input
                          id="contact-website"
                          placeholder="https://example.com"
                          value={contactInfo.website}
                          onChange={(e) => setContactInfo({...contactInfo, website: e.target.value})}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* WiFi Form */}
                  <TabsContent value="wifi" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                        <Input
                          id="wifi-ssid"
                          placeholder="MyWiFiNetwork"
                          value={wifiInfo.ssid}
                          onChange={(e) => setWifiInfo({...wifiInfo, ssid: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="wifi-password">Password</Label>
                        <Input
                          id="wifi-password"
                          type="password"
                          placeholder="Enter network password"
                          value={wifiInfo.password}
                          onChange={(e) => setWifiInfo({...wifiInfo, password: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="wifi-encryption">Encryption Type</Label>
                        <Select
                          value={wifiInfo.encryption}
                          onValueChange={(value) => setWifiInfo({...wifiInfo, encryption: value})}
                        >
                          <SelectTrigger id="wifi-encryption">
                            <SelectValue placeholder="Select encryption type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">No Password</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="wifi-hidden"
                          checked={wifiInfo.hidden}
                          onCheckedChange={(checked) => setWifiInfo({...wifiInfo, hidden: checked})}
                        />
                        <Label htmlFor="wifi-hidden">Hidden Network</Label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Customization Options */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-4">
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium">QR Code Options</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="qr-size" className="flex justify-between">
                        <span>Size</span>
                        <span className="text-gray-500 text-xs">{qrSize}px</span>
                      </Label>
                      <Slider
                        id="qr-size"
                        min={100}
                        max={500}
                        step={10}
                        value={[qrSize]}
                        onValueChange={(values) => setQrSize(values[0])}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="error-correction">Error Correction</Label>
                      <Select
                        value={errorCorrection}
                        onValueChange={setErrorCorrection}
                      >
                        <SelectTrigger id="error-correction">
                          <SelectValue placeholder="Select error correction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="qr-color">QR Code Color</Label>
                      <div className="flex mt-1">
                        <div 
                          className="w-8 h-8 border border-gray-300 rounded-l-md" 
                          style={{ backgroundColor: qrColor }}
                        />
                        <Input
                          id="qr-color"
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-full rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="qr-bg-color">Background Color</Label>
                      <div className="flex mt-1">
                        <div 
                          className="w-8 h-8 border border-gray-300 rounded-l-md" 
                          style={{ backgroundColor: qrBackgroundColor }}
                        />
                        <Input
                          id="qr-bg-color"
                          type="color"
                          value={qrBackgroundColor}
                          onChange={(e) => setQrBackgroundColor(e.target.value)}
                          className="w-full rounded-l-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <Switch
                        id="include-margin"
                        checked={includeMargin}
                        onCheckedChange={setIncludeMargin}
                      />
                      <Label htmlFor="include-margin">Include Margin</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                  <Button 
                    type="button"
                    onClick={handleGenerateQrCode}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate QR Code
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* QR Code Display */}
        <div className="space-y-6">
          <Card className="border border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Your QR Code</CardTitle>
              <CardDescription>
                Preview and download your generated QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {qrCodeDataUrl ? (
                <div className="text-center">
                  <div className="bg-white inline-block p-4 rounded-md shadow-sm mb-4">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Generated QR Code" 
                      className="max-w-full" 
                      style={{ width: qrSize, height: qrSize }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Scan with a QR code reader to test
                  </p>
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <QrCode className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No QR code generated</h3>
                  <p className="text-gray-500 mb-6">
                    Fill in the form and click "Generate QR Code" to create your QR code
                  </p>
                </div>
              )}
            </CardContent>
            {qrCodeDataUrl && (
              <CardFooter className="flex flex-wrap justify-center gap-3 border-t pt-4 bg-gray-50">
                <Button 
                  variant="outline" 
                  onClick={downloadQrCode}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => resetForm()}
                  className="flex-1 sm:flex-none"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  onClick={copyQrCodeUrl}
                  className="flex-1 sm:flex-none"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Usage Tips */}
          <Card className="border border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">QR Code Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Smartphone className="h-4 w-4 text-purple-500 mt-0.5" />
                  <p>Test your QR code with different scanning apps to ensure it works correctly.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Palette className="h-4 w-4 text-purple-500 mt-0.5" />
                  <p>Use contrasting colors for better readability. Black on white typically performs best.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Settings className="h-4 w-4 text-purple-500 mt-0.5" />
                  <p>Higher error correction (H) allows for more damage/customization but creates denser codes.</p>
                </div>
                <div className="flex items-start gap-2">
                  <QrCode className="h-4 w-4 text-purple-500 mt-0.5" />
                  <p>Print QR codes at least 1 inch (2.5cm) square for reliable scanning.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default QrCodeGenerator; 