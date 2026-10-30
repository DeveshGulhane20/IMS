import React, { useState, useEffect, useMemo } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  Users,
  CheckSquare,
  CreditCard,
  FileCheck,
  Calendar,
  Bell,
  MessageCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  Send,
  X,
  Check,
  Megaphone,
  UserCheck,
  Building,
  GraduationCap,
  ClipboardList
} from 'lucide-react';
import { SemesterComparisonChart } from '../charts/SemesterComparisonChart';
import { academicStudents } from '../../data/mockAcademicData';
import { HomeworkService } from '../../services/homeworkService';

interface AveriqParentPortalProps {
  onNavigateTab?: (tabId: string) => void;
  onOpenPayModal?: () => void;
}

// Dynamic helper to build linked children profiles
const buildChildrenFromAcademic = () => {
  const rohan = academicStudents.find(s => s.id === 'stu-001') || academicStudents[0];
  const ananya = academicStudents.find(s => s.id === 'stu-015' || s.name.includes('Ananya')) || academicStudents[14];

  const hwRohan = HomeworkService.getStudentHomeworkSummary('stu-001', 'batch-10a');
  const hwAnanya = HomeworkService.getStudentHomeworkSummary(ananya.id, ananya.batchId);

  return [
    {
      id: 'rohan',
      studentId: rohan.id,
      batchId: rohan.batchId,
      name: rohan.name,
      class: rohan.gradeLevel,
      section: `${rohan.gradeLevel} | ${rohan.batchName}`,
      rollNo: rohan.rollNumber,
      attendance: rohan.attendance.overallPercentage,
      presentClasses: rohan.attendance.presentDays,
      absentClasses: rohan.attendance.absentDays,
      totalClasses: rohan.attendance.totalWorkingDays,
      totalFee: rohan.fees.totalFee,
      paidFee: rohan.fees.paidFee,
      pendingFee: rohan.fees.pendingFee,
      nextExam: 'Mathematics Unit Test 5',
      nextExamDate: '12 Nov 2026',
      avgScore: 78,
      homeworkPending: hwRohan.pending,
      homeworkCompleted: hwRohan.completed,
      homeworkTotal: hwRohan.total,
      homeworkItems: hwRohan.items,
      results: [
        { subject: 'Mathematics', score: 78, max: 100, pct: 78, barColor: 'bg-[#0056D6]' },
        { subject: 'Physics', score: 82, max: 100, pct: 82, barColor: 'bg-[#7C3AED]' },
        { subject: 'Chemistry', score: 75, max: 100, pct: 75, barColor: 'bg-[#00C853]' },
        { subject: 'English', score: 68, max: 100, pct: 68, barColor: 'bg-[#F57C00]' },
        { subject: 'Social Science', score: 85, max: 100, pct: 85, barColor: 'bg-[#0284C7]' }
      ],
      timetable: [
        { time: '08:00 AM – 09:00 AM', subject: 'Mathematics', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
        { time: '09:15 AM – 10:15 AM', subject: 'Physics', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
        { time: '10:30 AM – 11:30 AM', subject: 'English', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
        { time: '02:00 PM – 03:00 PM', subject: 'Chemistry', status: 'Upcoming', icon: Clock, color: 'text-blue-600' }
      ]
    },
    {
      id: 'ananya',
      studentId: ananya.id,
      batchId: ananya.batchId,
      name: ananya.name,
      class: ananya.gradeLevel,
      section: `${ananya.gradeLevel} | ${ananya.batchName}`,
      rollNo: ananya.rollNumber,
      attendance: ananya.attendance.overallPercentage,
      presentClasses: ananya.attendance.presentDays,
      absentClasses: ananya.attendance.absentDays,
      totalClasses: ananya.attendance.totalWorkingDays,
      totalFee: ananya.fees.totalFee,
      paidFee: ananya.fees.paidFee,
      pendingFee: ananya.fees.pendingFee,
      nextExam: 'Science & Environment',
      nextExamDate: '15 Nov 2026',
      avgScore: 89,
      homeworkPending: hwAnanya.pending,
      homeworkCompleted: hwAnanya.completed,
      homeworkTotal: hwAnanya.total,
      homeworkItems: hwAnanya.items,
      results: [
        { subject: 'Mathematics', score: 92, max: 100, pct: 92, barColor: 'bg-[#0056D6]' },
        { subject: 'General Science', score: 95, max: 100, pct: 95, barColor: 'bg-[#7C3AED]' },
        { subject: 'Social Studies', score: 88, max: 100, pct: 88, barColor: 'bg-[#00C853]' },
        { subject: 'English Grammar', score: 84, max: 100, pct: 84, barColor: 'bg-[#F57C00]' },
        { subject: 'Hindi Literature', score: 90, max: 100, pct: 90, barColor: 'bg-[#0284C7]' }
      ],
      timetable: [
        { time: '08:00 AM – 09:00 AM', subject: 'English Grammar', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
        { time: '09:15 AM – 10:15 AM', subject: 'General Science', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
        { time: '10:30 AM – 11:30 AM', subject: 'Mathematics', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
        { time: '02:00 PM – 03:00 PM', subject: 'Social Studies', status: 'Upcoming', icon: Clock, color: 'text-blue-600' }
      ]
    }
  ];
};

export const AveriqParentPortal: React.FC<AveriqParentPortalProps> = ({
  onNavigateTab
}) => {
  const { showToast } = useIMS();

  // Multi-child profiles synchronized dynamically
  const [children, setChildren] = useState(buildChildrenFromAcademic);

  const [selectedChildId, setSelectedChildId] = useState('rohan');
  const activeChild = children.find(c => c.id === selectedChildId) || children[0];

  // Cross-role synchronization
  useEffect(() => {
    const handleSync = () => {
      setChildren(buildChildrenFromAcademic());
    };

    window.addEventListener('averiq_attendance_updated', handleSync);
    window.addEventListener('averiq_homework_updated', handleSync);
    window.addEventListener('averiq_fees_updated', handleSync);

    return () => {
      window.removeEventListener('averiq_attendance_updated', handleSync);
      window.removeEventListener('averiq_homework_updated', handleSync);
      window.removeEventListener('averiq_fees_updated', handleSync);
    };
  }, []);

  // Fee payment state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(activeChild.pendingFee || 2000);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isPaying, setIsPaying] = useState(false);
  const [isPaySuccess, setIsPaySuccess] = useState(false);
  const [showSemesterComparison, setShowSemesterComparison] = useState(false);

  // Keep payment amount synced when switching child
  useEffect(() => {
    setPayAmount(activeChild.pendingFee);
  }, [selectedChildId, activeChild.pendingFee]);

  // Message modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageForm, setMessageForm] = useState({
    recipient: 'Principal & Academic Office',
    subject: `Academic Progress Inquiry for ${activeChild.name}`,
    body: ''
  });
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Payment handler
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsPaySuccess(true);

      const targetId = activeChild.studentId;
      const match = academicStudents.find(s => s.id === targetId);
      if (match) {
        match.fees.paidFee += payAmount;
        match.fees.pendingFee = Math.max(0, match.fees.totalFee - match.fees.paidFee);
        match.fees.transactions.unshift({
          id: `txn-${Date.now()}`,
          receiptNo: `REC-${Date.now().toString().slice(-6)}`,
          amount: payAmount,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          mode: paymentMethod,
          status: 'Completed',
          referenceNo: `REF-${Date.now().toString().slice(-6)}`,
          description: 'Term Fee Online Payment'
        });
      }

      setChildren(buildChildrenFromAcademic());

      window.dispatchEvent(new CustomEvent('averiq_fees_updated', {
        detail: { studentId: targetId, amount: payAmount }
      }));

      setTimeout(() => {
        setIsPaySuccess(false);
        setIsPayModalOpen(false);
        showToast(`Payment of ₹${payAmount.toLocaleString('en-IN')} for ${activeChild.name} completed successfully!`);
      }, 1000);
    }, 1200);
  };

  // Message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.body.trim()) return;
    setIsMessageSent(true);
    setTimeout(() => {
      setIsMessageSent(false);
      setIsMessageModalOpen(false);
      setMessageForm({
        recipient: 'Principal & Academic Office',
        subject: `Academic Progress Inquiry for ${activeChild.name}`,
        body: ''
      });
      showToast('Your message has been delivered to the school administration.');
    }, 1100);
  };

  // Recent School Notices
  const schoolNotices = [
    {
      id: 1,
      title: 'Parent Teacher Meeting – 15 Nov 2025',
      date: '08 Nov 2025',
      desc: 'Annual Semester 1 progress interaction. Timings: 10:00 AM - 01:00 PM.'
    },
    {
      id: 2,
      title: 'Winter Break Holiday Notice',
      date: '05 Nov 2025',
      desc: 'School will observe winter break from 24 Dec 2025 to 02 Jan 2026.'
    },
    {
      id: 3,
      title: 'Exam Schedule Released',
      date: '03 Nov 2025',
      desc: 'Admit cards for December Term 2 examinations now available.'
    }
  ];

  // Upcoming Tests for child
  const upcomingTests = [
    {
      id: 1,
      title: 'Unit Test – Chapter 5',
      subject: 'Mathematics',
      dueDate: '12 Nov 2025',
      type: 'Exam'
    },
    {
      id: 2,
      title: 'Worksheet – Algebra',
      subject: 'Mathematics',
      dueDate: '14 Nov 2025',
      type: 'Assignment'
    },
    {
      id: 3,
      title: 'Monthly Test – Term 2',
      subject: 'Science',
      dueDate: '18 Nov 2025',
      type: 'Exam'
    },
    {
      id: 4,
      title: 'Homework – Trigonometry',
      subject: 'Mathematics',
      dueDate: '20 Nov 2025',
      type: 'Assignment'
    }
  ];

  const inr = (n: number) => n.toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Child Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0056D6] to-[#7C3AED] text-white font-extrabold text-base flex items-center justify-center ring-4 ring-blue-500/20 shrink-0 shadow-sm">
            MS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome Back, Mr. & Mrs. Sharma 👋
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0056D6] text-[11px] font-semibold border border-blue-200">
                Parent Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Averiq High School · {activeChild.section}
            </p>
          </div>
        </div>

        {/* Child Selector Switcher Card */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">
            Active Child:
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            {children.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedChildId(c.id);
                  setPayAmount(c.pendingFee);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedChildId === c.id
                    ? 'bg-[#0056D6] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${selectedChildId === c.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                  {c.class}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Motivational Banner & Right Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Banner: "Your Child, Our Focus" (7 Cols) */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0056D6] via-[#1D4ED8] to-[#0284C7] text-white p-6 shadow-sm flex flex-col justify-between">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parent Partnership Suite</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Your Child, Our Focus
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">
                Stay informed. Stay connected. Monitor {activeChild.name}'s daily attendance, scores, and fee records in real time.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-[#0056D6] hover:bg-blue-50 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Message School Desk</span>
                </button>
              </div>
            </div>

            {/* High-Fidelity Family & Student Vector Graphic */}
            <div className="shrink-0 w-44 h-36 flex items-center justify-center">
              <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
                {/* Background Window */}
                <rect x="40" y="20" width="120" height="70" rx="8" fill="#0D253A" stroke="#334E68" strokeWidth="2" />
                <path d="M100 20 L100 90 M40 55 L160 55" stroke="#334E68" strokeWidth="2" />
                {/* Mother Figure */}
                <circle cx="58" cy="54" r="14" fill="#FBBF24" />
                <path d="M44 52 C44 38, 72 38, 72 52 C68 44, 48 44, 44 52 Z" fill="#6B21A8" />
                <path d="M42 76 C42 66, 74 66, 74 76 L78 125 L38 125 Z" fill="#9333EA" />
                {/* Father Figure */}
                <circle cx="142" cy="50" r="15" fill="#FBBF24" />
                <path d="M128 48 C128 34, 156 34, 156 48 C152 40, 132 40, 128 48 Z" fill="#1E293B" />
                <path d="M124 74 C124 64, 160 64, 160 74 L165 125 L120 125 Z" fill="#1D4ED8" />
                {/* Child Figure in Center */}
                <circle cx="100" cy="70" r="13" fill="#FBBF24" />
                <path d="M88 68 C88 56, 112 56, 112 68 Z" fill="#1E293B" />
                <path d="M86 88 C86 80, 114 80, 114 88 L116 125 L84 125 Z" fill="#10B981" />
                {/* Desk with Tablet */}
                <rect x="25" y="112" width="150" height="7" rx="2" fill="#94A3B8" />
                <rect x="80" y="100" width="40" height="15" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="100" cy="107" r="3" fill="#38BDF8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Header: Date & Fee Summary Widget with prominent Pay Now (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Fee Summary
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Current term tuition for {activeChild.name}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
              08 Nov 2025
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Total Fee</span>
              <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white mt-0.5 block">
                ₹{inr(activeChild.totalFee)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block flex items-center justify-center gap-1">
                <Check className="w-3 h-3 text-[#00C853]" /> Paid
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-[#00C853] mt-0.5 block">
                ₹{inr(activeChild.paidFee)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
              <span className="text-[10px] text-amber-700 dark:text-amber-300 block flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-[#F57C00]" /> Pending
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-[#F57C00] mt-0.5 block">
                ₹{inr(activeChild.pendingFee)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {activeChild.pendingFee > 0 ? 'Due by 15 Nov 2025' : 'All clear for this term'}
            </span>
            <button
              type="button"
              onClick={() => setIsPayModalOpen(true)}
              disabled={activeChild.pendingFee <= 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 ${
                activeChild.pendingFee > 0
                  ? 'bg-[#0056D6] hover:bg-blue-600 text-white cursor-pointer'
                  : 'bg-emerald-50 text-[#00C853] border border-emerald-200 cursor-default'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{activeChild.pendingFee > 0 ? `Pay Now (₹${inr(activeChild.pendingFee)})` : 'Fee Fully Paid'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. KPI Cards (Row 1 - Top Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Attendance: 92% (Circular Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Attendance
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              Optimal (≥75%)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-[#00C853]"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - activeChild.attendance / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-black text-xs text-slate-900 dark:text-white font-mono">
                {activeChild.attendance}%
              </span>
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono leading-tight">
                {activeChild.attendance}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {activeChild.presentClasses} of {activeChild.totalClasses} Classes
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Fees */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pending Fees
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#F57C00] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              ₹{inr(activeChild.pendingFee)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">Term 1 Dues</span>
              {activeChild.pendingFee > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(true)}
                  className="text-[11px] font-bold text-[#0056D6] hover:underline"
                >
                  Pay Now →
                </button>
              ) : (
                <span className="text-emerald-600 font-semibold">Cleared</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Next Exam */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Next Exam
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 dark:text-white truncate">
              {activeChild.nextExam}
            </div>
            <div className="text-[11px] text-purple-600 font-medium mt-0.5">
              {activeChild.nextExamDate} · 10:00 AM
            </div>
          </div>
        </div>

        {/* Card 4: Subject Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Subject Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00C853] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeChild.avgScore}% Avg.
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Above Class Average (+6%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (6 Cols): Attendance Overview + Latest Results */}
        <div className="lg:col-span-6 space-y-6">
          {/* Attendance Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Attendance Overview
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Term 1 participation logs for {activeChild.name}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#0056D6] hover:underline cursor-pointer">
                View Details →
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Donut Chart */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-100 dark:text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-[#00C853]"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - activeChild.attendance / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {activeChild.attendance}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Overall
                  </span>
                </div>
              </div>

              {/* Attendance Details Grid */}
              <div className="flex-1 w-full space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00C853]" />
                    <span>Present</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {activeChild.presentClasses} Classes
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F]" />
                    <span>Absent</span>
                  </span>
                  <span className="font-mono font-bold text-[#D32F2F]">
                    {activeChild.absentClasses} Classes
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0056D6]" />
                    <span>Total Classes</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {activeChild.totalClasses} Classes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Results Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Latest Results
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Academic performance breakdown
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSemesterComparison(!showSemesterComparison)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0056D6] hover:bg-blue-100 transition-colors"
              >
                {showSemesterComparison ? 'Hide Comparison' : 'Sem 1 vs Sem 2 Chart →'}
              </button>
            </div>

            {showSemesterComparison ? (
              <div className="pt-2">
                <SemesterComparisonChart
                  sem1={
                    (selectedChildId === 'ananya' ? academicStudents[14] : academicStudents[0]).semesters.sem1
                  }
                  sem2={
                    (selectedChildId === 'ananya' ? academicStudents[14] : academicStudents[0]).semesters.sem2
                  }
                  studentName={activeChild.name}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {activeChild.results.map(res => (
                  <div key={res.subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {res.subject}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {res.score}/{res.max}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">
                          {res.pct}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${res.barColor} transition-all duration-500`}
                        style={{ width: `${res.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (6 Cols): Timetable + Upcoming Tests + Recent Notices */}
        <div className="lg:col-span-6 space-y-6">
          {/* Today's Timetable */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0056D6]" />
                <span>Today's Timetable</span>
              </h3>
              <span className="text-xs font-semibold text-[#0056D6] hover:underline cursor-pointer">
                View Full Timetable →
              </span>
            </div>

            <div className="space-y-2.5">
              {activeChild.timetable.map((cls, idx) => {
                const Icon = cls.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 ${cls.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {cls.subject}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {cls.time}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        cls.status === 'Completed'
                          ? 'bg-emerald-50 text-[#00C853] border-emerald-200'
                          : 'bg-blue-50 text-[#0056D6] border-blue-200'
                      }`}
                    >
                      {cls.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Tests / Homework Assignments */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-purple-600" />
                  <span>Homework & Assigned Tasks</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Real-time status for {activeChild.name}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('hw') : null}
                className="text-xs text-[#0056D6] font-semibold hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {(activeChild.homeworkItems && activeChild.homeworkItems.length > 0) ? (
                activeChild.homeworkItems.slice(0, 4).map(item => {
                  const isDone = item.record.status === 'DONE';
                  return (
                    <div
                      key={item.homework.id}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                            {item.homework.subject}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.homework.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Teacher: {item.homework.teacherName} · Due: {item.homework.dueDate}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                          isDone
                            ? 'bg-emerald-50 text-[#00C853] border-emerald-200 dark:bg-emerald-950/40'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40'
                        }`}
                      >
                        {isDone ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  );
                })
              ) : (
                upcomingTests.map(test => (
                  <div
                    key={test.id}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {test.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {test.subject}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-purple-600 font-semibold">
                      {test.dueDate}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Notices */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-rose-500" />
                <span>Recent Notices</span>
              </h3>
              <span className="text-xs text-[#0056D6] font-semibold hover:underline cursor-pointer">
                View All →
              </span>
            </div>

            <div className="space-y-2.5">
              {schoolNotices.map(notice => (
                <div
                  key={notice.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {notice.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#0056D6] font-semibold shrink-0">
                      {notice.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {notice.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Support Banner Widget */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Have any questions?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              You can message the institute anytime regarding attendance, transport, or syllabus.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMessageModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Message</span>
        </button>
      </div>

      {/* Pay Now Modal for Parents */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#0056D6]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Pay School Fee – {activeChild.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePayment} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border space-y-1">
                <div className="text-slate-500">Student: <strong>{activeChild.name}</strong> ({activeChild.class})</div>
                <div className="text-slate-500">Current Outstanding Due: <strong className="font-mono text-[#F57C00]">₹{inr(activeChild.pendingFee)}</strong></div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={activeChild.pendingFee || 10000}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-mono font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-xl border text-center font-semibold ${
                      paymentMethod === 'UPI' ? 'border-[#0056D6] bg-blue-50 text-[#0056D6] dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-2.5 rounded-xl border text-center font-semibold ${
                      paymentMethod === 'Card' ? 'border-[#0056D6] bg-blue-50 text-[#0056D6] dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-2.5 rounded-xl border text-center font-semibold ${
                      paymentMethod === 'NetBanking' ? 'border-[#0056D6] bg-blue-50 text-[#0056D6] dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>
              </div>

              {isPaySuccess ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-center font-semibold">
                  Payment Received! Official receipt issued to registered email.
                </div>
              ) : (
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPaying}
                    className="px-5 py-2 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    {isPaying ? 'Processing...' : `Pay ₹${inr(payAmount)}`}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Message Modal for Parents */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#0056D6]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Message Institute
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient
                </label>
                <select
                  value={messageForm.recipient}
                  onChange={e => setMessageForm({ ...messageForm, recipient: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Principal & Academic Office">Principal & Academic Office</option>
                  <option value="Class 10A Teacher (Prof. Rajesh Sir)">Class 10A Teacher (Prof. Rajesh Sir)</option>
                  <option value="Accounts & Billing Desk">Accounts & Billing Desk</option>
                  <option value="Transportation Desk">Transportation Desk</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={e => setMessageForm({ ...messageForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={messageForm.body}
                  onChange={e => setMessageForm({ ...messageForm, body: e.target.value })}
                  placeholder={`Write your inquiry regarding ${activeChild.name}...`}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              {isMessageSent ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-center font-semibold">
                  Your message has been received by the institute.
                </div>
              ) : (
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-semibold shadow-xs"
                  >
                    Send Message
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
