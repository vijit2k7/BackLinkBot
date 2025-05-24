import { PitchInput, PitchTemplate, GeneratedPitch } from './types';

// Common industry types
export const industryTypes = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Retail',
  'Manufacturing',
  'Marketing',
  'Food & Beverage',
  'Real Estate',
  'Professional Services',
  'Media & Entertainment',
  'Transportation',
  'Travel & Hospitality',
  'Construction',
  'Nonprofit',
  'Energy',
  'Agriculture',
  'Other'
];

// Available pitch templates
export const pitchTemplates: PitchTemplate[] = [
  {
    id: 'problem-solution',
    name: 'Problem-Solution',
    structure: "1. Identify the problem\n2. Present your solution\n3. Explain key benefits\n4. Add call to action",
    example: "Did you know [problem stats]? At [Company], we've developed [solution] that [key benefit]. Would you be interested in learning how we've helped similar businesses increase their [metric]?"
  },
  {
    id: 'value-proposition',
    name: 'Value Proposition',
    structure: "1. Your company/personal intro\n2. What you offer\n3. Unique value\n4. Why it matters to them",
    example: "I'm [name] from [Company]. We help [target audience] to [benefit] through our [product/service]. Unlike our competitors, we [unique differentiator], which means [value to customer]."
  },
  {
    id: 'story-based',
    name: 'Story-Based',
    structure: "1. Brief compelling story\n2. Link to your solution\n3. Share results\n4. Make an offer",
    example: "One of our clients was struggling with [problem] until they found our [solution]. Within [timeframe], they experienced [specific result]. I'd love to show you how we could do the same for your business."
  },
  {
    id: 'question-hook',
    name: 'Question Hook',
    structure: "1. Ask thought-provoking question\n2. Present current challenge\n3. Share your solution\n4. Invite further engagement",
    example: "Have you ever wished you could [desired outcome]? Many [target audience] struggle with [problem]. Our [product/service] makes it easy to [benefit]. I'd be happy to explain how it works if you're interested."
  },
  {
    id: 'short-impactful',
    name: 'Short & Impactful',
    structure: "1. Clear statement of what you do\n2. For whom\n3. With what benefit\n4. Backed by proof",
    example: "We help [target audience] [achieve result] through our [solution], proven by [social proof/statistic]."
  }
];

// Calculate approximate pitch duration in seconds (based on average reading speed)
export const calculatePitchDuration = (text: string): number => {
  // Average reading speed is about 150 words per minute or 2.5 words per second when speaking
  const wordCount = text.split(/\s+/).length;
  return Math.round(wordCount / 2.5);
};

// Generate elevator pitch based on input and template
export const generateElevatorPitch = (
  input: PitchInput,
  templateId: string
): GeneratedPitch => {
  const template = pitchTemplates.find(t => t.id === templateId) || pitchTemplates[0];
  let content = '';
  
  // Extract key points
  const { 
    businessName, 
    industryType, 
    targetAudience, 
    mainProblem,
    solution, 
    keyBenefits,
    uniqueSellingPoints,
    callToAction
  } = input;
  
  // Get one key benefit and USP to use in the pitch
  const keyBenefit = keyBenefits.length > 0 ? keyBenefits[0] : "improving your results";
  const usp = uniqueSellingPoints.length > 0 ? uniqueSellingPoints[0] : "our unique approach";
  
  // Generate pitch based on template type
  switch(template.id) {
    case 'problem-solution':
      content = `Did you know that ${mainProblem}? At ${businessName}, we've developed ${solution} specifically for ${targetAudience} in the ${industryType} industry. Our approach helps you ${keyBenefit} through ${usp}. ${callToAction}`;
      break;
      
    case 'value-proposition':
      content = `${businessName} helps ${targetAudience} in the ${industryType} industry to overcome ${mainProblem} through our ${solution}. Unlike alternatives, we offer ${usp}, which means you'll ${keyBenefit}. ${callToAction}`;
      break;
      
    case 'story-based':
      content = `One of our clients in the ${industryType} industry was struggling with ${mainProblem} until they found our ${solution}. Within months, they experienced ${keyBenefit}. I believe we could achieve similar results for you as ${targetAudience}. ${callToAction}`;
      break;
      
    case 'question-hook':
      content = `As ${targetAudience}, have you ever wished you could solve ${mainProblem} more effectively? At ${businessName}, we've created ${solution} that makes it easy to ${keyBenefit}. Our clients particularly value ${usp}. ${callToAction}`;
      break;
      
    case 'short-impactful':
      content = `${businessName} helps ${targetAudience} in ${industryType} overcome ${mainProblem} through ${solution}. Our clients typically ${keyBenefit}, thanks to ${usp}. ${callToAction}`;
      break;
      
    default:
      content = `${businessName} provides ${solution} for ${targetAudience} facing ${mainProblem}. We help you ${keyBenefit} through ${usp}. ${callToAction}`;
  }
  
  return {
    content,
    type: template.name,
    durationSeconds: calculatePitchDuration(content)
  };
};

// Generate variations of the pitch
export const generatePitchVariations = (
  input: PitchInput
): GeneratedPitch[] => {
  return pitchTemplates.map(template => 
    generateElevatorPitch(input, template.id)
  );
}; 