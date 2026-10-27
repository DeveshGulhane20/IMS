import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Users,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { academicStudents } from '../../data/mockAcademicData';
import { InteractivePieChart } from '../charts/InteractivePieChart';

export const AveriqAttendanceAnalytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  // Overall attendance breakdown pie data
  const overallPieData = useMemo(() => {
    let presentTotal = 0;
    let absentTotal = 0;
    let lateTotal = 0;
    let excusedTotal = 0;

    academicStudents.forEach(s => {
      presentTotal += s.attendance.presentDays;
      absentTotal += s.attendance.absentDays;
      lateTotal += s.attendance.lateDays;
      excusedTotal += s.attendance.excusedDays;
    });

    return [
      { name: 'Present', value: presentTotal, color: '#00C853' },
      { name: 'Absent', value: absentTotal, color: '#EF4444' },
      { name: 'Late Arrivals', value: lateTotal, color: '#F57C00' },
      { name: 'Excused Leave', value: excusedTotal, color: '#0056D6' }
    ];
  }, []);

  // Class-wise attendance bars
  const classAttendanceData = useMemo(() => {
    const batches = [
      { id: 'batch-10a', name: 'Class 10A' },
      { id: 'batch-10b', name: 'Class 10B' },
      { id: 'batch-9a', name: 'Class 9A' },
      { id: 'batch-8a', name: 'Class 8A' }
    ];

    return batches.map(b => {
      const matchStudents = academicStudents.filter(s => s.batchId === b.id);
      const avg = Math.round(
        matchStudents.reduce((acc, s) => acc + s.attendance.overallPercentage, 0) / (matchStudents.length || 1)
      );
      return {
        className: b.name,
        attendance: avg,
        studentsCount: matchStudents.length
      };
    });
  }, []);

  // Filter students
  const filteredStudents = useMemo(() => {
    return academicStudents.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBatch =
        selectedBatch === 'All' ||
        (selectedBatch === '10A' && s.batchId === 'batch-10a') ||
        (selectedBatch === '10B' && s.batchId === 'batch-10b') ||
        (selectedBatch === '9A' && s.batchId === 'batch-9a') ||
        (selectedBatch === '8A' && s.batchId === 'batch-8a');

      return matchSearch && matchBatch;
    });
  }, [searchTerm, selectedBatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Attendance Intelligence & Analytics</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              91.8% Campus Average
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tracking across 50 students, monthly consistency trends, and low attendance alerts
          </p>
        </div>
      </div>

      {/* Graphical Representation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Total Working Days Breakdown"
            subtitle="Aggregated present vs absent days across entire academic year"
            data={overallPieData}
            centerLabel="Days Logged"
            size={180}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Class-wise Attendance Comparison
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Batch performance benchmarked against institutional target (85%)
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="className" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="attendance" fill="#0056D6" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
            {classAttendanceData.map(c => (
              <div key={c.className} className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-400 block">{c.className}</span>
                <span className="font-extrabold text-blue-600">{c.attendance}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student code or name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Batch:</span>
          {['All', '10A', '10B', '9A', '8A'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBatch(b)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                selectedBatch === b
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Student Attendance Roster */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4 text-center">Present</th>
                <th className="py-3 px-4 text-center">Absent</th>
                <th className="py-3 px-4 text-center">Late</th>
                <th className="py-3 px-4 text-center">Overall %</th>
                <th className="py-3 px-4 text-center">Sem 1 %</th>
                <th className="py-3 px-4 text-center">Sem 2 %</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(s => {
                const pct = s.attendance.overallPercentage;
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {s.studentCode}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {s.gradeLevel} {s.section}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">
                      {s.attendance.presentDays}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-rose-500">
                      {s.attendance.absentDays}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-500">
                      {s.attendance.lateDays}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
                        pct >= 90 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        pct >= 80 ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">
                      {s.attendance.sem1Percentage}%
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">
                      {s.attendance.sem2Percentage}%
                    </td>
                    <td className="py-3 px-4">
                      {pct >= 85 ? (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Normal
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warning
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
