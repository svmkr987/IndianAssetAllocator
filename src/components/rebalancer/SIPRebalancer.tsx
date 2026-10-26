import React, { useState, useEffect } from 'react';
import { PortfolioProfile, PortfolioHoldings, AssetAllocation, RebalanceResult } from '../../types/rebalancer';
import { calculateTargets, calculateRebalance } from '../../utils/rebalancerUtils';
import { Calculator, ArrowRight, TrendingUp, AlertCircle, Users } from 'lucide-react';

export default function SIPRebalancer({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState<PortfolioProfile>({ age: 30, horizon: 10, riskTolerance: 2, monthlySIP: 50000 });
  const [holdings, setHoldings] = useState<PortfolioHoldings>({ largeCap: 500000, midCap: 300000, smallCap: 200000, usEquities: 100000, commodities: 100000 });
  const [results, setResults] = useState<RebalanceResult[]>([]);
  const [targets, setTargets] = useState<AssetAllocation>({ largeCap: 0, midCap: 0, smallCap: 0, usEquities: 0, commodities: 0 });
  const [overrides, setOverrides] = useState<Partial<AssetAllocation>>({});
  const [allocationMode, setAllocationMode] = useState<'automated' | 'manual'>('automated');
  const [showResults, setShowResults] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const updateCounter = async () => {
      try {
        const response = await fetch('https://api.counterapi.dev/v1/mkrfinwise/rebalancer-v1/up');
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

  useEffect(() => {
    const newTargets = calculateTargets(profile);
    setTargets(newTargets);
  }, [profile]);

  useEffect(() => {
    let effectiveTargets;
    if (allocationMode === 'automated') {
      effectiveTargets = targets;
    } else {
      // Treat undefined overrides as 0 for manual mode calculations
      const manualTargets: AssetAllocation = {
        largeCap: overrides.largeCap ?? 0,
        midCap: overrides.midCap ?? 0,
        smallCap: overrides.smallCap ?? 0,
        usEquities: overrides.usEquities ?? 0,
        commodities: overrides.commodities ?? 0,
      };
      effectiveTargets = manualTargets;
    }
    setResults(calculateRebalance(profile, holdings, effectiveTargets as AssetAllocation));
  }, [profile, holdings, targets, overrides, allocationMode]);

  const totalCurrent = Object.values(holdings).reduce((a, b) => a + b, 0);
  const totalTarget = totalCurrent + (profile.monthlySIP * 12);
  const displayCount = (visitorCount !== null ? visitorCount + 1000 : 1000);

  return (
    <div className="min-h-screen bg-midnight text-bluegrey selection:bg-champagne/20 pt-0 pb-32">
      <div className="bg-midnight text-warm shadow-sm sticky top-0 z-50 no-print border-b border-slatenavy mb-8">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-2 bg-deep rounded-xl border border-slatenavy shadow-sm">
              <Calculator size={24} className="text-champagne stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-black tracking-tight leading-none uppercase text-warm">Portfolio Refiner</h1>
              <p className="text-champagne text-[10px] font-bold uppercase tracking-[0.2em] mt-1">by MKR FinWise</p>
            </div>
          </div>
          
          <button 
            onClick={onBack}
            className="bg-deep hover:bg-slate-800 px-4 py-2 rounded-lg transition-all text-champagne flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-slatenavy"
          >
            Home
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-4xl font-black text-warm mb-10 flex items-center gap-4">
          <div className="p-3 bg-deep rounded-2xl border border-slatenavy">
            <Calculator className="w-8 h-8 text-champagne" />
          </div>
          Portfolio Refiner
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
           {/* Profile Inputs */}
           <div className="bg-deep rounded-3xl border border-slatenavy p-8">
             <h2 className="text-lg font-bold text-warm mb-6 uppercase tracking-wider">Profile Inputs</h2>
             <div className="space-y-4">
               {['age', 'horizon', 'monthlySIP'].map((field) => (
                 <div key={field}>
                   <label className="block text-[10px] text-bluegrey font-bold uppercase tracking-[0.2em] mb-2">{field}</label>
                   <input 
                    type="number" 
                    value={profile[field as keyof PortfolioProfile]} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setProfile({...profile, [field]: val === '' ? '' : Number(val)});
                    }} 
                    className="w-full bg-midnight border border-slatenavy rounded-xl p-3 text-warm" 
                   />
                 </div>
               ))}
               <div>
                  <label className="block text-[10px] text-bluegrey font-bold uppercase tracking-[0.2em] mb-2">Risk Tolerance</label>
                  <select value={profile.riskTolerance} onChange={(e) => setProfile({...profile, riskTolerance: Number(e.target.value) as 1|2|3})} className="w-full bg-midnight border border-slatenavy rounded-xl p-3 text-warm">
                    <option value={1}>Low</option>
                    <option value={2}>Moderate</option>
                    <option value={3}>High</option>
                  </select>
               </div>
             </div>
           </div>

           {/* Current Holdings */}
           <div className="bg-deep rounded-3xl border border-slatenavy p-8">
             <h2 className="text-lg font-bold text-warm mb-6 uppercase tracking-wider">Current Holdings (₹)</h2>
             <div className="space-y-4">
               {Object.entries(holdings).map(([key, val]) => (
                 <div key={key}>
                   <label className="block text-[10px] text-bluegrey font-bold uppercase tracking-[0.2em] mb-2">{key}</label>
                   <input 
                    type="number" 
                    value={val} 
                    onChange={(e) => {
                      const v = e.target.value;
                      setHoldings({...holdings, [key]: v === '' ? '' : Number(v)});
                    }} 
                    className="w-full bg-midnight border border-slatenavy rounded-xl p-3 text-warm" 
                   />
                 </div>
               ))}
             </div>
           </div>
        </div>

        <button 
          onClick={() => setShowResults(true)}
          className="w-full bg-champagne hover:bg-bright text-slate-950 font-bold py-5 rounded-2xl mb-10 transition-colors flex items-center justify-center gap-3 text-lg uppercase tracking-[0.1em]"
        >
          Generate Strategy <ArrowRight className="w-5 h-5" />
        </button>

        {/* Results Screen */}
        {showResults && (
            <div className="fixed inset-0 bg-midnight z-[60] overflow-y-auto">
              <div className="bg-midnight text-warm shadow-sm sticky top-0 z-50 border-b border-slatenavy mb-8">
                <div className="w-full px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center p-2 bg-deep rounded-xl border border-slatenavy shadow-sm">
                      <Calculator size={24} className="text-champagne stroke-[2.5px]" />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-base font-black tracking-tight leading-none uppercase">Portfolio Refiner</h1>
                      <p className="text-champagne text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Generated by MKR FinWise</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowResults(false)}
                    className="bg-deep hover:bg-slate-800 px-4 py-2 rounded-lg transition-all text-bluegrey flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider border border-slatenavy"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-w-5xl mx-auto px-4 pb-32">
                <div className="bg-deep rounded-3xl border border-slatenavy p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          checked={allocationMode === 'automated'} 
                          onChange={() => {
                            setAllocationMode('automated');
                            setOverrides({});
                          }} 
                          className="text-champagne focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-bluegrey uppercase">Automated</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          checked={allocationMode === 'manual'} 
                          onChange={() => {
                            setAllocationMode('manual');
                            setOverrides({
                              largeCap: 30,
                              midCap: 25,
                              smallCap: 20,
                              usEquities: 15,
                              commodities: 10
                            });
                          }} 
                          className="text-champagne focus:ring-amber-500"
                        />
                        <span className="text-xs font-bold text-bluegrey uppercase">Manual</span>
                      </label>
                    </div>
                    {allocationMode === 'manual' && (
                      <button 
                        onClick={() => setOverrides({})}
                        className="text-xs font-bold text-champagne uppercase hover:text-bright"
                      >
                        Reset Overrides
                      </button>
                    )}
                  </div>
                  <table className="w-full text-left text-sm text-bluegrey mb-6">
                    <thead className="text-[10px] font-bold text-bluegrey uppercase tracking-widest">
                      <tr>
                        <th className="pb-4">Asset</th>
                        <th className="pb-4">Target %</th>
                        <th className="pb-4">Current ₹</th>
                        <th className="pb-4">Target 1Y ₹</th>
                        <th className="pb-4">Deficit ₹</th>
                        <th className="pb-4">Rec. SIP ₹</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {results.map(r => {
                        const key = (r.assetClass.toLowerCase().replace(' ', '') === 'largecap' ? 'largeCap' :
                                    r.assetClass.toLowerCase().replace(' ', '') === 'midcap' ? 'midCap' :
                                    r.assetClass.toLowerCase().replace(' ', '') === 'smallcap' ? 'smallCap' :
                                    r.assetClass.toLowerCase().replace(' ', '') === 'usequities' ? 'usEquities' : 'commodities') as keyof AssetAllocation;

                        return (
                        <tr key={r.assetClass} className={r.deficit === 0 ? 'opacity-60' : ''}>
                          <td className="py-4 font-bold text-warm">{r.assetClass}</td>
                          <td className="py-2">
                            {allocationMode === 'manual' ? (
                              <input 
                                type="text"
                                inputMode="decimal"
                                value={overrides[key] ?? ''}
                                placeholder="0"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '') {
                                    setOverrides({...overrides, [key]: undefined});
                                  } else if (/^\d*\.?\d*$/.test(val)) {
                                    setOverrides({...overrides, [key]: Number(val)});
                                  }
                                }}
                                className="w-16 bg-midnight border border-slatenavy rounded-lg p-1 text-sm font-bold text-champagne focus:outline-none focus:ring-1 focus:ring-amber-500"
                              />
                            ) : (
                              <span className="text-bluegrey">{r.targetPercent}%</span>
                            )}
                          </td>
                          <td className="py-4">₹{r.currentValue.toLocaleString()}</td>
                          <td className="py-4">₹{Math.round(r.projectedTargetValue).toLocaleString()}</td>
                          <td className="py-4 font-mono">{r.deficit > 0 ? `₹${Math.round(r.deficit).toLocaleString()}` : <span className="flex items-center gap-1 text-champagne"><AlertCircle className="w-3 h-3"/> Overweight</span>}</td>
                          <td className="py-4 font-black text-champagne">₹{r.recommendedSIP.toLocaleString()}</td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        )}

      </div>
      
      <footer className="no-print fixed bottom-0 left-0 right-0 bg-deep text-bluegrey border-t border-slatenavy py-6 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1 bg-midnight rounded-full border border-slatenavy mb-1">
            <Users className="w-3 h-3 text-champagne" />
            <span className="text-[9px] font-bold text-bluegrey uppercase tracking-[0.2em]">
              Trusted by {displayCount.toLocaleString()}+ Investors
            </span>
          </div>
          <p className="text-bluegrey text-[11px] italic font-medium tracking-wide opacity-90">
            "Not all Mutual Funds & ETFs are worth your money."
          </p>
          <p className="text-bluegrey text-[10px] font-medium tracking-wide">
            Find out which ones: <a href="https://wa.me/919008264816?text=Hi" target="_blank" rel="noopener noreferrer" className="text-champagne font-bold ml-1" >+91-9008264816</a> (Only Whatsapp). To learn Swing trading, click <a href="https://t.me/MKR_FinWise_Hub" target="_blank" rel="noopener noreferrer" className="text-champagne font-bold ml-1" >MKR FinWise Hub</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
