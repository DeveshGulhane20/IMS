import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export interface PieChartSegment {
  name: string;
  value: number;
  color: string;
  sublabel?: string;
}

interface InteractivePieChartProps {
  title?: string;
  subtitle?: string;
  data: PieChartSegment[];
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string | number;
  valuePrefix?: string;
  valueSuffix?: string;
  showLegend?: boolean;
  size?: number;
  className?: string;
}

export const InteractivePieChart: React.FC<InteractivePieChartProps> = ({
  title,
  subtitle,
  data,
  innerRadius = 55,
  outerRadius = 80,
  centerLabel,
  centerValue,
  valuePrefix = '',
  valueSuffix = '',
  showLegend = true,
  size = 200,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const displayCenterValue =
    activeIndex !== null
      ? `${valuePrefix}${data[activeIndex].value.toLocaleString('en-IN')}${valueSuffix}`
      : centerValue !== undefined
      ? centerValue
      : `${valuePrefix}${total.toLocaleString('en-IN')}${valueSuffix}`;

  const displayCenterLabel =
    activeIndex !== null ? data[activeIndex].name : centerLabel || 'Total';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <div className="text-center mb-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(val: number) => [`${valuePrefix}${val.toLocaleString('en-IN')}${valueSuffix}`, '']}
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={activeIndex === index ? 3 : 1}
                  className="transition-all duration-200 cursor-pointer hover:opacity-90"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label & metric */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
            {displayCenterLabel}
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {displayCenterValue}
          </span>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 w-full grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {data.map((item, index) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            const isHovered = activeIndex === index;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>{valuePrefix}{item.value.toLocaleString('en-IN')}{valueSuffix}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">({pct}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
