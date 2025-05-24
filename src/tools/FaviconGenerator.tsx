import React, { useState, useRef } from 'react';
import { FileImage, Image, Download, Trash2, Copy, Check, RefreshCw, Settings, Upload, Palette, MoveUpRight } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

// Define favicon size options
const FAVICON_SIZES = [
  { size: 16, label: '16×16' },
  { size: 32, label: '32×32' },
  { size: 48, label: '48×32' },
  { size: 64, label: '64×64' },
  { size: 96, label: '96×96' },
  { size: 128, label: '128×128' },
  { size: 196, label: '196×196' },
  { size: 256, label: '256×256' },
];

// Favicon shape options
const SHAPE_OPTIONS = [
  { id: 'square', label: 'Square' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
];

// Background color presets
const COLOR_PRESETS = [
  { color: '#FFFFFF', name: 'White' },
  { color: '#000000', name: 'Black' },
  { color: '#3B82F6', name: 'Blue' },
  { color: '#10B981', name: 'Green' },
  { color: '#EF4444', name: 'Red' },
  { color: '#F59E0B', name: 'Orange' },
  { color: '#8B5CF6', name: 'Purple' },
  { color: '#EC4899', name: 'Pink' },
  { color: '#6B7280', name: 'Gray' },
];

// Mock placeholder image URLs for different shapes
const getPlaceholderImage = (size: number, shape: string, bgColor: string, text?: string) => {
  const bgColorEncoded = encodeURIComponent(bgColor);
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  
  if (shape === 'circle') {
    return `https://via.placeholder.com/${size}/${bgColorEncoded.replace('#', '')}/FFFFFF?text=${text || '+'}`;
  } else if (shape === 'rounded') {
    return `https://via.placeholder.com/${size}/${bgColorEncoded.replace('#', '')}/FFFFFF?text=${text || '+'}`;
  } else {
    return `https://via.placeholder.com/${size}/${bgColorEncoded.replace('#', '')}/FFFFFF?text=${text || '+'}`;
  }
};

// Main component
const FaviconGenerator: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('create');
  const [text, setText] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<number>(32);
  const [selectedShape, setSelectedShape] = useState<string>('square');
  const [backgroundColor, setBackgroundColor] = useState<string>('#3B82F6');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [generatedFavicons, setGeneratedFavicons] = useState<{size: number, dataUrl: string}[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, SVG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle initiation of file upload
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clear uploaded image
  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate favicons
  const handleGenerateFavicons = () => {
    setIsLoading(true);
    
    // Simulate API call or processing time
    setTimeout(() => {
      // Create mock generated favicons for all standard sizes
      const mockFavicons = FAVICON_SIZES.map(({ size }) => {
        let dataUrl;
        
        if (imagePreview) {
          // If we have an uploaded image, use it
          dataUrl = imagePreview;
        } else {
          // Otherwise use placeholder based on text and styles
          const displayText = text || (text === '' ? '' : text.charAt(0).toUpperCase());
          dataUrl = getPlaceholderImage(size, selectedShape, backgroundColor, displayText);
        }
        
        return { size, dataUrl };
      });
      
      setGeneratedFavicons(mockFavicons);
      setIsGenerated(true);
      setIsLoading(false);
      setSelectedTab('download');
      
      toast({
        title: "Favicons generated",
        description: "Your favicons are ready to download",
      });
    }, 1500);
  };

  // Copy HTML to clipboard
  const handleCopyHtml = () => {
    const htmlCode = `
<!-- Favicon code -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${backgroundColor}">
<meta name="theme-color" content="${backgroundColor}">
`;
    
    navigator.clipboard.writeText(htmlCode);
    toast({
      title: "HTML code copied",
      description: "Favicon HTML code has been copied to clipboard",
    });
  };

  // Download a specific favicon
  const handleDownloadFavicon = (size: number, dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `favicon-${size}x${size}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all favicons as a zip file (mock function)
  const handleDownloadAll = () => {
    toast({
      title: "Download started",
      description: "All favicon files are being prepared for download",
    });
    
    // In a real implementation, this would create a zip file with all favicons
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "All favicons have been downloaded",
      });
    }, 1500);
  };

  return (
    <ToolLayout
      title="Favicon Generator"
      description="Create professional-quality favicons for your website in seconds"
      icon={<Image className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="create" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Favicon</TabsTrigger>
          <TabsTrigger value="download" disabled={!isGenerated}>Download</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Favicon</CardTitle>
              <CardDescription>
                Choose between uploading an image or creating a text-based favicon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Upload Image or Create Text-based Favicon</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload Section */}
                  <Card className="border border-dashed p-4">
                    <CardContent className="p-0 space-y-4">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileImage className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-center text-muted-foreground">
                          Upload an image to convert to favicon
                        </p>
                        <Input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                        <Button 
                          variant="outline" 
                          onClick={handleUploadClick}
                          disabled={isLoading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                      
                      {imagePreview && (
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32 rounded overflow-hidden border">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearImage}
                            className="mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Image
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Text-based Favicon Section */}
                  <Card className="border p-4">
                    <CardContent className="p-0 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="text">Text (1-2 characters recommended)</Label>
                        <Input
                          id="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="A"
                          maxLength={3}
                          disabled={!!imageFile || isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Shape</Label>
                        <RadioGroup 
                          value={selectedShape} 
                          onValueChange={setSelectedShape}
                          className="flex space-x-2"
                          disabled={isLoading}
                        >
                          {SHAPE_OPTIONS.map(shape => (
                            <div key={shape.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={shape.id} id={`shape-${shape.id}`} />
                              <Label htmlFor={`shape-${shape.id}`}>{shape.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bg-color">Background Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="bg-color"
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-12 h-10 p-1"
                              disabled={isLoading}
                            />
                            <Input 
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1"
                              disabled={isLoading}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {COLOR_PRESETS.slice(0, 6).map(preset => (
                              <button
                                key={preset.color}
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: preset.color }}
                                onClick={() => setBackgroundColor(preset.color)}
                                title={preset.name}
                                disabled={isLoading}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="text-color">Text Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="text-color"
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-12 h-10 p-1"
                              disabled={!!imageFile || isLoading}
                            />
                            <Input 
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="flex-1"
                              disabled={!!imageFile || isLoading}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Preview Size</Label>
                        <Select 
                          value={selectedSize.toString()} 
                          onValueChange={(val) => setSelectedSize(parseInt(val))}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {FAVICON_SIZES.map(({size, label}) => (
                              <SelectItem key={size} value={size.toString()}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-center pt-4">
                        <div 
                          className={`
                            relative flex items-center justify-center
                            ${selectedShape === 'circle' ? 'rounded-full' : 
                              selectedShape === 'rounded' ? 'rounded-xl' : ''}
                            overflow-hidden border
                          `}
                          style={{ 
                            width: `${selectedSize}px`, 
                            height: `${selectedSize}px`,
                            backgroundColor: !imagePreview ? backgroundColor : 'transparent',
                            color: textColor
                          }}
                        >
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-center font-bold" style={{ fontSize: `${Math.max(12, selectedSize/2)}px` }}>
                              {text || (text === '' ? '' : 'A')}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button 
                className="w-full" 
                onClick={handleGenerateFavicons}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Favicons...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Generate Favicons
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="download" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Download Your Favicons</CardTitle>
              <CardDescription>
                Download individual sizes or get all files in a package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Generated Favicons</h3>
                  <Button variant="outline" onClick={handleDownloadAll}>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {generatedFavicons.map(({size, dataUrl}) => (
                    <Card key={size} className="overflow-hidden">
                      <CardContent className="p-4 flex flex-col items-center space-y-2">
                        <div className="border rounded overflow-hidden" style={{ padding: '10px' }}>
                          <img 
                            src={dataUrl} 
                            alt={`${size}x${size} favicon`} 
                            width={size} 
                            height={size}
                            style={{ 
                              width: size > 64 ? '64px' : `${size}px`,
                              height: size > 64 ? '64px' : `${size}px`,
                            }}
                          />
                        </div>
                        <p className="text-sm font-medium">{size}×{size}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleDownloadFavicon(size, dataUrl)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">HTML Code for Your Website</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-xs overflow-x-auto">
{`<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${backgroundColor}">
<meta name="theme-color" content="${backgroundColor}">`}
                  </pre>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" onClick={handleCopyHtml}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy HTML
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Installation Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Download all favicon files or individual sizes you need</li>
                  <li>Upload the favicon files to the root directory of your website</li>
                  <li>Copy and paste the HTML code above into the <code>&lt;head&gt;</code> section of your HTML</li>
                  <li>Create a <code>site.webmanifest</code> file with your site details</li>
                  <li>Test your favicon on different browsers and devices</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button variant="outline" onClick={() => setSelectedTab('create')}>
                Make Changes
              </Button>
              <Button onClick={handleDownloadAll}>
                <Download className="h-4 w-4 mr-2" />
                Download All Favicons
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default FaviconGenerator; 