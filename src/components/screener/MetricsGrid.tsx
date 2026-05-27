import React from 'react';
import { Metric } from '../../types/screener';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsGridProps {
  metrics: Metric[];
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, idx) => {
        let valueColor = "text-white";
        let Icon = null;
        
        if (typeof metric.value === 'number') {
           if (metric.name.includes("Growth")) {
             if (metric.value > 0) {
               valueColor = "text-emerald-400";
               Icon = TrendingUp;
             } else if (metric.value < 0) {
               valueColor = "text-red-400";
               Icon = TrendingDown;
             }
           }
        }
        
        if (typeof metric.value === 'string' && metric.value.startsWith('-')) {
            valueColor = "text-red-400";
        }

        return (
          <div key={idx} className="bg-black p-4 rounded-2xl border border-amber-500/20 shadow-lg flex flex-col justify-between">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 line-clamp-2 min-h-[2.5rem]">
              {metric.name}
            </div>
            <div className="flex items-end gap-1">
              <span className={`text-xl font-black ${valueColor} tracking-tight`}>
                {metric.value ?? "N/A"}
              </span>
              {metric.suffix && (
                 <span className="text-xs font-bold text-amber-500/80 mb-1">{metric.suffix}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
