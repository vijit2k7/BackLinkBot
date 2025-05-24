import { FaviconSettings } from './types';

/**
 * Generate a favicon canvas based on the provided settings
 */
export const generateFaviconCanvas = (
  settings: FaviconSettings,
  size: number = 256
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  // Background
  ctx.fillStyle = settings.backgroundColor;
  
  // Shape
  if (settings.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (settings.shape === 'rounded') {
    const radius = size / 10;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    // Square
    ctx.fillRect(0, 0, size, size);
  }
  
  // If using image and image is loaded
  if (settings.useImage && settings.imageFile) {
    // This part would need a callback with actual image data
    // For demo purposes, we'll just add placeholder code
    // In a real implementation, you'd use createImageBitmap or similar
    return canvas;
  }
  
  // Text
  const text = settings.text.substring(0, 2).toUpperCase(); // Get first two letters
  ctx.fillStyle = settings.textColor;
  
  const fontSize = (settings.fontSize / 100) * size;
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);
  
  return canvas;
};

/**
 * Generate a data URL from a favicon canvas
 */
export const canvasToDataURL = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png');
};

/**
 * Convert canvas to a Blob for downloading
 */
export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
};

/**
 * Generate HTML code for favicon inclusion
 */
export const generateFaviconHtml = (sizes: number[]): string => {
  let html = '';
  
  // Add standard favicon link
  html += `<link rel="icon" href="/favicon.ico" sizes="any">\n`;
  
  // Add PNG favicons for different sizes
  sizes.forEach(size => {
    html += `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">\n`;
  });
  
  // Add Apple touch icon
  html += `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n`;
  
  // Add manifest link
  html += `<link rel="manifest" href="/site.webmanifest">\n`;
  
  return html;
};

/**
 * Generate web manifest file content
 */
export const generateWebManifest = (name: string, sizes: number[]): string => {
  const icons = sizes.map(size => ({
    src: `/favicon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png'
  }));
  
  const manifest = {
    name: name || 'Web App',
    short_name: name || 'App',
    icons: icons,
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone'
  };
  
  return JSON.stringify(manifest, null, 2);
}; 