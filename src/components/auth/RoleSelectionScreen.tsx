import React from 'react';
import {
  Shield,
  GraduationCap,
  Users,
  BookOpen,
  UserCircle,
  WifiOff,
  Languages,
  ChevronRight,
  Building2
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Role } from '../../types/ims';

interface RoleSelectionScreenProps {
  onSelectRole: (role: Role) => void;
}

const roles: {
  role: Role;
  icon: React.ElementType;
  color: string;
  bg: string;
  titleKey: 'roleAdmin' | 'roleTeacher' | 'roleParent' | 'roleStudent';
  descKey: 'roleAdminDesc' | 'roleTeacherDesc' | 'roleParentDesc' | 'roleStudentDesc';
}[] = [
  {
    role: 'ADMIN',
    icon: Building2,
    color: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200 hover:border-teal-400 hover:bg-teal-100',
    titleKey: 'roleAdmin',
    descKey: 'roleAdminDesc',
  },
  {
    role: 'TEACHER',
    icon: GraduationCap,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100',
    titleKey: 'roleTeacher',
    descKey: 'roleTeacherDesc',
  },
  {
    role: 'PARENT',
    icon: Users,
    color: 'text-rose-700',
    bg: 'bg-rose-50 border-rose-200 hover:border-rose-400 hover:bg-rose-100',
    titleKey: 'roleParent',
    descKey: 'roleParentDesc',
  },
  {
    role: 'STUDENT',
    icon: BookOpen,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:bg-amber-100',
    titleKey: 'roleStudent',
    descKey: 'roleStudentDesc',
  },
];

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f766e] via-[#0d9488] to-[#14b8a6] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-white/90">
          <WifiOff size={16} />
          <span className="text-xs font-medium">{t('offlineReady')}</span>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          <Languages size={16} />
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      <div className="px-6 pt-6 pb-8 text-center text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4 shadow-lg">
          <UserCircle size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t('appName')}</h1>
        <p className="text-teal-100 text-sm mt-1 font-medium">{t('appTagline')}</p>
        <p className="text-white/70 text-xs mt-1">{t('byCompany')}</p>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-6 pb-8 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">{t('welcomeTitle')}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t('welcomeSubtitle')}</p>
        </div>

        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          {t('selectRole')}
        </p>

        <div className="space-y-3">
          {roles.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.role}
                onClick={() => onSelectRole(item.role)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${item.bg}`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${item.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold ${item.color}`}>{t(item.titleKey)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t(item.descKey)}</div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
          {t('demoNote')}
        </p>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium tracking-wide">{t('poweredBy')}</p>
          <p className="text-sm font-bold text-teal-700 mt-0.5">ZENTRYX</p>
        </div>
      </div>
    </div>
  );
};
