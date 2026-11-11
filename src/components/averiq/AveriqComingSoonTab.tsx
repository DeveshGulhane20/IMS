import React from 'react';
import { Clock, ArrowLeft, Database, ShieldAlert, Sparkles } from 'lucide-react';

interface AveriqComingSoonTabProps {
  tabId: string;
  onReturnToDashboard: () => void;
}

export const AveriqComingSoonTab: React.FC<AveriqComingSoonTabProps> = ({
  tabId,
  onReturnToDashboard
}) => {
  const formattedTitle = tabId
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-[24px] bg-white border border-[#D5E5F7] shadow-xl text-center space-y-5">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EBF3FC] text-[#3979C5] flex items-center justify-center shadow-inner">
        <Clock className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module In Development</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#122D4A]">
          {formattedTitle} Module
        </h2>
        <p className="text-xs sm:text-sm text-[#5A7184] max-w-md mx-auto leading-relaxed">
          This section is currently being provisioned. Backend schema migrations and dedicated database tables for this module have not yet been deployed to your Supabase project.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#F8FBFF] border border-[#E2EDF8] text-left text-xs space-y-2 max-w-lg mx-auto">
        <div className="flex items-center gap-2 font-bold text-[#173a5d]">
          <Database className="w-4 h-4 text-[#3979C5]" />
          <span>Database &amp; API Integration Status</span>
        </div>
        <p className="text-[11px] text-[#5A7184]">
          • Route Parameter: <code className="font-mono text-[#3979C5] bg-blue-50 px-1 py-0.5 rounded">/{tabId}</code>
        </p>
        <p className="text-[11px] text-[#5A7184]">
          • Supabase Table: <span className="text-amber-700 font-medium">Pending migration execution</span>
        </p>
        <p className="text-[11px] text-[#5A7184]">
          • Row-Level Security: <span className="text-emerald-700 font-medium">Strict RLS rules enforced</span>
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onReturnToDashboard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3979C5] hover:bg-[#205BA3] text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
