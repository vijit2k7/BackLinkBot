export interface CustomerProfile {
  pains: string[];
  gains: string[];
  jobs: string[];
}

export interface ValueMap {
  painRelievers: string[];
  gainCreators: string[];
  products: string[];
}

export interface FormInputs {
  businessName: string;
  industry: string;
  targetAudience: string;
  uniqueFeatures: string[];
  competitorWeaknesses: string[];
  customerProfile: CustomerProfile;
  valueMap: ValueMap;
}

export interface ValueProposition {
  headline: string;
  subheadline: string;
  keyBenefits: string[];
  valueStatement: string;
  targetAudienceStatement: string;
  problemStatement: string;
  solutionStatement: string;
  differentiatorStatement: string;
  callToAction: string;
} 