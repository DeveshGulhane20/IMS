import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Award,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  PhoneCall,
  Clock,
  BookOpen,
  ChevronRight,
  X,
  ExternalLink
} from 'lucide-react';
import { Role } from '../../types/ims';
import { AveriqLogo } from '../averiq/AveriqLogo';

interface AveriqLoginLandingPageProps {
  onSelectRole: (role: Role) => void;
  onSkipToDashboard?: () => void;
}

type AuthMode = 'CREDENTIALS' | 'QR' | 'SSO';

interface RoleConfig {
  role: Role;
  title: string;
  shortTitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  gradient: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  defaultIdentifier: string;
  sampleName: string;
  sampleDetail: string;
  description: string;
}

const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  PARENT: {
    role: 'PARENT',
    title: 'Parent / Guardian Portal',
    shortTitle: 'Parent',
    badge: 'Family Access',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-600',
    identifierLabel: 'Registered Mobile Number or Email',
    identifierPlaceholder: 'e.g. +91 98765 43210 or parent@averiq.edu',
    defaultIdentifier: 'sharma.family@averiq.edu',
    sampleName: 'Mr. & Mrs. Sharma',
    sampleDetail: 'Ward: Rohan Sharma (Class 10A)',
    description: 'Track real-time attendance, test marks, fee receipts, and direct institute announcements.'
  },
  STUDENT: {
    role: 'STUDENT',
    title: 'Student Portal',
    shortTitle: 'Student',
    badge: 'Learner Hub',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    icon: GraduationCap,
    gradient: 'from-blue-600 to-indigo-600',
    identifierLabel: 'Student Roll Code (PRN) or Email',
    identifierPlaceholder: 'e.g. STU-2025-001 or rohan@student.averiq.edu',
    defaultIdentifier: 'STU-2025-001',
    sampleName: 'Rohan Sharma',
    sampleDetail: 'Class 10 | Science Batch 2025-26',
    description: 'Access class timetables, study materials, assignment submissions, and semester report cards.'
  },
  TEACHER: {
    role: 'TEACHER',
    title: 'Teacher Dashboard',
    shortTitle: 'Teacher',
    badge: 'Faculty Workspace',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    icon: Award,
    gradient: 'from-purple-600 to-violet-700',
    identifierLabel: 'Faculty Employee ID or Email',
    identifierPlaceholder: 'e.g. TCH-001 or rajesh.math@averiq.edu',
    defaultIdentifier: 'rajesh.sir@faculty.averiq.edu',
    sampleName: 'Prof. Rajesh Sir',
    sampleDetail: 'Department of Mathematics & Science',
    description: 'Manage class attendance, evaluate online tests, assign homework, and post syllabus notes.'
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Administrator Portal',
    shortTitle: 'Admin',
    badge: 'Institute Governance',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
    icon: Building2,
    gradient: 'from-blue-700 to-cyan-600',
    identifierLabel: 'Administrator Email',
    identifierPlaceholder: 'e.g. admin@averiq.edu',
    defaultIdentifier: 'admin@averiq.edu',
    sampleName: 'School Administrator',
    sampleDetail: 'Supervisory Control & Analytics',
    description: 'Full school analytics, staff directory, fee collections, admissions CRM, and reports.'
  }
};

export const AveriqLoginLandingPage: React.FC<AveriqLoginLandingPageProps> = ({
  onSelectRole,
  onSkipToDashboard
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>('PARENT');
  const [authMode, setAuthMode] = useState<AuthMode>('CREDENTIALS');
  const [identifier, setIdentifier] = useState(ROLE_CONFIGS.PARENT.defaultIdentifier);
  const [password, setPassword] = useState('averiq@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

  // Forgot password form state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // First-time activation state
  const [activateCode, setActivateCode] = useState('');
  const [activateDob, setActivateDob] = useState('');
  const [activateDone, setActivateDone] = useState(false);

  const currentConfig = ROLE_CONFIGS[selectedRole];

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setIdentifier(ROLE_CONFIGS[role].defaultIdentifier);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your registered email, mobile, or roll code');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setSuccessToast(`Welcome back! Authenticating into ${currentConfig.title}...`);
      setTimeout(() => {
        onSelectRole(selectedRole);
      }, 700);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessToast(`Google SSO authorized. Launching ${currentConfig.title}...`);
      setTimeout(() => {
        onSelectRole(selectedRole);
      }, 700);
    }, 600);
  };

  const handleQuickDemoLogin = (role: Role) => {
    setSelectedRole(role);
    setIdentifier(ROLE_CONFIGS[role].defaultIdentifier);
    setPassword('averiq@2025');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSelectRole(role);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-[#0056D6] selection:text-white">
      {/* Top Banner & Quick Navigation */}
      <header className="sticky top-0 z-40 bg-[#0A192F] border-b border-[#1E293B] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <AveriqLogo
            className="w-9 h-9"
            showText={true}
            textColor="text-white"
            subtextColor="text-blue-400"
            tagline="Intelligence in every solution"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Need Help?</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSkipToDashboard) onSkipToDashboard();
              else onSelectRole('ADMIN');
            }}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0056D6] to-blue-500 hover:from-blue-600 hover:to-blue-500 text-white shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Explore Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Split Screen Body */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Brand Showcase & Institutional Assurance */}
        <div className="lg:w-5/12 xl:w-1/2 bg-[#0A192F] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glow & Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Official Logo Brand Badge Card */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xs">
              <div className="w-14 h-14 rounded-xl bg-white p-1.5 shadow-md ring-1 ring-white/20 shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/Averiq_Intelligence_Logo_f607a30d.png"
                  alt="AVERIQ - Intelligence in every solution"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white tracking-tight">AVERIQ</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                    IMS
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-400">
                  Intelligence in every solution
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate">
                  IMS - Institution Management System
                </div>
              </div>
            </div>

            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Unified Academic &amp; Parental Gateway</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Your Portal, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Your Focus.</span>
              </h1>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Welcome to AVERIQ’s unified access center. Connect students, empower parents with real-time ward updates, support teachers, and deliver transparent school governance with intelligent solutions.
              </p>
            </div>

            {/* Interactive Portal Quick Glance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleRoleChange('PARENT')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  selectedRole === 'PARENT'
                    ? 'bg-blue-950/70 border-emerald-400/60 shadow-lg ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Parent Portal</div>
                    <div className="text-[11px] text-emerald-300">Ward Progress & Fees</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  Daily attendance status, online fee payment receipts & teacher feedback.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('STUDENT')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'bg-blue-950/70 border-blue-400/60 shadow-lg ring-1 ring-blue-400/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Student Portal</div>
                    <div className="text-[11px] text-blue-300">Timetable & Results</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  Classes, study material downloads, test marks & pending assignments.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('TEACHER')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  selectedRole === 'TEACHER'
                    ? 'bg-blue-950/70 border-purple-400/60 shadow-lg ring-1 ring-purple-400/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Teacher Dashboard</div>
                    <div className="text-[11px] text-purple-300">Grading & Timetable</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  Mark attendance, schedule tests, upload syllabus notes & communicate.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  selectedRole === 'ADMIN'
                    ? 'bg-blue-950/70 border-cyan-400/60 shadow-lg ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Administrator</div>
                    <div className="text-[11px] text-cyan-300">School Command</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  Comprehensive 50-student directory, fees analytics, dual semester audits.
                </div>
              </button>
            </div>
          </div>

          {/* Institutional Trust Badges */}
          <div className="relative z-10 pt-8 mt-6 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>FERPA & GDPR Compliant</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 mt-3">
              © {new Date().getFullYear()} AVERIQ — Intelligence in every solution. IMS - Institution Management System. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Authentication Card & Form */}
        <div className="lg:w-7/12 xl:w-1/2 p-4 sm:p-8 lg:p-12 flex items-center justify-center bg-slate-50">
          <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/50">
            {/* Header: Role Selector Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Your Portal Role
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentConfig.badgeColor}`}>
                  {currentConfig.badge}
                </span>
              </div>

              {/* 4 Role Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl">
                {(['PARENT', 'STUDENT', 'TEACHER', 'ADMIN'] as Role[]).map((r) => {
                  const cfg = ROLE_CONFIGS[r];
                  const Icon = cfg.icon;
                  const isActive = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-[#0056D6]' : 'text-slate-400'}`} />
                      <span>{cfg.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Header Banner */}
            <div className="mt-6 flex items-start gap-3.5 pb-4 border-b border-slate-100">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${currentConfig.gradient} text-white flex items-center justify-center shrink-0 shadow-md`}>
                <currentConfig.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">
                  {currentConfig.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {currentConfig.description}
                </p>
              </div>
            </div>

            {/* Auth Mode Toggle (Credentials vs QR Code vs SSO) */}
            <div className="flex items-center gap-2 mt-4 border-b border-slate-100 pb-3 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('CREDENTIALS')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  authMode === 'CREDENTIALS'
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('QR')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  authMode === 'QR'
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR Login</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('SSO')}
                className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                  authMode === 'SSO'
                    ? 'bg-[#0A192F] text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Single Sign-On</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Toast */}
            {successToast && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="font-semibold">{successToast}</span>
              </div>
            )}

            {/* MODE 1: Standard Credentials Form */}
            {authMode === 'CREDENTIALS' && (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {currentConfig.identifierLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={currentConfig.identifierPlaceholder}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0056D6] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your security password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0056D6] focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & First-time activation */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#0056D6] rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600">Remember this device</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowActivateModal(true)}
                    className="text-xs font-semibold text-slate-600 hover:text-[#0056D6]"
                  >
                    First-time user? Activate
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0056D6] hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Secure Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to {currentConfig.shortTitle} Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant 1-Click Demo Login Helper */}
                <div className="pt-2">
                  <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center justify-between gap-2">
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-blue-900 block">Demo One-Click Sign-in:</span>
                      <span className="text-blue-700">{currentConfig.sampleName} ({currentConfig.sampleDetail})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(selectedRole)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 shadow-xs transition-colors"
                    >
                      Instant Login
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Alternative Social Login */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="py-2.5 px-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('SSO')}
                    className="py-2.5 px-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    <span>Institute SSO</span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: Scan QR Code Login */}
            {authMode === 'QR' && (
              <div className="mt-5 text-center space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
                  {/* Simulated Dynamic QR Code */}
                  <div className="w-48 h-48 bg-white p-3 rounded-xl border border-slate-300 shadow-inner mx-auto relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                      {/* Stylized QR Code Matrix */}
                      <rect x="0" y="0" width="28" height="28" fill="#0A192F" rx="3" />
                      <rect x="4" y="4" width="20" height="20" fill="white" rx="2" />
                      <rect x="8" y="8" width="12" height="12" fill="#0056D6" rx="1" />

                      <rect x="72" y="0" width="28" height="28" fill="#0A192F" rx="3" />
                      <rect x="76" y="4" width="20" height="20" fill="white" rx="2" />
                      <rect x="80" y="8" width="12" height="12" fill="#0056D6" rx="1" />

                      <rect x="0" y="72" width="28" height="28" fill="#0A192F" rx="3" />
                      <rect x="4" y="76" width="20" height="20" fill="white" rx="2" />
                      <rect x="8" y="80" width="12" height="12" fill="#0056D6" rx="1" />

                      {/* Random pattern data cells */}
                      <rect x="36" y="6" width="8" height="8" fill="#0A192F" />
                      <rect x="48" y="6" width="8" height="8" fill="#0056D6" />
                      <rect x="36" y="20" width="12" height="6" fill="#0A192F" />
                      <rect x="52" y="16" width="6" height="12" fill="#0056D6" />

                      <rect x="10" y="38" width="8" height="8" fill="#0A192F" />
                      <rect x="22" y="42" width="10" height="6" fill="#0056D6" />
                      <rect x="38" y="38" width="24" height="24" fill="#0056D6" rx="4" />
                      <text x="50" y="54" fontSize="10" textAnchor="middle" fill="white" fontWeight="bold">AVQ</text>
                      <rect x="68" y="38" width="8" height="8" fill="#0A192F" />
                      <rect x="82" y="44" width="8" height="8" fill="#0056D6" />

                      <rect x="36" y="72" width="8" height="12" fill="#0A192F" />
                      <rect x="48" y="80" width="14" height="8" fill="#0056D6" />
                      <rect x="72" y="72" width="12" height="8" fill="#0A192F" />
                      <rect x="88" y="82" width="8" height="8" fill="#0056D6" />
                    </svg>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>QR Code refreshes in <strong>45s</strong></span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 max-w-sm mx-auto space-y-1">
                  <p className="font-semibold text-slate-800">
                    How to login with Averiq Mobile:
                  </p>
                  <p>1. Open the Averiq app on your registered phone</p>
                  <p>2. Tap on <strong>Profile</strong> &gt; <strong>Scan Web Login</strong></p>
                  <p>3. Point your camera at this QR code to authenticate</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                >
                  Simulate QR Scan Approval
                </button>
              </div>
            )}

            {/* MODE 3: Single Sign-On */}
            {authMode === 'SSO' && (
              <div className="mt-5 space-y-4">
                <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl text-xs text-purple-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-purple-950">
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    <span>Enterprise SAML / OAuth 2.0 Single Sign-On</span>
                  </div>
                  <p className="text-purple-700 text-[11px]">
                    Authenticate with your institution’s Microsoft 365, Google Workspace, or Okta directory.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Institution Domain or Tenant Code
                  </label>
                  <input
                    type="text"
                    defaultValue="averiq-school.edu"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue with Enterprise SSO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: Forgot Password Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Reset Your Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered email address or mobile number. We will send you an OTP and password recovery link.
            </p>

            {forgotSent ? (
              <div className="my-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recovery Link Dispatched!</span>
                </div>
                <p>We’ve sent verification instructions to <strong>{forgotInput || currentConfig.defaultIdentifier}</strong>.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-xl font-semibold text-xs"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSent(true);
                }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Identifier
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. your email or phone number"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0056D6] hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: First-Time User Activation */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setShowActivateModal(false);
                setActivateDone(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">First-Time User Activation</h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify your school admission details to create your secure credentials.
            </p>

            {activateDone ? (
              <div className="my-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Account Verified!</span>
                </div>
                <p>An activation token has been sent to your registered phone. Please set your new password.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowActivateModal(false);
                    setActivateDone(false);
                  }}
                  className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-xl font-semibold text-xs"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setActivateDone(true);
                }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Roll Code / Admission Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-2025-001"
                    value={activateCode}
                    onChange={(e) => setActivateCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth (as per admission records)
                  </label>
                  <input
                    type="date"
                    required
                    value={activateDob}
                    onChange={(e) => setActivateDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Verify &amp; Activate Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Need Help & Support Dialog */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <PhoneCall className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Averiq Support &amp; Help Desk</h3>
            <p className="text-xs text-slate-500 mt-1">
              Need assistance logging in or finding your student code? Reach out to our academic support team.
            </p>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Helpline Phone</div>
                  <div className="text-slate-500">+91 800-AVIQ-EDU (800-2847-338)</div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Mon-Sat, 8 AM - 6 PM
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Email Support</div>
                  <div className="text-slate-500">support.portal@averiq.edu</div>
                </div>
                <span className="text-[10px] text-blue-600 font-semibold">Response &lt; 2 hrs</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="font-bold text-slate-800 mb-1">Frequently Asked Questions</div>
                <ul className="list-disc pl-4 text-slate-500 space-y-1 text-[11px]">
                  <li>Parents can log in with their registered mobile number entered during admission.</li>
                  <li>Students can find their Roll Code on their school ID card (e.g. STU-2025-001).</li>
                  <li>For multiple children enrolled, one parent login allows switching between siblings effortlessly.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Close Help Desk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
