import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  User,
  X,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ClipboardList,
  Paperclip,
  Check
} from 'lucide-react';
import { academicStudents, academicParents } from '../../data/mockAcademicData';
import { DetailedStudent } from '../../types/academic';
import { InteractivePieChart } from '../charts/InteractivePieChart';
import { SemesterComparisonChart } from '../charts/SemesterComparisonChart';
import { HomeworkService } from '../../services/homeworkService';

export const AveriqStudentsDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStudent, setSelectedStudent] = useState<DetailedStudent | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'academics' | 'fees' | 'attendance' | 'homework' | 'parent'>('academics');
  const [hwVersion, setHwVersion] = useState(0);

  // Filter students
  const filteredStudents = useMemo(() => {
    return academicStudents.filter(student => {
      const matchSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchClass =
        selectedClass === 'All' ||
        (selectedClass === '10A' && student.batchId === 'batch-10a') ||
        (selectedClass === '10B' && student.batchId === 'batch-10b') ||
        (selectedClass === '9A' && student.batchId === 'batch-9a') ||
        (selectedClass === '8A' && student.batchId === 'batch-8a');

      return matchSearch && matchClass;
    });
  }, [searchTerm, selectedClass]);

  // Grade Distribution Pie Data
  const gradeDistributionData = useMemo(() => {
    const counts = { 'A+ (90%+)': 0, 'A (80-89%)': 0, 'B+ (70-79%)': 0, 'B (60-69%)': 0, 'C (<60%)': 0 };
    academicStudents.forEach(s => {
      const avg = (s.semesters.sem1.percentage + s.semesters.sem2.percentage) / 2;
      if (avg >= 90) counts['A+ (90%+)']++;
      else if (avg >= 80) counts['A (80-89%)']++;
      else if (avg >= 70) counts['B+ (70-79%)']++;
      else if (avg >= 60) counts['B (60-69%)']++;
      else counts['C (<60%)']++;
    });

    return [
      { name: 'A+ (90%+)', value: counts['A+ (90%+)'], color: '#00C853' },
      { name: 'A (80-89%)', value: counts['A (80-89%)'], color: '#0056D6' },
      { name: 'B+ (70-79%)', value: counts['B+ (70-79%)'], color: '#7C3AED' },
      { name: 'B (60-69%)', value: counts['B (60-69%)'], color: '#F57C00' },
      { name: 'C (<60%)', value: counts['C (<60%)'], color: '#EF4444' }
    ];
  }, []);

  // Class Enrollment Pie Data
  const classEnrollmentData = useMemo(() => {
    return [
      { name: 'Class 10A (Science)', value: academicStudents.filter(s => s.batchId === 'batch-10a').length, color: '#0056D6' },
      { name: 'Class 10B (Science)', value: academicStudents.filter(s => s.batchId === 'batch-10b').length, color: '#0284C7' },
      { name: 'Class 9A (Foundation)', value: academicStudents.filter(s => s.batchId === 'batch-9a').length, color: '#7C3AED' },
      { name: 'Class 8A (General)', value: academicStudents.filter(s => s.batchId === 'batch-8a').length, color: '#10B981' }
    ];
  }, []);

  const linkedParent = useMemo(() => {
    if (!selectedStudent) return null;
    return academicParents.find(p => p.parentCode === selectedStudent.parentId) || null;
  }, [selectedStudent]);

  const studentHwSummary = useMemo(() => {
    if (!selectedStudent) return null;
    return HomeworkService.getStudentHomeworkSummary(selectedStudent.id, selectedStudent.batchId);
  }, [selectedStudent, hwVersion]);

  // FULL IN-PAGE STUDENT PROFILE VIEW (Replaces Student Directory when student is selected)
  if (selectedStudent) {
    const s1 = selectedStudent.semesters.sem1.percentage;
    const s2 = selectedStudent.semesters.sem2.percentage;
    const diff = Number((s2 - s1).toFixed(1));

    return (
      <div className="space-y-6">
        {/* Top Navigation & Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 transition-colors shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Students List</span>
            </button>
            <div className="hidden sm:block text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Students Directory</span>
              <span className="mx-1.5">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-800">
              {selectedStudent.studentCode}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                selectedStudent.fees.status === 'PAID'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800'
                  : selectedStudent.fees.status === 'PARTIAL'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800'
              }`}
            >
              {selectedStudent.fees.status === 'PAID' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {selectedStudent.fees.status === 'PARTIAL' && <Clock className="w-3.5 h-3.5" />}
              {selectedStudent.fees.status === 'OVERDUE' && <AlertCircle className="w-3.5 h-3.5" />}
              Fee: {selectedStudent.fees.status}
            </span>
          </div>
        </div>

        {/* Comprehensive Student Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-2xl shadow-md shrink-0">
                {selectedStudent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedStudent.name}
                  </h2>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                    {selectedStudent.studentCode}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Enrolled Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>Class: <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.gradeLevel} {selectedStudent.section}</strong></span>
                  <span>•</span>
                  <span>Roll No: <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.rollNumber}</strong></span>
                  <span>•</span>
                  <span>Batch: <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.batchName}</strong></span>
                  <span>•</span>
                  <span>Guardian: <strong className="text-slate-800 dark:text-slate-200">{selectedStudent.parentName}</strong></span>
                </p>
              </div>
            </div>

            {/* Quick KPI Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Semester 1</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">{s1}%</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">GPA {selectedStudent.semesters.sem1.gpa}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Semester 2</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{s2}%</span>
                  <span className={`text-[10px] font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    ({diff >= 0 ? `+${diff}` : diff})
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">GPA {selectedStudent.semesters.sem2.gpa}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-center">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-semibold uppercase tracking-wider">Attendance</span>
                <span className="text-lg font-black text-blue-700 dark:text-blue-300">{selectedStudent.attendance.overallPercentage}%</span>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 block">{selectedStudent.attendance.presentDays} Days Present</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold uppercase tracking-wider">Fee Balance</span>
                <span className="text-lg font-black text-amber-700 dark:text-amber-300">
                  {selectedStudent.fees.pendingFee > 0 ? `₹${selectedStudent.fees.pendingFee.toLocaleString('en-IN')}` : '₹0 (Paid)'}
                </span>
                <span className="text-[10px] text-amber-500 dark:text-amber-400 block">{selectedStudent.fees.status}</span>
              </div>
            </div>
          </div>

          {/* Sub-navigation Profile Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 overflow-x-auto">
            {[
              { id: 'academics', label: 'Semester Records & Progression', icon: Award },
              { id: 'fees', label: 'Fee Breakdown & Collections', icon: CreditCard },
              { id: 'attendance', label: 'Attendance Trends & Log', icon: Calendar },
              { id: 'homework', label: `Homework & Assignments (${studentHwSummary?.completed || 0}/${studentHwSummary?.total || 0})`, icon: ClipboardList },
              { id: 'parent', label: 'Parent & Ward Profile', icon: User }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveProfileTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeProfileTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: ACADEMICS - SEMESTER RECORDS & PROGRESSION */}
          {activeProfileTab === 'academics' && (
            <div className="space-y-5">
              <SemesterComparisonChart
                sem1={selectedStudent.semesters.sem1}
                sem2={selectedStudent.semesters.sem2}
                studentName={selectedStudent.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>Semester 1 Subject Scores</span>
                    </h4>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                      GPA {selectedStudent.semesters.sem1.gpa} ({selectedStudent.semesters.sem1.percentage}%)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedStudent.semesters.sem1.subjects.map(s => (
                      <div key={s.subject} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-100 dark:border-slate-700/60">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{s.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-mono">{s.marksObtained}/{s.maxMarks}</span>
                          <span className="font-bold text-blue-600 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[11px]">{s.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Semester 2 Subject Scores</span>
                    </h4>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      GPA {selectedStudent.semesters.sem2.gpa} ({selectedStudent.semesters.sem2.percentage}%)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedStudent.semesters.sem2.subjects.map(s => (
                      <div key={s.subject} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-100 dark:border-slate-700/60">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{s.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-mono">{s.marksObtained}/{s.maxMarks}</span>
                          <span className="font-bold text-emerald-600 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[11px]">{s.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEES BREAKDOWN & COLLECTIONS */}
          {activeProfileTab === 'fees' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Billed Fee</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    ₹{selectedStudent.fees.totalFee.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Full academic annual cycle</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs text-emerald-600 font-medium">Amount Received / Paid</span>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    ₹{selectedStudent.fees.paidFee.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-600 block mt-1">Verified via receipts</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-xs text-amber-600 font-medium">Pending Dues Balance</span>
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
                    ₹{selectedStudent.fees.pendingFee.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-amber-600 block mt-1">Status: {selectedStudent.fees.status}</span>
                </div>
              </div>

              {/* Sub-breakdown table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                  Fee Component Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tuition Fee</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">₹{selectedStudent.fees.tuitionFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Laboratory & Practical</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">₹{selectedStudent.fees.laboratoryFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Library & Digital Books</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">₹{selectedStudent.fees.libraryFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Sports & Extra-Curricular</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">₹{selectedStudent.fees.sportsFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Transport Facility</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">₹{selectedStudent.fees.transportFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Exam & Evaluation</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">₹{selectedStudent.fees.examFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                  Payment Receipts & Transaction Log
                </h4>
                <div className="space-y-2.5">
                  {selectedStudent.fees.transactions.map(tx => (
                    <div key={tx.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{tx.description}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Receipt #{tx.receiptNo} • Date: {tx.date} • Mode: {tx.mode}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm block">
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          Paid & Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE TRENDS & LOG */}
          {activeProfileTab === 'attendance' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl">
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Overall Attendance</span>
                  <div className="text-3xl font-black text-blue-700 dark:text-blue-300 mt-1">
                    {selectedStudent.attendance.overallPercentage}%
                  </div>
                  <span className="text-[10px] text-blue-500 mt-0.5 block">Campus threshold: 75%</span>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl">
                  <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Days Present</span>
                  <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {selectedStudent.attendance.presentDays}
                  </div>
                  <span className="text-[10px] text-emerald-600 mt-0.5 block">Total verified sessions</span>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl">
                  <span className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Days Absent</span>
                  <div className="text-3xl font-black text-rose-700 dark:text-rose-300 mt-1">
                    {selectedStudent.attendance.absentDays}
                  </div>
                  <span className="text-[10px] text-rose-600 mt-0.5 block">Unexcused leaves</span>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl">
                  <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Late Arrivals</span>
                  <div className="text-3xl font-black text-amber-700 dark:text-amber-300 mt-1">
                    {selectedStudent.attendance.lateDays}
                  </div>
                  <span className="text-[10px] text-amber-600 mt-0.5 block">Delayed check-ins</span>
                </div>
              </div>

              {/* Monthly breakdown */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                  Month-by-Month Attendance Trajectory
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                  {selectedStudent.attendance.monthlyTrends.map(m => (
                    <div key={m.month} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">{m.month}</span>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400 block mt-1">{m.percentage}%</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{m.presentDays}/{m.workingDays} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HOMEWORK & ASSIGNMENTS TRACK RECORD */}
          {activeProfileTab === 'homework' && studentHwSummary && (
            <div className="space-y-5 animate-fadeIn">
              {/* Highlight KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl">
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Completion Rate</span>
                  <div className="text-3xl font-black text-blue-700 dark:text-blue-300 mt-1">
                    {studentHwSummary.completionRate}%
                  </div>
                  <span className="text-[10px] text-blue-500 mt-0.5 block">{studentHwSummary.completed} of {studentHwSummary.total} Completed</span>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl">
                  <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Completed / Done</span>
                  <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {studentHwSummary.completed}
                  </div>
                  <span className="text-[10px] text-emerald-600 mt-0.5 block">Verified submissions</span>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl">
                  <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Pending Tasks</span>
                  <div className="text-3xl font-black text-amber-700 dark:text-amber-300 mt-1">
                    {studentHwSummary.pending}
                  </div>
                  <span className="text-[10px] text-amber-600 mt-0.5 block">Awaiting submission</span>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 rounded-2xl">
                  <span className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Class Curriculum</span>
                  <div className="text-3xl font-black text-purple-700 dark:text-purple-300 mt-1">
                    {selectedStudent.gradeLevel}
                  </div>
                  <span className="text-[10px] text-purple-600 mt-0.5 block">{selectedStudent.batchName}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Assignment Completion Progress
                  </span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {studentHwSummary.completed} / {studentHwSummary.total} Finished ({studentHwSummary.completionRate}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      studentHwSummary.completionRate >= 80 ? 'bg-emerald-600' : studentHwSummary.completionRate >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${studentHwSummary.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Assignments Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Assigned Homework Tasks for {selectedStudent.gradeLevel} {selectedStudent.section}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Click status button to toggle completion
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Homework Title & Details</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Teacher</th>
                        <th className="py-3 px-4 text-center">Current Status</th>
                        <th className="py-3 px-4 text-center">Toggle Completion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {studentHwSummary.items.map(item => {
                        const isDone = item.record.status === 'DONE';
                        return (
                          <tr key={item.homework.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                                {item.homework.subject}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {item.homework.title}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {item.homework.description}
                              </div>
                              {item.homework.attachmentName && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 mt-1">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{item.homework.attachmentName}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                              {item.homework.dueDate}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {item.homework.teacherName}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                  <Clock className="w-3.5 h-3.5" /> Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  HomeworkService.toggleStudentStatus(item.homework.id, selectedStudent.id);
                                  setHwVersion(v => v + 1);
                                }}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1 ${
                                  isDone
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50'
                                }`}
                              >
                                {isDone ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Completed</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    <span>Mark as Done</span>
                                  </>
                                )}
                              </button>
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

          {/* TAB 5: PARENT & CONTACT PROFILE */}
          {activeProfileTab === 'parent' && (
            <div className="space-y-5">
              {linkedParent ? (
                <>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {linkedParent.fatherName} & {linkedParent.motherName}
                        </h4>
                        <span className="font-mono text-xs text-blue-600 font-semibold">
                          Parent Account ID: {linkedParent.parentCode}
                        </span>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                        {linkedParent.occupation}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block text-[11px]">Primary Phone</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{linkedParent.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block text-[11px]">Email Address</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{linkedParent.email}</span>
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-700/40">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block text-[11px]">Residential Address</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{linkedParent.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                    <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-3 uppercase tracking-wider">
                      Linked Wards / Enrolled Siblings
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {linkedParent.wardNames.map((w, idx) => (
                        <span key={w} className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>{w}</span>
                          <span className="font-mono text-[10px] text-slate-400">({linkedParent.wardStudentCodes[idx]})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <User className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Parent Record Linked: {selectedStudent.parentName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Guardian identifier: {selectedStudent.parentId}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: STUDENT ACADEMIC DIRECTORY TABLE & ANALYTICS
  return (
    <div className="space-y-6">
      {/* Top Header & Analytics Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Student Academic Directory</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              50 Enrolled Students
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Complete database with student codes, dual semester performance, attendance, and fee status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + ["Code,Name,Class,Roll,Sem1%,Sem2%,Attendance%,FeeStatus", 
                  ...academicStudents.map(s => `${s.studentCode},${s.name},${s.gradeLevel} ${s.section},${s.rollNumber},${s.semesters.sem1.percentage}%,${s.semesters.sem2.percentage}%,${s.attendance.overallPercentage}%,${s.fees.status}`)
                ].join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "Averiq_50_Students_Roster.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Roster CSV</span>
          </button>
        </div>
      </div>

      {/* Graphical Representation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Academic Performance Distribution"
            subtitle="Overall GPA & percentage grading across both semesters"
            data={gradeDistributionData}
            centerLabel="Students"
            centerValue={50}
            size={180}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Class & Batch Distribution"
            subtitle="Student strength enrolled across active classroom batches"
            data={classEnrollmentData}
            centerLabel="Active Batches"
            centerValue="4 Batches"
            size={180}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Code (e.g. STU-2025-001), Name, Roll No..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Class Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Class:
          </span>
          {[
            { id: 'All', label: 'All (50)' },
            { id: '10A', label: 'Class 10A' },
            { id: '10B', label: 'Class 10B' },
            { id: '9A', label: 'Class 9A' },
            { id: '8A', label: 'Class 8A' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedClass(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedClass === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 50 Students Roster Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Showing {filteredStudents.length} of 50 Students
          </div>
          <span className="text-[11px] text-slate-400">Click any row or "Details" to open full in-dashboard profile view</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Student Code</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Roll</th>
                <th className="py-3 px-4 text-center">Semester 1</th>
                <th className="py-3 px-4 text-center">Semester 2</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(student => {
                const s1 = student.semesters.sem1.percentage;
                const s2 = student.semesters.sem2.percentage;
                const diff = Number((s2 - s1).toFixed(1));

                return (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60">
                        {student.studentCode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-[11px]">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {student.parentName.split('&')[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {student.gradeLevel} {student.section}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Roll: {student.rollNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {s1}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        GPA {student.semesters.sem1.gpa}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {s2}%
                        </span>
                        <span className={`text-[10px] font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          ({diff >= 0 ? `+${diff}` : diff})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        GPA {student.semesters.sem2.gpa}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {student.attendance.overallPercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          student.fees.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : student.fees.status === 'PARTIAL'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {student.fees.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                        {student.fees.status === 'PARTIAL' && <Clock className="w-3 h-3" />}
                        {student.fees.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                        {student.fees.status}
                      </span>
                      {student.fees.pendingFee > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Bal: ₹{student.fees.pendingFee.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
