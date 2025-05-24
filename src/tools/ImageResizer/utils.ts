import { ImageDimensions, ResizeOptions, ImageInfo, ResizedImage } from './types';

// Common image presets
export const imagePresets = [
  { name: 'Social Media Profile (Square)', width: 1080, height: 1080 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Facebook Cover', width: 851, height: 315 },
  { name: 'Twitter Header', width: 1500, height: 500 },
  { name: 'LinkedIn Cover', width: 1584, height: 396 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'HD (1080p)', width: 1920, height: 1080 },
  { name: '4K', width: 3840, height: 2160 },
  { name: 'iPhone Wallpaper', width: 1170, height: 2532 },
  { name: 'Desktop Wallpaper', width: 2560, height: 1440 },
];

// Format file size in human-readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Load image and get its dimensions
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Get image dimensions from a file
export const getImageDimensions = async (file: File): Promise<ImageDimensions> => {
  const img = await loadImage(file);
  return {
    width: img.naturalWidth,
    height: img.naturalHeight
  };
};

// Calculate new dimensions while maintaining aspect ratio
export const calculateAspectRatioDimensions = (
  originalDimensions: ImageDimensions,
  targetDimensions: ImageDimensions
): ImageDimensions => {
  const { width: originalWidth, height: originalHeight } = originalDimensions;
  const { width: targetWidth, height: targetHeight } = targetDimensions;
  
  // If both dimensions are specified, use the one that results in a smaller image
  if (targetWidth && targetHeight) {
    const widthRatio = targetWidth / originalWidth;
    const heightRatio = targetHeight / originalHeight;
    
    if (widthRatio < heightRatio) {
      return {
        width: targetWidth,
        height: Math.round(originalHeight * widthRatio)
      };
    } else {
      return {
        width: Math.round(originalWidth * heightRatio),
        height: targetHeight
      };
    }
  }
  
  // If only one dimension is specified, calculate the other
  if (targetWidth) {
    const ratio = targetWidth / originalWidth;
    return {
      width: targetWidth,
      height: Math.round(originalHeight * ratio)
    };
  }
  
  if (targetHeight) {
    const ratio = targetHeight / originalHeight;
    return {
      width: Math.round(originalWidth * ratio),
      height: targetHeight
    };
  }
  
  // If no dimensions are specified, return original
  return originalDimensions;
};

// Calculate dimensions based on percentage
export const calculatePercentageDimensions = (
  originalDimensions: ImageDimensions,
  percentage: number
): ImageDimensions => {
  const ratio = percentage / 100;
  return {
    width: Math.round(originalDimensions.width * ratio),
    height: Math.round(originalDimensions.height * ratio)
  };
};

// Resize image based on options
export const resizeImage = async (
  imageInfo: ImageInfo,
  options: ResizeOptions
): Promise<ResizedImage> => {
  const { file, originalDimensions } = imageInfo;
  const { maintainAspectRatio, resizeMode, dimensions, percentage, preset, format, quality } = options;
  
  // Calculate new dimensions
  let newDimensions: ImageDimensions;
  
  if (resizeMode === 'dimensions') {
    if (maintainAspectRatio) {
      newDimensions = calculateAspectRatioDimensions(originalDimensions, dimensions);
    } else {
      newDimensions = dimensions;
    }
  } else if (resizeMode === 'percentage') {
    newDimensions = calculatePercentageDimensions(originalDimensions, percentage);
  } else if (resizeMode === 'preset') {
    const selectedPreset = imagePresets.find(p => p.name === preset);
    if (!selectedPreset) {
      throw new Error('Invalid preset selected');
    }
    
    if (maintainAspectRatio) {
      newDimensions = calculateAspectRatioDimensions(originalDimensions, selectedPreset);
    } else {
      newDimensions = selectedPreset;
    }
  } else {
    throw new Error('Invalid resize mode');
  }
  
  // Create canvas with new dimensions
  const canvas = document.createElement('canvas');
  canvas.width = newDimensions.width;
  canvas.height = newDimensions.height;
  
  // Draw image on canvas
  const ctx = canvas.getContext('2d')!;
  const img = await loadImage(file);
  ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);
  
  // Convert canvas to blob
  const mimeType = `image/${format}`;
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      mimeType,
      format === 'jpeg' ? quality / 100 : undefined
    );
  });
  
  // Create URL for preview
  const url = URL.createObjectURL(blob);
  
  return {
    dimensions: newDimensions,
    size: blob.size,
    blob,
    url
  };
}; 