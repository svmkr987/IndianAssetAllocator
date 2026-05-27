import React from 'react';

export default function ScoreGauge({ score, maxScore = 12 }: { score: number, maxScore?: number }) {
  const percentage = (score / maxScore) * 100;
  
  // Choose color based on score directly (sync with utils)
  let colorClass = "text-red-500";
  let strokeColor = "#ef4444"; // red-500
  
  if (score >= 10) {
    colorClass = "text-emerald-500";
    strokeColor = "#10b981";
  } else if (score >= 7) {
    colorClass = "text-blue-500";
    strokeColor = "#3b82f6";
  } else if (score >= 5) {
    colorClass = "text-amber-500";
    strokeColor = "#f59e0b";
  } else if (score >= 3) {
    colorClass = "text-orange-500";
    strokeColor = "#f97316";
  }

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle 
          cx="64" cy="64" r="36" 
          stroke="currentColor" 
          strokeWidth="6" 
          fill="transparent" 
          className="text-white/10" 
        />
        <circle 
          cx="64" cy="64" r="36" 
          stroke={strokeColor} 
          strokeWidth="6" 
          fill="transparent" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out" 
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-3xl font-black ${colorClass} tracking-tighter leading-none`}>
          {score}
        </span>
        <span className="text-[10px] font-bold text-slate-400">/ {maxScore}</span>
      </div>
    </div>
  );
}
