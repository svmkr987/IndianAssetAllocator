export interface PortfolioProfile {
  age: number | '';
  horizon: number | '';
  riskTolerance: 1 | 2 | 3;
  monthlySIP: number | '';
}

export interface PortfolioHoldings {
  largeCap: number | '';
  midCap: number | '';
  smallCap: number | '';
  usEquities: number | '';
  commodities: number | '';
}

export interface AssetAllocation {
  largeCap: number;
  midCap: number;
  smallCap: number;
  usEquities: number;
  commodities: number;
}

export interface RebalanceResult {
  assetClass: string;
  targetPercent: number;
  currentValue: number;
  projectedTargetValue: number;
  deficit: number;
  recommendedSIP: number;
}
