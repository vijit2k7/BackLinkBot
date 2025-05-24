import React, { useState, useRef } from 'react';
import { Image, Upload, Download, Trash2, RefreshCw, Crop, Settings, ImageOff, Copy, Maximize, Minimize } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// Define preset sizes
const SIZE_PRESETS = [
  { name: 'Social Media Post', width: 1200, height: 630 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Cover', width: 851, height: 315 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'LinkedIn Cover', width: 1584, height: 396 },
  { name: 'Email Header', width: 600, height: 200 },
  { name: 'A4 Document', width: 2480, height: 3508 },
];

// Define format options
const FORMAT_OPTIONS = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
];

// Define quality options
const QUALITY_OPTIONS = [
  { value: 'low', label: 'Low (60%)', quality: 60 },
  { value: 'medium', label: 'Medium (80%)', quality: 80 },
  { value: 'high', label: 'High (90%)', quality: 90 },
  { value: 'best', label: 'Best (100%)', quality: 100 },
];

// Define aspect ratios
const ASPECT_RATIOS = [
  { id: 'original', label: 'Original' },
  { id: '1:1', label: '1:1 (Square)' },
  { id: '4:3', label: '4:3' },
  { id: '16:9', label: '16:9' },
  { id: '3:2', label: '3:2' },
  { id: '2:3', label: '2:3' },
  { id: '9:16', label: '9:16' },
];

// Main component
const ImageResizer: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('resize');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [processedImagePreview, setProcessedImagePreview] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  
  // Form state
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('jpeg');
  const [selectedQuality, setSelectedQuality] = useState<string>('high');
  const [compressionLevel, setCompressionLevel] = useState<number>(80);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('original');
  const [fileSize, setFileSize] = useState<{original: string, processed: string}>({ original: '0 KB', processed: '0 KB' });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, WebP, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      setFileSize(prev => ({ ...prev, original: formatFileSize(file.size) }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgPreview = e.target?.result as string;
        setOriginalImagePreview(imgPreview);
        
        // Get original dimensions
        const img = document.createElement('img');
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = imgPreview;
      };
      reader.readAsDataURL(file);
      
      // Reset processed state
      setIsProcessed(false);
      setProcessedImagePreview(null);
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
    setOriginalImagePreview(null);
    setProcessedImagePreview(null);
    setOriginalDimensions(null);
    setIsProcessed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle width change with aspect ratio
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setWidth(newWidth);
    
    if (keepAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  // Handle height change with aspect ratio
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    setHeight(newHeight);
    
    if (keepAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  // Handle aspect ratio change
  const handleAspectRatioChange = (value: string) => {
    setSelectedAspectRatio(value);
    
    if (value !== 'original' && originalDimensions) {
      const [widthRatio, heightRatio] = value.split(':').map(Number);
      const aspectRatio = widthRatio / heightRatio;
      
      // Use original width as base and calculate new height
      const newHeight = Math.round(originalDimensions.width / aspectRatio);
      setWidth(originalDimensions.width);
      setHeight(newHeight);
    } else if (originalDimensions) {
      // Reset to original dimensions
      setWidth(originalDimensions.width);
      setHeight(originalDimensions.height);
    }
  };

  // Handle preset size selection
  const handlePresetSelect = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
    // When selecting a preset, we need to update the aspect ratio
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(presetWidth, presetHeight);
    const widthRatio = presetWidth / divisor;
    const heightRatio = presetHeight / divisor;
    
    // Check if it matches a standard aspect ratio
    const aspectRatioStr = `${widthRatio}:${heightRatio}`;
    const matchingRatio = ASPECT_RATIOS.find(ratio => ratio.id === aspectRatioStr);
    
    if (matchingRatio) {
      setSelectedAspectRatio(matchingRatio.id);
    } else {
      setSelectedAspectRatio('original');
    }
  };

  // Process image (resize and convert)
  const handleProcessImage = () => {
    if (!originalImagePreview || !originalDimensions) return;
    
    setIsResizing(true);
    
    // Simulate processing time
    setTimeout(() => {
      // This is a mock function - in a real app, this would actually resize the image
      // For demo purposes, we'll just use the original image
      setProcessedImagePreview(originalImagePreview);
      
      // Simulate file size reduction
      const originalBytes = imageFile?.size || 0;
      const qualityFactor = QUALITY_OPTIONS.find(q => q.value === selectedQuality)?.quality || 90;
      const formatFactor = selectedFormat === 'webp' ? 0.6 : (selectedFormat === 'png' ? 1.2 : 1);
      const dimensionFactor = (width * height) / (originalDimensions.width * originalDimensions.height);
      const estimatedBytes = Math.round(originalBytes * dimensionFactor * (qualityFactor / 100) * formatFactor);
      
      setFileSize(prev => ({ ...prev, processed: formatFileSize(estimatedBytes) }));
      setIsResizing(false);
      setIsProcessed(true);
      
      toast({
        title: "Image processed",
        description: "Your image has been resized successfully",
      });
    }, 1500);
  };

  // Download processed image
  const handleDownloadImage = () => {
    if (!processedImagePreview) return;
    
    // Format selection will affect the extension
    const extension = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = processedImagePreview;
    link.download = `resized-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `Your resized image is being downloaded as ${extension.toUpperCase()}`,
    });
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize, compress, and convert images for your website or social media"
      icon={<Image className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="resize" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resize">Resize Image</TabsTrigger>
          <TabsTrigger value="batch" disabled>Batch Processing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resize" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column: Upload and Original Image */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Original Image</CardTitle>
                <CardDescription>
                  Upload an image to resize or convert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!originalImagePreview ? (
                  <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <div className="p-4 rounded-full bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Upload an image to resize
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleUploadClick}
                    >
                      Select Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-md overflow-hidden border">
                      <img 
                        src={originalImagePreview} 
                        alt="Original" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Original Size:</span>
                        <span className="font-medium">{originalDimensions ? `${originalDimensions.width} × ${originalDimensions.height}px` : ''}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">File Size:</span>
                        <span className="font-medium">{fileSize.original}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">File Type:</span>
                        <span className="font-medium">{imageFile?.type.split('/')[1].toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearImage}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Middle Column: Settings */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Resize Settings</CardTitle>
                <CardDescription>
                  Adjust dimensions and quality settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="width">Width (px)</Label>
                      {originalDimensions && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 text-xs"
                          onClick={() => setWidth(originalDimensions.width)}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={handleWidthChange}
                      disabled={!originalImagePreview || isResizing}
                      min={1}
                      max={10000}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="height">Height (px)</Label>
                      {originalDimensions && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 text-xs"
                          onClick={() => setHeight(originalDimensions.height)}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={handleHeightChange}
                      disabled={!originalImagePreview || isResizing}
                      min={1}
                      max={10000}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="aspect-ratio"
                      checked={keepAspectRatio}
                      onCheckedChange={setKeepAspectRatio}
                      disabled={!originalImagePreview || isResizing}
                    />
                    <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <RadioGroup 
                      value={selectedAspectRatio} 
                      onValueChange={handleAspectRatioChange}
                      className="grid grid-cols-3 gap-2"
                      disabled={!originalImagePreview || isResizing}
                    >
                      {ASPECT_RATIOS.map(ratio => (
                        <div key={ratio.id} className="flex items-center space-x-1">
                          <RadioGroupItem value={ratio.id} id={`ratio-${ratio.id}`} />
                          <Label htmlFor={`ratio-${ratio.id}`} className="text-xs">{ratio.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <RadioGroup 
                      value={selectedFormat} 
                      onValueChange={setSelectedFormat}
                      className="flex space-x-4"
                      disabled={!originalImagePreview || isResizing}
                    >
                      {FORMAT_OPTIONS.map(format => (
                        <div key={format.value} className="flex items-center space-x-1">
                          <RadioGroupItem value={format.value} id={`format-${format.value}`} />
                          <Label htmlFor={`format-${format.value}`}>{format.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Select 
                      value={selectedQuality} 
                      onValueChange={setSelectedQuality}
                      disabled={!originalImagePreview || isResizing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALITY_OPTIONS.map(quality => (
                          <SelectItem key={quality.value} value={quality.value}>
                            {quality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  className="w-full" 
                  onClick={handleProcessImage}
                  disabled={!originalImagePreview || isResizing}
                >
                  {isResizing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crop className="h-4 w-4 mr-2" />
                      Resize Image
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Right Column: Result */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Processed Image</CardTitle>
                <CardDescription>
                  Preview and download your resized image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!processedImagePreview ? (
                  <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[260px] space-y-2">
                    <div className="p-4 rounded-full bg-muted">
                      <ImageOff className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      {originalImagePreview ? 'Click "Resize Image" to process' : 'Upload an image to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-md overflow-hidden border">
                      <img 
                        src={processedImagePreview} 
                        alt="Processed" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">New Size:</span>
                        <span className="font-medium">{`${width} × ${height}px`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">File Size:</span>
                        <span className="font-medium">{fileSize.processed}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">File Type:</span>
                        <span className="font-medium">{selectedFormat.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={handleDownloadImage}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Common Image Sizes */}
          <Accordion type="single" collapsible>
            <AccordionItem value="common-sizes">
              <AccordionTrigger>Common Image Sizes</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {SIZE_PRESETS.map(preset => (
                    <Button 
                      key={preset.name} 
                      variant="outline" 
                      className="justify-start"
                      disabled={!originalImagePreview || isResizing}
                      onClick={() => handlePresetSelect(preset.width, preset.height)}
                    >
                      <div className="text-left">
                        <p className="text-xs font-medium">{preset.name}</p>
                        <p className="text-xs text-muted-foreground">{`${preset.width} × ${preset.height}`}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Tips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tips for Image Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Use WebP format for the best compression quality ratio</li>
                <li>For web images, dimensions under 1200px wide are usually sufficient</li>
                <li>For social media profile pictures, use square (1:1) aspect ratio</li>
                <li>For banners and headers, use landscape (16:9 or 3:1) aspect ratios</li>
                <li>Medium quality (80%) is usually imperceptible from high quality for most images</li>
                <li>Keep file sizes under 200KB for optimal website loading speed</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default ImageResizer; 