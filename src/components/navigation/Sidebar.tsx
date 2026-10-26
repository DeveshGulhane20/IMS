import React from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  LayoutDashboard,
  Building,
  FileText,
  Users,
  GraduationCap,
  CalendarDays,
  CreditCard,
  Bell,
  CheckSquare,
  BarChart3,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  History
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { role, performanceAlerts } = useIMS();

  const getNavItems = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
          { id: 'institutes', label: 'Branches & Campuses', icon: Building },
          { id: 'audit-logs', label: 'System Audit Trail', icon: History }
        ];
      case 'ADMIN':
        const unresolvedAlertCount = performanceAlerts.filter(a => !a.isResolved).length;
        return [
          { id: 'dashboard', label: 'Operations Hub', icon: LayoutDashboard, badge: unresolvedAlertCount > 0 ? unresolvedAlertCount : undefined },
          { id: 'students', label: 'Student Directory', icon: GraduationCap },
          { id: 'teachers', label: 'Faculty Management', icon: Users },
          { id: 'batches', label: 'Batches & Timetable', icon: CalendarDays },
          { id: 'fees', label: 'Fee Management', icon: CreditCard },
          { id: 'notices', label: 'Notice Center', icon: Bell }
        ];
      case 'TEACHER':
        return [
          { id: 'dashboard', label: 'Teacher Workspace', icon: LayoutDashboard },
          { id: 'attendance', label: 'Daily Roll Call', icon: CheckSquare },
          { id: 'marks', label: 'Gradebook & Tests', icon: BarChart3 },
          { id: 'homework', label: 'Homework Manager', icon: BookOpen },
          { id: 'remediation', label: 'Remediation Plans', icon: Sparkles }
        ];
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Learning Dashboard', icon: LayoutDashboard },
          { id: 'performance', label: 'Performance Analytics', icon: BarChart3 },
          { id: 'homework', label: 'Homework & Tasks', icon: BookOpen },
          { id: 'timeline', label: 'Journey Timeline', icon: Award }
        ];
      case 'PARENT':
        return [
          { id: 'dashboard', label: 'Ward Overview', icon: LayoutDashboard },
          { id: 'reports', label: 'Academic Diagnostics', icon: BarChart3 },
          { id: 'fees', label: 'Fee Ledger & Pay', icon: CreditCard }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] min-h-[calc(100vh-3.5rem)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {role.replace('_', ' ')} Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Campus Info Widget in Sidebar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#0D9488]" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">ANIST Core Engine</span>
        </div>
        <div className="mt-1 text-[11px] font-mono text-slate-400">
          PostgreSQL 15 · RBAC Active
        </div>
      </div>
    </aside>
  );
};
