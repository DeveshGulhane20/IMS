import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { StatCard } from '../common/StatCard';
import { AtRiskBadge } from '../common/AtRiskBadge';
import {
  Users,
  GraduationCap,
  Calendar,
  AlertTriangle,
  CreditCard,
  Plus,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  Send,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminViewProps {
  currentTab: string;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentTab }) => {
  const {
    students,
    users,
    batches,
    teachers,
    subjects,
    timetable,
    feeInvoices,
    performanceAlerts,
    notices,
    attendanceRecords,
    enrollStudent,
    transferStudentBatch,
    collectFee,
    publishNotice,
    resolveAlert
  } = useIMS();

  // Search and filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');

  // Modals
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedStudentForTransfer, setSelectedStudentForTransfer] = useState<string>('');
  const [targetBatchId, setTargetBatchId] = useState<string>('batch-beta');

  // Fee Collection Modal
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [collectionAmount, setCollectionAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('ACH');

  // Notice form
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    targetRole: 'ALL' as any,
    priority: 'HIGH' as any
  });

  // Admission form state
  const [admissionForm, setAdmissionForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    batchId: 'batch-alpha',
    gender: 'MALE' as any,
    bloodGroup: 'O+',
    address: '',
    parentName: '',
    parentEmail: ''
  });

  // Quick stats for Operations Hub
  const totalStudentsCount = students.length;
  const activeBatchesCount = batches.length;
  const totalDuePending = feeInvoices
    .filter(i => i.status === 'DUE' || i.status === 'OVERDUE')
    .reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);

  const totalSessions = attendanceRecords.length;
  const presentSessions = attendanceRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
  const todayAttendanceRate = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(1) : '94.8';

  const unresolvedAlerts = performanceAlerts.filter(a => !a.isResolved);

  // Filter students
  const filteredStudents = students.filter(student => {
    const user = users.find(u => u.id === student.userId);
    if (!user) return false;
    const matchesBatch = selectedBatchFilter === 'ALL' || student.batchId === selectedBatchFilter;
    const matchesSearch =
      `${user.firstName} ${user.lastName} ${student.rollNumber} ${student.admissionNumber}`
        .toLowerCase()
        .includes(studentSearch.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enrollStudent({
      name: `${admissionForm.firstName} ${admissionForm.lastName}`.trim(),
      batchName: batches.find(b => b.id === admissionForm.batchId)?.name || '10-A',
      gradeLevel: '10',
      parentName: admissionForm.parentName,
      phone: admissionForm.phone,
      totalFee: 24000
    });
    setIsAdmissionOpen(false);
    setAdmissionForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      batchId: 'batch-alpha',
      gender: 'MALE',
      bloodGroup: 'O+',
      address: '',
      parentName: '',
      parentEmail: ''
    });
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForTransfer || !targetBatchId) return;
    transferStudentBatch(selectedStudentForTransfer, targetBatchId);
    setIsTransferOpen(false);
  };

  const handleCollectFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || collectionAmount <= 0) return;
    const inv = feeInvoices.find(i => i.id === selectedInvoiceId);
    collectFee(inv?.studentName || 'Student', collectionAmount, paymentMethod as any);
    setIsCollectFeeOpen(false);
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) return;
    publishNotice({
      instituteId: 'inst-01',
      authorId: 'u-admin',
      authorName: 'Rachel Vance (Dean)',
      title: noticeForm.title,
      content: noticeForm.content,
      targetRole: noticeForm.targetRole,
      priority: noticeForm.priority
    });
    setNoticeForm({ title: '', content: '', targetRole: 'ALL', priority: 'HIGH' });
  };

  return (
    <div className="space-y-6">
      {/* Tab: Operations Hub / Dashboard */}
      {currentTab === 'dashboard' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Operations & Campus Administration
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized dispatch for attendance, at-risk alerts, fee collections, and student movements
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdmissionOpen(true)}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student Wizard</span>
            </button>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Today's Attendance Rate"
              value={`${todayAttendanceRate}%`}
              change={0.8}
              trend="up"
              icon={CheckCircle}
              accentColor="#16A34A"
              subtitle="Batch Alpha & Beta live"
            />
            <StatCard
              title="Active Academic Batches"
              value={activeBatchesCount}
              trend="neutral"
              icon={Calendar}
              accentColor="#0D9488"
              subtitle="100% capacity utilization"
            />
            <StatCard
              title="Pending Fee Receivables"
              value={`$${totalDuePending.toLocaleString()}`}
              trend="down"
              icon={CreditCard}
              accentColor="#F59E0B"
              subtitle="5 invoices due"
            />
            <StatCard
              title="High-Priority At-Risk Flags"
              value={unresolvedAlerts.length}
              change={-2}
              trend="down"
              icon={AlertTriangle}
              accentColor="#DC2626"
              subtitle="Requires faculty intervention"
            />
          </div>

          {/* At-Risk Alerts Section */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Priority Student Intervention Radar
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Triggered by attendance deficit (&lt;75%) or benchmark exam score drops
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {unresolvedAlerts.length} Active Flags
              </span>
            </div>

            {unresolvedAlerts.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                All performance warnings and absenteeism flags are currently resolved.
              </div>
            ) : (
              <div className="space-y-2.5">
                {unresolvedAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5">
                        <AtRiskBadge severity={alert.severity} category={alert.category} />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {alert.studentName} · <span className="font-normal text-slate-500">{alert.batchName}</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {alert.message}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">{alert.createdAt}</span>
                      <button
                        type="button"
                        onClick={() => resolveAlert(alert.id)}
                        className="px-2.5 py-1 text-xs rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab: Student Directory */}
      {currentTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Scholastic Student Directory
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Complete student master ledger with attendance streaks, batch transfers, and guardian contacts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTransferOpen(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Batch Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAdmissionOpen(true)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enroll Student</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name, roll # or admission code..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedBatchFilter}
                  onChange={e => setSelectedBatchFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Cohorts & Batches</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Showing {filteredStudents.length} of {students.length} scholars
            </span>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-medium">
                    <th className="py-2.5 px-4">Scholar</th>
                    <th className="py-2.5 px-4">Roll Number</th>
                    <th className="py-2.5 px-4">Batch Allocation</th>
                    <th className="py-2.5 px-4 text-center">Current Streak</th>
                    <th className="py-2.5 px-4">Badge XP</th>
                    <th className="py-2.5 px-4">Contact Phone</th>
                    <th className="py-2.5 px-4">Admission #</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredStudents.map(student => {
                    const user = users.find(u => u.id === student.userId)!;
                    const batch = batches.find(b => b.id === student.batchId);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400">{user.email}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                          {student.rollNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                          {batch?.name || 'Unassigned'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-amber-600 font-semibold">
                          {student.currentStreak} days
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-600">
                          {student.badgePoints} XP
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {user.phone || '+1 (555) 000-0000'}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {student.admissionNumber}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Faculty Management */}
      {currentTab === 'teachers' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Faculty Workload & Academic Assignments
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Weekly instructional hour allocations, research tracks, and department chairs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachers.map(teacher => {
              const user = users.find(u => u.id === teacher.userId);
              return (
                <div
                  key={teacher.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm">
                      {user?.firstName[0]}
                      {user?.lastName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {user?.firstName} {user?.lastName}
                      </h4>
                      <div className="text-xs text-slate-500 font-mono">{teacher.employeeCode}</div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div><strong>Specialization:</strong> {teacher.specialization}</div>
                    <div><strong>Credentials:</strong> {teacher.qualification}</div>
                    <div className="flex justify-between pt-1">
                      <span>Weekly Instruction:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {teacher.workloadHoursPerWeek} hrs / week
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-[11px] text-slate-400 mb-1">Workload Utilization:</div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0D9488] h-full"
                        style={{ width: `${(teacher.workloadHoursPerWeek / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Batches & Timetable */}
      {currentTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Cohorts & Master Weekly Scheduler
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instructional hall scheduling matrix and capacity gauges
              </p>
            </div>
          </div>

          {/* Capacity utilization strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batches.map(batch => (
              <div
                key={batch.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">{batch.name}</h4>
                  <span className="text-[11px] font-mono text-slate-400">{batch.roomNumber}</span>
                </div>
                <div className="text-xs text-slate-500 mb-2 flex justify-between">
                  <span>Enrolled Capacity:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {batch.enrolledCount} / {batch.maxCapacity} ({Math.round((batch.enrolledCount / batch.maxCapacity) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1E3A8A] h-full"
                    style={{ width: `${(batch.enrolledCount / batch.maxCapacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Timetable Matrix */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Weekly Master Class Schedule (Grade 11 STEM Alpha)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { day: 'Monday', dayNum: 1 },
                { day: 'Tuesday', dayNum: 2 },
                { day: 'Wednesday', dayNum: 3 },
                { day: 'Thursday', dayNum: 4 },
                { day: 'Friday', dayNum: 5 }
              ].map(({ day, dayNum }) => {
                const daySlots = timetable.filter(t => t.dayOfWeek === dayNum);
                return (
                  <div key={day} className="space-y-2">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-800">
                      {day}
                    </div>
                    {daySlots.length === 0 ? (
                      <div className="text-[11px] text-slate-400 py-4 text-center">Self-Study Period</div>
                    ) : (
                      daySlots.map(slot => (
                        <div
                          key={slot.id}
                          className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs"
                        >
                          <div className="font-mono text-[10px] text-slate-500">
                            {slot.startTime} – {slot.endTime}
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                            {slot.subjectName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{slot.teacherName}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1">{slot.classroom}</div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Fee Management Hub */}
      {currentTab === 'fees' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Fee Management Hub & Ledger Collections
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monitor invoice statuses, record counter payments, and generate official institutional receipts
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Student Invoices & Dues Ledger
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium">
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Invoice Particulars</th>
                    <th className="py-2.5 px-4">Total Amount</th>
                    <th className="py-2.5 px-4">Paid</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {feeInvoices.map(inv => {
                    const student = students.find(s => s.id === inv.studentId);
                    const user = student ? users.find(u => u.id === student.userId) : null;
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          {user ? `${user.firstName} ${user.lastName}` : 'Enrolled Scholar'}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{inv.title}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                          ${inv.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-600">
                          ${inv.paidAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{inv.dueDate}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : inv.status === 'OVERDUE'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {inv.status !== 'PAID' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoiceId(inv.id);
                                setCollectionAmount(inv.amount - inv.paidAmount);
                                setIsCollectFeeOpen(true);
                              }}
                              className="px-2.5 py-1 text-xs rounded bg-[#1E3A8A] text-white hover:bg-[#172554] font-medium"
                            >
                              Collect Fee
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400">
                              {inv.receiptNumber}
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
      )}

      {/* Tab: Notice Center */}
      {currentTab === 'notices' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Notice Board Center & Circular Composer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Publish targeted announcements to faculty, parents, or specific cohorts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notice Composer */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Compose Circular
              </h3>
              <form onSubmit={handlePublishNotice} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule of Parent-Teacher Conferences"
                    value={noticeForm.title}
                    onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={noticeForm.targetRole}
                    onChange={e => setNoticeForm({ ...noticeForm, targetRole: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="ALL">All Roles (Campus-wide)</option>
                    <option value="TEACHER">Faculty Only</option>
                    <option value="STUDENT">Scholars & Students</option>
                    <option value="PARENT">Parents & Guardians</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter details of announcement..."
                    value={noticeForm.content}
                    onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] transition-colors shadow-sm"
                >
                  Publish Notice
                </button>
              </form>
            </div>

            {/* Published Notices Feed */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Published Circulars ({notices.length})
              </h3>
              {notices.map(notice => (
                <div
                  key={notice.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {notice.title}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        By {notice.authorName} · Target: <strong className="font-mono">{notice.targetRole || 'ALL'}</strong>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {notice.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admission Wizard Modal */}
      {isAdmissionOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Enroll Student & Link Guardian
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Registers academic profile, issues roll number, creates fee invoice, and assigns to batch
            </p>
            <form onSubmit={handleAdmissionSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionForm.firstName}
                    onChange={e => setAdmissionForm({ ...admissionForm, firstName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionForm.lastName}
                    onChange={e => setAdmissionForm({ ...admissionForm, lastName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={admissionForm.email}
                    onChange={e => setAdmissionForm({ ...admissionForm, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={admissionForm.phone}
                    onChange={e => setAdmissionForm({ ...admissionForm, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Batch Allocation
                  </label>
                  <select
                    value={admissionForm.batchId}
                    onChange={e => setAdmissionForm({ ...admissionForm, batchId: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    value={admissionForm.bloodGroup}
                    onChange={e => setAdmissionForm({ ...admissionForm, bloodGroup: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Parent/Guardian Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meera Patel"
                    value={admissionForm.parentName}
                    onChange={e => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Parent Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. parent@example.com"
                    value={admissionForm.parentEmail}
                    onChange={e => setAdmissionForm({ ...admissionForm, parentEmail: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdmissionOpen(false)}
                  className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white hover:bg-[#172554]"
                >
                  Commit Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Transfer Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Transfer Student Batch
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Reassign a student to a different cohort and update timetable matrix
            </p>
            <form onSubmit={handleTransferSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Student
                </label>
                <select
                  required
                  value={selectedStudentForTransfer}
                  onChange={e => setSelectedStudentForTransfer(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="">-- Choose student --</option>
                  {students.map(s => {
                    const u = users.find(user => user.id === s.userId);
                    return (
                      <option key={s.id} value={s.id}>
                        {u?.firstName} {u?.lastName} ({s.rollNumber})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Destination Batch
                </label>
                <select
                  required
                  value={targetBatchId}
                  onChange={e => setTargetBatchId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Cap: {b.enrolledCount}/{b.maxCapacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white hover:bg-[#172554]"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Fee Drawer / Modal */}
      {isCollectFeeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Record Fee Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter collected funds and issue verified receipt
            </p>
            <form onSubmit={handleCollectFeeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Collection Amount ($ USD)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={collectionAmount}
                  onChange={e => setCollectionAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Payment Instrument
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="ACH">ACH Direct Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash Deposit</option>
                  <option value="Wire">Wire Transfer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCollectFeeOpen(false)}
                  className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded bg-[#16A34A] text-white hover:bg-emerald-700 font-medium"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
