
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
  <div className={`bg-white p-4 rounded-xl border-t-4 shadow-sm ${color} flex flex-col justify-between h-full print:shadow-none print:border border-slate-200`}>
    <div>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
          <Icon className="w-4 h-4 shrink-0" />
          {title}
        </div>
        <span className="text-xl font-bold text-slate-800">{percent}%</span>
      </div>
      <div className="text-lg font-semibold text-slate-700 mb-1 break-all">{formatCurrency(amount)}</div>
    </div>
    <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-50">{desc}</div>
  </div>
);

interface ProgressBarProps {
  label: string;
  value: number;
  amount: string;
  colorClass: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, amount, colorClass }) => (
  <div className="mb-3 break-inside-avoid">
    <div className="flex justify-between text-sm mb-1 flex-wrap">
      <span className="text-slate-600 font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-bold text-slate-800 break-all">{amount}</span>
        <span className="text-slate-400 text-xs shrink-0">({value}%)</span>
      </div>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2.5 print:border print:border-slate-200 overflow-hidden">
      <div className={`h-full rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);
