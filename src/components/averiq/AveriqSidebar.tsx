import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CheckSquare,
  CreditCard,
  FileCheck,
  UserPlus,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  User,
  BookOpen,
  Calendar,
  Bell,
  Award,
  MessageSquare,
  Flame,
  Sparkles,
  ClipboardList,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';
import { AveriqLogo } from './AveriqLogo';

export interface AveriqSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenHelp: () => void;
  currentRole?: string;
}

export const AveriqSidebar: React.FC<AveriqSidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  onOpenHelp,
  currentRole
}) => {
  const { role: contextRole } = useIMS();
  const effectiveRole = currentRole || contextRole;

  // Navigation Items customized precisely by role as requested
  const getNavItems = () => {
    if (effectiveRole === 'STUDENT') {
      return [
        { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'stu', label: 'My Profile', icon: User },
        { id: 'att', label: 'My Attendance', icon: CheckSquare },
        { id: 'tb', label: 'My Timetable', icon: Clock },
        { id: 'mk', label: 'My Results', icon: Award },
        { id: 'mat', label: 'Study Material', icon: BookOpen },
        { id: 'ex', label: 'My Assignments', icon: ClipboardList, badge: '2' },
        { id: 'notif', label: 'Notifications', icon: Bell, badge: '3' },
        { id: 'cal', label: 'Calendar', icon: Calendar },
        { id: 'set', label: 'Settings', icon: Settings }
      ];
    }

    if (effectiveRole === 'PARENT') {
      return [
        { id: 'por', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'stu', label: 'My Children', icon: Users },
        { id: 'att', label: 'Attendance Overview', icon: CheckSquare },
        { id: 'fee', label: 'Fee Summary', icon: CreditCard, badge: 'Pending' },
        { id: 'mk', label: 'Results & Progress', icon: Award },
        { id: 'tb', label: 'Timetable', icon: Clock },
        { id: 'inq', label: 'Messages', icon: MessageSquare },
        { id: 'ptm', label: 'Notices', icon: Bell, badge: 'New' },
        { id: 'set', label: 'Settings', icon: Settings }
      ];
    }

    // Default: Admin / Teacher
    return [
      { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'stu', label: 'Students', icon: Users, badge: '50' },
      { id: 'tea', label: 'Teachers', icon: GraduationCap, badge: '5' },
      { id: 'att', label: 'Attendance', icon: CheckSquare },
      { id: 'fee', label: 'Fees', icon: CreditCard },
      { id: 'ex', label: 'Exams & Semesters', icon: FileCheck },
      { id: 'inq', label: 'Inquiries', icon: UserPlus, badge: 'New' },
      { id: 'evt', label: 'Events & Calendar', icon: Calendar, badge: '10' },
      { id: 'rep', label: 'Reports & Analytics', icon: BarChart3 },
      { id: 'set', label: 'Settings', icon: Settings }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container - Deep Navy Blue Averiq Design */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A192F] text-slate-300 flex flex-col justify-between border-r border-[#1E293B]/70 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          {/* Logo Header Area with signature Averiq Blue Ribbon */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#071324]">
            <AveriqLogo
              className="w-8 h-8"
              showText={true}
              textColor="text-white"
              subtextColor="text-blue-400"
              tagline={
                effectiveRole === 'STUDENT'
                  ? 'Student Portal'
                  : effectiveRole === 'PARENT'
                  ? 'Parent Portal'
                  : 'Intelligence in every solution'
              }
            />

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {effectiveRole === 'STUDENT'
                ? 'Student Menu'
                : effectiveRole === 'PARENT'
                ? 'Parent Navigation'
                : 'Main Navigation'}
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive =
                  (item.id === 'dash' && activeTab === 'dash') ||
                  (item.id === 'por' && (activeTab === 'por' || activeTab === 'dash')) ||
                  activeTab === item.id ||
                  (item.id === 'rep' && (activeTab === 'mk' || activeTab === 'pf')) ||
                  (item.id === 'set' && (activeTab === 'usr' || activeTab === 'crs' || activeTab === 'fin'));

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#0056D6] text-white font-semibold shadow-md shadow-blue-700/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full border ${
                          item.badge === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : item.badge === 'New'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Card customized by role */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#071324]">
          {effectiveRole === 'STUDENT' ? (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/70 to-slate-900/90 border border-blue-900/40 text-center space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Learning Momentum</div>
                <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  "Small steps make big progress. Keep going!"
                </div>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-medium">
                © 2026 Averiq Student Portal
              </div>
            </div>
          ) : effectiveRole === 'PARENT' ? (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border border-indigo-900/40 text-center space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Parent Partnership</div>
                <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Together in your child's journey.
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenHelp}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0056D6] hover:bg-blue-600 text-white transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact School Desk</span>
              </button>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                © 2026 Averiq Parent Portal
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-white p-1 border border-slate-700/60 shadow-xs flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/aistudio/Averiq_Intelligence_Logo_f607a30d.png"
                  alt="AVERIQ - Intelligence in every solution"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wide">AVERIQ IMS</div>
                <div className="text-[10px] text-blue-400 font-medium">Intelligence in every solution</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Institution Management System</div>
              </div>
              <button
                type="button"
                onClick={onOpenHelp}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0056D6] hover:bg-blue-600 text-white transition-colors shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need Help?</span>
              </button>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                © 2026 AVERIQ. All rights reserved.
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
