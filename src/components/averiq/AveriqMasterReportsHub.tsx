import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  CheckSquare,
  CreditCard,
  TrendingUp,
  FileCheck,
  Download,
  Printer,
  FileSpreadsheet,
  Calendar,
  Filter,
  Search,
  Users,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  X,
  FileText,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useIMS } from '../../context/IMSContext';
import { academicStudents, academicTeachers } from '../../data/mockAcademicData';

export const AveriqMasterReportsHub: React.FC = () => {
  const { showToast } = useIMS();

  // 1. Top Master Navigation Category Tabs
  const [activeReportCategory, setActiveReportCategory] = useState<'attendance' | 'fees' | 'results' | 'exams'>('attendance');

  // 2. Unified Global Filtering & Date Range Controls
  const [academicYear, setAcademicYear] = useState<string>('2025–26');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('Full Session');
  const [dateRangePreset, setDateRangePreset] = useState<string>('Last 30 Days');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');

  // Modals state
  const [selectedItemDetail, setSelectedItemDetail] = useState<any | null>(null);

  // Helper INR formatter
  const inr = (n: number) => Number(n).toLocaleString('en-IN');

  // =========================================================================
  // DATASETS FOR REPORTING CATEGORIES
  // =========================================================================

  // 1. Attendance Data
  const attendanceDailyData = [
    { day: 'Mon', students: 95.2, teachers: 98.0 },
    { day: 'Tue', students: 94.8, teachers: 97.5 },
    { day: 'Wed', students: 93.6, teachers: 96.8 },
    { day: 'Thu', students: 95.0, teachers: 98.2 },
    { day: 'Fri', students: 92.4, teachers: 96.0 },
    { day: 'Sat', students: 91.0, teachers: 95.5 },
    { day: 'Sun', students: 0, teachers: 0 }
  ];

  const attendanceMonthlyTrend = [
    { month: 'Jun', overall: 96.0, students: 95.5, teachers: 97.8 },
    { month: 'Jul', overall: 94.5, students: 94.0, teachers: 96.5 },
    { month: 'Aug', overall: 95.2, students: 94.8, teachers: 97.2 },
    { month: 'Sep', overall: 94.0, students: 93.4, teachers: 96.9 },
    { month: 'Oct', overall: 94.2, students: 93.8, teachers: 97.5 }
  ];

  const attendanceRosterRows = useMemo(() => {
    const studentRows = academicStudents.map(s => {
      const isCompliant = s.attendance.overallPercentage >= 75;
      return {
        id: s.id,
        name: s.name,
        role: 'Student',
        deptClass: `${s.gradeLevel} ${s.section}`,
        rollCode: s.studentCode,
        presentDays: s.attendance.presentDays,
        absentDays: s.attendance.absentDays,
        percentage: s.attendance.overallPercentage,
        punctuality: s.attendance.overallPercentage > 90 ? '98.5%' : '92.0%',
        status: isCompliant ? 'Compliant' : 'Needs Attention',
        statusColor: isCompliant
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
      };
    });

    const teacherRows = academicTeachers.map(t => ({
      id: t.id,
      name: t.name,
      role: 'Faculty',
      deptClass: t.department,
      rollCode: t.employeeCode,
      presentDays: t.attendance.presentDays,
      absentDays: t.attendance.workingDaysTotal - t.attendance.presentDays,
      percentage: t.attendance.overallPercentage,
      punctuality: `${t.attendance.punctualityRate}%`,
      status: 'Compliant',
      statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    }));

    return [...teacherRows, ...studentRows];
  }, []);

  const filteredAttendanceRows = useMemo(() => {
    return attendanceRosterRows.filter(row => {
      const matchSearch =
        row.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.rollCode.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.deptClass.toLowerCase().includes(tableSearchQuery.toLowerCase());
      const matchClass = selectedClass === 'All' || row.deptClass.includes(selectedClass);
      return matchSearch && matchClass;
    });
  }, [attendanceRosterRows, tableSearchQuery, selectedClass]);

  // 2. Fees Data
  const feesClassData = [
    { classGrade: 'Nursery', expected: 33.0, collected: 21.0, pending: 12.0 },
    { classGrade: 'LKG', expected: 38.3, collected: 24.5, pending: 13.8 },
    { classGrade: 'UKG', expected: 46.2, collected: 29.8, pending: 16.4 },
    { classGrade: 'Class 1-5', expected: 108.5, collected: 72.0, pending: 36.5 },
    { classGrade: 'Class 6-8', expected: 98.4, collected: 64.5, pending: 33.9 },
    { classGrade: 'Class 9-10', expected: 96.3, collected: 68.5, pending: 27.8 },
    { classGrade: 'Class 11-12', expected: 66.6, collected: 43.7, pending: 22.9 }
  ];

  const feesModePieData = [
    { name: 'UPI / QR', value: 58, amount: '₹ 18,79,490', color: '#0056D6' },
    { name: 'Net Banking (NEFT)', value: 24, amount: '₹ 7,77,720', color: '#10B981' },
    { name: 'Debit/Credit Card', value: 12, amount: '₹ 3,88,860', color: '#7C3AED' },
    { name: 'Cash / Cheque', value: 6, amount: '₹ 1,94,430', color: '#F59E0B' }
  ];

  const feesLedgerRows = useMemo(() => {
    return academicStudents.map((s, idx) => ({
      receiptNo: `REC-2026-${(900 + idx).toString()}`,
      studentName: s.name,
      studentCode: s.studentCode,
      classGrade: `${s.gradeLevel} ${s.section}`,
      totalFee: s.fees.totalFee,
      paidAmount: s.fees.paidFee,
      balanceDue: s.fees.pendingFee,
      paymentMode: idx % 3 === 0 ? 'UPI' : idx % 3 === 1 ? 'Net Banking' : 'Card',
      status: s.fees.status,
      date: `Oct ${28 - (idx % 12)}, 2026`
    }));
  }, []);

  const filteredFeesRows = useMemo(() => {
    return feesLedgerRows.filter(row => {
      const matchSearch =
        row.studentName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.receiptNo.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.classGrade.toLowerCase().includes(tableSearchQuery.toLowerCase());
      const matchClass = selectedClass === 'All' || row.classGrade.includes(selectedClass);
      return matchSearch && matchClass;
    });
  }, [feesLedgerRows, tableSearchQuery, selectedClass]);

  // 3. Results & Performance Data
  const resultsGradeDistribution = [
    { grade: 'A+', label: 'A+ (90-100%)', count: 284, pct: 22.9, color: '#10B981' },
    { grade: 'A', label: 'A (80-89%)', count: 392, pct: 31.6, color: '#0056D6' },
    { grade: 'B+', label: 'B+ (70-79%)', count: 248, pct: 20.0, color: '#7C3AED' },
    { grade: 'B', label: 'B (60-69%)', count: 138, pct: 11.1, color: '#F59E0B' },
    { grade: 'C', label: 'C (50-59%)', count: 96, pct: 7.7, color: '#FB923C' },
    { grade: 'Below C', label: 'Below C (<50%)', count: 82, pct: 6.6, color: '#EF4444' }
  ];

  const resultsSubjectData = [
    { subject: 'Mathematics', avg: 74.8, passRate: 84.2 },
    { subject: 'Physics', avg: 76.5, passRate: 86.8 },
    { subject: 'Chemistry', avg: 78.2, passRate: 89.1 },
    { subject: 'English', avg: 81.4, passRate: 92.5 },
    { subject: 'Biology', avg: 79.6, passRate: 88.4 },
    { subject: 'Social Science', avg: 77.0, passRate: 87.0 }
  ];

  const resultsStudentRows = useMemo(() => {
    return academicStudents.map((s, idx) => {
      const s1 = s.semesters.sem1.percentage;
      const s2 = s.semesters.sem2.percentage;
      const aggregate = Math.round((s1 + s2) / 2);
      const grade = aggregate >= 90 ? 'A+' : aggregate >= 80 ? 'A' : aggregate >= 70 ? 'B+' : aggregate >= 60 ? 'B' : aggregate >= 50 ? 'C' : 'Below C';
      const isPassed = aggregate >= 40;
      return {
        rank: idx + 1,
        studentName: s.name,
        studentCode: s.studentCode,
        classGrade: `${s.gradeLevel} ${s.section}`,
        term1Pct: s1,
        term2Pct: s2,
        aggregate,
        grade,
        status: isPassed ? 'Passed' : 'Remedial',
        trajectory: s2 >= s1 ? `+${s2 - s1}%` : `-${s1 - s2}%`,
        isTrajectoryPositive: s2 >= s1
      };
    });
  }, []);

  const filteredResultsRows = useMemo(() => {
    return resultsStudentRows.filter(row => {
      const matchSearch =
        row.studentName.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.studentCode.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.classGrade.toLowerCase().includes(tableSearchQuery.toLowerCase());
      const matchClass = selectedClass === 'All' || row.classGrade.includes(selectedClass);
      return matchSearch && matchClass;
    });
  }, [resultsStudentRows, tableSearchQuery, selectedClass]);

  // 4. Exams Data
  const examsSubjectDistribution = [
    { name: 'Mathematics', value: 3, color: '#0056D6' },
    { name: 'Physics', value: 3, color: '#0F766E' },
    { name: 'Chemistry', value: 2, color: '#7C3AED' },
    { name: 'English', value: 2, color: '#F59E0B' },
    { name: 'Biology', value: 1, color: '#10B981' },
    { name: 'Social Science', value: 1, color: '#EC4899' }
  ];

  const examsDensityData = [
    { classGrade: 'Class 10A', exams: 4 },
    { classGrade: 'Class 10B', exams: 3 },
    { classGrade: 'Class 9A', exams: 3 },
    { classGrade: 'Class 8A', exams: 2 }
  ];

  const examsMasterRows = [
    { id: 'ex-01', title: 'Mathematics Unit Test 5', classGrade: 'Class 10A', subject: 'Mathematics', dateTime: 'Nov 12, 2026', time: '08:30 AM – 10:30 AM', venue: 'Hall A', supervisor: 'Prof. Rajesh Sharma', maxMarks: 50, passMarks: 17, enrolled: 45, status: 'Upcoming' },
    { id: 'ex-02', title: 'Physics Practical Term 2', classGrade: 'Class 10B', subject: 'Physics', dateTime: 'Nov 16, 2026', time: '09:00 AM – 11:30 AM', venue: 'Physics Lab', supervisor: 'Dr. Neha Kulkarni', maxMarks: 40, passMarks: 14, enrolled: 42, status: 'Upcoming' },
    { id: 'ex-03', title: 'Chemistry Organic Reactions Assessment', classGrade: 'Class 9A', subject: 'Chemistry', dateTime: 'Nov 18, 2026', time: '10:00 AM – 11:30 AM', venue: 'Room 204', supervisor: 'Prof. Amit Verma', maxMarks: 40, passMarks: 14, enrolled: 40, status: 'Upcoming' },
    { id: 'ex-04', title: 'English Literature Assessment', classGrade: 'Class 8A', subject: 'English', dateTime: 'Nov 20, 2026', time: '09:00 AM – 11:00 AM', venue: 'Junior Wing Hall', supervisor: 'Mrs. Sunita Rao', maxMarks: 50, passMarks: 18, enrolled: 38, status: 'Upcoming' },
    { id: 'ex-05', title: 'Social Studies Term 2 Evaluation', classGrade: 'Class 10A', subject: 'Social Science', dateTime: 'Nov 24, 2026', time: '08:30 AM – 10:30 AM', venue: 'Hall B', supervisor: 'Dr. Anand Joshi', maxMarks: 50, passMarks: 17, enrolled: 45, status: 'Upcoming' },
    { id: 'ex-06', title: 'Semester 1 Pre-Board Examination', classGrade: 'Class 10A', subject: 'Mathematics', dateTime: 'Sep 15, 2026', time: '09:00 AM – 12:00 PM', venue: 'Auditorium Central', supervisor: 'Prof. Rajesh Sharma', maxMarks: 100, passMarks: 33, enrolled: 45, status: 'Completed' },
    { id: 'ex-07', title: 'Physics Mechanics Final Evaluation', classGrade: 'Class 10B', subject: 'Physics', dateTime: 'Sep 18, 2026', time: '09:00 AM – 11:30 AM', venue: 'Hall B', supervisor: 'Dr. Neha Kulkarni', maxMarks: 80, passMarks: 27, enrolled: 42, status: 'Completed' },
    { id: 'ex-08', title: 'Chemistry Periodic Mid-Term Test', classGrade: 'Class 9A', subject: 'Chemistry', dateTime: 'Sep 22, 2026', time: '10:00 AM – 11:30 AM', venue: 'Room 202', supervisor: 'Prof. Amit Verma', maxMarks: 50, passMarks: 17, enrolled: 40, status: 'Completed' }
  ];

  const filteredExamsRows = useMemo(() => {
    return examsMasterRows.filter(row => {
      const matchSearch =
        row.title.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.subject.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
        row.supervisor.toLowerCase().includes(tableSearchQuery.toLowerCase());
      const matchClass = selectedClass === 'All' || row.classGrade.includes(selectedClass);
      return matchSearch && matchClass;
    });
  }, [examsMasterRows, tableSearchQuery, selectedClass]);

  // =========================================================================
  // EXPORT ACTION HANDLERS
  // =========================================================================

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `Averiq_MasterReport_${activeReportCategory.toUpperCase()}_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeReportCategory === 'attendance') {
      csvContent += 'Name,Role,Class/Department,Code,Present Days,Absent Days,Percentage,Punctuality,Status\n';
      filteredAttendanceRows.forEach(r => {
        csvContent += `"${r.name}","${r.role}","${r.deptClass}","${r.rollCode}",${r.presentDays},${r.absentDays},"${r.percentage}%","${r.punctuality}","${r.status}"\n`;
      });
    } else if (activeReportCategory === 'fees') {
      csvContent += 'Receipt No,Student Name,Class,Total Fee,Paid Amount,Balance Due,Payment Mode,Status,Date\n';
      filteredFeesRows.forEach(r => {
        csvContent += `"${r.receiptNo}","${r.studentName}","${r.classGrade}",${r.totalFee},${r.paidAmount},${r.balanceDue},"${r.paymentMode}","${r.status}","${r.date}"\n`;
      });
    } else if (activeReportCategory === 'results') {
      csvContent += 'Rank,Student Name,Student Code,Class,Term 1 %,Term 2 %,Aggregate %,Grade,Status,Trajectory\n';
      filteredResultsRows.forEach(r => {
        csvContent += `${r.rank},"${r.studentName}","${r.studentCode}","${r.classGrade}",${r.term1Pct},${r.term2Pct},${r.aggregate},"${r.grade}","${r.status}","${r.trajectory}"\n`;
      });
    } else {
      csvContent += 'Exam Title,Class,Subject,Date,Time,Venue,Supervisor,Max Marks,Passing Marks,Enrolled,Status\n';
      filteredExamsRows.forEach(r => {
        csvContent += `"${r.title}","${r.classGrade}","${r.subject}","${r.dateTime}","${r.time}","${r.venue}","${r.supervisor}",${r.maxMarks},${r.passMarks},${r.enrolled},"${r.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Master ${activeReportCategory.toUpperCase()} Report downloaded as CSV (${filename}).`);
  };

  const handleDownloadPDF = () => {
    showToast(`Compiling verified multi-page institutional PDF summary for ${activeReportCategory.toUpperCase()}... Ready for download.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. MASTER HEADER & TOP EXPORT TOOLBAR
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0E284D] to-[#0A192F] text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-[11px] uppercase tracking-wider border border-blue-500/30">
                Centralized Master Reporting Hub
              </span>
              <span className="text-xs text-slate-400">Academic Session 2025–26</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Reports & Analytics Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Unified cross-module diagnostics bringing together attendance logs, revenue collections, examination outcomes, and student scorecards.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 z-10 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV Matrix</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. UNIFIED FILTERING & DATE RANGE CONTROLS BAR
          ========================================================================= */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Academic Year */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Session:</span>
            <select
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="2025–26">2025–26 (Active)</option>
              <option value="2024–25">2024–25 (Prior Year)</option>
            </select>
          </div>

          {/* Class / Batch */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Class:</span>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Classes (Full Campus)</option>
              <option value="Class 10">Class 10 (Senior Secondary)</option>
              <option value="Class 9">Class 9 (High School)</option>
              <option value="Class 8">Class 8 (Middle School)</option>
            </select>
          </div>

          {/* Term Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Term:</span>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Full Session">Full Academic Session</option>
              <option value="Term 1">Term 1 (Mid-Term)</option>
              <option value="Term 2">Term 2 (Pre-Boards)</option>
            </select>
          </div>

          {/* Date Range Preset */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Date Scope:</span>
            <select
              value={dateRangePreset}
              onChange={e => setDateRangePreset(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Academic Term">This Academic Term</option>
              <option value="Year to Date">Year to Date (YTD)</option>
            </select>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search report ledger..."
            value={tableSearchQuery}
            onChange={e => setTableSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
          />
        </div>
      </div>

      {/* =========================================================================
          3. OVERVIEW KPI SNAPSHOT CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Attendance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Campus Attendance</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">94.2%</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +1.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Students: 93.8% • Faculty: 97.5%</p>
        </div>

        {/* KPI 2: Fees Collection */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Fees Collected</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">₹ 32.4L</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              66.5% Recovery
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending: ₹ 16,34,500 due</p>
        </div>

        {/* KPI 3: Academic Results */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Pass Rate</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">85.6%</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +3.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mean Score: 76% (1,062 passed)</p>
        </div>

        {/* KPI 4: Examination Audits */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Examinations Roster</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">12</span>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
              8 Scheduled
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">3 Evaluated • 1 Upcoming (Nov 12)</p>
        </div>
      </div>

      {/* =========================================================================
          4. TOP MASTER NAVIGATION ROW / TAB SWITCHER
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-2 shadow-xs flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveReportCategory('attendance')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeReportCategory === 'attendance'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Attendance Reports</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeReportCategory === 'attendance' ? 'bg-blue-700/80 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            94.2%
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportCategory('fees')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeReportCategory === 'fees'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fees Reports</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeReportCategory === 'fees' ? 'bg-blue-700/80 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            ₹ 32.4L
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportCategory('results')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeReportCategory === 'results'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Result & Performance Analytics</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeReportCategory === 'results' ? 'bg-blue-700/80 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            85.6% Pass
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportCategory('exams')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeReportCategory === 'exams'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Exams Reports</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeReportCategory === 'exams' ? 'bg-blue-700/80 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            12 Exams
          </span>
        </button>
      </div>

      {/* =========================================================================
          5. DEEP-DIVE CONTENT: TAB 1 - ATTENDANCE REPORTS
          ========================================================================= */}
      {activeReportCategory === 'attendance' && (
        <div className="space-y-6">
          {/* Visual Graphs Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: 7-Day Attendance Rate */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">7-Day Attendance Velocity</h3>
                  <p className="text-xs text-slate-500">Student vs Faculty daily check-in percentage</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" />Students</span>
                  <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Faculty</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="students" name="Students %" fill="#0056D6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="teachers" name="Faculty %" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Monthly Compliance Trajectory */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Monthly Compliance Trajectory</h3>
                  <p className="text-xs text-slate-500">5-Month trend line across June to October 2026</p>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  94.2% Overall
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceMonthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[90, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="overall" name="Overall %" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="teachers" name="Faculty %" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Attendance Ledger Table */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Student & Faculty Attendance Master Ledger</span>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    {filteredAttendanceRows.length} Records
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Working days logged, punctuality biometric percentages, and compliance flags</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-3">Name & Role</th>
                    <th className="py-3 px-3">Class / Department</th>
                    <th className="py-3 px-3">Present Days</th>
                    <th className="py-3 px-3">Absent Days</th>
                    <th className="py-3 px-3">Percentage</th>
                    <th className="py-3 px-3">Biometric Punctuality</th>
                    <th className="py-3 px-3">Compliance</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredAttendanceRows.slice(0, 15).map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{row.rollCode} • {row.role}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{row.deptClass}</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{row.presentDays} Days</td>
                      <td className="py-3 px-3 font-mono text-rose-600">{row.absentDays} Days</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{row.percentage}%</td>
                      <td className="py-3 px-3 font-mono text-blue-600">{row.punctuality}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedItemDetail(row)}
                          className="px-2.5 py-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold"
                        >
                          View Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. DEEP-DIVE CONTENT: TAB 2 - FEES REPORTS
          ========================================================================= */}
      {activeReportCategory === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Graph 1: Class-wise Recovery (Span 3) */}
            <div className="lg:col-span-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Class-wise Revenue Recovery Matrix</h3>
                  <p className="text-xs text-slate-500">Collected vs Outstanding dues in Lakhs (₹)</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Collected</span>
                  <span className="flex items-center gap-1.5 text-rose-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" />Pending</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feesClassData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="classGrade" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                    <Tooltip formatter={(v: any) => [`₹ ${v} Lakhs`, '']} contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="collected" name="Collected" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Payment Mode Breakdown (Span 2) */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Payment Mode Breakdown</h3>
                <p className="text-xs text-slate-500">Gateway and direct counter collection channels</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="w-36 h-36 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={feesModePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={55} paddingAngle={2}>
                        {feesModePieData.map((e, idx) => (
                          <Cell key={idx} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-black font-mono">58%</span>
                    <span className="text-[9px] text-slate-400">UPI Digital</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs w-1/2">
                  {feesModePieData.map(m => (
                    <div key={m.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                        {m.name}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{m.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Total Collected: ₹ 32,40,500</span>
                <span>Active Terminal</span>
              </div>
            </div>
          </div>

          {/* Fees Master Ledger */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Student Fee Collection & Dues Audit Ledger</span>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    {filteredFeesRows.length} Transactions
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Verified transaction receipts, balance receivables, and fee clearance flags</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-3">Receipt ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Total Fee</th>
                    <th className="py-3 px-3">Paid Amount</th>
                    <th className="py-3 px-3">Balance Due</th>
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredFeesRows.slice(0, 15).map(row => (
                    <tr key={row.receiptNo} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500">{row.receiptNo}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{row.studentName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{row.studentCode}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{row.classGrade}</td>
                      <td className="py-3 px-3 font-mono text-slate-900 dark:text-white font-bold">₹ {inr(row.totalFee)}</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-bold">₹ {inr(row.paidAmount)}</td>
                      <td className="py-3 px-3 font-mono font-bold text-rose-600">₹ {inr(row.balanceDue)}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">{row.paymentMode}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`Receipt ${row.receiptNo} downloaded for ${row.studentName}.`)}
                          className="px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 font-bold"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. DEEP-DIVE CONTENT: TAB 3 - RESULT & PERFORMANCE ANALYTICS
          ========================================================================= */}
      {activeReportCategory === 'results' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: Grade Distribution */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Overall Grade Distribution Matrix</h3>
                  <p className="text-xs text-slate-500">Student performance tiers across consolidated board exams</p>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">1,240 Cohort</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resultsGradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: any) => [`${v} Students`, 'Count']} contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                      {resultsGradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Subject Performance Metrics */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subject-wise Performance & Pass Rate</h3>
                  <p className="text-xs text-slate-500">Mean examination scores vs passing percentages</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" />Avg Score</span>
                  <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Pass Rate</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resultsSubjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="avg" name="Average %" fill="#0056D6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passRate" name="Pass Rate %" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Student Scorecard & Rank Ledger */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Student Academic Scorecard & Progression Matrix</span>
                  <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                    {filteredResultsRows.length} Evaluated Candidates
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Term 1 vs Term 2 comparisons, cumulative rankings, and growth trajectory</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Candidate Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Term 1</th>
                    <th className="py-3 px-3">Term 2</th>
                    <th className="py-3 px-3">Aggregate</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Trajectory</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredResultsRows.slice(0, 15).map(row => (
                    <tr key={row.studentCode} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-500">#{row.rank}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{row.studentName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{row.studentCode}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{row.classGrade}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{row.term1Pct}%</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{row.term2Pct}%</td>
                      <td className="py-3 px-3 font-mono font-black text-blue-600 dark:text-blue-400">{row.aggregate}%</td>
                      <td className="py-3 px-3 font-bold font-mono text-emerald-600">{row.grade}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center font-mono font-bold text-[11px] ${row.isTrajectoryPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {row.isTrajectoryPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                          {row.trajectory}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`Transcript PDF ready for ${row.studentName}.`)}
                          className="px-2.5 py-1 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 font-bold"
                        >
                          Transcript
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. DEEP-DIVE CONTENT: TAB 4 - EXAMS REPORTS
          ========================================================================= */}
      {activeReportCategory === 'exams' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graph 1: Exams by Subject */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Exam Density by Subject Stream</h3>
                  <p className="text-xs text-slate-500">Distribution of test papers across disciplines</p>
                </div>
                <span className="text-xs font-bold text-amber-600 font-mono">12 Total Papers</span>
              </div>
              <div className="h-64 flex items-center justify-between">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={examsSubjectDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={2}>
                        {examsSubjectDistribution.map((e, idx) => (
                          <Cell key={idx} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-1.5 text-xs">
                  {examsSubjectDistribution.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Graph 2: Class-wise Exam Density */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Class-wise Exam Distribution</h3>
                  <p className="text-xs text-slate-500">Scheduled test load per academic grade</p>
                </div>
                <span className="text-xs font-bold text-blue-600 font-mono">Active Terms</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={examsDensityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="classGrade" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="exams" name="Exams" fill="#0056D6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Exams Master Schedule Ledger */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Examination & Invigilation Audit Ledger</span>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                    {filteredExamsRows.length} Papers
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Exam papers, venue seating, supervisor allocations, and evaluation status</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Exam Paper</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Venue</th>
                    <th className="py-3 px-3">Supervisor</th>
                    <th className="py-3 px-3">Max/Pass</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredExamsRows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{row.dateTime}</div>
                        <div className="text-[10px] font-mono text-slate-400">{row.time}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{row.title}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{row.classGrade}</td>
                      <td className="py-3 px-3 font-semibold text-blue-600">{row.subject}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{row.venue}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{row.supervisor}</td>
                      <td className="py-3 px-3 font-mono font-bold">{row.maxMarks} / {row.passMarks}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`Admit card & seating chart downloaded for ${row.title}.`)}
                          className="px-2.5 py-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 font-bold"
                        >
                          Seating
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Record Inspection</h3>
              <button type="button" onClick={() => setSelectedItemDetail(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">{selectedItemDetail.name}</span>
                <span className="text-slate-400 font-mono text-[11px] block">{selectedItemDetail.rollCode} • {selectedItemDetail.role}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Attendance Rate</span>
                  <span className="font-mono font-bold text-blue-600 text-base">{selectedItemDetail.percentage}%</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Punctuality Score</span>
                  <span className="font-mono font-bold text-emerald-600 text-base">{selectedItemDetail.punctuality}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
