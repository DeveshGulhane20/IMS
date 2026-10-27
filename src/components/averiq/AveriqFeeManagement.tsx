import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Receipt,
  Check
} from 'lucide-react';
import { academicStudents, academicMetrics } from '../../data/mockAcademicData';
import { InteractivePieChart } from '../charts/InteractivePieChart';
import { DetailedStudent } from '../../types/academic';

export const AveriqFeeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'PAID' | 'PARTIAL' | 'OVERDUE'>('All');
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<DetailedStudent | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paySuccess, setPaySuccess] = useState(false);

  // Fee collection Donut data
  const feeDonutData = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let overdue = 0;

    academicStudents.forEach(s => {
      paid += s.fees.paidFee;
      if (s.fees.status === 'OVERDUE') {
        overdue += s.fees.pendingFee;
      } else {
        pending += s.fees.pendingFee;
      }
    });

    return [
      { name: 'Collected', value: paid, color: '#00C853' },
      { name: 'Pending (Due)', value: pending, color: '#F57C00' },
      { name: 'Overdue Balance', value: overdue, color: '#EF4444' }
    ];
  }, []);

  // Category distribution data
  const categoryFeeData = useMemo(() => {
    let tuition = 0;
    let lab = 0;
    let transport = 0;
    let exam = 0;
    let other = 0;

    academicStudents.forEach(s => {
      tuition += s.fees.tuitionFee;
      lab += s.fees.laboratoryFee;
      transport += s.fees.transportFee;
      exam += s.fees.examFee;
      other += s.fees.libraryFee + s.fees.sportsFee;
    });

    return [
      { name: 'Tuition Fees', value: tuition, color: '#0056D6' },
      { name: 'Lab & Practical', value: lab, color: '#7C3AED' },
      { name: 'Transport', value: transport, color: '#0284C7' },
      { name: 'Exam & Valuation', value: exam, color: '#F57C00' },
      { name: 'Library & Sports', value: other, color: '#10B981' }
    ];
  }, []);

  // Filter students
  const filteredStudents = useMemo(() => {
    return academicStudents.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'All' || s.fees.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleOpenPayModal = (student: DetailedStudent) => {
    setSelectedStudentForPay(student);
    setPayAmount(student.fees.pendingFee);
    setPaySuccess(false);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaySuccess(true);
    setTimeout(() => {
      setSelectedStudentForPay(null);
      setPaySuccess(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Tuition & Fee Operations</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              ₹{academicMetrics.totalFeesCollected.toLocaleString('en-IN')} Collected
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            50 student fee ledgers, automated reconciliation, receipts, and payment reminders
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block font-medium">Total Billed Fees</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{academicMetrics.totalFeesBilled.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">50 Enrolled Students</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-emerald-600 block font-medium">Total Collected</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{academicMetrics.totalFeesCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {Math.round((academicMetrics.totalFeesCollected / academicMetrics.totalFeesBilled) * 100)}% Collection Rate
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-amber-600 block font-medium">Pending Balance</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹{academicMetrics.totalFeesPending.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Due by 15 Nov 2025</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-rose-600 block font-medium">Overdue Accounts</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {academicStudents.filter(s => s.fees.status === 'OVERDUE').length} Accounts
          </div>
          <span className="text-[11px] text-rose-500 font-semibold">Reminders Active</span>
        </div>
      </div>

      {/* Graphical Representation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Fee Collection Health"
            subtitle="Current status breakdown across entire student body"
            data={feeDonutData}
            centerLabel="Collected"
            valuePrefix="₹"
            size={180}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Fee Breakdown by Category"
            subtitle="Component allocation of total institutional billing"
            data={categoryFeeData}
            centerLabel="Total Billed"
            valuePrefix="₹"
            size={180}
          />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student code, name or parent..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Status:</span>
          {['All', 'PAID', 'PARTIAL', 'OVERDUE'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 50 Students Fee Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-right">Total Fee</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Pending Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {s.studentCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.parentName.split('&')[0]}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {s.gradeLevel} {s.section}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                    ₹{s.fees.totalFee.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    ₹{s.fees.paidFee.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-600">
                    {s.fees.pendingFee > 0 ? `₹${s.fees.pendingFee.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.fees.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : s.fees.status === 'PARTIAL'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {s.fees.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {s.fees.pendingFee > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleOpenPayModal(s)}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-xs"
                      >
                        Collect
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {selectedStudentForPay && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span>Collect Fee & Issue Receipt</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedStudentForPay(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">
                {selectedStudentForPay.name} ({selectedStudentForPay.studentCode})
              </div>
              <div className="text-slate-400">
                {selectedStudentForPay.gradeLevel} {selectedStudentForPay.section} • Pending: ₹{selectedStudentForPay.fees.pendingFee.toLocaleString('en-IN')}
              </div>
            </div>

            {paySuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-center space-y-2 border border-emerald-200">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Payment Recorded!</h4>
                <p className="text-xs text-emerald-600">
                  Receipt generated: RCP-2025-REC-9912. SMS confirmation sent to parent.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmPay} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Amount to Collect (₹)
                  </label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    max={selectedStudentForPay.fees.pendingFee}
                    min={100}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Payment Mode
                  </label>
                  <select className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium">
                    <option>UPI / QR Code</option>
                    <option>Net Banking</option>
                    <option>Debit / Credit Card</option>
                    <option>Cash at Counter</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  Confirm & Print Receipt
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
