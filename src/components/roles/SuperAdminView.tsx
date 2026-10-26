import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { StatCard } from '../common/StatCard';
import {
  Users,
  DollarSign,
  CheckCircle,
  Activity,
  Building,
  Shield,
  FileSpreadsheet,
  Plus,
  Send,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface SuperAdminViewProps {
  currentTab: string;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({ currentTab }) => {
  const { institute, batches, students, auditLogs, publishNotice } = useIMS();
  const [selectedBranch, setSelectedBranch] = useState('South Bay Campus');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [emergencyNotice, setEmergencyNotice] = useState({ title: '', content: '' });

  // Enrollment vs Retention Mock Trend
  const enrollmentData = [
    { month: 'May', enrolled: 1650, retention: 98.2 },
    { month: 'Jun', enrolled: 1720, retention: 98.6 },
    { month: 'Jul', enrolled: 1790, retention: 97.9 },
    { month: 'Aug', enrolled: 1810, retention: 98.4 },
    { month: 'Sep', enrolled: 1835, retention: 98.8 },
    { month: 'Oct', enrolled: 1840, retention: 99.1 }
  ];

  // Revenue collections by quarter
  const revenueData = [
    { quarter: 'Q1', collected: 580000, target: 550000 },
    { quarter: 'Q2', collected: 620000, target: 600000 },
    { quarter: 'Q3', collected: 690000, target: 650000 },
    { quarter: 'Q4 (Est)', collected: 520000, target: 700000 }
  ];

  const campuses = [
    {
      name: 'South Bay Campus',
      code: 'ANIST-SB',
      address: '100 Innovation Blvd, Tech District',
      studentsCount: 780,
      facultyCount: 48,
      academicIndex: '92.4%',
      status: 'Optimal'
    },
    {
      name: 'North Metro Campus',
      code: 'ANIST-NM',
      address: '450 University Way, North City',
      studentsCount: 520,
      facultyCount: 34,
      academicIndex: '89.1%',
      status: 'Optimal'
    },
    {
      name: 'West Coast Research Annex',
      code: 'ANIST-WC',
      address: '12 Marine Science Park',
      studentsCount: 340,
      facultyCount: 20,
      academicIndex: '91.8%',
      status: 'Optimal'
    },
    {
      name: 'Central Academic Center',
      code: 'ANIST-CC',
      address: '88 Founders Circle, Downtown',
      studentsCount: 200,
      facultyCount: 10,
      academicIndex: '86.5%',
      status: 'Auditing'
    }
  ];

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyNotice.title || !emergencyNotice.content) return;
    publishNotice({
      instituteId: institute.id,
      authorId: 'u-superadmin',
      authorName: 'Dr. Arvind Sharma (Chancellor)',
      title: emergencyNotice.title,
      content: emergencyNotice.content,
      targetRole: 'ALL',
      priority: 'EMERGENCY'
    });
    setEmergencyNotice({ title: '', content: '' });
    setIsNoticeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab 1: Executive Overview */}
      {currentTab === 'dashboard' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Institutional Executive Overview
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-campus governance metrics and academic health indices across all 4 branches
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNoticeModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] flex items-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Executive Circular</span>
            </button>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Enrolled Scholars"
              value={institute.totalStudents.toLocaleString()}
              change={4.8}
              trend="up"
              icon={Users}
              subtitle="4 Campuses active"
            />
            <StatCard
              title="YTD Fee Collections"
              value="$2,410,000"
              change={7.2}
              trend="up"
              icon={DollarSign}
              accentColor="#0D9488"
              subtitle="98.2% collection rate"
            />
            <StatCard
              title="Mean Institutional Attendance"
              value="94.2%"
              change={1.1}
              trend="up"
              icon={CheckCircle}
              accentColor="#16A34A"
              subtitle="Above 90% benchmark"
            />
            <StatCard
              title="Academic Health Index"
              value="88.4 / 100"
              change={2.3}
              trend="up"
              icon={Activity}
              accentColor="#6366F1"
              subtitle="Composite honors index"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Growth & Retention */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Scholastic Enrollment vs Retention Rate
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly rolling intake and retention curve
                  </span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" domain={[1500, 2000]} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[95, 100]} unit="%" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="enrolled" name="Enrolled Students" stroke="#1E3A8A" strokeWidth={2.5} />
                    <Line yAxisId="right" type="monotone" dataKey="retention" name="Retention %" stroke="#0D9488" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quarterly Revenue Collections */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Fiscal Revenue Collections vs Target
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Quarterly operating budgets ($ USD)
                  </span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`$${val.toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="collected" name="Collected" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="Target Target" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Academic Health Index Heatmap by Campus */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Campus Academic Health & Faculty Workload Benchmark
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Real-time synchronization across branch clusters
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {campuses.map(campus => (
                <div
                  key={campus.code}
                  className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                      {campus.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{campus.code}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Health Index:</span>
                      <span className="font-mono font-semibold text-emerald-600">{campus.academicIndex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enrolled:</span>
                      <span className="font-mono text-slate-900 dark:text-slate-200">{campus.studentsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Faculty:</span>
                      <span className="font-mono text-slate-900 dark:text-slate-200">{campus.facultyCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Branches & Campuses */}
      {currentTab === 'institutes' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Campus Branches & Global Plan Limits
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect physical branch allocations, student limits, and infrastructure webhooks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campuses.map(campus => (
              <div
                key={campus.code}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#1E3A8A] dark:text-blue-400 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {campus.name}
                      </h3>
                      <div className="text-xs text-slate-500 font-mono">{campus.code}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-xs rounded font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {campus.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <div className="mb-1"><strong>Address:</strong> {campus.address}</div>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>Student Roster: <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{campus.studentsCount}</span></div>
                    <div>Active Faculty: <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{campus.facultyCount}</span></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>API Webhook Status: <strong className="text-emerald-600">Connected</strong></span>
                  <button className="text-xs text-[#1E3A8A] dark:text-teal-400 font-medium hover:underline">
                    Configure Node →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: System Audit Trail */}
      {currentTab === 'audit-logs' && (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              System Audit Trail & Security Logs
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Immutable ledger of administrative actions, grade commits, and access permissions
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-medium">
                    <th className="py-2.5 px-4">Timestamp (UTC)</th>
                    <th className="py-2.5 px-4">Actor</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Entity</th>
                    <th className="py-2.5 px-4">Details</th>
                    <th className="py-2.5 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{log.userName}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{log.entity}</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{log.details}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Circular Modal */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Broadcast Executive Circular
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Dispatches emergency notifications across all campus notice boards and student portals
            </p>
            <form onSubmit={handleSendNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inclement Weather Campus Advisory or Symposium Schedule"
                  value={emergencyNotice.title}
                  onChange={e => setEmergencyNotice({ ...emergencyNotice, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Official communique statement..."
                  value={emergencyNotice.content}
                  onChange={e => setEmergencyNotice({ ...emergencyNotice, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#1E3A8A] text-white hover:bg-[#172554] shadow-sm"
                >
                  Dispatch to All Campuses
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
