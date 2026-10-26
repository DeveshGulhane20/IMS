import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
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
  Check
} from 'lucide-react';

interface QuickActionModalsProps {
  modalType: 'student' | 'teacher' | 'attendance' | 'fee' | 'exam' | 'inquiry' | 'help' | null;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

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

  // Student Form
  const [studentForm, setStudentForm] = useState({
    name: '',
    gradeLevel: '10',
    batchName: '10-A',
    parentName: '',
    phone: '',
    totalFee: 24000
  });

  // Teacher Form
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    employeeCode: 'FAC-2026',
    specialization: 'Mathematics & Computing',
    qualification: 'M.Sc, B.Ed',
    workloadHours: 24,
    phone: '+91 98765 43210'
  });

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
    batchId: 'batch-10a',
    subjectId: 'sub-maths',
    subjectName: 'Mathematics',
    maxMarks: 50,
    passingMarks: 18,
    testDate: new Date().toISOString().split('T')[0],
    testTime: '10:00'
  });

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    course: 'Class 10 Boards Preparation',
    source: 'Walk-in' as any,
    assignedTo: 'Admin',
    followUpDate: new Date().toISOString().split('T')[0]
  });

  if (!modalType) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) {
      showToast('Please enter student name');
      return;
    }
    enrollStudent(studentForm);
    showToast(`Student ${studentForm.name} registered successfully!`);
    onClose();
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name.trim()) {
      showToast('Please enter faculty name');
      return;
    }
    showToast(`Faculty ${teacherForm.name} added to teacher roster!`);
    onClose();
    onNavigateTab('tea');
  };

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
      ...examForm,
      teacherId: 'user-02',
      isPublished: true
    });
    showToast(`Exam "${examForm.title}" scheduled successfully!`);
    onClose();
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.phone.trim()) {
      showToast('Please provide contact name and phone');
      return;
    }
    addInquiry({
      ...inquiryForm,
      status: 'New'
    });
    showToast(`Inquiry from ${inquiryForm.name} logged into CRM!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            {modalType === 'student' && <UserPlus className="w-5 h-5 text-blue-600" />}
            {modalType === 'teacher' && <GraduationCap className="w-5 h-5 text-purple-600" />}
            {modalType === 'attendance' && <CheckSquare className="w-5 h-5 text-emerald-600" />}
            {modalType === 'fee' && <CreditCard className="w-5 h-5 text-emerald-600" />}
            {modalType === 'exam' && <FileCheck className="w-5 h-5 text-orange-600" />}
            {modalType === 'inquiry' && <Send className="w-5 h-5 text-pink-600" />}
            {modalType === 'help' && <HelpCircle className="w-5 h-5 text-blue-600" />}

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {modalType === 'student' && 'Add New Student'}
              {modalType === 'teacher' && 'Add Faculty / Teacher'}
              {modalType === 'attendance' && 'Mark Class Attendance'}
              {modalType === 'fee' && 'Record Fee Payment'}
              {modalType === 'exam' && 'Schedule New Exam'}
              {modalType === 'inquiry' && 'Log Admission Inquiry'}
              {modalType === 'help' && 'School Support & Help'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Add Student */}
          {modalType === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="e.g. Diya Sharma"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Grade / Class
                  </label>
                  <select
                    value={studentForm.gradeLevel}
                    onChange={e => setStudentForm({ ...studentForm, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Batch Section
                  </label>
                  <input
                    type="text"
                    value={studentForm.batchName}
                    onChange={e => setStudentForm({ ...studentForm, batchName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={studentForm.parentName}
                    onChange={e => setStudentForm({ ...studentForm, parentName: e.target.value })}
                    placeholder="e.g. Meera Sharma"
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={studentForm.phone}
                    onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Annual Course Fee (₹)
                </label>
                <input
                  type="number"
                  value={studentForm.totalFee}
                  onChange={e => setStudentForm({ ...studentForm, totalFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
                >
                  Register Student
                </button>
              </div>
            </form>
          )}

          {/* Add Teacher */}
          {modalType === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Name *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={teacherForm.specialization}
                    onChange={e => setTeacherForm({ ...teacherForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={teacherForm.qualification}
                    onChange={e => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Workload (Hrs/Week)
                  </label>
                  <input
                    type="number"
                    value={teacherForm.workloadHours}
                    onChange={e => setTeacherForm({ ...teacherForm, workloadHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={teacherForm.phone}
                    onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-xs"
                >
                  Add Teacher
                </button>
              </div>
            </form>
          )}

          {/* Mark Attendance */}
          {modalType === 'attendance' && (
            <form onSubmit={handleAttendanceSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-800 dark:text-emerald-200">
                <p className="font-medium">Quick Class Attendance</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Records full daily roll call for the selected section.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select Section / Class
                  </label>
                  <select
                    value={attendanceForm.batchName}
                    onChange={e => setAttendanceForm({ ...attendanceForm, batchName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="10-A">Class 10-A</option>
                    <option value="9-B">Class 9-B</option>
                    <option value="11-A">Class 11-A</option>
                    <option value="12-A">Class 12-A</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Attendance Date
                  </label>
                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={e => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Mark All Enrolled as Present
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Default all students to present for swift submission
                  </div>
                </div>
                <Check className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTab('att');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300"
                >
                  Open Full Grid
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          )}

          {/* Add Fee Record */}
          {modalType === 'fee' && (
            <form onSubmit={handleFeeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Student
                </label>
                <select
                  value={feeForm.studentName}
                  onChange={e => setFeeForm({ ...feeForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.batchName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Amount Received (₹)
                  </label>
                  <input
                    type="number"
                    value={feeForm.amount}
                    onChange={e => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={feeForm.mode}
                    onChange={e => setFeeForm({ ...feeForm, mode: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Transaction / Ref Number
                </label>
                <input
                  type="text"
                  value={feeForm.ref}
                  onChange={e => setFeeForm({ ...feeForm, ref: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs"
                >
                  Record Fee Receipt
                </button>
              </div>
            </form>
          )}

          {/* Create Exam */}
          {modalType === 'exam' && (
            <form onSubmit={handleExamSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={e => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={examForm.subjectName}
                    onChange={e => setExamForm({ ...examForm, subjectName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Batch
                  </label>
                  <select
                    value={examForm.batchId}
                    onChange={e => setExamForm({ ...examForm, batchId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="batch-10a">Class 10-A</option>
                    <option value="batch-9b">Class 9-B</option>
                    <option value="batch-11a">Class 11-A</option>
                    <option value="batch-12a">Class 12-A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Test Date
                  </label>
                  <input
                    type="date"
                    value={examForm.testDate}
                    onChange={e => setExamForm({ ...examForm, testDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Test Time
                  </label>
                  <input
                    type="time"
                    value={examForm.testTime}
                    onChange={e => setExamForm({ ...examForm, testTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={examForm.maxMarks}
                    onChange={e => setExamForm({ ...examForm, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    value={examForm.passingMarks}
                    onChange={e => setExamForm({ ...examForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-xs"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          )}

          {/* Send Inquiry */}
          {modalType === 'inquiry' && (
            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Candidate / Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="e.g. Kavita Verma"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.phone}
                    onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    placeholder="+91 99887 76655"
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course Interested In
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.course}
                    onChange={e => setInquiryForm({ ...inquiryForm, course: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Inquiry Source
                  </label>
                  <select
                    value={inquiryForm.source}
                    onChange={e => setInquiryForm({ ...inquiryForm, source: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Walk-in">Walk-in Campus</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Student Referral</option>
                    <option value="Call">Direct Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={inquiryForm.followUpDate}
                    onChange={e => setInquiryForm({ ...inquiryForm, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-xs"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          )}

          {/* Help & Support */}
          {modalType === 'help' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl text-blue-900 dark:text-blue-200">
                <p className="font-bold text-sm">Averiq Support Desk</p>
                <p className="text-[11px] mt-0.5">
                  Assistance with administrative workflows, student roll calls, and fee ledgers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Admin Hotline</div>
                    <div className="text-slate-500 font-mono">+91 1800 233 4567 (Mon-Sat, 8am-7pm)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Mail className="w-5 h-5 text-purple-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Email Helpdesk</div>
                    <div className="text-slate-500">support@averiqschool.edu</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Building className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Knowledge Base</div>
                    <div className="text-slate-500">Guides for Exam grading, Attendance, and Parent SMS notifications.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
