
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '../utils';

interface CardProps {
  title: string;
  percent: number;
  amount: number;
  color: string;
  icon: LucideIcon;
  desc: string;
}

export const AssetCard: React.FC<CardProps> = ({ title, percent, amount, color, icon: Icon, desc }) => (
  <div className={`bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between h-full transition-transform hover:scale-[1.02]`}>
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
          <Icon className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
        <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg uppercase tracking-tighter border border-amber-500/20">{Number(percent).toFixed(2)}%</span>
      </div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</div>
      <div className="text-xl font-black text-white break-all tracking-tight">{formatCurrency(amount)}</div>
    </div>
    <div className="text-[10px] text-slate-500 mt-5 pt-4 border-t border-slate-800 font-bold uppercase tracking-wider">{desc}</div>
  </div>
);

interface ProgressBarProps {
  label: string;
  value: number;
  relativeWidth?: number;
  amount: string;
  colorClass: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, relativeWidth, amount, colorClass }) => (
  <div className="mb-6 break-inside-avoid">
    <div className="flex justify-between items-center text-[10px] mb-3 font-bold tracking-wider uppercase">
      <span className="text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-white font-black">{amount}</span>
        <span className="text-slate-600 text-[9px]">/ {Number(value).toFixed(2)}%</span>
      </div>
    </div>
    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
      <div className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`} style={{ width: `${relativeWidth ?? value}%` }}></div>
    </div>
  </div>
);
