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
  ClipboardList,
  Clock,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Layers,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';
import { AveriqLogo, AV_ACHIEVERS_LOGO, IMS_GRAD_LOGO } from './AveriqLogo';

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
  const { role: contextRole, isSidebarCollapsed, toggleSidebarCollapse } = useIMS();
  const effectiveRole = currentRole || contextRole;

  // Navigation Items customized precisely by role
  const getNavItems = () => {
    if (effectiveRole === 'STUDENT') {
      return [
        { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'stu', label: 'My Profile', icon: User },
        { id: 'cls', label: 'Subject and Classes', icon: Layers },
        { id: 'hw', label: 'Homework', icon: ClipboardList, badge: 'Pending' },
        { id: 'att', label: 'My Attendance', icon: CheckSquare },
        { id: 'evt', label: 'Event and Time table', icon: Calendar },
        { id: 'ex', label: 'Exams and Results', icon: Award },
        { id: 'mat', label: 'Study Materials', icon: BookOpen },
        { id: 'comm', label: 'Communications', icon: Megaphone, badge: '3' },
        { id: 'set', label: 'Settings', icon: Settings }
      ];
    }

    if (effectiveRole === 'PARENT') {
      return [
        { id: 'por', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'stu', label: 'My Children', icon: Users },
        { id: 'cls', label: 'Subject and Classes', icon: Layers },
        { id: 'hw', label: 'Homework', icon: ClipboardList },
        { id: 'att', label: 'Attendance Overview', icon: CheckSquare },
        { id: 'fee', label: 'Fee Summary', icon: CreditCard, badge: 'Pending' },
        { id: 'ex', label: 'Exams and Results', icon: Award },
        { id: 'evt', label: 'Event and Time table', icon: Calendar },
        { id: 'mat', label: 'Study Materials', icon: BookOpen },
        { id: 'comm', label: 'Communications', icon: Megaphone, badge: 'New' },
        { id: 'set', label: 'Settings', icon: Settings }
      ];
    }

    if (effectiveRole === 'TEACHER') {
      return [
        { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'cls', label: 'Subject and Classes', icon: Layers },
        { id: 'hw', label: 'Homework', icon: ClipboardList, badge: 'Active' },
        { id: 'att', label: 'Attendance Roll Call', icon: CheckSquare },
        { id: 'evt', label: 'Event and Time table', icon: Calendar },
        { id: 'ex', label: 'Exams and Results', icon: FileCheck },
        { id: 'mat', label: 'Study Materials', icon: BookOpen },
        { id: 'comm', label: 'Communications', icon: Megaphone },
        { id: 'stu', label: 'Student Directory', icon: Users, badge: '50' },
        { id: 'set', label: 'Settings', icon: Settings }
      ];
    }

    // Default: Administrator
    return [
      { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'cls', label: 'Subject and Classes', icon: Layers, badge: '12' },
      { id: 'stu', label: 'Students', icon: Users, badge: '50' },
      { id: 'tea', label: 'Teachers', icon: GraduationCap, badge: '5' },
      { id: 'hw', label: 'Homework', icon: ClipboardList, badge: '7' },
      { id: 'att', label: 'Attendance', icon: CheckSquare },
      { id: 'fee', label: 'Fees', icon: CreditCard },
      { id: 'ex', label: 'Exams and Results', icon: FileCheck },
      { id: 'evt', label: 'Event and Time table', icon: Calendar, badge: '10' },
      { id: 'mat', label: 'Study Materials', icon: BookOpen, badge: '48' },
      { id: 'comm', label: 'Communications', icon: Megaphone, badge: 'New' },
      { id: 'inq', label: 'Inquiries', icon: UserPlus, badge: 'New' },
      { id: 'roles', label: 'Roles and Permissions', icon: ShieldCheck },
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

      {/* Sidebar Container - Collapsible & Responsive */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0A192F] text-slate-300 flex flex-col justify-between border-r border-[#1E293B]/80 transition-all duration-300 ease-in-out shadow-2xl ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0 !w-64' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {/* 1. Header Area: Official AV Achievers Institute Logo + Single-Line "INSTITUTE MANAGEMENT SYSTEM" Subtitle */}
          <div
            className={`h-20 flex items-center border-b border-slate-800/80 bg-[#071324] transition-all duration-300 ${
              isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
            }`}
          >
            {isSidebarCollapsed ? (
              /* Collapsed Header: Centered Compact Logo only */
              <div className="flex items-center justify-center py-2" title="AV Achievers - Institute Management System">
                <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md ring-1 ring-white/20 overflow-hidden flex items-center justify-center">
                  <img
                    src={AV_ACHIEVERS_LOGO}
                    alt="AV Achievers"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              /* Expanded Header: Full Official AV Achievers Branding only */
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Official AV Achievers Logo Image */}
                  <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md ring-1 ring-white/20 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={AV_ACHIEVERS_LOGO}
                      alt="AV Achievers"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Primary Logo Text & Single-Line Subtitle */}
                  <div className="flex flex-col min-w-0 leading-tight">
                    <div className="flex items-center leading-none">
                      <span className="font-black text-[15px] sm:text-base tracking-tight text-white whitespace-nowrap">
                        AV <span className="text-[#F97316]">ACHIEVERS</span>
                      </span>
                    </div>
                    <div className="text-[9.5px] font-bold tracking-wider uppercase text-sky-300 whitespace-nowrap mt-1 leading-tight">
                      INSTITUTE MANAGEMENT SYSTEM
                    </div>
                  </div>
                </div>

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Navigation Links */}
          <div className={`py-4 transition-all duration-300 ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
            {!isSidebarCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>
                  {effectiveRole === 'STUDENT'
                    ? 'Student Menu'
                    : effectiveRole === 'PARENT'
                    ? 'Parent Navigation'
                    : effectiveRole === 'TEACHER'
                    ? 'Teacher Workspace'
                    : 'Administration'}
                </span>
                <span className="text-[9px] text-blue-400 font-normal">AV Achievers</span>
              </div>
            )}

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
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                        isSidebarCollapsed
                          ? 'justify-center p-3'
                          : 'gap-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-[#0056D6] text-white font-semibold shadow-md shadow-blue-700/40 ring-1 ring-blue-400/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                      }`}
                      aria-label={item.label}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                        }`}
                      />

                      {!isSidebarCollapsed && (
                        <>
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
                        </>
                      )}
                    </button>

                    {/* Floating Tooltip when Collapsed */}
                    {isSidebarCollapsed && (
                      <div className="fixed left-20 ml-2 hidden lg:group-hover:flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] border border-slate-700/90 text-white text-xs font-semibold rounded-xl shadow-2xl z-50 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] font-mono text-white">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0F172A] border-l border-b border-slate-700 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 3. Bottom Area: Help & Role Support Card */}
        <div className={`border-t border-slate-800/80 bg-[#071324] transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-3.5'}`}>
          {isSidebarCollapsed ? (
            /* Collapsed Bottom Action: Clean Help & Support icon with tooltip */
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={onOpenHelp}
                className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center justify-center transition-colors relative group"
                title="Need Help / Support"
                aria-label="Need Help"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <div className="fixed left-20 ml-2 hidden lg:group-hover:flex px-2.5 py-1 bg-[#0F172A] border border-slate-700 text-white text-xs rounded-lg shadow-xl z-50 whitespace-nowrap">
                  Help Desk &amp; Support
                </div>
              </button>
            </div>
          ) : (
            /* Expanded Bottom Card */
            <div className="space-y-2.5">
              {/* Role-specific motivation card */}
              {effectiveRole === 'STUDENT' ? (
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/70 to-slate-900/90 border border-blue-900/40 text-center space-y-1.5">
                  <div className="w-7 h-7 mx-auto rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Academic Journey</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      "Small steps make big progress. Keep going!"
                    </div>
                  </div>
                </div>
              ) : effectiveRole === 'PARENT' ? (
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border border-indigo-900/40 text-center space-y-2">
                  <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Parent Hub</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Together in your child's journey.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenHelp}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0056D6] hover:bg-blue-600 text-white transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Contact Institute Desk</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
                  <button
                    type="button"
                    onClick={onOpenHelp}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#0056D6] hover:bg-blue-600 text-white transition-colors shadow-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Need Help / Support</span>
                  </button>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Support Desk · 24/7 Assistance
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
