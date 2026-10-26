import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import { Role } from '../../types/ims';
import {
  Smartphone,
  Moon,
  Sun,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Briefcase,
  Users,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface TopHeaderProps {
  currentSection: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ currentSection }) => {
  const {
    role,
    setRole,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    isMobilePreviewOpen,
    setMobilePreviewOpen,
    institute
  } = useIMS();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const personas: { role: Role; name: string; title: string; icon: any }[] = [
    {
      role: 'SUPER_ADMIN',
      name: 'Dr. Arvind Sharma',
      title: 'Chancellor & Trustee',
      icon: ShieldCheck
    },
    {
      role: 'ADMIN',
      name: 'Rachel Vance',
      title: 'Operations Director',
      icon: Building2
    },
    {
      role: 'TEACHER',
      name: 'Prof. Vikram Nair',
      title: 'Physics & Calculus Faculty Lead',
      icon: Briefcase
    },
    {
      role: 'STUDENT',
      name: 'Aarav Patel',
      title: 'Grade 11 - STEM Scholar (Roll #1104)',
      icon: GraduationCap
    },
    {
      role: 'PARENT',
      name: 'Meera Patel',
      title: 'Guardian (Parent of Aarav)',
      icon: Users
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#111C44]/95 backdrop-blur px-6 flex items-center justify-between gap-8">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            IMS
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            {institute.name}
          </span>
        </a>
      </div>

      {/* Zone 2: Breadcrumb trail */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
        <span>Portal</span>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
          {role.toLowerCase().replace('_', ' ')}
        </span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">{currentSection}</span>
      </div>

      {/* Zone 3: Actions + Persona Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile App Simulator Toggle */}
        <button
          type="button"
          onClick={() => setMobilePreviewOpen(!isMobilePreviewOpen)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            isMobilePreviewOpen
              ? 'bg-teal-50 border-teal-300 text-teal-800 dark:bg-teal-950/40 dark:border-teal-700 dark:text-teal-300'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="Open simulated React Native / Expo mobile screen"
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="hidden sm:inline">Mobile Screen Preview</span>
        </button>

        {/* Dark Mode */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Active Persona Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {role.replace('_', ' ')}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isPersonaMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] shadow-xl p-2 z-50 text-xs"
              onClick={() => setIsPersonaMenuOpen(false)}
            >
              <div className="px-3 py-2 text-[11px] font-medium text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Role / Live Persona
              </div>
              <div className="mt-1 space-y-1">
                {personas.map(p => {
                  const Icon = p.icon;
                  const isCurrent = p.role === role;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => setRole(p.role)}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 mt-0.5 text-[#1E3A8A] dark:text-teal-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] text-emerald-600 font-mono font-medium">(Active)</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {p.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
