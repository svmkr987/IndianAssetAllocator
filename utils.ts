import { UserInputs, Exclusions, ReturnRates, AllocationResult } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumberIndian = (val: string | number): string => {
  if (val === '') return '';
  const strVal = val.toString().replace(/,/g, '');
  const num = parseFloat(strVal);
  if (isNaN(num)) return '';
  
  const parts = strVal.split('.');
  const formattedInt = new Intl.NumberFormat('en-IN').format(parseInt(parts[0] || '0', 10));
  
  if (parts.length > 1) {
    return `${formattedInt}.${parts[1]}`;
  }
  
  return formattedInt;
};

export const parseNumberIndian = (val: string): string => {
  let clean = val.replace(/,/g, '').replace(/[^\d.]/g, '');
  const parts = clean.split('.');
  if (parts.length > 2) {
    clean = parts[0] + '.' + parts.slice(1).join('');
  }
  return clean;
};

export const formatDate = (): string => {
  return new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const calculateStepUpProjection = (
  initialMonthly: number,
  annualRate: number,
  years: number,
  stepUpPercent: number
) => {
  let balance = 0;
  let totalInvested = 0;
  let currentMonthly = initialMonthly;
  const monthlyRate = annualRate / 100 / 12;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      balance += currentMonthly;
      totalInvested += currentMonthly;
      balance *= (1 + monthlyRate);
    }
    currentMonthly = currentMonthly * (1 + stepUpPercent / 100);
  }

  return {
    invested: Math.round(totalInvested * 100) / 100,
    value: Math.round(balance * 100) / 100,
  };
};

export const calculateAllocation = (
  inputs: UserInputs,
  rates: ReturnRates,
  exclusions: Exclusions
): AllocationResult => {
  const age = parseInt(inputs.age) || 0;
  const monthlyInvestment = parseFloat(inputs.amount) || 0;
  const horizon = parseInt(inputs.horizon) || 0;
  const stepUp = parseFloat(inputs.stepUp) || 0;
  
  // Map risk to 1, 2, 3
  const R = inputs.risk === 'Low' ? 1 : inputs.risk === 'Medium' ? 2 : 3;
  const A = age;
  const T = horizon;
  const C = monthlyInvestment;

  const notes: string[] = [];

  // --- STEP 1: INITIAL ALLOCATION ---
  let goldPercent = 5 + (A / 10) + (4 - R) * 3;
  goldPercent = Math.min(Math.max(goldPercent, 5), 20);
  
  let totalEquity = 100 - goldPercent;

  // --- STEP 2: APPLY ADVISOR OVERRIDES ---
  // Rule 1: Age Guardrail
  if (A >= 50 && totalEquity > 60) {
    totalEquity = 60;
    goldPercent = 40;
    notes.push("Capital Protection: Equity capped at 60% due to age (50+).");
  }

  // Step 5: US Allocation
  let usPercent = 10 + (T / 2);
  usPercent = Math.min(Math.max(usPercent, 10), 25);
  
  // Step 6: India Equity
  let indiaEquity = totalEquity - usPercent;

  // Step 7: Split India Equity
  let largeCap = indiaEquity * (0.5 - (0.1 * R));
  let midCap = indiaEquity * (0.3 + (0.05 * R));
  let smallCap = indiaEquity - largeCap - midCap;

  // Rule 2: Short-term Horizon Shield
  if (T < 3) {
    largeCap += smallCap;
    smallCap = 0;
    notes.push("Volatility Shield: Small-caps removed for short horizon (< 3 yrs).");
  }

  // --- EXCLUSIONS HANDLING ---
  if (exclusions.usEquity) {
    const usAmount = usPercent;
    usPercent = 0;
    const totalIndia = largeCap + midCap + smallCap;
    if (totalIndia > 0) {
      largeCap += usAmount * (largeCap / totalIndia);
      midCap += usAmount * (midCap / totalIndia);
      smallCap += usAmount * (smallCap / totalIndia);
    } else {
      largeCap += usAmount;
    }
    notes.push("International Equity excluded: Reallocated to domestic equity.");
  }

  if (exclusions.commodities) {
    largeCap += goldPercent;
    goldPercent = 0;
    notes.push("Commodities excluded: Gold allocation moved to Large Cap Equity for stability.");
  }

  // --- STEP 3: FINAL ROUNDING & RESIDUAL ---
  const roundTo2 = (num: number) => Math.round(num * 100) / 100;
  
  goldPercent = roundTo2(goldPercent);
  usPercent = roundTo2(usPercent);
  largeCap = roundTo2(largeCap);
  midCap = roundTo2(midCap);
  smallCap = roundTo2(smallCap);

  // Fix rounding errors to ensure exactly 100%
  const total = roundTo2(goldPercent + usPercent + largeCap + midCap + smallCap);
  if (total !== 100) {
    largeCap = roundTo2(largeCap + (100 - total));
  }

  const equityPercent = roundTo2(largeCap + midCap + smallCap + usPercent);

  const equitySplit = {
    'Large Cap / Nifty 50': largeCap,
    'Mid Cap': midCap,
    'Small Cap': smallCap,
    'US / International': usPercent,
  };

  const amounts = {
    equity: roundTo2((C * equityPercent) / 100),
    gold: roundTo2((C * goldPercent) / 100),
  };

  // Fix total amount rounding
  const totalAmount = roundTo2(amounts.equity + amounts.gold);
  if (totalAmount !== C && C > 0) {
    amounts.equity = roundTo2(amounts.equity + (C - totalAmount));
  }

  const equityProj = calculateStepUpProjection(amounts.equity, rates.equity, horizon, stepUp);
  const goldProj = calculateStepUpProjection(amounts.gold, rates.gold, horizon, stepUp);

  const totalInvested = equityProj.invested + goldProj.invested;
  const totalValue = equityProj.value + goldProj.value;

  const weightedReturn = ((equityPercent * rates.equity) + (goldPercent * rates.gold)) / 100;

  if (notes.length === 0) {
    notes.push("Standard strategic allocation applied based on your profile.");
  }

  return {
    percentages: { equity: equityPercent, gold: goldPercent },
    equitySplit,
    amounts,
    rationale: notes.join(" "),
    projection: {
      invested: totalInvested,
      value: totalValue,
      weightedRate: weightedReturn.toFixed(1),
      breakdown: {
        equity: { invested: equityProj.invested, returns: equityProj.value - equityProj.invested },
        gold: { invested: goldProj.invested, returns: goldProj.value - goldProj.invested },
      },
    },
  };
};