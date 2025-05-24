export interface PitchInput {
  businessName: string;
  industryType: string;
  targetAudience: string;
  mainProblem: string;
  solution: string;
  keyBenefits: string[];
  uniqueSellingPoints: string[];
  callToAction: string;
}

export interface PitchTemplate {
  id: string;
  name: string;
  structure: string;
  example: string;
}

export interface GeneratedPitch {
  content: string;
  type: string;
  durationSeconds: number;
} 