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
import { academicInquiries } from '../../data/mockAcademicData';
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
    leadStatus: 'Hot' as 'Hot' | 'Warm' | 'Cold',
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
      leadStatus: 'Hot',
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
        <div className="fixed inset-0 z-50 bg-[#122D4A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[22px] max-w-xl w-full border border-[#d5e8f7] dark:border-slate-800 p-6 space-y-4 shadow-[0_12px_35px_rgba(39,94,150,0.12)] text-[#122D4A] dark:text-slate-100 animate-scaleUp my-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#d5e8f7] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border border-pink-200/60 flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173a5d] dark:text-white flex items-center gap-2">
                    <span>Log Admission Inquiry</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/60">
                      CRM Intake
                    </span>
                  </h3>
                  <p className="text-xs text-[#5A7184] dark:text-slate-400">
                    Capture prospective student details, guardian contacts &amp; counseling status
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-[#173a5d] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInquiry} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Candidate / Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newInquiry.studentName}
                    onChange={e => setNewInquiry({ ...newInquiry, studentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    placeholder="e.g. Aryan Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Parent / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={newInquiry.parentName}
                    onChange={e => setNewInquiry({ ...newInquiry, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    placeholder="e.g. Deepak Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newInquiry.phone}
                    onChange={e => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    placeholder="+91 98250 12345"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newInquiry.email}
                    onChange={e => setNewInquiry({ ...newInquiry, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                    placeholder="e.g. sharma.parent@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Target Class / Course
                  </label>
                  <select
                    value={newInquiry.targetClass}
                    onChange={e => setNewInquiry({ ...newInquiry, targetClass: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                  >
                    <option>Class 10 Foundation</option>
                    <option>Class 9 Boards</option>
                    <option>Class 8 Foundation</option>
                    <option>Class 11 Science (JEE/NEET)</option>
                    <option>Class 12 Science (Boards + Entrance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Inquiry Source
                  </label>
                  <select
                    value={newInquiry.source}
                    onChange={e => setNewInquiry({ ...newInquiry, source: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                  >
                    <option value="Website">Website Intake</option>
                    <option value="Walk-in">Walk-in Campus</option>
                    <option value="Referral">Student / Parent Referral</option>
                    <option value="Social Media">Social Media Campaign</option>
                    <option value="Education Expo">Education Expo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Lead Status
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Hot', 'Warm', 'Cold'] as const).map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setNewInquiry({ ...newInquiry, leadStatus: status })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          newInquiry.leadStatus === status
                            ? status === 'Hot'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                              : status === 'Warm'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                              : 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-[#f8fbff] border-[#d5e8f7] text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {status === 'Hot' && '🔥 Hot'}
                        {status === 'Warm' && '⚡ Warm'}
                        {status === 'Cold' && '❄️ Cold'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Assigned Counselor
                  </label>
                  <select
                    value={newInquiry.counselor}
                    onChange={e => setNewInquiry({ ...newInquiry, counselor: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                  >
                    <option value="Pooja Tanna">Pooja Tanna (Senior Counselor)</option>
                    <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Director)</option>
                    <option value="Anand Verma">Anand Verma (Admissions Head)</option>
                    <option value="Meera Iyer">Meera Iyer (Counseling Desk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                  Notes &amp; Remarks
                </label>
                <textarea
                  rows={2}
                  value={newInquiry.notes}
                  onChange={e => setNewInquiry({ ...newInquiry, notes: e.target.value })}
                  placeholder="e.g. Parent requested weekend demo class details and installment plan..."
                  className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-[#d5e8f7] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#d5e8f7] dark:border-slate-700 text-xs font-semibold text-[#5A7184] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-[0_4px_14px_rgba(219,39,119,0.25)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Admission Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
