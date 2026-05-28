export interface DimensionScore {
  name: string;
  score: number;
  feedback: string;
}

export interface OptimizationResponse {
  evaluation: {
    roleSummary: string;
    cvMatch: string;
    levelStrategy: string;
    compResearch: string;
    personalizationBlueprint: string;
    interviewSTAR: string;
  };
  scorecard: {
    overallGrade: string;
    overallScore: number;
    dimensions: DimensionScore[];
  };
  optimizedTex: string;
}

export interface OptimizationRecord {
  id: string;
  timestamp: number;
  jobTitle: string;
  companyName: string;
  jobUrl?: string;
  originalTex: string;
  optimizedTex: string;
  evaluation: {
    roleSummary: string;
    cvMatch: string;
    levelStrategy: string;
    compResearch: string;
    personalizationBlueprint: string;
    interviewSTAR: string;
  };
  scorecard: {
    overallGrade: string;
    overallScore: number;
    dimensions: DimensionScore[];
  };
}
