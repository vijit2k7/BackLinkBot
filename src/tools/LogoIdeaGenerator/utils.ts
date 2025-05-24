import { LogoIdea, LogoGenerationOptions } from './types';

// Industry options
export const industries = [
  'Technology',
  'Food & Restaurant',
  'Health & Wellness',
  'Education',
  'Finance',
  'Real Estate',
  'Fashion & Beauty',
  'Travel & Hospitality',
  'Entertainment',
  'Sports & Fitness',
  'Art & Design',
  'Construction',
  'Automotive',
  'Agriculture',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Legal',
  'Non-profit',
  'Other'
];

// Style options
export const logoStyles = [
  'Minimalist',
  'Modern',
  'Vintage/Retro',
  'Playful',
  'Elegant',
  'Bold',
  'Geometric',
  'Hand-drawn',
  'Abstract',
  'Mascot',
  'Emblem',
  'Lettermark',
  'Wordmark',
  'Combination'
];

// Color options
export const colorOptions = [
  'Blue tones',
  'Red tones',
  'Green tones',
  'Yellow tones',
  'Purple tones',
  'Orange tones',
  'Black & White',
  'Pastel colors',
  'Vibrant colors',
  'Earthy tones',
  'Metallic',
  'Gradient',
  'Monochromatic',
  'No preference'
];

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate color palettes based on preference
export const generateColorPalette = (preference: string): string[] => {
  const palettes: Record<string, string[]> = {
    'Blue tones': ['#1E3A8A', '#3B82F6', '#93C5FD', '#DBEAFE', '#FFFFFF'],
    'Red tones': ['#991B1B', '#EF4444', '#FCA5A5', '#FEE2E2', '#FFFFFF'],
    'Green tones': ['#065F46', '#10B981', '#A7F3D0', '#D1FAE5', '#FFFFFF'],
    'Yellow tones': ['#92400E', '#F59E0B', '#FCD34D', '#FEF3C7', '#FFFFFF'],
    'Purple tones': ['#5B21B6', '#8B5CF6', '#C4B5FD', '#EDE9FE', '#FFFFFF'],
    'Orange tones': ['#9A3412', '#F97316', '#FDBA74', '#FFEDD5', '#FFFFFF'],
    'Black & White': ['#000000', '#4B5563', '#9CA3AF', '#E5E7EB', '#FFFFFF'],
    'Pastel colors': ['#FBCFE8', '#A7F3D0', '#BFDBFE', '#FDE68A', '#FFFFFF'],
    'Vibrant colors': ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#FFFFFF'],
    'Earthy tones': ['#78350F', '#92400E', '#B45309', '#D97706', '#F59E0B'],
    'Metallic': ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F9FAFB'],
    'Gradient': ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#FFFFFF'],
    'Monochromatic': ['#1E3A8A', '#1E40AF', '#3B82F6', '#93C5FD', '#DBEAFE']
  };
  
  // If preference is in the palettes, return it
  if (preference in palettes) {
    return palettes[preference];
  }
  
  // Otherwise, return a random palette
  const keys = Object.keys(palettes);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return palettes[randomKey];
};

// Generate logo elements based on industry
export const generateLogoElements = (industry: string): string[] => {
  const industryElements: Record<string, string[]> = {
    'Technology': ['circuit', 'gear', 'pixel', 'code', 'chip', 'network', 'cloud', 'digital'],
    'Food & Restaurant': ['fork', 'knife', 'plate', 'chef hat', 'spoon', 'food', 'ingredient', 'flame'],
    'Health & Wellness': ['heart', 'leaf', 'cross', 'pulse', 'water', 'person', 'hands', 'sun'],
    'Education': ['book', 'pencil', 'graduation cap', 'apple', 'lightbulb', 'brain', 'school'],
    'Finance': ['coin', 'chart', 'dollar', 'graph', 'shield', 'building', 'arrow', 'lock'],
    'Real Estate': ['house', 'key', 'building', 'roof', 'door', 'window', 'tree', 'location'],
    'Fashion & Beauty': ['scissors', 'hanger', 'dress', 'mirror', 'lipstick', 'brush', 'fabric'],
    'Travel & Hospitality': ['plane', 'suitcase', 'compass', 'map', 'hotel', 'palm tree', 'mountain'],
    'Entertainment': ['camera', 'film', 'music', 'stage', 'ticket', 'star', 'microphone', 'mask'],
    'Sports & Fitness': ['ball', 'trophy', 'medal', 'shoe', 'weight', 'person', 'mountain', 'track'],
    'Art & Design': ['brush', 'palette', 'canvas', 'pen', 'color', 'shape', 'tool', 'eye'],
    'Construction': ['hammer', 'wrench', 'helmet', 'brick', 'house', 'blueprint', 'crane'],
    'Automotive': ['car', 'wheel', 'road', 'key', 'gear', 'speedometer', 'wrench', 'tire'],
    'Agriculture': ['leaf', 'plant', 'tractor', 'sun', 'water', 'field', 'grain', 'farm'],
    'Retail': ['shopping bag', 'tag', 'hanger', 'cart', 'store', 'box', 'gift', 'dollar'],
    'Manufacturing': ['gear', 'factory', 'tool', 'assembly', 'machine', 'product', 'worker'],
    'Consulting': ['handshake', 'lightbulb', 'chart', 'person', 'briefcase', 'puzzle', 'target'],
    'Legal': ['scale', 'gavel', 'book', 'shield', 'handshake', 'document', 'pillar', 'pen'],
    'Non-profit': ['heart', 'hands', 'globe', 'people', 'leaf', 'star', 'ribbon', 'dove']
  };
  
  // If industry is in the elements, return 3-4 random elements
  if (industry in industryElements) {
    const elements = industryElements[industry];
    const shuffled = [...elements].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 2)); // 3-4 elements
  }
  
  // Otherwise, return generic elements
  return ['shape', 'text', 'icon', 'symbol', 'line'].sort(() => 0.5 - Math.random()).slice(0, 3);
};

// Generate logo style description
export const generateStyleDescription = (style: string): string => {
  const styleDescriptions: Record<string, string[]> = {
    'Minimalist': [
      'Clean and simple design with minimal elements',
      'Focuses on essential elements with plenty of white space',
      'Stripped down to the bare essentials for maximum impact',
      'Elegant simplicity with careful attention to spacing and proportion'
    ],
    'Modern': [
      'Contemporary design with clean lines and bold elements',
      'Sleek and professional with current design trends',
      'Forward-thinking approach with innovative elements',
      'Cutting-edge aesthetic that feels fresh and current'
    ],
    'Vintage/Retro': [
      'Classic design inspired by past eras',
      'Nostalgic elements that evoke a sense of history',
      'Traditional craftsmanship with aged or distressed effects',
      'Time-honored design principles with historical references'
    ],
    'Playful': [
      'Fun and energetic design with whimsical elements',
      'Vibrant and cheerful with dynamic shapes',
      'Approachable and friendly with casual elements',
      'Lively composition with unexpected creative touches'
    ],
    'Elegant': [
      'Sophisticated design with refined elements',
      'Graceful and polished with premium feel',
      'Luxurious aesthetic with careful attention to detail',
      'Timeless beauty with balanced proportions'
    ],
    'Bold': [
      'Strong and impactful design with high contrast',
      'Confident and assertive with powerful elements',
      'Attention-grabbing with dramatic visual weight',
      'Striking appearance that makes a strong statement'
    ],
    'Geometric': [
      'Based on precise shapes and mathematical principles',
      'Structured design with clean angles and forms',
      'Organized patterns created from basic shapes',
      'Systematic approach with consistent geometric elements'
    ],
    'Hand-drawn': [
      'Organic design with authentic human touch',
      'Artisanal quality with natural imperfections',
      'Unique character with custom illustrated elements',
      'Warm and approachable with artistic craftsmanship'
    ],
    'Abstract': [
      'Non-representational design open to interpretation',
      'Conceptual approach focusing on form and color',
      'Artistic expression that suggests rather than depicts',
      'Symbolic representation with non-literal elements'
    ],
    'Mascot': [
      'Character-based design with personality',
      'Memorable figure that represents the brand',
      'Distinctive character that builds brand recognition',
      'Anthropomorphic or animated figure as central element'
    ],
    'Emblem': [
      'Badge or seal-like design with contained elements',
      'Traditional format with elements inside a boundary',
      'Compact arrangement with integrated text and graphics',
      'Classic structure with symmetrical composition'
    ],
    'Lettermark': [
      'Typographic design based on initials or letters',
      'Monogram approach focusing on key characters',
      'Letter-based design with distinctive typography',
      'Abbreviated representation using custom lettering'
    ],
    'Wordmark': [
      'Text-only design with distinctive typography',
      'Name-focused approach with custom lettering',
      'Typographic treatment that enhances brand name',
      'Word-based design with careful attention to letterforms'
    ],
    'Combination': [
      'Hybrid design combining multiple logo styles',
      'Versatile approach with complementary elements',
      'Balanced integration of symbol and text',
      'Comprehensive design with multiple components'
    ]
  };
  
  // If style is in the descriptions, return a random description
  if (style in styleDescriptions) {
    const descriptions = styleDescriptions[style];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
  
  // Otherwise, return a generic description
  return 'A distinctive logo design that represents your brand identity';
};

// Generate a logo idea based on options
export const generateLogoIdea = (options: LogoGenerationOptions): LogoIdea => {
  const { businessName, industry, keywords, colorPreference, stylePreference } = options;
  
  // Generate colors based on preference
  const colors = generateColorPalette(colorPreference);
  
  // Generate elements based on industry and keywords
  const elements = generateLogoElements(industry);
  
  // Generate style description
  const styleDescription = generateStyleDescription(stylePreference);
  
  // Create a logo name
  const logoNames = [
    `${businessName} ${stylePreference} Logo`,
    `${stylePreference} ${industry} Identity`,
    `${businessName} Brand Mark`,
    `${industry} Symbol for ${businessName}`,
    `${businessName} Visual Identity`
  ];
  const name = logoNames[Math.floor(Math.random() * logoNames.length)];
  
  // Create a description
  let description = `A ${stylePreference.toLowerCase()} logo design for ${businessName} in the ${industry.toLowerCase()} industry. ${styleDescription}. `;
  
  // Add color description
  description += `Features a color palette of ${colorPreference.toLowerCase()} that conveys professionalism and trust. `;
  
  // Add elements description
  description += `Incorporates elements such as ${elements.join(', ')} to represent the brand's values`;
  
  // Add keywords if available
  if (keywords.length > 0) {
    description += ` and emphasize concepts like ${keywords.join(', ')}`;
  }
  description += '.';
  
  return {
    id: generateId(),
    name,
    description,
    colors,
    style: stylePreference,
    elements,
    industry
  };
};

// Generate multiple logo ideas
export const generateLogoIdeas = (options: LogoGenerationOptions, count: number = 5): LogoIdea[] => {
  const ideas: LogoIdea[] = [];
  
  for (let i = 0; i < count; i++) {
    // Slightly vary the options for each idea
    const variedOptions = { ...options };
    
    // Occasionally vary the style
    if (i > 0 && Math.random() > 0.7) {
      const filteredStyles = logoStyles.filter(style => style !== options.stylePreference);
      variedOptions.stylePreference = filteredStyles[Math.floor(Math.random() * filteredStyles.length)];
    }
    
    // Occasionally vary the color preference
    if (i > 0 && Math.random() > 0.7) {
      const filteredColors = colorOptions.filter(color => color !== options.colorPreference);
      variedOptions.colorPreference = filteredColors[Math.floor(Math.random() * filteredColors.length)];
    }
    
    ideas.push(generateLogoIdea(variedOptions));
  }
  
  return ideas;
}; 