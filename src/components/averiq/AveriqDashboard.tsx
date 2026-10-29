import React, { useState, useEffect } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  Users,
  GraduationCap,
  CreditCard,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  UserPlus,
  CheckSquare,
  FileCheck,
  Send,
  BookOpen,
  ArrowRight,
  Plus,
  X,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Tag,
  Filter,
  MessageSquare,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import {
  academicMetrics,
  academicEvents,
  academicStudents,
  academicTeachers
} from '../../data/mockAcademicData';

interface AveriqDashboardProps {
  onNavigateTab: (tabId: string) => void;
  onOpenModal: (type: 'student' | 'teacher' | 'attendance' | 'fee' | 'exam' | 'inquiry') => void;
}

export interface StudentAtRisk {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  initials: string;
  avatarBg: string;
  attendanceRate: number; // e.g. 64.5% (< 75%)
  pendingFeeAmount: number; // e.g. ₹14,500 Overdue
  feeOverdueDays: number;
  examAverage: number; // e.g. 44% (Low results)
  failingSubjects: string[];
  riskLevel: 'Critical' | 'High' | 'Moderate';
  primaryReason: string;
}

export const AveriqDashboard: React.FC<AveriqDashboardProps> = ({
  onNavigateTab,
  onOpenModal
}) => {
  const { students, teachers, feePayments, tests, showToast } = useIMS();

  // Dynamic Date and Time
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 1. Daily Attendance (7-Day at a time) State & Dataset
  const [attendanceClassFilter, setAttendanceClassFilter] = useState<string>('all');

  const attendanceDataByClass: Record<
    string,
    { label: string; data: { day: string; fullDate: string; rate: number; present: number; total: number }[] }
  > = {
    all: {
      label: 'Campus Overall (All Classes)',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 94, present: 47, total: 50 },
        { day: 'Tue', fullDate: '21 Oct', rate: 96, present: 48, total: 50 },
        { day: 'Wed', fullDate: '22 Oct', rate: 92, present: 46, total: 50 },
        { day: 'Thu', fullDate: '23 Oct', rate: 98, present: 49, total: 50 },
        { day: 'Fri', fullDate: '24 Oct', rate: 94, present: 47, total: 50 },
        { day: 'Sat', fullDate: '25 Oct', rate: 88, present: 44, total: 50 },
        { day: 'Sun', fullDate: '26 Oct', rate: 90, present: 45, total: 50 }
      ]
    },
    '10a': {
      label: 'Class 10-A (Science)',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 96, present: 24, total: 25 },
        { day: 'Tue', fullDate: '21 Oct', rate: 100, present: 25, total: 25 },
        { day: 'Wed', fullDate: '22 Oct', rate: 96, present: 24, total: 25 },
        { day: 'Thu', fullDate: '23 Oct', rate: 100, present: 25, total: 25 },
        { day: 'Fri', fullDate: '24 Oct', rate: 96, present: 24, total: 25 },
        { day: 'Sat', fullDate: '25 Oct', rate: 92, present: 23, total: 25 },
        { day: 'Sun', fullDate: '26 Oct', rate: 92, present: 23, total: 25 }
      ]
    },
    '10b': {
      label: 'Class 10-B (General)',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 92, present: 23, total: 25 },
        { day: 'Tue', fullDate: '21 Oct', rate: 92, present: 23, total: 25 },
        { day: 'Wed', fullDate: '22 Oct', rate: 88, present: 22, total: 25 },
        { day: 'Thu', fullDate: '23 Oct', rate: 96, present: 24, total: 25 },
        { day: 'Fri', fullDate: '24 Oct', rate: 92, present: 23, total: 25 },
        { day: 'Sat', fullDate: '25 Oct', rate: 84, present: 21, total: 25 },
        { day: 'Sun', fullDate: '26 Oct', rate: 88, present: 22, total: 25 }
      ]
    },
    '9a': {
      label: 'Class 9-A',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 90, present: 27, total: 30 },
        { day: 'Tue', fullDate: '21 Oct', rate: 93, present: 28, total: 30 },
        { day: 'Wed', fullDate: '22 Oct', rate: 87, present: 26, total: 30 },
        { day: 'Thu', fullDate: '23 Oct', rate: 97, present: 29, total: 30 },
        { day: 'Fri', fullDate: '24 Oct', rate: 90, present: 27, total: 30 },
        { day: 'Sat', fullDate: '25 Oct', rate: 83, present: 25, total: 30 },
        { day: 'Sun', fullDate: '26 Oct', rate: 87, present: 26, total: 30 }
      ]
    },
    '9b': {
      label: 'Class 9-B',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 86, present: 24, total: 28 },
        { day: 'Tue', fullDate: '21 Oct', rate: 89, present: 25, total: 28 },
        { day: 'Wed', fullDate: '22 Oct', rate: 86, present: 24, total: 28 },
        { day: 'Thu', fullDate: '23 Oct', rate: 93, present: 26, total: 28 },
        { day: 'Fri', fullDate: '24 Oct', rate: 86, present: 24, total: 28 },
        { day: 'Sat', fullDate: '25 Oct', rate: 82, present: 23, total: 28 },
        { day: 'Sun', fullDate: '26 Oct', rate: 86, present: 24, total: 28 }
      ]
    },
    '8a': {
      label: 'Class 8-A Foundation',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 95, present: 19, total: 20 },
        { day: 'Tue', fullDate: '21 Oct', rate: 95, present: 19, total: 20 },
        { day: 'Wed', fullDate: '22 Oct', rate: 90, present: 18, total: 20 },
        { day: 'Thu', fullDate: '23 Oct', rate: 100, present: 20, total: 20 },
        { day: 'Fri', fullDate: '24 Oct', rate: 95, present: 19, total: 20 },
        { day: 'Sat', fullDate: '25 Oct', rate: 90, present: 18, total: 20 },
        { day: 'Sun', fullDate: '26 Oct', rate: 90, present: 18, total: 20 }
      ]
    },
    '11pcm': {
      label: 'Class 11-PCM (Senior)',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 88, present: 22, total: 25 },
        { day: 'Tue', fullDate: '21 Oct', rate: 92, present: 23, total: 25 },
        { day: 'Wed', fullDate: '22 Oct', rate: 84, present: 21, total: 25 },
        { day: 'Thu', fullDate: '23 Oct', rate: 96, present: 24, total: 25 },
        { day: 'Fri', fullDate: '24 Oct', rate: 88, present: 22, total: 25 },
        { day: 'Sat', fullDate: '25 Oct', rate: 84, present: 21, total: 25 },
        { day: 'Sun', fullDate: '26 Oct', rate: 92, present: 23, total: 25 }
      ]
    },
    '12pcb': {
      label: 'Class 12-PCB (Senior)',
      data: [
        { day: 'Mon', fullDate: '20 Oct', rate: 95, present: 21, total: 22 },
        { day: 'Tue', fullDate: '21 Oct', rate: 100, present: 22, total: 22 },
        { day: 'Wed', fullDate: '22 Oct', rate: 91, present: 20, total: 22 },
        { day: 'Thu', fullDate: '23 Oct', rate: 100, present: 22, total: 22 },
        { day: 'Fri', fullDate: '24 Oct', rate: 95, present: 21, total: 22 },
        { day: 'Sat', fullDate: '25 Oct', rate: 91, present: 20, total: 22 },
        { day: 'Sun', fullDate: '26 Oct', rate: 95, present: 21, total: 22 }
      ]
    }
  };

  const currentAttendanceData = attendanceDataByClass[attendanceClassFilter] || attendanceDataByClass.all;
  const currentAttendanceAvg = Math.round(
    currentAttendanceData.data.reduce((acc, curr) => acc + curr.rate, 0) / currentAttendanceData.data.length
  );

  // Fee collection Donut Chart Data from dynamic dataset
  const feeDonutData = [
    {
      name: 'Collected',
      value: academicMetrics.totalFeesCollected,
      percentage: Math.round((academicMetrics.totalFeesCollected / academicMetrics.totalFeesBilled) * 100),
      color: '#10B981'
    },
    {
      name: 'Pending',
      value: Math.round(academicMetrics.totalFeesPending * 0.7),
      percentage: Math.round((academicMetrics.totalFeesPending * 0.7 / academicMetrics.totalFeesBilled) * 100),
      color: '#F59E0B'
    },
    {
      name: 'Overdue',
      value: Math.round(academicMetrics.totalFeesPending * 0.3),
      percentage: Math.round((academicMetrics.totalFeesPending * 0.3 / academicMetrics.totalFeesBilled) * 100),
      color: '#EF4444'
    }
  ];

  // 3. Upcoming Events State (Initialized with mock events, expandable via calendar double-click)
  const [eventsList, setEventsList] = useState([
    {
      id: 'evt-init-1',
      title: 'Class 10 Science Practical Mock Exam',
      date: '28 MAY',
      month: 'MAY',
      day: '28',
      time: '09:00 AM – 11:30 AM',
      venue: 'Physics & Chemistry Lab 2',
      type: 'Exam',
      isCustom: false
    },
    {
      id: 'evt-init-2',
      title: 'Quarterly Parent-Teacher Advisory Council',
      date: '30 MAY',
      month: 'MAY',
      day: '30',
      time: '10:30 AM – 01:00 PM',
      venue: 'Main Academic Auditorium',
      type: 'Meeting',
      isCustom: false
    },
    {
      id: 'evt-init-3',
      title: 'Inter-Batch Mathematics Olympiad Trials',
      date: '02 JUN',
      month: 'JUN',
      day: '02',
      time: '02:00 PM – 04:00 PM',
      venue: 'Seminar Hall B',
      type: 'Event',
      isCustom: false
    },
    {
      id: 'evt-init-4',
      title: 'Fee Installment Clearence Reminder Deadline',
      date: '05 JUN',
      month: 'JUN',
      day: '05',
      time: '05:00 PM',
      venue: 'Accounts & Finance Desk',
      type: 'Reminder',
      isCustom: false
    }
  ]);

  // Top Performing Students data from dynamic dataset
  const topStudents = [...academicStudents]
    .sort((a, b) => {
      const avgA = (a.semesters.sem1.percentage + a.semesters.sem2.percentage) / 2;
      const avgB = (b.semesters.sem1.percentage + b.semesters.sem2.percentage) / 2;
      return avgB - avgA;
    })
    .slice(0, 5)
    .map((s, idx) => {
      const avg = Math.round((s.semesters.sem1.percentage + s.semesters.sem2.percentage) / 2);
      const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-teal-600'];
      return {
        rank: idx + 1,
        name: s.name,
        class: `${s.gradeLevel}-${s.section}`,
        percentage: `${avg}%`,
        initials: s.name.split(' ').map(n => n[0]).join(''),
        avatarBg: colors[idx % colors.length]
      };
    });

  // 2. "Students at Risk" Data (Evaluated on Attendance < 75%, Pending/Overdue Fees, Low Exam Results)
  const [riskFilter, setRiskFilter] = useState<'All' | 'Critical' | 'High'>('All');
  
  const studentsAtRisk: StudentAtRisk[] = [
    {
      id: 'sar-1',
      rollNo: '10B-18',
      name: 'Kabir Mehta',
      class: 'Class 10-B',
      initials: 'KM',
      avatarBg: 'bg-rose-600',
      attendanceRate: 64.5,
      pendingFeeAmount: 14500,
      feeOverdueDays: 45,
      examAverage: 44,
      failingSubjects: ['Maths (36%)', 'Physics (42%)'],
      riskLevel: 'Critical',
      primaryReason: 'Chronic absenteeism (64.5%) + 2 Exam Failures + ₹14.5K Overdue'
    },
    {
      id: 'sar-2',
      rollNo: '10A-14',
      name: 'Pooja Mehta',
      class: 'Class 10-A',
      initials: 'PM',
      avatarBg: 'bg-amber-600',
      attendanceRate: 68.0,
      pendingFeeAmount: 9000,
      feeOverdueDays: 30,
      examAverage: 51,
      failingSubjects: ['Chemistry (45%)'],
      riskLevel: 'High',
      primaryReason: 'Irregular attendance (68%) + Chemistry remediation required'
    },
    {
      id: 'sar-3',
      rollNo: '09B-09',
      name: 'Aniket Roy',
      class: 'Class 9-B',
      initials: 'AR',
      avatarBg: 'bg-rose-700',
      attendanceRate: 59.2,
      pendingFeeAmount: 16000,
      feeOverdueDays: 60,
      examAverage: 42,
      failingSubjects: ['Science (38%)', 'Maths (40%)'],
      riskLevel: 'Critical',
      primaryReason: 'Severe attendance deficit (59.2%) + Unpaid Q2 Tuition + Failing STEM'
    },
    {
      id: 'sar-4',
      rollNo: '11P-07',
      name: 'Simran Kaur',
      class: 'Class 11-PCM',
      initials: 'SK',
      avatarBg: 'bg-orange-600',
      attendanceRate: 71.4,
      pendingFeeAmount: 8500,
      feeOverdueDays: 20,
      examAverage: 49,
      failingSubjects: ['Calculus (44%)'],
      riskLevel: 'High',
      primaryReason: 'Below 75% attendance threshold + Borderline Math score'
    },
    {
      id: 'sar-5',
      rollNo: '10B-22',
      name: 'Sameer Khan',
      class: 'Class 10-B',
      initials: 'SK',
      avatarBg: 'bg-amber-700',
      attendanceRate: 73.0,
      pendingFeeAmount: 12000,
      feeOverdueDays: 40,
      examAverage: 53,
      failingSubjects: ['Physics (48%)'],
      riskLevel: 'Moderate',
      primaryReason: 'Overdue fee balance + Attendance watch alert'
    }
  ];

  const filteredStudentsAtRisk = riskFilter === 'All'
    ? studentsAtRisk
    : studentsAtRisk.filter(s => s.riskLevel === riskFilter);

  // Class-wise Attendance (Classes 6 to 12)
  const classAttendance = [
    { class: 'Class 6', rate: 94 },
    { class: 'Class 7', rate: 91 },
    { class: 'Class 8', rate: 88 },
    { class: 'Class 9', rate: 82 },
    { class: 'Class 10', rate: 96 },
    { class: 'Class 11', rate: 79 },
    { class: 'Class 12', rate: 92 }
  ];

  // 3. Calendar State & Double-Click Modal Handling
  const [calendarMonth, setCalendarMonth] = useState('May 2026');
  const [selectedDay, setSelectedDay] = useState(26);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<number>(26);

  const [calendarForm, setCalendarForm] = useState<{
    title: string;
    type: 'Event' | 'Note' | 'Reminder' | 'Exam' | 'Meeting';
    time: string;
    venue: string;
    description: string;
  }>({
    title: '',
    type: 'Event',
    time: '10:00 AM – 11:30 AM',
    venue: 'Academic Hall 101',
    description: ''
  });

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // May 2026 starts on Friday (index 4 for Mo=0)
  const [calendarDaysList, setCalendarDaysList] = useState<{ day: number | null; isToday?: boolean; hasEvent?: boolean }[]>([
    { day: null },
    { day: null },
    { day: null },
    { day: null },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5, hasEvent: true },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
    { day: 26, isToday: true },
    { day: 27 },
    { day: 28, hasEvent: true },
    { day: 29 },
    { day: 30, hasEvent: true },
    { day: 31 }
  ]);

  // Double Click Handler on Calendar Date
  const handleDateDoubleClick = (dayNum: number) => {
    setSelectedDay(dayNum);
    setModalDate(dayNum);
    setCalendarForm({
      title: '',
      type: 'Event',
      time: '10:00 AM – 11:30 AM',
      venue: 'Main Academic Hall',
      description: ''
    });
    setIsCalendarModalOpen(true);
  };

  // Submit Handler for Calendar Item
  const handleSaveCalendarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarForm.title.trim()) {
      showToast('Please enter an event or reminder title');
      return;
    }

    const monthName = calendarMonth.split(' ')[0];
    const monthAbbr = monthName.slice(0, 3).toUpperCase();
    const formattedDay = modalDate.toString().padStart(2, '0');

    const newItem = {
      id: `custom-event-${Date.now()}`,
      title: calendarForm.title.trim(),
      date: `${formattedDay} ${monthAbbr}`,
      month: monthAbbr,
      day: formattedDay,
      time: calendarForm.time.trim() || 'All Day',
      venue: calendarForm.venue.trim() || 'Campus Center',
      type: calendarForm.type,
      isCustom: true
    };

    // Prepend to Upcoming Events
    setEventsList(prev => [newItem, ...prev]);

    // Mark event dot on calendar
    setCalendarDaysList(prev =>
      prev.map(item => (item.day === modalDate ? { ...item, hasEvent: true } : item))
    );

    setIsCalendarModalOpen(false);
    showToast(`🎉 Scheduled "${newItem.title}" on ${monthName} ${modalDate}! Reflected in Upcoming Events.`);
  };

  // Indian Rupee Formatter
  const inr = (val: number) => val.toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      {/* 4. Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white p-6 sm:p-7 shadow-sm">
        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-end pr-6">
          <svg className="w-56 h-56 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Good Morning, Admin 👋
              </h1>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
              Ready for a great day? Here is your campus overview
            </p>
          </div>

          {/* Dynamic Date & Time Badge */}
          <div className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white">
            <Clock className="w-4 h-4 text-sky-200" />
            <span className="font-medium tracking-wide">
              {currentDateTime || 'Monday, 26 October 2026 | 08:30 AM'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Summary Statistic Cards (4 cards in responsive row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div
          onClick={() => onNavigateTab('stu')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {academicMetrics.totalStudents}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 font-semibold font-mono">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                50 Active Codes
              </span>
              <span className="text-slate-500 dark:text-slate-400">Class 8-10</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Teachers */}
        <div
          onClick={() => onNavigateTab('tea')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Teachers
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {academicMetrics.totalTeachers}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 font-semibold font-mono">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                4.85 ★ Avg
              </span>
              <span className="text-slate-500 dark:text-slate-400">Dept Heads</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Fees (Paid) */}
        <div
          onClick={() => onNavigateTab('fee')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Fees (Paid)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="font-bold text-base">₹</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              ₹{academicMetrics.totalFeesCollected.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 font-semibold font-mono">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {Math.round((academicMetrics.totalFeesCollected / academicMetrics.totalFeesBilled) * 100)}%
              </span>
              <span className="text-slate-500 dark:text-slate-400">Collection rate</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Fees */}
        <div
          onClick={() => onNavigateTab('fee')}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pending Fees
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              ₹{academicMetrics.totalFeesPending.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-amber-600 font-semibold font-mono">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                Due 15 Nov
              </span>
              <span className="text-slate-500 dark:text-slate-400">50 Ledgers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 2-Column Content + Dedicated Right-Hand Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left & Center Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 6. Analytics Section (2 side-by-side cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Attendance 7-Day Bar Graph */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Daily Attendance (7-Day Trend)
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      Avg: {currentAttendanceAvg}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {currentAttendanceData.label} · Daily Turnout
                  </p>
                </div>

                {/* Class-wise Filter Dropdown */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={attendanceClassFilter}
                    onChange={e => setAttendanceClassFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  >
                    <option value="all">Overall Campus (All)</option>
                    <option value="10a">Class 10-A (Science)</option>
                    <option value="10b">Class 10-B (General)</option>
                    <option value="9a">Class 9-A</option>
                    <option value="9b">Class 9-B</option>
                    <option value="8a">Class 8-A Foundation</option>
                    <option value="11pcm">Class 11-PCM (Senior)</option>
                    <option value="12pcb">Class 12-PCB (Senior)</option>
                  </select>
                </div>
              </div>

              {/* 7-Day Bar Graph */}
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentAttendanceData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      unit="%"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#1E293B',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                      formatter={(val: number, _name: string, props: any) => [
                        `${val}% (${props.payload.present}/${props.payload.total} Present)`,
                        'Attendance'
                      ]}
                      labelFormatter={(label: string, payload: any[]) => {
                        if (payload && payload[0]) {
                          return `${label} (${payload[0].payload.fullDate})`;
                        }
                        return label;
                      }}
                    />
                    <Bar
                      dataKey="rate"
                      radius={[6, 6, 0, 0]}
                      barSize={26}
                    >
                      {currentAttendanceData.data.map((entry, index) => (
                        <Cell
                          key={`att-cell-${index}`}
                          fill={entry.rate >= 95 ? '#10B981' : entry.rate >= 88 ? '#3B82F6' : '#F59E0B'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 7-Day Performance Micro-Indicators */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>≥95% High</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>88–94% Target</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>&lt;88% Watch</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('att')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Full Roll Call →
                </button>
              </div>
            </div>

            {/* Fee Collection Status Donut Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Fee Collection Status
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Realization vs outstanding dues
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('fee')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Details
                </button>
              </div>

              {/* Donut Chart with Center Label */}
              <div className="relative h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feeDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {feeDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#1E293B',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                      formatter={(val: number) => [`₹${inr(val)}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                    72%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Collected</span>
                </div>
              </div>

              {/* Fee Legend with Amounts and Percentages */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Paid</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    ₹3.45L
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold font-mono">72%</div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Pending</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    ₹89.4K
                  </div>
                  <div className="text-[10px] text-amber-600 font-semibold font-mono">19%</div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Overdue</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    ₹42.3K
                  </div>
                  <div className="text-[10px] text-rose-600 font-semibold font-mono">9%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Upcoming Events Card (Real-time reactive to calendar double-click additions) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Upcoming Events &amp; Schedule
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    {eventsList.length} Scheduled
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Institutional exams, meetings, reminders &amp; campus activities · Double-click any calendar date to schedule
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDateDoubleClick(selectedDay)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  title="Double-click any calendar date or click here to add"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event / Reminder</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('evt')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1 px-2 py-1"
                >
                  <span>All Events</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eventsList.slice(0, 4).map(evt => {
                const typeColors: Record<string, { bg: string; text: string; border: string }> = {
                  Exam: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800/60' },
                  Meeting: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/60' },
                  Reminder: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/60' },
                  Note: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700' },
                  Event: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/60' }
                };
                const tc = typeColors[evt.type] || typeColors.Event;

                return (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-all flex items-start gap-3 group relative shadow-2xs"
                  >
                    {/* Date Badge */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        {evt.month}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                        {evt.day}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${tc.bg} ${tc.text} ${tc.border}`}>
                          {evt.type}
                        </span>
                        {(evt as any).isCustom && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            New
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                        {evt.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{evt.time}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8. Side-by-Side Companion Cards: Top Performing Students vs Students at Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Top Performing Students */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Top Performing Students
                      </h2>
                      <p className="text-[10px] text-slate-500">Cohort Academic Stars</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('stu')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                        <th className="py-2 pl-1 w-8">#</th>
                        <th className="py-2">Student</th>
                        <th className="py-2">Class</th>
                        <th className="py-2 text-right pr-1">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {topStudents.map(student => (
                        <tr key={student.rank} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="py-2 pl-1 font-mono font-bold text-slate-500">
                            #{student.rank}
                          </td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full ${student.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                {student.initials}
                              </div>
                              <span className="font-semibold text-slate-900 dark:text-white truncate">
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 text-slate-500 text-[11px]">{student.class}</td>
                          <td className="py-2 text-right pr-1">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                              {student.percentage}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Evaluated across 50 Active Students</span>
                <span className="text-emerald-600 font-semibold">100% Pass Consistency</span>
              </div>
            </div>

            {/* Right Card: Students at Risk Companion Card (Multi-Parameter Analysis) */}
            <div className="bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-950/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                          Students at Risk
                        </h2>
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[10px] font-bold font-mono">
                          {filteredStudentsAtRisk.length} Alert
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Multi-Factor: Attendance &lt;75% · Dues · Low Marks
                      </p>
                    </div>
                  </div>

                  {/* Risk Filter Buttons */}
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setRiskFilter('All')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                        riskFilter === 'All'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setRiskFilter('Critical')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                        riskFilter === 'Critical'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Critical
                    </button>
                  </div>
                </div>

                {/* Risk Students List */}
                <div className="space-y-2.5">
                  {filteredStudentsAtRisk.slice(0, 4).map(student => {
                    const isCritical = student.riskLevel === 'Critical';

                    return (
                      <div
                        key={student.id}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-6 h-6 rounded-full ${student.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                              {student.initials}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {student.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {student.class} ({student.rollNo})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider font-mono ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                              }`}
                            >
                              {student.riskLevel}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`🚨 Intervention notice sent to ${student.name}'s parents via SMS & WhatsApp.`);
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 text-[10px] font-bold transition-colors"
                              title="Send Parent Alert"
                            >
                              Intervene
                            </button>
                          </div>
                        </div>

                        {/* Multi-parameter 3-factor diagnostic row */}
                        <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                          <div>
                            <span className="text-slate-400 block text-[9px]">Attendance:</span>
                            <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
                              {student.attendanceRate}% (&lt;75%)
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">Pending Dues:</span>
                            <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                              ₹{student.pendingFeeAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block text-[9px]">Exam Avg:</span>
                            <span className="font-bold font-mono text-purple-600 dark:text-purple-400">
                              {student.examAverage}% (Low)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Automatic Remediation Engine</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('att')}
                  className="font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Risk Roster Details →
                </button>
              </div>
            </div>
          </div>

          {/* 8. Class-wise Attendance (Full-width card with circular progress indicators for Classes 6-12) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Class-wise Attendance
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Daily attendance compliance rate across grade levels
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('att')}
                className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
              >
                <span>View Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
              {classAttendance.map(item => {
                const isGood = item.rate >= 85;
                const circumference = 2 * Math.PI * 28;
                const strokeDashoffset = circumference - (item.rate / 100) * circumference;

                return (
                  <div
                    key={item.class}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    {/* Circular SVG Progress Ring */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        {/* Background Ring */}
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="5"
                          className="text-slate-200 dark:text-slate-700"
                          fill="transparent"
                        />
                        {/* Progress Ring */}
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="5"
                          className={isGood ? 'text-emerald-500' : 'text-amber-500'}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute font-extrabold text-xs text-slate-900 dark:text-white font-mono">
                        {item.rate}%
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.class}
                    </div>
                    <div
                      className={`text-[10px] font-semibold mt-0.5 ${
                        isGood ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {isGood ? 'Optimal' : 'Low'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 9. Dedicated Right-Hand Dashboard Column (4 Cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions (6 colorful action tiles in 2-column grid) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Add Student */}
              <button
                type="button"
                onClick={() => onOpenModal('student')}
                className="p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Add Student
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  New enrollment
                </div>
              </button>

              {/* 2. Add Teacher */}
              <button
                type="button"
                onClick={() => onOpenModal('teacher')}
                className="p-3 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/30 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Add Teacher
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Faculty profile
                </div>
              </button>

              {/* 3. Mark Attendance */}
              <button
                type="button"
                onClick={() => onOpenModal('attendance')}
                className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Mark Attendance
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Daily roll call
                </div>
              </button>

              {/* 4. Add Fee Record */}
              <button
                type="button"
                onClick={() => onOpenModal('fee')}
                className="p-3 rounded-xl border border-teal-100 dark:border-teal-900/40 bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/70 dark:hover:bg-teal-900/50 text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Add Fee Record
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Log collection
                </div>
              </button>

              {/* 5. Create Exam */}
              <button
                type="button"
                onClick={() => onOpenModal('exam')}
                className="p-3 rounded-xl border border-orange-100 dark:border-orange-900/40 bg-orange-50/60 dark:bg-orange-950/30 hover:bg-orange-100/70 dark:hover:bg-orange-900/50 text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Create Exam
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Schedule test
                </div>
              </button>

              {/* 6. Send Inquiry */}
              <button
                type="button"
                onClick={() => onOpenModal('inquiry')}
                className="p-3 rounded-xl border border-pink-100 dark:border-pink-900/40 bg-pink-50/60 dark:bg-pink-950/30 hover:bg-pink-100/70 dark:hover:bg-pink-900/50 text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Send className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Send Inquiry
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Log prospect
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('usr')}
                className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Activity 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    New student registered
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Aarav Patel enrolled in Class 10-A
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">10m ago</span>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Fee received
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    ₹12,000 received from Diya Sharma
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">45m ago</span>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Attendance updated
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Class 10-A morning roll call marked
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">2h ago</span>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    New inquiry received
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Kavita Verma inquired for Class 11 Science
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">3h ago</span>
                </div>
              </div>

              {/* Activity 5 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Exam result published
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Class 10 Mathematics Unit Test results published
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">5h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Calendar Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span>Calendar</span>
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCalendarMonth('April 2026')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono px-1">
                  {calendarMonth}
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarMonth('June 2026')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {daysOfWeek.map(d => (
                <span key={d} className="text-[10px] font-semibold text-slate-400">
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid with Double-Click Support */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDaysList.map((c, i) => {
                if (!c.day) {
                  return <div key={`empty-${i}`} className="h-7" />;
                }

                const isSelected = selectedDay === c.day;
                const isToday = c.isToday;

                return (
                  <button
                    key={c.day}
                    type="button"
                    onClick={() => setSelectedDay(c.day!)}
                    onDoubleClick={() => handleDateDoubleClick(c.day!)}
                    title={`Double-click to add Event, Note, Reminder, Exam, or Meeting on ${calendarMonth.split(' ')[0]} ${c.day}`}
                    className={`h-7 w-7 mx-auto rounded-lg text-xs font-mono font-medium relative flex items-center justify-center transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs scale-105'
                        : isToday
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600'
                    }`}
                  >
                    <span>{c.day}</span>
                    {c.hasEvent && !isSelected && (
                      <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Hints & Legend */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Selected ({selectedDay}th)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Active Event</span>
                </span>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  💡 Double-click any date to add
                </span>
                <button
                  type="button"
                  onClick={() => handleDateDoubleClick(selectedDay)}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Entry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Footer Status */}
      <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Academic Session 2025–2026 · Real-time Portal Active</span>
        </div>
        <div className="text-slate-400 dark:text-slate-500 text-[11px]">
          All academic, risk analysis, and administrative modules synced
        </div>
      </div>

      {/* 11. Interactive Calendar Date Modal (Opened via double-click on any date or "+ Add" button) */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Schedule for {calendarMonth.split(' ')[0]} {modalDate}, 2026
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add custom Event, Note, Reminder, Exam, or Meeting to upcoming events
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCalendarItem} className="p-6 space-y-4">
              {/* Type Selector (Event, Note, Reminder, Exam, Meeting) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Entry Category
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['Event', 'Note', 'Reminder', 'Exam', 'Meeting'] as const).map(type => {
                    const isSelected = calendarForm.type === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCalendarForm(prev => ({ ...prev, type }))}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    calendarForm.type === 'Exam'
                      ? 'e.g., Class 10 Chemistry Pre-Board Mock'
                      : calendarForm.type === 'Meeting'
                      ? 'e.g., Senior Faculty Review & Curriculum Sync'
                      : calendarForm.type === 'Reminder'
                      ? 'e.g., Submit Term 2 Attendance Ledgers'
                      : calendarForm.type === 'Note'
                      ? 'e.g., Campus Maintenance Window'
                      : 'e.g., Annual Science Exhibition & Tech Showcase'
                  }
                  value={calendarForm.title}
                  onChange={e => setCalendarForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time and Venue Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time / Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM – 11:30 AM"
                    value={calendarForm.time}
                    onChange={e => setCalendarForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hall 101 / Science Lab"
                    value={calendarForm.venue}
                    onChange={e => setCalendarForm(prev => ({ ...prev, venue: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description / Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description &amp; Action Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter details, syllabus chapters, attendees, or instructions..."
                  value={calendarForm.description}
                  onChange={e => setCalendarForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
