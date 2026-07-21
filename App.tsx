import React, { useState } from 'react';
import InvestRight from './InvestRight';
import StockScreener from './src/components/screener/StockScreener';
import { LineChart, BarChart, ArrowRight, ShieldCheck, Send } from 'lucide-react';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'home' | 'invest-right' | 'stock-screener'>('home');

  if (currentApp === 'invest-right') {
    return <InvestRight onBack={() => setCurrentApp('home')} />;
  }

  if (currentApp === 'stock-screener') {
    return <StockScreener onBack={() => setCurrentApp('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans selection:bg-amber-500/30">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter text-white">
            MKR <span className="text-amber-600">FinWise</span>
          </div>
          <nav className="flex items-center gap-8 text-[13px] uppercase tracking-[0.2em] font-medium text-slate-400">
            <a href="#" className="hover:text-amber-500 transition-colors">Home</a>
            <a href="https://t.me/MKR_FinWise_Hub" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">Community</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
              Precision Financial <span className="text-amber-600">Intelligence</span>
            </h1>
            <p className="text-slate-400 font-medium tracking-[0.15em] text-xs sm:text-sm uppercase mb-12 max-w-2xl mx-auto leading-relaxed">
              Empowering professional traders with institutional-grade analytics and asset allocation tools for superior market performance.
            </p>
            
            <a 
              href="https://t.me/MKR_FinWise_Hub" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-amber-600/10 hover:border-amber-600/30 transition-all duration-300 text-[13px] font-bold uppercase tracking-[0.15em] shadow-xl hover:shadow-amber-900/10"
            >
              <Send className="w-4 h-4" /> Join The Inner Circle
            </a>
          </div>

          {/* Modules Section */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Invest Right Card */}
            <button 
              onClick={() => setCurrentApp('invest-right')}
              className="group relative bg-[#0f1218] rounded-3xl border border-white/5 transition-all duration-500 text-left overflow-hidden hover:border-amber-600/30 hover:shadow-[0_20px_50px_rgba(180,130,50,0.1)]"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-white/5 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <BarChart className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Invest Right</h2>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.25em] mb-6">Asset Allocation & SIP Planner</p>
                <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300">
                  Determine your optimal asset allocation strategy based on your risk tolerance and investment horizon.
                </p>
              </div>
            </button>

            {/* Stock Screener Card */}
            <button 
              onClick={() => setCurrentApp('stock-screener')}
              className="group relative bg-[#0f1218] rounded-3xl border border-white/5 transition-all duration-500 text-left overflow-hidden hover:border-amber-600/30 hover:shadow-[0_20px_50px_rgba(180,130,50,0.1)]"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-white/5 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <LineChart className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Stock Analyser</h2>
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.25em] mb-6">Fundamental Health Screener</p>
                <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300">
                  Evaluate the fundamental strength of stocks across profitability, valuation, health, and momentum.
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
