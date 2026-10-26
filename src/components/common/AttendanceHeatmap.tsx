import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus } from '../../types/ims';

interface AttendanceHeatmapProps {
  records: AttendanceRecord[];
}

export const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({ records }) => {
  const [hoveredRecord, setHoveredRecord] = useState<AttendanceRecord | null>(null);

  // Group by date
  const dateMap = new Map<string, AttendanceRecord>();
  records.forEach(r => dateMap.set(r.date, r));

  // Build last 35 days (5 weeks x 7 days)
  const days: { dateStr: string; record?: AttendanceRecord; dayName: string; isWeekend: boolean }[] = [];
  const today = new Date();

  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    days.push({
      dateStr,
      record: dateMap.get(dateStr),
      dayName: dayNames[dayOfWeek],
      isWeekend
    });
  }

  // Calculate summary stats
  const totalSchoolDays = records.filter(r => r.status).length;
  const presentCount = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
  const lateCount = records.filter(r => r.status === 'LATE').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const percentage = totalSchoolDays > 0 ? Math.round((presentCount / totalSchoolDays) * 100) : 100;

  const getColorClass = (status?: AttendanceStatus, isWeekend?: boolean) => {
    if (isWeekend) return 'bg-slate-100 dark:bg-slate-800/40 opacity-40';
    if (!status) return 'bg-slate-100 dark:bg-slate-800';
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'LATE':
        return 'bg-amber-400 hover:bg-amber-500';
      case 'ABSENT':
        return 'bg-rose-500 hover:bg-rose-600';
      case 'EXCUSED':
        return 'bg-blue-400 hover:bg-blue-500';
      default:
        return 'bg-slate-200 dark:bg-slate-700';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>Overall: <strong className="font-mono tabular-nums text-slate-900 dark:text-slate-100 font-semibold">{percentage}%</strong></span>
          <span aria-hidden="true">·</span>
          <span>Present: <strong className="font-mono tabular-nums text-emerald-600">{presentCount}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Late: <strong className="font-mono tabular-nums text-amber-600">{lateCount}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Absent: <strong className="font-mono tabular-nums text-rose-600">{absentCount}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Present</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> Late</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> Absent</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        {days.map((day, idx) => (
          <div
            key={idx}
            onMouseEnter={() => day.record && setHoveredRecord(day.record)}
            onMouseLeave={() => setHoveredRecord(null)}
            className={`h-7 rounded-sm flex items-center justify-center text-[10px] font-mono cursor-pointer transition-colors relative ${getColorClass(
              day.record?.status,
              day.isWeekend
            )} ${day.record ? 'text-white' : 'text-slate-400'}`}
            title={`${day.dateStr}: ${day.record?.status || (day.isWeekend ? 'Weekend' : 'No Class')}`}
          >
            <span>{day.dateStr.slice(-2)}</span>
          </div>
        ))}
      </div>

      {hoveredRecord && (
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <span className="font-mono tabular-nums">{hoveredRecord.date}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold">{hoveredRecord.status}</span>
          {hoveredRecord.remarks && <span>({hoveredRecord.remarks})</span>}
        </div>
      )}
    </div>
  );
};
