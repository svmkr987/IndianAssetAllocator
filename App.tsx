
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Shield, AlertTriangle, PieChart, Target, ArrowRight,
  CheckCircle2, Calculator, RefreshCw, Home, Settings2, BarChart3,
  Sliders, FileText, CheckSquare, Coins, Lock, Printer, PlusCircle,
  Gem, Wallet, ArrowUp
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
 * Simplified Branded Logo Component
 * Focuses purely on the 'MKR' identity as requested.
 */
const CompanyLogo: React.FC<{ sizeClass?: string; textSize?: string }> = ({ 
  sizeClass = "w-10 h-10", 
  textSize = "text-xs" 
}) => {
  return (
    <div className={`${sizeClass} bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-sm shrink-0 relative group transition-all`}>
      <span className={`text-indigo-700 font-black ${textSize} leading-none select-none tracking-tighter uppercase`}>
        MKR
      </span>
    </div>
  );
};

const PrintHeader: React.FC<{ inputs: UserInputs }> = ({ inputs }) => (
  <div className="hidden print:flex flex-col border-b-2 border-slate-800 pb-4 mb-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <CompanyLogo sizeClass="w-16 h-16" textSize="text-2xl" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-none">Invest Right by MKR FinWise</h1>
          <p className="text-slate-500 text-sm mt-1 font-semibold">Financial Strategy Report</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Report Date</div>
        <div className="text-slate-900 font-bold">{formatDate()}</div>
      </div>
    </div>
    
    <div className="mt-6 grid grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
      <div>
        <div className="text-xs text-slate-500 uppercase font-semibold">Age</div>
        <div className="font-bold text-slate-800 text-lg">{inputs.age} Yrs</div>
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase font-semibold">Horizon</div>
        <div className="font-bold text-slate-800 text-lg">{inputs.horizon} Years</div>
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase font-semibold">Risk</div>
        <div className="font-bold text-slate-800 text-lg">{inputs.risk}</div>
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase font-semibold">SIP Amount</div>
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

  const handleDownloadPdf = () => {
    try {
      const originalTitle = document.title;
      const cleanDate = new Date().toISOString().split('T')[0];
      document.title = `Invest_Right_Strategy_${cleanDate}`;
      
      requestAnimationFrame(() => {
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
        }, 2000);
      });
    } catch (error) {
      console.error("Print dialog failed", error);
      alert("Could not open print dialog automatically. Please press Ctrl+P (or Cmd+P) and select 'Save as PDF' from the destination list.");
    }
  };

  useEffect(() => {
    if (step === 2 && inputs.amount) {
      setResult(calculateAllocation(inputs, rates, exclusions));
    }
  }, [rates, exclusions, step]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10 print:bg-white print:pb-0">
      
      {/* Header */}
      <div className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50 no-print">
        <div className="max-w-3xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CompanyLogo />
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">Invest Right</h1>
              <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">by MKR FinWise</p>
            </div>
          </div>
          
          {step === 2 && (
            <button 
              onClick={resetPlan} 
              className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-all text-white flex items-center gap-1.5 text-xs font-bold shadow-inner border border-indigo-500/50"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Plan</span>
            </button>
          )}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
        
        {step === 2 && <PrintHeader inputs={inputs} />}

        {/* Step 1: Configuration */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Target className="h-5 w-5 text-indigo-600" />
              Configure Your Plan
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">My Age</label>
                  <input type="number" name="age" value={inputs.age} onChange={handleInputChange} placeholder="30"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Years)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="horizon" 
                      value={inputs.horizon} 
                      onChange={handleInputChange} 
                      placeholder="10"
                      readOnly={isSipLocked}
                      className={`w-full p-3 border rounded-lg outline-none transition-all font-semibold text-lg ${
                        isSipLocked 
                          ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-indigo-500'
                      }`} 
                    />
                    {isSipLocked && <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly SIP Amount (₹)</label>
                   {!isSipLocked ? (
                     <button onClick={() => setShowCalculator(true)}
                       className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded transition-colors border border-indigo-100">
                       <Calculator className="w-3 h-3" /> Don't know? Calculate
                     </button>
                   ) : (
                     <button onClick={handleUnlockSip}
                       className="text-xs text-red-500 font-bold hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded transition-colors border border-red-100">
                       <RefreshCw className="w-3 h-3" /> Reset
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
                    className={`w-full p-4 border rounded-lg outline-none transition-all font-bold text-2xl ${
                      isSipLocked 
                        ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' 
                        : 'bg-slate-50 border-slate-200 text-indigo-900 focus:ring-2 focus:ring-indigo-500'
                    }`} 
                  />
                  {isSipLocked && <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />}
                </div>
                
                <div className="mt-4 flex items-center gap-3 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Annual Step-up (%)</label>
                    <input type="number" name="stepUp" value={inputs.stepUp} onChange={handleInputChange} placeholder="0"
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-700 p-0 focus:ring-0" />
                  </div>
                  <span className="text-sm font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Risk Tolerance</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low', 'Medium', 'High'] as RiskLevel[]).map((level) => (
                    <button key={level} onClick={() => setInputs({...inputs, risk: level})}
                      className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 shadow-sm ${
                        inputs.risk === level 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 transform scale-[1.02]' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}>
                      {level}
                      {inputs.risk === level && <CheckCircle2 className="w-3 h-3 text-indigo-200" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                 <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 mb-4 uppercase tracking-wide">
                    <Sliders className="w-4 h-4" /> 
                    Advanced Customization
                 </div>

                 <div className="grid grid-cols-1 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Check to exclude asset from strategy</div>
                    
                    {(Object.keys(exclusions) as Array<keyof Exclusions>).map((key) => (
                      <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-red-300 transition-all active:scale-[0.99]">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${exclusions[key] ? 'bg-red-500 border-red-500' : 'border-slate-300 bg-white'}`}>
                          {exclusions[key] && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={exclusions[key]} onChange={() => toggleExclusion(key)} />
                        <div>
                          <span className="block text-sm font-bold text-slate-700 capitalize">
                            {key === 'usEquity' ? 'US / International Stocks' : key === 'commodities' ? 'Gold & Silver' : 'Debt Funds'}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-medium">
                            {key === 'debt' ? 'Removes safety (Increases volatility)' : key === 'commodities' ? 'Removes hedge against inflation' : 'Geographical focus on Indian markets only'}
                          </span>
                        </div>
                      </label>
                    ))}
                 </div>
              </div>

              <button onClick={handleCalculate}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.98]">
                View Strategy <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Results */}
        {step === 2 && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden group print:bg-none print:bg-white print:text-slate-900 print:shadow-none print:border print:border-slate-800 print:p-4">
              <div className="flex items-center justify-between text-indigo-300 print:text-indigo-800 mb-4 border-b border-slate-700/50 pb-3">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                  <BarChart3 className="w-4 h-4" /> Projected Wealth
                </div>
                <button onClick={() => setShowRatesModal(true)} className="no-print p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-xs text-white flex items-center gap-1 font-semibold">
                  <Settings2 className="w-3 h-3" /> Edit Returns
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                <div>
                   <div className="text-slate-400 print:text-slate-500 text-[10px] font-bold uppercase mb-1">Total Investment</div>
                   <div className="text-xl font-bold text-slate-200 print:text-slate-700 break-words">{formatCurrency(result!.projection.invested)}</div>
                </div>
                <div>
                   <div className="text-slate-400 print:text-slate-500 text-[10px] font-bold uppercase mb-1">Estimated Gains</div>
                   <div className="text-xl font-bold text-emerald-400 print:text-emerald-700 break-words">
                     {formatCurrency((result as AllocationResult).projection.value - (result as AllocationResult).projection.invested)}
                   </div>
                </div>
                <div>
                  <div className="text-indigo-300 print:text-slate-500 text-[10px] font-bold uppercase mb-1">Total Corpus ({inputs.horizon} yrs)</div>
                  <div className="text-3xl font-extrabold text-white print:text-slate-900 tracking-tight break-words">{formatCurrency(result!.projection.value)}</div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-700/50 print:border-slate-200">
                <div className="text-[10px] text-slate-400 print:text-slate-500 uppercase tracking-widest mb-3 font-bold">Asset Class Performance Breakdown</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                   {Object.entries(result.projection.breakdown).map(([asset, data]) => {
                     const breakdownData = data as ProjectionBreakdown;
                     return breakdownData.invested > 0 && (
                      <div key={asset} className="bg-slate-800/40 print:bg-slate-50 p-2 rounded-lg border border-slate-700/50 print:border-slate-200 backdrop-blur-sm">
                         <div className="font-bold text-slate-200 print:text-slate-800 mb-1 capitalize flex items-center gap-1">
                           {asset} <span className="text-[9px] opacity-50 font-medium">({rates[asset as keyof ReturnRates]}%)</span>
                         </div>
                         <div className="flex justify-between text-[9px] text-slate-400 print:text-slate-500 font-medium">
                            <span>Inv:</span> <span>{formatCurrency(breakdownData.invested)}</span>
                         </div>
                         <div className={`flex justify-between text-[9px] font-bold mt-0.5 ${asset === 'equity' ? 'text-emerald-400' : asset === 'debt' ? 'text-blue-400' : 'text-yellow-400'}`}>
                            <span>Ret:</span> <span>{formatCurrency(breakdownData.returns)}</span>
                         </div>
                      </div>
                     );
                   })}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700/50 print:border-slate-200 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Weighted Portfolio Return:</span>
                  <span className="text-emerald-400 print:text-emerald-700 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">~{result.projection.weightedRate}%</span>
                </div>
                {parseFloat(inputs.stepUp) > 0 && (
                   <div className="flex items-center gap-2">
                     <span className="text-slate-400">Step-up:</span>
                     <span className="text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/20">{inputs.stepUp}% Annually</span>
                   </div>
                )}
              </div>
            </div>

            {/* Main Allocation Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print-break-inside-avoid">
              <AssetCard title="Equity" percent={result.percentages.equity} amount={result.amounts.equity} color="border-emerald-500" icon={TrendingUp} desc="Growth & Wealth" />
              <AssetCard title="Debt" percent={result.percentages.debt} amount={result.amounts.debt} color={exclusions.debt ? "border-slate-200 opacity-50" : "border-blue-500"} icon={Shield} desc={exclusions.debt ? "Excluded" : "Safety & Stability"} />
              <AssetCard title="Gold" percent={result.percentages.gold} amount={result.amounts.gold} color={exclusions.commodities ? "border-slate-200 opacity-50" : "border-yellow-500"} icon={PieChart} desc={exclusions.commodities ? "Excluded" : "Inflation Hedge"} />
              <AssetCard title="Silver" percent={result.percentages.silver} amount={result.amounts.silver} color={exclusions.commodities ? "border-slate-200 opacity-50" : "border-slate-400"} icon={Coins} desc={exclusions.commodities ? "Excluded" : "Industrial Metal"} />
            </div>

            {/* Detailed Equity Allocation */}
            {result.percentages.equity > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 print:shadow-none print-break-inside-avoid">
                <div className="bg-emerald-50/50 p-4 border-b border-emerald-100 flex justify-between items-center print:bg-white print:border-b print:border-slate-200">
                  <h3 className="font-bold text-emerald-900 print:text-slate-900 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Equity Sub-Categories</h3>
                  <span className="text-xs font-bold bg-emerald-100 print:bg-slate-100 text-emerald-800 print:text-slate-800 px-3 py-1 rounded-full border border-emerald-200">
                    {formatCurrency(result.amounts.equity)} Monthly
                  </span>
                </div>
                <div className="p-6">
                  {(Object.entries(result.equitySplit) as [string, number][]).map(([name, pct]) => {
                     const catAmount = Math.round((result!.amounts.equity * pct) / 100);
                     return pct > 0 && <ProgressBar key={name} label={name} value={pct} amount={formatCurrency(catAmount)} colorClass={name.includes('US') ? 'bg-indigo-600' : 'bg-emerald-600'} />
                  })}
                </div>
              </div>
            )}

            {/* Product Recommendations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4 print-break-inside-avoid">
              {!exclusions.debt && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 print:border shadow-sm h-full">
                  <h4 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-widest border-b border-slate-50 pb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" /> Debt Strategy
                  </h4>
                  <div className="text-blue-800 font-bold bg-blue-50/80 print:bg-white print:text-slate-800 print:border print:border-slate-200 p-4 rounded-xl text-sm border border-blue-100">
                    {parseInt(inputs.horizon) < 3 ? 'Liquid Funds / Overnight Funds' : 'Short Duration / Corporate Bond Funds'}
                    <p className="text-[10px] text-blue-600 mt-1 font-medium opacity-70">Suggested for capital preservation</p>
                  </div>
                </div>
              )}
              { !exclusions.commodities && ((result as AllocationResult).percentages.gold > 0 || (result as AllocationResult).percentages.silver > 0) && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 print:border shadow-sm h-full">
                  <h4 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-widest border-b border-slate-50 pb-2 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-yellow-500" /> Precious Metals
                  </h4>
                  <ul className="text-sm space-y-3">
                    {result!.percentages.gold > 0 && (
                      <li className="flex justify-between items-center border-b border-dashed border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Gold Component</span>
                        <span className="text-yellow-700 font-bold bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">SGB / Gold ETFs</span>
                      </li>
                    )}
                    {result!.percentages.silver > 0 && (
                      <li className="flex justify-between items-center pt-1">
                        <span className="text-slate-500 font-medium">Silver Component</span>
                        <span className="text-slate-700 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">Silver ETFs / FoFs</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Rationale Note */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 print:shadow-none print:border print-break-inside-avoid">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-widest"><FileText className="w-4 h-4 text-indigo-500"/> Strategy Rationale</h3>
              <p className={`text-sm leading-relaxed ${exclusions.debt && parseInt(inputs.horizon) < 5 ? 'text-red-600 font-bold' : 'text-slate-600 font-medium'}`}>{result.rationale}</p>
            </div>

            <div className="no-print space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2">
                  <Settings2 className="w-5 h-5" /> Adjust Parameters
                </button>
                <button onClick={resetPlan}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-4 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2">
                  <PlusCircle className="w-5 h-5" /> Start New Plan
                </button>
              </div>
              
              <button 
                onClick={handleDownloadPdf} 
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" /> Save as PDF / Print Report
              </button>
              <p className="text-[10px] text-slate-400 text-center font-medium italic">Tip: When the print dialog opens, select "Save as PDF" as the Destination.</p>
            </div>

            {/* Disclaimer */}
            <div className="flex gap-4 p-5 border border-red-100 bg-red-50/50 rounded-2xl print:bg-white print:border-slate-200 print:mt-6 print-break-inside-avoid">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 print:text-slate-400" />
              <div className="text-[11px] text-red-800/80 print:text-slate-400 leading-relaxed font-medium">
                <p><strong className="text-red-900 print:text-slate-700">Financial Disclaimer:</strong> This tool provides generic asset allocation models based on historical trends and rule-of-thumb methodologies. It is for educational purposes only and does not constitute SEBI registered investment advice.</p>
                <p className="mt-2 font-bold italic">*Mutual Fund investments are subject to market risks, read all scheme related documents carefully before investing.</p>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Modals */}
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
