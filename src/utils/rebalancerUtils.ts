import { PortfolioProfile, PortfolioHoldings, AssetAllocation, RebalanceResult } from '../types/rebalancer';

export const calculateTargets = (profile: PortfolioProfile): AssetAllocation => {
  const age = typeof profile.age === 'number' ? profile.age : 0;
  const horizon = typeof profile.horizon === 'number' ? profile.horizon : 0;
  const riskTolerance = profile.riskTolerance;
  
  const goldPercent = Math.round((5 + (age / 10) + (4 - riskTolerance) * 3) * 100) / 100;
  const usPercent = Math.round((10 + (horizon / 2)) * 100) / 100;
  const equityBalance = 100 - (goldPercent + usPercent);
  
  const largeCapPercent = Math.round(equityBalance * (0.50 - 0.10 * riskTolerance) * 100) / 100;
  const midCapPercent = Math.round(equityBalance * (0.30 + 0.05 * riskTolerance) * 100) / 100;
  const smallCapPercent = Math.round((equityBalance - largeCapPercent - midCapPercent) * 100) / 100;

  return {
    largeCap: largeCapPercent,
    midCap: midCapPercent,
    smallCap: smallCapPercent,
    usEquities: usPercent,
    commodities: goldPercent,
  };
};

export const calculateRebalance = (
  profile: PortfolioProfile,
  holdings: PortfolioHoldings,
  targets: AssetAllocation
): RebalanceResult[] => {
  const monthlySIP = typeof profile.monthlySIP === 'number' ? profile.monthlySIP : 0;
  const totalAnnualInflow = monthlySIP * 12;
  
  const getNum = (v: number | '') => (typeof v === 'number' ? v : 0);
  const holdingsNum = {
    largeCap: getNum(holdings.largeCap),
    midCap: getNum(holdings.midCap),
    smallCap: getNum(holdings.smallCap),
    usEquities: getNum(holdings.usEquities),
    commodities: getNum(holdings.commodities),
  };

  const totalCurrent = Object.values(holdingsNum).reduce((a, b) => a + b, 0);
  const totalProjected = totalCurrent + totalAnnualInflow;

  const assets = [
    { name: 'Large Cap', key: 'largeCap', target: targets.largeCap, current: holdingsNum.largeCap },
    { name: 'Mid Cap', key: 'midCap', target: targets.midCap, current: holdingsNum.midCap },
    { name: 'Small Cap', key: 'smallCap', target: targets.smallCap, current: holdingsNum.smallCap },
    { name: 'US Equities', key: 'usEquities', target: targets.usEquities, current: holdingsNum.usEquities },
    { name: 'Commodities', key: 'commodities', target: targets.commodities, current: holdingsNum.commodities },
  ];

  const deficits = assets.map(a => {
    const projectedTarget = totalProjected * (a.target / 100);
    const deficit = Math.max(0, projectedTarget - a.current);
    return { ...a, projectedTarget, deficit };
  });

  const totalDeficitSum = deficits.reduce((sum, a) => sum + a.deficit, 0);

  const results: RebalanceResult[] = deficits.map(a => {
    let sip = 0;
    if (totalDeficitSum === 0) {
      sip = (a.target / 100) * profile.monthlySIP;
    } else {
      sip = (a.deficit / totalDeficitSum) * profile.monthlySIP;
    }
    
    // MROUND to 100
    sip = Math.round(sip / 100) * 100;
    
    return {
      assetClass: a.name,
      targetPercent: a.target,
      currentValue: a.current,
      projectedTargetValue: a.projectedTarget,
      deficit: a.deficit,
      recommendedSIP: sip
    };
  });

  // Handle rounding discrepancy
  const totalRecommended = results.reduce((sum, r) => sum + r.recommendedSIP, 0);
  const diff = profile.monthlySIP - totalRecommended;
  
  if (diff !== 0) {
    // Add/subtract diff to largest deficit asset
    const largestDeficitIndex = results.reduce((maxIdx, r, i, arr) => 
      r.deficit > arr[maxIdx].deficit ? i : maxIdx, 0);
    results[largestDeficitIndex].recommendedSIP += diff;
  }

  return results;
};
