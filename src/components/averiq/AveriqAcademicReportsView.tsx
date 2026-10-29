import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  Filter,
  TrendingUp,
  Download,
  Calendar,
  BookOpen,
  ChevronRight,
  Sparkles,
  BarChart3,
  FileCheck,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  GraduationCap,
  Save,
  Check,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { academicStudents, academicMetrics, academicTeachers } from '../../data/mockAcademicData';
import { InteractivePieChart } from '../charts/InteractivePieChart';
import { SemesterComparisonChart } from '../charts/SemesterComparisonChart';
import { DetailedStudent } from '../../types/academic';
import { useIMS } from '../../context/IMSContext';

interface ScheduledExam {
  id: string;
  title: string;
  grade: string;
  subject: string;
  date: string;
  time: string;
  hall: string;
  maxMarks: number;
  passingMarks: number;
  supervisor: string;
  status: 'Upcoming' | 'Conducted' | 'Evaluated';
}

export const AveriqAcademicReportsView: React.FC = () => {
  const { showToast } = useIMS();
  const [activeTab, setActiveTab] = useState<'scorecards' | 'schedules' | 'grading'>('scorecards');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-001');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Scheduled Exams Data
  const [scheduledExams, setScheduledExams] = useState<ScheduledExam[]>([
    {
      id: 'ex-01',
      title: 'Mathematics Unit Test 5 (Quadratic Equations)',
      grade: 'Class 10',
      subject: 'Mathematics',
      date: '12 Nov 2026',
      time: '08:30 AM – 10:30 AM',
      hall: 'Examination Hall A',
      maxMarks: 50,
      passingMarks: 17,
      supervisor: 'Prof. Rajesh Sharma',
      status: 'Upcoming'
    },
    {
      id: 'ex-02',
      title: 'Physics Term 2 Practical & Ray Optics Evaluation',
      grade: 'Class 10',
      subject: 'Physics',
      date: '16 Nov 2026',
      time: '09:00 AM – 11:30 AM',
      hall: 'Physics Laboratory',
      maxMarks: 40,
      passingMarks: 14,
      supervisor: 'Dr. Neha Kulkarni',
      status: 'Upcoming'
    },
    {
      id: 'ex-03',
      title: 'Chemistry Organic Reactions Assessment',
      grade: 'Class 9',
      subject: 'Chemistry',
      date: '18 Nov 2026',
      time: '10:00 AM – 11:30 AM',
      hall: 'Room 204',
      maxMarks: 40,
      passingMarks: 14,
      supervisor: 'Prof. Amit Verma',
      status: 'Upcoming'
    },
    {
      id: 'ex-04',
      title: 'Semester 1 Cumulative Board Examination',
      grade: 'Class 10',
      subject: 'All Subjects (5 Papers)',
      date: '15 Sep 2026',
      time: '09:00 AM – 12:00 PM',
      hall: 'Auditorium & Halls 101–105',
      maxMarks: 500,
      passingMarks: 165,
      supervisor: 'Principal & Faculty Board',
      status: 'Evaluated'
    },
    {
      id: 'ex-05',
      title: 'Class 8 Mid-Term English & Grammar Test',
      grade: 'Class 8',
      subject: 'English',
      date: '20 Sep 2026',
      time: '09:00 AM – 11:00 AM',
      hall: 'Junior Wing Hall',
      maxMarks: 50,
      passingMarks: 18,
      supervisor: 'Mrs. Sunita Rao',
      status: 'Evaluated'
    }
  ]);

  // Grading Sheet Class & Subject Selectors
  const [gradeSheetClass, setGradeSheetClass] = useState<string>('Class 10A');
  const [gradeSheetSubject, setGradeSheetSubject] = useState<string>('Mathematics');

  // Active student for scorecard
  const activeStudent = useMemo(() => {
    return academicStudents.find(s => s.id === selectedStudentId) || academicStudents[0];
  }, [selectedStudentId]);

  // Grade distribution pie chart data
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

  // Top 5 Performing Students
  const topPerformers = useMemo(() => {
    return [...academicStudents]
      .sort((a, b) => {
        const avgA = (a.semesters.sem1.percentage + a.semesters.sem2.percentage) / 2;
        const avgB = (b.semesters.sem1.percentage + b.semesters.sem2.percentage) / 2;
        return avgB - avgA;
      })
      .slice(0, 5);
  }, []);

  // Subject Averages Data
  const subjectAveragesData = useMemo(() => {
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Social Science'];
    return subjects.map(subName => {
      let sem1Sum = 0;
      let sem2Sum = 0;

      academicStudents.forEach(s => {
        const s1 = s.semesters.sem1.subjects.find(sub => sub.subject === subName);
        const s2 = s.semesters.sem2.subjects.find(sub => sub.subject === subName);
        if (s1) sem1Sum += s1.marksObtained;
        if (s2) sem2Sum += s2.marksObtained;
      });

      return {
        subject: subName,
        'Semester 1 Avg': Math.round(sem1Sum / academicStudents.length),
        'Semester 2 Avg': Math.round(sem2Sum / academicStudents.length)
      };
    });
  }, []);

  // New Exam Form
  const [newExamForm, setNewExamForm] = useState({
    title: '',
    grade: 'Class 10',
    subject: 'Mathematics',
    date: '20 Nov 2026',
    time: '09:00 AM – 11:00 AM',
    hall: 'Hall 101',
    maxMarks: 50,
    passingMarks: 17,
    supervisor: 'Prof. Rajesh Sharma'
  });

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamForm.title.trim()) return;

    const newEx: ScheduledExam = {
      id: `ex-${Date.now()}`,
      title: newExamForm.title,
      grade: newExamForm.grade,
      subject: newExamForm.subject,
      date: newExamForm.date,
      time: newExamForm.time,
      hall: newExamForm.hall,
      maxMarks: Number(newExamForm.maxMarks),
      passingMarks: Number(newExamForm.passingMarks),
      supervisor: newExamForm.supervisor,
      status: 'Upcoming'
    };

    setScheduledExams([newEx, ...scheduledExams]);
    setIsScheduleModalOpen(false);
    showToast(`Exam "${newEx.title}" scheduled for ${newEx.date}.`);
  };

  const handleDownloadScorecard = (studentName: string) => {
    showToast(`Generating official stamped scorecard PDF for ${studentName}...`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0E284D] to-[#0A192F] rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 font-mono font-bold text-xs uppercase tracking-wider border border-blue-500/30">
              Examination & Evaluation Office
            </span>
            <span className="text-xs text-slate-400">Semester 1 & 2 Boards</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-400" />
            <span>Exams and Results</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Manage institutional exam timetables, faculty grading scorecards, dual semester diagnostics, and official report cards.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('scorecards')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'scorecards'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Scorecards & Analytics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedules')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'schedules'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Exam Schedules ({scheduledExams.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grading')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'grading'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grading Sheet</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: SCORECARDS & COMPARATIVE ANALYTICS */}
      {activeTab === 'scorecards' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Sem 1 Batch Average</span>
              <div className="text-2xl font-black text-blue-600 mt-1 font-mono">
                {academicMetrics.averageSem1Score}%
              </div>
              <span className="text-[10px] text-slate-400">Class 8–10 (50 Students)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Sem 2 Batch Average</span>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                {academicMetrics.averageSem2Score}%
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">+3.3% Cohort Growth</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Pass Percentage</span>
              <div className="text-2xl font-black text-purple-600 mt-1 font-mono">
                98.4%
              </div>
              <span className="text-[10px] text-slate-400">Board Compliant</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Distinction Rate</span>
              <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
                76.2%
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">Scores 75%+</span>
            </div>
          </div>

          {/* Graphical Section: Semester Comparison + Grade Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Subject Performance Benchmark (Sem 1 vs Sem 2)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Average marks across 50 students in core academic disciplines
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                  Dual Semester
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAveragesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Semester 1 Avg" fill="#0056D6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Semester 2 Avg" fill="#00C853" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <InteractivePieChart
                title="Grade Distribution"
                subtitle="Class 8–10 Combined Results"
                data={gradeDistributionData}
                centerLabel="Total Cohort"
                centerValue="50"
                size={180}
              />
            </div>
          </div>

          {/* Student Detailed Scorecard Explorer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Individual Student Academic Scorecard</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select student from the cohort of 50 to view official marksheet and grade breakdown
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {academicStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentCode} · {s.gradeLevel}-{s.section})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleDownloadScorecard(activeStudent.name)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-[#0056D6] dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Marksheet</span>
                </button>
              </div>
            </div>

            {/* Student Scorecard Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Student Code</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{activeStudent.studentCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Class & Batch</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeStudent.gradeLevel}-{activeStudent.section} · {activeStudent.batchName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Semester 1 Percentage</span>
                <span className="font-mono font-bold text-blue-600">{activeStudent.semesters.sem1.percentage}% (GPA {activeStudent.semesters.sem1.gpa})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Semester 2 Percentage</span>
                <span className="font-mono font-bold text-emerald-600">{activeStudent.semesters.sem2.percentage}% (GPA {activeStudent.semesters.sem2.gpa})</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-2">Subject</th>
                    <th className="py-2">Code</th>
                    <th className="py-2">Max Marks</th>
                    <th className="py-2 text-blue-600">Sem 1 Score</th>
                    <th className="py-2 text-emerald-600">Sem 2 Score</th>
                    <th className="py-2">Grade</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Faculty Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeStudent.semesters.sem1.subjects.map((sub, idx) => {
                    const sem2Sub = activeStudent.semesters.sem2.subjects[idx];
                    return (
                      <tr key={sub.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 font-bold text-slate-900 dark:text-white">{sub.subject}</td>
                        <td className="py-2.5 font-mono text-slate-400">{sub.code}</td>
                        <td className="py-2.5 font-mono">{sub.maxMarks}</td>
                        <td className="py-2.5 font-mono font-bold text-blue-600">{sub.marksObtained} ({sub.percentage}%)</td>
                        <td className="py-2.5 font-mono font-bold text-emerald-600">{sem2Sub ? `${sem2Sub.marksObtained} (${sem2Sub.percentage}%)` : '—'}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 dark:bg-slate-800">
                            {sem2Sub ? sem2Sub.grade : sub.grade}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="text-emerald-600 font-semibold">Passed</span>
                        </td>
                        <td className="py-2.5 text-slate-500 text-[11px]">{sem2Sub ? sem2Sub.remarks : sub.remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: EXAM SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Institutional Examination Timetable
              </h3>
              <p className="text-xs text-slate-500">
                Scheduled term exams, unit tests, mock board simulations, and practical assessments
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Exam</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-500 font-semibold text-[11px]">
                    <th className="py-3 px-4">Exam Title</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Exam Hall</th>
                    <th className="py-3 px-3">Max Marks</th>
                    <th className="py-3 px-3">Supervisor</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scheduledExams.map(ex => (
                    <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {ex.title}
                      </td>
                      <td className="py-3 px-3 font-mono">{ex.grade}</td>
                      <td className="py-3 px-3 font-semibold text-blue-600">{ex.subject}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                        <div>{ex.date}</div>
                        <div className="text-[10px] text-slate-400">{ex.time}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{ex.hall}</td>
                      <td className="py-3 px-3 font-mono font-bold">
                        {ex.maxMarks} <span className="text-slate-400 font-normal">(Pass: {ex.passingMarks})</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{ex.supervisor}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ex.status === 'Upcoming'
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200'
                          }`}
                        >
                          {ex.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: GRADING SHEET & SCORE ENTRY */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">Select Class:</label>
                <select
                  value={gradeSheetClass}
                  onChange={e => setGradeSheetClass(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Class 10A">Class 10A (Science)</option>
                  <option value="Class 10B">Class 10B (General)</option>
                  <option value="Class 9A">Class 9A</option>
                  <option value="Class 8A">Class 8A</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">Evaluation Subject:</label>
                <select
                  value={gradeSheetSubject}
                  onChange={e => setGradeSheetSubject(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast(`Grading sheet for ${gradeSheetClass} (${gradeSheetSubject}) saved & synced.`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Marks</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-500 font-semibold text-[11px]">
                    <th className="py-2.5 px-4">Student Code</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Roll No.</th>
                    <th className="py-2.5 px-3">Theory (Max 80)</th>
                    <th className="py-2.5 px-3">Internal/Lab (Max 20)</th>
                    <th className="py-2.5 px-3">Total (100)</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-4 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {academicStudents.slice(0, 15).map((s, idx) => {
                    const baseTheory = 60 + (idx * 3) % 18;
                    const baseLab = 16 + (idx % 4);
                    const total = baseTheory + baseLab;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {s.studentCode}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {s.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">10{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono">
                          <input
                            type="number"
                            defaultValue={baseTheory}
                            className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <input
                            type="number"
                            defaultValue={baseLab}
                            className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent font-mono text-xs"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                          {total} / 100
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-[10px]">
                            {total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B+' : 'B'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-emerald-600 font-semibold font-mono text-[11px]">Pass</span>
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

      {/* 5. Schedule Exam Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule New Examination</h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExam} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Exam Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Board Term 2 Revision Mock"
                  value={newExamForm.title}
                  onChange={e => setNewExamForm({ ...newExamForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Grade</label>
                  <select
                    value={newExamForm.grade}
                    onChange={e => setNewExamForm({ ...newExamForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Subject</label>
                  <select
                    value={newExamForm.subject}
                    onChange={e => setNewExamForm({ ...newExamForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Date</label>
                  <input
                    type="text"
                    value={newExamForm.date}
                    onChange={e => setNewExamForm({ ...newExamForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Hall / Room</label>
                  <input
                    type="text"
                    value={newExamForm.hall}
                    onChange={e => setNewExamForm({ ...newExamForm, hall: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Max Marks</label>
                  <input
                    type="number"
                    value={newExamForm.maxMarks}
                    onChange={e => setNewExamForm({ ...newExamForm, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Passing Marks</label>
                  <input
                    type="number"
                    value={newExamForm.passingMarks}
                    onChange={e => setNewExamForm({ ...newExamForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Chief Invigilator / Supervisor</label>
                <select
                  value={newExamForm.supervisor}
                  onChange={e => setNewExamForm({ ...newExamForm, supervisor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                >
                  {academicTeachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.primarySubject})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-bold"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
