import React, { useState, useEffect } from 'react';
import { Brush, RefreshCw, Copy, Download, PlusCircle, X, ArrowRight, Loader2 } from 'lucide-react';
import ToolLayout from './components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

// Color palette types
interface Color {
  hex: string;
  rgb: string;
  name?: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  timestamp: number;
}

// Color name mapping (simplified)
const colorNames: Record<string, string> = {
  '#FF0000': 'Red',
  '#00FF00': 'Green',
  '#0000FF': 'Blue',
  '#FFFF00': 'Yellow',
  '#FF00FF': 'Magenta',
  '#00FFFF': 'Cyan',
  '#FFA500': 'Orange',
  '#800080': 'Purple',
  '#008000': 'Dark Green',
  '#000080': 'Navy',
  '#FFC0CB': 'Pink',
  '#A52A2A': 'Brown',
  '#808080': 'Gray',
  '#FFFFFF': 'White',
  '#000000': 'Black',
};

// Function to get a simple color name
const getColorName = (hex: string): string => {
  // Convert hex to uppercase for matching
  const upperHex = hex.toUpperCase();
  
  // Find exact match
  if (colorNames[upperHex]) {
    return colorNames[upperHex];
  }
  
  // If no exact match, return formatted hex
  return hex.toUpperCase();
};

// Function to convert hex to RGB
const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const ColorPaletteGenerator = () => {
  // States
  const [baseColor, setBaseColor] = useState<string>('#6D28D9'); // Purple default
  const [harmonyType, setHarmonyType] = useState<string>('complementary');
  const [paletteSize, setPaletteSize] = useState<number[]>([5]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedPalette, setGeneratedPalette] = useState<Color[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [paletteName, setPaletteName] = useState<string>('');
  
  // Generate initial palette on mount
  useEffect(() => {
    generatePalette();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Generate a palette based on selected settings
  const generatePalette = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newPalette = generateHarmoniousPalette(baseColor, harmonyType, paletteSize[0]);
      setGeneratedPalette(newPalette);
      setLoading(false);
    }, 800);
  };
  
  // Function to generate various color harmonies
  const generateHarmoniousPalette = (base: string, type: string, size: number): Color[] => {
    // Remove # if present for calculations
    let baseHex = base.replace('#', '');
    
    // Convert hex to RGB values (0-255)
    let r = parseInt(baseHex.substring(0, 2), 16);
    let g = parseInt(baseHex.substring(2, 4), 16);
    let b = parseInt(baseHex.substring(4, 6), 16);
    
    // Convert RGB to HSL for easier manipulation
    let [h, s, l] = rgbToHsl(r, g, b);
    
    const palette: Color[] = [];
    
    // Add base color
    palette.push({
      hex: base,
      rgb: hexToRgb(base),
      name: getColorName(base)
    });
    
    // Generate colors based on harmony type
    switch (type) {
      case 'complementary':
        // Add complementary color (opposite on color wheel)
        const compH = (h + 180) % 360;
        const compColor = hslToHex(compH, s, l);
        palette.push({
          hex: compColor,
          rgb: hexToRgb(compColor),
          name: getColorName(compColor)
        });
        
        // Add variations
        for (let i = 2; i < size; i++) {
          const variation = i % 2 === 0 
            ? hslToHex(h, Math.max(0, s - 0.2 * (i/2)), Math.min(0.9, l + 0.1 * (i/2)))
            : hslToHex(compH, Math.max(0, s - 0.2 * (i/2)), Math.min(0.9, l + 0.1 * (i/2)));
            
          palette.push({
            hex: variation,
            rgb: hexToRgb(variation),
            name: getColorName(variation)
          });
        }
        break;
        
      case 'analogous':
        // Add colors adjacent on the color wheel
        const step = 30;
        
        for (let i = 1; i < size; i++) {
          const angle = (h + step * i) % 360;
          const analogousColor = hslToHex(angle, s, l);
          
          palette.push({
            hex: analogousColor,
            rgb: hexToRgb(analogousColor),
            name: getColorName(analogousColor)
          });
        }
        break;
        
      case 'triadic':
        // Add two colors spaced evenly around the color wheel
        const triad1 = hslToHex((h + 120) % 360, s, l);
        const triad2 = hslToHex((h + 240) % 360, s, l);
        
        palette.push({
          hex: triad1,
          rgb: hexToRgb(triad1),
          name: getColorName(triad1)
        });
        
        palette.push({
          hex: triad2,
          rgb: hexToRgb(triad2),
          name: getColorName(triad2)
        });
        
        // Add variations
        for (let i = 3; i < size; i++) {
          const baseForVariation = i % 3;
          let variationH;
          
          if (baseForVariation === 0) variationH = h;
          else if (baseForVariation === 1) variationH = (h + 120) % 360;
          else variationH = (h + 240) % 360;
          
          const variation = hslToHex(variationH, Math.max(0.3, s - 0.2), Math.min(0.9, l + 0.1));
          
          palette.push({
            hex: variation,
            rgb: hexToRgb(variation),
            name: getColorName(variation)
          });
        }
        break;
        
      case 'monochromatic':
        // Generate shades and tints of the base color
        for (let i = 1; i < size; i++) {
          // Alternate between lighter and darker shades
          const lightness = i % 2 === 0 
            ? Math.max(0.1, l - 0.15 * (i / 2))
            : Math.min(0.9, l + 0.15 * ((i + 1) / 2));
            
          const monoColor = hslToHex(h, s, lightness);
          
          palette.push({
            hex: monoColor,
            rgb: hexToRgb(monoColor),
            name: getColorName(monoColor)
          });
        }
        break;
        
      case 'shades':
        // Just various shades from dark to light
        for (let i = 1; i < size; i++) {
          const shadeL = 0.1 + (0.8 * i / (size - 1));
          const shadeColor = hslToHex(h, s, shadeL);
          
          palette.push({
            hex: shadeColor,
            rgb: hexToRgb(shadeColor),
            name: getColorName(shadeColor)
          });
        }
        break;
        
      default:
        // Default to random colors if no valid type
        for (let i = 1; i < size; i++) {
          const randomH = Math.floor(Math.random() * 360);
          const randomColor = hslToHex(randomH, 0.7, 0.5);
          
          palette.push({
            hex: randomColor,
            rgb: hexToRgb(randomColor),
            name: getColorName(randomColor)
          });
        }
    }
    
    // Ensure we have exactly the requested size
    return palette.slice(0, size);
  };
  
  // Helper function: Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h *= 60;
    }
    
    return [h, s, l];
  };
  
  // Helper function: Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, (h / 360) + 1/3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, (h / 360) - 1/3);
    }
    
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  // Save current palette
  const savePalette = () => {
    if (!paletteName.trim()) {
      toast({
        title: "Name Required",
        description: "Please give your palette a name before saving.",
        variant: "destructive"
      });
      return;
    }
    
    const newPalette: ColorPalette = {
      id: `palette-${Date.now()}`,
      name: paletteName,
      colors: generatedPalette,
      timestamp: Date.now()
    };
    
    setSavedPalettes([...savedPalettes, newPalette]);
    setPaletteName('');
    
    toast({
      title: "Palette Saved!",
      description: `"${paletteName}" has been saved to your collection.`
    });
  };
  
  // Delete a saved palette
  const deletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter(palette => palette.id !== id));
    
    toast({
      title: "Palette Deleted",
      description: "The palette has been removed from your collection."
    });
  };
  
  // Copy a color to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: `${type} Copied!`,
      description: `${text} has been copied to your clipboard.`
    });
  };
  
  // Export palette as an image (simplified - would normally create a real PNG)
  const exportPalette = (palette: Color[]) => {
    // In a real implementation, this would create and download a PNG
    // Here we just pretend to do it
    toast({
      title: "Export Started",
      description: "Your palette would now download as a PNG image."
    });
  };
  
  // Color card component
  const ColorCard = ({ color }: { color: Color }) => {
    return (
      <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm">
        <div 
          className="h-24 w-full" 
          style={{ backgroundColor: color.hex }}
        />
        <div className="p-3 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{color.name || color.hex}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => copyToClipboard(color.hex, 'HEX')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>HEX:</span>
              <span>{color.hex}</span>
            </div>
            <div className="flex justify-between">
              <span>RGB:</span>
              <span>{color.rgb}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Create harmonious color palettes for your brand and marketing materials."
      icon={<Brush className="h-8 w-8 text-rose-500" />}
      helpText="Choose a base color and harmony type to generate a coordinated color palette. You can save palettes for future reference or export them as images."
    >
      <Tabs defaultValue="generate">
        <TabsList className="mb-6">
          <TabsTrigger value="generate">Generate Palette</TabsTrigger>
          <TabsTrigger value="saved">Saved Palettes ({savedPalettes.length})</TabsTrigger>
        </TabsList>
      
        <TabsContent value="generate">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Color
                </label>
                <div className="flex gap-3">
                  <div 
                    className="h-10 w-10 rounded-md border shadow-sm" 
                    style={{ backgroundColor: baseColor }}
                  />
                  <Input 
                    type="color" 
                    value={baseColor} 
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harmony Type
                </label>
                <Select 
                  value={harmonyType} 
                  onValueChange={setHarmonyType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select harmony type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complementary">Complementary</SelectItem>
                    <SelectItem value="analogous">Analogous</SelectItem>
                    <SelectItem value="triadic">Triadic</SelectItem>
                    <SelectItem value="monochromatic">Monochromatic</SelectItem>
                    <SelectItem value="shades">Shades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Colors: {paletteSize[0]}
              </label>
              <Slider
                value={paletteSize}
                onValueChange={setPaletteSize}
                min={3}
                max={8}
                step={1}
                className="max-w-md"
              />
            </div>
            
            <Button 
              onClick={generatePalette} 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  Generate New Palette <RefreshCw className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            {generatedPalette.length > 0 && (
              <div className="mt-6 space-y-6">
                <h3 className="text-xl font-medium">Your Generated Palette</h3>
                
                {/* Color preview bar */}
                <div className="h-16 w-full flex rounded-lg overflow-hidden shadow-md">
                  {generatedPalette.map((color, index) => (
                    <div 
                      key={index} 
                      className="h-full flex-1" 
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                
                {/* Color cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {generatedPalette.map((color, index) => (
                    <ColorCard key={index} color={color} />
                  ))}
                </div>
                
                {/* Save and Export */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="Name this palette..." 
                      value={paletteName}
                      onChange={(e) => setPaletteName(e.target.value)}
                      className="mb-2 sm:mb-0"
                    />
                  </div>
                  <Button 
                    onClick={savePalette}
                    disabled={!paletteName.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Save Palette
                  </Button>
                  <Button onClick={() => exportPalette(generatedPalette)} variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          {savedPalettes.length > 0 ? (
            <div className="space-y-8">
              {savedPalettes.map((palette) => (
                <Card key={palette.id} className="overflow-hidden">
                  <div className="h-12 w-full flex">
                    {palette.colors.map((color, index) => (
                      <div 
                        key={index} 
                        className="h-full flex-1" 
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">{palette.name}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => exportPalette(palette.colors)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => deletePalette(palette.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {palette.colors.map((color, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="flex justify-between items-center cursor-pointer p-2 h-8"
                          onClick={() => copyToClipboard(color.hex, 'Color')}
                        >
                          <div 
                            className="h-4 w-4 rounded-full mr-2" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs truncate">{color.hex}</span>
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Created {new Date(palette.timestamp).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brush className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Saved Palettes Yet</h3>
              <p className="text-gray-500 mb-6">Generate and save color palettes to view them here.</p>
              <Button 
                variant="default"
                onClick={() => {
                  const generateTab = document.querySelector('[data-state="inactive"][value="generate"]');
                  if (generateTab && generateTab instanceof HTMLElement) {
                    generateTab.click();
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create New Palette <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default ColorPaletteGenerator; 