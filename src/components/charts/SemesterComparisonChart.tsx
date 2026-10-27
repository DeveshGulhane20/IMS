import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { SemesterRecord } from '../../types/academic';

interface SemesterComparisonChartProps {
  sem1: SemesterRecord;
  sem2: SemesterRecord;
  studentName?: string;
}

export const SemesterComparisonChart: React.FC<SemesterComparisonChartProps> = ({
  sem1,
  sem2,
  studentName
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'sem1' | 'sem2'>('both');

  // Align subjects between sem1 and sem2
  const chartData = sem1.subjects.map(s1Sub => {
    const s2Sub = sem2.subjects.find(s2 => s2.subject === s1Sub.subject) || {
      marksObtained: 0,
      percentage: 0
    };
    return {
      subject: s1Sub.subject,
      'Semester 1': s1Sub.marksObtained,
      'Semester 2': s2Sub.marksObtained,
      difference: s2Sub.marksObtained - s1Sub.marksObtained
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Semester 1 vs Semester 2 Academic Evaluation</span>
            {studentName && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-semibold border border-blue-200/60">
                {studentName}
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-500">
            Subject-wise score comparison and semester progression (Max 100 per subject)
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'both'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sem1')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'sem1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sem 1 ({sem1.percentage}%)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sem2')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'sem2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sem 2 ({sem2.percentage}%)
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Sem 1 Total</span>
          <div className="text-lg font-extrabold text-blue-700 dark:text-blue-300">
            {sem1.totalMarks} / 500
          </div>
          <span className="text-[10px] text-slate-500 font-medium">GPA: {sem1.gpa} (Grade {sem1.grade})</span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Sem 2 Total</span>
          <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
            {sem2.totalMarks} / 500
          </div>
          <span className="text-[10px] text-slate-500 font-medium">GPA: {sem2.gpa} (Grade {sem2.grade})</span>
        </div>

        <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Net Delta</span>
          <div className="text-lg font-extrabold text-purple-700 dark:text-purple-300">
            {sem2.percentage - sem1.percentage >= 0 ? `+${sem2.percentage - sem1.percentage}%` : `${sem2.percentage - sem1.percentage}%`}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            {sem2.percentage >= sem1.percentage ? 'Upward Trajectory' : 'Review Needed'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Avg Attendance</span>
          <div className="text-lg font-extrabold text-amber-700 dark:text-amber-300">
            {Math.round((sem1.attendancePct + sem2.attendancePct) / 2)}%
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Consistent Regularity</span>
        </div>
      </div>

      {/* Bar Chart Representation */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
            <Tooltip
              formatter={(val: number, name: string) => [`${val} / 100`, name]}
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            {(viewMode === 'both' || viewMode === 'sem1') && (
              <Bar
                dataKey="Semester 1"
                fill="#0056D6"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            )}
            {(viewMode === 'both' || viewMode === 'sem2') && (
              <Bar
                dataKey="Semester 2"
                fill="#00C853"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {chartData.map(item => (
          <div
            key={item.subject}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex flex-col justify-between"
          >
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {item.subject}
            </span>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-blue-600 font-semibold">S1: {item['Semester 1']}</span>
              <span className="text-emerald-600 font-semibold">S2: {item['Semester 2']}</span>
            </div>
            <div className="text-[10px] mt-1 font-medium text-slate-500 flex items-center justify-between">
              <span>Change:</span>
              <span className={item.difference >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                {item.difference >= 0 ? `+${item.difference}` : item.difference} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
