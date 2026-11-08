import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { AveriqAddStudentModal } from './AveriqAddStudentModal';
import { AveriqAddTeacherModal } from './AveriqAddTeacherModal';
import {
  X,
  UserPlus,
  GraduationCap,
  CheckSquare,
  CreditCard,
  FileCheck,
  Send,
  HelpCircle,
  Phone,
  Mail,
  Building,
  Check,
  Calendar,
  Clock,
  User,
  Users,
  MapPin,
  Sparkles,
  BookOpen,
  FileText,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface QuickActionModalsProps {
  modalType: 'student' | 'teacher' | 'attendance' | 'fee' | 'exam' | 'inquiry' | 'help' | null;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

const calculateEndTime = (start: string, duration: number): string => {
  if (!start) return '';
  const [h, m] = start.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return '';
  const totalMinutes = h * 60 + m + duration;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

export const QuickActionModals: React.FC<QuickActionModalsProps> = ({
  modalType,
  onClose,
  onNavigateTab,
}) => {
  const {
    students,
    batches,
    enrollStudent,
    collectFee,
    addInquiry,
    createTest,
    markBatchAttendance,
    showToast
  } = useIMS();

  // Attendance Form
  const [attendanceForm, setAttendanceForm] = useState({
    batchName: '10-A',
    date: new Date().toISOString().split('T')[0],
    markAllPresent: true
  });

  // Fee Form
  const [feeForm, setFeeForm] = useState({
    studentName: students[0]?.name || 'Aarav Patel',
    amount: 12000,
    mode: 'UPI' as 'Cash' | 'UPI' | 'Card' | 'Bank',
    ref: 'UPI-TXN-90214'
  });

  // Exam Form
  const [examForm, setExamForm] = useState({
    title: 'Mid-Term Assessment 2026',
    examType: 'Mid-Term' as 'Unit Test' | 'Mid-Term' | 'Mock Exam' | 'Board Prep',
    batchId: 'batch-10a',
    subjectId: 'sub-maths',
    subjectName: 'Mathematics',
    testDate: new Date().toISOString().split('T')[0],
    testTime: '10:00',
    durationMinutes: 90,
    endTime: '11:30',
    maxMarks: 50,
    passingMarks: 18,
    invigilatorName: 'Prof. Rajesh Sharma',
    roomAllocation: 'Examination Hall A (Seats 1-45)',
    syllabusCovered: 'Unit 1: Real Numbers, Polynomials & Quadratic Equations; Unit 2: Triangles & Coordinate Geometry.'
  });

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    parentName: '',
    phone: '',
    email: '',
    course: 'Class 10 Boards Preparation',
    source: 'Walk-in' as 'Walk-in' | 'Website' | 'Referral' | 'Call' | 'Education Expo',
    leadStatus: 'Hot' as 'Hot' | 'Warm' | 'Cold',
    assignedTo: 'Pooja Tanna (Senior Counselor)',
    followUpDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  if (!modalType) return null;

  // Intercept 1: Comprehensive Add Student Modal
  if (modalType === 'student') {
    return (
      <AveriqAddStudentModal
        isOpen={true}
        onClose={onClose}
        onSuccess={(data) => {
          enrollStudent({
            name: data.name,
            batchName: data.batchName,
            gradeLevel: data.gradeLevel,
            parentName: data.parentName,
            phone: data.phone,
            totalFee: Math.max(0, data.totalFee - data.scholarship)
          });
          showToast(`Student ${data.name} enrolled into ${data.gradeLevel} successfully!`);
          onClose();
        }}
      />
    );
  }

  // Intercept 2: Comprehensive Add Teacher Modal
  if (modalType === 'teacher') {
    return (
      <AveriqAddTeacherModal
        isOpen={true}
        onClose={onClose}
        onSuccess={(data) => {
          showToast(`Faculty ${data.name} (${data.employeeCode}) onboarded to ${data.department}!`);
          onClose();
          onNavigateTab('tea');
        }}
      />
    );
  }

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batchStudents = students.filter(
      s => s.batchName.toLowerCase() === attendanceForm.batchName.toLowerCase()
    );
    const records: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
    batchStudents.forEach(s => {
      records[s.id] = 'PRESENT';
    });
    markBatchAttendance(attendanceForm.batchName, attendanceForm.date, records);
    showToast(`Roll call saved for Class ${attendanceForm.batchName} (${batchStudents.length} present)`);
    onClose();
    onNavigateTab('att');
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feeForm.amount <= 0) {
      showToast('Please enter a valid fee amount');
      return;
    }
    collectFee(feeForm.studentName, feeForm.amount, feeForm.mode);
    showToast(`Payment receipt generated for ${feeForm.studentName} (₹${feeForm.amount.toLocaleString('en-IN')})`);
    onClose();
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.title.trim()) {
      showToast('Please enter exam title');
      return;
    }
    createTest({
      title: `${examForm.title} [${examForm.examType}]`,
      batchId: examForm.batchId,
      subjectId: examForm.subjectId,
      subjectName: examForm.subjectName,
      maxMarks: examForm.maxMarks,
      passingMarks: examForm.passingMarks,
      testDate: examForm.testDate,
      testTime: `${examForm.testTime} - ${examForm.endTime}`,
      teacherId: 'user-02',
      isPublished: true
    });
    showToast(`Exam "${examForm.title}" scheduled successfully in ${examForm.roomAllocation}!`);
    onClose();
    onNavigateTab('exm');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.phone.trim()) {
      showToast('Please provide candidate name and phone number');
      return;
    }
    addInquiry({
      name: inquiryForm.name,
      phone: inquiryForm.phone,
      course: inquiryForm.course,
      source: (inquiryForm.source === 'Call' || inquiryForm.source === 'Walk-in' || inquiryForm.source === 'Website' ? inquiryForm.source : 'Other'),
      assignedTo: inquiryForm.assignedTo,
      followUpDate: inquiryForm.followUpDate,
      status: 'New',
      notes: `[Priority: ${inquiryForm.leadStatus} Lead] [Parent: ${inquiryForm.parentName || 'N/A'}] [Email: ${inquiryForm.email || 'N/A'}] ${inquiryForm.notes}`
    });
    showToast(`Inquiry for ${inquiryForm.name} logged into Admissions CRM!`);
    onClose();
    onNavigateTab('crm');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#122D4A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className={`bg-white dark:bg-slate-900 border border-[#d5e8f7] dark:border-slate-800 rounded-[22px] shadow-[0_12px_35px_rgba(39,94,150,0.12)] w-full overflow-hidden my-6 flex flex-col max-h-[92vh] text-[#122D4A] dark:text-slate-100 animate-scaleUp ${
          modalType === 'inquiry' || modalType === 'exam' ? 'max-w-2xl' : 'max-w-lg'
        }`}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#d5e8f7] dark:border-slate-800 flex items-center justify-between bg-[#f8fbff] dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            {modalType === 'attendance' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center shadow-xs">
                <CheckSquare className="w-5 h-5" />
              </div>
            )}
            {modalType === 'fee' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
            )}
            {modalType === 'exam' && (
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200/60 flex items-center justify-center shadow-xs">
                <FileCheck className="w-5 h-5" />
              </div>
            )}
            {modalType === 'inquiry' && (
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border border-pink-200/60 flex items-center justify-center shadow-xs">
                <Send className="w-5 h-5" />
              </div>
            )}
            {modalType === 'help' && (
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 flex items-center justify-center shadow-xs">
                <HelpCircle className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#173a5d] dark:text-white">
                  {modalType === 'attendance' && 'Mark Class Attendance'}
                  {modalType === 'fee' && 'Record Fee Payment'}
                  {modalType === 'exam' && 'Schedule New Exam'}
                  {modalType === 'inquiry' && 'Log Admission Inquiry'}
                  {modalType === 'help' && 'School Support & Help'}
                </h3>
                {modalType === 'exam' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200/60">
                    Academic Testing Engine
                  </span>
                )}
                {modalType === 'inquiry' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/60">
                    Admissions CRM
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5A7184] dark:text-slate-400">
                {modalType === 'attendance' && 'Conduct daily roll call and record class attendance metrics'}
                {modalType === 'fee' && 'Issue electronic receipt for tuition and course fees'}
                {modalType === 'exam' && 'Configure assessment date, invigilator, venue & syllabus coverage'}
                {modalType === 'inquiry' && 'Record candidate lead, guardian contacts & counseling follow-up'}
                {modalType === 'help' && 'Administrative guidance and platform help center'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#173a5d] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. Mark Attendance */}
          {modalType === 'attendance' && (
            <form onSubmit={handleAttendanceSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl text-emerald-800 dark:text-emerald-200">
                <p className="font-bold text-xs">Quick Class Attendance Roll Call</p>
                <p className="text-[11px] mt-0.5 opacity-90">
                  Instantly records presence for all active students enrolled in this batch.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                  Target Class / Batch *
                </label>
                <select
                  value={attendanceForm.batchName}
                  onChange={e => setAttendanceForm({ ...attendanceForm, batchName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                >
                  <option value="10-A">Class 10-A (CBSE)</option>
                  <option value="10-B">Class 10-B (CBSE)</option>
                  <option value="9-A">Class 9-A (ICSE)</option>
                  <option value="11-A">Class 11-A (Science)</option>
                  <option value="12-A">Class 12-A (Science)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                  Attendance Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#d5e8f7] dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#d5e8f7] dark:border-slate-700 text-xs font-semibold text-[#5A7184] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-[0_4px_14px_rgba(5,150,105,0.25)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Save Batch Attendance</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. Fee Collection */}
          {modalType === 'fee' && (
            <form onSubmit={handleFeeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                  Select Student *
                </label>
                <select
                  value={feeForm.studentName}
                  onChange={e => setFeeForm({ ...feeForm, studentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.batchName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Amount Received (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={feeForm.amount}
                    onChange={e => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={feeForm.mode}
                    onChange={e => setFeeForm({ ...feeForm, mode: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer / NEFT</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                  Transaction / Reference ID
                </label>
                <input
                  type="text"
                  value={feeForm.ref}
                  onChange={e => setFeeForm({ ...feeForm, ref: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#d5e8f7] dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#d5e8f7] dark:border-slate-700 text-xs font-semibold text-[#5A7184] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-[0_4px_14px_rgba(5,150,105,0.25)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Generate Electronic Receipt</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. Schedule New Exam Modal (Enhanced) */}
          {modalType === 'exam' && (
            <form onSubmit={handleExamSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Exam Title *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={examForm.title}
                      onChange={e => setExamForm({ ...examForm, title: e.target.value })}
                      placeholder="e.g. Mid-Term Assessment 2026"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Exam Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Unit Test', 'Mid-Term', 'Mock Exam', 'Board Prep'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setExamForm({ ...examForm, examType: type as any })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer text-center ${
                          examForm.examType === type
                            ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                            : 'bg-[#f8fbff] border-[#d5e8f7] text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-orange-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Subject Name *
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={examForm.subjectName}
                      onChange={e => setExamForm({ ...examForm, subjectName: e.target.value })}
                      placeholder="e.g. Mathematics"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Target Batch
                  </label>
                  <select
                    value={examForm.batchId}
                    onChange={e => setExamForm({ ...examForm, batchId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                  >
                    <option value="batch-10a">Class 10-A (CBSE)</option>
                    <option value="batch-10b">Class 10-B (CBSE)</option>
                    <option value="batch-9a">Class 9-A (ICSE)</option>
                    <option value="batch-11a">Class 11-A (Science)</option>
                    <option value="batch-12a">Class 12-A (Science)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Test Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={examForm.testDate}
                      onChange={e => setExamForm({ ...examForm, testDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={examForm.testTime}
                      onChange={e => {
                        const newTime = e.target.value;
                        setExamForm({
                          ...examForm,
                          testTime: newTime,
                          endTime: calculateEndTime(newTime, examForm.durationMinutes)
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={examForm.durationMinutes}
                      onChange={e => {
                        const duration = Number(e.target.value);
                        setExamForm({
                          ...examForm,
                          durationMinutes: duration,
                          endTime: calculateEndTime(examForm.testTime, duration)
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs font-mono font-bold text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                      End Time (Auto)
                    </label>
                    <input
                      type="time"
                      value={examForm.endTime}
                      onChange={e => setExamForm({ ...examForm, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={examForm.maxMarks}
                    onChange={e => setExamForm({ ...examForm, maxMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    value={examForm.passingMarks}
                    onChange={e => setExamForm({ ...examForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Invigilator Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={examForm.invigilatorName}
                      onChange={e => setExamForm({ ...examForm, invigilatorName: e.target.value })}
                      placeholder="e.g. Prof. Rajesh Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Room / Hall Allocation
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={examForm.roomAllocation}
                      onChange={e => setExamForm({ ...examForm, roomAllocation: e.target.value })}
                      placeholder="e.g. Examination Hall A (Seats 1-45)"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Syllabus / Topics Covered
                  </label>
                  <textarea
                    rows={2}
                    value={examForm.syllabusCovered}
                    onChange={e => setExamForm({ ...examForm, syllabusCovered: e.target.value })}
                    placeholder="e.g. Unit 1: Real Numbers, Polynomials & Quadratic Equations; Unit 2: Triangles & Coordinate Geometry."
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#d5e8f7] dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#d5e8f7] dark:border-slate-700 text-xs font-semibold text-[#5A7184] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-[0_4px_14px_rgba(234,88,12,0.25)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Schedule Examination</span>
                </button>
              </div>
            </form>
          )}

          {/* 4. Log Admission Inquiry Modal (Enhanced) */}
          {modalType === 'inquiry' && (
            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Candidate / Student Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="e.g. Kavita Verma"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Parent / Guardian Name
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={inquiryForm.parentName}
                      onChange={e => setInquiryForm({ ...inquiryForm, parentName: e.target.value })}
                      placeholder="e.g. Rajesh Verma"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="+91 99887 76655"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="parent.verma@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Course / Class Interested In
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.course}
                    onChange={e => setInquiryForm({ ...inquiryForm, course: e.target.value })}
                    placeholder="e.g. Class 10 Boards Foundation"
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Inquiry Source
                  </label>
                  <select
                    value={inquiryForm.source}
                    onChange={e => setInquiryForm({ ...inquiryForm, source: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                  >
                    <option value="Walk-in">Walk-in Campus</option>
                    <option value="Website">Institute Website</option>
                    <option value="Referral">Student / Parent Referral</option>
                    <option value="Call">Direct Phone Call</option>
                    <option value="Education Expo">Education Expo / Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Lead Priority Status
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Hot', 'Warm', 'Cold'] as const).map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setInquiryForm({ ...inquiryForm, leadStatus: status })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                          inquiryForm.leadStatus === status
                            ? status === 'Hot'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                              : status === 'Warm'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                              : 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-[#f8fbff] border-[#d5e8f7] text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {status === 'Hot' && '🔥 Hot'}
                        {status === 'Warm' && '⚡ Warm'}
                        {status === 'Cold' && '❄️ Cold'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Assigned Admissions Counselor
                  </label>
                  <select
                    value={inquiryForm.assignedTo}
                    onChange={e => setInquiryForm({ ...inquiryForm, assignedTo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                  >
                    <option value="Pooja Tanna (Senior Counselor)">Pooja Tanna (Senior Counselor)</option>
                    <option value="Dr. Rajesh Sharma (Academic Director)">Dr. Rajesh Sharma (Academic Director)</option>
                    <option value="Anand Verma (Admissions Head)">Anand Verma (Admissions Head)</option>
                    <option value="Meera Iyer (Counseling Desk)">Meera Iyer (Counseling Desk)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Next Follow-up Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={inquiryForm.followUpDate}
                      onChange={e => setInquiryForm({ ...inquiryForm, followUpDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Counselor Notes & Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={inquiryForm.notes}
                    onChange={e => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                    placeholder="e.g. Inquired about Foundation batches and fee installment plans. Wants demo session on Saturday."
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#d5e8f7] dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#d5e8f7] dark:border-slate-700 text-xs font-semibold text-[#5A7184] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-[0_4px_14px_rgba(219,39,119,0.25)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Admission Inquiry</span>
                </button>
              </div>
            </form>
          )}

          {/* 5. Help & Support */}
          {modalType === 'help' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#f8fbff] dark:bg-blue-950/30 border border-[#d5e8f7] dark:border-blue-800/60 rounded-2xl text-[#173a5d] dark:text-blue-200">
                <p className="font-bold text-sm">Averiq Support Desk</p>
                <p className="text-xs mt-1 text-[#5A7184] dark:text-slate-400">
                  Assistance with administrative workflows, student roll calls, and fee ledgers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-white dark:bg-slate-800 border border-[#d5e8f7] dark:border-slate-700 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Admin Emergency Line</p>
                    <p className="text-slate-500 font-mono text-[11px]">+91 (020) 2567-8900</p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 border border-[#d5e8f7] dark:border-slate-700 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Technical Support</p>
                    <p className="text-slate-500 font-mono text-[11px]">support@averiq.edu</p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 border border-[#d5e8f7] dark:border-slate-700 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Governance Office</p>
                    <p className="text-slate-500 text-[11px]">Campus Admin Block, 2nd Floor, Room 204</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#d5e8f7] dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#3979C5] hover:bg-[#2F68AC] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Close Help Desk
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
