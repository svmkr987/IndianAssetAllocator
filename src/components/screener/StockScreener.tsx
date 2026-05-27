import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { StockAnalyzer } from '../../utils/screenerUtils';
import { StockData, ScoreResult } from '../../types/screener';
import MetricsGrid from './MetricsGrid';
import PriceChart from './PriceChart';
import ScoreGauge from './ScoreGauge';

export default function StockScreener({ onBack }: { onBack?: () => void }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StockData | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setData(null);
    setScoreResult(null);

    try {
      const response = await fetch(`/api/analyze?symbols=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('API Request Failed');
      
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        const stockInfo = json.results[0]; // grab first one
        
        if (stockInfo.error) {
           setError(stockInfo.error);
        } else {
           setData(stockInfo);
           const result = StockAnalyzer.analyze(stockInfo);
           setScoreResult(result);
           
           if (!result) {
             setError('Could not analyze data. Missing fundamental metrics.');
           }
        }
      } else {
        setError('No data returned.');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching stock data.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract top level metrics for the grid
  const getTopMetrics = (): any[] => {
    if (!data?.quoteSummary) return [];
    
    const sd = data.quoteSummary.summaryDetail || {};
    const dks = data.quoteSummary.defaultKeyStatistics || {};
    
    return [
      { name: "Market Cap", value: StockAnalyzer.formatLargeNumber(data.quote?.marketCap || sd.marketCap) },
      { name: "Trailing P/E", value: (sd.trailingPE || dks.trailingPE)?.toFixed(2) },
      { name: "Forward P/E", value: (sd.forwardPE || dks.forwardPE)?.toFixed(2) },
      { name: "Dividend Yield", value: sd.dividendYield ? `${(sd.dividendYield * 100).toFixed(2)}` : '0.00', suffix: '%' },
    ];
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 selection:bg-amber-500/30 selection:text-amber-500">
      <div className="max-w-5xl mx-auto mt-8">
        
        {onBack && (
          <div className="mb-6 flex justify-start">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-slate-950 text-amber-500 text-[10px] font-bold rounded-xl border border-amber-500/20 shadow-lg uppercase tracking-wider hover:bg-black transition-colors"
            >
              Home
            </button>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 uppercase">
            Stock Rank Analyser
          </h1>
          <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm">12-Point Fundamental Health Verification</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-6 text-amber-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Enter Stock Symbol" 
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              className="w-full pl-14 pr-32 py-5 bg-black border border-amber-500/20 rounded-full outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-black text-white shadow-xl transition-all text-lg tracking-wide placeholder:text-slate-600 placeholder:font-bold"
            />
            <button 
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-slate-900 border border-amber-500/30 text-amber-500 rounded-full font-black text-sm tracking-[0.2em] uppercase hover:bg-black hover:border-amber-500/50 transition-all disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 justify-center mb-8">
             <AlertCircle className="w-5 h-5" />
             <span className="font-bold">{error}</span>
          </div>
        )}

        {data && scoreResult && (
          <div className="space-y-6">
            
            {/* Header section with Name, Price and Score */}
            <div className="bg-black p-8 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-amber-500/20">
                    {data.quote?.fullExchangeName || "NSE"} 
                    <span className="w-1 h-1 bg-amber-500/50 rounded-full mx-1"></span> 
                    {data.symbol}
                 </div>
                 <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-2 uppercase">
                   {data.quote?.shortName || data.quote?.longName || data.ticker}
                 </h2>
                 <div className="flex items-end gap-3">
                   <div className="text-4xl font-black text-amber-500 tracking-tighter">
                     ₹{(data.quote?.regularMarketPrice || data.quoteSummary?.financialData?.currentPrice || 0).toFixed(2)}
                   </div>
                   {data.quote?.regularMarketChange !== undefined && (
                     <div className={`text-sm font-bold flex items-center gap-1 mb-1 ${data.quote.regularMarketChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {data.quote.regularMarketChange > 0 ? '+' : ''}{data.quote.regularMarketChange.toFixed(2)}
                        ({data.quote.regularMarketChangePercent?.toFixed(2)}%)
                     </div>
                   )}
                 </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-amber-500/20 min-w-[200px]">
                 <ScoreGauge score={scoreResult.totalPoints} maxScore={12} />
                 <div className={`mt-2 text-lg font-black tracking-tight ${scoreResult.verdictColor}`}>
                   {scoreResult.verdict}
                 </div>
              </div>
            </div>

            {/* Quick Metrics & Chart Row */}
            <div className="grid md:grid-cols-3 gap-6">
               <div className="md:col-span-1">
                 <MetricsGrid metrics={getTopMetrics()} />
               </div>
               <div className="md:col-span-2 bg-black p-6 rounded-3xl border border-amber-500/20 shadow-xl">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">1-Year Price History</div>
                  <PriceChart data={data.chart} />
               </div>
            </div>

            {/* Detailed Analysis Breakdowns */}
            <div className="bg-black rounded-3xl border border-amber-500/20 shadow-xl overflow-hidden">
               <div className="px-8 py-6 border-b border-amber-500/20 bg-slate-950">
                 <h3 className="font-black text-amber-500 tracking-[0.2em] text-sm uppercase">Fundamental Health Checks</h3>
               </div>
               
               <div className="p-8 space-y-10">
                 {scoreResult.details.map((section, idx) => (
                   <div key={idx}>
                     <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                       <span>{section.category}</span>
                       <div className="h-px bg-white/5 flex-1"></div>
                     </h4>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {section.metrics.map((metric, midx) => (
                         <div key={midx} className={`p-5 justify-between flex flex-col rounded-2xl border ${metric.passed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                           <div className="flex items-start justify-between mb-4">
                             <div className="text-xs font-bold text-slate-200 uppercase tracking-widest">{metric.name}</div>
                             {metric.passed ? (
                               <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                             ) : (
                               <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                             )}
                           </div>
                           <div>
                             <div className={`text-xl font-black mb-2 tracking-tight ${metric.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                               {metric.value}
                             </div>
                             <div className="text-[10px] font-medium text-slate-400 leading-relaxed">
                               {metric.description}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <p className="text-center text-xs text-slate-400 font-medium py-8 rounded-xl bg-black border border-amber-500/10 shadow-lg">
               ⚠️ <strong>Disclaimer:</strong> This tool scores based purely on quantitative data and basic heuristics. 
               Always do your own research or consult a financial advisor before making actual investment decisions.
            </p>

          </div>
        )}
      </div>
    </div>
  );
}
