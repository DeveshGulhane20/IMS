import React, { useState, useMemo, useEffect } from 'react';
import { useIMS } from '../../context/IMSContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Check, X, Clock, WifiOff, Users, Save, Zap, ChevronDown } from 'lucide-react';

interface PremiumAttendanceProps {
  isOnline: boolean;
}

export const PremiumAttendance: React.FC<PremiumAttendanceProps> = ({ isOnline }) => {
  const { students, batches, attendanceRecords, markBatchAttendance } = useIMS();
  const { language } = useLanguage();

  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.name || '10-A');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [marks, setMarks] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [isSaving, setIsSaving] = useState(false);

  const batchStudents = useMemo(
    () => students.filter(s => s.batchName === selectedBatch && s.status === 'Active'),
    [students, selectedBatch]
  );

  useEffect(() => {
    const initial: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    batchStudents.forEach(s => {
      const existing = attendanceRecords.find(
        a => a.date === date && (a.studentId === s.id || a.studentName === s.name)
      );
      if (existing) {
        initial[s.id] = existing.status === 'EXCUSED' ? 'LATE' : (existing.status as 'PRESENT' | 'ABSENT' | 'LATE');
      } else {
        initial[s.id] = 'PRESENT';
      }
    });
    setMarks(initial);
  }, [selectedBatch, date, batchStudents, attendanceRecords]);

  const setAll = (status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    const next: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    batchStudents.forEach(s => { next[s.id] = status; });
    setMarks(next);
  };

  const presentCount = Object.values(marks).filter(v => v === 'PRESENT').length;
  const absentCount = Object.values(marks).filter(v => v === 'ABSENT').length;
  const lateCount = Object.values(marks).filter(v => v === 'LATE').length;

  const handleSave = () => {
    setIsSaving(true);
    markBatchAttendance(selectedBatch, date, marks);
    setTimeout(() => setIsSaving(false), 600);
  };

  const statusConfig = {
    PRESENT: { label: language === 'hi' ? 'उपस्थित' : 'Present', bg: 'bg-emerald-500', icon: Check },
    ABSENT: { label: language === 'hi' ? 'अनुपस्थित' : 'Absent', bg: 'bg-rose-500', icon: X },
    LATE: { label: language === 'hi' ? 'देर से' : 'Late', bg: 'bg-amber-500', icon: Clock },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-4 text-white shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 opacity-80" />
              <span className="text-xs font-medium opacity-90">
                {language === 'hi' ? 'त्वरित उपस्थिति' : 'Quick Attendance'}
              </span>
            </div>
            <h2 className="text-lg font-bold leading-tight">
              {language === 'hi' ? 'आज की उपस्थिति अंकित करें' : "Mark Today's Attendance"}
            </h2>
          </div>
          {!isOnline && (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              Offline
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="w-full appearance-none bg-white/15 border border-white/25 text-white text-sm font-medium rounded-xl px-3 py-2.5 pr-8 focus:outline-none"
            >
              {batches.map(b => (
                <option key={b.id} value={b.name} className="text-slate-900">{b.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70 pointer-events-none" />
          </div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-white/15 border border-white/25 text-white text-sm font-medium rounded-xl px-3 py-2.5 focus:outline-none"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-white/15 rounded-xl py-2 text-center">
            <div className="text-xl font-bold">{presentCount}</div>
            <div className="text-[10px] opacity-80 uppercase tracking-wide">Present</div>
          </div>
          <div className="bg-white/15 rounded-xl py-2 text-center">
            <div className="text-xl font-bold">{absentCount}</div>
            <div className="text-[10px] opacity-80 uppercase tracking-wide">Absent</div>
          </div>
          <div className="bg-white/15 rounded-xl py-2 text-center">
            <div className="text-xl font-bold">{lateCount}</div>
            <div className="text-[10px] opacity-80 uppercase tracking-wide">Late</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setAll('PRESENT')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 active:scale-95">
          <Zap className="w-3.5 h-3.5" /> All Present
        </button>
        <button type="button" onClick={() => setAll('ABSENT')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 active:scale-95">
          All Absent
        </button>
      </div>

      <div className="space-y-2.5">
        {batchStudents.map(s => {
          const current = marks[s.id] || 'PRESENT';
          return (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#18211f] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{s.name}</div>
                <div className="text-[11px] text-slate-500">
                  Roll {s.rollNumber} · {s.currentStreak > 0 ? `🔥 ${s.currentStreak} day streak` : 'No streak'}
                </div>
              </div>
              <div className="flex gap-1.5">
                {(['PRESENT', 'ABSENT', 'LATE'] as const).map(st => {
                  const c = statusConfig[st];
                  const active = current === st;
                  const Icon = c.icon;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setMarks(prev => ({ ...prev, [s.id]: st }))}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                        active ? `${c.bg} text-white shadow-md` : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                      title={c.label}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {batchStudents.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">No active students in this batch</div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || batchStudents.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-teal-600/25 transition-all disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        {isSaving
          ? (language === 'hi' ? 'सहेजा जा रहा है…' : 'Saving…')
          : (language === 'hi' ? 'उपस्थिति सहेजें' : 'Save Attendance')}
        {!isOnline && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md ml-1">Offline OK</span>}
      </button>
    </div>
  );
};
