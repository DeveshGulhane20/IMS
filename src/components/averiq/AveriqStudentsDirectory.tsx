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
  AlertCircle
} from 'lucide-react';
import { academicStudents, academicParents } from '../../data/mockAcademicData';
import { DetailedStudent } from '../../types/academic';
import { InteractivePieChart } from '../charts/InteractivePieChart';
import { SemesterComparisonChart } from '../charts/SemesterComparisonChart';

export const AveriqStudentsDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStudent, setSelectedStudent] = useState<DetailedStudent | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'academics' | 'fees' | 'attendance' | 'parent'>('academics');

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
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedClass === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
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
          <span className="text-[11px] text-slate-400">Click any row to inspect dual semester & fee data</span>
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
                const diff = s2 - s1;

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
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 ml-auto"
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

      {/* Comprehensive Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedStudent.name}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 font-bold">
                      {selectedStudent.studentCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedStudent.gradeLevel} {selectedStudent.section} • Roll: {selectedStudent.rollNumber} • {selectedStudent.batchName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              {[
                { id: 'academics', label: '2 Semesters Record & Progression', icon: Award },
                { id: 'fees', label: 'Fee Breakdown & Receipts', icon: CreditCard },
                { id: 'attendance', label: 'Attendance & Trends', icon: Calendar },
                { id: 'parent', label: 'Parent & Ward Profile', icon: User }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveModalTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      activeModalTab === tab.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ACADEMICS - SEMESTER 1 VS SEMESTER 2 */}
            {activeModalTab === 'academics' && (
              <div className="space-y-4">
                <SemesterComparisonChart
                  sem1={selectedStudent.semesters.sem1}
                  sem2={selectedStudent.semesters.sem2}
                  studentName={selectedStudent.name}
                />
              </div>
            )}

            {/* TAB 2: FEES BREAKDOWN */}
            {activeModalTab === 'fees' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500">Total Billed Fee</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      ₹{selectedStudent.fees.totalFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-xs text-emerald-600">Amount Paid</span>
                    <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                      ₹{selectedStudent.fees.paidFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <span className="text-xs text-amber-600">Pending Balance</span>
                    <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">
                      ₹{selectedStudent.fees.pendingFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Sub-breakdown table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                    Fee Component Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Tuition Fee</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedStudent.fees.tuitionFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Laboratory & Practical</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedStudent.fees.laboratoryFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Library & Digital Books</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedStudent.fees.libraryFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Sports & Extra-Curricular</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedStudent.fees.sportsFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Transport Fee</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedStudent.fees.transportFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Exam & Evaluation</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedStudent.fees.examFee.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Payment Receipts & Transactions
                  </h4>
                  <div className="space-y-2">
                    {selectedStudent.fees.transactions.map(tx => (
                      <div key={tx.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">{tx.description}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {tx.receiptNo} • {tx.date} • Mode: {tx.mode}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-600 block">
                            ₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium">Completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ATTENDANCE */}
            {activeModalTab === 'attendance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
                    <span className="text-[11px] text-blue-600 font-medium">Overall Attendance</span>
                    <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
                      {selectedStudent.attendance.overallPercentage}%
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                    <span className="text-[11px] text-emerald-600 font-medium">Days Present</span>
                    <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                      {selectedStudent.attendance.presentDays}
                    </div>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
                    <span className="text-[11px] text-rose-600 font-medium">Days Absent</span>
                    <div className="text-2xl font-black text-rose-700 dark:text-rose-300">
                      {selectedStudent.attendance.absentDays}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
                    <span className="text-[11px] text-amber-600 font-medium">Late Arrivals</span>
                    <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
                      {selectedStudent.attendance.lateDays}
                    </div>
                  </div>
                </div>

                {/* Monthly breakdown */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                    Month-wise Attendance Trend
                  </h4>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {selectedStudent.attendance.monthlyTrends.map(m => (
                      <div key={m.month} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">{m.month}</span>
                        <span className="text-sm font-extrabold text-blue-600 block mt-1">{m.percentage}%</span>
                        <span className="text-[10px] text-slate-400 block">{m.presentDays}/{m.workingDays} days</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PARENT & CONTACT */}
            {activeModalTab === 'parent' && linkedParent && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {linkedParent.fatherName} & {linkedParent.motherName}
                      </h4>
                      <span className="font-mono text-xs text-blue-600 font-semibold">
                        Parent Code: {linkedParent.parentCode}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 font-medium">
                      {linkedParent.occupation}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div>
                      <span className="text-slate-400 block">Phone Number</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{linkedParent.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Email Address</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{linkedParent.email}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Residential Address</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{linkedParent.address}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-2">
                    Linked Wards / Children
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {linkedParent.wardNames.map((w, idx) => (
                      <span key={w} className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                        {w} ({linkedParent.wardStudentCodes[idx]})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
