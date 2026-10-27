import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  CheckSquare,
  CreditCard,
  FileCheck,
  BookOpen,
  Calendar,
  Clock,
  ArrowUpRight,
  Download,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  MessageCircle,
  Send,
  X,
  ClipboardList,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { SemesterComparisonChart } from '../charts/SemesterComparisonChart';
import { academicStudents } from '../../data/mockAcademicData';

interface AveriqStudentPortalProps {
  onNavigateTab?: (tabId: string) => void;
  onOpenPayModal?: () => void;
}

export const AveriqStudentPortal: React.FC<AveriqStudentPortalProps> = ({
  onNavigateTab
}) => {
  const { showToast } = useIMS();

  const studentName = 'Rohan Sharma';
  const studentClass = 'Class 10A';
  const studentBatch = 'Science Batch 2025-26';

  // State for interactive modals
  const [showSemesterChart, setShowSemesterChart] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);
  const [messageForm, setMessageForm] = useState({
    recipient: 'Prof. Rajesh Sir (Mathematics)',
    subject: 'Doubt regarding Chapter 5 Quadratic Equations',
    body: ''
  });
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Download simulation
  const handleDownload = (fileName: string) => {
    setDownloadingFile(fileName);
    setTimeout(() => {
      setDownloadingFile(null);
      setDownloadedFiles(prev => [...prev, fileName]);
      showToast(`Downloaded: ${fileName}`);
    }, 900);
  };

  // Message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.body.trim()) return;
    setIsMessageSent(true);
    setTimeout(() => {
      setIsMessageSent(false);
      setIsMessageModalOpen(false);
      setMessageForm({
        recipient: 'Prof. Rajesh Sir (Mathematics)',
        subject: 'Doubt regarding Chapter 5 Quadratic Equations',
        body: ''
      });
      showToast('Your message has been delivered to your instructor.');
    }, 1100);
  };

  // Timetable as student sees it: Time, Subject, Topic, Status (Completed/Upcoming)
  const timetableRows = [
    {
      time: '08:00 AM – 09:00 AM',
      subject: 'Mathematics',
      topic: 'Quadratic Equations & Roots',
      status: 'Completed',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
    },
    {
      time: '09:15 AM – 10:15 AM',
      subject: 'Physics',
      topic: 'Light: Reflection & Refraction',
      status: 'Completed',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40'
    },
    {
      time: '10:30 AM – 11:30 AM',
      subject: 'English',
      topic: 'Grammar & Essay Composition',
      status: 'Completed',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
    },
    {
      time: '12:00 PM – 01:00 PM',
      subject: 'Chemistry',
      topic: 'Chemical Reactions & Equations',
      status: 'Upcoming',
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      time: '02:00 PM – 03:00 PM',
      subject: 'Biology',
      topic: 'Life Processes & Respiration',
      status: 'Upcoming',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40'
    }
  ];

  // Upcoming Tests / Assignments
  const upcomingTestsAssignments = [
    {
      id: 1,
      title: 'Unit Test – Chapter 5',
      subject: 'Mathematics',
      batch: 'Class 10 A',
      dueDate: '12 Nov 2025',
      type: 'Test',
      tagColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
    },
    {
      id: 2,
      title: 'Worksheet – Algebra & Polynomials',
      subject: 'Mathematics',
      batch: 'Class 10 A',
      dueDate: '14 Nov 2025',
      type: 'Assignment',
      tagColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
    },
    {
      id: 3,
      title: 'Monthly Test – Term 2',
      subject: 'Science (Physics & Chem)',
      batch: 'Class 10 A',
      dueDate: '18 Nov 2025',
      type: 'Test',
      tagColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
    },
    {
      id: 4,
      title: 'Homework – Trigonometric Identities',
      subject: 'Mathematics',
      batch: 'Class 10 A',
      dueDate: '20 Nov 2025',
      type: 'Assignment',
      tagColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
    }
  ];

  // Subject scores for Rohan Sharma
  const studentResults = [
    { subject: 'Mathematics', score: 78, max: 100, pct: 78, barColor: 'bg-[#0056D6]', badge: 'A' },
    { subject: 'Physics', score: 82, max: 100, pct: 82, barColor: 'bg-[#7C3AED]', badge: 'A+' },
    { subject: 'Chemistry', score: 75, max: 100, pct: 75, barColor: 'bg-[#00C853]', badge: 'B+' },
    { subject: 'English', score: 68, max: 100, pct: 68, barColor: 'bg-[#F57C00]', badge: 'B' },
    { subject: 'Social Science', score: 85, max: 100, pct: 85, barColor: 'bg-[#0284C7]', badge: 'A+' }
  ];

  // Study materials list
  const studyMaterialsList = [
    {
      title: 'Class 10 – Quadratic Equations (PDF)',
      subject: 'Mathematics',
      size: '2.4 MB',
      date: '04 Nov 2025'
    },
    {
      title: 'Class 10 – Linear Equations & Graphs (PDF)',
      subject: 'Mathematics',
      size: '1.8 MB',
      date: '02 Nov 2025'
    },
    {
      title: 'Class 10 – Physics Ray Optics Notes (PDF)',
      subject: 'Physics',
      size: '3.1 MB',
      date: '28 Oct 2025'
    },
    {
      title: 'Class 10 – Periodic Classification Worksheet (PDF)',
      subject: 'Chemistry',
      size: '1.2 MB',
      date: '25 Oct 2025'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0056D6] to-[#0284C7] text-white font-extrabold text-base flex items-center justify-center ring-4 ring-blue-500/20 shrink-0 shadow-sm">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Good Morning, {studentName} 👋
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#00C853] text-[11px] font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                Enrolled Student
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {studentClass} | Batch: {studentBatch}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Roll No:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">1001</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>16-Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards (Row 1 - 5 Cards Matching Design System) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: My Attendance: 92% (Circular Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              My Attendance
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            {/* SVG Circular Ring */}
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
                  strokeDashoffset={2 * Math.PI * 20 * (1 - 0.92)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-extrabold text-xs text-slate-900 dark:text-white font-mono">
                92%
              </span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white font-mono leading-tight">
                92%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">36 of 39 Present</div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Subjects: 8 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Subjects
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0056D6] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              8
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>All in Science Stream</span>
            </div>
          </div>
        </div>

        {/* Card 3: Today's Classes: 5 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Today's Classes
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#D32F2F] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              4 / 5
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              3 Completed · 2 Upcoming
            </div>
          </div>
        </div>

        {/* Card 4: Upcoming Tests: 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Upcoming Tests
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              3
            </div>
            <div className="text-[11px] text-purple-600 font-medium mt-1 truncate">
              Next: Math (12 Nov)
            </div>
          </div>
        </div>

        {/* Card 5: Pending Assignments: 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Pending Assignments
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#F57C00] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              2
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1 truncate">
              Due in 2 days
            </div>
          </div>
        </div>
      </div>

      {/* 3. Motivational Banner & Right Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Central Motivational Banner (7 Cols) */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0056D6] via-[#0A47B8] to-[#0284C7] text-white p-6 shadow-sm flex flex-col justify-between">
          {/* Subtle math graph overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 opacity-10 pointer-events-none flex items-center justify-end pr-4">
            <svg className="w-64 h-64 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-sm">
              <div className="text-3xl font-serif text-blue-200 leading-none">“</div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Shape Minds, Build Futures.
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">
                Keep learning, keep growing! Your persistence today powers your tomorrow.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsTimetableModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-[#0056D6] hover:bg-blue-50 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>View Full Schedule</span>
                </button>
              </div>
            </div>

            {/* High-Fidelity Study Desk Vector Illustration */}
            <div className="shrink-0 w-44 h-36 flex items-center justify-center">
              <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-md">
                {/* Chalkboard Backdrop */}
                <rect x="60" y="15" width="130" height="75" rx="6" fill="#0D253A" stroke="#334E68" strokeWidth="2.5" />
                <text x="75" y="42" fill="#60A5FA" fontSize="12" fontFamily="monospace" fontWeight="bold">a² + b² = c²</text>
                <text x="75" y="62" fill="#34D399" fontSize="10" fontFamily="sans-serif">f(x) = 2x + 5</text>
                {/* Boy Student Figure */}
                <circle cx="50" cy="50" r="18" fill="#FBBF24" />
                {/* Hair */}
                <path d="M34 46 C34 30, 66 30, 66 46 C60 38, 40 38, 34 46 Z" fill="#1E293B" />
                {/* Body / Shirt in Blue */}
                <path d="M32 75 C32 65, 68 65, 68 75 L74 125 L26 125 Z" fill="#2563EB" />
                {/* Arms on Desk */}
                <path d="M32 75 L15 105 L45 105" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
                <path d="M68 75 L85 105 L55 105" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
                {/* Study Desk */}
                <rect x="10" y="102" width="180" height="8" rx="2" fill="#94A3B8" />
                {/* Laptop on Desk */}
                <path d="M45 102 L52 82 L76 82 L83 102 Z" fill="#E2E8F0" />
                <rect x="42" y="100" width="44" height="4" rx="1" fill="#64748B" />
                <rect x="54" y="85" width="20" height="13" fill="#38BDF8" rx="1" />
                {/* Stack of Books */}
                <rect x="135" y="94" width="30" height="8" rx="1.5" fill="#EF4444" />
                <rect x="138" y="86" width="26" height="8" rx="1.5" fill="#10B981" />
                <rect x="140" y="78" width="23" height="8" rx="1.5" fill="#F59E0B" />
                {/* Desk Lamp */}
                <path d="M110 102 L110 70 L122 64" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
                <path d="M116 60 L130 68 L118 76 Z" fill="#FBBF24" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Header: Date & Today's Progress Donut (5 Cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          {/* Widget 1: Today's Date */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Today's Date
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0056D6] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                08 Nov 2025
              </div>
              <div className="text-xs text-blue-600 font-semibold mt-0.5">
                Saturday · Week 18
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              Classes end at 03:00 PM
            </div>
          </div>

          {/* Widget 2: Today's Progress (80% Completed Donut Chart) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Today's Progress
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                On Track
              </span>
            </div>

            <div className="flex items-center gap-3 my-1">
              {/* Donut Progress Ring */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-100 dark:text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-[#00C853]"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - 0.80)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-black text-xs text-slate-900 dark:text-white font-mono">
                  80%
                </span>
              </div>

              {/* Progress Legend */}
              <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00C853]" />
                    <span>Completed</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">4</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                    <span>Pending</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">1</span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-0.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-[#0056D6]" />
                    <span>Total</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">5</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-1 text-center">
              Next: Chemistry at 12:00 PM
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Today's Timetable + Recent Attendance */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Timetable (As Student Sees It: Time, Subject, Topic, Status) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0056D6]" />
                  <span>Today's Timetable</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Class 10A Science schedule for today
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTimetableModalOpen(true)}
                className="text-xs font-semibold text-[#0056D6] hover:underline flex items-center gap-1"
              >
                <span>View Full Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 pl-2">Time</th>
                    <th className="py-2.5">Subject</th>
                    <th className="py-2.5">Topic</th>
                    <th className="py-2.5 text-right pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {timetableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        <span className={`px-2 py-0.5 rounded-md ${row.color} font-semibold text-[11px] inline-block`}>
                          {row.subject}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">
                        {row.topic}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            row.status === 'Completed'
                              ? 'bg-emerald-50 text-[#00C853] border-emerald-200 dark:bg-emerald-950/40'
                              : 'bg-blue-50 text-[#0056D6] border-blue-200 dark:bg-blue-950/40'
                          }`}
                        >
                          {row.status === 'Completed' ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Attendance (92% Detailed Chart with Present / Absent) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Attendance
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Academic year cumulative attendance record
                </p>
              </div>
              <span className="text-xs font-semibold text-[#0056D6] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                View Details →
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Donut Ring */}
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
                    strokeDashoffset={2 * Math.PI * 52 * (1 - 0.92)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                    92%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Overall
                  </span>
                </div>
              </div>

              {/* Attendance Details Grid */}
              <div className="flex-1 w-full grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#00C853]" />
                    <span>Present</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#00C853] mt-1">
                    118
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Classes</div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                  <div className="flex items-center justify-center gap-1.5 text-rose-700 dark:text-rose-300 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                    <span>Absent</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#D32F2F] mt-1">
                    7
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Classes</div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center justify-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#0056D6]" />
                    <span>Total</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-[#0056D6] mt-1">
                    125
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sessions</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Eligibility criteria satisfied for board examination</span>
              </span>
              <span className="font-mono text-slate-400">Term 1 (2025-26)</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Upcoming Tests + Results + Study Material */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Tests / Assignments Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-purple-600" />
                <span>Upcoming Tests / Assignments</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('ex') : null}
                className="text-xs font-semibold text-[#0056D6] hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingTestsAssignments.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.tagColor}`}>
                        {item.type}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>{item.subject}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">{item.dueDate}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#0056D6] shrink-0">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My Results Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#0056D6]" />
                  <span>My Results</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Recent subject test scores
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#0056D6] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-lg">
                  Avg: 77.6%
                </span>
                <button
                  type="button"
                  onClick={() => setShowSemesterChart(!showSemesterChart)}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  {showSemesterChart ? 'Score Bars' : 'Sem 1 vs 2 Chart'}
                </button>
              </div>
            </div>

            {showSemesterChart ? (
              <div className="pt-2">
                <SemesterComparisonChart
                  sem1={academicStudents[0].semesters.sem1}
                  sem2={academicStudents[0].semesters.sem2}
                  studentName="Rohan Sharma"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {studentResults.map(res => (
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
                    {/* Visual Progress Bar */}
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

          {/* Study Material Download Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Study Material</span>
              </h3>
              <span className="text-xs text-slate-500">
                Class 10 Syllabus
              </span>
            </div>

            <div className="space-y-2.5">
              {studyMaterialsList.map(mat => {
                const isDownloaded = downloadedFiles.includes(mat.title);
                const isDownloading = downloadingFile === mat.title;

                return (
                  <div
                    key={mat.title}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-[#D32F2F] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {mat.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {mat.subject} · {mat.size}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(mat.title)}
                      disabled={isDownloading}
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        isDownloaded
                          ? 'text-[#00C853] bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-slate-400 hover:text-[#0056D6] hover:bg-blue-50 dark:hover:bg-slate-800'
                      }`}
                      title={isDownloaded ? 'Downloaded' : 'Download File'}
                    >
                      {isDownloaded ? (
                        <Check className="w-4 h-4 text-[#00C853]" />
                      ) : (
                        <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-[#0056D6]' : ''}`} />
                      )}
                    </button>
                  </div>
                );
              })}
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
              You can message the teacher or institute admin anytime regarding homework, doubts, or schedules.
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

      {/* 6. Footer Motivation Banner */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border border-blue-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#0056D6] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              Your hard work will pay off! Keep learning, keep growing.
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400 font-medium">
              Averiq – Smart School Management System
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right font-medium">
          Semester 1 · Academic Year 2025-26
        </div>
      </div>

      {/* MODAL: Send Message to Teacher / Admin */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#0056D6]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Message Teacher or Admin
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
                  <option value="Prof. Rajesh Sir (Mathematics)">Prof. Rajesh Sir (Mathematics)</option>
                  <option value="Dr. Neha Ma'am (Physics)">Dr. Neha Ma'am (Physics)</option>
                  <option value="Amit Sir (Chemistry)">Amit Sir (Chemistry)</option>
                  <option value="Priya Ma'am (English)">Priya Ma'am (English)</option>
                  <option value="School Academic Office">School Academic Office</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Topic
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
                  Your Message or Question
                </label>
                <textarea
                  rows={4}
                  value={messageForm.body}
                  onChange={e => setMessageForm({ ...messageForm, body: e.target.value })}
                  placeholder="Describe your question or doubt in detail..."
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              {isMessageSent ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-center font-semibold">
                  Message delivered successfully to {messageForm.recipient}!
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

      {/* MODAL: Full Timetable Schedule */}
      {isTimetableModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0056D6]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Class 10A Science – Complete Weekly Timetable
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTimetableModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Time</th>
                    <th className="py-2.5">Subject</th>
                    <th className="py-2.5">Teacher</th>
                    <th className="py-2.5">Room</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {timetableRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-mono text-slate-700 dark:text-slate-300">{r.time}</td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{r.subject}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-400">
                        {r.subject === 'Mathematics' ? 'Rajesh Sir' : r.subject === 'Physics' ? "Neha Ma'am" : r.subject === 'English' ? "Priya Ma'am" : 'Amit Sir'}
                      </td>
                      <td className="py-2.5 text-slate-500">Room 101</td>
                      <td className="py-2.5 text-right font-medium">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${r.status === 'Completed' ? 'bg-emerald-50 text-[#00C853]' : 'bg-blue-50 text-[#0056D6]'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTimetableModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
