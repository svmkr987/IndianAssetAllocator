
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
  <div className={`bg-white p-5 rounded-xl border-l-4 shadow-sm ${color} flex flex-col justify-between h-full border border-slate-100 transition-transform hover:scale-[1.02]`}>
    <div>
      <div className="flex justify-between items-start mb-3">
        <div className="p-1.5 bg-slate-50 rounded-md">
          <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </div>
        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter">{percent}%</span>
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{title}</div>
      <div className="text-lg font-black text-slate-900 break-all tracking-tight">{formatCurrency(amount)}</div>
    </div>
    <div className="text-[9px] text-slate-400 mt-4 pt-3 border-t border-slate-50 font-bold uppercase tracking-wider">{desc}</div>
  </div>
);

interface ProgressBarProps {
  label: string;
  value: number;
  amount: string;
  colorClass: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, amount, colorClass }) => (
  <div className="mb-6 break-inside-avoid">
    <div className="flex justify-between items-center text-[10px] mb-2 font-bold tracking-wider uppercase">
      <span className="text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-900 font-black">{amount}</span>
        <span className="text-slate-300 text-[9px]">/ {value}%</span>
      </div>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);
