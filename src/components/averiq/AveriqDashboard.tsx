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
  ArrowRight
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

export const AveriqDashboard: React.FC<AveriqDashboardProps> = ({
  onNavigateTab,
  onOpenModal
}) => {
  const { students, teachers, feePayments, tests } = useIMS();

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

  // Reporting period for enrollment chart
  const [enrollmentPeriod, setEnrollmentPeriod] = useState<'6m' | '1y' | '3m'>('6m');

  // Enrollment bar chart data (December to May)
  const enrollmentData = [
    { month: 'Dec', students: 38 },
    { month: 'Jan', students: 54 },
    { month: 'Feb', students: 48 },
    { month: 'Mar', students: 68 },
    { month: 'Apr', students: 82 },
    { month: 'May', students: 96 }
  ];

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

  // Upcoming Events data from dynamic dataset
  const upcomingEvents = academicEvents
    .filter(e => e.type === 'Upcoming')
    .slice(0, 4)
    .map((e, idx) => {
      const dateParts = e.date.split('-');
      const day = dateParts[2] || '15';
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthIdx = parseInt(dateParts[1], 10) - 1;
      const month = monthNames[monthIdx] || 'NOV';

      return {
        id: idx + 1,
        title: e.title,
        date: `${day} ${month}`,
        month,
        day,
        time: e.time,
        venue: e.venue
      };
    });

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

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState('May 2026');
  const [selectedDay, setSelectedDay] = useState(26);

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  // May 2026 starts on Friday (index 4 for Mo=0)
  const calendarDays = [
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
  ];

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
              Here's what's happening at your school today.
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
            {/* Student Enrollment Bar Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Student Enrollment
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Monthly admissions & registrations
                  </p>
                </div>
                <select
                  value={enrollmentPeriod}
                  onChange={e => setEnrollmentPeriod(e.target.value as any)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="6m">Last 6 Months</option>
                  <option value="1y">Academic Year</option>
                  <option value="3m">Last 3 Months</option>
                </select>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 11 }}
                    />
                    <YAxis
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
                      formatter={(val: number) => [`${val} Students`, 'Admissions']}
                    />
                    <Bar
                      dataKey="students"
                      fill="#3B82F6"
                      radius={[6, 6, 0, 0]}
                      barSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
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

          {/* 7. Events and Top-Performing Students (2-column section) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upcoming Events
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigateTab('tb')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                >
                  <span>View Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {upcomingEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Date Badge */}
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col items-center justify-center text-center shrink-0">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          {evt.month}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                          {evt.day}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {evt.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {evt.time} · {evt.venue}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('tb')}
                      className="p-1.5 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Students */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Top Performing Students
                </h2>
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
                      <th className="py-2 pl-1 w-10">Rank</th>
                      <th className="py-2">Student</th>
                      <th className="py-2">Class</th>
                      <th className="py-2 text-right pr-1">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {topStudents.map(student => (
                      <tr key={student.rank} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 pl-1 font-mono font-bold text-slate-500">
                          #{student.rank}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${student.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                              {student.initials}
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-500">{student.class}</td>
                        <td className="py-2.5 text-right pr-1">
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

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.map((c, i) => {
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
                    className={`h-7 w-7 mx-auto rounded-lg text-xs font-mono font-medium relative flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : isToday
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.day}</span>
                    {c.hasEvent && !isSelected && (
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Today (26th)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Exam / Meeting</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 10. Footer Banner */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border border-blue-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              Together we build a brighter future
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400 font-medium">
              Averiq - Smart School Management System
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
          <span>Empowering academic excellence everyday · </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Trusted by 500+ Institutions</span>
        </div>
      </div>
    </div>
  );
};
