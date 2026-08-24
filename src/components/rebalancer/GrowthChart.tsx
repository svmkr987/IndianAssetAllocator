import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: { month: number; value: number }[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full mt-8 bg-white p-4 rounded-xl border border-slate-100">
      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest">Projected Growth (12 Months)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
          <Tooltip 
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Value']}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Line type="monotone" dataKey="value" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
