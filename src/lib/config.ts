/**
 * Application configuration management
 * 
 * This module centralizes access to environment variables and configuration settings.
 * It provides type-safe access to configuration values with reasonable defaults for development.
 */

interface Config {
  // API Keys
  resendApiKey: string;
  instantlyApiKey: string;
  instantlyCampaignId: string;
  
  // Application settings
  nodeEnv: 'development' | 'production' | 'test';
  isProduction: boolean;
  isDevelopment: boolean;
  
  // Email settings
  emailFromAddress: string;
  emailFromName: string;
}

const config: Config = {
  // API Keys - use environment variables in production
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
  instantlyApiKey: import.meta.env.VITE_INSTANTLY_API_KEY || '',
  instantlyCampaignId: import.meta.env.VITE_INSTANTLY_CAMPAIGN_ID || '',
  
  // Application environment
  nodeEnv: (import.meta.env.MODE || 'development') as Config['nodeEnv'],
  get isProduction() { return this.nodeEnv === 'production' },
  get isDevelopment() { return this.nodeEnv === 'development' },
  
  // Email settings
  emailFromAddress: import.meta.env.VITE_EMAIL_FROM_ADDRESS || 'directories@yourdomain.com',
  emailFromName: import.meta.env.VITE_EMAIL_FROM_NAME || 'Startup Directories',
};

export default config; 