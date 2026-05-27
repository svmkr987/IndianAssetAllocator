import yfAny from 'yahoo-finance2';

// Handle transpilation differences between ts-node, esbuild, and native ESM
const YFClass = (yfAny as any).default?.default || (yfAny as any).default || yfAny;
const yahooFinance = new YFClass({ suppressNotices: ['yahooSurvey'] });

export default async function handler(req: any, res: any) {
  try {
    const symbolsStr = req.query.symbols as string;
    if (!symbolsStr) {
      return res.status(400).json({ error: "Missing 'symbols' query parameter" });
    }

    const rawSymbols = symbolsStr.split(',').map((s: string) => s.trim()).filter(Boolean);
    const results = [];

    for (let sym of rawSymbols) {
      let ticker = sym;
      if (!ticker.includes('.') && /^[A-Za-z0-9]+$/.test(ticker)) {
        ticker = `${ticker}.NS`;
      }

      try {
        const [quote, quoteSummary, chart] = await Promise.all([
          yahooFinance.quote(ticker),
          yahooFinance.quoteSummary(ticker, {
            modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics', 'summaryDetail']
          }).catch(() => null),
          yahooFinance.chart(ticker, { period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), interval: '1d' }).catch(() => null)
        ]);

        results.push({
          symbol: sym,
          ticker,
          quote,
          quoteSummary,
          chart
        });
      } catch (tickerErr: any) {
        console.error(`Error fetching data for ${ticker}:`, tickerErr);
        results.push({
          symbol: sym,
          ticker,
          error: "Failed to fetch data or symbol not found: " + (tickerErr?.stack || String(tickerErr))
        });
      }
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error("/api/analyze serverless route error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
