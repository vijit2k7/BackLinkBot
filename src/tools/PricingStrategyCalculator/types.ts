export interface CostBreakdown {
  materials: number;
  labor: number;
  overhead: number;
  shipping: number;
  marketing: number;
  other: number;
}

export interface CompetitorPrice {
  name: string;
  price: number;
}

export interface PricingInputs {
  productName: string;
  costs: CostBreakdown;
  targetProfit: number;
  competitorPrices: CompetitorPrice[];
  valuePerception: number; // 1-10 scale
  priceElasticity: number; // 1-10 scale (1 = highly elastic, 10 = inelastic)
  customerSegment: string;
  marketPosition: string; // premium, mid-market, budget
  pricingModel: string; // one-time, subscription, freemium
}

export interface PricingStrategy {
  name: string;
  description: string;
  suggestedPrice: number;
  profitMargin: number;
  pros: string[];
  cons: string[];
  recommendation: string;
}

export interface PricingAnalysis {
  costBasedPrice: number;
  competitorBasedPrice: number;
  valueBasedPrice: number;
  recommendedStrategies: PricingStrategy[];
  totalCost: number;
  averageCompetitorPrice: number;
} 