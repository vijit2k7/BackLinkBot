import { SpeedTestResult } from './types';

// Generate mock performance data based on URL input
export const generateMockSpeedTest = (url: string): SpeedTestResult => {
  // Generate a deterministic score based on the URL to ensure consistent results
  const urlHash = hashString(url);
  
  // Generate a score between 40 and 98
  const performanceScore = 40 + (urlHash % 59);
  
  // Generate timing metrics
  const fcp = 0.5 + (urlHash % 30) / 10; // 0.5 - 3.5 seconds
  const lcp = fcp + 0.5 + (urlHash % 20) / 10; // slightly higher than FCP
  const ttfb = 0.1 + (urlHash % 15) / 10; // 0.1 - 1.6 seconds
  const cls = (urlHash % 30) / 1000; // 0 - 0.03
  const tbt = (urlHash % 300); // 0 - 300 ms
  const si = fcp * 0.8 + (urlHash % 10) / 10; // roughly related to FCP
  
  // Resource counts
  const jsCount = 5 + (urlHash % 30);
  const cssCount = 2 + (urlHash % 10);
  const imageCount = 5 + (urlHash % 40);
  const fontCount = 1 + (urlHash % 5);
  const otherCount = 3 + (urlHash % 15);
  const totalCount = jsCount + cssCount + imageCount + fontCount + otherCount;
  
  // Resource sizes (KB)
  const jsSize = 120 + (urlHash % 500);
  const cssSize = 25 + (urlHash % 100);
  const imageSize = 500 + (urlHash % 2000);
  const fontSize = 75 + (urlHash % 150);
  const otherSize = 50 + (urlHash % 100);
  const totalSize = jsSize + cssSize + imageSize + fontSize + otherSize;
  
  // Generate appropriate issues based on performance score
  const issues = generateIssues(performanceScore, urlHash);
  
  // Generate opportunities
  const opportunities = generateOpportunities(urlHash, jsSize, imageSize);
  
  // Generate passed audits
  const passed = generatePassedAudits(urlHash);
  
  return {
    url,
    performanceScore,
    metrics: {
      fcp,
      lcp, 
      ttfb,
      cls,
      tbt,
      si
    },
    resourceCounts: {
      total: totalCount,
      js: jsCount,
      css: cssCount,
      images: imageCount,
      fonts: fontCount,
      other: otherCount
    },
    resourceSizes: {
      total: totalSize,
      js: jsSize,
      css: cssSize,
      images: imageSize,
      fonts: fontSize,
      other: otherSize
    },
    issues,
    opportunities,
    passed
  };
};

// Simple string hash function for deterministic "randomness"
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Format milliseconds to human-readable string
export const formatTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms.toFixed(0)} ms`;
  }
  return `${(ms / 1000).toFixed(1)} s`;
};

// Format size in bytes to human-readable string
export const formatSize = (kb: number): string => {
  if (kb < 1024) {
    return `${kb.toFixed(0)} KB`;
  }
  return `${(kb / 1024).toFixed(2)} MB`;
};

// Get color based on performance score
export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
};

// Get color for progress bar based on performance score
export const getProgressColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
};

// Generate appropriate issues based on performance score
const generateIssues = (performanceScore: number, seed: number) => {
  const issues = [];
  
  if (performanceScore < 90) {
    // Add some critical issues for lower scores
    if (performanceScore < 70) {
      issues.push({
        type: 'critical' as const,
        title: 'Eliminate render-blocking resources',
        description: 'Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.',
        impact: 60 + (seed % 30)
      });
      
      if (performanceScore < 60) {
        issues.push({
          type: 'critical' as const,
          title: 'Properly size images',
          description: 'Your page is sending images that are larger than needed. Serve images that are appropriately-sized to save cellular data and improve load time.',
          impact: 50 + (seed % 20)
        });
      }
    }
    
    // Add some warnings
    issues.push({
      type: 'warning' as const,
      title: 'Minimize main-thread work',
      description: 'Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this.',
      impact: 30 + (seed % 40)
    });
    
    if (seed % 4 === 0) {
      issues.push({
        type: 'warning' as const,
        title: 'Reduce JavaScript execution time',
        description: 'Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this.',
        impact: 40 + (seed % 30)
      });
    }
  }
  
  // Add some info issues
  issues.push({
    type: 'info' as const,
    title: 'Serve static assets with efficient cache policy',
    description: 'A long cache lifetime can speed up repeat visits to your page.',
    impact: 20 + (seed % 20)
  });
  
  if (seed % 3 === 0) {
    issues.push({
      type: 'info' as const,
      title: 'Avoid multiple page redirects',
      description: 'Redirects introduce additional delays before the page can be loaded.',
      impact: 10 + (seed % 30)
    });
  }
  
  return issues;
};

// Generate opportunities for improvement
const generateOpportunities = (seed: number, jsSize: number, imageSize: number) => {
  const opportunities = [];
  
  // Add opportunities based on resource sizes
  if (jsSize > 200) {
    opportunities.push({
      title: 'Reduce JavaScript size',
      description: 'Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.',
      savingsMs: 100 + (seed % 500),
      savingsKb: Math.floor(jsSize * 0.3)
    });
  }
  
  if (imageSize > 800) {
    opportunities.push({
      title: 'Properly size images',
      description: 'Serve images that are appropriately-sized to save cellular data and improve load time.',
      savingsMs: 200 + (seed % 800),
      savingsKb: Math.floor(imageSize * 0.4)
    });
    
    opportunities.push({
      title: 'Efficiently encode images',
      description: 'Optimized images load faster and consume less cellular data.',
      savingsMs: 150 + (seed % 400),
      savingsKb: Math.floor(imageSize * 0.25)
    });
  }
  
  opportunities.push({
    title: 'Enable text compression',
    description: 'Text-based resources should be served with compression (gzip, deflate or brotli) to minimize total network bytes.',
    savingsMs: 50 + (seed % 300),
    savingsKb: Math.floor((jsSize + 50) * 0.6)
  });
  
  return opportunities;
};

// Generate passed audits
const generatePassedAudits = (seed: number) => {
  const allPossiblePassed = [
    {
      title: 'Minify CSS',
      description: 'Your CSS files are minified. Learn more about minifying CSS.'
    },
    {
      title: 'User Timing marks and measures',
      description: 'Your site is using the User Timing API to measure the performance of key user experience metrics.'
    },
    {
      title: 'Avoids Document.write()',
      description: 'Your page does not use document.write(), which can delay page load.'
    },
    {
      title: 'Avoids enormous network payloads',
      description: 'Your page weight is well within reasonable limits.'
    },
    {
      title: 'Uses HTTPS',
      description: 'Your page is using HTTPS, a security feature that encrypts data during transport.'
    },
    {
      title: 'Avoids Application Cache',
      description: 'Your page does not use the deprecated Application Cache API.'
    }
  ];
  
  // Select a random subset of passed audits
  const numPassed = 3 + (seed % 4); // Between 3 and 6 passed audits
  const passed = [];
  
  for (let i = 0; i < numPassed; i++) {
    const index = (seed + i) % allPossiblePassed.length;
    passed.push(allPossiblePassed[index]);
  }
  
  return passed;
};

// Generate a unique ID for history items
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
}; 