import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import yfAny from 'yahoo-finance2';

// Handle transpilation differences between ts-node, esbuild, and native ESM
const YFClass = (yfAny as any).default?.default || (yfAny as any).default || yfAny;
const yahooFinance = new YFClass({ suppressNotices: ['yahooSurvey'] });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // suppressNotices removed because it's not a function in this version

  // API Route
  app.get("/api/analyze", async (req, res) => {
    try {
      const symbolsStr = req.query.symbols as string;
      if (!symbolsStr) {
        return res.status(400).json({ error: "Missing 'symbols' query parameter" });
      }

      const rawSymbols = symbolsStr.split(',').map(s => s.trim()).filter(Boolean);
      
      const results = [];

      for (let sym of rawSymbols) {
        // Automatically append .NS for Indian stocks if no suffix and no special char (basic check)
        let ticker = sym;
        if (!ticker.includes('.') && /^[A-Za-z0-9]+$/.test(ticker)) {
          ticker = `${ticker}.NS`;
        }

        try {
          const [quote, quoteSummary, chart] = await Promise.all([
            yahooFinance.quote(ticker),
            yahooFinance.quoteSummary(ticker, {
              modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics', 'summaryDetail']
            }).catch(() => null), // Catch separately so one missing module doesn't fail the rest
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

      res.json({ results });
    } catch (error) {
      console.error("/api/analyze default route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.use((req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
