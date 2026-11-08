import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

export interface AddTeacherFormData {
  // 1. Professional Details
  name: string;
  employeeCode: string;
  department: string;
  designation: string;
  experienceYears: number;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Visiting';
  qualification: string;
  specialization: string;
  primarySubject: string;

  // 2. Contact & Identity
  email: string;
  phone: string;
  residentialAddress: string;
  dateOfJoining: string;

  // 3. Financials & Workload
  monthlySalary: number;
  workloadHoursPerWeek: number;
  shiftType: 'Morning Shift' | 'Regular Shift' | 'Evening Shift' | 'Flexible';
  shiftStartTime: string;
  shiftEndTime: string;
  workingDays: string[];
}

interface AveriqAddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (teacher: AddTeacherFormData) => void;
}

export const AveriqAddTeacherModal: React.FC<AveriqAddTeacherModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast, academicTeachers } = useIMS();

  const [activeTab, setActiveTab] = useState<'professional' | 'contact' | 'financials'>('professional');

  const defaultNextCode = `EMP-FAC-${String((academicTeachers?.length || 8) + 1).padStart(2, '0')}`;

  const [formData, setFormData] = useState<AddTeacherFormData>({
    // 1. Professional Details
    name: '',
    employeeCode: defaultNextCode,
    department: 'Department of Sciences',
    designation: 'Senior Faculty',
    experienceYears: 6,
    employmentType: 'Full-time',
    qualification: 'M.Sc., B.Ed.',
    specialization: 'Physics - Mechanics & Electrodynamics',
    primarySubject: 'Physics',

    // 2. Contact & Identity
    email: '',
    phone: '',
    residentialAddress: '',
    dateOfJoining: new Date().toISOString().split('T')[0],

    // 3. Financials & Workload
    monthlySalary: 65000,
    workloadHoursPerWeek: 24,
    shiftType: 'Regular Shift',
    shiftStartTime: '08:30',
    shiftEndTime: '16:30',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateCurrentTab = (): boolean => {
    const errs: Record<string, string> = {};
    if (activeTab === 'professional') {
      if (!formData.name.trim()) errs.name = 'Faculty full name is required';
      if (!formData.employeeCode.trim()) errs.employeeCode = 'Employee ID is required';
      if (!formData.specialization.trim()) errs.specialization = 'Subject specialization is required';
    } else if (activeTab === 'contact') {
      if (!formData.email.trim()) errs.email = 'Official email address is required';
      if (!formData.phone.trim()) errs.phone = 'Contact phone number is required';
    } else if (activeTab === 'financials') {
      if (formData.monthlySalary <= 0) errs.monthlySalary = 'Please enter a valid monthly remuneration';
      if (formData.workloadHoursPerWeek <= 0) errs.workloadHoursPerWeek = 'Please specify weekly workload hours';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentTab()) return;
    if (activeTab === 'professional') setActiveTab('contact');
    else if (activeTab === 'contact') setActiveTab('financials');
  };

  const handlePrevious = () => {
    if (activeTab === 'financials') setActiveTab('contact');
    else if (activeTab === 'contact') setActiveTab('professional');
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setActiveTab('professional');
      setErrors({ name: 'Faculty full name is required' });
      showToast('Please enter faculty full name');
      return;
    }
    if (!formData.phone.trim()) {
      setActiveTab('contact');
      setErrors({ phone: 'Contact phone number is required' });
      showToast('Please enter contact phone number');
      return;
    }

    if (onSuccess) {
      onSuccess(formData);
    }

    showToast(`Faculty ${formData.name} (${formData.employeeCode}) onboarded successfully!`);
    onClose();
  };

  const TABS = [
    { id: 'professional', label: '1. Professional Details', icon: Briefcase, num: 1 },
    { id: 'contact', label: '2. Contact & Identity', icon: Mail, num: 2 },
    { id: 'financials', label: '3. Financials & Workload', icon: IndianRupee, num: 3 }
  ] as const;

  const DEPARTMENTS = [
    'Department of Sciences',
    'Department of Mathematics',
    'Department of Languages & Literature',
    'Department of Social Sciences',
    'Department of Computer Science',
    'Foundation & Olympiad Cell'
  ];

  const EMPLOYMENT_TYPES: Array<'Full-time' | 'Part-time' | 'Contract' | 'Visiting'> = [
    'Full-time',
    'Part-time',
    'Contract',
    'Visiting'
  ];

  const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 z-50 bg-[#122D4A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-[#d5e8f7] dark:border-slate-800 rounded-[22px] shadow-[0_12px_35px_rgba(39,94,150,0.12)] w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[92vh] animate-scaleUp text-[#122D4A] dark:text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#d5e8f7] dark:border-slate-800 flex items-center justify-between bg-[#f8fbff] dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/60 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#173a5d] dark:text-white">
                  Add Faculty / Teacher
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/60">
                  Faculty Onboarding
                </span>
              </div>
              <p className="text-xs text-[#5A7184] dark:text-slate-400">
                Register employee ID, department, credentials, shift timing, and remuneration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#173a5d] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Faculty Overview Badge */}
        <div className="px-6 py-2.5 bg-[#f0f6fc] dark:bg-slate-800/60 border-b border-[#d5e8f7] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-[#5A7184] dark:text-slate-300">
              Employee ID: <strong className="font-mono text-purple-600 dark:text-purple-400">{formData.employeeCode}</strong>
            </span>
            <span className="text-[11px] font-semibold text-[#5A7184] dark:text-slate-300">
              Dept: <strong className="text-[#173a5d] dark:text-white">{formData.department.replace('Department of ', '')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#5A7184] dark:text-slate-300">
              Shift: <strong className="text-[#173a5d] dark:text-white">{formData.shiftStartTime} - {formData.shiftEndTime}</strong>
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-200/60">
              ₹{formData.monthlySalary.toLocaleString('en-IN')}/mo
            </span>
          </div>
        </div>

        {/* 3 Section Tabs */}
        <div className="px-6 py-2 bg-white dark:bg-slate-900 border-b border-[#d5e8f7] dark:border-slate-800 overflow-x-auto flex items-center gap-2 shrink-0 scrollbar-thin">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrors({});
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-[#5A7184] hover:text-[#173a5d] hover:bg-[#f0f6fc] dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.num}
                </div>
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: PROFESSIONAL DETAILS */}
          {activeTab === 'professional' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f6fc] dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>1. Professional Credentials & Department Placement</span>
                </h4>
                <span className="text-[11px] text-[#8EA0B4]">* Required information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Teacher Full Name (with Title) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Employee ID / Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                  {errors.employeeCode && <p className="text-[11px] text-rose-600 mt-1">{errors.employeeCode}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Academic Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Faculty Designation
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  >
                    <option value="Senior Faculty">Senior Faculty</option>
                    <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                    <option value="Assistant Teacher">Assistant Teacher</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Subject Expert / Mentor">Subject Expert / Mentor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Employment Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {EMPLOYMENT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, employmentType: type })}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          formData.employmentType === type
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-[#f8fbff] border-[#d5e8f7] text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-purple-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Highest Educational Qualification
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      placeholder="e.g. M.Sc., Ph.D. in Physics, B.Ed."
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Subject Specialization *
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g. Mechanics & Optics, Calculus"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    />
                  </div>
                  {errors.specialization && <p className="text-[11px] text-rose-600 mt-1">{errors.specialization}</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT & IDENTITY */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f6fc] dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  <span>2. Official Communications & Residential Details</span>
                </h4>
                <span className="text-[11px] text-[#8EA0B4]">* Required information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="faculty@averiq.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    value={formData.residentialAddress}
                    onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                    placeholder="e.g. 302, Palm Grove Enclave, Near City Hospital, Pune - 411001"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                  Date of Joining Institute
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIALS & WORKLOAD */}
          {activeTab === 'financials' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f6fc] dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" />
                  <span>3. Financials, Workload & Shift Timing Preferences</span>
                </h4>
                <span className="text-[11px] text-[#8EA0B4]">* Required information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Monthly Salary / Remuneration Rate (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={formData.monthlySalary}
                      onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono font-bold text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    />
                  </div>
                  {errors.monthlySalary && <p className="text-[11px] text-rose-600 mt-1">{errors.monthlySalary}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173a5d] dark:text-slate-200 mb-1">
                    Assigned Workload (Hours / Week) *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      required
                      min="1"
                      max="60"
                      value={formData.workloadHoursPerWeek}
                      onChange={(e) => setFormData({ ...formData, workloadHoursPerWeek: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#f8fbff] focus:bg-white border border-[#d5e8f7] rounded-xl text-xs sm:text-sm font-mono text-[#173a5d] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
                    />
                  </div>
                  {errors.workloadHoursPerWeek && <p className="text-[11px] text-rose-600 mt-1">{errors.workloadHoursPerWeek}</p>}
                </div>
              </div>

              {/* Working Shift Preferences */}
              <div className="p-4 rounded-2xl bg-[#f8fbff] dark:bg-slate-800/80 border border-[#d5e8f7] dark:border-slate-700/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#173a5d] dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Daily Shift & Availability Preferences</span>
                  </h5>
                  <span className="text-[10px] text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200/60 font-semibold">
                    Configured for Timetable Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#173a5d] dark:text-slate-300 mb-1">
                      Shift Name / Type
                    </label>
                    <select
                      value={formData.shiftType}
                      onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#d5e8f7] dark:border-slate-700 rounded-xl text-xs text-[#173a5d] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Morning Shift">Morning Shift (07:30 - 13:30)</option>
                      <option value="Regular Shift">Regular Shift (08:30 - 16:30)</option>
                      <option value="Evening Shift">Evening Shift (13:00 - 19:30)</option>
                      <option value="Flexible">Flexible / Subject Basis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#173a5d] dark:text-slate-300 mb-1">
                      Daily Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.shiftStartTime}
                      onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#d5e8f7] dark:border-slate-700 rounded-xl text-xs font-mono text-[#173a5d] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#173a5d] dark:text-slate-300 mb-1">
                      Daily End Time
                    </label>
                    <input
                      type="time"
                      value={formData.shiftEndTime}
                      onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#d5e8f7] dark:border-slate-700 rounded-xl text-xs font-mono text-[#173a5d] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#173a5d] dark:text-slate-300 mb-1.5">
                    Available Teaching Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DAYS.map((day) => {
                      const isSelected = formData.workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-900 border-[#d5e8f7] dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-purple-50'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{day}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs flex items-start gap-2.5 text-purple-900 dark:text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  Faculty credentials and payroll profiles are securely archived. Onboarding creates institutional single-sign-on (SSO) credentials automatically.
                </span>
              </div>
            </div>
          )}
        </form>

        {/* Modal Action Footer */}
        <div className="px-6 py-3.5 bg-[#f8fbff] dark:bg-slate-850 border-t border-[#d5e8f7] dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#d5e8f7] dark:border-slate-700 text-xs font-semibold text-[#5A7184] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'professional' && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-3.5 py-2 rounded-xl border border-[#d5e8f7] dark:border-slate-700 text-xs font-semibold text-[#173a5d] dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {activeTab !== 'financials' ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-[0_4px_14px_rgba(124,58,237,0.25)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Add Teacher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
