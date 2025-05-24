export interface LogoIdea {
  id: string;
  name: string;
  description: string;
  colors: string[];
  style: string;
  elements: string[];
  industry: string;
}

export interface LogoGenerationOptions {
  businessName: string;
  industry: string;
  keywords: string[];
  colorPreference: string;
  stylePreference: string;
} 