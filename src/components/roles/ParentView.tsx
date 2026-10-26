import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { StatCard } from '../common/StatCard';
import { AttendanceHeatmap } from '../common/AttendanceHeatmap';
import {
  Users,
  CheckCircle,
  FileText,
  DollarSign,
  AlertCircle,
  Download,
  CreditCard,
  Sparkles,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ParentViewProps {
  currentTab: string;
}

export const ParentView: React.FC<ParentViewProps> = ({ currentTab }) => {
  const {
    students,
    users,
    feeInvoices,
    testResults,
    tests,
    attendanceRecords,
    studentRemarks,
    improvementPlans,
    getStudentDiagnostic,
    collectFee
  } = useIMS();

  // Child: Aarav Patel (sp-01)
  const child = students[0];
  const childUser = users.find(u => u.id === child?.userId);
  const childAttendance = attendanceRecords.filter(a => a.studentId === child?.id);
  const childInvoices = feeInvoices.filter(i => i.studentId === child?.id);
  const childRemarks = studentRemarks.filter(r => r.studentId === child?.id);
  const childPlans = improvementPlans.filter(p => p.studentId === child?.id);
  const diagnostics = getStudentDiagnostic(child?.id || 'sp-01');

  // Payment Drawer Modal
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [downloadedReceiptId, setDownloadedReceiptId] = useState<string | null>(null);

  // Subject confidence chart
  const confidenceData = [
    { subject: 'Physics', confidence: 94, status: 'Mastery' },
    { subject: 'Calculus', confidence: 89, status: 'High' },
    { subject: 'Chemistry', confidence: 72, status: 'Remediation Active' },
    { subject: 'Comp Science', confidence: 96, status: 'Mastery' }
  ];

  const handlePay = (_invoiceId: string, amount: number) => {
    collectFee(child?.name || 'Aarav', amount, 'UPI');
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setSelectedInvoice(null);
    }, 1500);
  };

  const handleDownloadReceipt = (inv: any) => {
    setDownloadedReceiptId(inv.id);
    setTimeout(() => setDownloadedReceiptId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Tab: Ward Overview */}
      {currentTab === 'dashboard' && (
        <>
          {/* Header Card */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-base">
                AP
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {childUser?.firstName} {childUser?.lastName}
                </h1>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>Roll #{child?.rollNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>Grade 11 – STEM Alpha (Honors)</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-600 font-semibold">16-Day Active Streak</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block">Guardian Account:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Meera Patel</span>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Classroom Attendance Rate"
              value={`${diagnostics.attendanceRate}%`}
              icon={CheckCircle}
              accentColor="#16A34A"
              subtitle="Well above 75% minimum"
            />
            <StatCard
              title="Overall Academic Average"
              value={`${diagnostics.overallAverage}%`}
              change={3.4}
              trend="up"
              icon={TrendingUp}
              accentColor="#1E3A8A"
              subtitle="Batch Mean: 76.5%"
            />
            <StatCard
              title="Remediation Milestones"
              value="2 / 4 Done"
              icon={Sparkles}
              accentColor="#0D9488"
              subtitle="Chemistry Bridge Track"
            />
            <StatCard
              title="Pending Invoices"
              value={childInvoices.filter(i => i.status !== 'PAID').length}
              icon={DollarSign}
              accentColor="#F59E0B"
              subtitle="1 due by Nov 15"
            />
          </div>

          {/* Attendance Heatmap */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Daily Attendance Consistency Heatmap
            </h3>
            <AttendanceHeatmap records={childAttendance} />
          </div>

          {/* Remarks Feed & Exam Grades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teacher Remarks */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Direct Faculty Remarks Feed
              </h3>
              <div className="space-y-3">
                {childRemarks.map(rem => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {rem.authorName} ({rem.authorRole})
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">{rem.createdAt}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">"{rem.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Exam Grades */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recent Exam Report Card
              </h3>
              <div className="space-y-2">
                {testResults
                  .filter(tr => tr.studentId === child?.id)
                  .map(tr => {
                    const test = tests.find(t => t.id === tr.testId);
                    const pct = test ? Math.round((tr.marksObtained / test.maxMarks) * 100) : 0;
                    return (
                      <div
                        key={tr.id}
                        className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {test?.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {test?.subjectName} · Date: {test?.testDate}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                            {tr.marksObtained} / {test?.maxMarks} ({pct}%)
                          </span>
                          <span className="block text-[11px] font-mono text-emerald-600">
                            {tr.percentile}th Percentile
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab: Academic Diagnostics */}
      {currentTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Child Academic Diagnostic Summary
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated institutional assessment and remedial milestone tracking
            </p>
          </div>

          {/* Plain-English Summary Card */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Plain-English Performance Assessment
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Aarav is performing within the <strong>top 5%</strong> of his Grade 11 STEM cohort, demonstrating exceptional mastery in <strong>Physics (94%)</strong> and <strong>Calculus (89%)</strong>. Classroom roll call attendance is optimal at <strong>{diagnostics.attendanceRate}%</strong> with a 16-day unbroken streak. A minor concept gap was detected in <strong>Chemistry Reaction Kinetics</strong> (58/80 marks), for which Dr. Elena Rostova has activated a 4-week guided remediation module.
            </p>
          </div>

          {/* Confidence chart & Remediation Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Subject Confidence Levels
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={confidenceData}>
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
                    <Bar dataKey="confidence" name="Mastery Score %" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Remediation Action Items Assigned */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Remediation Plan Milestones
              </h3>
              {childPlans.map(plan => (
                <div key={plan.id} className="space-y-2">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {plan.subjectName} · Target: {plan.targetScore}% by {plan.deadline}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {plan.tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            task.isDone
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {task.isDone ? '✓' : '○'}
                        </span>
                        <span className={task.isDone ? 'line-through text-slate-400' : ''}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Fee Ledger */}
      {currentTab === 'fees' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Ward Fee Ledger & Payment Center
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pay tuition dues online and retrieve official tax and bursar receipts
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-medium">
                    <th className="py-2.5 px-4">Invoice Particulars</th>
                    <th className="py-2.5 px-4">Total Amount</th>
                    <th className="py-2.5 px-4">Amount Paid</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {childInvoices.map(inv => {
                    const remaining = inv.amount - inv.paidAmount;
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          {inv.title}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                          ${inv.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-600">
                          ${inv.paidAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{inv.dueDate}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {inv.status === 'PAID' ? (
                            <button
                              type="button"
                              onClick={() => handleDownloadReceipt(inv)}
                              className="px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 ml-auto text-slate-700 dark:text-slate-300"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{downloadedReceiptId === inv.id ? 'Downloaded ✓' : 'Download Receipt'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-1 text-xs rounded bg-[#16A34A] text-white hover:bg-emerald-700 font-medium"
                            >
                              Pay ${remaining.toLocaleString()}
                            </button>
                          )}
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

      {/* Pay Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Secure Fee Settlement
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedInvoice.title}</p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex justify-between text-xs">
                <span>Amount to Pay:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  ${selectedInvoice.amount - selectedInvoice.paidAmount}
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-3 py-1.5 text-xs rounded border"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handlePay(selectedInvoice.id, selectedInvoice.amount - selectedInvoice.paidAmount)}
                  className="px-4 py-1.5 text-xs rounded bg-[#16A34A] text-white font-medium"
                >
                  {paySuccess ? 'Authorized ✓' : 'Confirm Instant ACH Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
