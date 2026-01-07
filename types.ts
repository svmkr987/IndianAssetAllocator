
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface UserInputs {
  age: string;
  amount: string;
  stepUp: string;
  horizon: string;
  risk: RiskLevel;
}

export interface Exclusions {
  debt: boolean;
  commodities: boolean;
  usEquity: boolean;
}

export interface ReturnRates {
  equity: number;
  debt: number;
  gold: number;
  silver: number;
}

export interface ProjectionBreakdown {
  invested: number;
  returns: number;
}

export interface AllocationResult {
  percentages: {
    equity: number;
    debt: number;
    gold: number;
    silver: number;
  };
  equitySplit: Record<string, number>;
  amounts: {
    equity: number;
    debt: number;
    gold: number;
    silver: number;
  };
  rationale: string;
  projection: {
    invested: number;
    value: number;
    weightedRate: string;
    breakdown: {
      equity: ProjectionBreakdown;
      debt: ProjectionBreakdown;
      gold: ProjectionBreakdown;
      silver: ProjectionBreakdown;
    };
  };
}
