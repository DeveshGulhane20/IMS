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
  BarChart3
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
import { academicStudents, academicMetrics } from '../../data/mockAcademicData';
import { InteractivePieChart } from '../charts/InteractivePieChart';
import { SemesterComparisonChart } from '../charts/SemesterComparisonChart';
import { DetailedStudent } from '../../types/academic';

export const AveriqAcademicReportsView: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-001');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const activeStudent = useMemo(() => {
    return academicStudents.find(s => s.id === selectedStudentId) || academicStudents[0];
  }, [selectedStudentId]);

  // Overall grade distribution across both semesters
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

  // Subject Averages Comparison Data (Sem 1 vs Sem 2)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Academic Performance & Semester Diagnostics</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              Dual Semester Evaluation
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Semester 1 (Mid-Term) vs Semester 2 (Final Evaluation) comparative scorecards, GPA metrics, and subject trends
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Sem 1 Batch Average</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {academicMetrics.averageSem1Score}%
          </div>
          <span className="text-[10px] text-slate-400">Class 10 & 9 & 8 Cohort</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Sem 2 Batch Average</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {academicMetrics.averageSem2Score}%
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">
            +{academicMetrics.averageSem2Score - academicMetrics.averageSem1Score}% Net Uplift
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Distinction Rate</span>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {Math.round((academicStudents.filter(s => s.semesters.sem2.percentage >= 75).length / academicStudents.length) * 100)}%
          </div>
          <span className="text-[10px] text-slate-400">Scoring ≥ 75%</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pass Percentage</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            100%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Zero Failures</span>
        </div>
      </div>

      {/* Graphical Representation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Grade Distribution Pie */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Overall Grade Distribution (50 Students)"
            subtitle="Combined dual-semester academic standing"
            data={gradeDistributionData}
            centerLabel="Students"
            centerValue={50}
            size={180}
          />
        </div>

        {/* Subject-Wise Average Comparison (Sem 1 vs Sem 2) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Cohort Subject Averages: Sem 1 vs Sem 2
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Mean score progression across 5 core STEM & Language subjects
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAveragesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: number, name: string) => [`${val}%`, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="Semester 1 Avg" fill="#0056D6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Semester 2 Avg" fill="#00C853" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Individual Student Semester Inspection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Individual Student Semester Scorecard
            </h3>
            <p className="text-xs text-slate-500">
              Select any of the 50 students to view detailed subject-by-subject graphical progression
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Student:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-blue-600"
            >
              {academicStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.studentCode} – {s.name} ({s.gradeLevel} {s.section})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Student Chart */}
        <SemesterComparisonChart
          sem1={activeStudent.semesters.sem1}
          sem2={activeStudent.semesters.sem2}
          studentName={`${activeStudent.name} (${activeStudent.studentCode})`}
        />
      </div>

      {/* Top Performing Honor Roll */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Honor Roll & Top Academic Performers</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Top 5 students with the highest cumulative dual-semester GPA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {topPerformers.map((s, idx) => {
            const avg = Math.round((s.semesters.sem1.percentage + s.semesters.sem2.percentage) / 2);
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full mx-auto bg-gradient-to-tr from-amber-400 to-amber-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  #{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 truncate">
                    {s.name}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400 block">{s.studentCode}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                  {avg}% GPA
                </div>
                <span className="text-[10px] text-slate-400 block">{s.gradeLevel} {s.section}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
