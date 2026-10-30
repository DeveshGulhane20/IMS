import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  Edit2,
  Eye,
  MoreVertical,
  Download,
  Receipt,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  ShieldAlert,
  X,
  Printer,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  GraduationCap
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
  Cell,
  Legend
} from 'recharts';
import { useIMS } from '../../context/IMSContext';

interface FeeStructureRow {
  id: string;
  className: string;
  tuitionFee: number;
  examFee: number;
  totalFee: number;
  labFee?: number;
  libraryFee?: number;
  term1Fee: number;
  term2Fee: number;
  term3Fee: number;
  totalStudents: number;
  collectedAmount: number;
  pendingAmount: number;
}

export const AveriqFeeManagement: React.FC = () => {
  const { showToast } = useIMS();

  // Top sub-nav tabs: 'class' | 'term' | 'overall'
  const [topSubTab, setTopSubTab] = useState<'class' | 'term' | 'overall'>('class');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All Classes');
  const [academicYear, setAcademicYear] = useState<string>('2025 - 26');

  // Bottom table sub-tabs: 'details' | 'class-breakdown' | 'term-breakdown'
  const [tableSubTab, setTableSubTab] = useState<'details' | 'class-breakdown' | 'term-breakdown'>('details');
  const [tableSearch, setTableSearch] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isRectificationModalOpen, setIsRectificationModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const [activeFeeRow, setActiveFeeRow] = useState<FeeStructureRow | null>(null);

  // Initial Data matching image exactly:
  // Nursery (25k + 2.5k = 27.5k), LKG (27k + 2.5k = 29.5k), UKG (30k + 3k = 33k),
  // Class 1-5 (32.5k + 2.5k = 35k), Class 6-8 (38k + 3k = 41k), Class 9-10 (49k + 4.5k = 53.5k), Class 11-12 (55k + 5.5k = 60.5k)
  const [feeStructures, setFeeStructures] = useState<FeeStructureRow[]>([
    {
      id: 'fs-nursery',
      className: 'Nursery',
      tuitionFee: 25000,
      examFee: 2500,
      totalFee: 27500,
      labFee: 1000,
      libraryFee: 1500,
      term1Fee: 11000,
      term2Fee: 9000,
      term3Fee: 7500,
      totalStudents: 120,
      collectedAmount: 2100000,
      pendingAmount: 1200000
    },
    {
      id: 'fs-lkg',
      className: 'LKG',
      tuitionFee: 27000,
      examFee: 2500,
      totalFee: 29500,
      labFee: 1200,
      libraryFee: 1500,
      term1Fee: 12000,
      term2Fee: 9500,
      term3Fee: 8000,
      totalStudents: 130,
      collectedAmount: 2450000,
      pendingAmount: 1385000
    },
    {
      id: 'fs-ukg',
      className: 'UKG',
      tuitionFee: 30000,
      examFee: 3000,
      totalFee: 33000,
      labFee: 1500,
      libraryFee: 1500,
      term1Fee: 13000,
      term2Fee: 11000,
      term3Fee: 9000,
      totalStudents: 140,
      collectedAmount: 2980000,
      pendingAmount: 1640000
    },
    {
      id: 'fs-1-5',
      className: 'Class 1 - 5',
      tuitionFee: 32500,
      examFee: 2500,
      totalFee: 35000,
      labFee: 2000,
      libraryFee: 2000,
      term1Fee: 14000,
      term2Fee: 11000,
      term3Fee: 10000,
      totalStudents: 310,
      collectedAmount: 7200000,
      pendingAmount: 3650000
    },
    {
      id: 'fs-6-8',
      className: 'Class 6 - 8',
      tuitionFee: 38000,
      examFee: 3000,
      totalFee: 41000,
      labFee: 3500,
      libraryFee: 2500,
      term1Fee: 16000,
      term2Fee: 13000,
      term3Fee: 12000,
      totalStudents: 240,
      collectedAmount: 6450000,
      pendingAmount: 3390000
    },
    {
      id: 'fs-9-10',
      className: 'Class 9 - 10',
      tuitionFee: 49000,
      examFee: 4500,
      totalFee: 53500,
      labFee: 5000,
      libraryFee: 3000,
      term1Fee: 22000,
      term2Fee: 17500,
      term3Fee: 14000,
      totalStudents: 180,
      collectedAmount: 6850500,
      pendingAmount: 2779500
    },
    {
      id: 'fs-11-12',
      className: 'Class 11 - 12',
      tuitionFee: 55000,
      examFee: 5500,
      totalFee: 60500,
      labFee: 7000,
      libraryFee: 3500,
      term1Fee: 25000,
      term2Fee: 20000,
      term3Fee: 15500,
      totalStudents: 120,
      collectedAmount: 4370000,
      pendingAmount: 2290000
    }
  ]);

  // Form for Add/Edit Fee Structure
  const [formData, setFormData] = useState({
    className: '',
    tuitionFee: 30000,
    examFee: 3000,
    labFee: 2000,
    libraryFee: 1500
  });

  // Recent Updates list matching screenshot:
  const [recentUpdates, setRecentUpdates] = useState([
    {
      id: 'up-1',
      title: 'Fee structure updated for Class 9',
      meta: 'By Admin • 18 Apr 2025, 11:24 AM',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'up-2',
      title: 'Term 2 fee collection started',
      meta: 'By Admin • 15 Apr 2025, 04:32 PM',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'up-3',
      title: 'Rectification request approved',
      meta: 'By Admin • 14 Apr 2025, 01:15 PM',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    },
    {
      id: 'up-4',
      title: 'New class (Class 11-12) added',
      meta: 'By Admin • 12 Apr 2025, 09:20 AM',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    }
  ]);

  // Helper INR formatter
  const formatInr = (n: number) => {
    return Number(n).toLocaleString('en-IN');
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    return feeStructures.filter(row => {
      const matchSearch =
        row.className.toLowerCase().includes(tableSearch.toLowerCase()) ||
        row.totalFee.toString().includes(tableSearch);
      const matchClass =
        selectedClassFilter === 'All Classes' || row.className === selectedClassFilter;
      return matchSearch && matchClass;
    });
  }, [feeStructures, tableSearch, selectedClassFilter]);

  // Chart 1: Fee Structure by Class (Bar Chart with Total Fee, Paid, Pending)
  // Matching the visual values from the chart:
  // Nursery (~₹6L total, ~₹4.5L paid, ~₹3.5L pending)
  // LKG (~₹7L total, ~₹5L paid, ~₹4.5L pending)
  // UKG (~₹9L total, ~₹6.5L paid, ~₹5.5L pending)
  // Class 1-5 (~₹13L total, ~₹9L paid, ~₹6.5L pending)
  // Class 6-8 (~₹17L total, ~₹11L paid, ~₹7.5L pending)
  // Class 9-10 (~₹18.5L total, ~₹12L paid, ~₹8L pending)
  // Class 11-12 (~₹14L total, ~₹9.5L paid, ~₹7.5L pending)
  const barChartData = [
    { name: 'Nursery', total: 6.2, paid: 4.2, pending: 3.2 },
    { name: 'LKG', total: 7.4, paid: 5.1, pending: 4.4 },
    { name: 'UKG', total: 9.2, paid: 6.6, pending: 5.5 },
    { name: 'Class 1-5', total: 13.0, paid: 8.8, pending: 6.5 },
    { name: 'Class 6-8', total: 16.8, paid: 11.2, pending: 7.6 },
    { name: 'Class 9-10', total: 18.5, paid: 12.0, pending: 8.0 },
    { name: 'Class 11-12', total: 14.2, paid: 9.6, pending: 7.2 }
  ];

  // Chart 2: Fee Collection Status (Donut 66% Collected / 34% Pending)
  const donutData = [
    { name: 'Collected', value: 66, amount: '₹ 32,40,500', color: '#10B981' }, // emerald green
    { name: 'Pending', value: 34, amount: '₹ 16,34,500', color: '#0056D6' } // primary blue
  ];

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      className: '',
      tuitionFee: 35000,
      examFee: 3000,
      labFee: 2500,
      libraryFee: 1500
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.className.trim()) {
      showToast('Please specify a class name.');
      return;
    }
    const total = formData.tuitionFee + formData.examFee;
    const newRow: FeeStructureRow = {
      id: `fs-${Date.now()}`,
      className: formData.className,
      tuitionFee: Number(formData.tuitionFee),
      examFee: Number(formData.examFee),
      totalFee: total,
      labFee: Number(formData.labFee),
      libraryFee: Number(formData.libraryFee),
      term1Fee: Math.round(total * 0.4),
      term2Fee: Math.round(total * 0.35),
      term3Fee: Math.round(total * 0.25),
      totalStudents: 100,
      collectedAmount: Math.round(total * 66),
      pendingAmount: Math.round(total * 34)
    };

    setFeeStructures([...feeStructures, newRow]);
    setIsAddModalOpen(false);
    showToast(`Fee structure for "${newRow.className}" added successfully.`);
    setRecentUpdates([
      {
        id: `up-${Date.now()}`,
        title: `New fee structure added for ${newRow.className}`,
        meta: 'By Admin • Just now',
        color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      },
      ...recentUpdates
    ]);
  };

  const handleOpenEdit = (row: FeeStructureRow) => {
    setActiveFeeRow(row);
    setFormData({
      className: row.className,
      tuitionFee: row.tuitionFee,
      examFee: row.examFee,
      labFee: row.labFee || 2000,
      libraryFee: row.libraryFee || 1500
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeeRow) return;
    const total = Number(formData.tuitionFee) + Number(formData.examFee);
    setFeeStructures(
      feeStructures.map(item =>
        item.id === activeFeeRow.id
          ? {
              ...item,
              className: formData.className,
              tuitionFee: Number(formData.tuitionFee),
              examFee: Number(formData.examFee),
              totalFee: total,
              labFee: Number(formData.labFee),
              libraryFee: Number(formData.libraryFee)
            }
          : item
      )
    );
    setIsEditModalOpen(false);
    showToast(`Updated fee structure for ${formData.className}.`);
    setRecentUpdates([
      {
        id: `up-${Date.now()}`,
        title: `Fee structure updated for ${formData.className}`,
        meta: 'By Admin • Just now',
        color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      },
      ...recentUpdates
    ]);
  };

  const handleOpenView = (row: FeeStructureRow) => {
    setActiveFeeRow(row);
    setIsViewModalOpen(true);
  };

  const handleGenerateReceipt = () => {
    setIsReceiptModalOpen(true);
  };

  const handleDownloadReport = () => {
    showToast('Exporting official Consolidated Fee Report (PDF & Excel)... Ready.');
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. HEADER BANNER & QUICK ACTIONS TOP AREA
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* Main Blue Banner */}
        <div className="flex-1 bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#2563eb] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Subtle Background Glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left Title & Icon */}
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 relative shrink-0">
              <FileSpreadsheet className="w-8 h-8 text-white" />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-md border-2 border-white dark:border-slate-900">
                ₹
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Fees Structure
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
                Define fee plans, manage categories, and keep track of fee details for each class and term.
              </p>
            </div>
          </div>

          {/* Right 3D Visual/Callout */}
          <div className="hidden sm:flex items-center gap-3 relative z-10 self-end md:self-auto">
            <div className="text-right">
              <span className="block font-serif italic font-bold text-amber-300 text-sm tracking-wide drop-shadow-sm">
                Better Education
              </span>
              <span className="block font-serif italic font-bold text-white text-xs tracking-wide">
                Brighter Future
              </span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-9 h-9 text-amber-300" />
            </div>
          </div>
        </div>

        {/* Top Right Academic Year Selector Card */}
        <div className="lg:w-60 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Academic Year
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div className="mt-3">
            <select
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2025 - 26">2025 – 26 (Current)</option>
              <option value="2024 - 25">2024 – 25 (Archived)</option>
              <option value="2026 - 27">2026 – 27 (Upcoming)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUB-NAVIGATION TABS & CLASS FILTER
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Sub-Nav Segmented Tabs: Class-wise | Term-wise | Overall */}
        <div className="inline-flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          <button
            type="button"
            onClick={() => setTopSubTab('class')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              topSubTab === 'class'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Class-wise
          </button>
          <button
            type="button"
            onClick={() => setTopSubTab('term')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              topSubTab === 'term'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Term-wise
          </button>
          <button
            type="button"
            onClick={() => setTopSubTab('overall')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              topSubTab === 'overall'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overall
          </button>
        </div>

        {/* All Classes Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedClassFilter}
            onChange={e => setSelectedClassFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Classes">All Classes</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="Class 1 - 5">Class 1 - 5</option>
            <option value="Class 6 - 8">Class 6 - 8</option>
            <option value="Class 9 - 10">Class 9 - 10</option>
            <option value="Class 11 - 12">Class 11 - 12</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
          2. TOP 5 METRIC CARDS
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Students */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">1,240</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            6% vs last year
          </div>
        </div>

        {/* Card 2: Total Fee (This Year) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Fee (This Year)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">₹ 48,75,000</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            12% vs last year
          </div>
        </div>

        {/* Card 3: Collected Amount */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Collected Amount</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">₹ 32,40,500</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            18% vs last year
          </div>
        </div>

        {/* Card 4: Pending Amount */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pending Amount</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">₹ 16,34,500</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] font-bold text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
            5% vs last year
          </div>
        </div>

        {/* Card 5: Total Due Students */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Due Students</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">342</span>
          </div>
          <div className="mt-1 flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
            7% vs last year
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN CONTENT (ANALYTICS & TABLES) + RIGHT SIDEBAR (QUICK ACTIONS)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 Columns: Charts and Fee Structure Details Table */}
        <div className="lg:col-span-3 space-y-6">
          {/* Charts Row: Fee Structure by Class & Fee Collection Status */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Chart 1: Fee Structure by Class (Span 3) */}
            <div className="md:col-span-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Fee Structure by Class
                </h3>
                <button
                  type="button"
                  onClick={() => setTableSubTab('class-breakdown')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View Details</span>
                  <span>→</span>
                </button>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-end gap-3 text-[11px] mb-2 font-medium">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0056D6]" />
                  Total Fee
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  Paid
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  Pending
                </span>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={val => `₹ ${val}L`}
                      domain={[0, 20]}
                      ticks={[0, 5, 10, 15, 20]}
                    />
                    <Tooltip
                      formatter={(val: any) => [`₹ ${val} Lakhs`, '']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px'
                      }}
                    />
                    <Bar dataKey="total" fill="#0056D6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="paid" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Fee Collection Status (Span 2) */}
            <div className="md:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Fee Collection Status
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                {/* Donut Chart with Center Text */}
                <div className="w-36 h-36 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={58}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                      66%
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Collected
                    </span>
                  </div>
                </div>

                {/* Details Breakdown on Right */}
                <div className="space-y-3 text-xs w-full">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                      Collected
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">66%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0056D6]" />
                      Pending
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">34%</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Collected Amount</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹ 32,40,500
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pending Amount</span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                        ₹ 16,34,500
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Structure Details Table Section */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            {/* Table Sub-Tabs & Search/Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTableSubTab('details')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    tableSubTab === 'details'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Fee Structure Details
                </button>
                <button
                  type="button"
                  onClick={() => setTableSubTab('class-breakdown')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    tableSubTab === 'class-breakdown'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Class-wise Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => setTableSubTab('term-breakdown')}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    tableSubTab === 'term-breakdown'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Term-wise Breakdown
                </button>
              </div>

              {/* Search & Filter Button */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by class or fee head..."
                    value={tableSearch}
                    onChange={e => setTableSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 sm:w-60"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Opening advanced fee head filter...')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Fee Structure Details Table */}
            {tableSubTab === 'details' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Class</th>
                      <th className="py-3 px-3">Tuition Fee (₹)</th>
                      <th className="py-3 px-3">Exam Fee (₹)</th>
                      <th className="py-3 px-3">Total Fee (₹)</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredRows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          {row.className}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                          {formatInr(row.tuitionFee)}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                          {formatInr(row.examFee)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {formatInr(row.totalFee)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1 text-slate-500">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(row)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                              title="Edit Fee Structure"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenView(row)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast(`Actions for ${row.className}: Lock fee, Archive, or Print Voucher.`)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                              title="More Options"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-Tab 2: Class-wise Breakdown Table */}
            {tableSubTab === 'class-breakdown' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Class</th>
                      <th className="py-3 px-3">Students</th>
                      <th className="py-3 px-3">Gross Expected (₹)</th>
                      <th className="py-3 px-3">Collected (₹)</th>
                      <th className="py-3 px-3">Pending (₹)</th>
                      <th className="py-3 px-3 text-right">Recovery %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredRows.map(row => {
                      const recovery = Math.round((row.collectedAmount / (row.collectedAmount + row.pendingAmount)) * 100);
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            {row.className}
                          </td>
                          <td className="py-3 px-3 font-mono">{row.totalStudents}</td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                            ₹ {formatInr(row.collectedAmount + row.pendingAmount)}
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            ₹ {formatInr(row.collectedAmount)}
                          </td>
                          <td className="py-3 px-3 font-mono text-rose-600 dark:text-rose-400 font-bold">
                            ₹ {formatInr(row.pendingAmount)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                            {recovery}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sub-Tab 3: Term-wise Breakdown Table */}
            {tableSubTab === 'term-breakdown' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3">Class</th>
                      <th className="py-3 px-3">Term 1 (₹)</th>
                      <th className="py-3 px-3">Term 2 (₹)</th>
                      <th className="py-3 px-3">Term 3 (₹)</th>
                      <th className="py-3 px-3">Total Annual Fee (₹)</th>
                      <th className="py-3 px-3 text-right">Due Schedule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {filteredRows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                          {row.className}
                        </td>
                        <td className="py-3 px-3 font-mono">₹ {formatInr(row.term1Fee)}</td>
                        <td className="py-3 px-3 font-mono">₹ {formatInr(row.term2Fee)}</td>
                        <td className="py-3 px-3 font-mono">₹ {formatInr(row.term3Fee)}</td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          ₹ {formatInr(row.totalFee)}
                        </td>
                        <td className="py-3 px-3 text-right font-sans text-slate-500">
                          Quarterly
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Footer: Showing 1 - 7 of 7 classes & pagination */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Showing 1 - {filteredRows.length} of {feeStructures.length} classes</span>
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 cursor-not-allowed"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  disabled
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Actions Card, Need to make changes Card, & Recent Updates Log */}
        <div className="space-y-6">
          {/* 1. Quick Actions Card */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* Blue Banner Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                <h3 className="font-bold text-sm">Quick Actions</h3>
              </div>
              <p className="text-[11px] text-blue-100 mt-1">
                Make changes to fee structure and records easily.
              </p>
            </div>

            {/* Quick Action List Items with Right Arrows */}
            <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <button
                type="button"
                onClick={handleOpenAdd}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                    Add Fee Structure
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenEdit(feeStructures[0])}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                    Edit Fee Structure
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(true)}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 transition-colors">
                    View Fee Collection
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleGenerateReceipt}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                    Generate Receipt
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleDownloadReport}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors">
                    Download Report
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* 2. Need to make changes? Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-100 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md relative">
              <Receipt className="w-6 h-6" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                ₹
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Need to make changes?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Use the rectification option to update fee details, corrections, and more.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRectificationModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to Rectification</span>
              <span>→</span>
            </button>
          </div>

          {/* 3. Recent Updates Log */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Recent Updates</span>
              </h4>
              <button
                type="button"
                onClick={() => showToast('Opening audit trail log...')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {recentUpdates.map(up => (
                <div key={up.id} className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${up.color}`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {up.title}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {up.meta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODALS: ADD / EDIT / VIEW / RECEIPT / RECTIFICATION / COLLECTION
          ========================================================================= */}

      {/* 1. ADD FEE STRUCTURE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Fee Structure</h3>
                  <span className="text-xs text-slate-400">Academic Session 2025–26</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class / Grade Level
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 11 Science"
                  value={formData.className}
                  onChange={e => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tuition Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.tuitionFee}
                    onChange={e => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.examFee}
                    onChange={e => setFormData({ ...formData, examFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Laboratory Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.labFee}
                    onChange={e => setFormData({ ...formData, labFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Library Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.libraryFee}
                    onChange={e => setFormData({ ...formData, libraryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold">
                <span className="text-slate-600 dark:text-slate-400">Total Calculated Annual Fee:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 text-sm">
                  ₹ {formatInr(Number(formData.tuitionFee) + Number(formData.examFee))}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT FEE STRUCTURE MODAL */}
      {isEditModalOpen && activeFeeRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Fee Structure</h3>
                  <span className="text-xs text-slate-400">{activeFeeRow.className}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class Label
                </label>
                <input
                  type="text"
                  required
                  value={formData.className}
                  onChange={e => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tuition Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.tuitionFee}
                    onChange={e => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.examFee}
                    onChange={e => setFormData({ ...formData, examFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold">
                <span className="text-slate-600 dark:text-slate-400">Total Updated Fee:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹ {formatInr(Number(formData.tuitionFee) + Number(formData.examFee))}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Update Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. VIEW DETAILS MODAL */}
      {isViewModalOpen && activeFeeRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {activeFeeRow.className} – Comprehensive Plan
                  </h3>
                  <span className="text-xs text-slate-400">Fee Head Allocation & Terms</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tuition Fee</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹ {formatInr(activeFeeRow.tuitionFee)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Examination Fee</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹ {formatInr(activeFeeRow.examFee)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Lab & Practical</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹ {formatInr(activeFeeRow.labFee || 2000)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Library & Media</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹ {formatInr(activeFeeRow.libraryFee || 1500)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-blue-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Term Installment Schedule</span>
                  <span className="font-mono text-blue-600">Total: ₹ {formatInr(activeFeeRow.totalFee)}</span>
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">Term 1 (40%)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹ {formatInr(activeFeeRow.term1Fee)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">Term 2 (35%)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹ {formatInr(activeFeeRow.term2Fee)}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-[10px] text-slate-400 block">Term 3 (25%)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹ {formatInr(activeFeeRow.term3Fee)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Fee breakdown printed for ${activeFeeRow.className}`);
                  setIsViewModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Fee Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. GENERATE RECEIPT MODAL */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Generate Fee Receipt</h3>
                  <span className="text-xs text-slate-400">Official Institute Acknowledgment</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Student
                </label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none">
                  <option>Rohan Sharma (Class 10A • STU-1001)</option>
                  <option>Priya Patel (Class 10A • STU-1002)</option>
                  <option>Aarav Verma (Class 10B • STU-1003)</option>
                  <option>Ananya Deshmukh (Class 9A • STU-1004)</option>
                  <option>Devansh Joshi (Class 8A • STU-1008)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount Received (₹)
                  </label>
                  <input
                    type="number"
                    defaultValue={25000}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none">
                    <option>UPI / Online Transfer</option>
                    <option>Net Banking (NEFT/RTGS)</option>
                    <option>Debit / Credit Card</option>
                    <option>Cash / Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction / Reference No.
                </label>
                <input
                  type="text"
                  defaultValue="TXN-2026-98124"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Official stamped fee receipt generated and ready for print.');
                  setIsReceiptModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate & Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. RECTIFICATION MODAL */}
      {isRectificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Fee Rectification Center</h3>
                  <span className="text-xs text-slate-400">Corrections, Waivers & Adjustments</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRectificationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                <span className="font-bold block">Administrative Override Notice</span>
                All adjustments require audit log compliance. Changes will be logged under Admin approval ID: ADM-2026.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rectification Type
                </label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none">
                  <option>Fee Waiver / Scholarship Concession</option>
                  <option>Duplicate Entry Elimination</option>
                  <option>Term Head Reallocation</option>
                  <option>Late Fine Exemption</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Justification / Parent Request Ref
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide reference or reason for fee modification..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsRectificationModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Rectification ticket submitted and queued for authorization.');
                  setIsRectificationModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
              >
                Submit Rectification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW FEE COLLECTION MODAL */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Fee Collection Roster</h3>
                  <span className="text-xs text-slate-400">Total ₹ 32,40,500 Collected</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs max-h-72">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-2">Receipt ID</th>
                    <th className="py-2">Student Name</th>
                    <th className="py-2">Class</th>
                    <th className="py-2">Amount Paid</th>
                    <th className="py-2">Mode</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-2 font-mono text-slate-400">REC-901</td>
                    <td className="py-2 font-bold text-slate-900 dark:text-white">Rohan Sharma</td>
                    <td className="py-2 font-mono">Class 10A</td>
                    <td className="py-2 font-mono font-bold text-emerald-600">₹ 27,500</td>
                    <td className="py-2">UPI</td>
                    <td className="py-2 font-mono text-slate-500">28 Oct 2026</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-2 font-mono text-slate-400">REC-902</td>
                    <td className="py-2 font-bold text-slate-900 dark:text-white">Priya Patel</td>
                    <td className="py-2 font-mono">Class 10A</td>
                    <td className="py-2 font-mono font-bold text-emerald-600">₹ 27,500</td>
                    <td className="py-2">Bank Transfer</td>
                    <td className="py-2 font-mono text-slate-500">27 Oct 2026</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-2 font-mono text-slate-400">REC-903</td>
                    <td className="py-2 font-bold text-slate-900 dark:text-white">Aarav Verma</td>
                    <td className="py-2 font-mono">Class 10B</td>
                    <td className="py-2 font-mono font-bold text-emerald-600">₹ 29,500</td>
                    <td className="py-2">UPI</td>
                    <td className="py-2 font-mono text-slate-500">26 Oct 2026</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-2 font-mono text-slate-400">REC-904</td>
                    <td className="py-2 font-bold text-slate-900 dark:text-white">Ananya Deshmukh</td>
                    <td className="py-2 font-mono">Class 9A</td>
                    <td className="py-2 font-mono font-bold text-emerald-600">₹ 26,500</td>
                    <td className="py-2">Card</td>
                    <td className="py-2 font-mono text-slate-500">25 Oct 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Exporting complete fee collection log to Excel...');
                  setIsCollectionModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
