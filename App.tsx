import React, { useState, useEffect } from 'react';
import InvestRight from './InvestRight';
import StockScreener from './src/components/screener/StockScreener';
import SIPRebalancer from './src/components/rebalancer/SIPRebalancer';
import { LineChart, BarChart, ArrowRight, ShieldCheck, Send, Calculator } from 'lucide-react';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'home' | 'invest-right' | 'stock-screener' | 'sip-rebalancer'>('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (currentApp === 'invest-right') {
    return <InvestRight onBack={() => setCurrentApp('home')} />;
  }

  if (currentApp === 'stock-screener') {
    return <StockScreener onBack={() => setCurrentApp('home')} />;
  }

  if (currentApp === 'sip-rebalancer') {
    return <SIPRebalancer onBack={() => setCurrentApp('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-500/20">
      <div className="fixed top-0 left-0 h-1 bg-amber-500 z-[60] transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter text-white">
            MKR <span className="text-amber-500">FinWise</span>
          </div>
          <nav className="flex items-center gap-8 text-[12px] uppercase tracking-[0.2em] font-semibold text-slate-400">
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
              Precision Financial <span className="text-amber-500">Intelligence</span>
            </h1>
            <p className="text-slate-400 font-medium tracking-[0.1em] text-xs sm:text-sm uppercase mb-12 max-w-2xl mx-auto leading-relaxed">
              Empowering professional traders with institutional-grade analytics and asset allocation tools for superior market performance.
            </p>
            
            <a 
              href="https://t.me/MKR_FinWise_Hub" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all duration-300 text-[12px] font-bold uppercase tracking-[0.15em] shadow-lg"
            >
              <Send className="w-4 h-4" /> Join The Inner Circle
            </a>
          </div>

          {/* Modules Section */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Invest Right Card */}
            <button 
              onClick={() => setCurrentApp('invest-right')}
              className="group relative bg-slate-950 rounded-3xl border border-slate-800 transition-all duration-300 text-left overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-slate-900 text-amber-500 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:bg-slate-950 transition-colors duration-500">
                  <BarChart className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Portfolio Architect</h2>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.25em] mb-6">Asset Allocation & SIP Planner</p>
                <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300">
                  Determine your optimal asset allocation strategy based on your risk tolerance and investment horizon.
                </p>
              </div>
            </button>
            {/* Rebalancer Card */}
            <button 
              onClick={() => setCurrentApp('sip-rebalancer')}
              className="group relative bg-slate-950 rounded-3xl border border-slate-800 transition-all duration-300 text-left overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-slate-900 text-amber-500 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:bg-slate-950 transition-colors duration-500">
                  <Calculator className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Portfolio Refiner</h2>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.25em] mb-6">1-Year Portfolio Optimization</p>
                <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300">
                  Align your portfolio with target allocations over next 12 months using fresh monthly SIP cash flows.
                </p>
              </div>
            </button>
            {/* Stock Screener Card */}
            <button 
              onClick={() => setCurrentApp('stock-screener')}
              className="group relative bg-slate-950 rounded-3xl border border-slate-800 transition-all duration-300 text-left overflow-hidden hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-slate-900 text-amber-500 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:bg-slate-950 transition-colors duration-500">
                  <LineChart className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Stock Rank Analyser</h2>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.25em] mb-6">Fundamental Health Screener</p>
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
