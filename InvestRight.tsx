import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, Shield, AlertTriangle, PieChart, Target, ArrowRight,
  Calculator, RefreshCw, Settings2, BarChart3,
  Sliders, FileText, CheckSquare, Coins, Lock, PlusCircle,
  Gem, Printer, Loader2, Check, ShieldCheck, Users
} from 'lucide-react';
import BarChartLogo from './src/components/UI/BarChart';
import { UserInputs, Exclusions, ReturnRates, AllocationResult, RiskLevel, ProjectionBreakdown } from './types';
import { calculateAllocation, formatCurrency, formatDate, formatNumberIndian, parseNumberIndian } from './utils';
import { AssetCard, ProgressBar } from './components/UI';
import { SipCalculatorModal, RatesSettingsModal } from './components/Modals';

const INITIAL_INPUTS: UserInputs = { 
  age: '25', 
  amount: '20000', 
  stepUp: '0', 
  horizon: '15', 
  risk: 'Medium' 
 };

const INITIAL_EXCLUSIONS: Exclusions = {
  commodities: false,
  usEquity: false
};

const INITIAL_RATES: ReturnRates = { 
  equity: 12, 
  gold: 8 
};

// Base visitor offset to start from your preferred number
const BASE_VISITORS = 1000;

/**
 * Professional Standalone Tick Logo
 */
const StylishTickLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 32,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center p-2 bg-slate-950 rounded-xl border border-amber-500/30 shadow-lg ${className}`}>
      <Check 
        size={size} 
        className="text-amber-500 stroke-[3.5px] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
      />
    </div>
  );
};

/**
 * Bar Chart Logo
 */
const BarChartLogoComp: React.FC<{ size?: number; className?: string }> = ({ 
  size = 32,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-sm ${className}`}>
      <BarChartLogo
        size={size} 
        className="text-amber-500 stroke-[2.5px]" 
      />
    </div>
  );
};

const ReportHeader: React.FC<{ inputs: UserInputs }> = ({ inputs }) => (
  <div className="flex flex-col border-b border-slate-200 pb-8 mb-8">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6">
        <BarChartLogoComp size={40} />
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Portfolio Architect</h1>
          <p className="text-amber-500 text-[11px] mt-2 font-bold uppercase tracking-[0.25em]">by MKR FinWise</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Issue Date</div>
        <div className="text-slate-900 font-extrabold text-xl">{formatDate()}</div>
      </div>
    </div>
    
    <div className="mt-8 grid grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Investor Age</div>
        <div className="font-black text-slate-900 text-xl">{inputs.age} Years</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Horizon</div>
        <div className="font-black text-slate-900 text-xl">{inputs.horizon} Years</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Risk Profile</div>
        <div className="font-black text-slate-900 text-xl">{inputs.risk}</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Monthly SIP</div>
        <div className="font-black text-slate-900 text-xl">{formatCurrency(parseFloat(inputs.amount))}</div>
      </div>
    </div>
  </div>
);

export default function InvestRight({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(1);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [isSipLocked, setIsSipLocked] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const [rates, setRates] = useState<ReturnRates>(INITIAL_RATES);
  const [inputs, setInputs] = useState<UserInputs>(INITIAL_INPUTS);
  const [exclusions, setExclusions] = useState<Exclusions>(INITIAL_EXCLUSIONS);
  const [result, setResult] = useState<AllocationResult | null>(null);

  const hasFetched = useRef(false);

  // Improved Visitor Counter Logic (using counterapi.dev - more stable)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const raw = parseNumberIndian(value);
      setInputs(prev => ({ ...prev, [name]: raw }));
    } else {
      setInputs(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const toggleExclusion = (key: keyof Exclusions) => {
    setExclusions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplySip = (amount: number) => {
    setInputs(prev => ({ ...prev, amount: amount.toString() }));
    setIsSipLocked(true);
    setShowCalculator(false);
  };

  const handleUnlockSip = () => {
    setIsSipLocked(false);
    setInputs(prev => ({ ...prev, amount: '' }));
  };

  const resetPlan = () => {
    setStep(1);
    setIsSipLocked(false);
    setInputs({...INITIAL_INPUTS});
    setExclusions({...INITIAL_EXCLUSIONS});
    setRates({...INITIAL_RATES});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculate = () => {
    const amountVal = parseFloat(inputs.amount);
    if (!inputs.amount || isNaN(amountVal) || amountVal < 500) {
      alert("Minimum monthly investment is ₹500");
      return;
    }
    const res = calculateAllocation(inputs, rates, exclusions);
    setResult(res);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (step === 2 && inputs.amount) {
      setResult(calculateAllocation(inputs, rates, exclusions));
    }
  }, [rates, exclusions, step]);

  const displayCount = (visitorCount !== null ? visitorCount + BASE_VISITORS : BASE_VISITORS);

  return (
    <div className="min-h-screen pb-32 print:bg-slate-950 print:pb-0 flex flex-col bg-slate-950 text-slate-300 selection:bg-amber-500/20">
      
      {/* Navbar */}
      <div className="bg-slate-950 text-white shadow-sm sticky top-0 z-50 no-print border-b border-slate-800">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BarChartLogoComp size={24} />
            <div className="flex flex-col">
              <h1 className="text-base font-black tracking-tight leading-none uppercase text-white">Portfolio Architect</h1>
              <p className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">by MKR FinWise</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button 
                onClick={resetPlan} 
                className="bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-all text-slate-400 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-slate-800"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
            {onBack && (
              <button 
                onClick={onBack}
                className="bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-all text-amber-500 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-slate-800"
                title="Home"
              >
                <span>Home</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10 print:p-0 print:max-w-none flex-grow">
        
        {/* Input Stage */}
        {step === 1 && (
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-6 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500"></div>
            
            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-xl shadow-sm border border-slate-800">
                <ShieldCheck className="h-6 w-6 text-amber-500" />
              </div>
              Portfolio Configuration
            </h2>

            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Your Age</label>
                  <input type="number" name="age" value={inputs.age} onChange={handleInputChange}
                    className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-black text-2xl text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Horizon (Years)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="horizon" 
                      value={inputs.horizon} 
                      onChange={handleInputChange} 
                      readOnly={isSipLocked}
                      className={`w-full p-5 border rounded-2xl outline-none transition-all font-black text-2xl ${
                        isSipLocked 
                          ? 'bg-slate-900 text-slate-600 border-slate-800' 
                          : 'bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
                      }`} 
                    />
                    {isSipLocked && <Lock className="w-5 h-5 text-slate-600 absolute right-5 top-1/2 -translate-y-1/2" />}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monthly SIP (₹)</label>
                   {!isSipLocked ? (
                     <button onClick={() => setShowCalculator(true)}
                       className="text-[10px] text-amber-500 font-extrabold hover:text-amber-400 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                       <Calculator className="w-4 h-4" /> Inflation adjusted SIP Estimator
                     </button>
                   ) : (
                     <button onClick={handleUnlockSip}
                       className="text-[10px] text-red-500 font-extrabold hover:text-red-400 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                       <RefreshCw className="w-4 h-4" /> Change Input
                     </button>
                   )}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    name="amount" 
                    value={formatNumberIndian(inputs.amount)} 
                    onChange={handleInputChange} 
                    readOnly={isSipLocked}
                    className={`w-full p-5 border rounded-2xl outline-none transition-all font-black text-2xl ${
                      isSipLocked 
                        ? 'bg-slate-900 text-slate-600 border-slate-800' 
                        : 'bg-slate-950 border-slate-800 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
                    }`} 
                  />
                  {!isSipLocked && <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">INR</div>}
                </div>
                
                <div className="mt-8">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Annual Step-up (%)</label>
                  <div className="relative">
                    <input type="number" name="stepUp" value={inputs.stepUp} onChange={handleInputChange}
                      className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-black text-2xl text-white" />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">P.A.</div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium italic">* Used exclusively for wealth projections, not asset allocation.</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">Risk Tolerance</label>
                <div className="grid grid-cols-3 gap-5">
                  {(['Low', 'Medium', 'High'] as RiskLevel[]).map((level) => (
                    <button key={level} onClick={() => setInputs({...inputs, risk: level})}
                      className={`py-5 px-3 rounded-2xl border font-black uppercase tracking-[0.2em] transition-all text-xs ${
                        inputs.risk === level 
                          ? 'bg-amber-500 border-amber-500 text-slate-950 scale-[1.05] shadow-2xl' 
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-10">
                 <div className="flex items-center gap-3 text-[11px] font-bold text-white mb-6 uppercase tracking-[0.2em]">
                    <Sliders className="w-5 h-5 text-amber-500" /> 
                    Custom Exclusions
                 </div>

                 <div className="space-y-4">
                    {(Object.keys(exclusions) as Array<keyof Exclusions>).map((key) => (
                      <label key={key} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all cursor-pointer ${exclusions[key] ? 'bg-red-950/30 border-red-900' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${exclusions[key] ? 'bg-red-500 border-red-500' : 'border-slate-700 bg-slate-900'}`}>
                          {exclusions[key] && <CheckSquare className="w-4 h-4 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={exclusions[key]} onChange={() => toggleExclusion(key)} />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Exclude {key === 'usEquity' ? 'International Equity' : 'Precious Metals'}
                        </span>
                      </label>
                    ))}
                 </div>
              </div>

              <button onClick={handleCalculate}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-6 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] uppercase text-sm tracking-[0.3em]"
              >
                Generate Strategy <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Report Stage */}
        {step === 2 && result && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-600">
            <div id="report-content" className="space-y-12 bg-slate-900 p-6 sm:p-12 rounded-[2.5rem] shadow-inner border border-slate-800">
              
              <ReportHeader inputs={inputs} />

              {/* Strategic Terminal Value - Dashboard Section (Plain Black) */}
              <div className="dark-banner bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-amber-400 mb-10 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3 font-bold text-[11px] uppercase tracking-[0.3em]">
                    <BarChart3 className="w-5 h-5" /> Strategic Terminal Value
                  </div>
                  <button onClick={() => setShowRatesModal(true)} className="no-print p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-[11px] text-amber-500 flex items-center gap-2 font-black uppercase tracking-widest border border-white/20">
                    <Settings2 className="w-4 h-4" /> Expected Returns
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Cumulative Capital</div>
                    <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(result!.projection.invested)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Estimated Yield</div>
                    <div className="text-2xl font-black text-emerald-500 tracking-tight">
                      +{formatCurrency(result.projection.value - result.projection.invested)}
                    </div>
                  </div>
                  <div>
                    <div className="text-amber-500/80 text-[10px] font-bold uppercase tracking-widest mb-4">Estimated Corpus</div>
                    <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(result!.projection.value)}</div>
                  </div>
                </div>
                
                <div className="mt-12 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
                  {Object.entries(result.projection.breakdown).map(([asset, data]) => {
                    const breakdown = data as ProjectionBreakdown;
                    return breakdown.invested > 0 && (
                      <div key={asset} className="bg-white/[0.08] p-5 rounded-2xl border border-white/5 w-full sm:w-64">
                        <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-4 flex items-center justify-between border-b border-white/5 pb-2">
                          {asset} <span className="text-amber-500/70">{rates[asset as keyof ReturnRates]}%</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Invested</span>
                            <span className="text-xs font-bold text-slate-300">{formatCurrency(breakdown.invested)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Yield</span>
                            <span className="text-xs font-bold text-emerald-500">+{formatCurrency(breakdown.returns)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-10 items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Model Yield</span>
                    <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/20">~{result.projection.weightedRate}% Weighted</span>
                  </div>
                  {parseFloat(inputs.stepUp) > 0 && (
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth Factor</span>
                      <span className="text-sm font-black text-amber-500 bg-amber-500/10 px-5 py-2 rounded-xl border border-amber-500/20">{inputs.stepUp}% Annual Step-up</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Grid */}
              <div className="grid grid-cols-2 gap-6">
                <AssetCard title="Equity" percent={result.percentages.equity} amount={result.amounts.equity} color="border-emerald-600" icon={TrendingUp} desc="Long-term Growth" />
                <AssetCard title="Gold" percent={result.percentages.gold} amount={result.amounts.gold} color={exclusions.commodities ? "border-slate-200 opacity-40" : "border-amber-500"} icon={PieChart} desc={exclusions.commodities ? "Excluded" : "Inflation Hedge"} />
              </div>

              {/* Equity Split */}
              {result.percentages.equity > 0 && (
                <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-sm">
                  <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 flex items-center gap-4 text-sm uppercase tracking-widest"><TrendingUp className="w-6 h-6 text-emerald-600" /> Equity Components</h3>
                    <div className="px-5 py-2 bg-white rounded-xl border border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-widest">
                      {formatCurrency(result.amounts.equity)} / Month
                    </div>
                  </div>
                  <div className="p-12">
                    {(Object.entries(result.equitySplit) as [string, number][]).map(([name, pct]) => {
                      const amount = (parseFloat(inputs.amount) * pct) / 100;
                      // Calculate the width relative to the equity portion so the bars look proportionate
                      const relativeWidth = result.percentages.equity > 0 ? (pct / result.percentages.equity) * 100 : 0;
                      return pct > 0 && <ProgressBar key={name} label={name} value={pct} relativeWidth={relativeWidth} amount={formatCurrency(amount)} colorClass={name.includes('US') ? 'bg-slate-950' : 'bg-emerald-600'} />
                    })}
                  </div>
                </div>
              )}

              {/* Rationale & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-6 text-[11px] uppercase tracking-[0.3em] border-b border-slate-100 pb-4 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-amber-600" /> Allocation Thesis
                  </h4>
                  <p className={`text-sm leading-relaxed font-medium text-slate-700`}>{result.rationale}</p>
                </div>
                <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-6 text-[11px] uppercase tracking-[0.3em] border-b border-slate-100 pb-4 flex items-center gap-3">
                    <Gem className="w-6 h-6 text-emerald-600" /> Expert View
                  </h4>
                  <div className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
                    Focus on low-cost Index Funds for Equity core. Use Sovereign Gold Bonds (SGB) for tax-efficient metal exposure.
                  </div>
                </div>
              </div>

              {/* Professional Disclosure */}
              <div className="flex gap-8 p-10 border border-slate-100 bg-slate-50 rounded-[2rem]">
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                <div className="text-[11px] text-slate-500 leading-relaxed font-semibold uppercase tracking-wide">
                  <p><strong className="text-slate-900">Important Notice:</strong> This framework is based on modern portfolio theory. The information shared is for educational and informational purposes only and should not be considered as investment advice. The presenter is not a SEBI registered investment advisor. Market investments are subject to risk. Please consult a SEBI registered financial advisor before making any investment decisions.</p>
                </div>
              </div>
              
              {/* Report Footer Contact (Visible only on the report/PDF) */}
              <div className="pt-8 border-t border-slate-100 text-center flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-950 rounded-full border border-amber-500/20 mb-2">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest italic">
                    Trusted by {displayCount.toLocaleString()}+ Investors
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] italic font-medium tracking-wide">
                  "Not all Mutual Funds & ETFs are worth your money."
                </p>
                <p className="text-slate-400 text-[10px] font-medium tracking-wider">
                  Find out which ones: <a href="https://wa.me/919008264816?text=Hi" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold ml-1" >+91-9008264816</a> (Only Whatsapp). To learn Swing trading, click <a href="https://t.me/MKR_FinWise_Hub" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold ml-1" >MKR FinWise Hub</a>.
                </p>
              </div>
            </div>

            {/* Actions Area */}
            <div className="no-print space-y-6 pt-16">
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-6 rounded-2xl transition-all text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-200 shadow-sm">
                  <Settings2 className="w-5 h-5" /> Refine Inputs
                </button>
                <button onClick={resetPlan}
                  className="bg-white hover:bg-slate-50 text-slate-500 font-black py-6 rounded-2xl border border-slate-200 transition-all text-[12px] uppercase tracking-widest flex items-center justify-center gap-3">
                  <PlusCircle className="w-5 h-5" /> New Session
                </button>
              </div>
              
              <button 
                onClick={handlePrint} 
                className="w-full bg-slate-950 hover:bg-black text-amber-500 font-black py-7 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-[0.99] uppercase text-sm tracking-[0.35em] border border-amber-500/20"
              >
                <Printer className="w-7 h-7" /> Save Strategy as PDF (Print)
              </button>
              <p className="text-[11px] text-slate-400 text-center font-black italic tracking-widest opacity-80">Use the browser's "Save as PDF" option in the print menu for a high-quality report.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="no-print fixed bottom-0 left-0 right-0 bg-slate-950 text-slate-300 border-t border-slate-800 py-6 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 mb-1">
            <Users className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Trusted by {displayCount.toLocaleString()}+ Investors
            </span>
          </div>
          <p className="text-slate-300 text-[11px] italic font-medium tracking-wide opacity-90">
            "Not all Mutual Funds & ETFs are worth your money."
          </p>
          <p className="text-slate-500 text-[10px] font-medium tracking-wide">
            Find out which ones: <a href="https://wa.me/919008264816?text=Hi" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold ml-1" >+91-9008264816</a> (Only Whatsapp). To learn Swing trading, click <a href="https://t.me/MKR_FinWise_Hub" target="_blank" rel="noopener noreferrer" className="text-amber-500 font-bold ml-1" >MKR FinWise Hub</a>.
          </p>
        </div>
      </footer>

      <SipCalculatorModal 
        isOpen={showCalculator} 
        onClose={() => setShowCalculator(false)} 
        initialDuration={inputs.horizon} 
        onApply={handleApplySip} 
      />
      
      <RatesSettingsModal 
        isOpen={showRatesModal} 
        onClose={() => setShowRatesModal(false)} 
        rates={rates} 
        onSave={setRates} 
      />
    </div>
  );
}