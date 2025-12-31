export enum EvaluationGrade {
  EXCELLENT = 'EXCELLENT', // >= 80
  POTENTIAL = 'POTENTIAL', // 40 - 79
  TRASH = 'TRASH'          // < 40
}

export interface DimensionScore {
  name: string;
  score: number; // 0-100
  reason: string;
}

export interface StructuredIdea {
  targetUser: string;
  painPoints: string;
  solution: string;
  businessModel: string;
}

export interface ResearchData {
  marketSize: string;
  competitors: string[];
  trends: string;
  risks: string;
}

export interface EvaluationResult {
  structuredIdea: StructuredIdea;
  research: ResearchData;
  dimensions: DimensionScore[];
  totalScore: number;
  grade: EvaluationGrade;
  summary: string;
  optimizationAdvice: string[];
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'researching' | 'scoring' | 'complete' | 'error';
