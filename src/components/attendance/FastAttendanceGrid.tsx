import React, { useState, useEffect } from 'react';
import { StudentProfile, User, AttendanceStatus } from '../../types/ims';
import { Check, X, Clock, CheckCheck, Save, Flame, Search } from 'lucide-react';

interface FastAttendanceGridProps {
  students: Array<{ student: StudentProfile; user: User }>;
  initialStatus?: Record<string, AttendanceStatus>;
  onSave: (records: Record<string, AttendanceStatus>, remarks?: Record<string, string>) => void;
  dateStr: string;
}

export const FastAttendanceGrid: React.FC<FastAttendanceGridProps> = ({
  students,
  initialStatus = {},
  onSave,
  dateStr
}) => {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const initial: Record<string, AttendanceStatus> = {};
    students.forEach(({ student }) => {
      initial[student.id] = initialStatus[student.id] || 'PRESENT';
    });
    setStatuses(initial);
  }, [students, initialStatus]);

  const setAllStatus = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach(({ student }) => {
      updated[student.id] = status;
    });
    setStatuses(updated);
  };

  const toggleStatus = (studentId: string, status: AttendanceStatus) => {
    setStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleRemarkChange = (studentId: string, text: string) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: text
    }));
  };

  const handleSave = () => {
    onSave(statuses, remarks);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Quick stats
  const total = students.length;
  const presentCount = Object.values(statuses).filter(s => s === 'PRESENT').length;
  const lateCount = Object.values(statuses).filter(s => s === 'LATE').length;
  const absentCount = Object.values(statuses).filter(s => s === 'ABSENT').length;
  const presentPct = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  const filteredStudents = students.filter(({ user, student }) => {
    const full = `${user.firstName} ${user.lastName} ${student.rollNumber}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] overflow-hidden">
      {/* Top action bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or roll #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Roll Call Date: <strong className="font-mono text-slate-900 dark:text-slate-200">{dateStr}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Rate: <strong className="font-mono text-emerald-600">{presentPct}%</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAllStatus('PRESENT')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved ✓' : 'Commit Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Roster table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 font-medium">
              <th className="py-2.5 px-4 w-12">#</th>
              <th className="py-2.5 px-4">Student</th>
              <th className="py-2.5 px-4">Roll Number</th>
              <th className="py-2.5 px-4 text-center">Attendance Streak</th>
              <th className="py-2.5 px-4 text-center">Status Action (P / A / L)</th>
              <th className="py-2.5 px-4">Notes / Transit Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredStudents.map(({ student, user }, index) => {
              const currentStatus = statuses[student.id] || 'PRESENT';
              return (
                <tr
                  key={student.id}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                    currentStatus === 'ABSENT' ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {student.rollNumber}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-amber-600 dark:text-amber-400 font-medium">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {student.currentStreak}d
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleStatus(student.id, 'PRESENT')}
                        className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                          currentStatus === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                        title="Mark Present (P)"
                      >
                        <Check className="w-3 h-3" />
                        <span>Present</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStatus(student.id, 'LATE')}
                        className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                          currentStatus === 'LATE'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                        title="Mark Late (L)"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Late</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStatus(student.id, 'ABSENT')}
                        className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                          currentStatus === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                        title="Mark Absent (A)"
                      >
                        <X className="w-3 h-3" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="Optional remark..."
                      value={remarks[student.id] || ''}
                      onChange={e => handleRemarkChange(student.id, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer count stats */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>Total Roster: <strong className="font-mono text-slate-900 dark:text-slate-100">{total}</strong></div>
        <div className="flex items-center gap-4">
          <span>Present: <strong className="font-mono text-emerald-600">{presentCount}</strong></span>
          <span>Late: <strong className="font-mono text-amber-600">{lateCount}</strong></span>
          <span>Absent: <strong className="font-mono text-rose-600">{absentCount}</strong></span>
        </div>
      </div>
    </div>
  );
};
