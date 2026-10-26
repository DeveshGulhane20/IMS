import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ChartDataPoint {
  testName: string;
  studentScore: number;
  classAverage: number;
}

interface PerformanceTrendChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  data,
  height = 280
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
          <XAxis
            dataKey="testName"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '8px',
              color: '#F8FAFC',
              fontSize: '12px'
            }}
            formatter={(value: any, name: any) => [
              `${value}%`,
              name === 'studentScore' ? 'Student Score' : 'Batch Average'
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            formatter={(value) => (value === 'studentScore' ? 'Student Score' : 'Batch Average')}
          />
          <Line
            type="monotone"
            dataKey="studentScore"
            name="studentScore"
            stroke="#1E3A8A"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#1E3A8A', strokeWidth: 1 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="classAverage"
            name="classAverage"
            stroke="#0D9488"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: '#0D9488' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
