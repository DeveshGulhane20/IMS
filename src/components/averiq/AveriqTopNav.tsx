import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Maximize2,
  Minimize2,
  ChevronDown,
  Menu,
  Smartphone,
  LogOut,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X,
  UserCheck
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';
import { Role } from '../../types/ims';
import { AveriqLogo } from './AveriqLogo';

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
    currentUser,
    isMobilePreviewOpen,
    setMobilePreviewOpen,
    students,
    teachers,
    inquiries
  } = useIMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

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
      desc: 'Scheduled for 15 Nov at 10:00 AM',
      time: '1h ago',
      icon: Calendar,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      id: 3,
      title: 'Mathematics Unit Test Ch 5',
      desc: 'Scheduled on 12 Nov 2025 at 10:00 AM',
      time: '2h ago',
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-500/10'
    }
  ];

  // Profile avatar, name, and email per role
  const getPersonaDetails = () => {
    if (role === 'STUDENT') {
      return {
        initials: 'RS',
        name: 'Rohan Sharma',
        email: 'rohan.sharma@student.averiq.edu',
        roleLabel: 'Class 10 | Science',
        color: 'from-blue-600 to-indigo-600'
      };
    }
    if (role === 'PARENT') {
      return {
        initials: 'MS',
        name: 'Mr. & Mrs. Sharma',
        email: 'sharma.parents@averiq.edu',
        roleLabel: 'Parent Guardian',
        color: 'from-indigo-600 to-purple-600'
      };
    }
    if (role === 'TEACHER') {
      return {
        initials: 'RS',
        name: 'Prof. Rajesh Sir',
        email: 'rajesh.sir@faculty.averiq.edu',
        roleLabel: 'Maths Teacher',
        color: 'from-emerald-600 to-teal-600'
      };
    }
    return {
      initials: 'AD',
      name: 'Administrator',
      email: 'admin@averiq.edu',
      roleLabel: 'School Admin',
      color: 'from-blue-600 to-cyan-600'
    };
  };

  const persona = getPersonaDetails();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0A192F] border-b border-[#1E293B]/70 px-4 lg:px-8 flex items-center justify-between gap-3 text-white">
      {/* Left Area: Mobile Menu Trigger + Averiq Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <AveriqLogo
          className="w-8 h-8 sm:w-9 sm:h-9"
          showText={true}
          textColor="text-white"
          subtextColor="text-blue-400"
          tagline={
            role === 'STUDENT'
              ? 'Student Portal'
              : role === 'PARENT'
              ? 'Parent Portal'
              : 'Intelligence in every solution'
          }
        />
      </div>

      {/* Center Area: Global Search Input */}
      <div ref={searchRef} className="relative flex-1 max-w-sm lg:max-w-md mx-2 sm:mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search students, staff, fees, etc..."
            className="w-full bg-[#071324] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#0056D6] focus:border-transparent transition-all"
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
          <div className="absolute left-0 right-0 mt-2 bg-[#0A192F] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
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
                No matching students or records found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Area: Portal Switcher, Fullscreen, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors hidden md:flex items-center justify-center"
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
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D32F2F] text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0A192F]">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0A192F] border border-slate-700 shadow-2xl p-3 z-50 text-xs">
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
                      className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors flex items-start gap-3"
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
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#071324] hover:bg-slate-800 border border-slate-700/80 transition-colors text-left"
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${persona.color} text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/30 shrink-0`}>
              {persona.initials}
            </div>
            <div className="hidden md:block leading-tight text-left">
              <div className="text-xs font-semibold text-white">
                {persona.name}
              </div>
              <div className="text-[10px] text-blue-400 font-medium">
                {persona.roleLabel}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0A192F] border border-slate-700 shadow-2xl p-2 z-50 text-xs">
              {/* User Identity Info */}
              <div className="p-3 border-b border-slate-800">
                <div className="font-bold text-white text-sm">
                  {persona.name}
                </div>
                <div className="text-slate-400 text-[11px] truncate mt-0.5">
                  {persona.email}
                </div>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-[10px]">
                  {persona.roleLabel}
                </div>
              </div>

              {/* Utility Links */}
              <div className="py-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobilePreviewOpen(!isMobilePreviewOpen);
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Mobile Screen Simulator</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('set');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Portal Settings</span>
                </button>
              </div>

              {/* Clean Sign Out CTA */}
              {onSwitchRole && (
                <div className="pt-1.5 mt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onSwitchRole();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
