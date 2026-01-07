
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

  // Sync calculation whenever inputs or the external duration change
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
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm print:hidden">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-700 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2"><Calculator className="w-5 h-5" /> SIP Estimator</h3>
          <button onClick={onClose} className="hover:bg-indigo-600 p-1 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target Goal Amount (₹)</label>
            <input 
              type="number" 
              value={targetAmount} 
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="e.g. 50,00,000"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg text-slate-800" 
              autoFocus 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Years (From Home)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={initialDuration} 
                  readOnly 
                  className="w-full p-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg outline-none cursor-not-allowed font-semibold" 
                />
                <Lock className="w-3 h-3 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Exp. Return (%)</label>
              <input 
                type="number" 
                value={returnRate} 
                onChange={(e) => setReturnRate(Number(e.target.value))} 
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" 
              />
            </div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 text-center mt-2 border border-indigo-100">
            <p className="text-xs text-indigo-600 font-semibold uppercase">Required Monthly Investment</p>
            <p className="text-3xl font-bold text-indigo-700 my-1">{calculatedSip > 0 ? formatCurrency(calculatedSip) : "₹0"}</p>
          </div>
          <button 
            disabled={calculatedSip <= 0} 
            onClick={() => onApply(calculatedSip)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Use this Amount
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
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm print:hidden">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2"><Settings2 className="w-4 h-4" /> Expected Returns</h3>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">Adjust these percentages to see how they impact your projected wealth.</p>
          {[
            { id: 'equity', label: 'Equity (Stocks)', color: 'text-emerald-600' },
            { id: 'debt', label: 'Debt (FD/Bonds)', color: 'text-blue-600' },
            { id: 'gold', label: 'Gold', color: 'text-yellow-600' },
            { id: 'silver', label: 'Silver', color: 'text-slate-600' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <label className={`text-sm font-semibold ${item.color}`}>{item.label}</label>
              <div className="relative w-24">
                <input type="number" 
                  value={localRates[item.id as keyof ReturnRates]} 
                  onChange={(e) => setLocalRates({...localRates, [item.id]: Number(e.target.value)})}
                  className="w-full p-2 border border-slate-300 rounded-lg text-right pr-6 outline-none focus:border-indigo-500" />
                <span className="absolute right-2 top-2 text-slate-400 text-xs">%</span>
              </div>
            </div>
          ))}
          <button onClick={() => { onSave(localRates); onClose(); }} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md">
            <Save className="w-4 h-4" /> Update Projection
          </button>
        </div>
      </div>
    </div>
  );
};
