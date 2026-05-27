import React, { useState } from 'react';
import InvestRight from './InvestRight';
import StockScreener from './src/components/screener/StockScreener';
import { LineChart, BarChart, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'home' | 'invest-right' | 'stock-screener'>('home');

  if (currentApp === 'invest-right') {
    return <InvestRight onBack={() => setCurrentApp('home')} />;
  }

  if (currentApp === 'stock-screener') {
    return <StockScreener onBack={() => setCurrentApp('home')} />;
  }

  return (
    <div className="min-h-screen relative bg-[#030303] flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-amber-500/5 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />
      </div>

      <div className="max-w-5xl w-full z-10 animate-in fade-in duration-1000 relative">
        <div className="text-center mb-16 relative">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 drop-shadow-xl">
            MKR FinWise
          </h1>
          <p className="text-amber-500 font-bold uppercase tracking-[0.25em] text-xs sm:text-sm shadow-black drop-shadow-md">
            SELECT A MODULE TO CONTINUE
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Invest Right Card */}
          <button 
            onClick={() => setCurrentApp('invest-right')}
            className="group relative bg-[#080808] rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-500 text-left overflow-hidden hover:shadow-[0_0_60px_rgba(245,158,11,0.05)] hover:-translate-y-1 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100"
          >
            {/* Hover Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative p-8 sm:p-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 bg-black border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-all duration-500 shadow-lg">
                  <BarChart className="w-7 h-7 stroke-[1.5px]" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:bg-amber-500 hover:scale-110 group-hover:border-amber-500 group-hover:text-black text-slate-600 transition-all duration-500">
                  <ArrowRight className="w-4 h-4 stroke-[2px]" />
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">INVEST RIGHT</h2>
              <p className="text-[12px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">ASSET ALLOCATION & SIP PLANNER</p>
              
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-full mb-5" />
              
              <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                Determine your optimal asset allocation strategy based on your age, risk tolerance, and investment horizon. Plan your SIPs effectively.
              </p>
            </div>
          </button>

          {/* Stock Screener Card */}
          <button 
            onClick={() => setCurrentApp('stock-screener')}
            className="group relative bg-[#080808] rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-500 text-left overflow-hidden hover:shadow-[0_0_60px_rgba(245,158,11,0.05)] hover:-translate-y-1 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200"
          >
            {/* Hover Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative p-8 sm:p-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 bg-black border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-all duration-500 shadow-lg">
                  <LineChart className="w-7 h-7 stroke-[1.5px]" />
                </div>
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:bg-amber-500 hover:scale-110 group-hover:border-amber-500 group-hover:text-black text-slate-600 transition-all duration-500">
                  <ArrowRight className="w-4 h-4 stroke-[2px]" />
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">STOCK RANK ANALYSER</h2>
              <p className="text-[12px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4">FUNDAMENTAL HEALTH SCREENER</p>
              
              <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-full mb-5" />
              
              <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                Evaluate the fundamental strength of stocks across profitability, valuation, health, growth, and momentum with a precise 12-point scoring system.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
