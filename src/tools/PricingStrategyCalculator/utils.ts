import { 
  CostBreakdown, 
  CompetitorPrice, 
  PricingInputs, 
  PricingStrategy, 
  PricingAnalysis 
} from './types';

// Customer segments
export const customerSegments = [
  'Small Businesses',
  'Enterprise',
  'Consumers',
  'Freelancers',
  'Educational Institutions',
  'Government',
  'Non-profit Organizations',
  'Healthcare',
  'Retail',
  'Manufacturing'
];

// Market positions
export const marketPositions = [
  'Premium/Luxury',
  'Mid-market',
  'Budget/Economy',
  'Value-focused'
];

// Pricing models
export const pricingModels = [
  'One-time Purchase',
  'Subscription',
  'Freemium',
  'Usage-based',
  'Tiered Pricing',
  'Value-based'
];

// Calculate total cost from cost breakdown
export const calculateTotalCost = (costs: CostBreakdown): number => {
  return (
    costs.materials +
    costs.labor +
    costs.overhead +
    costs.shipping +
    costs.marketing +
    costs.other
  );
};

// Calculate average competitor price
export const calculateAverageCompetitorPrice = (
  competitorPrices: CompetitorPrice[]
): number => {
  if (competitorPrices.length === 0) return 0;
  
  const sum = competitorPrices.reduce((acc, curr) => acc + curr.price, 0);
  return sum / competitorPrices.length;
};

// Calculate cost-based price (cost-plus pricing)
export const calculateCostBasedPrice = (
  totalCost: number,
  targetProfit: number
): number => {
  return totalCost * (1 + targetProfit / 100);
};

// Calculate competitor-based price
export const calculateCompetitorBasedPrice = (
  competitorPrices: CompetitorPrice[],
  marketPosition: string
): number => {
  const avgPrice = calculateAverageCompetitorPrice(competitorPrices);
  
  if (competitorPrices.length === 0) return 0;
  
  // Adjust based on market position
  switch (marketPosition) {
    case 'Premium/Luxury':
      return avgPrice * 1.2; // 20% above average
    case 'Mid-market':
      return avgPrice; // At average
    case 'Budget/Economy':
      return avgPrice * 0.8; // 20% below average
    case 'Value-focused':
      return avgPrice * 0.9; // 10% below average
    default:
      return avgPrice;
  }
};

// Calculate value-based price
export const calculateValueBasedPrice = (
  totalCost: number,
  valuePerception: number,
  priceElasticity: number,
  marketPosition: string
): number => {
  // Base multiplier based on value perception (1-10 scale)
  let valueMultiplier = 1 + (valuePerception / 10);
  
  // Adjust for price elasticity (1-10 scale, 1 = highly elastic, 10 = inelastic)
  // Higher elasticity means less room to price based on value
  const elasticityFactor = priceElasticity / 10;
  
  // Adjust for market position
  let positionMultiplier = 1;
  switch (marketPosition) {
    case 'Premium/Luxury':
      positionMultiplier = 1.5;
      break;
    case 'Mid-market':
      positionMultiplier = 1.2;
      break;
    case 'Budget/Economy':
      positionMultiplier = 1.0;
      break;
    case 'Value-focused':
      positionMultiplier = 1.1;
      break;
    default:
      positionMultiplier = 1.2;
  }
  
  // Calculate value-based price
  return totalCost * valueMultiplier * elasticityFactor * positionMultiplier;
};

// Generate pricing strategies
export const generatePricingStrategies = (
  inputs: PricingInputs,
  analysis: {
    totalCost: number;
    costBasedPrice: number;
    competitorBasedPrice: number;
    valueBasedPrice: number;
    averageCompetitorPrice: number;
  }
): PricingStrategy[] => {
  const { 
    totalCost, 
    costBasedPrice, 
    competitorBasedPrice, 
    valueBasedPrice, 
    averageCompetitorPrice 
  } = analysis;
  
  const strategies: PricingStrategy[] = [];
  
  // Cost-Plus Strategy
  strategies.push({
    name: 'Cost-Plus Pricing',
    description: 'Sets price based on the cost of production plus a desired profit margin.',
    suggestedPrice: costBasedPrice,
    profitMargin: ((costBasedPrice - totalCost) / costBasedPrice) * 100,
    pros: [
      'Simple to calculate and implement',
      'Ensures costs are covered',
      'Predictable profit margin'
    ],
    cons: [
      'Ignores market conditions and competition',
      'May leave money on the table if customers value product highly',
      'Doesn\'t account for customer willingness to pay'
    ],
    recommendation: inputs.targetProfit < 20 
      ? 'Recommended for commodity products or highly competitive markets'
      : 'Consider other strategies that may capture more value'
  });
  
  // Competitive Pricing
  strategies.push({
    name: 'Competitive Pricing',
    description: 'Sets price based on what competitors are charging for similar products.',
    suggestedPrice: competitorBasedPrice,
    profitMargin: ((competitorBasedPrice - totalCost) / competitorBasedPrice) * 100,
    pros: [
      'Aligns with market expectations',
      'Reduces risk of being priced out of the market',
      'Easy for customers to understand the value proposition'
    ],
    cons: [
      'May not account for unique value of your product',
      'Can lead to price wars',
      'Assumes competitors have similar cost structures'
    ],
    recommendation: inputs.competitorPrices.length > 0
      ? 'Effective in mature markets with established price points'
      : 'Not recommended without more competitor data'
  });
  
  // Value-Based Pricing
  strategies.push({
    name: 'Value-Based Pricing',
    description: 'Sets price based on the perceived value to customers rather than costs.',
    suggestedPrice: valueBasedPrice,
    profitMargin: ((valueBasedPrice - totalCost) / valueBasedPrice) * 100,
    pros: [
      'Captures more value when customers perceive high benefits',
      'Aligns pricing with customer willingness to pay',
      'Can lead to higher profit margins'
    ],
    cons: [
      'Requires good understanding of customer value perception',
      'More complex to implement',
      'May require market research to validate'
    ],
    recommendation: inputs.valuePerception > 7
      ? 'Highly recommended for products with unique features or strong brand'
      : 'Consider if you can better communicate your product\'s value'
  });
  
  // Premium Pricing
  if (inputs.marketPosition === 'Premium/Luxury') {
    const premiumPrice = Math.max(valueBasedPrice, averageCompetitorPrice * 1.3);
    strategies.push({
      name: 'Premium Pricing',
      description: 'Sets a high price to reflect the exclusivity and high quality of the product.',
      suggestedPrice: premiumPrice,
      profitMargin: ((premiumPrice - totalCost) / premiumPrice) * 100,
      pros: [
        'Reinforces premium brand positioning',
        'Higher profit margins',
        'Attracts quality-focused customers'
      ],
      cons: [
        'Limits market size',
        'Requires strong brand and quality to justify',
        'Vulnerable to economic downturns'
      ],
      recommendation: inputs.valuePerception > 8
        ? 'Recommended for luxury products with strong brand recognition'
        : 'Ensure your product quality and brand can support this position'
    });
  }
  
  // Economy Pricing
  if (inputs.marketPosition === 'Budget/Economy') {
    const economyPrice = Math.min(costBasedPrice * 1.1, averageCompetitorPrice * 0.8);
    strategies.push({
      name: 'Economy Pricing',
      description: 'Sets a low price to attract price-sensitive customers.',
      suggestedPrice: economyPrice,
      profitMargin: ((economyPrice - totalCost) / economyPrice) * 100,
      pros: [
        'Appeals to price-sensitive customers',
        'Can drive higher sales volume',
        'Simple value proposition'
      ],
      cons: [
        'Lower profit margins',
        'May create perception of lower quality',
        'Requires efficient operations to remain profitable'
      ],
      recommendation: inputs.priceElasticity < 4
        ? 'Effective for basic products in price-sensitive markets'
        : 'Consider if your operations can support low margins'
    });
  }
  
  // Penetration Pricing
  const penetrationPrice = Math.min(costBasedPrice, averageCompetitorPrice * 0.85);
  strategies.push({
    name: 'Penetration Pricing',
    description: 'Sets an initially low price to gain market share, with plans to increase later.',
    suggestedPrice: penetrationPrice,
    profitMargin: ((penetrationPrice - totalCost) / penetrationPrice) * 100,
    pros: [
      'Helps gain market share quickly',
      'Creates barriers to entry for competitors',
      'Can build customer base rapidly'
    ],
    cons: [
      'Initially lower profits or even losses',
      'Customers may resist price increases later',
      'May trigger competitive response'
    ],
    recommendation: 'Consider for new market entry or when trying to establish market share'
  });
  
  // Skimming Pricing
  const skimmingPrice = Math.max(valueBasedPrice * 1.2, costBasedPrice * 1.5);
  strategies.push({
    name: 'Price Skimming',
    description: 'Sets a high initial price that gradually reduces over time.',
    suggestedPrice: skimmingPrice,
    profitMargin: ((skimmingPrice - totalCost) / skimmingPrice) * 100,
    pros: [
      'Maximizes revenue from early adopters',
      'Recoups development costs quickly',
      'Creates perception of premium quality'
    ],
    cons: [
      'Limited initial market size',
      'May attract competitors if successful',
      'Requires unique product with few substitutes'
    ],
    recommendation: inputs.valuePerception > 8 && inputs.priceElasticity > 7
      ? 'Effective for innovative products with few competitors'
      : 'Consider if your product has unique features worth paying premium for'
  });
  
  // Sort strategies by profitability and filter out negative margins
  return strategies
    .filter(strategy => strategy.profitMargin > 0)
    .sort((a, b) => b.profitMargin - a.profitMargin);
};

// Generate pricing analysis
export const generatePricingAnalysis = (inputs: PricingInputs): PricingAnalysis => {
  // Calculate total cost
  const totalCost = calculateTotalCost(inputs.costs);
  
  // Calculate average competitor price
  const averageCompetitorPrice = calculateAverageCompetitorPrice(inputs.competitorPrices);
  
  // Calculate different pricing approaches
  const costBasedPrice = calculateCostBasedPrice(totalCost, inputs.targetProfit);
  const competitorBasedPrice = calculateCompetitorBasedPrice(
    inputs.competitorPrices,
    inputs.marketPosition
  );
  const valueBasedPrice = calculateValueBasedPrice(
    totalCost,
    inputs.valuePerception,
    inputs.priceElasticity,
    inputs.marketPosition
  );
  
  // Generate pricing strategies
  const analysisData = {
    totalCost,
    costBasedPrice,
    competitorBasedPrice,
    valueBasedPrice,
    averageCompetitorPrice
  };
  
  const recommendedStrategies = generatePricingStrategies(inputs, analysisData);
  
  return {
    totalCost,
    costBasedPrice,
    competitorBasedPrice,
    valueBasedPrice,
    recommendedStrategies,
    averageCompetitorPrice
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format percentage
export const formatPercentage = (percentage: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(percentage / 100);
}; 