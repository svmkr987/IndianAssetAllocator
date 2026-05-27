import React, { useState } from 'react';
import InvestRight from './InvestRight';
import StockScreener from './src/components/screener/StockScreener';
import { LineChart, BarChart } from 'lucide-react';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'home' | 'invest-right' | 'stock-screener'>('home');

  if (currentApp === 'invest-right') {
    return <InvestRight onBack={() => setCurrentApp('home')} />;
  }

  if (currentApp === 'stock-screener') {
    return <StockScreener onBack={() => setCurrentApp('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            MKR FinWise
          </h1>
          <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-sm">Select a module to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button 
            onClick={() => setCurrentApp('invest-right')}
            className="group relative bg-black p-8 rounded-3xl border border-amber-500/20 shadow-xl hover:shadow-2xl hover:border-amber-500/50 transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <BarChart className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">INVEST RIGHT</h2>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">Asset Allocation & SIP Planner</p>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Determine your optimal asset allocation strategy based on your age, risk tolerance, and investment horizon. Plan your SIPs effectively.
              </p>
            </div>
          </button>

          <button 
            onClick={() => setCurrentApp('stock-screener')}
            className="group relative bg-black p-8 rounded-3xl border border-amber-500/20 shadow-xl hover:shadow-2xl hover:border-amber-500/50 transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <LineChart className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Stock Rank Analyser</h2>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">Fundamental Health Screener</p>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Evaluate the fundamental strength of stocks across profitability, valuation, health, growth, and momentum with a precise 12-point scoring system.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
