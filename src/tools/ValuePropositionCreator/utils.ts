import { FormInputs, ValueProposition } from './types';

// Common industries for dropdown
export const industries = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'E-commerce',
  'Manufacturing',
  'Real Estate',
  'Travel',
  'Food & Beverage',
  'Professional Services',
  'Marketing & Advertising',
  'Entertainment',
  'Fitness & Wellness',
  'Non-profit',
  'Fashion & Apparel',
  'Home Services',
  'Construction',
  'Automotive',
  'Agriculture',
  'Other'
];

// Example customer jobs for various industries
export const exampleJobs: Record<string, string[]> = {
  'Technology': [
    'Increase team productivity',
    'Reduce operational costs',
    'Secure sensitive data',
    'Automate repetitive tasks',
    'Improve customer experience'
  ],
  'Healthcare': [
    'Provide quality patient care',
    'Reduce administrative burden',
    'Stay compliant with regulations',
    'Improve patient outcomes',
    'Efficiently manage patient records'
  ],
  'E-commerce': [
    'Find unique products',
    'Compare prices easily',
    'Receive orders quickly',
    'Return items hassle-free',
    'Shop securely online'
  ],
  'default': [
    'Save time on routine tasks',
    'Reduce costs and increase efficiency',
    'Solve specific problems in their workflow',
    'Improve quality of their outputs',
    'Stay ahead of competitors'
  ]
};

// Example customer pains for various industries
export const examplePains: Record<string, string[]> = {
  'Technology': [
    'Complex, hard-to-use software',
    'Integration issues with existing tools',
    'High costs of implementation',
    'Security vulnerabilities',
    'Poor technical support'
  ],
  'Healthcare': [
    'Time-consuming paperwork',
    'Difficulty accessing patient records',
    'Billing and insurance complications',
    'Staff shortages and burnout',
    'Regulatory compliance challenges'
  ],
  'E-commerce': [
    'Long shipping times',
    'Complicated checkout process',
    'Lack of product information',
    'Hidden fees and costs',
    'Poor customer service'
  ],
  'default': [
    'Wasting time on inefficient processes',
    'Overpaying for underperforming solutions',
    'Difficulty finding reliable service providers',
    'Lack of personalized attention',
    'Inconsistent quality'
  ]
};

// Example customer gains for various industries
export const exampleGains: Record<string, string[]> = {
  'Technology': [
    'Increased productivity and efficiency',
    'Reduced operational costs',
    'Better data-driven insights',
    'Improved team collaboration',
    'Future-proof, scalable solutions'
  ],
  'Healthcare': [
    'More time with patients',
    'Streamlined administrative processes',
    'Better patient outcomes',
    'Increased practice revenue',
    'Work-life balance for practitioners'
  ],
  'E-commerce': [
    'Finding unique products easily',
    'Getting best value for money',
    'Quick and reliable delivery',
    'Hassle-free returns process',
    'Personalized shopping experience'
  ],
  'default': [
    'Saving time and increasing productivity',
    'Reducing costs and improving ROI',
    'Getting reliable, consistent results',
    'Receiving personalized attention',
    'Peace of mind and reduced stress'
  ]
};

// Example pain relievers based on industry
export const examplePainRelievers: Record<string, string[]> = {
  'Technology': [
    'User-friendly interface requiring minimal training',
    'Seamless integration with existing tech stack',
    'Flexible pricing model with clear ROI',
    'Enterprise-grade security built-in',
    '24/7 dedicated customer support'
  ],
  'Healthcare': [
    'Automated documentation and reporting',
    'Centralized, secure patient data access',
    'Simplified billing and insurance processing',
    'Efficient scheduling and resource allocation',
    'Compliance-ready solution'
  ],
  'E-commerce': [
    'Fast, reliable shipping options',
    'One-click checkout process',
    'Detailed product specifications and images',
    'Transparent pricing with no hidden fees',
    'Responsive customer service team'
  ],
  'default': [
    'Streamlined, efficient processes',
    'Transparent, value-based pricing',
    'Reliable, consistent service delivery',
    'Personalized customer experience',
    'Quality guarantee and support'
  ]
};

// Example gain creators based on industry
export const exampleGainCreators: Record<string, string[]> = {
  'Technology': [
    'AI-powered automation of routine tasks',
    'Real-time analytics and reporting dashboard',
    'Cloud-based collaboration platform',
    'Customizable features and workflows',
    'Regular updates and new features'
  ],
  'Healthcare': [
    'AI-assisted diagnosis tools',
    'Patient engagement portal',
    'Integrated telehealth capabilities',
    'Predictive analytics for patient care',
    'Mobile access to critical information'
  ],
  'E-commerce': [
    'Personalized product recommendations',
    'Loyalty rewards program',
    'Real-time order tracking',
    'Easy product comparison tools',
    'Curated collections and shopping guides'
  ],
  'default': [
    'Time-saving automation features',
    'Cost-reduction strategies',
    'Quality improvement processes',
    'Personalization options',
    'Premium support and training'
  ]
};

// Generate headline options
const generateHeadlines = (inputs: FormInputs): string[] => {
  const { businessName, uniqueFeatures, customerProfile } = inputs;
  const headlines = [
    `${businessName}: ${uniqueFeatures[0] || 'Innovative Solutions'} for ${customerProfile.jobs[0] || 'Your Business Needs'}`,
    `Transform How You ${customerProfile.jobs[0] || 'Work'} with ${businessName}`,
    `${uniqueFeatures[0] || 'Better Results'} Without ${customerProfile.pains[0] || 'The Hassle'}`,
    `The Smarter Way to ${customerProfile.jobs[0] || 'Succeed'}: ${businessName}`,
    `${businessName}: Where ${customerProfile.gains[0] || 'Success'} Meets ${uniqueFeatures[0] || 'Innovation'}`
  ];
  
  return headlines;
};

// Generate subheadline options
const generateSubheadlines = (inputs: FormInputs): string[] => {
  const { targetAudience, uniqueFeatures, customerProfile, valueMap } = inputs;
  const subheadlines = [
    `Designed for ${targetAudience || 'professionals'} who need ${customerProfile.gains[0] || 'better results'} without ${customerProfile.pains[0] || 'complications'}.`,
    `${valueMap.products[0] || 'Our solution'} that ${valueMap.painRelievers[0] || 'solves your challenges'} while ${valueMap.gainCreators[0] || 'enhancing your capabilities'}.`,
    `Say goodbye to ${customerProfile.pains[0] || 'old problems'} and hello to ${customerProfile.gains[0] || 'new opportunities'}.`,
    `The only ${valueMap.products[0] || 'solution'} that combines ${uniqueFeatures[0] || 'innovation'} with ${uniqueFeatures[1] || 'reliability'} for ${targetAudience || 'professionals like you'}.`,
    `${targetAudience || 'Professionals'} trust us to deliver ${customerProfile.gains[0] || 'results'} when it matters most.`
  ];
  
  return subheadlines;
};

// Generate key benefits
const generateKeyBenefits = (inputs: FormInputs): string[] => {
  const { uniqueFeatures, valueMap, customerProfile } = inputs;
  
  // First, try to create benefits by combining gain creators with gains
  const benefits: string[] = [];
  
  // Add benefit from pain reliever + pain combinations
  for (let i = 0; i < Math.min(valueMap.painRelievers.length, customerProfile.pains.length); i++) {
    if (valueMap.painRelievers[i] && customerProfile.pains[i]) {
      benefits.push(`${valueMap.painRelievers[i]} to eliminate ${customerProfile.pains[i].toLowerCase()}`);
    }
  }
  
  // Add benefit from gain creator + gain combinations
  for (let i = 0; i < Math.min(valueMap.gainCreators.length, customerProfile.gains.length); i++) {
    if (valueMap.gainCreators[i] && customerProfile.gains[i]) {
      benefits.push(`${valueMap.gainCreators[i]} to achieve ${customerProfile.gains[i].toLowerCase()}`);
    }
  }
  
  // Add benefits from unique features if needed to fill the array
  for (let i = 0; i < uniqueFeatures.length && benefits.length < 5; i++) {
    if (uniqueFeatures[i]) {
      benefits.push(uniqueFeatures[i]);
    }
  }
  
  // Fill remaining slots with generic benefits if needed
  const genericBenefits = [
    "Save time with our streamlined processes",
    "Reduce costs while improving outcomes",
    "Gain valuable insights through advanced analytics",
    "Improve customer satisfaction with better service delivery",
    "Scale your operations with flexibility and ease"
  ];
  
  for (let i = 0; benefits.length < 5; i++) {
    benefits.push(genericBenefits[i % genericBenefits.length]);
  }
  
  return benefits.slice(0, 5); // Return up to 5 benefits
};

// Generate strong value statements
const generateValueStatements = (inputs: FormInputs): string[] => {
  const { businessName, uniqueFeatures, customerProfile, valueMap } = inputs;
  
  const valueStatements = [
    `${businessName} helps you ${customerProfile.jobs[0] || 'succeed'} by ${valueMap.painRelievers[0] || 'eliminating challenges'} and ${valueMap.gainCreators[0] || 'creating opportunities'}.`,
    `We deliver ${uniqueFeatures[0] || 'innovative solutions'} that transform how ${customerProfile.jobs[0] || 'you work'}, without the ${customerProfile.pains[0] || 'complications'}.`,
    `Only ${businessName} combines ${uniqueFeatures[0] || 'quality'} with ${uniqueFeatures[1] || 'innovation'} to deliver ${customerProfile.gains[0] || 'results'} that matter.`,
    `Our unique approach to ${customerProfile.jobs[0] || 'your needs'} ensures you get ${customerProfile.gains[0] || 'better results'} without ${customerProfile.pains[0] || 'the typical problems'}.`,
    `We've reimagined how to ${customerProfile.jobs[0] || 'serve your needs'} so you can focus on what matters: ${customerProfile.gains[0] || 'growth and success'}.`
  ];
  
  return valueStatements;
};

// Generate target audience statements
const generateTargetAudienceStatements = (inputs: FormInputs): string[] => {
  const { targetAudience, customerProfile } = inputs;
  
  const targetAudienceStatements = [
    `Designed specifically for ${targetAudience || 'professionals'} who need to ${customerProfile.jobs[0] || 'succeed'} despite ${customerProfile.pains[0] || 'challenges'}.`,
    `Perfect for ${targetAudience || 'businesses'} tired of ${customerProfile.pains[0] || 'common problems'} and ready for ${customerProfile.gains[0] || 'better results'}.`,
    `If you're a ${targetAudience || 'professional'} struggling with ${customerProfile.pains[0] || 'typical challenges'}, our solution was built for you.`,
    `Created by ${targetAudience || 'industry experts'} for ${targetAudience || 'industry experts'} who understand the value of ${customerProfile.gains[0] || 'excellence'}.`,
    `The go-to solution for ${targetAudience || 'professionals'} who refuse to compromise on ${customerProfile.gains[0] || 'quality and results'}.`
  ];
  
  return targetAudienceStatements;
};

// Generate problem statements
const generateProblemStatements = (inputs: FormInputs): string[] => {
  const { targetAudience, customerProfile } = inputs;
  
  const problemStatements = [
    `${targetAudience || 'Professionals'} like you struggle with ${customerProfile.pains[0] || 'challenges'} that prevent ${customerProfile.gains[0] || 'optimal results'}.`,
    `Traditional approaches to ${customerProfile.jobs[0] || 'your needs'} lead to ${customerProfile.pains[0] || 'problems'} and missed ${customerProfile.gains[0] || 'opportunities'}.`,
    `When ${customerProfile.pains[0] || 'issues arise'}, they can derail your ability to ${customerProfile.jobs[0] || 'perform effectively'}.`,
    `${customerProfile.pains[0] || 'Common challenges'} cost you time, money, and the ${customerProfile.gains[0] || 'results'} you deserve.`,
    `In today's competitive environment, ${customerProfile.pains[0] || 'inefficiencies'} can be the difference between success and failure.`
  ];
  
  return problemStatements;
};

// Generate solution statements
const generateSolutionStatements = (inputs: FormInputs): string[] => {
  const { businessName, valueMap, customerProfile } = inputs;
  
  const solutionStatements = [
    `${businessName} provides ${valueMap.products[0] || 'solutions'} that ${valueMap.painRelievers[0] || 'address your challenges'} while ${valueMap.gainCreators[0] || 'enhancing your capabilities'}.`,
    `Our innovative approach ${valueMap.painRelievers[0] || 'eliminates problems'} and ${valueMap.gainCreators[0] || 'creates new opportunities'} for ${customerProfile.gains[0] || 'success'}.`,
    `We've developed a unique system that transforms how you ${customerProfile.jobs[0] || 'work'}, making it easier to achieve ${customerProfile.gains[0] || 'your goals'}.`,
    `${businessName} delivers a comprehensive solution that addresses ${customerProfile.pains[0] || 'your challenges'} from every angle.`,
    `Our platform was built from the ground up to solve the exact problems that keep ${customerProfile.jobs[0] || 'professionals'} from achieving ${customerProfile.gains[0] || 'optimal results'}.`
  ];
  
  return solutionStatements;
};

// Generate differentiator statements
const generateDifferentiatorStatements = (inputs: FormInputs): string[] => {
  const { businessName, uniqueFeatures, competitorWeaknesses } = inputs;
  
  const differentiatorStatements = [
    `Unlike others who ${competitorWeaknesses[0] || 'fall short'}, ${businessName} ${uniqueFeatures[0] || 'excels'} at delivering what matters.`,
    `What sets us apart is our commitment to ${uniqueFeatures[0] || 'excellence'} while others struggle with ${competitorWeaknesses[0] || 'basic requirements'}.`,
    `${businessName} is the only provider that combines ${uniqueFeatures[0] || 'quality'} with ${uniqueFeatures[1] || 'innovation'} without ${competitorWeaknesses[0] || 'the typical drawbacks'}.`,
    `We don't just promise results—we deliver them through our unique approach to ${uniqueFeatures[0] || 'solving your problems'}.`,
    `When you compare ${businessName} to alternatives, you'll see why our ${uniqueFeatures[0] || 'approach'} makes all the difference.`
  ];
  
  return differentiatorStatements;
};

// Generate call to action statements
const generateCallToActionStatements = (inputs: FormInputs): string[] => {
  const { businessName } = inputs;
  
  const callToActionStatements = [
    `Ready to transform your results? Contact ${businessName} today for a free consultation.`,
    `Don't settle for less. Schedule a demo and see the ${businessName} difference for yourself.`,
    `Take the first step toward better outcomes. Request your personalized assessment now.`,
    `Join the growing community of satisfied clients. Get started with ${businessName} today.`,
    `Your success is just a click away. Learn how ${businessName} can help you achieve your goals.`
  ];
  
  return callToActionStatements;
};

// Generate a complete value proposition
export const generateValueProposition = (inputs: FormInputs): ValueProposition => {
  const headlines = generateHeadlines(inputs);
  const subheadlines = generateSubheadlines(inputs);
  const keyBenefits = generateKeyBenefits(inputs);
  const valueStatements = generateValueStatements(inputs);
  const targetAudienceStatements = generateTargetAudienceStatements(inputs);
  const problemStatements = generateProblemStatements(inputs);
  const solutionStatements = generateSolutionStatements(inputs);
  const differentiatorStatements = generateDifferentiatorStatements(inputs);
  const callToActionStatements = generateCallToActionStatements(inputs);
  
  // Choose one option from each category
  const randomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length);
  
  return {
    headline: headlines[randomIndex(headlines)],
    subheadline: subheadlines[randomIndex(subheadlines)],
    keyBenefits: keyBenefits,
    valueStatement: valueStatements[randomIndex(valueStatements)],
    targetAudienceStatement: targetAudienceStatements[randomIndex(targetAudienceStatements)],
    problemStatement: problemStatements[randomIndex(problemStatements)],
    solutionStatement: solutionStatements[randomIndex(solutionStatements)],
    differentiatorStatement: differentiatorStatements[randomIndex(differentiatorStatements)],
    callToAction: callToActionStatements[randomIndex(callToActionStatements)]
  };
};

// Get example data based on industry
export const getExampleData = (industry: string) => {
  const getIndustrySpecificData = (dataObj: Record<string, string[]>, fallback: string[]) => {
    return dataObj[industry] || dataObj['default'] || fallback;
  };
  
  return {
    jobs: getIndustrySpecificData(exampleJobs, exampleJobs.default),
    pains: getIndustrySpecificData(examplePains, examplePains.default),
    gains: getIndustrySpecificData(exampleGains, exampleGains.default),
    painRelievers: getIndustrySpecificData(examplePainRelievers, examplePainRelievers.default),
    gainCreators: getIndustrySpecificData(exampleGainCreators, exampleGainCreators.default)
  };
}; 