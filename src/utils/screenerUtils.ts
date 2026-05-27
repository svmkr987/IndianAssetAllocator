import { StockData, ScoreResult } from '../types/screener';

export class StockAnalyzer {
  static analyze(data: StockData): ScoreResult | null {
    if (!data || !data.quoteSummary) return null;

    let points = 0;
    const details = [];

    const fd = data.quoteSummary.financialData || {};
    const dks = data.quoteSummary.defaultKeyStatistics || {};
    const sd = data.quoteSummary.summaryDetail || {};
    const price = data.quote?.regularMarketPrice || fd.currentPrice || 0;

    // Helper functions for safe extraction
    const getVal = (obj: any, key: string) => obj && obj[key] !== undefined ? obj[key] : null;

    // 1. Profitability (Max 3 pts)
    const profitabilityMetrics = [];
    const roe = getVal(fd, 'returnOnEquity');
    if (roe !== null) {
      const roePct = roe * 100;
      const passed = roePct > 15;
      if (passed) points++;
      profitabilityMetrics.push({
        name: 'Return on Equity (ROE)',
        value: `${roePct.toFixed(2)}%`,
        passed,
        description: 'ROE > 15% indicates efficient use of equity.'
      });
    }

    const roa = getVal(fd, 'returnOnAssets');
    if (roa !== null) {
      const roaPct = roa * 100;
      const passed = roaPct > 5;
      if (passed) points++;
      profitabilityMetrics.push({
        name: 'Return on Assets (ROA)',
        value: `${roaPct.toFixed(2)}%`,
        passed,
        description: 'ROA > 5% shows efficient use of assets.'
      });
    }

    const profitMargin = getVal(fd, 'profitMargins');
    if (profitMargin !== null) {
      const marginPct = profitMargin * 100;
      const passed = marginPct > 10;
      if (passed) points++;
      profitabilityMetrics.push({
        name: 'Profit Margin',
        value: `${marginPct.toFixed(2)}%`,
        passed,
        description: 'Net margin > 10% indicates strong profitability.'
      });
    }
    
    if (profitabilityMetrics.length > 0) details.push({ category: 'Profitability', metrics: profitabilityMetrics });

    // 2. Valuation (Max 3 pts)
    const valuationMetrics = [];
    // using trailing PE or forward PE
    const pe = getVal(sd, 'trailingPE') || getVal(sd, 'forwardPE');
    if (pe !== null) {
      const passed = pe > 0 && pe < 25;
      if (passed) points++;
      valuationMetrics.push({
        name: 'P/E Ratio',
        value: pe.toFixed(2),
        passed,
        description: 'P/E < 25 implies acceptable valuation.'
      });
    }

    const pb = getVal(dks, 'priceToBook');
    if (pb !== null) {
      const passed = pb > 0 && pb < 5;
      if (passed) points++;
      valuationMetrics.push({
        name: 'P/B Ratio',
        value: pb.toFixed(2),
        passed,
        description: 'P/B < 5 indicates reasonable asset valuation.'
      });
    }

    const evEbitda = getVal(dks, 'enterpriseToEbitda');
    if (evEbitda !== null) {
      const passed = evEbitda > 0 && evEbitda < 15;
      if (passed) points++;
      valuationMetrics.push({
        name: 'EV/EBITDA',
        value: evEbitda.toFixed(2),
        passed,
        description: 'EV/EBITDA < 15 is generally considered a good valuation.'
      });
    }

    if (valuationMetrics.length > 0) details.push({ category: 'Valuation', metrics: valuationMetrics });

    // 3. Financial Health (Max 2 pts)
    const healthMetrics = [];
    const de = getVal(fd, 'debtToEquity');
    if (de !== null) {
      const passed = de < 50; // Often D/E is given as percentage (e.g. 150 = 1.5x)
      if (passed) points++;
      healthMetrics.push({
        name: 'Debt to Equity',
        value: de.toFixed(2),
        passed,
        description: 'D/E < 50 indicates manageable debt levels.'
      });
    }

    const currentRatio = getVal(fd, 'currentRatio');
    if (currentRatio !== null) {
      const passed = currentRatio > 1.5;
      if (passed) points++;
      healthMetrics.push({
        name: 'Current Ratio',
        value: currentRatio.toFixed(2),
        passed,
        description: 'CR > 1.5 shows strong short-term liquidity.'
      });
    }

    if (healthMetrics.length > 0) details.push({ category: 'Financial Health', metrics: healthMetrics });

    // 4. Growth (Max 2 pts)
    const growthMetrics = [];
    const revGrowth = getVal(fd, 'revenueGrowth');
    if (revGrowth !== null) {
      const rgPct = revGrowth * 100;
      const passed = rgPct > 10;
      if (passed) points++;
      growthMetrics.push({
        name: 'Revenue Growth (YoY)',
        value: `${rgPct.toFixed(2)}%`,
        passed,
        description: 'Revenue growth > 10% shows business expansion.'
      });
    }

    const earGrowth = getVal(fd, 'earningsGrowth');
    if (earGrowth !== null) {
      const egPct = earGrowth * 100;
      const passed = egPct > 10;
      if (passed) points++;
      growthMetrics.push({
        name: 'Earnings Growth (YoY)',
        value: `${egPct.toFixed(2)}%`,
        passed,
        description: 'Earnings growth > 10% indicates rising profitability.'
      });
    }

    if (growthMetrics.length > 0) details.push({ category: 'Growth', metrics: growthMetrics });

    // 5. Momentum (Max 2 pts)
    const momentumMetrics = [];
    const sma50 = getVal(sd, 'fiftyDayAverage');
    if (sma50 !== null && price > 0) {
      const passed = price > sma50;
      if (passed) points++;
      momentumMetrics.push({
        name: 'Price vs 50-Day SMA',
        value: `₹${sma50.toFixed(2)}`,
        passed,
        description: 'Price above 50-day average shows short-term momentum.'
      });
    }

    const sma200 = getVal(sd, 'twoHundredDayAverage');
    if (sma200 !== null && price > 0) {
      const passed = price > sma200;
      if (passed) points++;
      momentumMetrics.push({
        name: 'Price vs 200-Day SMA',
        value: `₹${sma200.toFixed(2)}`,
        passed,
        description: 'Price above 200-day average shows long-term momentum.'
      });
    }

    if (momentumMetrics.length > 0) details.push({ category: 'Momentum', metrics: momentumMetrics });

    // Verdict Logic
    let verdict = "";
    let verdictColor = "";
    
    if (points >= 10) {
      verdict = "✅ STRONG BUY";
      verdictColor = "text-emerald-500";
    } else if (points >= 7) {
      verdict = "👍 GOOD STOCK";
      verdictColor = "text-blue-500";
    } else if (points >= 5) {
      verdict = "⚠️ AVERAGE";
      verdictColor = "text-amber-500";
    } else if (points >= 3) {
      verdict = "⚠️ BELOW AVERAGE";
      verdictColor = "text-orange-500";
    } else {
      verdict = "❌ RISKY";
      verdictColor = "text-red-500";
    }

    // --- Investment Horizon Analysis (Pure Math Approach) ---
    const horizons = {
      shortTerm: { score: 0, maxScore: 3, verdict: "", color: "", description: "" },
      mediumTerm: { score: 0, maxScore: 3, verdict: "", color: "", description: "" },
      longTerm: { score: 0, maxScore: 3, verdict: "", color: "", description: "" }
    };

    // Short Term (0 to 3 points)
    let shortPoints = 0;
    const vol = getVal(sd, 'regularMarketVolume') || data.quote?.regularMarketVolume;
    const avgVol10 = getVal(sd, 'averageDailyVolume10Day') || data.quote?.averageDailyVolume10Day;
    if (vol && avgVol10 && vol > avgVol10) shortPoints++; // Volume increasing above 10-day avg
    if (price && sma50 && price > sma50) shortPoints++; // Momentum above 50-day SMA
    
    if (data.chart && data.chart.quotes && data.chart.quotes.length >= 10) {
      const idxLast = data.chart.quotes.length - 1;
      const currentClose = data.chart.quotes[idxLast].close;
      const price10DaysAgo = data.chart.quotes[idxLast - 9].close;
      if (currentClose && price10DaysAgo && currentClose > price10DaysAgo) {
        shortPoints++; // Price increased over last 10 days
      }
    }

    horizons.shortTerm = {
        score: shortPoints,
        maxScore: 3,
        verdict: shortPoints === 3 ? "BULLISH" : shortPoints === 2 ? "NEUTRAL-BULLISH" : shortPoints === 1 ? "NEUTRAL-BEARISH" : "BEARISH",
        color: shortPoints >= 2 ? "text-emerald-500" : (shortPoints === 0 ? "text-red-500" : "text-amber-500"),
        description: "Evaluates pure momentum using 10-day vs current volume, 50-day SMA crossover, and 10-day price trend."
    };

    // Medium Term (0 to 3 points)
    let mediumPoints = 0;
    const fpe = getVal(sd, 'forwardPE');
    const tpe = getVal(sd, 'trailingPE');
    if (fpe && tpe && fpe < tpe) mediumPoints++; // Anticipates earnings growth lowering PE
    if (earGrowth !== null && earGrowth > 0.10) mediumPoints++; // YoY Earnings Growth > 10%
    if (roe !== null && roe > 0.15) mediumPoints++; // Strong ROE > 15%

    horizons.mediumTerm = {
        score: mediumPoints,
        maxScore: 3,
        verdict: mediumPoints === 3 ? "STRONG" : mediumPoints === 2 ? "FAIR" : mediumPoints === 1 ? "WEAK" : "POOR",
        color: mediumPoints >= 2 ? "text-emerald-500" : (mediumPoints === 0 ? "text-red-500" : "text-amber-500"),
        description: "Assesses 3-12 month outlook based on forward P/E divergence, YoY earnings growth rate, and ROE baseline."
    };

    // Long Term (0 to 3 points)
    let longPoints = 0;
    if (de !== null && de < 50) longPoints++; // Low Debt-to-Equity (< 50)
    if (roa !== null && roa > 0.05) longPoints++; // Efficient Asset Usage (ROA > 5%)
    const divYield = getVal(sd, 'dividendYield');
    if ((divYield !== null && divYield > 0.01) || (pb !== null && pb < 3)) longPoints++; // Dividend support or reasonable Book Value

    horizons.longTerm = {
        score: longPoints,
        maxScore: 3,
        verdict: longPoints === 3 ? "EXCELLENT" : longPoints === 2 ? "SECURE" : longPoints === 1 ? "SPECULATIVE" : "AVOID",
        color: longPoints >= 2 ? "text-emerald-500" : (longPoints === 0 ? "text-red-500" : "text-amber-500"),
        description: "Measures 1-5 year stability using Debt-to-Equity ratio limits, ROA efficiency, and Dividend/Book Value anchors."
    };

    return {
      totalPoints: points,
      verdict,
      verdictColor,
      details,
      horizons
    };
  }

  static formatLargeNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e7) return (num / 1e7).toFixed(2) + 'Cr';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e5) return (num / 1e5).toFixed(2) + 'L';
    return num.toLocaleString();
  }
}
