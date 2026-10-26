import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Maximize2,
  Minimize2,
  ChevronDown,
  Menu,
  Shield,
  Smartphone,
  LogOut,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';
import { Role } from '../../types/ims';

interface AveriqTopNavProps {
  onToggleMobileSidebar: () => void;
  onNavigateTab: (tabId: string) => void;
  onSwitchRole?: () => void;
}

export const AveriqTopNav: React.FC<AveriqTopNavProps> = ({
  onToggleMobileSidebar,
  onNavigateTab,
  onSwitchRole,
}) => {
  const {
    role,
    setRole,
    currentUser,
    isMobilePreviewOpen,
    setMobilePreviewOpen,
    students,
    teachers,
    inquiries,
    tests,
    feePayments
  } = useIMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Filtered search results
  const matchingStudents = searchQuery.trim()
    ? students
        .filter(s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.batchName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const matchingTeachers = searchQuery.trim()
    ? teachers
        .filter(t =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.specialization.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 2)
    : [];

  const matchingInquiries = searchQuery.trim()
    ? inquiries
        .filter(i =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.course.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 2)
    : [];

  const hasSearchResults =
    matchingStudents.length > 0 ||
    matchingTeachers.length > 0 ||
    matchingInquiries.length > 0;

  const sampleNotifications = [
    {
      id: 1,
      title: 'Fee Payment Received',
      desc: '₹12,000 paid by Diya Sharma via UPI',
      time: '12m ago',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 2,
      title: 'Parent Teacher Meeting',
      desc: 'Scheduled for 28 May at 10:00 AM',
      time: '1h ago',
      icon: Calendar,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      id: 3,
      title: 'Pending Fee Alert',
      desc: '32 students have fees due this week',
      time: '3h ago',
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-500/10'
    },
    {
      id: 4,
      title: 'New Student Inquiry',
      desc: 'Kavita Verma inquired for Class 11 Science',
      time: '5h ago',
      icon: Bell,
      color: 'text-purple-400 bg-purple-500/10'
    }
  ];

  const rolesList: { role: Role; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'School Admin', desc: 'Rachel Vance' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Trustee / Board' },
    { role: 'TEACHER', label: 'Faculty Lead', desc: 'Prof. Vikram Nair' },
    { role: 'STUDENT', label: 'Student Portal', desc: 'Aarav Patel' },
    { role: 'PARENT', label: 'Parent Portal', desc: 'Meera Patel' }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B132B] border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between gap-4 text-white">
      {/* Left Area: Mobile Menu Trigger + School Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Shield className="w-4 h-4 fill-white/20" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-base tracking-wider text-white leading-tight">
              AVERTQ
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              School Management System
            </span>
          </div>
        </div>
      </div>

      {/* Center Area: Global Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-2 sm:mx-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search students, staff, fees, etc..."
            className="w-full bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs">
            {hasSearchResults ? (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {matchingStudents.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Students
                    </div>
                    {matchingStudents.map(student => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab('stu');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-white">{student.name}</span>
                        <span className="text-[11px] text-slate-400">Class {student.batchName}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingTeachers.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Teachers
                    </div>
                    {matchingTeachers.map(teacher => (
                      <button
                        key={teacher.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab('tea');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-white">{teacher.name}</span>
                        <span className="text-[11px] text-slate-400">{teacher.specialization}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingInquiries.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Inquiries
                    </div>
                    {matchingInquiries.map(inq => (
                      <button
                        key={inq.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab('inq');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-white">{inq.name}</span>
                        <span className="text-[11px] text-amber-400">{inq.course}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400">
                No students or staff found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Area: Fullscreen, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors hidden sm:flex items-center justify-center"
          title={isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors relative"
            title="School Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0B132B]">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-bold text-white text-sm">Notifications</span>
                {unreadNotifications > 0 && (
                  <button
                    type="button"
                    onClick={() => setUnreadNotifications(0)}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {sampleNotifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors flex items-start gap-3"
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-white">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('rep');
                    setIsNotificationsOpen(false);
                  }}
                  className="text-xs text-blue-400 font-medium hover:underline"
                >
                  View All School Notices
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Administrator Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/30 shrink-0">
              {currentUser.firstName?.[0] || 'A'}
              {currentUser.lastName?.[0] || 'D'}
            </div>
            <div className="hidden md:block leading-tight text-left">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>{currentUser.firstName || 'Rachel'} {currentUser.lastName || 'Vance'}</span>
              </div>
              <div className="text-[10px] text-blue-400 font-medium">
                {role === 'ADMIN' ? 'Administrator' : role.replace('_', ' ')}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs">
              <div className="p-3 border-b border-slate-800">
                <div className="font-bold text-white text-sm">
                  {currentUser.firstName || 'Rachel'} {currentUser.lastName || 'Vance'}
                </div>
                <div className="text-slate-400 text-[11px]">admin@averiqschool.edu</div>
                <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-[10px]">
                  Role: {role.replace('_', ' ')}
                </div>
              </div>

              <div className="py-2 border-b border-slate-800">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                {rolesList.map(item => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      setRole(item.role);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      role === item.role
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] opacity-75">{item.desc}</span>
                  </button>
                ))}
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobilePreviewOpen(!isMobilePreviewOpen);
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-teal-400" />
                  <span>Mobile Screen Simulator</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('set');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>School Settings</span>
                </button>
                {onSwitchRole && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onSwitchRole();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Role Selection Screen</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
