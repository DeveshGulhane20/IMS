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
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  KeyRound,
  HelpCircle,
  X,
  FileCheck,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { Role } from '../../types/ims';
import { AveriqLogo } from '../averiq/AveriqLogo';

interface AveriqLoginLandingPageProps {
  onSelectRole: (role: Role) => void;
  onSkipToDashboard?: () => void;
}

type AuthMode = 'CREDENTIALS' | 'SSO';

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
  ADMIN: {
    role: 'ADMIN',
    title: 'Administrator Portal',
    shortTitle: 'Admin',
    badge: 'Institute Governance',
    badgeColor: 'bg-[#EBF3FC] text-[#3979C5] border-[#D5E5F7]',
    icon: Building2,
    gradient: 'from-[#3979C5] to-[#122D4A]',
    identifierLabel: 'Administrator Email',
    identifierPlaceholder: 'admin@averiq.edu',
    defaultIdentifier: 'admin@averiq.edu',
    sampleName: 'School Administrator',
    sampleDetail: 'Supervisory Control & Analytics',
    description: 'Full school analytics, staff directory, fee collections, admissions CRM, and reports.'
  },
  TEACHER: {
    role: 'TEACHER',
    title: 'Teacher Dashboard',
    shortTitle: 'Teacher',
    badge: 'Faculty Workspace',
    badgeColor: 'bg-[#F2EDFB] text-[#7C3AED] border-[#E2D5F8]',
    icon: Award,
    gradient: 'from-[#7C3AED] to-[#3979C5]',
    identifierLabel: 'Faculty Employee ID or Email',
    identifierPlaceholder: 'rajesh.math@averiq.edu',
    defaultIdentifier: 'rajesh.sir@faculty.averiq.edu',
    sampleName: 'Prof. Rajesh Sir',
    sampleDetail: 'Department of Mathematics & Science',
    description: 'Manage class attendance, evaluate online tests, assign homework, and post syllabus notes.'
  },
  STUDENT: {
    role: 'STUDENT',
    title: 'Student Portal',
    shortTitle: 'Student',
    badge: 'Learner Hub',
    badgeColor: 'bg-[#EBF7FD] text-[#0284C7] border-[#CDEBFA]',
    icon: GraduationCap,
    gradient: 'from-[#0284C7] to-[#3979C5]',
    identifierLabel: 'Student Roll Code (PRN) or Email',
    identifierPlaceholder: 'STU-2025-001 or rohan@student.averiq.edu',
    defaultIdentifier: 'STU-2025-001',
    sampleName: 'Rohan Sharma',
    sampleDetail: 'Class 10 | Science Batch 2025-26',
    description: 'Access class timetables, study material downloads, test marks & pending assignments.'
  },
  PARENT: {
    role: 'PARENT',
    title: 'Parent / Guardian Portal',
    shortTitle: 'Parent',
    badge: 'Family Access',
    badgeColor: 'bg-[#EDF8F4] text-[#059669] border-[#CEEFE3]',
    icon: Users,
    gradient: 'from-[#059669] to-[#3979C5]',
    identifierLabel: 'Registered Mobile Number or Email',
    identifierPlaceholder: '+91 98765 43210 or parent@averiq.edu',
    defaultIdentifier: 'sharma.family@averiq.edu',
    sampleName: 'Mr. & Mrs. Sharma',
    sampleDetail: 'Ward: Rohan Sharma (Class 10A)',
    description: 'Daily attendance status, online fee payment receipts & teacher feedback.'
  }
};

export const AveriqLoginLandingPage: React.FC<AveriqLoginLandingPageProps> = ({
  onSelectRole,
  onSkipToDashboard
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [authMode, setAuthMode] = useState<AuthMode>('CREDENTIALS');
  const [identifier, setIdentifier] = useState(ROLE_CONFIGS.ADMIN.defaultIdentifier);
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
      }, 650);
    }, 550);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessToast(`Google SSO authorized. Launching ${currentConfig.title}...`);
      setTimeout(() => {
        onSelectRole(selectedRole);
      }, 650);
    }, 550);
  };

  const handleEnterpriseSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessToast(`Institute SSO authorized. Launching ${currentConfig.title}...`);
      setTimeout(() => {
        onSelectRole(selectedRole);
      }, 650);
    }, 550);
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#122D4A] flex flex-col font-sans selection:bg-[#3979C5] selection:text-white relative">
      {/* Subtle Pearl/Glacier Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#3979C5]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#3979C5]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-[#122D4A]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Navigation: Clean Pearl/Glacier Aesthetic */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2EDF8] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(39,94,150,0.04)]">
        <div className="flex items-center gap-3">
          <AveriqLogo
            className="w-9 h-9"
            showText={true}
            textColor="text-[#122D4A]"
            subtextColor="text-[#3979C5]"
            tagline="Intelligence in every solution"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="text-xs text-[#122D4A]/80 hover:text-[#3979C5] flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-[#EBF3FC] transition-colors font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#3979C5]" />
            <span className="hidden sm:inline">Need Help?</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSkipToDashboard) onSkipToDashboard();
              else onSelectRole('ADMIN');
            }}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#3979C5] hover:bg-[#2F68AC] text-white shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <span>Explore Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clean Institutional Branding Showcase (Redundant 2x2 grid removed) */}
          <div className="lg:col-span-6 space-y-7 text-left">
            
            {/* Header Badge & Title */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3FC] border border-[#D5E5F7] text-xs font-semibold text-[#3979C5]">
                <span className="w-2 h-2 rounded-full bg-[#3979C5] animate-pulse" />
                <span>Unified Institutional Access Center</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.15] text-[#122D4A]">
                Your Portal, <span className="text-[#3979C5]">Your Focus.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#5A7184] leading-relaxed max-w-xl font-normal">
                Welcome to AVERIQ’s unified access center. Connect students, empower parents with real-time ward updates, support teachers, and deliver transparent school governance with intelligent solutions.
              </p>
            </div>

            {/* Core Institutional Value Pillars (Clean, non-redundant informative cards) */}
            <div
              className="p-5 sm:p-6 bg-white border border-[#E2EDF8] space-y-4 transition-all"
              style={{
                borderRadius: '22px',
                boxShadow: '0 12px 35px rgba(39,94,150,0.055)'
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#EBF3FC] text-[#3979C5] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#122D4A]">Dynamic Master Data Synchronization</h4>
                  <p className="text-[11px] text-[#5A7184] mt-0.5 leading-snug">
                    Unified 50-student master pool seamlessly coordinated across roll-calls, fee ledgers, and exam audits.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-[#F0F5FA]" />

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#EBF7FD] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#122D4A]">Comprehensive Board Curriculums</h4>
                  <p className="text-[11px] text-[#5A7184] mt-0.5 leading-snug">
                    Native management for 1st to 12th standards across State Board, CBSE, ICSE, and IB frameworks.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-[#F0F5FA]" />

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#EDF8F4] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#122D4A]">Role-Based Institutional Governance</h4>
                  <p className="text-[11px] text-[#5A7184] mt-0.5 leading-snug">
                    Airtight, scoped permissions for Administrators, Faculty, Students, and Family Guardians.
                  </p>
                </div>
              </div>
            </div>

            {/* Institutional Trust & Compliance Strip */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#5A7184]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3979C5]" />
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#7C3AED]" />
                  <span>FERPA &amp; GDPR Compliant</span>
                </div>
              </div>

              <p className="text-[11px] text-[#8EA0B4] leading-relaxed">
                © {new Date().getFullYear()} AVERIQ — Intelligence in every solution. IMS - Institution Management System. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right Column: Single, Highly Responsive Role Selector & Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              className="w-full max-w-xl bg-white border border-[#E2EDF8] p-6 sm:p-9 transition-all relative overflow-hidden"
              style={{
                borderRadius: '22px',
                boxShadow: '0 12px 35px rgba(39,94,150,0.055)'
              }}
            >
              {/* Header: Role Selector Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-[#5A7184] uppercase tracking-wider">
                    Select Your Portal Role
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentConfig.badgeColor}`}>
                    {currentConfig.badge}
                  </span>
                </div>

                {/* Single, Intuitive 4-Role Segmented Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-[#F0F5FA] rounded-2xl border border-[#E2EDF8]">
                  {(['PARENT', 'STUDENT', 'TEACHER', 'ADMIN'] as Role[]).map((r) => {
                    const cfg = ROLE_CONFIGS[r];
                    const Icon = cfg.icon;
                    const isActive = selectedRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-[#122D4A] shadow-[0_2px_8px_rgba(39,94,150,0.08)] ring-1 ring-[#DCE7F3]'
                            : 'text-[#5A7184] hover:text-[#122D4A] hover:bg-white/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 transition-colors ${isActive ? 'text-[#3979C5]' : 'text-[#8EA0B4]'}`} />
                        <span>{cfg.shortTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Role Header Info Banner */}
              <div className="mt-5 flex items-start gap-3.5 pb-4 border-b border-[#F0F5FA]">
                <div className="w-11 h-11 rounded-xl bg-[#3979C5] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <currentConfig.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-[#122D4A]">
                    {currentConfig.title}
                  </h2>
                  <p className="text-xs text-[#5A7184] mt-0.5 leading-snug">
                    {currentConfig.description}
                  </p>
                </div>
              </div>

              {/* Auth Mode Pill */}
              <div className="flex items-center gap-2 mt-4 border-b border-[#F0F5FA] pb-3 text-xs">
                <span className="px-3 py-1 rounded-lg bg-[#122D4A] text-white font-semibold shadow-2xs">
                  Password Login
                </span>
                <span className="text-[11px] text-[#8EA0B4]">
                  Official Averiq Secure SSO Gateway
                </span>
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

              {/* Standard Credentials Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] mb-1.5">
                    {currentConfig.identifierLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8EA0B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={currentConfig.identifierPlaceholder}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] hover:bg-[#F0F5FA] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#122D4A]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-[#3979C5] hover:text-[#122D4A] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8EA0B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your security password"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#f8fbff] hover:bg-[#F0F5FA] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5] focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8EA0B4] hover:text-[#122D4A] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & First-Time Activation */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#3979C5] rounded border-[#DCE7F3] focus:ring-[#3979C5]"
                    />
                    <span className="text-xs font-medium text-[#5A7184]">Remember this device</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowActivateModal(true)}
                    className="text-xs font-semibold text-[#5A7184] hover:text-[#3979C5] cursor-pointer"
                  >
                    First-time user? Activate
                  </button>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#3979C5] hover:bg-[#2F68AC] active:scale-[0.99] text-white font-bold text-sm shadow-[0_4px_16px_rgba(57,121,197,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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

                {/* Or Continue With Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E2EDF8]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#8EA0B4] font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Alternative Social SSO Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="py-2.5 px-3 border border-[#DCE7F3] hover:border-[#3979C5]/50 rounded-xl bg-white hover:bg-[#F8FBFF] text-xs font-semibold text-[#122D4A] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                    onClick={handleEnterpriseSSO}
                    className="py-2.5 px-3 border border-[#DCE7F3] hover:border-[#3979C5]/50 rounded-xl bg-white hover:bg-[#F8FBFF] text-xs font-semibold text-[#122D4A] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[#3979C5] shrink-0" />
                    <span>Institute SSO</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: Forgot Password Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#122D4A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white max-w-md w-full p-6 sm:p-7 relative border border-[#E2EDF8]"
            style={{
              borderRadius: '22px',
              boxShadow: '0 12px 35px rgba(39,94,150,0.15)'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute right-4 top-4 text-[#8EA0B4] hover:text-[#122D4A] p-1.5 rounded-lg hover:bg-[#F0F5FA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] text-[#3979C5] flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-[#122D4A]">Reset Your Password</h3>
            <p className="text-xs text-[#5A7184] mt-1">
              Enter your registered email address or mobile number. We will send you an OTP and password recovery link.
            </p>

            {forgotSent ? (
              <div className="my-5 p-4 bg-[#EDF8F4] border border-[#CEEFE3] rounded-2xl text-[#059669] text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Recovery Link Dispatched!</span>
                </div>
                <p>We’ve sent verification instructions to <strong>{forgotInput || currentConfig.defaultIdentifier}</strong>.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="mt-3 w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
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
                  <label className="block text-xs font-bold text-[#122D4A] mb-1">
                    Registered Identifier
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. your email or phone number"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] border border-[#DCE7F3] rounded-xl text-xs text-[#122D4A] focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#3979C5] hover:bg-[#2F68AC] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 bg-[#122D4A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white max-w-md w-full p-6 sm:p-7 relative border border-[#E2EDF8]"
            style={{
              borderRadius: '22px',
              boxShadow: '0 12px 35px rgba(39,94,150,0.15)'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowActivateModal(false);
                setActivateDone(false);
              }}
              className="absolute right-4 top-4 text-[#8EA0B4] hover:text-[#122D4A] p-1.5 rounded-lg hover:bg-[#F0F5FA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#EDF8F4] text-[#059669] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-[#122D4A]">First-Time User Activation</h3>
            <p className="text-xs text-[#5A7184] mt-1">
              Verify your school admission details to create your secure credentials.
            </p>

            {activateDone ? (
              <div className="my-5 p-4 bg-[#EDF8F4] border border-[#CEEFE3] rounded-2xl text-[#059669] text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Account Verified!</span>
                </div>
                <p>An activation token has been sent to your registered phone. Please set your new password.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowActivateModal(false);
                    setActivateDone(false);
                  }}
                  className="mt-3 w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
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
                  <label className="block text-xs font-bold text-[#122D4A] mb-1">
                    Student Roll Code / Admission Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-2025-001"
                    value={activateCode}
                    onChange={(e) => setActivateCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] border border-[#DCE7F3] rounded-xl text-xs text-[#122D4A] focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] mb-1">
                    Date of Birth (as per admission records)
                  </label>
                  <input
                    type="date"
                    required
                    value={activateDob}
                    onChange={(e) => setActivateDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] border border-[#DCE7F3] rounded-xl text-xs text-[#122D4A] focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 bg-[#122D4A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-7 relative border border-[#E2EDF8]"
            style={{
              borderRadius: '22px',
              boxShadow: '0 12px 35px rgba(39,94,150,0.15)'
            }}
          >
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="absolute right-4 top-4 text-[#8EA0B4] hover:text-[#122D4A] p-1.5 rounded-lg hover:bg-[#F0F5FA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] text-[#3979C5] flex items-center justify-center mb-3">
              <PhoneCall className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-[#122D4A]">Averiq Support &amp; Help Desk</h3>
            <p className="text-xs text-[#5A7184] mt-1">
              Need assistance logging in or finding your student code? Reach out to our academic support team.
            </p>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3 bg-[#F0F5FA] border border-[#E2EDF8] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#122D4A]">Helpline Phone</div>
                  <div className="text-[#5A7184]">+91 800-AVIQ-EDU (800-2847-338)</div>
                </div>
                <span className="text-[10px] font-bold text-[#059669] bg-[#EDF8F4] px-2.5 py-0.5 rounded-full border border-[#CEEFE3]">
                  Mon-Sat, 8 AM - 6 PM
                </span>
              </div>

              <div className="p-3 bg-[#F0F5FA] border border-[#E2EDF8] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#122D4A]">Email Support</div>
                  <div className="text-[#5A7184]">support.portal@averiq.edu</div>
                </div>
                <span className="text-[10px] text-[#3979C5] font-bold">Response &lt; 2 hrs</span>
              </div>

              <div className="p-3.5 bg-[#F0F5FA] border border-[#E2EDF8] rounded-xl">
                <div className="font-bold text-[#122D4A] mb-1">Frequently Asked Questions</div>
                <ul className="list-disc pl-4 text-[#5A7184] space-y-1 text-[11px]">
                  <li>Parents can log in with their registered mobile number entered during admission.</li>
                  <li>Students can find their Roll Code on their school ID card (e.g. STU-2025-001).</li>
                  <li>For multiple children enrolled, one parent login allows switching between siblings effortlessly.</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2.5 bg-[#122D4A] hover:bg-[#1E3A5F] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Close Help Desk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
