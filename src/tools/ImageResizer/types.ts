export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResizeOptions {
  maintainAspectRatio: boolean;
  resizeMode: 'dimensions' | 'percentage' | 'preset';
  dimensions: ImageDimensions;
  percentage: number;
  preset: string;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
}

export interface ImageInfo {
  file: File;
  originalDimensions: ImageDimensions;
  originalSize: number;
  previewUrl: string;
}

export interface ResizedImage {
  dimensions: ImageDimensions;
  size: number;
  blob: Blob;
  url: string;
} 