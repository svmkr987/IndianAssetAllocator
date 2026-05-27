import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface PriceChartProps {
  data: any;
}

export default function PriceChart({ data }: PriceChartProps) {
  if (!data || !data.quotes || data.quotes.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-950 rounded-2xl border border-white/5">
        <span className="text-slate-500 font-medium">No chart data available</span>
      </div>
    );
  }

  const chartData = data.quotes.map((q: any) => ({
    date: new Date(q.date),
    price: q.close
  })).filter((d: any) => d.price !== null);

  if (chartData.length === 0) {
     return <div className="h-64 flex justify-center items-center">No valid price data.</div>;
  }

  const firstPrice = chartData[0].price;
  const lastPrice = chartData[chartData.length - 1].price;
  const isPositive = lastPrice >= firstPrice;
  const strokeColor = isPositive ? '#10b981' : '#ef4444'; // emerald-500 : red-500
  const fillColor = isPositive ? '#d1fae5' : '#fee2e2';   // emerald-100 : red-100

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(date, 'MMM yy')}
            minTickGap={30}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis 
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `₹${val.toFixed(0)}`}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            dx={-10}
            width={50}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-black p-3 border border-amber-500/20 shadow-xl rounded-xl">
                    <p className="text-[10px] font-bold text-amber-500/80 mb-1 uppercase">
                      {format(payload[0].payload.date, 'dd MMM yyyy')}
                    </p>
                    <p className="text-lg font-black text-white">
                      ₹{Number(payload[0].value).toFixed(2)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={strokeColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
