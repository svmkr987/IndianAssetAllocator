import React, { useState, useEffect } from 'react';
import InvestRight from './InvestRight';
import StockScreener from './src/components/screener/StockScreener';
import SIPRebalancer from './src/components/rebalancer/SIPRebalancer';
import { LineChart, BarChart, ArrowRight, ShieldCheck, Send, Calculator } from 'lucide-react';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'home' | 'invest-right' | 'stock-screener' | 'sip-rebalancer'>('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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
    <div className="min-h-screen bg-midnight text-bluegrey font-sans selection:bg-champagne/20">
      <div className="fixed top-0 left-0 h-1 bg-champagne z-[60] transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-slatenavy bg-midnight/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter text-warm">
            MKR <span className="text-champagne">FinWise</span>
          </div>
          <nav className="flex items-center gap-8 text-[12px] uppercase tracking-[0.2em] font-semibold text-bluegrey">
            <a href="https://t.me/MKR_FinWise_Hub" target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">Community</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-warm mb-8">
              Precision Financial <span className="text-champagne">Intelligence</span>
            </h1>
            <p className="text-bluegrey font-medium tracking-[0.1em] text-xs sm:text-sm uppercase mb-12 max-w-2xl mx-auto leading-relaxed">
              Empowering professional traders with institutional-grade analytics and asset allocation tools for superior market performance.
            </p>
            
            <a 
              href="https://t.me/MKR_FinWise_Hub" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-champagne text-slate-950 hover:bg-bright transition-all duration-300 text-[12px] font-bold uppercase tracking-[0.15em] shadow-lg"
            >
              <Send className="w-4 h-4" /> Join The Inner Circle
            </a>
          </div>

          {/* Modules Section */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Invest Right Card */}
            <button 
              onClick={() => setCurrentApp('invest-right')}
              className="group relative bg-midnight rounded-3xl border border-slatenavy transition-all duration-300 text-left overflow-hidden hover:border-champagne/50 hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-deep text-champagne rounded-2xl flex items-center justify-center border border-slatenavy group-hover:bg-midnight transition-colors duration-500">
                  <BarChart className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-warm mb-2 uppercase tracking-tight">Portfolio Architect</h2>
                <p className="text-[10px] font-bold text-champagne uppercase tracking-[0.25em] mb-6">Asset Allocation & SIP Planner</p>
                <p className="text-bluegrey text-sm leading-relaxed font-medium group-hover:text-bluegrey">
                  Determine your optimal asset allocation strategy based on your risk tolerance and investment horizon.
                </p>
              </div>
            </button>
            {/* Rebalancer Card */}
            <button 
              onClick={() => setCurrentApp('sip-rebalancer')}
              className="group relative bg-midnight rounded-3xl border border-slatenavy transition-all duration-300 text-left overflow-hidden hover:border-champagne/50 hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-deep text-champagne rounded-2xl flex items-center justify-center border border-slatenavy group-hover:bg-midnight transition-colors duration-500">
                  <Calculator className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-warm mb-2 uppercase tracking-tight">Portfolio Refiner</h2>
                <p className="text-[10px] font-bold text-champagne uppercase tracking-[0.25em] mb-6">1-Year Portfolio Optimization</p>
                <p className="text-bluegrey text-sm leading-relaxed font-medium group-hover:text-bluegrey">
                  Align your portfolio with target allocations over next 12 months using fresh monthly SIP cash flows.
                </p>
              </div>
            </button>
            {/* Stock Screener Card */}
            <button 
              onClick={() => setCurrentApp('stock-screener')}
              className="group relative bg-midnight rounded-3xl border border-slatenavy transition-all duration-300 text-left overflow-hidden hover:border-champagne/50 hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105"
            >
              <div className="relative p-10 sm:p-12">
                <div className="w-16 h-16 mb-12 bg-deep text-champagne rounded-2xl flex items-center justify-center border border-slatenavy group-hover:bg-midnight transition-colors duration-500">
                  <LineChart className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-warm mb-2 uppercase tracking-tight">Stock Rank Analyser</h2>
                <p className="text-[10px] font-bold text-champagne uppercase tracking-[0.25em] mb-6">Fundamental Health Screener</p>
                <p className="text-bluegrey text-sm leading-relaxed font-medium group-hover:text-bluegrey">
                  Evaluate the fundamental strength of stocks across profitability, valuation, health, and momentum.
                </p>
              </div>
            </button>
          </div>
          
        </div>
      </main>
      <footer className="border-t border-slatenavy bg-midnight py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6 text-[12px] uppercase tracking-[0.2em] font-semibold text-bluegrey">
          <p className="text-center text-bluegrey/60 px-4 max-w-3xl">
            Finance Disclaimer: The information provided on this platform is for educational purposes only and does not constitute financial advice. Consult with a qualified professional before making any investment decisions.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <p>© {new Date().getFullYear()} MKR FinWise. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-champagne transition-colors">PRIVACY POLICY</button>
              <a href="https://t.me/MKR_FinWise_Hub" target="_blank" rel="noopener noreferrer" className="hover:text-champagne transition-colors">Community</a>
            </div>
          </div>
        </div>
      </footer>

      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-[100] bg-midnight/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-deep border border-slatenavy rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-warm mb-4">Privacy Policy</h2>
            <p className="text-bluegrey mb-4">We value your privacy. Your data is processed securely and is never shared with third parties.</p>
            <button onClick={() => setShowPrivacyPolicy(false)} className="px-6 py-2 bg-champagne text-midnight rounded-full font-bold hover:bg-bright transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
