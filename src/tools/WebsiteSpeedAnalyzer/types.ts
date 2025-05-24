export interface SpeedTestResult {
  url: string;
  performanceScore: number;
  metrics: {
    fcp: number; // First Contentful Paint (seconds)
    lcp: number; // Largest Contentful Paint (seconds)
    ttfb: number; // Time to First Byte (seconds)
    cls: number; // Cumulative Layout Shift (unitless)
    tbt: number; // Total Blocking Time (milliseconds)
    si: number; // Speed Index (seconds)
  };
  resourceCounts: {
    total: number;
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
  resourceSizes: {
    total: number; // KB
    js: number; // KB
    css: number; // KB
    images: number; // KB
    fonts: number; // KB
    other: number; // KB
  };
  issues: Array<{
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    impact: number; // 0-100
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    savingsMs: number;
    savingsKb?: number;
  }>;
  passed: Array<{
    title: string;
    description: string;
  }>;
}

export interface SpeedTestHistory {
  id: string;
  url: string;
  date: string;
  performanceScore: number;
} 