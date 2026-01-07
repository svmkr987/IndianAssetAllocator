
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Shield, AlertTriangle, PieChart, Target, ArrowRight,
  Calculator, RefreshCw, Settings2, BarChart3,
  Sliders, FileText, CheckSquare, Coins, Lock, PlusCircle,
  Gem, Download, Loader2, Check, ShieldCheck
} from 'lucide-react';
import { UserInputs, Exclusions, ReturnRates, AllocationResult, RiskLevel, ProjectionBreakdown } from './types';
import { calculateAllocation, formatCurrency, formatDate } from './utils';
import { AssetCard, ProgressBar } from './components/UI';
import { SipCalculatorModal, RatesSettingsModal } from './components/Modals';

const INITIAL_INPUTS: UserInputs = { 
  age: '30', 
  amount: '10000', 
  stepUp: '0', 
  horizon: '10', 
  risk: 'Medium' 
 };

const INITIAL_EXCLUSIONS: Exclusions = {
  debt: false,
  commodities: false,
  usEquity: false
};

const INITIAL_RATES: ReturnRates = { 
  equity: 12, 
  debt: 7, 
  gold: 8, 
  silver: 8 
};

/**
 * Stylish Standalone Tick Logo
 * Professional check mark in a minimalist frame.
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

const ReportHeader: React.FC<{ inputs: UserInputs }> = ({ inputs }) => (
  <div className="flex flex-col border-b border-slate-200 pb-8 mb-8">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6">
        <StylishTickLogo size={40} />
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Invest Right</h1>
          <p className="text-slate-400 text-[11px] mt-2 font-bold uppercase tracking-[0.25em]">Strategic Portfolio Analysis</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Issue Date</div>
        <div className="text-slate-900 font-extrabold text-xl">{formatDate()}</div>
      </div>
    </div>
    
    <div className="mt-8 grid grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Current Age</div>
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
        <div className="font-black text-slate-900 text-xl">{formatCurrency(parseInt(inputs.amount))}</div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [step, setStep] = useState(1);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [isSipLocked, setIsSipLocked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [rates, setRates] = useState<ReturnRates>(INITIAL_RATES);
  const [inputs, setInputs] = useState<UserInputs>(INITIAL_INPUTS);
  const [exclusions, setExclusions] = useState<Exclusions>(INITIAL_EXCLUSIONS);
  const [result, setResult] = useState<AllocationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
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
    const amountVal = parseInt(inputs.amount);
    if (!inputs.amount || isNaN(amountVal) || amountVal < 500) {
      alert("Minimum monthly investment is ₹500");
      return;
    }
    const res = calculateAllocation(inputs, rates, exclusions);
    setResult(res);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Enhanced Professional Landscape PDF Download
   * Fixes visibility issues by ensuring explicit style preservation during capture.
   */
  const handleDownloadPdf = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsDownloading(true);

    const originalStyle = element.getAttribute('style') || '';
    // Optimized width for high-fidelity landscape A4 capture
    element.style.width = '1200px'; 
    element.style.padding = '40px';
    element.style.backgroundColor = '#ffffff';

    const opt = {
      margin: [10, 10],
      filename: `Invest_Right_Strategy_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        width: 1200,
        windowWidth: 1200,
        onclone: (clonedDoc: Document) => {
          // Explicitly force dark banner colors in the cloned document for the capture engine
          const darkBanners = clonedDoc.querySelectorAll('.dark-banner');
          darkBanners.forEach((node) => {
            const el = node as HTMLElement;
            el.style.backgroundColor = 'black';
            el.style.color = 'white';
            // Ensure child text elements also stay white
            const textNodes = el.querySelectorAll('*');
            textNodes.forEach((t) => {
              const textEl = t as HTMLElement;
              const currentClass = textEl.className;
              if (currentClass.includes('text-slate-500') || currentClass.includes('text-slate-400')) {
                // Keep these muted
              } else if (!currentClass.includes('text-amber-500') && !currentClass.includes('text-emerald-500')) {
                textEl.style.color = 'white';
              }
            });
          });
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      element.setAttribute('style', originalStyle);
      setIsDownloading(false);
    }
  };

  // Recalculate whenever parameters change during Step 2
  useEffect(() => {
    if (step === 2 && inputs.amount) {
      setResult(calculateAllocation(inputs, rates, exclusions));
    }
  }, [rates, exclusions, step]);

  return (
    <div className="min-h-screen pb-20 print:bg-white print:pb-0">
      
      {/* Header */}
      <div className="bg-slate-950 text-white shadow-xl sticky top-0 z-50 no-print border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <StylishTickLogo size={24} />
            <div className="flex flex-col">
              <h1 className="text-base font-black tracking-tight leading-none uppercase">Invest Right</h1>
              <p className="text-amber-500/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Strategic Wealth</p>
            </div>
          </div>
          
          {step === 2 && (
            <button 
              onClick={resetPlan} 
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all text-white flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-white/10"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10 print:p-0 print:max-w-none">
        
        {/* Step 1: Input Form */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-6 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500"></div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-xl shadow-xl border border-amber-500/20">
                <ShieldCheck className="h-6 w-6 text-amber-500" />
              </div>
              Portfolio Configuration
            </h2>

            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Investor Age</label>
                  <input type="number" name="age" value={inputs.age} onChange={handleInputChange}
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-black text-2xl text-slate-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Horizon (Years)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="horizon" 
                      value={inputs.horizon} 
                      onChange={handleInputChange} 
                      readOnly={isSipLocked}
                      className={`w-full p-5 border rounded-2xl outline-none transition-all font-black text-2xl ${
                        isSipLocked 
                          ? 'bg-slate-100 text-slate-400 border-slate-100' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
                      }`} 
                    />
                    {isSipLocked && <Lock className="w-5 h-5 text-slate-300 absolute right-5 top-1/2 -translate-y-1/2" />}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Investment (₹)</label>
                   {!isSipLocked ? (
                     <button onClick={() => setShowCalculator(true)}
                       className="text-[10px] text-amber-600 font-extrabold hover:text-amber-700 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                       <Calculator className="w-4 h-4" /> Use Goal Estimator
                     </button>
                   ) : (
                     <button onClick={handleUnlockSip}
                       className="text-[10px] text-red-500 font-extrabold hover:text-red-600 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                       <RefreshCw className="w-4 h-4" /> Unlock
                     </button>
                   )}
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    name="amount" 
                    value={inputs.amount} 
                    onChange={handleInputChange} 
                    readOnly={isSipLocked}
                    className={`w-full p-8 border rounded-2xl outline-none transition-all font-black text-4xl tracking-tighter ${
                      isSipLocked 
                        ? 'bg-slate-100 text-slate-400 border-slate-100' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500'
                    }`} 
                  />
                  {!isSipLocked && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg">INR</div>}
                </div>
                
                <div className="mt-8 flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Step-up (%)</label>
                    <input type="number" name="stepUp" value={inputs.stepUp} onChange={handleInputChange}
                      className="w-full bg-transparent border-none outline-none font-black text-slate-900 p-0 focus:ring-0 text-2xl" />
                  </div>
                  <span className="text-sm font-black text-slate-400">P.A.</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">Risk Tolerance</label>
                <div className="grid grid-cols-3 gap-5">
                  {(['Low', 'Medium', 'High'] as RiskLevel[]).map((level) => (
                    <button key={level} onClick={() => setInputs({...inputs, risk: level})}
                      className={`py-5 px-3 rounded-2xl border font-black uppercase tracking-[0.2em] transition-all text-xs ${
                        inputs.risk === level 
                          ? 'bg-slate-950 border-slate-950 text-amber-500 scale-[1.05] shadow-2xl' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-10">
                 <div className="flex items-center gap-3 text-[11px] font-bold text-slate-900 mb-6 uppercase tracking-[0.2em]">
                    <Sliders className="w-5 h-5 text-amber-600" /> 
                    Custom Constraints
                 </div>

                 <div className="space-y-4">
                    {(Object.keys(exclusions) as Array<keyof Exclusions>).map((key) => (
                      <label key={key} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all cursor-pointer ${exclusions[key] ? 'bg-red-50/40 border-red-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${exclusions[key] ? 'bg-red-500 border-red-500' : 'border-slate-300 bg-white'}`}>
                          {exclusions[key] && <CheckSquare className="w-4 h-4 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={exclusions[key]} onChange={() => toggleExclusion(key)} />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Exclude {key === 'usEquity' ? 'International Growth' : key === 'commodities' ? 'Precious Metals' : 'Fixed Income Assets'}
                        </span>
                      </label>
                    ))}
                 </div>
              </div>

              <button onClick={handleCalculate}
                className="w-full bg-slate-950 hover:bg-black text-amber-500 font-black py-6 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] uppercase text-sm tracking-[0.3em] border border-amber-500/20">
                Generate Strategy <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Analysis Report */}
        {step === 2 && result && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-600">
            <div id="report-content" className="space-y-12 bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-inner border border-slate-100">
              
              <ReportHeader inputs={inputs} />

              {/* Strategic Terminal Value - Dashboard Section */}
              <div className="dark-banner bg-black rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-amber-500/20">
                <div className="flex items-center justify-between text-amber-500 mb-10 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3 font-bold text-[11px] uppercase tracking-[0.3em]">
                    <BarChart3 className="w-5 h-5" /> Strategic Terminal Value
                  </div>
                  <button onClick={() => setShowRatesModal(true)} className="no-print p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-[11px] text-amber-500 flex items-center gap-2 font-black uppercase tracking-widest border border-amber-500/30">
                    <Settings2 className="w-4 h-4" /> Return Models
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Total Invested</div>
                    <div className="text-3xl font-black text-white tracking-tight">{formatCurrency(result!.projection.invested)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Market Returns</div>
                    <div className="text-3xl font-black text-emerald-500 tracking-tight">
                      +{formatCurrency(result.projection.value - result.projection.invested)}
                    </div>
                  </div>
                  <div>
                    <div className="text-amber-500/80 text-[10px] font-bold uppercase tracking-widest mb-4">Expected Corpus</div>
                    <div className="text-5xl font-black text-white tracking-tighter leading-none">{formatCurrency(result!.projection.value)}</div>
                  </div>
                </div>
                
                <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(result.projection.breakdown).map(([asset, data]) => {
                    const breakdown = data as ProjectionBreakdown;
                    return breakdown.invested > 0 && (
                      <div key={asset} className="bg-white/[0.08] p-6 rounded-2xl border border-white/5">
                        <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-3 flex items-center justify-between">
                          {asset} <span className="text-amber-500/70">{rates[asset as keyof ReturnRates]}%</span>
                        </div>
                        <div className="text-base font-black text-white">{formatCurrency(breakdown.invested + breakdown.returns)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-10 items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Model Efficiency</span>
                    <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/20">~{result.projection.weightedRate}% Weighted Return</span>
                  </div>
                  {parseFloat(inputs.stepUp) > 0 && (
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Escalation Factor</span>
                      <span className="text-sm font-black text-amber-500 bg-amber-500/10 px-5 py-2 rounded-xl border border-amber-500/20">{inputs.stepUp}% Annual Step-up</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Allocation Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AssetCard title="Equity" percent={result.percentages.equity} amount={result.amounts.equity} color="border-emerald-600" icon={TrendingUp} desc="Core Wealth Alpha" />
                <AssetCard title="Debt" percent={result.percentages.debt} amount={result.amounts.debt} color={exclusions.debt ? "border-slate-200 opacity-40" : "border-slate-800"} icon={Shield} desc={exclusions.debt ? "Excluded" : "Stability Buffer"} />
                <AssetCard title="Gold" percent={result.percentages.gold} amount={result.amounts.gold} color={exclusions.commodities ? "border-slate-200 opacity-40" : "border-amber-500"} icon={PieChart} desc={exclusions.commodities ? "Excluded" : "Inflation Hedge"} />
                <AssetCard title="Silver" percent={result.percentages.silver} amount={result.amounts.silver} color={exclusions.commodities ? "border-slate-200 opacity-40" : "border-slate-400"} icon={Coins} desc={exclusions.commodities ? "Excluded" : "Commodity Hedge"} />
              </div>

              {/* Sub-asset Splits */}
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
                      const amount = Math.round((result!.amounts.equity * pct) / 100);
                      return pct > 0 && <ProgressBar key={name} label={name} value={pct} amount={formatCurrency(amount)} colorClass={name.includes('US') ? 'bg-slate-950' : 'bg-emerald-600'} />
                    })}
                  </div>
                </div>
              )}

              {/* Thesis & Experts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-6 text-[11px] uppercase tracking-[0.3em] border-b border-slate-100 pb-4 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-amber-600" /> Investment Rationale
                  </h4>
                  <p className={`text-sm leading-relaxed font-medium ${exclusions.debt && parseInt(inputs.horizon) < 5 ? 'text-red-600' : 'text-slate-700'}`}>{result.rationale}</p>
                </div>
                <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-6 text-[11px] uppercase tracking-[0.3em] border-b border-slate-100 pb-4 flex items-center gap-3">
                    <Gem className="w-6 h-6 text-emerald-600" /> Professional Guidance
                  </h4>
                  <div className="text-[11px] text-slate-500 leading-relaxed font-bold italic">
                    We recommend diversified low-cost index funds for equity and Sovereign Gold Bonds (SGB) for metals. For debt, prioritize AAA-rated corporate bonds or liquid funds.
                  </div>
                </div>
              </div>

              {/* Professional Disclosure */}
              <div className="flex gap-8 p-10 border border-slate-100 bg-slate-50 rounded-[2rem]">
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                <div className="text-[11px] text-slate-500 leading-relaxed font-semibold uppercase tracking-wide">
                  <p><strong className="text-slate-900">Official Notice:</strong> This framework is based on modern portfolio theory. Real performance varies with market conditions. This is not SEBI-registered advice. Review all offer documents before investing.</p>
                </div>
              </div>
            </div>

            {/* Post-Analysis Actions */}
            <div className="no-print space-y-6 pt-16">
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-6 rounded-2xl transition-all text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-200 shadow-sm">
                  <Settings2 className="w-5 h-5" /> Refine Parameters
                </button>
                <button onClick={resetPlan}
                  className="bg-white hover:bg-slate-50 text-slate-500 font-black py-6 rounded-2xl border border-slate-200 transition-all text-[12px] uppercase tracking-widest flex items-center justify-center gap-3">
                  <PlusCircle className="w-5 h-5" /> New Analysis
                </button>
              </div>
              
              <button 
                onClick={handleDownloadPdf} 
                disabled={isDownloading}
                className="w-full bg-slate-950 hover:bg-black text-amber-500 font-black py-7 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-[0.99] uppercase text-sm tracking-[0.35em] border border-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-7 h-7 animate-spin" /> Finalizing Landscape Report...
                  </>
                ) : (
                  <>
                    <Download className="w-7 h-7" /> Export Landscape Strategy PDF
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 text-center font-black italic tracking-widest opacity-80">Full resolution strategy blueprint will download directly to your local storage.</p>
            </div>
          </div>
        )}
      </main>

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
