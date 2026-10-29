import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Send,
  Bell,
  Megaphone,
  Smartphone,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Filter,
  Search,
  Plus,
  X,
  Share2,
  CheckCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

interface NoticeItem {
  id: string;
  title: string;
  type: 'Circular' | 'SMS Blast' | 'WhatsApp Alert' | 'Emergency';
  targetAudience: 'All Parents' | 'All Students' | 'Class 10' | 'Faculty' | 'Defaulters';
  sender: string;
  date: string;
  time: string;
  readCount: number;
  totalRecipients: number;
  urgency: 'Normal' | 'High' | 'Critical';
  content: string;
  attachmentName?: string;
}

export const AveriqCommunications: React.FC = () => {
  const { showToast } = useIMS();
  const [activeTab, setActiveTab] = useState<'notices' | 'sms' | 'chat'>('notices');
  const [filterAudience, setFilterAudience] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState<boolean>(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  // New Notice Compose Form
  const [composeForm, setComposeForm] = useState({
    title: '',
    type: 'Circular' as NoticeItem['type'],
    targetAudience: 'All Parents' as NoticeItem['targetAudience'],
    urgency: 'Normal' as NoticeItem['urgency'],
    content: '',
    sendSmsCopy: true,
    sendWhatsAppCopy: true
  });

  const [noticesList, setNoticesList] = useState<NoticeItem[]>([
    {
      id: 'notif-001',
      title: 'Term 2 Mandatory Parent-Teacher Meeting (PTM) Schedule',
      type: 'Circular',
      targetAudience: 'All Parents',
      sender: 'Office of the Principal (AV Achievers)',
      date: '28 Oct 2026',
      time: '10:30 AM',
      readCount: 46,
      totalRecipients: 50,
      urgency: 'High',
      content: 'Dear Parents & Guardians, the Term 2 Academic Review and Parent-Teacher Meeting is scheduled for Saturday, 15 November 2026, between 09:00 AM and 01:30 PM. Individual slot allocations have been mailed. Please carry your child’s identity card.',
      attachmentName: 'PTM_Slot_Schedule_2026.pdf'
    },
    {
      id: 'notif-002',
      title: 'Mathematics Unit Test 5 Schedule & Syllabus Release',
      type: 'Circular',
      targetAudience: 'Class 10',
      sender: 'Prof. Rajesh Sharma (Head of Mathematics)',
      date: '26 Oct 2026',
      time: '02:15 PM',
      readCount: 48,
      totalRecipients: 50,
      urgency: 'Normal',
      content: 'Unit Test 5 on Chapter 5 Quadratic Equations and Arithmetic Progressions will be conducted on Wednesday, 12 November 2026. Maximum marks: 50. Reporting time: 08:30 AM sharp in Examination Hall A.',
      attachmentName: 'Math_UT5_BluePrint.pdf'
    },
    {
      id: 'notif-003',
      title: 'Quarter 3 Tuition Fee Payment Reminder & Grace Period',
      type: 'WhatsApp Alert',
      targetAudience: 'Defaulters',
      sender: 'Accounts Department',
      date: '24 Oct 2026',
      time: '11:00 AM',
      readCount: 12,
      totalRecipients: 14,
      urgency: 'High',
      content: 'Gentle reminder: The Q3 tuition installment due date was 20 October. A 7-day grace period is active till 31 October without late fines. Please pay via UPI or netbanking through the Parent Portal.',
      attachmentName: 'Fee_Receipt_Guidelines.pdf'
    },
    {
      id: 'notif-004',
      title: 'Annual Science Fair & Robotic Innovation Competition',
      type: 'Circular',
      targetAudience: 'All Students',
      sender: 'Science & Innovation Council',
      date: '20 Oct 2026',
      time: '04:00 PM',
      readCount: 50,
      totalRecipients: 50,
      urgency: 'Normal',
      content: 'AV Achievers Annual Science Fair 2026 will be hosted on 28 November 2026. Working models, AI automation projects, and renewable energy experiments are invited. Submit project abstracts to Dr. Neha Kulkarni by 5 November.',
      attachmentName: 'ScienceFair_Brochure.pdf'
    },
    {
      id: 'notif-005',
      title: 'Winter Uniform & Morning Assembly Timing Revision',
      type: 'Circular',
      targetAudience: 'All Parents',
      sender: 'Administration Office',
      date: '15 Oct 2026',
      time: '09:00 AM',
      readCount: 47,
      totalRecipients: 50,
      urgency: 'Normal',
      content: 'Effective 1 November 2026, students must wear the official navy blue winter blazers. School gates will open at 08:00 AM, and morning assembly will commence at 08:20 AM.',
      attachmentName: 'Uniform_Guidelines_2026.pdf'
    },
    {
      id: 'notif-006',
      title: 'Heavy Rainfall Alert & Safe Dispersal Notice',
      type: 'Emergency',
      targetAudience: 'All Parents',
      sender: 'Disaster Management Cell',
      date: '10 Oct 2026',
      time: '12:45 PM',
      readCount: 50,
      totalRecipients: 50,
      urgency: 'Critical',
      content: 'Due to severe weather warnings issued by local authorities, afternoon classes have been suspended. School transport buses have departed with faculty escorts. All students have been safely accounted for.'
    }
  ]);

  // Filtered Notices
  const filteredNotices = useMemo(() => {
    return noticesList.filter(n => {
      const matchAudience = filterAudience === 'All' || n.targetAudience === filterAudience;
      const matchSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sender.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAudience && matchSearch;
    });
  }, [noticesList, filterAudience, searchQuery]);

  // Handle Compose Submit
  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.title.trim() || !composeForm.content.trim()) {
      showToast('Please enter both title and notification body.');
      return;
    }

    const newNotice: NoticeItem = {
      id: `notif-${Date.now()}`,
      title: composeForm.title,
      type: composeForm.type,
      targetAudience: composeForm.targetAudience,
      sender: 'Principal / Admin Office',
      date: 'Just now',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      readCount: 1,
      totalRecipients: 50,
      urgency: composeForm.urgency,
      content: composeForm.content
    };

    setNoticesList([newNotice, ...noticesList]);
    setIsComposeModalOpen(false);
    setComposeForm({
      title: '',
      type: 'Circular',
      targetAudience: 'All Parents',
      urgency: 'Normal',
      content: '',
      sendSmsCopy: true,
      sendWhatsAppCopy: true
    });

    showToast(`Notice broadcast sent to ${newNotice.targetAudience} successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0E2442] to-[#0A192F] rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-400 font-mono font-bold text-xs uppercase tracking-wider border border-sky-500/30">
              Unified Communications Hub
            </span>
            <span className="text-xs text-slate-400">AV Achievers Network</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-sky-400" />
            <span>Communications & Broadcast Center</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Broadcast institutional circulars, SMS alerts, WhatsApp reminders, and parent-teacher updates in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsComposeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-all active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Notice</span>
        </button>
      </div>

      {/* 2. Communication Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Broadcasts</span>
            <Megaphone className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {noticesList.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Delivered</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Parent Open Rate</span>
            <CheckCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            94.2%
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">47 / 50 Parents Active</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>WhatsApp / SMS Gateway</span>
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            Operational
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">0.8s avg delivery latency</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Urgent Circulars</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2 font-mono">
            {noticesList.filter(n => n.urgency === 'High' || n.urgency === 'Critical').length}
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-1">High priority status</div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars, SMS keywords, sender, or content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Audience:</span>
          {['All', 'All Parents', 'All Students', 'Class 10', 'Defaulters'].map(aud => (
            <button
              key={aud}
              type="button"
              onClick={() => setFilterAudience(aud)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterAudience === aud
                  ? 'bg-[#0056D6] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {aud}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Notices & Broadcasts List */}
      <div className="space-y-3">
        {filteredNotices.map(notice => (
          <div
            key={notice.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-400/80 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    notice.type === 'Emergency'
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      : notice.type === 'WhatsApp Alert'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {notice.type}
                </span>

                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                  To: {notice.targetAudience}
                </span>

                {notice.urgency !== 'Normal' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold uppercase">
                    {notice.urgency} Priority
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{notice.date}</span>
                <span>•</span>
                <span>{notice.time}</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {notice.title}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {notice.content}
              </p>
            </div>

            {notice.attachmentName && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
                <FileText className="w-3.5 h-3.5" />
                <span>{notice.attachmentName}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>Author: <strong className="text-slate-800 dark:text-slate-200">{notice.sender}</strong></span>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-mono text-emerald-600">
                  <CheckCheck className="w-4 h-4" />
                  <span>Read by {notice.readCount} of {notice.totalRecipients} ({Math.round((notice.readCount / notice.totalRecipients) * 100)}%)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`SMS / WhatsApp resend triggered for "${notice.title}"`);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Resend Alert</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Compose Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Broadcast New Institutional Notice</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsComposeModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Pre-Board Examination Revision Classes"
                  value={composeForm.title}
                  onChange={e => setComposeForm({ ...composeForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Broadcast Channel</label>
                  <select
                    value={composeForm.type}
                    onChange={e => setComposeForm({ ...composeForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Circular">Official Circular</option>
                    <option value="WhatsApp Alert">WhatsApp Alert</option>
                    <option value="SMS Blast">SMS Blast</option>
                    <option value="Emergency">Emergency Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Target Audience</label>
                  <select
                    value={composeForm.targetAudience}
                    onChange={e => setComposeForm({ ...composeForm, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="All Parents">All Parents (50)</option>
                    <option value="All Students">All Students (50)</option>
                    <option value="Class 10">Class 10 Students & Parents</option>
                    <option value="Faculty">Teaching Staff & HODs</option>
                    <option value="Defaulters">Fee Defaulters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Urgency Level</label>
                <div className="flex items-center gap-3">
                  {(['Normal', 'High', 'Critical'] as const).map(u => (
                    <label key={u} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={composeForm.urgency === u}
                        onChange={() => setComposeForm({ ...composeForm, urgency: u })}
                        className="text-blue-600"
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{u}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the message body clearly. Include dates, timings, and instructions..."
                  value={composeForm.content}
                  onChange={e => setComposeForm({ ...composeForm, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={composeForm.sendWhatsAppCopy}
                    onChange={e => setComposeForm({ ...composeForm, sendWhatsAppCopy: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Send instant WhatsApp Notification to registered parent phone numbers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={composeForm.sendSmsCopy}
                    onChange={e => setComposeForm({ ...composeForm, sendSmsCopy: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Send standard SMS text broadcast</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-bold"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
