export interface FaviconSettings {
  text: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  shape: 'square' | 'circle' | 'rounded';
  useImage: boolean;
  imageFile: File | null;
}

export interface FaviconDownloadOptions {
  sizes: {
    size: number;
    selected: boolean;
  }[];
  format: 'png' | 'ico';
  includeManifest: boolean;
  includeHtmlCode: boolean;
} 