import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, Upload, Download, Trash2, RefreshCw, Maximize, Minimize, Image, Lock, Unlock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import ToolLayout from '../components/ToolLayout';
import { ImageDimensions, ResizeOptions, ImageInfo, ResizedImage } from './types';
import { 
  imagePresets, 
  formatFileSize, 
  getImageDimensions, 
  resizeImage 
} from './utils';

const ImageResizer: React.FC = () => {
  // Default resize options
  const defaultResizeOptions: ResizeOptions = {
    maintainAspectRatio: true,
    resizeMode: 'dimensions',
    dimensions: { width: 800, height: 600 },
    percentage: 50,
    preset: 'Social Media Profile (Square)',
    format: 'jpeg',
    quality: 90
  };
  
  // State
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>(defaultResizeOptions);
  const [resizedImage, setResizedImage] = useState<ResizedImage | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('upload');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Effect to update dimensions when aspect ratio changes
  useEffect(() => {
    if (imageInfo && resizeOptions.maintainAspectRatio && resizeOptions.resizeMode === 'dimensions') {
      // Update height based on width to maintain aspect ratio
      const { width, height } = imageInfo.originalDimensions;
      const aspectRatio = width / height;
      
      const newHeight = Math.round(resizeOptions.dimensions.width / aspectRatio);
      
      setResizeOptions(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          height: newHeight
        }
      }));
    }
  }, [resizeOptions.maintainAspectRatio, resizeOptions.dimensions.width]);
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }
      
      // Get image dimensions
      const dimensions = await getImageDimensions(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Set image info
      setImageInfo({
        file,
        originalDimensions: dimensions,
        originalSize: file.size,
        previewUrl
      });
      
      // Reset resized image
      setResizedImage(null);
      
      // Update resize options with original dimensions
      setResizeOptions(prev => ({
        ...prev,
        dimensions: {
          width: dimensions.width,
          height: dimensions.height
        }
      }));
      
      // Switch to resize tab
      setActiveTab('resize');
      
      toast({
        title: 'Image loaded',
        description: `${file.name} (${dimensions.width}x${dimensions.height})`,
      });
    } catch (error) {
      console.error('Error loading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to load image.',
        variant: 'destructive',
      });
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle resize mode change
  const handleResizeModeChange = (value: string) => {
    setResizeOptions(prev => ({
      ...prev,
      resizeMode: value as 'dimensions' | 'percentage' | 'preset'
    }));
  };
  
  // Handle dimension change
  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value, 10) || 0;
    
    setResizeOptions(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: numValue
      }
    }));
  };
  
  // Handle percentage change
  const handlePercentageChange = (value: number[]) => {
    setResizeOptions(prev => ({
      ...prev,
      percentage: value[0]
    }));
  };
  
  // Handle preset change
  const handlePresetChange = (value: string) => {
    setResizeOptions(prev => ({
      ...prev,
      preset: value
    }));
  };
  
  // Handle format change
  const handleFormatChange = (value: string) => {
    setResizeOptions(prev => ({
      ...prev,
      format: value as 'jpeg' | 'png' | 'webp'
    }));
  };
  
  // Handle quality change
  const handleQualityChange = (value: number[]) => {
    setResizeOptions(prev => ({
      ...prev,
      quality: value[0]
    }));
  };
  
  // Handle aspect ratio toggle
  const handleAspectRatioToggle = (checked: boolean) => {
    setResizeOptions(prev => ({
      ...prev,
      maintainAspectRatio: checked
    }));
  };
  
  // Handle resize button click
  const handleResize = async () => {
    if (!imageInfo) return;
    
    setIsResizing(true);
    
    try {
      const result = await resizeImage(imageInfo, resizeOptions);
      setResizedImage(result);
      setActiveTab('download');
      
      toast({
        title: 'Image resized',
        description: `New size: ${result.dimensions.width}x${result.dimensions.height}`,
      });
    } catch (error) {
      console.error('Error resizing image:', error);
      toast({
        title: 'Error',
        description: 'Failed to resize image.',
        variant: 'destructive',
      });
    } finally {
      setIsResizing(false);
    }
  };
  
  // Handle download button click
  const handleDownload = () => {
    if (!resizedImage) return;
    
    const a = document.createElement('a');
    a.href = resizedImage.url;
    
    // Generate filename
    const originalName = imageInfo?.file.name || 'image';
    const extension = resizeOptions.format;
    const dimensions = `${resizedImage.dimensions.width}x${resizedImage.dimensions.height}`;
    
    // Remove original extension and add new one
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const newName = `${baseName}-${dimensions}.${extension}`;
    
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: 'Download started',
      description: `Downloading ${newName}`,
    });
  };
  
  // Handle reset button click
  const handleReset = () => {
    // Clear image info and resized image
    if (imageInfo) {
      URL.revokeObjectURL(imageInfo.previewUrl);
    }
    
    if (resizedImage) {
      URL.revokeObjectURL(resizedImage.url);
    }
    
    setImageInfo(null);
    setResizedImage(null);
    setResizeOptions(defaultResizeOptions);
    setActiveTab('upload');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize and convert images for web and social media"
      icon={<ImageIcon className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="upload" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" disabled={activeTab === 'resize' && !imageInfo}>Upload</TabsTrigger>
          <TabsTrigger value="resize" disabled={!imageInfo}>Resize</TabsTrigger>
          <TabsTrigger value="download" disabled={!resizedImage}>Download</TabsTrigger>
        </TabsList>
        
        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Select an image to resize. Supported formats: JPEG, PNG, WebP, GIF.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div 
                className="border-2 border-dashed rounded-lg p-12 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleUploadClick}
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Drop your image here</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  or click to browse your files
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {imageInfo && (
                <div className="w-full">
                  <div className="flex flex-col md:flex-row gap-6 items-center p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
                        <img 
                          src={imageInfo.previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-grow space-y-1">
                      <h4 className="font-medium">{imageInfo.file.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {imageInfo.originalDimensions.width} x {imageInfo.originalDimensions.height} pixels
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(imageInfo.originalSize)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Button onClick={() => setActiveTab('resize')}>
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Use High-Quality Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Start with the highest quality image available for the best results after resizing.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Maintain Aspect Ratio</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep the original proportions to avoid distorting your image.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Choose the Right Format</h3>
                  <p className="text-sm text-muted-foreground">
                    JPEG for photos, PNG for transparency, WebP for best compression.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resize Tab */}
        <TabsContent value="resize" className="space-y-4 mt-4">
          {imageInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Preview */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Original image</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="border rounded-lg p-4 w-full flex justify-center bg-muted/30">
                    <img 
                      src={imageInfo.previewUrl} 
                      alt="Original" 
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span className="font-medium">
                        {imageInfo.originalDimensions.width} x {imageInfo.originalDimensions.height}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>File size:</span>
                      <span className="font-medium">
                        {formatFileSize(imageInfo.originalSize)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>File type:</span>
                      <span className="font-medium">
                        {imageInfo.file.type.split('/')[1].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleReset}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                </CardContent>
              </Card>
              
              {/* Resize Options */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Resize Options</CardTitle>
                  <CardDescription>Adjust the size and format of your image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resize Method */}
                  <div className="space-y-2">
                    <Label>Resize Method</Label>
                    <RadioGroup 
                      value={resizeOptions.resizeMode} 
                      onValueChange={handleResizeModeChange}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dimensions" id="dimensions" />
                        <Label htmlFor="dimensions" className="font-normal">Custom Dimensions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage" className="font-normal">Scale by Percentage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="preset" id="preset" />
                        <Label htmlFor="preset" className="font-normal">Use Preset</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Dimensions */}
                  {resizeOptions.resizeMode === 'dimensions' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aspectRatio"
                          checked={resizeOptions.maintainAspectRatio}
                          onCheckedChange={handleAspectRatioToggle}
                        />
                        <Label htmlFor="aspectRatio" className="flex items-center">
                          {resizeOptions.maintainAspectRatio ? (
                            <Lock className="h-4 w-4 mr-2" />
                          ) : (
                            <Unlock className="h-4 w-4 mr-2" />
                          )}
                          Maintain Aspect Ratio
                        </Label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (px)</Label>
                          <Input
                            id="width"
                            type="number"
                            value={resizeOptions.dimensions.width}
                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                            min={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (px)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={resizeOptions.dimensions.height}
                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                            min={1}
                            disabled={resizeOptions.maintainAspectRatio}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Percentage */}
                  {resizeOptions.resizeMode === 'percentage' && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label htmlFor="percentage">Scale</Label>
                        <span className="text-sm text-muted-foreground">{resizeOptions.percentage}%</span>
                      </div>
                      <Slider
                        id="percentage"
                        min={1}
                        max={100}
                        step={1}
                        value={[resizeOptions.percentage]}
                        onValueChange={handlePercentageChange}
                      />
                      <div className="text-sm text-muted-foreground">
                        New dimensions: {Math.round(imageInfo.originalDimensions.width * resizeOptions.percentage / 100)} x {Math.round(imageInfo.originalDimensions.height * resizeOptions.percentage / 100)} pixels
                      </div>
                    </div>
                  )}
                  
                  {/* Preset */}
                  {resizeOptions.resizeMode === 'preset' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="preset">Select Preset</Label>
                        <Select
                          value={resizeOptions.preset}
                          onValueChange={handlePresetChange}
                        >
                          <SelectTrigger id="preset">
                            <SelectValue placeholder="Select a preset" />
                          </SelectTrigger>
                          <SelectContent>
                            {imagePresets.map((preset) => (
                              <SelectItem key={preset.name} value={preset.name}>
                                {preset.name} ({preset.width}x{preset.height})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="presetAspectRatio"
                          checked={resizeOptions.maintainAspectRatio}
                          onCheckedChange={handleAspectRatioToggle}
                        />
                        <Label htmlFor="presetAspectRatio">
                          Maintain aspect ratio (may crop image)
                        </Label>
                      </div>
                    </div>
                  )}
                  
                  {/* Format Options */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="format">Output Format</Label>
                      <Select
                        value={resizeOptions.format}
                        onValueChange={handleFormatChange}
                      >
                        <SelectTrigger id="format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {resizeOptions.format === 'jpeg' && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="quality">Quality</Label>
                          <span className="text-sm text-muted-foreground">{resizeOptions.quality}%</span>
                        </div>
                        <Slider
                          id="quality"
                          min={10}
                          max={100}
                          step={1}
                          value={[resizeOptions.quality]}
                          onValueChange={handleQualityChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('upload')}
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleResize}
                      disabled={isResizing}
                    >
                      {isResizing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Resizing...
                        </>
                      ) : (
                        <>
                          <Maximize className="h-4 w-4 mr-2" />
                          Resize Image
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Download Tab */}
        <TabsContent value="download" className="space-y-4 mt-4">
          {resizedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Result Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Resized Image</CardTitle>
                  <CardDescription>Ready to download</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="border rounded-lg p-4 w-full flex justify-center bg-muted/30">
                    <img 
                      src={resizedImage.url} 
                      alt="Resized" 
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>New dimensions:</span>
                      <span className="font-medium">
                        {resizedImage.dimensions.width} x {resizedImage.dimensions.height}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>New file size:</span>
                      <span className="font-medium">
                        {formatFileSize(resizedImage.size)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">
                        {resizeOptions.format.toUpperCase()}
                      </span>
                    </div>
                    {resizeOptions.format === 'jpeg' && (
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className="font-medium">
                          {resizeOptions.quality}%
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </CardContent>
              </Card>
              
              {/* Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparison</CardTitle>
                  <CardDescription>Original vs. Resized</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="aspect-square border rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                        <img 
                          src={imageInfo?.previewUrl} 
                          alt="Original" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Original</p>
                        <p className="text-xs text-muted-foreground">
                          {imageInfo?.originalDimensions.width} x {imageInfo?.originalDimensions.height}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(imageInfo?.originalSize || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square border rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                        <img 
                          src={resizedImage.url} 
                          alt="Resized" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Resized</p>
                        <p className="text-xs text-muted-foreground">
                          {resizedImage.dimensions.width} x {resizedImage.dimensions.height}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(resizedImage.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="font-medium">Size Reduction</h3>
                    <div className="flex justify-between text-sm">
                      <span>Original size:</span>
                      <span>{formatFileSize(imageInfo?.originalSize || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>New size:</span>
                      <span>{formatFileSize(resizedImage.size)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Saved:</span>
                      <span className="text-green-600">
                        {formatFileSize(Math.max(0, (imageInfo?.originalSize || 0) - resizedImage.size))} ({Math.round((1 - resizedImage.size / (imageInfo?.originalSize || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('resize')}
                    >
                      Adjust Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                    >
                      Start Over
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default ImageResizer; 