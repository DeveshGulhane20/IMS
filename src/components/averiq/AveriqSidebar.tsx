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
  Shield,
  X
} from 'lucide-react';

export type AveriqTabId =
  | 'dash'
  | 'stu'
  | 'tea'
  | 'att'
  | 'fee'
  | 'ex'
  | 'inq'
  | 'rep'
  | 'set';

interface AveriqSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenHelp: () => void;
}

export const AveriqSidebar: React.FC<AveriqSidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  onOpenHelp
}) => {
  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stu', label: 'Students', icon: Users },
    { id: 'tea', label: 'Teachers', icon: GraduationCap },
    { id: 'att', label: 'Attendance', icon: CheckSquare },
    { id: 'fee', label: 'Fees', icon: CreditCard },
    { id: 'ex', label: 'Exams', icon: FileCheck },
    { id: 'inq', label: 'Inquiries', icon: UserPlus },
    { id: 'rep', label: 'Reports', icon: BarChart3 },
    { id: 'set', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B132B] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Header Area */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-[#090F24]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Shield className="w-5 h-5 fill-white/20 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-wider leading-none">
                  AVERTQ
                </span>
                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold mt-0.5">
                  School OS
                </span>
              </div>
            </div>

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
          <div className="px-3 py-5">
            <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Main Menu
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'rep' && (activeTab === 'mk' || activeTab === 'pf')) ||
                  (item.id === 'set' && (activeTab === 'usr' || activeTab === 'crs' || activeTab === 'fin')) ||
                  (item.id === 'tea' && activeTab === 'tea');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.id === 'inq' && (
                      <span className="ml-auto text-[10px] font-semibold font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                        New
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom School Branding & Help Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090F24]">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Averiq High School</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Smart School Management</div>
            </div>
            <button
              type="button"
              onClick={onOpenHelp}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need Help?</span>
            </button>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
              © 2026 Averiq Inc. All rights reserved.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
