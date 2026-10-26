import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { StatCard } from '../common/StatCard';
import { PerformanceTrendChart } from '../common/PerformanceTrendChart';
import { BadgeShowcase } from '../common/BadgeShowcase';
import { AttendanceHeatmap } from '../common/AttendanceHeatmap';
import {
  Flame,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  AlertCircle,
  TrendingUp,
  Star
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StudentViewProps {
  currentTab: string;
}

export const StudentView: React.FC<StudentViewProps> = ({ currentTab }) => {
  const {
    currentUser,
    students,
    tests,
    testResults,
    homeworks,
    homeworkSubmissions,
    attendanceRecords,
    timetable,
    badges,
    studentRemarks,
    getStudentDiagnostic,
    submitHomework
  } = useIMS();

  // Active student profile: Aarav Patel (sp-01)
  const student = students.find(s => s.userId === currentUser.id) || students[0];
  const diagnostics = getStudentDiagnostic(student.id);

  // Homework upload state
  const [selectedHwForUpload, setSelectedHwForUpload] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Student test results
  const myTestResults = testResults.filter(tr => tr.studentId === student.id);

  // Trend chart points
  const trendData = myTestResults.map(tr => {
    const test = tests.find(t => t.id === tr.testId);
    const testScores = testResults.filter(r => r.testId === tr.testId);
    const mean =
      testScores.length > 0
        ? Math.round(
            (testScores.reduce((acc, c) => acc + c.marksObtained, 0) / testScores.length / (test?.maxMarks || 100)) *
              100
          )
        : 75;
    const studentScorePct = test ? Math.round((tr.marksObtained / test.maxMarks) * 100) : 0;
    return {
      testName: test?.title.split(' ')[0] || 'Test',
      studentScore: studentScorePct,
      classAverage: mean
    };
  });

  // Subject comparison
  const subjectAverages = [
    { subject: 'Physics', myScore: 93, classScore: 78 },
    { subject: 'Mathematics', myScore: 89, classScore: 72 },
    { subject: 'Chemistry', myScore: 72, classScore: 74 },
    { subject: 'Computer Sci', myScore: 95, classScore: 82 }
  ];

  // Pending homework
  const submittedHwIds = new Set(
    homeworkSubmissions.filter(s => s.studentId === student.id).map(s => s.homeworkId)
  );
  const pendingHws = homeworks.filter(h => !submittedHwIds.has(h.id));
  const completedHws = homeworkSubmissions.filter(s => s.studentId === student.id);

  // Filter attendance records for Aarav
  const myAttendance = attendanceRecords.filter(a => a.studentId === student.id);

  // Handle file submission
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwForUpload || !uploadFileName) return;
    submitHomework(selectedHwForUpload, student.id, uploadFileName);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedHwForUpload(null);
      setUploadFileName('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Tab: Learning Dashboard */}
      {currentTab === 'dashboard' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Scholastic Learning Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Roll #{student.rollNumber} · Grade 11 STEM Alpha (Honors)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-mono text-xs font-semibold">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{student.currentStreak} Day Attendance Streak!</span>
              </span>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Attendance Streak"
              value={`${student.currentStreak} Days`}
              icon={Flame}
              accentColor="#F59E0B"
              subtitle={`All-time best: ${student.highestStreak}d`}
            />
            <StatCard
              title="Overall Academic Mean"
              value={`${diagnostics.overallAverage}%`}
              change={4.2}
              trend="up"
              icon={TrendingUp}
              accentColor="#1E3A8A"
              subtitle="Rank #2 in cohort"
            />
            <StatCard
              title="Gamification XP Points"
              value={`${student.badgePoints} XP`}
              icon={Award}
              accentColor="#0D9488"
              subtitle="4 badges unlocked"
            />
            <StatCard
              title="Pending Assignments"
              value={pendingHws.length}
              icon={BookOpen}
              accentColor="#6366F1"
              subtitle="Next due in 3 days"
            />
          </div>

          {/* 35-Day Attendance Activity Heatmap */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Classroom Presence & Roll Call Activity
                </h3>
                <span className="text-xs text-slate-500">
                  Last 5 weeks recorded by faculty
                </span>
              </div>
            </div>
            <AttendanceHeatmap records={myAttendance} />
          </div>

          {/* Badges & Milestones */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Earned Milestones & Badges
              </h3>
              <span className="text-xs font-mono text-emerald-600 font-medium">
                {badges.length} Trophies Unlocked
              </span>
            </div>
            <BadgeShowcase badges={badges} />
          </div>
        </>
      )}

      {/* Tab: Performance Analytics */}
      {currentTab === 'performance' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Personal Academic Performance Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-test growth trajectory and cohort comparison
            </p>
          </div>

          {/* Dual Line Chart */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Progressive Exam Trajectory vs Batch Average
                </h3>
                <span className="text-xs text-slate-500">
                  Tracking percentile progression across recent examinations
                </span>
              </div>
            </div>
            <PerformanceTrendChart data={trendData} />
          </div>

          {/* Subject Mastery vs Class Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Subject Mastery Comparison
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAverages}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="myScore" name="My Score %" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="classScore" name="Cohort Average %" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Diagnostic Engine Insights */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Diagnostic Assessment Engine Feedback
              </h3>
              <div className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                  <strong>Subject Strengths:</strong> Physics ({diagnostics.subjectStrengths.map(s => s.subject).join(', ') || 'Physics & Calculus'}) at 93%+ percentile.
                </div>
                {diagnostics.subjectWeaknesses.length > 0 ? (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                    <strong>Growth Opportunity:</strong> Chemistry Kinetics ({diagnostics.subjectWeaknesses[0].average}% avg). Target bridge gap: +{diagnostics.subjectWeaknesses[0].targetGap}%.
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    All core STEM subjects exceed passing and proficient boundaries.
                  </div>
                )}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">Automated Recommendations:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                    {diagnostics.automatedRecommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Homework & Tasks */}
      {currentTab === 'homework' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Homework Assignments & Submissions
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload completed p-sets and review teacher feedback
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Homework */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Pending Assignments ({pendingHws.length})
              </h3>
              {pendingHws.length === 0 ? (
                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] text-xs text-slate-500 text-center">
                  All homework submitted on schedule!
                </div>
              ) : (
                pendingHws.map(hw => (
                  <div
                    key={hw.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-mono text-slate-400">{hw.subjectName}</span>
                      <span className="text-xs font-mono text-amber-600 font-semibold">
                        Due: {hw.dueDate}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{hw.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{hw.description}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedHwForUpload(hw.id);
                        setUploadFileName(`aarav_${hw.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
                      }}
                      className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-1.5 shadow-sm"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Submit Solution Document</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Submitted & Evaluated */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Completed & Evaluated Submissions
              </h3>
              {completedHws.map(sub => {
                const hw = homeworks.find(h => h.id === sub.homeworkId);
                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{hw?.title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-medium ${
                          sub.status === 'EVALUATED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      File: {sub.fileName} · Submitted: {sub.submissionDate}
                    </div>
                    {sub.grade && (
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            Grade: {sub.grade} ({sub.score}/100)
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 italic">
                          "{sub.feedback}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Journey Timeline */}
      {currentTab === 'timeline' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              My Academic Journey Timeline
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chronological feed of test scores, badges won, and faculty commendations
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#111C44]" />
                <div className="text-xs text-slate-400 font-mono">October 22, 2024</div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                  Earned Badge: 14-Day Streak Warrior (+150 XP)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  100% on-time roll call presence across 14 consecutive school days.
                </p>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#111C44]" />
                <div className="text-xs text-slate-400 font-mono">October 21, 2024</div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                  Faculty Commendation by Prof. Vikram Nair
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                  "Aarav demonstrated graduate-level intuition in solving the rotating frame conservation puzzle."
                </p>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-[#111C44]" />
                <div className="text-xs text-slate-400 font-mono">October 20, 2024</div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                  Work, Energy & Momentum Exam: 94 / 100 (97th Percentile)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Top tier mark in batch, advancing STEM honors ranking.
                </p>
              </div>

              {/* Event 4 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-white dark:ring-[#111C44]" />
                <div className="text-xs text-slate-400 font-mono">October 14, 2024</div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                  Enrolled in Chemistry Kinetics Remedial Module
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Collaborative plan created with Dr. Elena Rostova to master reaction velocity formulas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Homework Upload Modal */}
      {selectedHwForUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Submit Solution Document
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select or confirm file name for PDF upload to faculty grading portal
            </p>
            <form onSubmit={handleFileUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={e => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="p-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
                <FileText className="w-8 h-8 mx-auto text-slate-400 mb-1" />
                <span>PDF / Solution Scan Attached Ready for Commit</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedHwForUpload(null)}
                  className="px-3 py-1.5 text-xs rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded bg-[#1E3A8A] text-white hover:bg-[#172554] font-medium"
                >
                  {uploadSuccess ? 'Submitted ✓' : 'Upload Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
