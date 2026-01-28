import { UserInputs, Exclusions, ReturnRates, AllocationResult } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumberIndian = (val: string | number): string => {
  if (val === '') return '';
  const num = typeof val === 'string' ? parseInt(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const parseNumberIndian = (val: string): string => {
  return val.replace(/,/g, '').replace(/[^\d]/g, '');
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
    invested: Math.round(totalInvested),
    value: Math.round(balance),
  };
};

export const calculateAllocation = (
  inputs: UserInputs,
  rates: ReturnRates,
  exclusions: Exclusions
): AllocationResult => {
  const age = parseInt(inputs.age) || 0;
  const monthlyInvestment = parseInt(inputs.amount) || 0;
  const horizon = parseInt(inputs.horizon) || 0;
  const stepUp = parseFloat(inputs.stepUp) || 0;
  const riskProfile = inputs.risk;

  let equity = 0;
  let debt = 0;
  let gold = 0;
  let silver = 0;

  if (horizon < 3) {
    equity = 0; debt = 100; gold = 0; silver = 0;
  } else if (horizon >= 3 && horizon < 5) {
    equity = 20; debt = 75; gold = 5; silver = 0;
  } else if (horizon >= 5 && horizon < 8) {
    equity = riskProfile === 'High' ? 60 : (riskProfile === 'Medium' ? 50 : 40);
    gold = 7; silver = 3; debt = 100 - equity - (gold + silver);
  } else {
    let baseEquity = Math.max(0, 110 - age);
    if (riskProfile === 'Low') baseEquity -= 20;
    if (riskProfile === 'Medium') baseEquity -= 10;
    const equityCap = riskProfile === 'High' ? 85 : (riskProfile === 'Medium' ? 70 : 50);

    equity = Math.min(baseEquity, equityCap);
    gold = 7; silver = 3; debt = 100 - equity - (gold + silver);
  }

  if (exclusions.debt) {
    equity += debt;
    debt = 0;
  }
  if (exclusions.commodities) {
    equity += (gold + silver);
    gold = 0;
    silver = 0;
  }

  // Ensure sum is 100
  const total = equity + debt + gold + silver;
  if (total !== 100 && total > 0) {
    const factor = 100 / total;
    equity = Math.round(equity * factor);
    debt = Math.round(debt * factor);
    gold = Math.round(gold * factor);
    silver = 100 - equity - debt - gold;
  }

  let equitySplit: Record<string, number> = {};
  if (equity > 0) {
    const showUS = !exclusions.usEquity && horizon >= 5 && (riskProfile === 'Medium' || riskProfile === 'High');
    const usAllocation = showUS ? 15 : 0;
    let remainingEquity = 100 - usAllocation;

    if (riskProfile === 'Low' || horizon < 5) {
      equitySplit = {
        'Large Cap / Nifty 50': 100,
        'Mid Cap': 0,
        'Small Cap': 0,
        'US / International': 0,
      };
    } else if (riskProfile === 'Medium') {
      equitySplit = {
        'Large Cap / Nifty 50': Math.round(remainingEquity * 0.6),
        'Mid Cap': Math.round(remainingEquity * 0.4),
        'Small Cap': 0,
        'US / International': usAllocation,
      };
    } else {
      equitySplit = {
        'Large Cap / Nifty 50': Math.round(remainingEquity * 0.5),
        'Mid Cap': Math.round(remainingEquity * 0.3),
        'Small Cap': Math.round(remainingEquity * 0.2),
        'US / International': usAllocation,
      };
    }
    const currentSum = Object.values(equitySplit).reduce((a, b) => a + b, 0);
    if (currentSum !== 100) {
      equitySplit['Large Cap / Nifty 50'] += (100 - currentSum);
    }
  }

  const amounts = {
    equity: Math.round((monthlyInvestment * equity) / 100),
    debt: Math.round((monthlyInvestment * debt) / 100),
    gold: Math.round((monthlyInvestment * gold) / 100),
    silver: Math.round((monthlyInvestment * silver) / 100),
  };

  const equityProj = calculateStepUpProjection(amounts.equity, rates.equity, horizon, stepUp);
  const debtProj = calculateStepUpProjection(amounts.debt, rates.debt, horizon, stepUp);
  const goldProj = calculateStepUpProjection(amounts.gold, rates.gold, horizon, stepUp);
  const silverProj = calculateStepUpProjection(amounts.silver, rates.silver, horizon, stepUp);

  const totalInvested = equityProj.invested + debtProj.invested + goldProj.invested + silverProj.invested;
  const totalValue = equityProj.value + debtProj.value + goldProj.value + silverProj.value;

  const weightedReturn = ((equity * rates.equity) + (debt * rates.debt) + (gold * rates.gold) + (silver * rates.silver)) / 100;

  const rationaleNotes = [];
  if (horizon < 3) rationaleNotes.push("Safety is the priority for short durations.");
  else if (equity > 80) rationaleNotes.push("Aggressive growth strategy focused on wealth creation.");
  else rationaleNotes.push("Balanced approach for steady growth and stability.");

  if (exclusions.debt && horizon < 5) rationaleNotes.push("WARNING: Excluding Debt for a short-term goal is extremely risky.");
  if (exclusions.commodities) rationaleNotes.push("Excluding Gold/Silver removes the inflation hedge.");

  return {
    percentages: { equity, debt, gold, silver },
    equitySplit,
    amounts,
    rationale: rationaleNotes.join(" "),
    projection: {
      invested: totalInvested,
      value: totalValue,
      weightedRate: weightedReturn.toFixed(1),
      breakdown: {
        equity: { invested: equityProj.invested, returns: equityProj.value - equityProj.invested },
        debt: { invested: debtProj.invested, returns: debtProj.value - debtProj.invested },
        gold: { invested: goldProj.invested, returns: goldProj.value - goldProj.invested },
        silver: { invested: silverProj.invested, returns: silverProj.value - silverProj.invested },
      },
    },
  };
};