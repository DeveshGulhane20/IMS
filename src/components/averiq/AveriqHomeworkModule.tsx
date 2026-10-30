import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Users,
  Check,
  X,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Paperclip,
  Upload,
  BookOpen,
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { HomeworkService, ClassHomework } from '../../services/homeworkService';
import { academicStudents, academicTeachers } from '../../data/mockAcademicData';
import { useIMS } from '../../context/IMSContext';

const AVAILABLE_CLASSES = [
  { id: 'batch-10a', name: 'Class 10A', label: 'Class 10A (Science & Math)' },
  { id: 'batch-10b', name: 'Class 10B', label: 'Class 10B (Science & Math)' },
  { id: 'batch-9a', name: 'Class 9A', label: 'Class 9A (Foundation)' },
  { id: 'batch-8a', name: 'Class 8A', label: 'Class 8A (General)' }
];

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Biology'
];

export const AveriqHomeworkModule: React.FC = () => {
  const { showToast } = useIMS();

  // Homework list state
  const [homeworkList, setHomeworkList] = useState<ClassHomework[]>([]);
  const [selectedHomework, setSelectedHomework] = useState<ClassHomework | null>(null);

  // Filters
  const [filterClass, setFilterClass] = useState<string>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Assign Homework Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [newHwForm, setNewHwForm] = useState({
    title: '',
    description: '',
    batchId: 'batch-10a',
    subject: 'Mathematics',
    teacherName: academicTeachers[0]?.name || 'Prof. Rajesh Sharma',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    attachmentName: 'Assignment_Practice_Set.pdf'
  });

  // Success Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load homeworks
  const loadHomeworks = () => {
    const data = HomeworkService.getHomeworkList();
    setHomeworkList(data);
    if (selectedHomework) {
      const refreshed = data.find(h => h.id === selectedHomework.id);
      if (refreshed) setSelectedHomework(refreshed);
    }
  };

  useEffect(() => {
    loadHomeworks();

    const handleUpdate = () => loadHomeworks();
    window.addEventListener('averiq_homework_updated', handleUpdate);
    return () => window.removeEventListener('averiq_homework_updated', handleUpdate);
  }, []);

  // Filtered homework list
  const filteredHomeworks = useMemo(() => {
    return homeworkList.filter(hw => {
      const matchClass = filterClass === 'All' || hw.className === filterClass || hw.batchId === filterClass;
      const matchSubject = filterSubject === 'All' || hw.subject.toLowerCase() === filterSubject.toLowerCase();
      const matchStatus = filterStatus === 'All' || hw.status === filterStatus;
      const matchSearch =
        hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hw.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hw.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hw.subject.toLowerCase().includes(searchTerm.toLowerCase());

      return matchClass && matchSubject && matchStatus && matchSearch;
    });
  }, [homeworkList, filterClass, filterSubject, filterStatus, searchTerm]);

  // Overall KPIs
  const kpis = useMemo(() => {
    let totalAssignments = homeworkList.length;
    let totalSubmissions = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    homeworkList.forEach(hw => {
      if (hw.status === 'OVERDUE') overdueCount++;
      const entries = Object.values(hw.studentSubmissions);
      totalSubmissions += entries.length;
      entries.forEach(sub => {
        if (sub.status === 'DONE') completedCount++;
        else pendingCount++;
      });
    });

    const completionRate = totalSubmissions > 0 ? Math.round((completedCount / totalSubmissions) * 100) : 0;

    return {
      totalAssignments,
      completedCount,
      pendingCount,
      overdueCount,
      completionRate
    };
  }, [homeworkList]);

  // Assign Homework Submit Handler
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwForm.title.trim()) {
      alert('Please enter a homework title');
      return;
    }

    const classObj = AVAILABLE_CLASSES.find(c => c.id === newHwForm.batchId);
    const className = classObj?.name || 'Class 10A';

    const created = HomeworkService.assignHomework({
      title: newHwForm.title,
      description: newHwForm.description || 'Complete all exercises thoroughly and submit before due date.',
      batchId: newHwForm.batchId,
      className,
      subject: newHwForm.subject,
      teacherName: newHwForm.teacherName,
      dueDate: newHwForm.dueDate,
      attachmentName: newHwForm.attachmentName
    });

    loadHomeworks();
    setIsAssignModalOpen(false);

    // Reset Form
    setNewHwForm({
      title: '',
      description: '',
      batchId: 'batch-10a',
      subject: 'Mathematics',
      teacherName: academicTeachers[0]?.name || 'Prof. Rajesh Sharma',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      attachmentName: 'Assignment_Practice_Set.pdf'
    });

    const msg = `Homework "${created.title}" successfully assigned to all students in ${className}!`;
    setToastMessage(msg);
    if (showToast) showToast(msg);

    setTimeout(() => setToastMessage(null), 5000);
  };

  // Toggle single student status
  const handleToggleStudent = (studentId: string) => {
    if (!selectedHomework) return;
    const updated = HomeworkService.toggleStudentStatus(selectedHomework.id, studentId);
    if (updated) {
      setSelectedHomework(updated);
      loadHomeworks();
    }
  };

  // Bulk mark all students in selected homework
  const handleBulkStatus = (status: 'DONE' | 'PENDING') => {
    if (!selectedHomework) return;
    const updated = HomeworkService.markAllStudentsInHomework(selectedHomework.id, status);
    if (updated) {
      setSelectedHomework(updated);
      loadHomeworks();
      const msg = status === 'DONE' ? 'Marked all students as Done / Completed' : 'Marked all students as Pending';
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Subject theme color helper
  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/60',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200/80 dark:border-blue-800',
          badge: 'bg-blue-600'
        };
      case 'physics':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/60',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-200/80 dark:border-purple-800',
          badge: 'bg-purple-600'
        };
      case 'chemistry':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200/80 dark:border-emerald-800',
          badge: 'bg-emerald-600'
        };
      case 'english':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200/80 dark:border-amber-800',
          badge: 'bg-amber-600'
        };
      case 'biology':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-200/80 dark:border-rose-800',
          badge: 'bg-rose-600'
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700',
          badge: 'bg-slate-600'
        };
    }
  };

  // =========================================================================
  // VIEW 2: INTERACTIVE STUDENT EVALUATION ROSTER FOR SELECTED HOMEWORK
  // =========================================================================
  if (selectedHomework) {
    const studentsInBatch = academicStudents.filter(s => s.batchId === selectedHomework.batchId);
    const subEntries = Object.values(selectedHomework.studentSubmissions);
    const doneCount = subEntries.filter(s => s.status === 'DONE').length;
    const pendingCount = subEntries.filter(s => s.status === 'PENDING').length;
    const totalCount = studentsInBatch.length;
    const rate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    const theme = getSubjectColor(selectedHomework.subject);

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Top Back Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedHomework(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to All Homework Assignments</span>
            </button>
            <div className="hidden sm:block text-xs text-slate-400">
              <span>Homework Module</span>
              <span className="mx-1.5">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Student Submission Evaluation</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
              {selectedHomework.subject} • {selectedHomework.className}
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700">
              Due: {selectedHomework.dueDate}
            </span>
          </div>
        </div>

        {/* Assignment Detail & Live KPI Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedHomework.title}
                </h2>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedHomework.status === 'COMPLETED'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : selectedHomework.status === 'OVERDUE'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}>
                  {selectedHomework.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedHomework.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                <span>Faculty: <strong className="text-slate-800 dark:text-slate-200">{selectedHomework.teacherName}</strong></span>
                <span>•</span>
                <span>Assigned: <strong className="text-slate-800 dark:text-slate-200">{selectedHomework.assignedDate}</strong></span>
                <span>•</span>
                {selectedHomework.attachmentName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    <span>{selectedHomework.attachmentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({selectedHomework.attachmentSize})</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick KPI Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Enrolled Students</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{totalCount}</span>
                <span className="text-[10px] text-slate-400 block">{selectedHomework.className}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-center">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold uppercase">Done / Completed</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">{doneCount}</span>
                <span className="text-[10px] text-emerald-600 block">{rate}% Completed</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 text-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold uppercase">Pending</span>
                <span className="text-xl font-black text-amber-700 dark:text-amber-300">{pendingCount}</span>
                <span className="text-[10px] text-amber-600 block">Needs Submission</span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-center">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-semibold uppercase">Completion Rate</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">{rate}%</span>
                <span className="text-[10px] text-blue-500 block">Progress</span>
              </div>
            </div>
          </div>

          {/* Bulk Helpers Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1">Bulk Operations:</span>
              <button
                type="button"
                onClick={() => handleBulkStatus('DONE')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark All Done</span>
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus('PENDING')}
                className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Mark All Pending</span>
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Click individual student toggle buttons to immediately update completion state.
            </div>
          </div>

          {/* Student Evaluation Table */}
          <div className="overflow-x-auto border border-slate-200/90 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name & Roll</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4 text-center">Submission Status</th>
                  <th className="py-3 px-4 text-center">Action: Toggle Completion</th>
                  <th className="py-3 px-4">Verification Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentsInBatch.map(student => {
                  const record = selectedHomework.studentSubmissions[student.id] || { status: 'PENDING' };
                  const isDone = record.status === 'DONE';

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isDone
                          ? 'bg-emerald-50/20 dark:bg-emerald-950/10 hover:bg-emerald-50/40'
                          : 'bg-amber-50/20 dark:bg-amber-950/10 hover:bg-amber-50/40'
                      }`}
                    >
                      {/* ID / Code */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200/60">
                          {student.studentCode}
                        </span>
                      </td>

                      {/* Name & Roll */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-black flex items-center justify-center text-xs shrink-0">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {student.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Roll: #{student.rollNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {student.gradeLevel} {student.section}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done / Completed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200/70">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Interactive Homework Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStudent(student.id)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto ${
                            isDone
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white scale-102 ring-2 ring-emerald-500/30'
                              : 'bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 hover:border-amber-400'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Completed (Click to Revert)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Mark as Done</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Remark / Verification */}
                      <td className="py-3.5 px-4 text-[11px]">
                        {record.remarks ? (
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {record.remarks}
                          </span>
                        ) : isDone ? (
                          <span className="text-emerald-600 font-medium">Verified completed</span>
                        ) : (
                          <span className="text-slate-400 italic">Awaiting submission</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Save & Return Strip */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Total Class Evaluation: <strong className="text-emerald-600">{doneCount} Done</strong>, <strong className="text-amber-600">{pendingCount} Pending</strong> ({rate}% completed)
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedHomework(null);
                setToastMessage('Homework evaluation progress updated and saved successfully!');
                setTimeout(() => setToastMessage(null), 4000);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save & Return to Homework Overview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: HOMEWORK OVERVIEW & MANAGEMENT DASHBOARD
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-md flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Action Completed
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                {toastMessage}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-200/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Homework & Assignment Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              {homeworkList.length} Active Assignments
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Class-wise homework dispatch, submission tracking, student evaluations, and completion records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAssignModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Homework</span>
        </button>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Assignments</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {kpis.totalAssignments}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Across all 4 batches</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">Done / Completed</span>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {kpis.completedCount}
          </div>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Verified submissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 shadow-xs">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block">Pending Tasks</span>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
            {kpis.pendingCount}
          </div>
          <span className="text-[10px] text-amber-600 block mt-0.5">Awaiting completion</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 shadow-xs">
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium block">Overdue Tasks</span>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">
            {kpis.overdueCount}
          </div>
          <span className="text-[10px] text-rose-600 block mt-0.5">Past submission date</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block">Completion Rate</span>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">
            {kpis.completionRate}%
          </div>
          <span className="text-[10px] text-blue-500 block mt-0.5">Campus benchmark</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search title, teacher, or topic..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Class:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Classes</option>
              <option value="Class 10A">Class 10A</option>
              <option value="Class 10B">Class 10B</option>
              <option value="Class 9A">Class 9A</option>
              <option value="Class 8A">Class 8A</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Subject:</span>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {AVAILABLE_SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Homework Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHomeworks.map(hw => {
          const theme = getSubjectColor(hw.subject);
          const entries = Object.values(hw.studentSubmissions);
          const doneCount = entries.filter(s => s.status === 'DONE').length;
          const totalCount = entries.length;
          const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

          return (
            <div
              key={hw.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
                      {hw.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                      {hw.className}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hw.status === 'COMPLETED'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : hw.status === 'OVERDUE'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}>
                    {hw.status}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-3 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {hw.description}
                  </p>
                </div>

                {/* Dates & Attachment */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Due Date:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {hw.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[11px]">Assigned by:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {hw.teacherName}
                    </span>
                  </div>
                  {hw.attachmentName && (
                    <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400">
                      <span className="flex items-center gap-1 font-medium truncate max-w-[190px]">
                        <Paperclip className="w-3 h-3 shrink-0" />
                        <span className="truncate">{hw.attachmentName}</span>
                      </span>
                      <span className="font-mono text-slate-400 text-[10px]">{hw.attachmentSize}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Student Progress:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {doneCount} / {totalCount} Done ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 80 ? 'bg-emerald-600' : pct >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button: Review & Evaluate */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedHomework(hw)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Review & Evaluate Student Submissions</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ASSIGN HOMEWORK MODAL */}
      {/* ========================================================================= */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Assign Homework to Class
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Publish new assignment and enroll all students in that class
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Assignment Form */}
            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              {/* Class Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Class / Batch *</span>
                </label>
                <select
                  value={newHwForm.batchId}
                  onChange={(e) => setNewHwForm({ ...newHwForm, batchId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {AVAILABLE_CLASSES.map(c => (
                    <option key={c.id} value={c.id}>{c.name} • {c.label}</option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Subject *</span>
                </label>
                <select
                  value={newHwForm.subject}
                  onChange={(e) => setNewHwForm({ ...newHwForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {AVAILABLE_SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Faculty In-Charge */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <span>Assigned Faculty / Mentor</span>
                </label>
                <select
                  value={newHwForm.teacherName}
                  onChange={(e) => setNewHwForm({ ...newHwForm, teacherName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {academicTeachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.primarySubject})</option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Homework Title *
                </label>
                <input
                  type="text"
                  required
                  value={newHwForm.title}
                  onChange={(e) => setNewHwForm({ ...newHwForm, title: e.target.value })}
                  placeholder="e.g. Quadratic Equations Practice Set & Graph Plotting"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Submission Due Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={newHwForm.dueDate}
                  onChange={(e) => setNewHwForm({ ...newHwForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description & Details Text Area */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Homework Description & Exercise Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newHwForm.description}
                  onChange={(e) => setNewHwForm({ ...newHwForm, description: e.target.value })}
                  placeholder="Provide step-by-step instructions, question numbers, textbook chapters, and submission guidelines..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Optional Attachment Upload */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                  <span>Attachment / Question Worksheet (Optional)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHwForm.attachmentName}
                    onChange={(e) => setNewHwForm({ ...newHwForm, attachmentName: e.target.value })}
                    placeholder="e.g. Chapter4_Worksheet.pdf"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-200">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewHwForm({ ...newHwForm, attachmentName: file.name });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish & Assign to Class</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
