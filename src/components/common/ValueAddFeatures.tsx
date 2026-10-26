import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { MessageCircle, Share2, IndianRupee, CheckCircle2, Copy } from 'lucide-react';

export const WhatsAppFeeReminders: React.FC = () => {
  const { students, getStudentBalance, showToast } = useIMS();
  const { language } = useLanguage();
  const [sent, setSent] = useState<string[]>([]);

  const defaulters = students
    .map(s => ({ ...s, balance: getStudentBalance(s.name) }))
    .filter(s => s.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const sendWhatsApp = (student: typeof defaulters[0]) => {
    const msg =
      language === 'hi'
        ? `नमस्ते ${student.parentName || 'अभिभावक'},\n\n${student.name} की फीस ₹${student.balance.toLocaleString('en-IN')} बकाया है।\nकृपया जल्द से जल्द भुगतान करें।\n\nधन्यवाद,\nSunrise Coaching Institute\n(IMS by ZENTRYX)`
        : `Hello ${student.parentName || 'Parent'},\n\nFee reminder for ${student.name}:\nPending amount: ₹${student.balance.toLocaleString('en-IN')}\n\nPlease clear the dues at the earliest.\n\nThank you,\nSunrise Coaching Institute\n(IMS by ZENTRYX)`;

    const phone = (student.phone || '').replace(/\D/g, '');
    const url = `https://wa.me/91${phone.slice(-10)}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setSent(prev => [...prev, student.id]);
    showToast(language === 'hi' ? 'WhatsApp खोला गया' : 'WhatsApp opened');
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold text-sm">
              {language === 'hi' ? 'WhatsApp फीस रिमाइंडर' : 'WhatsApp Fee Reminders'}
            </h3>
            <p className="text-[11px] opacity-90">
              {language === 'hi' ? 'एक टैप में अभिभावकों को याद दिलाएँ' : 'Remind parents in one tap'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {defaulters.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            {language === 'hi' ? 'कोई बकाया नहीं!' : 'No pending fees!'}
          </div>
        ) : (
          defaulters.slice(0, 5).map(s => (
            <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 font-bold text-sm">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{s.name}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  {s.balance.toLocaleString('en-IN')} pending
                </div>
              </div>
              <button
                type="button"
                onClick={() => sendWhatsApp(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                  sent.includes(s.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 text-white shadow-sm'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {sent.includes(s.id) ? 'Sent' : 'WhatsApp'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const DailySnapshotCard: React.FC = () => {
  const { students, attendanceRecords, getStudentBalance, tests, showToast } = useIMS();
  const { language } = useLanguage();

  const today = new Date().toISOString().split('T')[0];
  const todayAtt = attendanceRecords.filter(a => a.date === today);
  const presentToday = todayAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const totalActive = students.filter(s => s.status === 'Active').length;
  const attPct = todayAtt.length > 0 ? Math.round((presentToday / todayAtt.length) * 100) : 0;
  const totalPending = students.reduce((sum, s) => sum + getStudentBalance(s.name), 0);
  const atRisk = students.filter(s => {
    const bal = getStudentBalance(s.name);
    const att = attendanceRecords.filter(a => a.studentName === s.name);
    const p = att.filter(a => a.status === 'PRESENT').length;
    const pct = att.length ? (p / att.length) * 100 : 100;
    return bal > 5000 || pct < 75;
  }).length;

  const snapshotText =
    language === 'hi'
      ? `📊 IMS डेली स्नैपशॉट – ${new Date().toLocaleDateString('hi-IN')}\n\n✅ आज उपस्थिति: ${presentToday}/${todayAtt.length || totalActive} (${attPct}%)\n💰 बकाया फीस: ₹${totalPending.toLocaleString('en-IN')}\n⚠️ जोखिम वाले छात्र: ${atRisk}\n📝 आगामी टेस्ट: ${tests.filter(t => t.testDate >= today).length}\n\n— IMS by ZENTRYX`
      : `📊 IMS Daily Snapshot – ${new Date().toLocaleDateString('en-IN')}\n\n✅ Today's Attendance: ${presentToday}/${todayAtt.length || totalActive} (${attPct}%)\n💰 Pending Fees: ₹${totalPending.toLocaleString('en-IN')}\n⚠️ At-Risk Students: ${atRisk}\n📝 Upcoming Tests: ${tests.filter(t => t.testDate >= today).length}\n\n— IMS by ZENTRYX`;

  const copySnapshot = () => {
    navigator.clipboard.writeText(snapshotText);
    showToast(language === 'hi' ? 'कॉपी हो गया!' : 'Copied to clipboard!');
  };

  const shareSnapshot = () => {
    if (navigator.share) {
      navigator.share({ title: 'IMS Daily Snapshot', text: snapshotText });
    } else {
      copySnapshot();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          <div>
            <h3 className="font-semibold text-sm">
              {language === 'hi' ? 'डेली स्नैपशॉट' : 'Daily Snapshot'}
            </h3>
            <p className="text-[11px] opacity-90">
              {language === 'hi' ? 'मालिक को भेजने योग्य रिपोर्ट' : 'Shareable report for owner'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{attPct}%</div>
            <div className="text-[10px] text-emerald-600/80 uppercase tracking-wide mt-0.5">Attendance</div>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3 text-center">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">₹{(totalPending / 1000).toFixed(0)}k</div>
            <div className="text-[10px] text-amber-600/80 uppercase tracking-wide mt-0.5">Pending</div>
          </div>
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-3 text-center">
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">{atRisk}</div>
            <div className="text-[10px] text-rose-600/80 uppercase tracking-wide mt-0.5">At Risk</div>
          </div>
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 p-3 text-center">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{tests.filter(t => t.testDate >= today).length}</div>
            <div className="text-[10px] text-indigo-600/80 uppercase tracking-wide mt-0.5">Tests</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={copySnapshot} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold active:scale-95">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
          <button type="button" onClick={shareSnapshot} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm active:scale-95">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};
