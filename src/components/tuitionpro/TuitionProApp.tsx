import React, { useState, useEffect } from 'react';
import { useIMS } from '../../context/IMSContext';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  CheckSquare,
  Calendar,
  FileCheck,
  BarChart3,
  TrendingUp,
  BookOpen,
  FolderTree,
  MessageCircle,
  DollarSign,
  ShieldCheck,
  HeartHandshake,
  Download,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  AlertTriangle,
  Receipt,
  BellRing,
  Bell,
  Send,
  X,
  Clock,
  Languages,
  WifiOff
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { PremiumAttendance } from '../attendance/PremiumAttendance';
import { WhatsAppFeeReminders, DailySnapshotCard } from '../common/ValueAddFeatures';
import { AveriqSidebar } from '../averiq/AveriqSidebar';
import { AveriqTopNav } from '../averiq/AveriqTopNav';
import { AveriqDashboard } from '../averiq/AveriqDashboard';
import { AveriqStudentPortal } from '../averiq/AveriqStudentPortal';
import { AveriqParentPortal } from '../averiq/AveriqParentPortal';
import { QuickActionModals } from '../averiq/QuickActionModals';
import { AveriqStudentsDirectory } from '../averiq/AveriqStudentsDirectory';
import { AveriqTeachersDirectory } from '../averiq/AveriqTeachersDirectory';
import { AveriqAttendanceAnalytics } from '../averiq/AveriqAttendanceAnalytics';
import { AveriqFeeManagement } from '../averiq/AveriqFeeManagement';
import { AveriqInquiriesCRM } from '../averiq/AveriqInquiriesCRM';
import { AveriqEventsCalendar } from '../averiq/AveriqEventsCalendar';
import { AveriqAcademicReportsView } from '../averiq/AveriqAcademicReportsView';
import { AveriqSubjectsAndClasses } from '../averiq/AveriqSubjectsAndClasses';
import { AveriqStudyMaterials } from '../averiq/AveriqStudyMaterials';
import { AveriqCommunications } from '../averiq/AveriqCommunications';
import { AveriqRolesPermissions } from '../averiq/AveriqRolesPermissions';

interface TuitionProAppProps {
  onSwitchRole?: () => void;
}

export const TuitionProApp: React.FC<TuitionProAppProps> = ({ onSwitchRole }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const {
    role,
    setRole,
    isSidebarCollapsed,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    viewportMode,
    setViewportMode,
    toastMessage,
    showToast,
    institute,
    students,
    courses,
    batches,
    teachers,
    inquiries,
    timetable,
    tests,
    testResults,
    feePayments,
    studyMaterials,
    ptmMeetings,
    financeTransactions,
    substitutes,
    auditLogs,
    attendanceRecords,
    notices,
    getStudentPaidAmount,
    getStudentBalance,
    markBatchAttendance,
    importBiometricAttendance,
    createTest,
    saveTestMarks,
    togglePublishTest,
    cancelTest,
    collectFee,
    sendFeeReminders,
    enrollStudent,
    updateStudentStatus,
    addInquiry,
    updateInquiryStatus,
    updateInquiryFollowUp,
    addStudyMaterial,
    deleteStudyMaterial,
    schedulePTM,
    cancelPTM,
    addFinanceTransaction,
    assignSubstitute,
    addCourse,
    toggleCourseStatus,
    addBatch,
    addTimetableSlot
  } = useIMS();

  const [activeTab, setActiveTab] = useState<string>('dash');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [quickModal, setQuickModal] = useState<'student' | 'teacher' | 'attendance' | 'fee' | 'exam' | 'inquiry' | 'help' | null>(null);
  const [activeReportsSubTab, setActiveReportsSubTab] = useState<'mk' | 'pf'>('mk');
  const [activeSettingsSubTab, setActiveSettingsSubTab] = useState<'crs' | 'usr' | 'tb' | 'mat' | 'ptm' | 'fin'>('crs');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileModalStudent, setProfileModalStudent] = useState<any | null>(null);
  const [receiptModalStudent, setReceiptModalStudent] = useState<string | null>(null);
  const [exportModalContent, setExportModalContent] = useState<string | null>(null);

  // Attendance controls
  const [attendanceBatch, setAttendanceBatch] = useState('10-A');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceInputs, setAttendanceInputs] = useState<Record<string, 'P' | 'A' | 'L'>>({});
  const [biometricText, setBiometricText] = useState('');

  // Marks controls
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);
  const [marksInputs, setMarksInputs] = useState<Record<string, number>>({});

  // Progress student selector
  const [progressStudent, setProgressStudent] = useState('Aarav');
  const [progressFilter, setProgressFilter] = useState<'All' | 'Last 4'>('All');

  // Parent portal child
  const [parentChild, setParentChild] = useState('Aarav');

  // Finance filter
  const [financeFrom, setFinanceFrom] = useState('');
  const [financeTo, setFinanceTo] = useState('');

  // Substitute finder modal
  const [substituteModalData, setSubstituteModalData] = useState<{ teacher: string; day: string; time: string; affected: any[] } | null>(null);

  // Forms
  const [newStudentForm, setNewStudentForm] = useState({ name: '', gradeLevel: '10', batchName: '10-A', parentName: '', phone: '', totalFee: 24000 });
  const [newInquiryForm, setNewInquiryForm] = useState({ name: '', phone: '', course: 'Class 10 Boards', source: 'Walk-in' as any, assignedTo: 'Admin', followUpDate: new Date().toISOString().split('T')[0] });
  const [newFeeForm, setNewFeeForm] = useState({ studentName: 'Aarav', amount: 12000, mode: 'UPI' as any, ref: '' });
  const [newSlotForm, setNewSlotForm] = useState({ dayName: 'Mon', dayOfWeek: 1, startTime: '16:00', endTime: '17:30', batchId: 'batch-10a', subjectName: 'Maths', teacherName: 'Mehta', classroom: 'R1' });
  const [newExamForm, setNewExamForm] = useState({ title: '', batchId: 'batch-10a', subjectId: 'sub-maths', subjectName: 'Maths', maxMarks: 50, passingMarks: 17, testDate: new Date().toISOString().split('T')[0], testTime: '10:00' });
  const [newMaterialForm, setNewMaterialForm] = useState({ type: 'Notes' as any, title: '', subject: 'Maths', batch: '10-A', url: '' });
  const [newPTMForm, setNewPTMForm] = useState({ date: new Date().toISOString().split('T')[0], time: '17:30', location: 'Hall A', batch: '10-A' });
  const [newFinanceForm, setNewFinanceForm] = useState({ type: 'Debit' as any, category: 'Rent' as any, amount: 30000, date: new Date().toISOString().split('T')[0], description: '', mode: 'Bank' as any });
  const [newCourseName, setNewCourseName] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCourse, setNewBatchCourse] = useState('Class 10 Boards');
  const [newBatchTeacher, setNewBatchTeacher] = useState('Mehta');

  // Helper INR formatter
  const inr = (n: number) => Number(n).toLocaleString('en-IN');
  const gradeLetter = (p: number) => p >= 90 ? 'A+' : p >= 75 ? 'A' : p >= 60 ? 'B' : p >= 45 ? 'C' : p >= 33 ? 'D' : 'F';

  // Navigation Items according to TuitionPro
  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stu', label: 'Students', icon: Users },
    { id: 'inq', label: 'Inquiries', icon: UserPlus },
    { id: 'fee', label: 'Fees', icon: CreditCard },
    { id: 'att', label: 'Attendance', icon: CheckSquare },
    { id: 'tb', label: 'Timetable', icon: Calendar },
    { id: 'ex', label: 'Exams', icon: FileCheck },
    { id: 'mk', label: 'Marks & Results', icon: BarChart3 },
    { id: 'pf', label: 'Progress', icon: TrendingUp },
    { id: 'mat', label: 'Study Material', icon: BookOpen },
    { id: 'crs', label: 'Courses & Batches', icon: FolderTree },
    { id: 'ptm', label: 'PTM Meetings', icon: MessageCircle },
    { id: 'fin', label: 'Finance & Accounts', icon: DollarSign },
    { id: 'usr', label: 'Users & Audit', icon: ShieldCheck },
    { id: 'por', label: 'Parent Portal', icon: HeartHandshake }
  ];

  // Role access control
  const accessibleTabs = role === 'ADMIN'
    ? navItems.map(n => n.id)
    : role === 'TEACHER'
    ? ['att', 'tb', 'ex', 'mk', 'pf', 'mat']
    : role === 'STUDENT'
    ? ['dash', 'stu', 'att', 'tb', 'mk', 'mat', 'ex', 'notif', 'cal', 'set']
    : ['dash', 'por', 'stu', 'att', 'fee', 'mk', 'tb', 'inq', 'ptm', 'set'];

  const filteredNavItems = navItems.filter(n => accessibleTabs.includes(n.id));

  // Compute at-risk students
  const riskStudents = students.filter(s => s.status === 'Active').flatMap(s => {
    const reasons: string[] = [];
    const studentTests = testResults.filter(r => r.studentName === s.name);
    if (studentTests.length > 1) {
      const last = studentTests[studentTests.length - 1];
      const prev = studentTests[studentTests.length - 2];
      const testLast = tests.find(t => t.id === last.testId);
      const testPrev = tests.find(t => t.id === prev.testId);
      const pLast = testLast ? Math.round((last.marksObtained / testLast.maxMarks) * 100) : 0;
      const pPrev = testPrev ? Math.round((prev.marksObtained / testPrev.maxMarks) * 100) : 0;
      if (pLast < 40 && pPrev < 40) reasons.push('Below 40% twice');
      else if (pPrev - pLast >= 10) reasons.push(`Dropped ${pPrev - pLast} points`);
    }
    const studentAtt = attendanceRecords.filter(a => a.studentName === s.name);
    const presentAtt = studentAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attPct = studentAtt.length > 0 ? Math.round((presentAtt / studentAtt.length) * 100) : 100;
    if (attPct < 75) reasons.push(`Attendance ${attPct}%`);

    return reasons.length ? [{ name: `${s.name} (${s.batchName})`, reasons: reasons.join('; ') }] : [];
  });

  const totalFeesPending = students.reduce((acc, s) => acc + getStudentBalance(s.name), 0);
  const pendingFollowups = inquiries.filter(i => i.status !== 'Admitted' && i.status !== 'Lost').length;
  const currentExam = tests[selectedExamIndex] || tests[0];

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1329] text-[#0F172A] dark:text-[#E2E8F0] flex">
      {/* 2. Left Sidebar (Fixed on desktop, dark navy) */}
      <AveriqSidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setProfileModalStudent(null);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenHelp={() => setQuickModal('help')}
      />

      {/* Main Content Area (Offset for sidebar on desktop, responsive to collapsed state) */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* 3. Top Navigation */}
        <AveriqTopNav
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onNavigateTab={(tabId) => {
            setActiveTab(tabId);
            setProfileModalStudent(null);
          }}
          onSwitchRole={onSwitchRole}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Section Breadcrumb Bar when not on Dashboard */}
          {activeTab !== 'dash' && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('dash')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  ← Back to Dashboard
                </button>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {activeTab === 'cls' && 'Subject and Classes'}
                  {activeTab === 'stu' && 'Students Management'}
                  {activeTab === 'tea' && 'Faculty & Teachers'}
                  {activeTab === 'att' && 'Attendance & Biometrics'}
                  {activeTab === 'fee' && 'Fee Management & Collections'}
                  {activeTab === 'ex' && 'Exams and Results'}
                  {activeTab === 'evt' && 'Event and Time table'}
                  {activeTab === 'mat' && 'Study Materials'}
                  {activeTab === 'comm' && 'Communications'}
                  {activeTab === 'roles' && 'Roles and Permissions'}
                  {activeTab === 'inq' && 'Inquiries & Admission CRM'}
                  {activeTab === 'rep' && 'Academic Reports & Results'}
                  {activeTab === 'set' && 'Institution Settings'}
                  {activeTab === 'tb' && 'Timetable & Class Schedule'}
                  {activeTab === 'mk' && 'Marks & Examination Results'}
                  {activeTab === 'pf' && 'Student Progress Analytics'}
                  {activeTab === 'crs' && 'Courses & Batches'}
                  {activeTab === 'ptm' && 'Parent Teacher Meetings'}
                  {activeTab === 'fin' && 'Finance & Accounts'}
                  {activeTab === 'usr' && 'Users & Security Audit'}
                  {activeTab === 'por' && 'Parent Portal'}
                </span>
              </div>

              {/* Sub-tabs for Reports */}
              {activeTab === 'rep' && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveReportsSubTab('mk')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      activeReportsSubTab === 'mk' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Marks & Tests
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveReportsSubTab('pf')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      activeReportsSubTab === 'pf' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Progress Analytics
                  </button>
                </div>
              )}

              {/* Sub-tabs for Settings */}
              {activeTab === 'set' && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSubTab('crs')}
                    className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeSettingsSubTab === 'crs' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Courses & Batches
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSubTab('tb')}
                    className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeSettingsSubTab === 'tb' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Timetable
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSubTab('mat')}
                    className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeSettingsSubTab === 'mat' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Study Material
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSubTab('ptm')}
                    className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeSettingsSubTab === 'ptm' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    PTM
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSubTab('fin')}
                    className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeSettingsSubTab === 'fin' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Finance
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSubTab('usr')}
                    className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeSettingsSubTab === 'usr' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Users & Security
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: AVERIQ REDESIGNED DASHBOARD (ROLE-ADAPTIVE) */}
          {activeTab === 'dash' && (
            role === 'STUDENT' ? (
              <AveriqStudentPortal
                onNavigateTab={(tabId) => {
                  setActiveTab(tabId);
                  setProfileModalStudent(null);
                }}
              />
            ) : role === 'PARENT' ? (
              <AveriqParentPortal
                onNavigateTab={(tabId) => {
                  setActiveTab(tabId);
                  setProfileModalStudent(null);
                }}
              />
            ) : (
              <AveriqDashboard
                onNavigateTab={(tabId) => {
                  setActiveTab(tabId);
                  setProfileModalStudent(null);
                }}
                onOpenModal={(type) => setQuickModal(type)}
              />
            )
          )}

          {/* TEACHERS TAB */}
          {activeTab === 'tea' && <AveriqTeachersDirectory />}

          {/* SUBJECTS AND CLASSES */}
          {activeTab === 'cls' && <AveriqSubjectsAndClasses />}

          {/* TAB 2: STUDENTS */}
          {activeTab === 'stu' && <AveriqStudentsDirectory />}
          {false && activeTab === 'stu' && (
            <div className="space-y-4">
              {/* Profile Card if student selected */}
              {profileModalStudent && (
                <div className="p-4 rounded-xl border-2 border-teal-600 bg-teal-50/30 dark:bg-teal-950/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm">{profileModalStudent.name}, Batch {profileModalStudent.batchName} ({profileModalStudent.status})</h3>
                      <p className="text-xs text-slate-500">Parent: {profileModalStudent.parentName}, {profileModalStudent.phone}. Admitted: {profileModalStudent.admissionDate}</p>
                    </div>
                    <button type="button" onClick={() => setProfileModalStudent(null)} className="text-xs px-2 py-0.5 rounded border">
                      Close
                    </button>
                  </div>
                  <div className="text-xs flex gap-3 flex-wrap">
                    <span>Total Fee: <strong>₹{inr(profileModalStudent.totalFee)}</strong></span>
                    <span>Paid: <strong>₹{inr(getStudentPaidAmount(profileModalStudent.name))}</strong></span>
                    <span className="text-rose-600 font-bold">Pending: ₹{inr(getStudentBalance(profileModalStudent.name))}</span>
                  </div>
                  {/* Results table */}
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-slate-400">
                          <th className="py-1">Exam</th>
                          <th className="py-1">Marks</th>
                          <th className="py-1">Percent</th>
                          <th className="py-1">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.filter(r => r.studentName === profileModalStudent.name).map(r => {
                          const t = tests.find(test => test.id === r.testId);
                          const pct = t ? Math.round((r.marksObtained / t.maxMarks) * 100) : 0;
                          return (
                            <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                              <td className="py-1 font-medium">{t?.title}</td>
                              <td className="py-1 font-mono">{r.marksObtained}/{t?.maxMarks}</td>
                              <td className="py-1 font-mono font-bold">{pct}%</td>
                              <td className="py-1 font-mono">{gradeLetter(pct)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Register Student Form */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Register student</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newStudentForm.name) return showToast('Enter student name');
                    enrollStudent(newStudentForm);
                    setNewStudentForm({ name: '', gradeLevel: '10', batchName: '10-A', parentName: '', phone: '', totalFee: 24000 });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Name
                    <input
                      required
                      placeholder="Student Name"
                      value={newStudentForm.name}
                      onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Class
                    <input
                      value={newStudentForm.gradeLevel}
                      onChange={e => setNewStudentForm({ ...newStudentForm, gradeLevel: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newStudentForm.batchName}
                      onChange={e => setNewStudentForm({ ...newStudentForm, batchName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Parent or Guardian
                    <input
                      placeholder="Parent Name"
                      value={newStudentForm.parentName}
                      onChange={e => setNewStudentForm({ ...newStudentForm, parentName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Phone
                    <input
                      placeholder="Phone number"
                      value={newStudentForm.phone}
                      onChange={e => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Total Fee (₹)
                    <input
                      type="number"
                      value={newStudentForm.totalFee}
                      onChange={e => setNewStudentForm({ ...newStudentForm, totalFee: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end mt-1">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white font-medium text-xs">
                      Add Student
                    </button>
                  </div>
                </form>
              </div>

              {/* Student Directory Table with live search */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <input
                  type="text"
                  placeholder="Search name, class, batch or status..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-transparent"
                />
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Name</th>
                        <th className="py-1">Class</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Parent</th>
                        <th className="py-1">Phone</th>
                        <th className="py-1">Status</th>
                        <th className="py-1 text-right">Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter(s => `${s.name} ${s.batchName} ${s.gradeLevel} ${s.status}`.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(s => (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 font-medium">{s.name}</td>
                            <td className="py-2">{s.gradeLevel}</td>
                            <td className="py-2 font-mono">{s.batchName}</td>
                            <td className="py-2 text-slate-500">{s.parentName}</td>
                            <td className="py-2 font-mono text-slate-500">{s.phone}</td>
                            <td className="py-2">
                              <select
                                value={s.status}
                                onChange={e => updateStudentStatus(s.id, e.target.value as any)}
                                className="px-1.5 py-0.5 rounded text-[11px] border bg-transparent"
                              >
                                <option value="Admission">Admission</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Leaving">Leaving</option>
                              </select>
                            </td>
                            <td className="py-2 text-right">
                              <button
                                type="button"
                                onClick={() => setProfileModalStudent(s)}
                                className="px-2 py-0.5 text-[11px] rounded border hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                Profile
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

          {/* TAB 3: INQUIRIES & ADMISSIONS PIPELINE */}
          {activeTab === 'inq' && <AveriqInquiriesCRM />}
          {false && activeTab === 'inq' && (
            <div className="space-y-4">
              {/* New inquiry */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">New inquiry</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newInquiryForm.name) return showToast('Enter name');
                    addInquiry({ ...newInquiryForm, status: 'New' });
                    setNewInquiryForm({ name: '', phone: '', course: 'Class 10 Boards', source: 'Walk-in', assignedTo: 'Admin', followUpDate: new Date().toISOString().split('T')[0] });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Student or parent
                    <input
                      required
                      placeholder="Name"
                      value={newInquiryForm.name}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, name: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Phone
                    <input
                      required
                      placeholder="Phone"
                      value={newInquiryForm.phone}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, phone: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Course
                    <select
                      value={newInquiryForm.course}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, course: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Source
                    <select
                      value={newInquiryForm.source}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, source: e.target.value as any })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Call">Call</option>
                      <option value="Website">Website</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Assigned to
                    <input
                      value={newInquiryForm.assignedTo}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, assignedTo: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Follow-up date
                    <input
                      type="date"
                      value={newInquiryForm.followUpDate}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, followUpDate: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Add Inquiry
                    </button>
                  </div>
                </form>
              </div>

              {/* Inquiry Pipeline Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Pipeline</h3>
                  <span className="text-[11px] text-slate-500">
                    Conversion: {inquiries.length ? Math.round((inquiries.filter(i => i.status === 'Admitted').length / inquiries.length) * 100) : 0}%
                  </span>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Name</th>
                        <th className="py-1">Phone</th>
                        <th className="py-1">Course</th>
                        <th className="py-1">Source</th>
                        <th className="py-1">Follow-up</th>
                        <th className="py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 font-medium">{inq.name}</td>
                          <td className="py-2 font-mono text-slate-500">{inq.phone}</td>
                          <td className="py-2">{inq.course}</td>
                          <td className="py-2 text-slate-500">{inq.source}</td>
                          <td className="py-2 font-mono">
                            <input
                              type="date"
                              value={inq.followUpDate}
                              onChange={e => updateInquiryFollowUp(inq.id, e.target.value)}
                              className="px-1 py-0.5 rounded border bg-transparent text-xs"
                            />
                          </td>
                          <td className="py-2">
                            <select
                              value={inq.status}
                              onChange={e => updateInquiryStatus(inq.id, e.target.value as any)}
                              className="px-1.5 py-0.5 rounded text-[11px] border bg-transparent"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Demo Scheduled">Demo Scheduled</option>
                              <option value="Follow-Up">Follow-Up</option>
                              <option value="Admitted">Admitted</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEES */}
          {activeTab === 'fee' && <AveriqFeeManagement />}
          {false && activeTab === 'fee' && (
            <div className="space-y-4">
              {/* Record Payment Form */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Record payment</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newFeeForm.amount) return showToast('Enter payment amount');
                    collectFee(newFeeForm.studentName, Number(newFeeForm.amount), newFeeForm.mode, newFeeForm.ref);
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Student
                    <select
                      value={newFeeForm.studentName}
                      onChange={e => setNewFeeForm({ ...newFeeForm, studentName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.batchName})</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Amount (₹)
                    <input
                      type="number"
                      required
                      value={newFeeForm.amount}
                      onChange={e => setNewFeeForm({ ...newFeeForm, amount: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Mode
                    <select
                      value={newFeeForm.mode}
                      onChange={e => setNewFeeForm({ ...newFeeForm, mode: e.target.value as any })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank Transfer</option>
                      <option value="Card">Card</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Reference no.
                    <input
                      placeholder="e.g. U1001"
                      value={newFeeForm.ref}
                      onChange={e => setNewFeeForm({ ...newFeeForm, ref: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-4 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Save Payment
                    </button>
                  </div>
                </form>
              </div>

              {/* Reminders strip */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span>Due Date: <strong className="font-mono">2026-11-05</strong></span>
                <button
                  type="button"
                  onClick={sendFeeReminders}
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Remind parents with pending fees
                </button>
              </div>

              {/* Fee status table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Fee status</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Student</th>
                        <th className="py-1">Total</th>
                        <th className="py-1">Paid</th>
                        <th className="py-1">Balance</th>
                        <th className="py-1">Status</th>
                        <th className="py-1 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const paid = getStudentPaidAmount(s.name);
                        const bal = getStudentBalance(s.name);
                        return (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 font-medium">{s.name}</td>
                            <td className="py-2 font-mono">₹{inr(s.totalFee)}</td>
                            <td className="py-2 font-mono text-emerald-600">₹{inr(paid)}</td>
                            <td className="py-2 font-mono font-bold text-rose-600">₹{inr(bal)}</td>
                            <td className="py-2">
                              {bal <= 0 ? (
                                <span className="text-emerald-600 font-semibold">Paid</span>
                              ) : paid > 0 ? (
                                <span className="text-amber-600 font-semibold">Partial</span>
                              ) : (
                                <span className="text-rose-600 font-semibold">Unpaid</span>
                              )}
                            </td>
                            <td className="py-2 text-right">
                              <button
                                type="button"
                                onClick={() => setReceiptModalStudent(s.name)}
                                className="px-2 py-0.5 rounded border text-[11px]"
                              >
                                Receipt
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment history */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Payment history</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Date</th>
                        <th className="py-1">Student</th>
                        <th className="py-1">Amount</th>
                        <th className="py-1">Mode</th>
                        <th className="py-1">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feePayments.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-mono text-slate-400">{p.date}</td>
                          <td className="py-1.5 font-medium">{p.studentName}</td>
                          <td className="py-1.5 font-mono font-bold text-emerald-600">₹{inr(p.amount)}</td>
                          <td className="py-1.5">{p.mode}</td>
                          <td className="py-1.5 font-mono text-slate-500">{p.referenceNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ATTENDANCE */}
          {activeTab === 'att' && <AveriqAttendanceAnalytics />}

          {/* EVENTS & CALENDAR */}
          {(activeTab === 'evt' || activeTab === 'cal') && <AveriqEventsCalendar />}

          {/* TAB 6: TIMETABLE & SUBSTITUTE FINDER */}
          {(activeTab === 'tb' || (activeTab === 'set' && activeSettingsSubTab === 'tb')) && (
            <div className="space-y-4">
              {/* Add slot form */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Add class slot</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addTimetableSlot(newSlotForm);
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Day
                    <select
                      value={newSlotForm.dayName}
                      onChange={e => {
                        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        setNewSlotForm({ ...newSlotForm, dayName: e.target.value, dayOfWeek: days.indexOf(e.target.value) + 1 });
                      }}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      <option value="Mon">Mon</option>
                      <option value="Tue">Tue</option>
                      <option value="Wed">Wed</option>
                      <option value="Thu">Thu</option>
                      <option value="Fri">Fri</option>
                      <option value="Sat">Sat</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Time
                    <input
                      type="time"
                      value={newSlotForm.startTime}
                      onChange={e => setNewSlotForm({ ...newSlotForm, startTime: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newSlotForm.batchId}
                      onChange={e => setNewSlotForm({ ...newSlotForm, batchId: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Subject
                    <input
                      value={newSlotForm.subjectName}
                      onChange={e => setNewSlotForm({ ...newSlotForm, subjectName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Teacher
                    <select
                      value={newSlotForm.teacherName}
                      onChange={e => setNewSlotForm({ ...newSlotForm, teacherName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.specialization})</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Room
                    <input
                      value={newSlotForm.classroom}
                      onChange={e => setNewSlotForm({ ...newSlotForm, classroom: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Add Slot
                    </button>
                  </div>
                </form>
              </div>

              {/* Weekly Timetable Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Weekly timetable</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Day</th>
                        <th className="py-1">Time</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Subject</th>
                        <th className="py-1">Teacher</th>
                        <th className="py-1">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map(slot => (
                        <tr key={slot.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-medium">{slot.dayName}</td>
                          <td className="py-1.5 font-mono text-slate-500">{slot.startTime}</td>
                          <td className="py-1.5 font-mono">{slot.batchId.replace('batch-', '')}</td>
                          <td className="py-1.5">{slot.subjectName}</td>
                          <td className="py-1.5 font-semibold text-teal-700 dark:text-teal-400">{slot.teacherName}</td>
                          <td className="py-1.5 font-mono text-slate-400">{slot.classroom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Teacher Absent / Substitute Finder */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Teacher absent (Find substitute)</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select id="sub-teacher" className="px-2 py-1 rounded border bg-transparent">
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  <select id="sub-day" className="px-2 py-1 rounded border bg-transparent">
                    <option value="Mon">Mon</option>
                    <option value="Tue">Tue</option>
                    <option value="Wed">Wed</option>
                  </select>
                  <input id="sub-time" type="time" defaultValue="16:00" className="px-2 py-1 rounded border bg-transparent font-mono" />
                  <button
                    type="button"
                    onClick={() => {
                      const t = (document.getElementById('sub-teacher') as HTMLSelectElement).value;
                      const day = (document.getElementById('sub-day') as HTMLSelectElement).value;
                      const time = (document.getElementById('sub-time') as HTMLInputElement).value;
                      const affected = timetable.filter(s => s.teacherName === t && s.dayName === day && s.startTime === time);
                      if (!affected.length) return showToast('No class found for that teacher in this slot');
                      setSubstituteModalData({ teacher: t, day, time, affected });
                    }}
                    className="px-3 py-1 rounded bg-[#0f766e] text-white"
                  >
                    Find substitutes
                  </button>
                </div>

                {/* Assigned substitutes list */}
                {substitutes.length > 0 && (
                  <div className="pt-2 border-t text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Active Substitute Assignments:</span>
                    {substitutes.map(s => (
                      <div key={s.id} className="flex justify-between py-1 border-b">
                        <span>Slot: {s.slot} ({s.batch})</span>
                        <span className="font-semibold text-emerald-600">Assigned: {s.substituteTeacher}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: EXAMS & SEMESTERS */}
          {activeTab === 'ex' && <AveriqAcademicReportsView />}
          {false && activeTab === 'ex' && (
            <div className="space-y-4">
              {/* Schedule Exam */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Schedule exam</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newExamForm.title) return showToast('Enter exam title');
                    createTest({
                      batchId: newExamForm.batchId,
                      subjectId: newExamForm.subjectId,
                      subjectName: newExamForm.subjectName,
                      teacherId: 'tp-mehta',
                      title: newExamForm.title,
                      maxMarks: Number(newExamForm.maxMarks),
                      passingMarks: Number(newExamForm.passingMarks),
                      testDate: newExamForm.testDate,
                      testTime: newExamForm.testTime,
                      isPublished: false
                    });
                    setNewExamForm({ title: '', batchId: 'batch-10a', subjectId: 'sub-maths', subjectName: 'Maths', maxMarks: 50, passingMarks: 17, testDate: new Date().toISOString().split('T')[0], testTime: '10:00' });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Exam title
                    <input
                      required
                      placeholder="e.g. Unit Test 4"
                      value={newExamForm.title}
                      onChange={e => setNewExamForm({ ...newExamForm, title: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newExamForm.batchId}
                      onChange={e => setNewExamForm({ ...newExamForm, batchId: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Subject
                    <input
                      value={newExamForm.subjectName}
                      onChange={e => setNewExamForm({ ...newExamForm, subjectName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Date
                    <input
                      type="date"
                      value={newExamForm.testDate}
                      onChange={e => setNewExamForm({ ...newExamForm, testDate: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Max Marks
                    <input
                      type="number"
                      value={newExamForm.maxMarks}
                      onChange={e => setNewExamForm({ ...newExamForm, maxMarks: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Pass Marks
                    <input
                      type="number"
                      value={newExamForm.passingMarks}
                      onChange={e => setNewExamForm({ ...newExamForm, passingMarks: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-2 flex items-end justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Schedule Exam
                    </button>
                  </div>
                </form>
              </div>

              {/* Exam Schedule Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Scheduled exams</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Exam</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Subject</th>
                        <th className="py-1">When</th>
                        <th className="py-1">Max/Pass</th>
                        <th className="py-1">Status</th>
                        <th className="py-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map(test => (
                        <tr key={test.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 font-medium">{test.title}</td>
                          <td className="py-2 font-mono">{test.batchId.replace('batch-', '')}</td>
                          <td className="py-2">{test.subjectName}</td>
                          <td className="py-2 font-mono text-slate-500">{test.testDate}</td>
                          <td className="py-2 font-mono">{test.maxMarks}/{test.passingMarks}</td>
                          <td className="py-2">
                            {test.isCancelled ? (
                              <span className="text-rose-600 font-semibold">Cancelled</span>
                            ) : test.isPublished ? (
                              <span className="text-emerald-600 font-semibold">Published</span>
                            ) : (
                              <span className="text-amber-600 font-semibold">Scheduled</span>
                            )}
                          </td>
                          <td className="py-2 text-right">
                            {!test.isCancelled && (
                              <button
                                type="button"
                                onClick={() => cancelTest(test.id)}
                                className="px-2 py-0.5 rounded border text-[11px] text-rose-600 hover:bg-rose-50"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MARKS, RESULTS & REPORTS */}
          {(activeTab === 'mk' || activeTab === 'rep') && <AveriqAcademicReportsView />}
          {false && (activeTab === 'mk' || (activeTab === 'rep' && activeReportsSubTab === 'mk')) && (
            <div className="space-y-4">
              {/* Exam selector */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Marks entry</h3>
                  <select
                    value={selectedExamIndex}
                    onChange={e => setSelectedExamIndex(Number(e.target.value))}
                    className="px-2 py-1 rounded border bg-transparent text-xs font-medium"
                  >
                    {tests.map((t, idx) => (
                      <option key={t.id} value={idx}>{t.title} ({t.batchId.replace('batch-', '')})</option>
                    ))}
                  </select>
                </div>
                <div className="text-[11px] text-slate-500">
                  Max Marks: <strong>{currentExam?.maxMarks}</strong> · Passing: <strong>{currentExam?.passingMarks}</strong>
                </div>

                {/* Entry inputs */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Student</th>
                        <th className="py-1">Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => s.batchName === currentExam?.batchId.replace('batch-', '') || currentExam?.batchId.includes(s.batchName.toLowerCase())).map(s => {
                        const existingResult = testResults.find(r => r.testId === currentExam?.id && (r.studentName === s.name || r.studentId === s.id));
                        const currentVal = marksInputs[s.id] ?? existingResult?.marksObtained ?? '';
                        return (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-1.5 font-medium">{s.name}</td>
                            <td className="py-1.5">
                              <input
                                type="number"
                                min={0}
                                max={currentExam?.maxMarks}
                                value={currentVal}
                                onChange={e => setMarksInputs({ ...marksInputs, [s.id]: Number(e.target.value) })}
                                className="w-20 px-2 py-1 rounded border bg-transparent font-mono"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentExam) return;
                      const batchStudents = students.filter(s => s.batchName === currentExam.batchId.replace('batch-', '') || currentExam.batchId.includes(s.batchName.toLowerCase()));
                      const resultsToSave = batchStudents.map(s => ({
                        studentId: s.id,
                        marksObtained: marksInputs[s.id] ?? 0
                      }));
                      saveTestMarks(currentExam.id, resultsToSave);
                    }}
                    className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium"
                  >
                    Save Marks
                  </button>

                  <button
                    type="button"
                    onClick={() => currentExam && togglePublishTest(currentExam.id)}
                    className="px-3 py-1 rounded border text-xs"
                  >
                    {currentExam?.isPublished ? 'Unpublish' : 'Publish Result'}
                  </button>
                </div>
              </div>

              {/* Visual Grade Distribution Chart using Recharts */}
              {(() => {
                const examResults = testResults.filter(r => r.testId === currentExam?.id);
                const gradeCounts: Record<string, number> = {
                  'A+': 0,
                  'A': 0,
                  'B': 0,
                  'C': 0,
                  'D': 0,
                  'F': 0
                };

                examResults.forEach(r => {
                  const pct = currentExam && currentExam.maxMarks > 0 ? Math.round((r.marksObtained / currentExam.maxMarks) * 100) : 0;
                  const g = gradeLetter(pct);
                  if (gradeCounts[g] !== undefined) {
                    gradeCounts[g]++;
                  }
                });

                const gradeDistributionData = [
                  { grade: 'A+', label: '≥ 90%', count: gradeCounts['A+'], fill: '#10b981' },
                  { grade: 'A', label: '75–89%', count: gradeCounts['A'], fill: '#059669' },
                  { grade: 'B', label: '60–74%', count: gradeCounts['B'], fill: '#0d9488' },
                  { grade: 'C', label: '45–59%', count: gradeCounts['C'], fill: '#f59e0b' },
                  { grade: 'D', label: '33–44%', count: gradeCounts['D'], fill: '#ea580c' },
                  { grade: 'F', label: '< 33%', count: gradeCounts['F'], fill: '#dc2626' }
                ];

                const totalEvaluated = examResults.length;
                const passingCount = examResults.filter(r => currentExam && r.marksObtained >= currentExam.passingMarks).length;
                const passRate = totalEvaluated > 0 ? Math.round((passingCount / totalEvaluated) * 100) : 0;

                return (
                  <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Grade Distribution ({currentExam?.title})</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Breakdown across grade ranges (A+, A, B, C, D, F) · Pass Rate: <strong className="font-mono text-emerald-600">{passRate}%</strong> ({passingCount}/{totalEvaluated})
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-slate-500">Evaluated: <strong className="text-slate-800 dark:text-slate-200">{totalEvaluated}</strong></span>
                      </div>
                    </div>

                    {/* Grade Range Count Strip */}
                    <div className="grid grid-cols-6 gap-1.5 text-center text-[11px]">
                      {gradeDistributionData.map(d => (
                        <div
                          key={d.grade}
                          className="p-1.5 rounded border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40"
                        >
                          <div className="font-bold" style={{ color: d.fill }}>{d.grade}</div>
                          <div className="text-slate-400 text-[9px] font-mono">{d.label}</div>
                          <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{d.count}</div>
                        </div>
                      ))}
                    </div>

                    {/* Recharts Bar Chart */}
                    <div className="h-44 w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.4} stroke="#cbd5e1" />
                          <XAxis
                            dataKey="grade"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0F172A',
                              borderColor: '#1E293B',
                              borderRadius: '8px',
                              color: '#F8FAFC',
                              fontSize: '12px'
                            }}
                            formatter={(value: any, _name: any, item: any) => [
                              `${value} student${value === 1 ? '' : 's'} (${totalEvaluated > 0 ? Math.round((Number(value) / totalEvaluated) * 100) : 0}%)`,
                              `Grade ${item.payload.grade} (${item.payload.label})`
                            ]}
                          />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {gradeDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()}

              {/* Result Leaderboard Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Result: {currentExam?.title}</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Rank</th>
                        <th className="py-1">Student</th>
                        <th className="py-1">Marks</th>
                        <th className="py-1">Percent</th>
                        <th className="py-1">Grade</th>
                        <th className="py-1">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults
                        .filter(r => r.testId === currentExam?.id)
                        .sort((a, b) => b.marksObtained - a.marksObtained)
                        .map((r, idx) => {
                          const pct = currentExam ? Math.round((r.marksObtained / currentExam.maxMarks) * 100) : 0;
                          const passed = currentExam && r.marksObtained >= currentExam.passingMarks;
                          return (
                            <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                              <td className="py-1.5 font-mono text-slate-400">{idx + 1}</td>
                              <td className="py-1.5 font-medium">{r.studentName}</td>
                              <td className="py-1.5 font-mono">{r.marksObtained}/{currentExam?.maxMarks}</td>
                              <td className="py-1.5 font-mono font-bold">{pct}%</td>
                              <td className="py-1.5 font-mono">{gradeLetter(pct)}</td>
                              <td className="py-1.5">
                                <span className={passed ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                                  {passed ? 'Pass' : 'Fail'}
                                </span>
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

          {/* TAB 9: PROGRESS & GROWTH CURVES */}
          {(activeTab === 'pf' || (activeTab === 'rep' && activeReportsSubTab === 'pf')) && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Student progress chart</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <select
                      value={progressStudent}
                      onChange={e => setProgressStudent(e.target.value)}
                      className="px-2 py-1 rounded border bg-transparent font-medium"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.batchName})</option>
                      ))}
                    </select>
                    <select
                      value={progressFilter}
                      onChange={e => setProgressFilter(e.target.value as any)}
                      className="px-2 py-1 rounded border bg-transparent"
                    >
                      <option value="All">All Exams</option>
                      <option value="Last 4">Last 4</option>
                    </select>
                  </div>
                </div>

                {/* Growth SVG Bar Chart */}
                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={testResults
                        .filter(r => r.studentName === progressStudent)
                        .map(r => {
                          const t = tests.find(test => test.id === r.testId);
                          return {
                            name: t?.title.slice(0, 10) || 'Test',
                            score: t ? Math.round((r.marksObtained / t.maxMarks) * 100) : 0
                          };
                        })}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Score']} />
                      <Bar dataKey="score" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Batch Summary */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Batch summary (Staff only)</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Exam</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Average</th>
                        <th className="py-1">Highest</th>
                        <th className="py-1">Lowest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map(test => {
                        const scores = testResults.filter(r => r.testId === test.id).map(r => r.marksObtained);
                        if (!scores.length) return null;
                        const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length / test.maxMarks) * 100);
                        return (
                          <tr key={test.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-1.5 font-medium">{test.title}</td>
                            <td className="py-1.5 font-mono">{test.batchId.replace('batch-', '')}</td>
                            <td className="py-1.5 font-mono font-bold text-teal-700 dark:text-teal-400">{avg}%</td>
                            <td className="py-1.5 font-mono text-emerald-600">{Math.max(...scores)}</td>
                            <td className="py-1.5 font-mono text-rose-600">{Math.min(...scores)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: STUDY MATERIALS & DIGITAL LIBRARY */}
          {(activeTab === 'mat' || (activeTab === 'set' && activeSettingsSubTab === 'mat')) && <AveriqStudyMaterials />}

          {/* TAB 11: COURSES & BATCHES */}
          {(activeTab === 'crs' || (activeTab === 'set' && activeSettingsSubTab === 'crs')) && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Courses</h3>
                <div className="flex gap-2 text-xs">
                  <input
                    placeholder="New course name"
                    value={newCourseName}
                    onChange={e => setNewCourseName(e.target.value)}
                    className="flex-1 px-2 py-1 rounded border bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCourseName) return;
                      addCourse(newCourseName);
                      setNewCourseName('');
                    }}
                    className="px-3 py-1 rounded bg-[#0f766e] text-white"
                  >
                    Add course
                  </button>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <tbody>
                      {courses.map(c => (
                        <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-medium">{c.name}</td>
                          <td className="py-1.5">{c.isActive ? 'Active' : 'Inactive'}</td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => toggleCourseStatus(c.id)}
                              className="px-2 py-0.5 rounded border text-[11px]"
                            >
                              {c.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Batches</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    placeholder="Batch name (e.g. 10-B)"
                    value={newBatchName}
                    onChange={e => setNewBatchName(e.target.value)}
                    className="px-2 py-1 rounded border bg-transparent"
                  />
                  <select
                    value={newBatchCourse}
                    onChange={e => setNewBatchCourse(e.target.value)}
                    className="px-2 py-1 rounded border bg-transparent"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={newBatchTeacher}
                    onChange={e => setNewBatchTeacher(e.target.value)}
                    className="px-2 py-1 rounded border bg-transparent"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBatchName) return;
                        addBatch(newBatchName, newBatchCourse, newBatchTeacher);
                        setNewBatchName('');
                      }}
                      className="px-3 py-1 rounded bg-[#0f766e] text-white"
                    >
                      Add batch
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Batch</th>
                        <th className="py-1">Course</th>
                        <th className="py-1">Teacher</th>
                        <th className="py-1">Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map(b => (
                        <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-bold">{b.name}</td>
                          <td className="py-1.5">{b.courseName}</td>
                          <td className="py-1.5">{b.teacherName}</td>
                          <td className="py-1.5 font-mono">{students.filter(s => s.batchName === b.name).length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: PTM (Parent-Teacher Meetings) */}
          {(activeTab === 'ptm' || (activeTab === 'set' && activeSettingsSubTab === 'ptm')) && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Schedule parent-teacher meeting</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    schedulePTM(newPTMForm);
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Date
                    <input
                      type="date"
                      value={newPTMForm.date}
                      onChange={e => setNewPTMForm({ ...newPTMForm, date: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Time
                    <input
                      type="time"
                      value={newPTMForm.time}
                      onChange={e => setNewPTMForm({ ...newPTMForm, time: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Location or mode
                    <input
                      value={newPTMForm.location}
                      onChange={e => setNewPTMForm({ ...newPTMForm, location: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newPTMForm.batch}
                      onChange={e => setNewPTMForm({ ...newPTMForm, batch: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="All">All Batches</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <div className="col-span-2 sm:col-span-4 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Schedule PTM
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Scheduled PTMs</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Date</th>
                        <th className="py-1">Time</th>
                        <th className="py-1">Where</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ptmMeetings.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-mono">{p.date}</td>
                          <td className="py-1.5 font-mono">{p.time}</td>
                          <td className="py-1.5">{p.location}</td>
                          <td className="py-1.5 font-mono">{p.batch}</td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => cancelPTM(p.id)}
                              className="text-rose-600 hover:underline"
                            >
                              Cancel
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

          {/* TAB 13: FINANCE & ACCOUNTS */}
          {(activeTab === 'fin' || (activeTab === 'set' && activeSettingsSubTab === 'fin')) && (
            <div className="space-y-4">
              {/* Add Entry */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Add finance entry</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newFinanceForm.amount) return showToast('Enter amount');
                    addFinanceTransaction({ ...newFinanceForm, amount: Number(newFinanceForm.amount) });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Type
                    <select
                      value={newFinanceForm.type}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, type: e.target.value as any })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="Debit">Debit (Expense)</option>
                      <option value="Credit">Credit (Income)</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Category
                    <select
                      value={newFinanceForm.category}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, category: e.target.value as any })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="Rent">Rent</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Amount (₹)
                    <input
                      type="number"
                      required
                      value={newFinanceForm.amount}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, amount: Number(e.target.value) })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Date
                    <input
                      type="date"
                      value={newFinanceForm.date}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, date: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Mode
                    <select
                      value={newFinanceForm.mode}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, mode: e.target.value as any })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="Bank">Bank</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Description
                    <input
                      placeholder="e.g. Branch electrical bill"
                      value={newFinanceForm.description}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, description: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Add Entry
                    </button>
                  </div>
                </form>
              </div>

              {/* Finance Balance Strip */}
              {(() => {
                const allFin = [
                  ...financeTransactions,
                  ...feePayments.map(p => ({
                    id: p.id,
                    type: 'Credit' as const,
                    category: 'Student fees' as const,
                    amount: p.amount,
                    date: p.date,
                    description: p.studentName,
                    mode: p.mode
                  }))
                ].filter(x => (!financeFrom || x.date >= financeFrom) && (!financeTo || x.date <= financeTo));

                const feeCollections = allFin.filter(x => x.category === 'Student fees').reduce((a, b) => a + b.amount, 0);
                const otherCredits = allFin.filter(x => x.type === 'Credit' && x.category !== 'Student fees').reduce((a, b) => a + b.amount, 0);
                const totalExpenses = allFin.filter(x => x.type === 'Debit').reduce((a, b) => a + b.amount, 0);
                const netOperating = feeCollections + otherCredits - totalExpenses;

                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Fee collections</span>
                        <div className="text-lg font-bold font-mono text-emerald-600">₹{inr(feeCollections)}</div>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Other credits</span>
                        <div className="text-lg font-bold font-mono">₹{inr(otherCredits)}</div>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Expenses</span>
                        <div className="text-lg font-bold font-mono text-rose-600">₹{inr(totalExpenses)}</div>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Net operating</span>
                        <div className={`text-lg font-bold font-mono ${netOperating >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ₹{inr(netOperating)}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Ledger report</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const lines = allFin.map(x => `${x.date},${x.type},${x.category},${x.description},${x.amount}`);
                            setExportModalContent(`Date,Type,Category,Description,Amount\n${lines.join('\n')}`);
                          }}
                          className="px-2 py-0.5 rounded border text-xs"
                        >
                          Export report
                        </button>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b text-slate-400">
                              <th className="py-1">Date</th>
                              <th className="py-1">Type</th>
                              <th className="py-1">Category</th>
                              <th className="py-1">Description</th>
                              <th className="py-1">Mode</th>
                              <th className="py-1 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allFin.map(f => (
                              <tr key={f.id} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="py-1.5 font-mono text-slate-400">{f.date}</td>
                                <td className="py-1.5 font-mono">
                                  <span className={f.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}>{f.type}</span>
                                </td>
                                <td className="py-1.5">{f.category}</td>
                                <td className="py-1.5 text-slate-500">{f.description}</td>
                                <td className="py-1.5 text-slate-400">{f.mode}</td>
                                <td className="py-1.5 font-mono font-bold text-right">₹{inr(f.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB 14: USERS & AUDIT */}
          {(activeTab === 'usr' || (activeTab === 'set' && activeSettingsSubTab === 'usr')) && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Staff accounts and permissions</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Name</th>
                        <th className="py-1">Role</th>
                        <th className="py-1">Permitted Modules</th>
                        <th className="py-1">Subject</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map(t => (
                        <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-medium">{t.name}</td>
                          <td className="py-1.5">Teacher</td>
                          <td className="py-1.5 text-slate-500">{t.permittedModules}</td>
                          <td className="py-1.5 font-semibold text-teal-700 dark:text-teal-400">{t.specialization}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Audit history</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Time</th>
                        <th className="py-1">User Role</th>
                        <th className="py-1">Action & Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(l => (
                        <tr key={l.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-mono text-slate-400">{l.timestamp}</td>
                          <td className="py-1.5 font-semibold text-teal-700 dark:text-teal-400">{l.userName}</td>
                          <td className="py-1.5 text-slate-700 dark:text-slate-300">{l.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ROLES AND PERMISSIONS */}
          {activeTab === 'roles' && <AveriqRolesPermissions />}

          {/* TAB 15: PARENT PORTAL */}
          {activeTab === 'por' && (
            <AveriqParentPortal
              onNavigateTab={(tabId) => {
                setActiveTab(tabId);
                setProfileModalStudent(null);
              }}
            />
          )}

          {/* COMMUNICATIONS & BROADCAST */}
          {(activeTab === 'comm' || activeTab === 'notif') && <AveriqCommunications />}
        </main>
      </div>

      {/* Quick Action Modals */}
      <QuickActionModals
        modalType={quickModal}
        onClose={() => setQuickModal(null)}
        onNavigateTab={(tabId) => {
          setActiveTab(tabId);
          setProfileModalStudent(null);
        }}
      />

      {/* Payment Receipt Modal */}
      {receiptModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] p-5 shadow-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-600" />
              <span>Official Payment Receipt</span>
            </h3>
            {(() => {
              const lastPay = feePayments.filter(p => p.studentName === receiptModalStudent).slice(-1)[0];
              const st = students.find(s => s.name === receiptModalStudent);
              if (!lastPay || !st) {
                return <p className="text-slate-500">No payment transaction recorded for {receiptModalStudent} yet.</p>;
              }
              return (
                <div className="space-y-1.5 p-3 rounded bg-slate-50 dark:bg-slate-900 border">
                  <div>Student: <strong>{receiptModalStudent}</strong></div>
                  <div>Date: <span className="font-mono">{lastPay.date}</span></div>
                  <div>Amount: <strong className="font-mono text-emerald-600 font-bold">₹{inr(lastPay.amount)}</strong></div>
                  <div>Mode: <span>{lastPay.mode} (Ref: {lastPay.referenceNo})</span></div>
                  <div className="pt-1 border-t text-rose-600 font-bold">Remaining Balance: ₹{inr(getStudentBalance(receiptModalStudent))}</div>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReceiptModalStudent(null)}
                className="px-3 py-1.5 rounded bg-[#0f766e] text-white"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Substitute Assignment Modal */}
      {substituteModalData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] p-5 shadow-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Affected Classes & Available Substitutes</h3>
            <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
              Teacher <strong>{substituteModalData.teacher}</strong> has {substituteModalData.affected.length} class(es) on {substituteModalData.day} {substituteModalData.time}:
              {substituteModalData.affected.map(a => (
                <div key={a.id} className="mt-1 font-mono font-medium">{a.batchId.replace('batch-', '')}: {a.subjectName} ({a.classroom})</div>
              ))}
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-400 block">Available faculty substitutes:</span>
              {teachers.filter(t => t.name !== substituteModalData.teacher).map(t => (
                <div key={t.id} className="p-2 rounded border flex justify-between items-center">
                  <div>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-slate-400 text-[11px] block">{t.specialization}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      assignSubstitute(substituteModalData.affected[0].batchId.replace('batch-', ''), `${substituteModalData.day} ${substituteModalData.time}`, t.name, substituteModalData.teacher);
                      setSubstituteModalData(null);
                    }}
                    className="px-2.5 py-1 rounded bg-[#0f766e] text-white text-[11px]"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSubstituteModalData(null)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Copy Modal */}
      {exportModalContent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] p-5 shadow-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm">Export: copy into Excel / CSV</h3>
            <textarea
              rows={8}
              readOnly
              value={exportModalContent}
              className="w-full p-2 font-mono text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(exportModalContent);
                  showToast('Copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded bg-teal-600 text-white"
              >
                Copy to Clipboard
              </button>
              <button
                type="button"
                onClick={() => setExportModalContent(null)}
                className="px-3 py-1.5 rounded border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl border border-slate-700 animate-in fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
