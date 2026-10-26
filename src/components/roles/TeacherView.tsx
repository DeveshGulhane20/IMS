import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { FastAttendanceGrid } from '../attendance/FastAttendanceGrid';
import { StatCard } from '../common/StatCard';
import { AtRiskBadge } from '../common/AtRiskBadge';
import {
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Plus,
  Save,
  Sparkles,
  Search,
  MessageSquare,
  BarChart2,
  FileCheck,
  Send
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TeacherViewProps {
  currentTab: string;
}

export const TeacherView: React.FC<TeacherViewProps> = ({ currentTab }) => {
  const {
    currentUser,
    batches,
    subjects,
    timetable,
    tests,
    testResults,
    homeworks,
    homeworkSubmissions,
    students,
    users,
    improvementPlans,
    getBatchStudents,
    markBatchAttendance,
    createTest,
    saveTestMarks,
    createHomework,
    gradeHomework,
    createImprovementPlan,
    togglePlanTask,
    addStudentRemark,
    getStudentDiagnostic
  } = useIMS();

  // Selected batch for roll call and gradebook
  const [selectedBatchId, setSelectedBatchId] = useState('batch-alpha');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Test Creation Modal
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [newTestForm, setNewTestForm] = useState({
    title: '',
    batchId: 'batch-alpha',
    subjectId: 'sub-phy',
    maxMarks: 100,
    passingMarks: 40,
    testDate: new Date().toISOString().split('T')[0]
  });

  // Marks Entry State
  const [activeTestForMarks, setActiveTestForMarks] = useState<string>('test-04');
  const [marksGrid, setMarksGrid] = useState<Record<string, number>>({});
  const [remarksGrid, setRemarksGrid] = useState<Record<string, string>>({});
  const [marksSavedNotice, setMarksSavedNotice] = useState(false);

  // Homework creation
  const [isCreateHwOpen, setIsCreateHwOpen] = useState(false);
  const [hwForm, setHwForm] = useState({
    title: '',
    batchId: 'batch-alpha',
    subjectId: 'sub-phy',
    description: '',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  // Homework grading drawer
  const [activeSubmissionToGrade, setActiveSubmissionToGrade] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeLetter, setGradeLetter] = useState<string>('A');
  const [gradeFeedback, setGradeFeedback] = useState<string>('Well executed work.');

  // Remediation Plan creator
  const [isRemediationModalOpen, setIsRemediationModalOpen] = useState(false);
  const [remediationForm, setRemediationForm] = useState({
    studentId: 'sp-03',
    subjectName: 'Mathematics: Differential Calculus',
    focusArea: 'Foundational Limits & Chain Rule',
    targetScore: 70,
    deadline: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    task1: 'Complete 20 drill exercises on polynomial differentiation',
    task2: 'Attend Wednesday faculty clinic'
  });

  // Remark Composer
  const [remarkStudentId, setRemarkStudentId] = useState('sp-01');
  const [remarkCategory, setRemarkCategory] = useState('ACADEMIC_EXCELLENCE');
  const [remarkComment, setRemarkComment] = useState('');

  const batchStudents = getBatchStudents(selectedBatchId);

  // Today schedule for Vikram Nair
  const todaySchedule = timetable.filter(
    t => t.teacherName.includes('Vikram') || t.teacherName.includes('Lead')
  );

  // Submissions pending review
  const pendingSubmissions = homeworkSubmissions.filter(s => s.status === 'SUBMITTED' || s.status === 'LATE');

  // Selected test data for Gradebook
  const currentTest = tests.find(t => t.id === activeTestForMarks) || tests[0];

  // Initialize or fetch current test marks into local grid
  React.useEffect(() => {
    if (currentTest) {
      const initialMarks: Record<string, number> = {};
      const initialRemarks: Record<string, string> = {};
      testResults
        .filter(r => r.testId === currentTest.id)
        .forEach(r => {
          initialMarks[r.studentId] = r.marksObtained;
          if (r.remarks) initialRemarks[r.studentId] = r.remarks;
        });
      setMarksGrid(initialMarks);
      setRemarksGrid(initialRemarks);
    }
  }, [currentTest?.id, testResults]);

  // Compute live bell curve data for current test marks
  const bellCurveBuckets = [
    { range: '0–40% (Fail)', count: 0 },
    { range: '41–60% (Pass)', count: 0 },
    { range: '61–80% (Proficient)', count: 0 },
    { range: '81–100% (Mastery)', count: 0 }
  ];

  if (currentTest) {
    Object.values(marksGrid).forEach(m => {
      const pct = (m / currentTest.maxMarks) * 100;
      if (pct < 40) bellCurveBuckets[0].count++;
      else if (pct <= 60) bellCurveBuckets[1].count++;
      else if (pct <= 80) bellCurveBuckets[2].count++;
      else bellCurveBuckets[3].count++;
    });
  }

  const handleSaveMarks = () => {
    if (!currentTest) return;
    const results = Object.entries(marksGrid).map(([studentId, marks]) => ({
      studentId,
      marksObtained: Number(marks),
      remarks: remarksGrid[studentId]
    }));
    saveTestMarks(currentTest.id, results);
    setMarksSavedNotice(true);
    setTimeout(() => setMarksSavedNotice(false), 2000);
  };

  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === newTestForm.subjectId);
    createTest({
      batchId: newTestForm.batchId,
      subjectId: newTestForm.subjectId,
      subjectName: sub?.name || 'Subject Test',
      teacherId: 'tp-01',
      title: newTestForm.title,
      maxMarks: Number(newTestForm.maxMarks),
      passingMarks: Number(newTestForm.passingMarks),
      testDate: newTestForm.testDate,
      isPublished: false
    });
    setIsCreateTestOpen(false);
  };

  const handleCreateHwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === hwForm.subjectId);
    createHomework({
      batchId: hwForm.batchId,
      subjectId: hwForm.subjectId,
      subjectName: sub?.name || 'Subject',
      title: hwForm.title,
      description: hwForm.description,
      dueDate: hwForm.dueDate
    });
    setIsCreateHwOpen(false);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionToGrade) return;
    gradeHomework(activeSubmissionToGrade, gradeLetter, gradeScore, gradeFeedback);
    setActiveSubmissionToGrade(null);
  };

  const handleCreateRemediation = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === remediationForm.studentId);
    const user = student ? users.find(u => u.id === student.userId) : null;
    createImprovementPlan({
      studentId: remediationForm.studentId,
      studentName: user ? `${user.firstName} ${user.lastName}` : 'Student',
      subjectName: remediationForm.subjectName,
      focusArea: remediationForm.focusArea,
      targetScore: Number(remediationForm.targetScore),
      deadline: remediationForm.deadline,
      tasks: [
        { id: `task-${Date.now()}-1`, planId: '', assignedById: 'tp-01', title: remediationForm.task1, isDone: false },
        { id: `task-${Date.now()}-2`, planId: '', assignedById: 'tp-01', title: remediationForm.task2, isDone: false }
      ]
    });
    setIsRemediationModalOpen(false);
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkComment) return;
    addStudentRemark(remarkStudentId, remarkCategory, remarkComment);
    setRemarkComment('');
  };

  return (
    <div className="space-y-6">
      {/* Tab: Teacher Workspace */}
      {currentTab === 'dashboard' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Faculty Instructional Workspace
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instruction schedule, homework grading queues, and diagnostic alerts
              </p>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Today's Lecture Slots"
              value={todaySchedule.length}
              icon={Calendar}
              subtitle="Next: Physics Mechanics at 08:30"
            />
            <StatCard
              title="Pending Assignment Submissions"
              value={pendingSubmissions.length}
              icon={BookOpen}
              accentColor="#F59E0B"
              subtitle="Requires qualitative grading"
            />
            <StatCard
              title="Batch Mean Mastery"
              value="86.8%"
              change={3.2}
              trend="up"
              icon={CheckCircle}
              accentColor="#16A34A"
              subtitle="Above 80% honors threshold"
            />
            <StatCard
              title="Active Remediation Plans"
              value={improvementPlans.length}
              icon={Sparkles}
              accentColor="#6366F1"
              subtitle="2 students enrolled"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule Cards */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Today's Teaching Schedule
              </h3>
              <div className="space-y-2.5">
                {todaySchedule.map(slot => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {slot.subjectName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {slot.classroom} · Batch: Grade 11 STEM Alpha
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1E3A8A] dark:text-blue-300">
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Homework Grading Queue */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Pending Homework Submissions ({pendingSubmissions.length})
                </h3>
              </div>
              <div className="space-y-2.5">
                {pendingSubmissions.map(sub => {
                  const student = students.find(s => s.id === sub.studentId);
                  const user = student ? users.find(u => u.id === student.userId) : null;
                  const hw = homeworks.find(h => h.id === sub.homeworkId);
                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1 mr-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {user?.firstName} {user?.lastName} · <span className="font-normal text-slate-500">{hw?.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          {sub.fileName} · Submitted {sub.submissionDate}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubmissionToGrade(sub.id);
                        }}
                        className="px-2.5 py-1 text-xs rounded bg-[#1E3A8A] text-white hover:bg-[#172554] shrink-0 font-medium"
                      >
                        Grade
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab: Daily Roll Call */}
      {currentTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Daily Classroom Roll Call & Presence Tracker
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Batch attendance recorder with hotkeys (P: Present, L: Late, A: Absent) and automatic streak updates
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={e => setAttendanceDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <select
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FastAttendanceGrid
            students={batchStudents}
            dateStr={attendanceDate}
            onSave={(records, remarks) => {
              markBatchAttendance(selectedBatchId, attendanceDate, records, remarks);
            }}
          />
        </div>
      )}

      {/* Tab: Gradebook & Test Entry */}
      {currentTab === 'marks' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Gradebook & Examination Entry
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Spreadsheet marks entry with real-time bell-curve distribution and automatic alerts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={activeTestForMarks}
                onChange={e => setActiveTestForMarks(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              >
                {tests.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.testDate})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCreateTestOpen(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule New Test</span>
              </button>
            </div>
          </div>

          {/* Bell Curve Distribution Chart */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Live Bell-Curve & Grade Spread ({currentTest?.title})
                </h3>
                <span className="text-xs text-slate-500">
                  Maximum Marks: <strong className="font-mono">{currentTest?.maxMarks}</strong> · Passing: <strong className="font-mono">{currentTest?.passingMarks}</strong>
                </span>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bellCurveBuckets}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" name="Students in Bracket" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Marks Entry Spreadsheet Grid */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Class Evaluation Spreadsheet
              </h3>
              <button
                type="button"
                onClick={handleSaveMarks}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{marksSavedNotice ? 'Saved ✓' : 'Commit Marks to Ledger'}</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium">
                    <th className="py-2.5 px-4 w-12">#</th>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Roll Number</th>
                    <th className="py-2.5 px-4 w-36">Marks Obtained (/ {currentTest?.maxMarks})</th>
                    <th className="py-2.5 px-4 text-center">Score %</th>
                    <th className="py-2.5 px-4">Instructor Feedback / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {batchStudents.map(({ student, user }, index) => {
                    const score = marksGrid[student.id] ?? 0;
                    const pct = currentTest ? Math.round((score / currentTest.maxMarks) * 100) : 0;
                    const isFailing = currentTest && score < currentTest.passingMarks;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {student.rollNumber}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min={0}
                            max={currentTest?.maxMarks || 100}
                            value={score}
                            onChange={e =>
                              setMarksGrid({ ...marksGrid, [student.id]: Number(e.target.value) })
                            }
                            className={`w-24 px-2 py-1 text-xs rounded border font-mono font-semibold focus:outline-none focus:ring-1 ${
                              isFailing
                                ? 'border-rose-400 bg-rose-50/50 text-rose-700'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold">
                          <span className={isFailing ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>
                            {pct}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Add evaluation note..."
                            value={remarksGrid[student.id] || ''}
                            onChange={e =>
                              setRemarksGrid({ ...remarksGrid, [student.id]: e.target.value })
                            }
                            className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200"
                          />
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

      {/* Tab: Homework Manager */}
      {currentTab === 'homework' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Homework Assignments & Submissions
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Issue homework assignments, track submission rates, and grade papers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateHwOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Homework</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {homeworks.map(hw => (
              <div
                key={hw.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-mono text-slate-400">{hw.subjectName}</span>
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-medium">
                    Due: {hw.dueDate}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{hw.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {hw.description}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                  <span>Submissions: <strong className="font-mono text-slate-900 dark:text-slate-100">{hw.totalSubmissions}</strong></span>
                  <span className="text-emerald-600 font-medium">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Intervention & Remediation */}
      {currentTab === 'remediation' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Academic Intervention & Remediation Plans
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Targeted recovery plans for weak students with milestones and parent remarks
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRemediationModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Remediation Plan</span>
            </button>
          </div>

          {/* Active Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvementPlans.map(plan => (
              <div
                key={plan.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {plan.studentName}
                    </h4>
                    <div className="text-xs text-slate-500">{plan.subjectName}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      plan.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <div><strong>Focus Area:</strong> {plan.focusArea}</div>
                  <div className="mt-1">
                    <strong>Target Score:</strong> <span className="font-mono">{plan.targetScore}%</span> · <strong>Deadline:</strong> <span className="font-mono">{plan.deadline}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500">Action Checklist:</div>
                  {plan.tasks.map(t => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={t.isDone}
                        onChange={() => togglePlanTask(plan.id, t.id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className={t.isDone ? 'line-through text-slate-400' : ''}>{t.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Remark Composer */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Dispatch Student Remark to Guardian Feed
            </h3>
            <form onSubmit={handleAddRemark} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select Scholar
                  </label>
                  <select
                    value={remarkStudentId}
                    onChange={e => setRemarkStudentId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
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
                    Category
                  </label>
                  <select
                    value={remarkCategory}
                    onChange={e => setRemarkCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="ACADEMIC_EXCELLENCE">Academic Excellence</option>
                    <option value="IMPROVEMENT_NOTE">Improvement Opportunity</option>
                    <option value="ATTENDANCE_CONCERN">Attendance Concern</option>
                    <option value="LEADERSHIP_HONOR">Leadership & Conduct</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Qualitative Faculty Comment
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter constructive comment visible to student and guardian..."
                  value={remarkComment}
                  onChange={e => setRemarkComment(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white hover:bg-[#172554] font-medium"
                >
                  Send Remark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Test Modal */}
      {isCreateTestOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Schedule Assessment Test
            </h3>
            <form onSubmit={handleCreateTestSubmit} className="space-y-3 mt-3">
              <div>
                <label className="block text-xs font-medium mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Kinetics & Energy Exam"
                  value={newTestForm.title}
                  onChange={e => setNewTestForm({ ...newTestForm, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Subject</label>
                  <select
                    value={newTestForm.subjectId}
                    onChange={e => setNewTestForm({ ...newTestForm, subjectId: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newTestForm.testDate}
                    onChange={e => setNewTestForm({ ...newTestForm, testDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Max Marks</label>
                  <input
                    type="number"
                    min={10}
                    value={newTestForm.maxMarks}
                    onChange={e => setNewTestForm({ ...newTestForm, maxMarks: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min={5}
                    value={newTestForm.passingMarks}
                    onChange={e => setNewTestForm({ ...newTestForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTestOpen(false)}
                  className="px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Homework Drawer / Modal */}
      {activeSubmissionToGrade && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Grade Homework Submission
            </h3>
            <form onSubmit={handleGradeSubmit} className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Score (out of 100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeScore}
                    onChange={e => setGradeScore(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Grade Letter</label>
                  <select
                    value={gradeLetter}
                    onChange={e => setGradeLetter(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Faculty Feedback</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmissionToGrade(null)}
                  className="px-3 py-1.5 text-xs rounded border"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white">
                  Commit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Remediation Modal */}
      {isRemediationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Create Diagnostic Remediation Plan
            </h3>
            <form onSubmit={handleCreateRemediation} className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Student</label>
                  <select
                    value={remediationForm.studentId}
                    onChange={e => setRemediationForm({ ...remediationForm, studentId: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
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
                  <label className="block text-xs font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={remediationForm.subjectName}
                    onChange={e => setRemediationForm({ ...remediationForm, subjectName: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Focus Area & Weak Concept</label>
                <input
                  type="text"
                  value={remediationForm.focusArea}
                  onChange={e => setRemediationForm({ ...remediationForm, focusArea: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Target Score %</label>
                  <input
                    type="number"
                    value={remediationForm.targetScore}
                    onChange={e => setRemediationForm({ ...remediationForm, targetScore: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={remediationForm.deadline}
                    onChange={e => setRemediationForm({ ...remediationForm, deadline: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Milestone Task 1</label>
                <input
                  type="text"
                  value={remediationForm.task1}
                  onChange={e => setRemediationForm({ ...remediationForm, task1: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Milestone Task 2</label>
                <input
                  type="text"
                  value={remediationForm.task2}
                  onChange={e => setRemediationForm({ ...remediationForm, task2: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRemediationModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded border"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white">
                  Assign Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Homework Modal */}
      {isCreateHwOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Assign Homework
            </h3>
            <form onSubmit={handleCreateHwSubmit} className="space-y-3 mt-3">
              <div>
                <label className="block text-xs font-medium mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermodynamics Problem Set 4"
                  value={hwForm.title}
                  onChange={e => setHwForm({ ...hwForm, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Subject</label>
                  <select
                    value={hwForm.subjectId}
                    onChange={e => setHwForm({ ...hwForm, subjectId: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={hwForm.dueDate}
                    onChange={e => setHwForm({ ...hwForm, dueDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={hwForm.description}
                  onChange={e => setHwForm({ ...hwForm, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateHwOpen(false)}
                  className="px-3 py-1.5 text-xs rounded border"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white">
                  Publish to Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
