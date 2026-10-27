import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  X,
  Sparkles
} from 'lucide-react';
import { academicInquiries, academicMetrics } from '../../data/mockAcademicData';
import { InquiryRecord } from '../../types/academic';
import { InteractivePieChart } from '../charts/InteractivePieChart';

export const AveriqInquiriesCRM: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(academicInquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInquiry, setNewInquiry] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    targetClass: 'Class 10',
    source: 'Website' as const,
    counselor: 'Pooja Tanna',
    notes: ''
  });

  // Pipeline Status Pie data
  const pipelineData = useMemo(() => {
    const counts: Record<string, number> = {
      New: 0,
      Contacted: 0,
      'Demo Scheduled': 0,
      Enrolled: 0,
      Lost: 0
    };
    inquiries.forEach(i => {
      counts[i.status] = (counts[i.status] || 0) + 1;
    });

    return [
      { name: 'Enrolled', value: counts['Enrolled'], color: '#00C853' },
      { name: 'Demo Scheduled', value: counts['Demo Scheduled'], color: '#0056D6' },
      { name: 'Contacted', value: counts['Contacted'], color: '#7C3AED' },
      { name: 'New Leads', value: counts['New'], color: '#F57C00' },
      { name: 'Lost / Dropped', value: counts['Lost'], color: '#EF4444' }
    ];
  }, [inquiries]);

  // Lead Source Pie data
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    inquiries.forEach(i => {
      counts[i.source] = (counts[i.source] || 0) + 1;
    });

    const colors = ['#0056D6', '#0284C7', '#10B981', '#F57C00', '#8B5CF6'];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length]
    }));
  }, [inquiries]);

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => {
      const matchSearch =
        i.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.inquiryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.phone.includes(searchTerm);

      const matchStatus = statusFilter === 'All' || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiry.studentName.trim()) return;

    const codeNum = (inquiries.length + 101).toString();
    const created: InquiryRecord = {
      id: `inq-${codeNum}`,
      inquiryCode: `INQ-2025-${codeNum}`,
      studentName: newInquiry.studentName,
      parentName: newInquiry.parentName || 'Parent / Guardian',
      phone: newInquiry.phone || '+91 98252 00000',
      email: newInquiry.email || 'lead@averiq.edu',
      targetClass: newInquiry.targetClass,
      source: newInquiry.source,
      status: 'New',
      counselor: newInquiry.counselor,
      inquiryDate: new Date().toISOString().split('T')[0],
      followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: newInquiry.notes || 'Inquiry logged from admissions portal.'
    };

    setInquiries([created, ...inquiries]);
    setIsAddModalOpen(false);
    setNewInquiry({
      studentName: '',
      parentName: '',
      phone: '',
      email: '',
      targetClass: 'Class 10',
      source: 'Website',
      counselor: 'Pooja Tanna',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Admission Inquiries & Lead Pipeline</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              {inquiries.length} Active Leads
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Omni-channel student inquiries, follow-up scheduling, conversion tracking, and counselor assignments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Inquiry</span>
        </button>
      </div>

      {/* Graphical Representation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Inquiry Pipeline & Conversion Stages"
            subtitle="Distribution of admission stages from New to Enrolled"
            data={pipelineData}
            centerLabel="Total Leads"
            centerValue={inquiries.length}
            size={180}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <InteractivePieChart
            title="Inquiry Source Channel Distribution"
            subtitle="Acquisition channels delivering student admissions"
            data={sourceData}
            centerLabel="Channels"
            centerValue="5 Sources"
            size={180}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student, parent, or code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Stage:</span>
          {['All', 'New', 'Contacted', 'Demo Scheduled', 'Enrolled', 'Lost'].map(stage => (
            <button
              key={stage}
              type="button"
              onClick={() => setStatusFilter(stage)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap ${
                statusFilter === stage
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Student & Parent</th>
                <th className="py-3 px-4">Class & Stream</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Counselor</th>
                <th className="py-3 px-4">Next Follow-Up</th>
                <th className="py-3 px-4">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInquiries.map(i => (
                <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {i.inquiryCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{i.studentName}</div>
                    <div className="text-[10px] text-slate-400">Guardian: {i.parentName} • {i.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{i.targetClass}</span>
                    <span className="text-[10px] text-slate-400">{i.stream || 'Standard'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium">
                      {i.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {i.counselor}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {i.followUpDate}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        i.status === 'Enrolled'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : i.status === 'Demo Scheduled'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : i.status === 'Contacted'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : i.status === 'New'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inquiry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Log New Admission Inquiry</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={newInquiry.studentName}
                    onChange={e => setNewInquiry({ ...newInquiry, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    placeholder="e.g. Aryan Sharma"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={newInquiry.parentName}
                    onChange={e => setNewInquiry({ ...newInquiry, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    placeholder="e.g. Deepak Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newInquiry.phone}
                    onChange={e => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    placeholder="+91 98250 12345"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Target Class</label>
                  <select
                    value={newInquiry.targetClass}
                    onChange={e => setNewInquiry({ ...newInquiry, targetClass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option>Class 10</option>
                    <option>Class 9</option>
                    <option>Class 8</option>
                    <option>Class 11 Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Lead Source</label>
                <select
                  value={newInquiry.source}
                  onChange={e => setNewInquiry({ ...newInquiry, source: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option>Website</option>
                  <option>Walk-in</option>
                  <option>Referral</option>
                  <option>Social Media</option>
                  <option>Education Expo</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Notes / Requirement</label>
                <textarea
                  rows={2}
                  value={newInquiry.notes}
                  onChange={e => setNewInquiry({ ...newInquiry, notes: e.target.value })}
                  placeholder="Parent requested weekend demo class details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
              >
                Log Inquiry Lead
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
