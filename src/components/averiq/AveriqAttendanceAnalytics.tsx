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
  AlertTriangle,
  ArrowLeft,
  Check,
  RotateCcw,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  Save,
  X,
  Sparkles,
  CheckCircle,
  FileText,
  ShieldCheck,
  Briefcase
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
import { academicStudents, academicTeachers } from '../../data/mockAcademicData';
import { useIMS } from '../../context/IMSContext';

interface AttendanceEntry {
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  remarks: string;
}

interface SavedSessionLog {
  id: string;
  className: string;
  teacherName: string;
  date: string;
  time: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  isFaculty?: boolean;
}

const AVAILABLE_CLASSES = [
  { id: 'batch-10a', name: 'Class 10A', label: 'Class 10A (Science & Math)', grade: '10th', section: 'A' },
  { id: 'batch-10b', name: 'Class 10B', label: 'Class 10B (Science & Math)', grade: '10th', section: 'B' },
  { id: 'batch-9a', name: 'Class 9A', label: 'Class 9A (Foundation)', grade: '9th', section: 'A' },
  { id: 'batch-8a', name: 'Class 8A', label: 'Class 8A (General)', grade: '8th', section: 'A' }
];

export const AveriqAttendanceAnalytics: React.FC = () => {
  const { showToast } = useIMS();

  // Search & Batch filter for main overview table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  // Daily Attendance Setup Configuration State
  // setupClass can be 'teachers' or one of the batch ids: 'batch-10a', 'batch-10b', etc.
  const [setupClass, setSetupClass] = useState<string>('batch-10a');
  const [setupTeacher, setSetupTeacher] = useState<string>(academicTeachers[0]?.name || 'Prof. Rajesh Sharma');
  const [setupEvaluator, setSetupEvaluator] = useState<string>('Campus Principal / Academic Director');
  const [isMarkingSession, setIsMarkingSession] = useState<boolean>(false);

  // Roll-Call Session State (used for both students and teachers)
  const [rollCallSearch, setRollCallSearch] = useState('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceEntry>>({});

  // Confirmation Toast & Logs
  const [toastNotification, setToastNotification] = useState<{ title: string; message: string } | null>(null);
  const [recentSavedSessions, setRecentSavedSessions] = useState<SavedSessionLog[]>([
    {
      id: 'prev-log-faculty-1',
      className: 'Teachers / Faculty',
      teacherName: 'Campus Principal',
      date: 'Oct 30, 2026',
      time: '08:30 AM',
      total: 5,
      present: 5,
      absent: 0,
      late: 0,
      percentage: 100,
      isFaculty: true
    },
    {
      id: 'prev-log-1',
      className: 'Class 10A',
      teacherName: 'Prof. Rajesh Sharma',
      date: 'Oct 29, 2026',
      time: '09:15 AM',
      total: 15,
      present: 14,
      absent: 1,
      late: 0,
      percentage: 93
    }
  ]);

  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const isFacultyMode = setupClass === 'teachers';

  // Target students for the selected class (if student mode)
  const targetClassStudents = useMemo(() => {
    if (isFacultyMode) return [];
    return academicStudents.filter(s => s.batchId === setupClass);
  }, [setupClass, isFacultyMode]);

  // Current class details (if student mode)
  const activeClassObj = useMemo(() => {
    return AVAILABLE_CLASSES.find(c => c.id === setupClass) || AVAILABLE_CLASSES[0];
  }, [setupClass]);

  // Class-wise attendance bars for chart
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

  // Filter students for the main overview roster table
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

  // Start Attendance Session (for either Student Class or Teachers)
  const handleStartAttendance = () => {
    const initialMap: Record<string, AttendanceEntry> = {};
    if (isFacultyMode) {
      academicTeachers.forEach(t => {
        initialMap[t.id] = { status: 'PRESENT', remarks: '' };
      });
    } else {
      targetClassStudents.forEach(s => {
        initialMap[s.id] = { status: 'PRESENT', remarks: '' };
      });
    }
    setAttendanceMap(initialMap);
    setRollCallSearch('');
    setIsMarkingSession(true);
  };

  // Toggle single item status
  const handleSetStatus = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceMap(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { remarks: '' }),
        status
      }
    }));
  };

  // Update remarks
  const handleSetRemarks = (id: string, remarks: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [id]: {
        status: prev[id]?.status || 'PRESENT',
        remarks
      }
    }));
  };

  // Bulk actions
  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    setAttendanceMap(prev => {
      const updated: Record<string, AttendanceEntry> = {};
      const items = isFacultyMode ? academicTeachers : targetClassStudents;
      items.forEach(item => {
        updated[item.id] = {
          status,
          remarks: prev[item.id]?.remarks || ''
        };
      });
      return updated;
    });
  };

  // Roll-call live metrics
  const rollCallMetrics = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;

    const items = isFacultyMode ? academicTeachers : targetClassStudents;
    items.forEach(item => {
      const st = attendanceMap[item.id]?.status || 'PRESENT';
      if (st === 'PRESENT') present++;
      else if (st === 'ABSENT') absent++;
      else if (st === 'LATE') late++;
    });

    const total = items.length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

    return { total, present, absent, late, rate };
  }, [isFacultyMode, targetClassStudents, attendanceMap]);

  // Save Attendance & Return
  const handleSaveAttendance = () => {
    if (isFacultyMode) {
      const newLog: SavedSessionLog = {
        id: `log-fac-${Date.now()}`,
        className: 'Teachers / Faculty',
        teacherName: setupEvaluator,
        date: currentDateFormatted,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        total: rollCallMetrics.total,
        present: rollCallMetrics.present,
        absent: rollCallMetrics.absent,
        late: rollCallMetrics.late,
        percentage: rollCallMetrics.rate,
        isFaculty: true
      };

      setRecentSavedSessions(prev => [newLog, ...prev]);

      // Update academicTeachers in-memory records
      academicTeachers.forEach(t => {
        const entry = attendanceMap[t.id];
        if (entry) {
          if (entry.status === 'PRESENT') {
            t.attendance.presentDays += 1;
            t.attendance.workingDaysTotal += 1;
          } else if (entry.status === 'ABSENT') {
            t.attendance.approvedLeaves += 1;
            t.attendance.workingDaysTotal += 1;
          } else if (entry.status === 'LATE') {
            t.attendance.lateArrivals += 1;
            t.attendance.workingDaysTotal += 1;
          }
          if (t.attendance.workingDaysTotal > 0) {
            t.attendance.overallPercentage = Number(((t.attendance.presentDays / t.attendance.workingDaysTotal) * 100).toFixed(1));
          }
          t.attendance.recentPunches.unshift({
            date: currentDateFormatted,
            checkIn: entry.status === 'LATE' ? '08:45 AM' : '08:20 AM',
            checkOut: '04:30 PM',
            status: entry.status === 'LATE' ? 'LATE' : 'ON_TIME',
            shift: 'Morning Shift'
          });
        }
      });

      window.dispatchEvent(new CustomEvent('averiq_attendance_updated', {
        detail: { type: 'faculty', date: currentDateFormatted }
      }));

      const msg = `Teacher Attendance successfully saved! (${rollCallMetrics.present} Present, ${rollCallMetrics.absent} Absent, ${rollCallMetrics.late} Late) – Verified by ${setupEvaluator}.`;

      setToastNotification({
        title: 'Teacher Attendance Saved Successfully',
        message: msg
      });

      if (showToast) {
        showToast(`Saved Teacher Attendance: ${rollCallMetrics.present} Present`);
      }
    } else {
      const newLog: SavedSessionLog = {
        id: `log-${Date.now()}`,
        className: activeClassObj.name,
        teacherName: setupTeacher,
        date: currentDateFormatted,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        total: rollCallMetrics.total,
        present: rollCallMetrics.present,
        absent: rollCallMetrics.absent,
        late: rollCallMetrics.late,
        percentage: rollCallMetrics.rate,
        isFaculty: false
      };

      setRecentSavedSessions(prev => [newLog, ...prev]);

      // Update in-memory academicStudents
      targetClassStudents.forEach(s => {
        const entry = attendanceMap[s.id];
        if (entry) {
          if (entry.status === 'PRESENT') {
            s.attendance.presentDays = (s.attendance.presentDays || 0) + 1;
            s.attendance.totalWorkingDays = (s.attendance.totalWorkingDays || 0) + 1;
          } else if (entry.status === 'ABSENT') {
            s.attendance.absentDays = (s.attendance.absentDays || 0) + 1;
            s.attendance.totalWorkingDays = (s.attendance.totalWorkingDays || 0) + 1;
          } else if (entry.status === 'LATE') {
            s.attendance.lateDays = (s.attendance.lateDays || 0) + 1;
            s.attendance.totalWorkingDays = (s.attendance.totalWorkingDays || 0) + 1;
          }
          if (s.attendance.totalWorkingDays > 0) {
            s.attendance.overallPercentage = Math.round(
              ((s.attendance.presentDays + s.attendance.lateDays * 0.5) / s.attendance.totalWorkingDays) * 100
            );
          }
          if (!s.attendance.recentLogs) s.attendance.recentLogs = [];
          s.attendance.recentLogs.unshift({
            date: currentDateFormatted,
            status: entry.status,
            period: '1st Period',
            teacher: setupTeacher,
            subject: 'Roll Call'
          });
        }
      });

      window.dispatchEvent(new CustomEvent('averiq_attendance_updated', {
        detail: { type: 'students', classId: setupClass, date: currentDateFormatted }
      }));

      const msg = `Daily attendance recorded for ${activeClassObj.name}! (${rollCallMetrics.present} Present, ${rollCallMetrics.absent} Absent, ${rollCallMetrics.late} Late) – Verified by ${setupTeacher}.`;

      setToastNotification({
        title: 'Attendance Saved Successfully',
        message: msg
      });

      if (showToast) {
        showToast(`Saved ${activeClassObj.name} attendance: ${rollCallMetrics.present} Present`);
      }
    }

    setIsMarkingSession(false);

    // Auto-dismiss toast
    setTimeout(() => {
      setToastNotification(null);
    }, 6000);
  };

  // Filter items within the roll-call view
  const filteredRollCallTeachers = useMemo(() => {
    return academicTeachers.filter(t =>
      t.name.toLowerCase().includes(rollCallSearch.toLowerCase()) ||
      t.employeeCode.toLowerCase().includes(rollCallSearch.toLowerCase()) ||
      t.department.toLowerCase().includes(rollCallSearch.toLowerCase()) ||
      t.primarySubject.toLowerCase().includes(rollCallSearch.toLowerCase())
    );
  }, [rollCallSearch]);

  const filteredRollCallStudents = useMemo(() => {
    return targetClassStudents.filter(s =>
      s.name.toLowerCase().includes(rollCallSearch.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(rollCallSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(rollCallSearch.toLowerCase())
    );
  }, [targetClassStudents, rollCallSearch]);

  // =========================================================================
  // VIEW 2: INTERACTIVE ROLL-CALL VIEW (TEACHERS OR STUDENTS)
  // =========================================================================
  if (isMarkingSession) {
    return (
      <div className="space-y-6">
        {/* Top Navigation & Session Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMarkingSession(false)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Attendance Overview</span>
            </button>
            <div className="hidden sm:block text-xs text-slate-400">
              <span>Attendance Module</span>
              <span className="mx-1.5">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {isFacultyMode ? 'Faculty Attendance Roster' : 'Daily Student Roll-Call'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-lg font-bold text-xs border ${
              isFacultyMode
                ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800'
                : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800'
            }`}>
              {isFacultyMode ? 'Teachers / Faculty Attendance' : activeClassObj.name}
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700">
              {isFacultyMode ? `In-Charge: ${setupEvaluator}` : `Faculty: ${setupTeacher.split(' ')[0]} ${setupTeacher.split(' ')[1]}`}
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200/60 dark:border-emerald-800">
              {currentDateFormatted}
            </span>
          </div>
        </div>

        {/* Live Metrics Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isFacultyMode ? 'Teacher & Faculty Attendance Roll-Call' : 'Daily Student Attendance Roll-Call'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isFacultyMode
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}>
                  {isFacultyMode ? '5 Faculty Members' : `${targetClassStudents.length} Students`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isFacultyMode
                  ? 'Record daily faculty presence, biometric punch status, and approved duty leaves across all departments'
                  : `Mark attendance for ${activeClassObj.label} • Assigned Faculty: ${setupTeacher}`}
              </p>
            </div>

            {/* Quick KPI Stats Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Roster</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{rollCallMetrics.total}</span>
                <span className="text-[10px] text-slate-400 block">{isFacultyMode ? 'Faculty Staff' : 'Class Roster'}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-center">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold uppercase">Present</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">{rollCallMetrics.present}</span>
                <span className="text-[10px] text-emerald-600 block">{Math.round((rollCallMetrics.present / (rollCallMetrics.total || 1)) * 100)}% Present</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/60 text-center">
                <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-semibold uppercase">Absent</span>
                <span className="text-xl font-black text-rose-700 dark:text-rose-300">{rollCallMetrics.absent}</span>
                <span className="text-[10px] text-rose-600 block">{Math.round((rollCallMetrics.absent / (rollCallMetrics.total || 1)) * 100)}% Absent</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 text-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold uppercase">Late Arrival</span>
                <span className="text-xl font-black text-amber-700 dark:text-amber-300">{rollCallMetrics.late}</span>
                <span className="text-[10px] text-amber-600 block">Delayed Entry</span>
              </div>
            </div>
          </div>

          {/* Bulk Action Helpers & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            {/* Bulk helper buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Bulk Actions:</span>
              <button
                type="button"
                onClick={() => handleMarkAll('PRESENT')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('ABSENT')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Mark All Absent</span>
              </button>
              <button
                type="button"
                onClick={() => handleStartAttendance()}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>

            {/* Quick in-table search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rollCallSearch}
                onChange={(e) => setRollCallSearch(e.target.value)}
                placeholder={isFacultyMode ? 'Filter faculty by name, code...' : 'Filter by name or roll...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* TABLE: TEACHER ROLL-CALL OR STUDENT ROLL-CALL */}
          {isFacultyMode ? (
            /* TEACHER ROLL-CALL TABLE */
            <div className="overflow-x-auto border border-slate-200/90 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50/60 dark:bg-purple-950/40 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-purple-100 dark:border-purple-900 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Faculty Member & Designation</th>
                    <th className="py-3 px-4">Department & Subject</th>
                    <th className="py-3 px-4 text-center">Historical Presence</th>
                    <th className="py-3 px-4 text-center">Mark Attendance Status</th>
                    <th className="py-3 px-4">Daily Notes / Biometric Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRollCallTeachers.map(teacher => {
                    const entry = attendanceMap[teacher.id] || { status: 'PRESENT', remarks: '' };
                    const status = entry.status;

                    return (
                      <tr
                        key={teacher.id}
                        className={`transition-colors ${
                          status === 'ABSENT'
                            ? 'bg-rose-50/40 dark:bg-rose-950/20'
                            : status === 'LATE'
                            ? 'bg-amber-50/40 dark:bg-amber-950/20'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Employee Code */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-200/60 dark:border-purple-800">
                            {teacher.employeeCode}
                          </span>
                        </td>

                        {/* Name & Designation */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${teacher.avatarBg} text-white font-extrabold flex items-center justify-center text-xs shadow-xs shrink-0`}>
                              {teacher.name.replace('Prof. ', '').replace('Dr. ', '').replace('Mrs. ', '').split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-sm">
                                {teacher.name}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {teacher.designation}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Department & Subject */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {teacher.department}
                          </span>
                          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                            {teacher.primarySubject} • {teacher.workloadHoursPerWeek} hrs/wk
                          </span>
                        </td>

                        {/* Historical Presence */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                            {teacher.attendance?.overallPercentage || 98}% Presence
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                            {teacher.attendance?.averageCheckInTime || '08:20 AM'} Avg
                          </span>
                        </td>

                        {/* Toggle Buttons: Present, Absent, Late */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Present */}
                            <button
                              type="button"
                              onClick={() => handleSetStatus(teacher.id, 'PRESENT')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-600/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            {/* Absent */}
                            <button
                              type="button"
                              onClick={() => handleSetStatus(teacher.id, 'ABSENT')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                status === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-600/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>

                            {/* Late Arrival */}
                            <button
                              type="button"
                              onClick={() => handleSetStatus(teacher.id, 'LATE')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                status === 'LATE'
                                  ? 'bg-amber-500 text-white shadow-xs scale-102 ring-2 ring-amber-500/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Late Arrival</span>
                            </button>
                          </div>
                        </td>

                        {/* Session Notes */}
                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) => handleSetRemarks(teacher.id, e.target.value)}
                            placeholder={status === 'ABSENT' ? 'Leave type (e.g. Duty leave, Casual)' : status === 'LATE' ? 'Clock-in time (e.g. 08:45 AM)' : 'Biometric on-time (e.g. 08:18 AM)'}
                            className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* STUDENT ROLL-CALL TABLE */
            <div className="overflow-x-auto border border-slate-200/90 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Student ID / Code</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4 text-center">Roll No</th>
                    <th className="py-3 px-4 text-center">Historical %</th>
                    <th className="py-3 px-4 text-center">Mark Attendance Status</th>
                    <th className="py-3 px-4">Session Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRollCallStudents.map(student => {
                    const entry = attendanceMap[student.id] || { status: 'PRESENT', remarks: '' };
                    const status = entry.status;

                    return (
                      <tr
                        key={student.id}
                        className={`transition-colors ${
                          status === 'ABSENT'
                            ? 'bg-rose-50/30 dark:bg-rose-950/20'
                            : status === 'LATE'
                            ? 'bg-amber-50/30 dark:bg-amber-950/20'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200/60">
                            {student.studentCode}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-black flex items-center justify-center text-xs shrink-0">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {student.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Guardian: {student.parentName.split('&')[0]}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300 font-semibold">
                          #{student.rollNumber}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            student.attendance.overallPercentage >= 85
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {student.attendance.overallPercentage}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSetStatus(student.id, 'PRESENT')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-600/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetStatus(student.id, 'ABSENT')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                status === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-xs scale-102 ring-2 ring-rose-600/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetStatus(student.id, 'LATE')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                status === 'LATE'
                                  ? 'bg-amber-500 text-white shadow-xs scale-102 ring-2 ring-amber-500/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Late Arrival</span>
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) => handleSetRemarks(student.id, e.target.value)}
                            placeholder={status === 'ABSENT' ? 'Reason (e.g. Medical)' : status === 'LATE' ? 'Minutes late (e.g. 15 min)' : 'Optional remark...'}
                            className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Action Footer Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Summary:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {rollCallMetrics.present} Present
              </span>
              <span>•</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {rollCallMetrics.absent} Absent
              </span>
              <span>•</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {rollCallMetrics.late} Late
              </span>
              <span>•</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {rollCallMetrics.rate}% Attendance Rate
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsMarkingSession(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAttendance}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto text-white ${
                  isFacultyMode
                    ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>
                  {isFacultyMode
                    ? `Save Teacher Attendance (${rollCallMetrics.present} Present, ${rollCallMetrics.absent} Absent)`
                    : `Save Attendance (${rollCallMetrics.present} Present, ${rollCallMetrics.absent} Absent)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: MAIN ATTENDANCE OVERVIEW DASHBOARD
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Confirmation Toast Notification */}
      {toastNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-md flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {toastNotification.title}
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                {toastNotification.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-200/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            Real-time daily roll-call workflow for Students & Teachers, 7-day class trends, and automated attendance tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Today: {currentDateFormatted}</span>
          </span>
        </div>
      </div>

      {/* Graphical Representation Row: Left Card is the DAILY ATTENDANCE SETUP CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SECTION 1: DAILY ATTENDANCE SETUP CARD (With Teachers / Faculty option) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isFacultyMode
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 text-purple-600 dark:text-purple-400'
                    : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 text-blue-600 dark:text-blue-400'
                }`}>
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Daily Attendance
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure classroom or faculty session & launch roll-call
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                isFacultyMode
                  ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/50'
                  : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/50'
              }`}>
                {isFacultyMode ? 'Faculty Mode' : 'Student Mode'}
              </span>
            </div>

            <div className="space-y-4">
              {/* Class Selection Dropdown (Includes Teachers / Faculty Attendance Option) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Select Class / Category</span>
                  </span>
                  {isFacultyMode && (
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                      Faculty Tracking Active
                    </span>
                  )}
                </label>
                <select
                  value={setupClass}
                  onChange={(e) => setSetupClass(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-hidden focus:ring-2 cursor-pointer transition-colors ${
                    isFacultyMode
                      ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 focus:ring-purple-500'
                      : 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-blue-500'
                  }`}
                >
                  <optgroup label="Faculty & Staff">
                    <option value="teachers" className="font-bold text-purple-700">
                      👨‍🏫 Teachers / Faculty Attendance (All 5 Mentors)
                    </option>
                  </optgroup>
                  <optgroup label="Student Classes">
                    {AVAILABLE_CLASSES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} • {c.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Teacher / In-Charge Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {isFacultyMode ? 'Evaluator / Approving Authority' : 'Select Teacher / Faculty'}
                  </span>
                </label>
                {isFacultyMode ? (
                  <select
                    value={setupEvaluator}
                    onChange={(e) => setSetupEvaluator(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="Campus Principal / Academic Director">Campus Principal / Academic Director</option>
                    <option value="Admin Registrar Office">Admin Registrar Office</option>
                    <option value="Academic Dean - Senior Secondary">Academic Dean - Senior Secondary</option>
                    <option value="Admin Desk (Biometric Self-Audit)">Admin Desk (Biometric Self-Audit)</option>
                  </select>
                ) : (
                  <select
                    value={setupTeacher}
                    onChange={(e) => setSetupTeacher(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {academicTeachers.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.designation})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Session Summary Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Session Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentDateFormatted}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                    {isFacultyMode ? 'Faculty Strength' : 'Class Strength'}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {isFacultyMode ? '5 Teaching Mentors' : `${targetClassStudents.length} Students Enrolled`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Dynamic label for Teachers vs Students */}
          <div className="pt-4 mt-2">
            <button
              type="button"
              onClick={handleStartAttendance}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-white ${
                isFacultyMode
                  ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>
                {isFacultyMode ? 'Mark Teacher Attendance' : `Mark Attendance for ${activeClassObj.name}`}
              </span>
            </button>
          </div>
        </div>

        {/* SECTION 2: CLASS-WISE ATTENDANCE COMPARISON */}
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

      {/* Recently Logged Attendance Sessions Strip */}
      {recentSavedSessions.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Today's Verified Attendance Records</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              {recentSavedSessions.length} Session(s) Recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {recentSavedSessions.map(session => (
              <div
                key={session.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  session.isFaculty
                    ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200/70 dark:border-purple-900/60'
                    : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200/70 dark:border-slate-700/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {session.className}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      session.isFaculty
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {session.percentage}% Present
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {session.isFaculty ? `Approver: ${session.teacherName}` : `Faculty: ${session.teacherName}`} • Logged at {session.time}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                    {session.present} Present • {session.absent} Absent
                  </div>
                  {session.late > 0 && (
                    <span className="text-[10px] text-amber-500 font-medium">
                      {session.late} Late Entry
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search for Students */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student code or name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Batch:</span>
          {['All', '10A', '10B', '9A', '8A'].map(b => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBatch(b)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                selectedBatch === b
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Student Attendance Roster Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Student Attendance Directory ({filteredStudents.length} Students)
          </div>
          <span className="text-[11px] text-slate-400">Historical performance & semester averages</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4 text-center">Present Days</th>
                <th className="py-3 px-4 text-center">Absent Days</th>
                <th className="py-3 px-4 text-center">Late Days</th>
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
