
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Shield, AlertTriangle, PieChart, Target, ArrowRight,
  CheckCircle2, Calculator, RefreshCw, Home, Settings2, BarChart3,
  Sliders, FileText, CheckSquare, Coins, Lock, Printer, PlusCircle,
  Gem, Wallet, ArrowUp, Download, Sparkles, Loader2
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
 * Premium FinWise "FW" Logo
 * Modern diamond-cut monogram.
 */
const CompanyLogo: React.FC<{ sizeClass?: string; textSize?: string }> = ({ 
  sizeClass = "w-10 h-10", 
  textSize = "text-[12px]" 
}) => {
  return (
    <div className={`${sizeClass} bg-slate-950 rounded-xl flex items-center justify-center border border-amber-500/40 shadow-xl shrink-0 relative overflow-hidden group transition-all`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
      <div className="absolute top-1 right-1">
        <Sparkles className="w-2 h-2 text-amber-500 opacity-50" />
      </div>
      <span className={`text-amber-500 font-black ${textSize} leading-none select-none tracking-tighter relative z-10`}>
        FW
      </span>
    </div>
  );
};

const PrintHeader: React.FC<{ inputs: UserInputs }> = ({ inputs }) => (
  <div className="flex flex-col border-b border-slate-200 pb-6 mb-8">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-5">
        <CompanyLogo sizeClass="w-14 h-14" textSize="text-lg" />
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Invest Right</h1>
          <p className="text-slate-400 text-[10px] mt-1.5 font-bold uppercase tracking-[0.2em]">FinWise Private Wealth Strategy</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Issue Date</div>
        <div className="text-slate-900 font-semibold">{formatDate()}</div>
      </div>
    </div>
    
    <div className="mt-8 grid grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Investor Age</div>
        <div className="font-bold text-slate-800 text-lg">{inputs.age} Years</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Horizon</div>
        <div className="font-bold text-slate-800 text-lg">{inputs.horizon} Years</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Risk Profile</div>
        <div className="font-bold text-slate-800 text-lg">{inputs.risk}</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Monthly SIP</div>
        <div className="font-bold text-slate-800 text-lg">{formatCurrency(parseInt(inputs.amount))}</div>
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
      alert("Please enter a valid monthly investment of at least ₹500");
      return;
    }
    const res = calculateAllocation(inputs, rates, exclusions);
    setResult(res);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Direct PDF Download Implementation
   * Uses html2pdf library injected via index.html
   */
  const handleDownloadPdf = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsDownloading(true);

    const opt = {
      margin: 10,
      filename: `FinWise_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Something went wrong during PDF generation. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && inputs.amount) {
      setResult(calculateAllocation(inputs, rates, exclusions));
    }
  }, [rates, exclusions, step]);

  return (
    <div className="min-h-screen pb-20 print:bg-white print:pb-0">
      
      {/* Header */}
      <div className="bg-slate-950 text-white shadow-xl sticky top-0 z-50 no-print border-b border-amber-500/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <CompanyLogo />
            <div className="flex flex-col">
              <h1 className="text-base font-bold tracking-tight leading-none uppercase">Invest Right</h1>
              <p className="text-amber-500/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-80">FinWise Wealth</p>
            </div>
          </div>
          
          {step === 2 && (
            <button 
              onClick={resetPlan} 
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all text-white flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-white/10"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Plan</span>
            </button>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 print:p-0 print:max-w-none">
        
        {/* Step 1: Configuration */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500 opacity-80"></div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Target className="h-5 w-5 text-amber-500" />
              </div>
              Portfolio Construction
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Your Age</label>
                  <input type="number" name="age" value={inputs.age} onChange={handleInputChange} placeholder="30"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-xl text-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Time Horizon (Years)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="horizon" 
                      value={inputs.horizon} 
                      onChange={handleInputChange} 
                      placeholder="10"
                      readOnly={isSipLocked}
                      className={`w-full p-4 border rounded-xl outline-none transition-all font-bold text-xl ${
                        isSipLocked 
                          ? 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500'
                      }`} 
                    />
                    {isSipLocked && <Lock className="w-4 h-4 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2" />}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Commitment (₹)</label>
                   {!isSipLocked ? (
                     <button onClick={() => setShowCalculator(true)}
                       className="text-[10px] text-amber-600 font-extrabold hover:text-amber-700 flex items-center gap-1.5 uppercase tracking-wider">
                       <Calculator className="w-3.5 h-3.5" /> SIP Estimator
                     </button>
                   ) : (
                     <button onClick={handleUnlockSip}
                       className="text-[10px] text-red-500 font-extrabold hover:text-red-600 flex items-center gap-1.5 uppercase tracking-wider">
                       <RefreshCw className="w-3.5 h-3.5" /> Reset
                     </button>
                   )}
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    name="amount" 
                    value={inputs.amount} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 10000"
                    readOnly={isSipLocked}
                    className={`w-full p-6 border rounded-xl outline-none transition-all font-black text-3xl tracking-tight ${
                      isSipLocked 
                        ? 'bg-slate-100 text-slate-400 border-slate-100' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500'
                    }`} 
                  />
                  {!isSipLocked && <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-medium">INR</div>}
                </div>
                
                <div className="mt-6 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Annual Step-up (%)</label>
                    <input type="number" name="stepUp" value={inputs.stepUp} onChange={handleInputChange} placeholder="0"
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-800 p-0 focus:ring-0 text-lg" />
                  </div>
                  <span className="text-sm font-black text-slate-300">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Tolerance</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['Low', 'Medium', 'High'] as RiskLevel[]).map((level) => (
                    <button key={level} onClick={() => setInputs({...inputs, risk: level})}
                      className={`py-4 px-2 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm ${
                        inputs.risk === level 
                          ? 'bg-slate-950 border-slate-950 text-amber-500 scale-[1.03] shadow-lg' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-900 mb-5 uppercase tracking-widest">
                    <Sliders className="w-4 h-4 text-amber-600" /> 
                    Strategy Constraints
                 </div>

                 <div className="space-y-3">
                    {(Object.keys(exclusions) as Array<keyof Exclusions>).map((key) => (
                      <label key={key} className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${exclusions[key] ? 'bg-red-50/30 border-red-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${exclusions[key] ? 'bg-red-500 border-red-500' : 'border-slate-300 bg-white'}`}>
                          {exclusions[key] && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={exclusions[key]} onChange={() => toggleExclusion(key)} />
                        <div>
                          <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                            Exclude {key === 'usEquity' ? 'International Equity' : key === 'commodities' ? 'Precious Metals' : 'Debt Assets'}
                          </span>
                        </div>
                      </label>
                    ))}
                 </div>
              </div>

              <button onClick={handleCalculate}
                className="w-full bg-slate-950 hover:bg-black text-amber-500 font-bold py-5 rounded-xl shadow-2xl transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98] uppercase text-xs tracking-[0.2em] border border-amber-500/20">
                Build My Strategy <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Results Area (Wrapped in ID for PDF capture) */}
        {step === 2 && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div id="report-content" className="space-y-8 bg-[#fcfcfd] p-0">
              
              {/* For PDF export, we show a clean header if not in browser print mode */}
              <div className="bg-white p-0 rounded-2xl">
                <PrintHeader inputs={inputs} />
              </div>

              {/* Summary Banner */}
              <div className="bg-slate-950 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group border border-amber-500/10 print:bg-white print:text-slate-950 print:border print:border-slate-200">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <BarChart3 size={120} className="text-amber-500" />
                </div>

                <div className="flex items-center justify-between text-amber-500/80 mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <BarChart3 className="w-4 h-4" /> Strategic Wealth Projection
                  </div>
                  <button onClick={() => setShowRatesModal(true)} className="no-print p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-[10px] text-amber-500 flex items-center gap-2 font-bold uppercase tracking-wider border border-amber-500/20">
                    <Settings2 className="w-3.5 h-3.5" /> Return Models
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative z-10">
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Cumulative Capital</div>
                    <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(result!.projection.invested)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Yield</div>
                    <div className="text-2xl font-bold text-emerald-500 tracking-tight">
                      +{formatCurrency(result.projection.value - result.projection.invested)}
                    </div>
                  </div>
                  <div>
                    <div className="text-amber-500/80 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Corpus</div>
                    <div className="text-4xl font-black text-white tracking-tighter">{formatCurrency(result!.projection.value)}</div>
                  </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-white/5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(result.projection.breakdown).map(([asset, data]) => {
                      const breakdownData = data as ProjectionBreakdown;
                      return breakdownData.invested > 0 && (
                        <div key={asset} className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                          <div className="font-bold text-slate-300 text-[10px] uppercase tracking-wider mb-2 flex items-center justify-between">
                            {asset} <span className="text-amber-500/50">{rates[asset as keyof ReturnRates]}%</span>
                          </div>
                          <div className="text-xs font-bold text-white">{formatCurrency(breakdownData.invested + breakdownData.returns)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weighted Efficiency</span>
                    <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">~{result.projection.weightedRate}% Annually</span>
                  </div>
                  {parseFloat(inputs.stepUp) > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Step-up Engine</span>
                      <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">{inputs.stepUp}% P.A.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Allocation Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 print-break-inside-avoid">
                <AssetCard title="Equity" percent={result.percentages.equity} amount={result.amounts.equity} color="border-emerald-600" icon={TrendingUp} desc="Growth & Wealth" />
                <AssetCard title="Debt" percent={result.percentages.debt} amount={result.amounts.debt} color={exclusions.debt ? "border-slate-200 opacity-40" : "border-slate-800"} icon={Shield} desc={exclusions.debt ? "Excluded" : "Safety & Buffer"} />
                <AssetCard title="Gold" percent={result.percentages.gold} amount={result.amounts.gold} color={exclusions.commodities ? "border-slate-200 opacity-40" : "border-amber-500"} icon={PieChart} desc={exclusions.commodities ? "Excluded" : "Value Store"} />
                <AssetCard title="Silver" percent={result.percentages.silver} amount={result.amounts.silver} color={exclusions.commodities ? "border-slate-200 opacity-40" : "border-slate-400"} icon={Coins} desc={exclusions.commodities ? "Excluded" : "Commodity Hedge"} />
              </div>

              {/* Detailed Equity Allocation */}
              {result.percentages.equity > 0 && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 print-break-inside-avoid">
                  <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-3 text-xs uppercase tracking-widest"><TrendingUp className="w-4 h-4 text-emerald-600" /> Equity Components</h3>
                    <span className="text-[10px] font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      {formatCurrency(result.amounts.equity)} Monthly
                    </span>
                  </div>
                  <div className="p-8">
                    {(Object.entries(result.equitySplit) as [string, number][]).map(([name, pct]) => {
                      const catAmount = Math.round((result!.amounts.equity * pct) / 100);
                      return pct > 0 && <ProgressBar key={name} label={name} value={pct} amount={formatCurrency(catAmount)} colorClass={name.includes('US') ? 'bg-slate-900' : 'bg-emerald-600'} />
                    })}
                  </div>
                </div>
              )}

              {/* Logic & Disclaimers in PDF too */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-break-inside-avoid">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-5 text-[10px] uppercase tracking-[0.2em] border-b border-slate-50 pb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" /> Strategic Logic
                  </h4>
                  <p className={`text-xs leading-relaxed font-medium ${exclusions.debt && parseInt(inputs.horizon) < 5 ? 'text-red-600' : 'text-slate-600'}`}>{result.rationale}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-5 text-[10px] uppercase tracking-[0.2em] border-b border-slate-50 pb-3 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-emerald-600" /> Asset Selection
                  </h4>
                  <div className="text-[10px] text-slate-500 leading-relaxed">
                    Based on market conditions, we recommend utilizing high-efficiency index funds for equity and sovereign bonds for debt components.
                  </div>
                </div>
              </div>

              {/* Footer Disclaimer (Always visible in Report Area) */}
              <div className="flex gap-5 p-6 border border-slate-100 bg-slate-50 rounded-2xl print-break-inside-avoid">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  <p><strong className="text-slate-900 uppercase tracking-wider">Professional Disclosure:</strong> This document is generated for informational planning only. Investment portfolios should be reviewed periodically with a FinWise expert.</p>
                </div>
              </div>
            </div>

            {/* Actions (Excluded from PDF via no-print and ID selection) */}
            <div className="no-print space-y-4 pt-12">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Settings2 className="w-4 h-4" /> Edit Inputs
                </button>
                <button onClick={resetPlan}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-bold py-4 rounded-xl border border-amber-500/20 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> New Plan
                </button>
              </div>
              
              <button 
                onClick={handleDownloadPdf} 
                disabled={isDownloading}
                className="w-full bg-slate-950 hover:bg-black text-amber-500 font-bold py-5 rounded-xl transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.99] uppercase text-xs tracking-[0.2em] border border-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Download Report as PDF
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center font-medium italic">Your personalized wealth blueprint will download directly to your device.</p>
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
