import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  ShieldCheck,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

interface AveriqTenantSwitcherProps {
  onOpenSuperAdmin?: () => void;
  className?: string;
  variant?: 'navbar' | 'compact' | 'card';
}

export const AveriqTenantSwitcher: React.FC<AveriqTenantSwitcherProps> = ({
  onOpenSuperAdmin,
  className = '',
  variant = 'navbar'
}) => {
  const {
    institutes,
    activeInstituteId,
    activeInstitute,
    switchInstitute,
    role,
    setRole,
    showToast
  } = useIMS();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectInstitute = (instId: string) => {
    switchInstitute(instId);
    setIsOpen(false);
    const target = institutes.find(i => i.id === instId);
    showToast(`Switched active tenant to "${target?.name || 'Institute'}"`);
  };

  const handleGoToSuperAdmin = () => {
    setIsOpen(false);
    setRole('SUPER_ADMIN');
    if (onOpenSuperAdmin) {
      onOpenSuperAdmin();
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Switcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F223D] hover:bg-[#152B4D] border border-blue-900/60 hover:border-blue-700/80 transition-all text-left cursor-pointer group"
        title="Switch Active Institution Tenant"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <Building2 className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white truncate max-w-[130px] sm:max-w-[170px]">
              {activeInstitute?.name || 'AV Achievers'}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 font-bold hidden sm:inline-block">
              {activeInstitute?.code || 'AVA-101'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate">
            {activeInstitute?.board || 'CBSE'} • {activeInstitute?.type?.split(' ')[0] || 'School'}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0A192F] border border-slate-700/90 shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
          style={{ boxShadow: '0 20px 45px rgba(0,0,0,0.5)' }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Institute Tenants ({institutes.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
              Multi-Tenant Cloud
            </span>
          </div>

          {/* Institute List */}
          <div className="py-1.5 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            {institutes.map((inst) => {
              const isSelected = inst.id === activeInstituteId;
              return (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => handleSelectInstitute(inst.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                      : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs truncate">
                          {inst.name}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {inst.code} • {inst.board}
                      </div>
                      <div className="text-[10px] text-blue-400 font-mono truncate">
                        {inst.subdomain || `${inst.code.toLowerCase()}.averiq.edu`}
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 hover:text-slate-300 font-medium shrink-0 mt-1">
                      Switch →
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Super Admin Control Center Quick Link */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleGoToSuperAdmin}
              className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-blue-950/40 hover:from-amber-900/50 hover:to-blue-900/50 border border-amber-600/30 text-amber-300 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs">Super Admin HQ &amp; Provisioning</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
