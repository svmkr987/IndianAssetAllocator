import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, XCircle, Users, Check, ShieldCheck, Activity, ClipboardCheck, LineChart } from 'lucide-react';
import { StockAnalyzer } from '../../utils/screenerUtils';
import { StockData, ScoreResult } from '../../types/screener';
import MetricsGrid from './MetricsGrid';
import PriceChart from './PriceChart';
import ScoreGauge from './ScoreGauge';

const BASE_VISITORS = 1000;

const StylishActivityLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 32,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center p-2 bg-slate-950 rounded-xl border border-amber-500/30 shadow-lg ${className}`}>
      <LineChart 
        size={size} 
        className="text-amber-500 stroke-[2.5px] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
      />
    </div>
  );
};

export default function StockScreener({ onBack }: { onBack?: () => void }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StockData | null>(null);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState('');
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const updateCounter = async () => {
      try {
        const response = await fetch('https://api.counterapi.dev/v1/mkrfinwise/investright-v1/up');
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        }
      } catch (err) {
        // Silent catch
      }
    };
    updateCounter();
  }, []);

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

  const displayCount = (visitorCount !== null ? visitorCount + BASE_VISITORS : BASE_VISITORS);

  return (
    <div className="min-h-screen pb-32 print:bg-white print:pb-0 flex flex-col selection:bg-amber-500/30 selection:text-amber-500">
      
      {/* Navbar */}
      <div className="bg-slate-950 text-white shadow-xl sticky top-0 z-50 no-print border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <StylishActivityLogo size={24} />
            <div className="flex flex-col">
              <h1 className="text-base font-black tracking-tight leading-none uppercase">Stock Rank Analyser</h1>
              <p className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">by MKR FinWise</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onBack && (
              <button 
                onClick={onBack}
                className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all text-amber-500 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-amber-500/20"
                title="Back to Home"
              >
                <span>Home</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10 print:p-0 print:max-w-none flex-grow w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-6 duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500"></div>

          <h2 className="text-2xl font-black text-slate-900 mb-10 flex flex-wrap items-center gap-4">
            <div className="p-3 bg-slate-950 rounded-xl shadow-lg border border-amber-500/30">
              <LineChart className="h-6 w-6 text-amber-500 stroke-[2.5px] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </div>
            <div className="flex items-center flex-wrap gap-3 text-slate-900">
              <span>Fundamental Health Check</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 text-[10px] font-bold tracking-[0.1em] uppercase shadow-sm">12-Point Verification Process</span>
              </div>
            </div>
          </h2>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-6 text-amber-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Enter Stock Symbol" 
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              className="w-full pl-14 pr-32 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-black text-slate-900 text-lg tracking-wide placeholder:text-slate-400 placeholder:font-bold"
            />
            <button 
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-slate-950 border border-amber-500/30 text-amber-500 rounded-xl font-black text-sm tracking-[0.2em] uppercase hover:bg-black hover:border-amber-500/50 transition-all disabled:opacity-50 flex items-center shadow-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 justify-center mb-8 shadow-sm">
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

            <p className="text-center text-xs text-slate-500 font-medium mt-12 py-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
               ⚠️ <strong>Disclaimer:</strong> This tool scores based purely on quantitative data and basic heuristics. 
               Always do your own research or consult a financial advisor before making actual investment decisions.
            </p>

          </div>
        )}
        </div>
      </main>
      
      {/* FIXED Professional Black Footer */}
      <footer className="no-print fixed bottom-0 left-0 right-0 bg-slate-950 text-white border-t border-amber-500/20 py-6 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-1">
            <Users className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              Trusted by {displayCount.toLocaleString()}+ Investors
            </span>
          </div>
          <p className="text-white text-[11px] italic font-medium tracking-wide opacity-90">
            "Not all Mutual Funds & ETFs are worth your money."
          </p>
          <p className="text-slate-400 text-[10px] font-medium tracking-wide">
            Find out which ones: <a href="https://wa.me/919008264816?text=Hi" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold ml-1" >+91-9008264816</a> (Only Whatsapp). To learn Swing trading, click <a href="https://t.me/MKR_FinWise_Hub" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold ml-1" >MKR FinWise Hub</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
