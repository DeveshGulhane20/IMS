import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Mail,
  Phone,
  Star,
  Users,
  Award,
  BookOpen,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  MapPin,
  CalendarCheck
} from 'lucide-react';
import { academicTeachers } from '../../data/mockAcademicData';
import { DetailedTeacher } from '../../types/academic';
import { InteractivePieChart } from '../charts/InteractivePieChart';

export const AveriqTeachersDirectory: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<DetailedTeacher | null>(null);

  // Workload distribution chart data
  const workloadData = academicTeachers.map((t, idx) => {
    const colors = ['#0056D6', '#7C3AED', '#00C853', '#F57C00', '#EF4444'];
    return {
      name: t.name.replace('Prof. ', '').replace('Dr. ', '').replace('Mrs. ', ''),
      value: t.workloadHoursPerWeek,
      color: colors[idx % colors.length]
    };
  });

  // =========================================================================
  // VIEW 2: INDIVIDUAL TEACHER PROFILE & DEDICATED ATTENDANCE OVERVIEW
  // =========================================================================
  if (selectedTeacher) {
    const att = selectedTeacher.attendance || {
      overallPercentage: 98.0,
      workingDaysTotal: 220,
      presentDays: 215,
      approvedLeaves: 3,
      dutyLeaves: 1,
      lateArrivals: 1,
      punctualityRate: 98.8,
      averageCheckInTime: '08:20 AM',
      monthlyBreakdown: [
        { month: 'Jun', percentage: 98.0, present: 22, working: 22 },
        { month: 'Jul', percentage: 97.0, present: 24, working: 25 },
        { month: 'Aug', percentage: 98.0, present: 24, working: 24 },
        { month: 'Sep', percentage: 98.0, present: 23, working: 24 },
        { month: 'Oct', percentage: 98.0, present: 22, working: 23 }
      ],
      recentPunches: [
        { date: 'Oct 30, 2026', checkIn: '08:18 AM', checkOut: '04:30 PM', status: 'ON_TIME', shift: 'Morning Shift' },
        { date: 'Oct 29, 2026', checkIn: '08:20 AM', checkOut: '04:30 PM', status: 'ON_TIME', shift: 'Morning Shift' },
        { date: 'Oct 28, 2026', checkIn: '08:17 AM', checkOut: '04:35 PM', status: 'ON_TIME', shift: 'Morning Shift' },
        { date: 'Oct 27, 2026', checkIn: '08:42 AM', checkOut: '04:40 PM', status: 'LATE', shift: 'Morning Shift' },
        { date: 'Oct 26, 2026', checkIn: '08:15 AM', checkOut: '04:30 PM', status: 'ON_TIME', shift: 'Morning Shift' }
      ]
    };

    return (
      <div className="space-y-6">
        {/* Top Back Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedTeacher(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 transition-colors shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Faculty List</span>
            </button>
            <div className="hidden sm:block text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Faculty Directory</span>
              <span className="mx-1.5">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTeacher.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/60 dark:border-purple-800">
              {selectedTeacher.employeeCode}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Faculty
            </span>
          </div>
        </div>

        {/* Teacher Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${selectedTeacher.avatarBg} text-white font-black flex items-center justify-center text-2xl shadow-md shrink-0`}>
                {selectedTeacher.name.replace('Prof. ', '').replace('Dr. ', '').replace('Mrs. ', '').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedTeacher.name}
                  </h2>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                    {selectedTeacher.employeeCode}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                    {selectedTeacher.department}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>Designation: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.designation}</strong></span>
                  <span>•</span>
                  <span>Primary Subject: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacher.primarySubject}</strong></span>
                  <span>•</span>
                  <span>Tenure: <strong className="text-slate-800 dark:text-slate-200">Joined {selectedTeacher.joiningDate}</strong></span>
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-purple-600" /> {selectedTeacher.email}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono">
                    <Phone className="w-3.5 h-3.5 text-purple-600" /> {selectedTeacher.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPI Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50 text-center">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-semibold uppercase tracking-wider">Presence Rate</span>
                <span className="text-xl font-black text-purple-700 dark:text-purple-300">{att.overallPercentage}%</span>
                <span className="text-[10px] text-purple-500 block">Annual Logged</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 text-center">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold uppercase tracking-wider">Days Present</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">{att.presentDays}</span>
                <span className="text-[10px] text-emerald-600 block">of {att.workingDaysTotal} Days</span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-center">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-semibold uppercase tracking-wider">Punctuality</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">{att.punctualityRate}%</span>
                <span className="text-[10px] text-blue-500 block">Avg: {att.averageCheckInTime}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-center">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold uppercase tracking-wider">Student Rating</span>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xl font-black text-amber-700 dark:text-amber-300">{selectedTeacher.rating}</span>
                </div>
                <span className="text-[10px] text-amber-500 block">{selectedTeacher.totalStudentsTaught} Students</span>
              </div>
            </div>
          </div>

          {/* DEDICATED TEACHER ATTENDANCE OVERVIEW CARD */}
          <div className="border border-purple-200/80 dark:border-purple-900/70 rounded-2xl p-6 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/20 dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100 dark:border-purple-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Teacher Attendance Overview & Punctuality Record</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Verified
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comprehensive annual presence statistics, approved duty leaves, and biometric punch logs
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 self-start sm:self-auto">
                Threshold Benchmark: 95.0%
              </span>
            </div>

            {/* Attendance Breakdown Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Working Days</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {att.workingDaysTotal}
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">Academic Year 2026-27</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium block">Present / On-Duty</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                  {att.presentDays} Days
                </div>
                <span className="text-[11px] text-emerald-600 block mt-0.5">{att.overallPercentage}% Presence Rate</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block">Approved Leaves</span>
                <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">
                  {att.approvedLeaves + att.dutyLeaves} Days
                </div>
                <span className="text-[11px] text-blue-600 block mt-0.5">{att.approvedLeaves} Casual • {att.dutyLeaves} Duty Leave</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium block">Late Arrivals</span>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
                  {att.lateArrivals} Days
                </div>
                <span className="text-[11px] text-amber-600 block mt-0.5">{att.punctualityRate}% Punctual</span>
              </div>
            </div>

            {/* Monthly Presence Trajectory */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Month-Wise Attendance Trajectory</span>
                <span className="text-[11px] font-normal text-slate-400">June 2026 – October 2026</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {att.monthlyBreakdown.map(m => (
                  <div key={m.month} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block">{m.month} 2026</span>
                    <span className="text-lg font-black text-purple-600 dark:text-purple-400 block mt-1">{m.percentage}%</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{m.present} of {m.working} Days</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Punctuality & Recent Biometric Clock-In Log */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Recent Biometric Punctuality & Punch Log</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  Average Clock-In: {att.averageCheckInTime}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Shift</th>
                      <th className="py-2.5 px-3 font-mono">Check-In Time</th>
                      <th className="py-2.5 px-3 font-mono">Check-Out Time</th>
                      <th className="py-2.5 px-3">Punctuality Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {att.recentPunches.map((punch, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/40">
                        <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {punch.date}
                        </td>
                        <td className="py-2 px-3 text-slate-500">
                          {punch.shift}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {punch.checkIn}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500">
                          {punch.checkOut}
                        </td>
                        <td className="py-2 px-3">
                          {punch.status === 'ON_TIME' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> On-Time
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" /> Late Entry
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Additional Teacher Details: Qualification & Assigned Batches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>Qualifications & Academic Pedagogy</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                {selectedTeacher.qualification}
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <div>Specialization: <strong className="text-slate-700 dark:text-slate-300">{selectedTeacher.specialization}</strong></div>
                <div>Department: <strong className="text-slate-700 dark:text-slate-300">{selectedTeacher.department}</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Assigned Batches & Teaching Workload</span>
              </h4>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Weekly Teaching Hours: <strong className="text-purple-600 font-bold">{selectedTeacher.workloadHoursPerWeek} hrs/week</strong>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedTeacher.assignedBatches.map(b => (
                  <span key={b} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: MAIN TEACHERS DIRECTORY LIST & WORKLOAD SUMMARY
  // =========================================================================
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
            Subject masters, academic specializations, weekly teaching workload, and verified attendance profiles
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
              Instructional Excellence & Faculty Attendance Benchmarks
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              All 5 faculty hold postgraduate degrees with a campus attendance average of 98.0% and student rating of 4.85/5.0.
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
              <span className="text-[11px] text-emerald-600 font-medium">Avg Attendance</span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">98.0%</div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900/40">
              <span className="text-[11px] text-amber-600 font-medium">Weekly Lectures</span>
              <div className="text-xl font-black text-amber-700 dark:text-amber-300">109 Hrs</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Faculty Cards with Interactive View Profile & Attendance Button */}
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
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block">
                      {teacher.primarySubject}
                    </span>
                    <span className="text-[10px] text-slate-400">{teacher.department}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 font-mono text-[10px] text-purple-700 dark:text-purple-300 font-bold border border-purple-200/60 dark:border-purple-800">
                  {teacher.employeeCode}
                </span>
              </div>

              {/* Attendance & Workload Badge Row */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center">
                  <span className="text-[10px] text-emerald-600 font-medium block">Attendance Rate</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                    {teacher.attendance?.overallPercentage || 98}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 text-center">
                  <span className="text-[10px] text-purple-600 font-medium block">Weekly Workload</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                    {teacher.workloadHoursPerWeek} hrs/wk
                  </span>
                </div>
              </div>

              {/* Qualification */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 block text-[10px] font-medium">Qualification & Specialization</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{teacher.qualification}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Specialization: {teacher.specialization}</span>
              </div>

              {/* Assigned Classes */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Assigned Classes</span>
                <div className="flex flex-wrap gap-1">
                  {teacher.assignedBatches.map(b => (
                    <span key={b} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button: View Profile & Attendance */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => setSelectedTeacher(teacher)}
                className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Profile & Attendance Overview</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-[11px]">
                  <Mail className="w-3 h-3 text-slate-400" /> {teacher.email}
                </span>
                <span className="text-[11px] font-mono">{teacher.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
