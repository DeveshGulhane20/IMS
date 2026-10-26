import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  X,
  Flame,
  Phone,
  Check,
  AlertTriangle,
  Clock,
  Send,
  CreditCard,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export const MobilePreviewModal: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    isMobilePreviewOpen,
    setMobilePreviewOpen,
    students,
    users,
    batches,
    timetable,
    feeInvoices,
    tests,
    testResults,
    markBatchAttendance,
    publishNotice,
    collectFee
  } = useIMS();

  const [activeTab, setActiveTab] = useState<'screen1' | 'screen2'>('screen1');
  const [mobileAttendanceMap, setMobileAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({
    'sp-01': 'PRESENT',
    'sp-02': 'PRESENT',
    'sp-03': 'ABSENT',
    'sp-04': 'PRESENT'
  });
  const [mobileNoticeText, setMobileNoticeText] = useState('');
  const [mobileNoticeSent, setMobileNoticeSent] = useState(false);

  if (!isMobilePreviewOpen) return null;

  const child = students[0];
  const childUser = users.find(u => u.id === child?.userId);

  const toggleStudentStatus = (id: string, st: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setMobileAttendanceMap(prev => ({ ...prev, [id]: st }));
  };

  const handleMobileAttendanceSubmit = () => {
    markBatchAttendance('batch-alpha', new Date().toISOString().split('T')[0], mobileAttendanceMap);
    alert('Attendance committed from Mobile Expo App!');
  };

  const handleMobileNoticeSend = () => {
    if (!mobileNoticeText) return;
    publishNotice({
      instituteId: 'inst-01',
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} (Mobile Dispatch)`,
      title: 'Mobile Broadcast Bulletin',
      content: mobileNoticeText,
      targetRole: 'ALL',
      priority: 'HIGH'
    });
    setMobileNoticeSent(true);
    setTimeout(() => {
      setMobileNoticeSent(false);
      setMobileNoticeText('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Device wrapper */}
      <div className="relative w-full max-w-sm rounded-[42px] border-[10px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden flex flex-col h-[740px]">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-900 rounded-b-xl z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-950/80 mr-3" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>

        {/* Close Button on Top Right outside/inside */}
        <button
          type="button"
          onClick={() => setMobilePreviewOpen(false)}
          className="absolute top-3 right-3 z-40 w-7 h-7 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-slate-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status bar */}
        <div className="pt-3 px-6 flex justify-between items-center text-[10px] font-mono text-slate-300 select-none z-20">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Role Header Banner */}
        <div className="px-5 pt-3 pb-2 bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white">
          <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">
            React Native Expo · {role} View
          </div>
          <div className="font-bold text-sm truncate">
            {currentUser.firstName} {currentUser.lastName}
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 overflow-y-auto p-4 space-y-3.5 text-slate-800 dark:text-slate-200">
          {/* SUPER ADMIN MOBILE: SuperAdminOverviewScreen */}
          {role === 'SUPER_ADMIN' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Total Campus Students</span>
                <span className="text-xl font-bold font-mono">1,840</span>
                <span className="text-[10px] text-emerald-600 font-mono block mt-1">+4.8% this cycle</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Quick Revenue Widget</span>
                <span className="text-xl font-bold font-mono text-[#0D9488]">$2,410,000</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Target: $2.5M (96.4%)</span>
              </div>

              {/* Emergency Notice Dispatcher */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">
                  Emergency Notice Dispatcher
                </span>
                <input
                  type="text"
                  placeholder="Immediate broadcast alert..."
                  value={mobileNoticeText}
                  onChange={e => setMobileNoticeText(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={handleMobileNoticeSend}
                  className="w-full py-1.5 text-xs font-semibold rounded bg-[#DC2626] text-white flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{mobileNoticeSent ? 'Broadcast Sent ✓' : 'Dispatch Push Alert'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ADMIN MOBILE: AdminDashboardScreen & AdminStudentListScreen */}
          {role === 'ADMIN' && (
            <div className="space-y-3">
              <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setActiveTab('screen1')}
                  className={`flex-1 py-1 rounded font-medium ${
                    activeTab === 'screen1' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Ops Hub
                </button>
                <button
                  onClick={() => setActiveTab('screen2')}
                  className={`flex-1 py-1 rounded font-medium ${
                    activeTab === 'screen2' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Find Student
                </button>
              </div>

              {activeTab === 'screen1' ? (
                <>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[11px] text-slate-400">Attendance Donut</span>
                    <div className="text-2xl font-bold font-mono text-emerald-600 my-1">94.8%</div>
                    <span className="text-[10px] text-slate-500">32 / 34 Active Cohorts</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold block mb-1">Defaulter Quick Strip</span>
                    <div className="text-xs font-mono text-rose-600 font-semibold">$4,670 Total Dues</div>
                    <span className="text-[10px] text-slate-400">3 Overdue Scholars flagged</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-bold block">Recent Admissions</span>
                    {students.slice(0, 3).map(s => {
                      const u = users.find(user => user.id === s.userId);
                      return (
                        <div key={s.id} className="flex justify-between items-center text-xs border-b pb-1">
                          <span>{u?.firstName} {u?.lastName}</span>
                          <span className="font-mono text-[10px] text-slate-400">{s.rollNumber}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Fast search student..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  {students.slice(0, 4).map(s => {
                    const u = users.find(user => user.id === s.userId);
                    return (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-xs">{u?.firstName} {u?.lastName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{s.rollNumber}</div>
                        </div>
                        <a
                          href={`tel:${u?.phone || '5550000000'}`}
                          className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600"
                          title="Call Student / Guardian"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TEACHER MOBILE: TeacherAttendanceScreen & TeacherGradeEntryScreen */}
          {role === 'TEACHER' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex justify-between items-center">
                <span>Quick Roll Call (Grade 11 Alpha)</span>
                <span className="font-mono text-[11px] text-slate-400">P/A/L Cards</span>
              </div>

              <div className="space-y-2">
                {students.slice(0, 4).map(s => {
                  const u = users.find(user => user.id === s.userId);
                  const st = mobileAttendanceMap[s.id] || 'PRESENT';
                  return (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs">{u?.firstName} {u?.lastName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.rollNumber}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(s.id, 'PRESENT')}
                          className={`w-6 h-6 rounded text-[10px] font-bold ${
                            st === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(s.id, 'LATE')}
                          className={`w-6 h-6 rounded text-[10px] font-bold ${
                            st === 'LATE' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          L
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(s.id, 'ABSENT')}
                          className={`w-6 h-6 rounded text-[10px] font-bold ${
                            st === 'ABSENT' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          A
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleMobileAttendanceSubmit}
                className="w-full py-2 rounded-xl bg-[#1E3A8A] text-white font-medium text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Submit Batch Attendance</span>
              </button>
            </div>
          )}

          {/* STUDENT MOBILE: StudentPulseScreen */}
          {role === 'STUDENT' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wide opacity-90 block">Streak Pulse</span>
                  <div className="text-2xl font-bold font-mono flex items-center gap-1.5">
                    <Flame className="w-5 h-5 fill-white" />
                    <span>{child?.currentStreak} Days</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold">{child?.badgePoints} XP</span>
                  <span className="text-[10px] block opacity-80">STEM Scholar</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold block mb-2">Today's Class Schedule</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b">
                    <span>Physics: Mechanics</span>
                    <span className="font-mono text-slate-400">08:30 · LH 401</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Differential Calculus</span>
                    <span className="font-mono text-slate-400">10:15 · LH 401</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold block mb-2">Subject Mastery Bars</span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span>Physics Dynamics</span>
                      <span className="font-mono font-semibold">94%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#1E3A8A] h-full w-[94%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span>Differential Calculus</span>
                      <span className="font-mono font-semibold">89%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#0D9488] h-full w-[89%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PARENT MOBILE: ParentOverviewScreen */}
          {role === 'PARENT' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs">
                    AP
                  </div>
                  <div>
                    <div className="font-bold text-xs">{childUser?.firstName} {childUser?.lastName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Roll #{child?.rollNumber} · Grade 11</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-400">Attendance Mini Dial</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 my-0.5">97.2%</div>
                <span className="text-[10px] text-slate-500 font-mono">16-Day Unbroken Streak</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold block mb-1">Latest Exam Score</span>
                <div className="text-xs text-slate-700 dark:text-slate-300">Work, Energy & Momentum Exam</div>
                <div className="text-base font-bold font-mono text-[#1E3A8A] mt-0.5">94 / 100 (97th %ile)</div>
              </div>

              {/* Pay Fee Sticky Bar */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Pending Tuition</span>
                  <span className="font-mono font-bold text-xs">$320.00 Due</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Mobile payment processed via Apple Pay / Google Pay!')}
                  className="px-3 py-1.5 rounded-lg bg-[#16A34A] text-white text-xs font-semibold"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Home Bar indicator */}
        <div className="py-2 flex justify-center bg-slate-950">
          <div className="w-28 h-1 rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
};
