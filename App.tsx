
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Shield, AlertTriangle, PieChart, Target, ArrowRight,
  CheckCircle2, Calculator, RefreshCw, Home, Settings2, BarChart3,
  Sliders, FileText, CheckSquare, Coins, Lock, Printer, PlusCircle,
  Gem, Wallet, ArrowUp, Download, Sparkles, Loader2, Check, ShieldCheck
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
 * Premium "Invest Right" Logo
 * Just a stylish, professional standalone tick mark.
 */
const CompanyLogo: React.FC<{ size?: number; className?: string }> = ({ 
  size = 32,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Check 
        size={size} 
        className="text-amber-500 stroke-[3.5px] drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)] transition-transform hover:scale-110" 
      />
    </div>
  );
};

const PrintHeader: React.FC<{ inputs: UserInputs }> = ({ inputs }) => (
  <div className="flex flex-col border-b border-slate-200 pb-8 mb-10">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6">
        <CompanyLogo size={48} />
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Invest Right</h1>
          <p className="text-slate-400 text-[11px] mt-2 font-bold uppercase tracking-[0.25em]">FinWise Strategic Wealth Report</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5">Issue Date</div>
        <div className="text-slate-900 font-extrabold text-lg">{formatDate()}</div>
      </div>
    </div>
    
    <div className="mt-10 grid grid-cols-4 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-100">
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Investor Age</div>
        <div className="font-black text-slate-900 text-xl">{inputs.age} Years</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Horizon</div>
        <div className="font-black text-slate-900 text-xl">{inputs.horizon} Years</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Risk Profile</div>
        <div className="font-black text-slate-900 text-xl">{inputs.risk}</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Monthly SIP</div>
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
      alert("Please enter a valid monthly investment of at least ₹500");
      return;
    }
    const res = calculateAllocation(inputs, rates, exclusions);
    setResult(res);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Enhanced PDF Download Logic (Landscape Mode)
   * Fixes layout issues by using landscape orientation and optimized capture dimensions.
   */
  const handleDownloadPdf = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    setIsDownloading(true);

    // Optimized width for landscape A4 (approx 1.41 aspect ratio)
    const originalStyle = element.getAttribute('style') || '';
    element.style.width = '1280px'; 
    element.style.padding = '50px';
    element.style.backgroundColor = '#ffffff';

    const opt = {
      margin: 10,
      filename: `Invest_Right_Landscape_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false, 
        backgroundColor: '#ffffff',
        width: 1280,
        windowWidth: 1280
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      // Restore styles
      element.setAttribute('style', originalStyle);
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
            <CompanyLogo size={28} />
            <div className="flex flex-col">
              <h1 className="text-base font-black tracking-tight leading-none uppercase">Invest Right</h1>
              <p className="text-amber-500/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-90">Strategic Advisor</p>
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

      <main className="max-w-3xl mx-auto px-4 py-10 print:p-0 print:max-w-none">
        
        {/* Step 1: Configuration */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-500 opacity-80"></div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 rounded-xl shadow-lg border border-amber-500/20">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
              </div>
              Build Your Wealth Blueprint
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
                       <Calculator className="w-3.5 h-3.5" /> Goal Based SIP
                     </button>
                   ) : (
                     <button onClick={handleUnlockSip}
                       className="text-[10px] text-red-500 font-extrabold hover:text-red-600 flex items-center gap-1.5 uppercase tracking-wider">
                       <RefreshCw className="w-3.5 h-3.5" /> Unlock Input
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
                
                <div className="mt-6 flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Annual Step-up (%)</label>
                    <input type="number" name="stepUp" value={inputs.stepUp} onChange={handleInputChange} placeholder="0"
                      className="w-full bg-transparent border-none outline-none font-black text-slate-900 p-0 focus:ring-0 text-xl" />
                  </div>
                  <span className="text-sm font-black text-slate-300">PA</span>
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
                            Exclude {key === 'usEquity' ? 'International Growth' : key === 'commodities' ? 'Precious Metals' : 'Fixed Income Assets'}
                          </span>
                        </div>
                      </label>
                    ))}
                 </div>
              </div>

              <button onClick={handleCalculate}
                className="w-full bg-slate-950 hover:bg-black text-amber-500 font-bold py-5 rounded-xl shadow-2xl transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98] uppercase text-xs tracking-[0.2em] border border-amber-500/20">
                Generate Strategy <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Results Area (Wrapped in ID for PDF capture) */}
        {step === 2 && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div id="report-content" className="space-y-10 bg-white p-4 sm:p-10 rounded-3xl shadow-inner border border-slate-100">
              
              {/* Report Header for PDF */}
              <PrintHeader inputs={inputs} />

              {/* Summary Banner */}
              <div className="bg-slate-950 rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden group border border-amber-500/10">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <BarChart3 size={140} className="text-amber-500" />
                </div>

                <div className="flex items-center justify-between text-amber-500/80 mb-10 border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-[0.25em]">
                    <BarChart3 className="w-4 h-4" /> Comprehensive Wealth Forecast
                  </div>
                  <button onClick={() => setShowRatesModal(true)} className="no-print p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-[10px] text-amber-500 flex items-center gap-2 font-bold uppercase tracking-wider border border-amber-500/20">
                    <Settings2 className="w-3.5 h-3.5" /> Growth Models
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Principal Invested</div>
                    <div className="text-3xl font-black text-white tracking-tight">{formatCurrency(result!.projection.invested)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Portfolio Gains</div>
                    <div className="text-3xl font-black text-emerald-500 tracking-tight">
                      +{formatCurrency(result.projection.value - result.projection.invested)}
                    </div>
                  </div>
                  <div>
                    <div className="text-amber-500/80 text-[10px] font-bold uppercase tracking-widest mb-3">Terminal Corpus</div>
                    <div className="text-5xl font-black text-white tracking-tighter">{formatCurrency(result!.projection.value)}</div>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {Object.entries(result.projection.breakdown).map(([asset, data]) => {
                      const breakdownData = data as ProjectionBreakdown;
                      return breakdownData.invested > 0 && (
                        <div key={asset} className="bg-white/[0.04] p-5 rounded-2xl border border-white/5">
                          <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-3 flex items-center justify-between">
                            {asset} <span className="text-amber-500/60">{rates[asset as keyof ReturnRates]}%</span>
                          </div>
                          <div className="text-sm font-black text-white">{formatCurrency(breakdownData.invested + breakdownData.returns)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Weighted Yield</span>
                    <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-lg border border-emerald-500/20">~{result.projection.weightedRate}% PA</span>
                  </div>
                  {parseFloat(inputs.stepUp) > 0 && (
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth Engine</span>
                      <span className="text-[11px] font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-lg border border-amber-500/20">{inputs.stepUp}% Step-up</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Allocation Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AssetCard title="Equity" percent={result.percentages.equity} amount={result.amounts.equity} color="border-emerald-600" icon={TrendingUp} desc="Alpha & Growth" />
                <AssetCard title="Debt" percent={result.percentages.debt} amount={result.amounts.debt} color={exclusions.debt ? "border-slate-200 opacity-40" : "border-slate-800"} icon={Shield} desc={exclusions.debt ? "Excluded" : "Fixed Income"} />
                <AssetCard title="Gold" percent={result.percentages.gold} amount={result.amounts.gold} color={exclusions.commodities ? "border-slate-200 opacity-40" : "border-amber-500"} icon={PieChart} desc={exclusions.commodities ? "Excluded" : "Hedge Asset"} />
                <AssetCard title="Silver" percent={result.percentages.silver} amount={result.amounts.silver} color={exclusions.commodities ? "border-slate-200 opacity-40" : "border-slate-400"} icon={Coins} desc={exclusions.commodities ? "Excluded" : "Commodity"} />
              </div>

              {/* Detailed Equity Allocation */}
              {result.percentages.equity > 0 && (
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm">
                  <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-3 text-xs uppercase tracking-widest"><TrendingUp className="w-5 h-5 text-emerald-600" /> Equity Composition</h3>
                    <span className="text-[11px] font-black text-slate-600 border border-slate-200 px-4 py-2 rounded-xl uppercase tracking-wider bg-white">
                      {formatCurrency(result.amounts.equity)} / Month
                    </span>
                  </div>
                  <div className="p-10">
                    {(Object.entries(result.equitySplit) as [string, number][]).map(([name, pct]) => {
                      const catAmount = Math.round((result!.amounts.equity * pct) / 100);
                      return pct > 0 && <ProgressBar key={name} label={name} value={pct} amount={formatCurrency(catAmount)} colorClass={name.includes('US') ? 'bg-slate-950' : 'bg-emerald-600'} />
                    })}
                  </div>
                </div>
              )}

              {/* Logic & Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-6 text-[11px] uppercase tracking-[0.2em] border-b border-slate-50 pb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" /> Allocation Thesis
                  </h4>
                  <p className={`text-sm leading-relaxed font-medium ${exclusions.debt && parseInt(inputs.horizon) < 5 ? 'text-red-600' : 'text-slate-700'}`}>{result.rationale}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-6 text-[11px] uppercase tracking-[0.2em] border-b border-slate-50 pb-4 flex items-center gap-2">
                    <Gem className="w-5 h-5 text-emerald-600" /> Expert Guidance
                  </h4>
                  <div className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    This model utilizes modern portfolio theory. We prioritize Nifty 50 trackers and liquid debt funds for maximum capital efficiency.
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex gap-6 p-8 border border-slate-100 bg-slate-50 rounded-3xl">
                <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
                <div className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  <p><strong className="text-slate-900 uppercase tracking-wider">Invest Right Disclosure:</strong> This document represents a theoretical framework. Real-world performance depends on market volatility and tax regulations. Please consult an advisor before deploying funds.</p>
                </div>
              </div>
            </div>

            {/* Actions (Not in PDF) */}
            <div className="no-print space-y-5 pt-14">
              <div className="grid grid-cols-2 gap-5">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-5 rounded-2xl transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-200">
                  <Settings2 className="w-4 h-4" /> Refine Inputs
                </button>
                <button onClick={resetPlan}
                  className="bg-white hover:bg-slate-50 text-slate-600 font-bold py-5 rounded-2xl border border-slate-200 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> New Model
                </button>
              </div>
              
              <button 
                onClick={handleDownloadPdf} 
                disabled={isDownloading}
                className="w-full bg-slate-950 hover:bg-black text-amber-500 font-bold py-6 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-[0.99] uppercase text-xs tracking-[0.25em] border border-amber-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Finalizing Landscape Report...
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" /> Download Landscape PDF Report
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center font-bold italic tracking-wide">Report will download directly in high-resolution landscape orientation.</p>
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
