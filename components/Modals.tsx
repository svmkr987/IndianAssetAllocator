import React, { useState, useEffect } from 'react';
import { X, Calculator, Settings2, Save, Lock } from 'lucide-react';
import { formatCurrency } from '../utils';
import { ReturnRates } from '../types';

interface SipModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDuration: string;
  onApply: (amount: number) => void;
}

export const SipCalculatorModal: React.FC<SipModalProps> = ({ isOpen, onClose, initialDuration, onApply }) => {
  const [targetAmount, setTargetAmount] = useState('');
  const [returnRate, setReturnRate] = useState(12);
  const [calculatedSip, setCalculatedSip] = useState(0);

  useEffect(() => {
    const t = parseInt(targetAmount);
    const y = parseInt(initialDuration);
    const r = parseFloat(returnRate.toString());
    
    if (t > 0 && y > 0 && r > 0) {
      const i = r / 12 / 100;
      const n = y * 12;
      const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      setCalculatedSip(Math.round(t / factor));
    } else {
      setCalculatedSip(0);
    }
  }, [targetAmount, initialDuration, returnRate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-white/10">
        <div className="bg-slate-950 p-6 flex justify-between items-center border-b border-white/5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-3">
            <Calculator className="w-4 h-4" /> Wealth Goal Planner
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Goal (₹)</label>
            <input 
              type="number" 
              value={targetAmount} 
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="e.g. 50,00,000"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-xl text-slate-800" 
              autoFocus 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Years</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={initialDuration} 
                  readOnly 
                  className="w-full p-4 bg-slate-100 text-slate-400 border border-slate-100 rounded-xl font-bold" 
                />
                <Lock className="w-3 h-3 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rate (%)</label>
              <input 
                type="number" 
                value={returnRate} 
                onChange={(e) => setReturnRate(Number(e.target.value))} 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold" 
              />
            </div>
          </div>
          <div className="bg-slate-950 rounded-xl p-6 text-center border border-amber-500/10 shadow-xl">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Calculated Monthly Requirement</p>
            <p className="text-3xl font-black text-amber-500 tracking-tight">{calculatedSip > 0 ? formatCurrency(calculatedSip) : "₹0"}</p>
          </div>
          <button 
            disabled={calculatedSip <= 0} 
            onClick={() => onApply(calculatedSip)}
            className="w-full bg-slate-950 hover:bg-black disabled:bg-slate-200 text-amber-500 font-bold py-5 rounded-xl transition-all shadow-xl active:scale-[0.98] uppercase text-[11px] tracking-widest border border-amber-500/20"
          >
            Apply to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

interface RatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: ReturnRates;
  onSave: (rates: ReturnRates) => void;
}

export const RatesSettingsModal: React.FC<RatesModalProps> = ({ isOpen, onClose, rates, onSave }) => {
  const [localRates, setLocalRates] = useState<ReturnRates>(rates);
  useEffect(() => { setLocalRates(rates); }, [rates]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-white/10">
        <div className="bg-slate-950 p-6 flex justify-between items-center border-b border-white/5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-3">
            <Settings2 className="w-4 h-4" /> Expected Returns
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 space-y-6">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Adjust annual growth rates for model sensitivity.</p>
          {[
            { id: 'equity', label: 'Equity Allocation', color: 'text-emerald-600' },
            { id: 'debt', label: 'Fixed Income', color: 'text-slate-800' },
            { id: 'gold', label: 'Gold Bullion', color: 'text-amber-600' },
            { id: 'silver', label: 'Silver Assets', color: 'text-slate-500' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <label className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.label}</label>
              <div className="relative w-28">
                <input type="number" 
                  value={localRates[item.id as keyof ReturnRates]} 
                  onChange={(e) => setLocalRates({...localRates, [item.id]: Number(e.target.value)})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-right pr-10 outline-none focus:border-amber-500 font-bold" />
                <span className="absolute right-3 top-3 text-slate-300 text-xs">%</span>
              </div>
            </div>
          ))}
          <button onClick={() => { onSave(localRates); onClose(); }} className="w-full bg-slate-950 hover:bg-black text-amber-500 font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl uppercase text-[11px] tracking-widest border border-amber-500/20">
            <Save className="w-4 h-4" /> Update Strategy
          </button>
        </div>
      </div>
    </div>
  );
};