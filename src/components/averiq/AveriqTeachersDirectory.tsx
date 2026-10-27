import React from 'react';
import {
  GraduationCap,
  Clock,
  Mail,
  Phone,
  Star,
  Users,
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';
import { academicTeachers } from '../../data/mockAcademicData';
import { InteractivePieChart } from '../charts/InteractivePieChart';

export const AveriqTeachersDirectory: React.FC = () => {
  // Workload distribution chart data
  const workloadData = academicTeachers.map((t, idx) => {
    const colors = ['#0056D6', '#7C3AED', '#00C853', '#F57C00', '#EF4444'];
    return {
      name: t.name.replace('Prof. ', '').replace('Dr. ', '').replace('Mrs. ', ''),
      value: t.workloadHoursPerWeek,
      color: colors[idx % colors.length]
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Faculty & Teaching Mentors</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              5 Department Heads & Faculty
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Subject masters, academic specializations, weekly teaching workload, and performance ratings
          </p>
        </div>
      </div>

      {/* Graphical Workload & Ratings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs lg:col-span-1">
          <InteractivePieChart
            title="Weekly Teaching Workload"
            subtitle="Instructional hours distributed per faculty"
            data={workloadData}
            centerLabel="Total Hours"
            valueSuffix=" hrs"
            size={180}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Instructional Excellence & Faculty Benchmarks
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              All 5 faculty hold postgraduate degrees (Ph.D / M.Sc / M.A) with an average student satisfaction rating of 4.85/5.0.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <span className="text-[11px] text-blue-600 font-medium">Avg Experience</span>
              <div className="text-xl font-black text-blue-700 dark:text-blue-300">8.4 Yrs</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-100 dark:border-purple-900/40">
              <span className="text-[11px] text-purple-600 font-medium">Student Rating</span>
              <div className="text-xl font-black text-purple-700 dark:text-purple-300">4.85 ★</div>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] text-emerald-600 font-medium">Total Taught</span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">1,715</div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900/40">
              <span className="text-[11px] text-amber-600 font-medium">Weekly Lectures</span>
              <div className="text-xl font-black text-amber-700 dark:text-amber-300">109 Hrs</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Faculty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {academicTeachers.map(teacher => (
          <div
            key={teacher.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${teacher.avatarBg} text-white font-extrabold flex items-center justify-center text-base shadow-sm`}>
                    {teacher.name.replace('Prof. ', '').replace('Dr. ', '').replace('Mrs. ', '').split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {teacher.name}
                    </h3>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block">
                      {teacher.primarySubject}
                    </span>
                    <span className="text-[10px] text-slate-400">{teacher.department}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                  {teacher.employeeCode}
                </span>
              </div>

              {/* Qualification */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] font-medium">Qualification & Pedagogy</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{teacher.qualification}</span>
                <span className="text-[11px] text-slate-500 block mt-1">Specialization: {teacher.specialization}</span>
              </div>

              {/* Batches & Workload */}
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Weekly Workload:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {teacher.workloadHoursPerWeek} hrs/week
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Student Rating:
                  </span>
                  <span className="font-bold text-amber-600">
                    {teacher.rating} / 5.0
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 block mb-1">Assigned Classes</span>
                  <div className="flex flex-wrap gap-1">
                    {teacher.assignedBatches.map(b => (
                      <span key={b} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200/50">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Contact */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {teacher.email}
              </span>
              <span className="text-[11px] font-mono">{teacher.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
