import React, { useState, useRef, useEffect } from 'react';
import { Image, Download, Upload, Palette, Type, Square, Circle, CheckSquare, Copy, FileCode, FileJson } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import ToolLayout from '../components/ToolLayout';
import { FaviconSettings, FaviconDownloadOptions } from './types';
import { generateFaviconCanvas, canvasToDataURL, canvasToBlob, generateFaviconHtml, generateWebManifest } from './utils';

const FaviconGenerator: React.FC = () => {
  // Default settings
  const defaultSettings: FaviconSettings = {
    text: '',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    fontSize: 60,
    shape: 'square',
    useImage: false,
    imageFile: null
  };
  
  const defaultDownloadOptions: FaviconDownloadOptions = {
    sizes: [
      { size: 16, selected: true },
      { size: 32, selected: true },
      { size: 48, selected: true },
      { size: 64, selected: true },
      { size: 128, selected: true },
      { size: 180, selected: true }, // Apple touch icon
      { size: 192, selected: true }, // Android
      { size: 512, selected: true }  // PWA
    ],
    format: 'png',
    includeManifest: true,
    includeHtmlCode: true
  };
  
  // State
  const [settings, setSettings] = useState<FaviconSettings>(defaultSettings);
  const [downloadOptions, setDownloadOptions] = useState<FaviconDownloadOptions>(defaultDownloadOptions);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('design');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Generate preview when settings change
  useEffect(() => {
    updatePreview();
  }, [settings]);
  
  // Update preview
  const updatePreview = () => {
    try {
      const canvas = generateFaviconCanvas(settings);
      const dataUrl = canvasToDataURL(canvas);
      setPreviewUrl(dataUrl);
      
      // Store canvas for later use
      if (!previewCanvasRef.current) {
        previewCanvasRef.current = canvas;
      } else {
        const ctx = previewCanvasRef.current.getContext('2d')!;
        ctx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
        ctx.drawImage(canvas, 0, 0);
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate favicon preview',
        variant: 'destructive',
      });
    }
  };
  
  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, text: e.target.value });
  };
  
  // Handle color changes
  const handleColorChange = (type: 'backgroundColor' | 'textColor', value: string) => {
    setSettings({ ...settings, [type]: value });
  };
  
  // Handle font size change
  const handleFontSizeChange = (value: number[]) => {
    setSettings({ ...settings, fontSize: value[0] });
  };
  
  // Handle shape change
  const handleShapeChange = (shape: 'square' | 'circle' | 'rounded') => {
    setSettings({ ...settings, shape });
  };
  
  // Handle image upload toggle
  const handleUseImageToggle = (checked: boolean) => {
    setSettings({ ...settings, useImage: checked });
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSettings({ ...settings, imageFile: file, useImage: true });
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle size selection
  const handleSizeToggle = (index: number, checked: boolean) => {
    const newSizes = [...downloadOptions.sizes];
    newSizes[index].selected = checked;
    setDownloadOptions({ ...downloadOptions, sizes: newSizes });
  };
  
  // Handle format change
  const handleFormatChange = (format: 'png' | 'ico') => {
    setDownloadOptions({ ...downloadOptions, format });
  };
  
  // Handle manifest toggle
  const handleManifestToggle = (checked: boolean) => {
    setDownloadOptions({ ...downloadOptions, includeManifest: checked });
  };
  
  // Handle HTML code toggle
  const handleHtmlCodeToggle = (checked: boolean) => {
    setDownloadOptions({ ...downloadOptions, includeHtmlCode: checked });
  };
  
  // Generate and download favicon
  const handleDownload = async () => {
    try {
      // Create a zip file with JSZip (would need to be imported)
      // For this demo, we'll just download the largest size
      const canvas = generateFaviconCanvas(settings, 512);
      const blob = await canvasToBlob(canvas);
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicon.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Favicon downloaded successfully',
      });
    } catch (error) {
      console.error('Error downloading favicon:', error);
      toast({
        title: 'Error',
        description: 'Failed to download favicon',
        variant: 'destructive',
      });
    }
  };
  
  // Copy HTML code to clipboard
  const handleCopyHtml = () => {
    const selectedSizes = downloadOptions.sizes
      .filter(size => size.selected)
      .map(size => size.size);
    
    const html = generateFaviconHtml(selectedSizes);
    navigator.clipboard.writeText(html);
    
    toast({
      title: 'Copied',
      description: 'HTML code copied to clipboard',
    });
  };
  
  // Copy manifest to clipboard
  const handleCopyManifest = () => {
    const selectedSizes = downloadOptions.sizes
      .filter(size => size.selected)
      .map(size => size.size);
    
    const manifest = generateWebManifest(settings.text || 'My App', selectedSizes);
    navigator.clipboard.writeText(manifest);
    
    toast({
      title: 'Copied',
      description: 'Web manifest copied to clipboard',
    });
  };
  
  return (
    <ToolLayout
      title="Favicon Generator"
      description="Create custom favicons for your website"
      icon={<Image className="h-8 w-8" />}
    >
      <Tabs 
        defaultValue="design" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="design" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preview */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your favicon will look</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="border rounded-lg p-6 bg-gray-50 w-full flex flex-col items-center">
                  <div className="mb-4">
                    <img 
                      src={previewUrl} 
                      alt="Favicon Preview" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewUrl} 
                        alt="Small Preview" 
                        className="w-4 h-4 object-contain mb-1"
                      />
                      <span className="text-xs text-muted-foreground">16px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewUrl} 
                        alt="Medium Preview" 
                        className="w-8 h-8 object-contain mb-1"
                      />
                      <span className="text-xs text-muted-foreground">32px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewUrl} 
                        alt="Large Preview" 
                        className="w-16 h-16 object-contain mb-1"
                      />
                      <span className="text-xs text-muted-foreground">64px</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Browser tab</span>
                    <div className="flex items-center border rounded px-2 py-1">
                      <img 
                        src={previewUrl} 
                        alt="Tab Preview" 
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-xs truncate max-w-[100px]">
                        {settings.text || 'My Website'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bookmarks</span>
                    <div className="flex items-center border rounded px-2 py-1">
                      <img 
                        src={previewUrl} 
                        alt="Bookmark Preview" 
                        className="w-4 h-4 mr-2"
                      />
                      <span className="text-xs truncate max-w-[100px]">
                        {settings.text || 'My Website'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Settings */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Favicon Settings</CardTitle>
                <CardDescription>Customize your favicon design</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Text Input */}
                <div className="space-y-2">
                  <Label htmlFor="text">Text (1-2 characters recommended)</Label>
                  <Input
                    id="text"
                    placeholder="e.g., A, FB, G"
                    value={settings.text}
                    onChange={handleTextChange}
                    maxLength={4}
                  />
                </div>
                
                {/* Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgColor" className="flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      Background Color
                    </Label>
                    <div className="flex">
                      <Input
                        id="bgColor"
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="flex-1 ml-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textColor" className="flex items-center">
                      <Type className="h-4 w-4 mr-2" />
                      Text Color
                    </Label>
                    <div className="flex">
                      <Input
                        id="textColor"
                        type="color"
                        value={settings.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={settings.textColor}
                        onChange={(e) => handleColorChange('textColor', e.target.value)}
                        className="flex-1 ml-2"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <span className="text-sm text-muted-foreground">{settings.fontSize}%</span>
                  </div>
                  <Slider
                    id="fontSize"
                    min={20}
                    max={100}
                    step={1}
                    value={[settings.fontSize]}
                    onValueChange={handleFontSizeChange}
                  />
                </div>
                
                {/* Shape */}
                <div className="space-y-2">
                  <Label>Shape</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={settings.shape === 'square' ? 'default' : 'outline'}
                      onClick={() => handleShapeChange('square')}
                      className="flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Square
                    </Button>
                    <Button
                      type="button"
                      variant={settings.shape === 'rounded' ? 'default' : 'outline'}
                      onClick={() => handleShapeChange('rounded')}
                      className="flex-1"
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Rounded
                    </Button>
                    <Button
                      type="button"
                      variant={settings.shape === 'circle' ? 'default' : 'outline'}
                      onClick={() => handleShapeChange('circle')}
                      className="flex-1"
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      Circle
                    </Button>
                  </div>
                </div>
                
                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="useImage"
                      checked={settings.useImage}
                      onCheckedChange={handleUseImageToggle}
                    />
                    <Label htmlFor="useImage">Use Image Instead of Text</Label>
                  </div>
                  
                  {settings.useImage && (
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleUploadClick}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {settings.imageFile ? 'Change Image' : 'Upload Image'}
                      </Button>
                      {settings.imageFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {settings.imageFile.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        For best results, use a square image with a transparent background.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab('export')}>
                    Continue to Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preview */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your favicon is ready to export</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="border rounded-lg p-6 bg-gray-50 w-full flex justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Favicon Preview" 
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Favicon
                </Button>
              </CardContent>
            </Card>
            
            {/* Export Options */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Configure your favicon package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sizes */}
                <div className="space-y-2">
                  <Label>Sizes to Include</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {downloadOptions.sizes.map((size, index) => (
                      <div key={size.size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size.size}`}
                          checked={size.selected}
                          onCheckedChange={(checked) => 
                            handleSizeToggle(index, checked as boolean)
                          }
                        />
                        <Label htmlFor={`size-${size.size}`} className="text-sm">
                          {size.size}x{size.size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Format */}
                <div className="space-y-2">
                  <Label>File Format</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={downloadOptions.format === 'png' ? 'default' : 'outline'}
                      onClick={() => handleFormatChange('png')}
                      className="flex-1"
                    >
                      PNG (Recommended)
                    </Button>
                    <Button
                      type="button"
                      variant={downloadOptions.format === 'ico' ? 'default' : 'outline'}
                      onClick={() => handleFormatChange('ico')}
                      className="flex-1"
                    >
                      ICO (Legacy)
                    </Button>
                  </div>
                </div>
                
                {/* Additional Options */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeManifest"
                      checked={downloadOptions.includeManifest}
                      onCheckedChange={(checked) => 
                        handleManifestToggle(checked as boolean)
                      }
                    />
                    <Label htmlFor="includeManifest">Include Web App Manifest</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeHtmlCode"
                      checked={downloadOptions.includeHtmlCode}
                      onCheckedChange={(checked) => 
                        handleHtmlCodeToggle(checked as boolean)
                      }
                    />
                    <Label htmlFor="includeHtmlCode">Include HTML Code</Label>
                  </div>
                </div>
                
                {/* Code Snippets */}
                {downloadOptions.includeHtmlCode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>HTML Code</Label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCopyHtml}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
                      <pre>
                        {generateFaviconHtml(
                          downloadOptions.sizes
                            .filter(size => size.selected)
                            .map(size => size.size)
                        )}
                      </pre>
                    </div>
                  </div>
                )}
                
                {downloadOptions.includeManifest && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Web App Manifest</Label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCopyManifest}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto">
                      <pre>
                        {generateWebManifest(
                          settings.text || 'My App',
                          downloadOptions.sizes
                            .filter(size => size.selected)
                            .map(size => size.size)
                        )}
                      </pre>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('design')}
                  >
                    Back to Design
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Favicon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default FaviconGenerator; 