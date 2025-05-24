/**
 * Global type definitions for the application
 */

// Google Analytics gtag type definition
interface GTagFunction {
  (command: 'event', action: string, params: { 
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }): void;
  (command: 'config', targetId: string, config?: object): void;
  (command: 'set', config: object): void;
  (command: 'js', date: Date): void;
  (command: string, ...args: any[]): void;
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: GTagFunction;
  }
}

export {}; 