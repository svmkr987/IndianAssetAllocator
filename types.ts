
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface UserInputs {
  age: string;
  amount: string;
  stepUp: string;
  horizon: string;
  risk: RiskLevel;
}

export interface Exclusions {
  commodities: boolean;
  usEquity: boolean;
}

export interface ReturnRates {
  equity: number;
  gold: number;
}

export interface ProjectionBreakdown {
  invested: number;
  returns: number;
}

export interface AllocationResult {
  percentages: {
    equity: number;
    gold: number;
  };
  equitySplit: Record<string, number>;
  amounts: {
    equity: number;
    gold: number;
  };
  rationale: string;
  projection: {
    invested: number;
    value: number;
    weightedRate: string;
    breakdown: {
      equity: ProjectionBreakdown;
      gold: ProjectionBreakdown;
    };
  };
}
