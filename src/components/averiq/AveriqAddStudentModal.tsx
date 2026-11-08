import React, { useState } from 'react';
import {
  X,
  UserPlus,
  User,
  Users,
  GraduationCap,
  CreditCard,
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

export interface AddStudentFormData {
  // 1. Personal Details
  name: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  address: string;

  // 2. Parent & Emergency
  parentName: string;
  relationship: string;
  phone: string;
  parentEmail: string;
  emergencyPhone: string;
  emergencyContactPerson: string;

  // 3. Academic & Financial
  gradeLevel: string;
  batchName: string;
  board: string;
  enrollmentDate: string;
  previousSchool: string;
  totalFee: number;
  paymentPlan: string;
  scholarship: number;

  // 4. Medical / Notes
  bloodGroup: string;
  medicalConditions: string;
  remarks: string;
}

interface AveriqAddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (student: AddStudentFormData) => void;
}

export const AveriqAddStudentModal: React.FC<AveriqAddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { enrollStudent, showToast, batches } = useIMS();

  const [activeTab, setActiveTab] = useState<'personal' | 'parent' | 'academic' | 'medical'>('personal');

  const [formData, setFormData] = useState<AddStudentFormData>({
    // 1. Personal Details
    name: '',
    dob: '2010-05-14',
    gender: 'FEMALE',
    email: '',
    address: '',

    // 2. Parent & Emergency
    parentName: '',
    relationship: 'Mother',
    phone: '',
    parentEmail: '',
    emergencyPhone: '',
    emergencyContactPerson: '',

    // 3. Academic & Financial
    gradeLevel: 'Class 10',
    batchName: '10-A',
    board: 'CBSE',
    enrollmentDate: new Date().toISOString().split('T')[0],
    previousSchool: '',
    totalFee: 24000,
    paymentPlan: 'Quarterly',
    scholarship: 2000,

    // 4. Medical / Notes
    bloodGroup: 'B+',
    medicalConditions: '',
    remarks: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const netFee = Math.max(0, formData.totalFee - (formData.scholarship || 0));

  const validateCurrentTab = (): boolean => {
    const errs: Record<string, string> = {};
    if (activeTab === 'personal') {
      if (!formData.name.trim()) errs.name = 'Student full name is required';
      if (!formData.dob) errs.dob = 'Date of birth is required';
    } else if (activeTab === 'parent') {
      if (!formData.parentName.trim()) errs.parentName = 'Parent / Guardian name is required';
      if (!formData.phone.trim()) errs.phone = 'Primary contact phone is required';
    } else if (activeTab === 'academic') {
      if (!formData.gradeLevel) errs.gradeLevel = 'Class / Grade is required';
      if (!formData.batchName.trim()) errs.batchName = 'Batch section is required';
      if (formData.totalFee <= 0) errs.totalFee = 'Please enter valid annual fee';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentTab()) return;
    if (activeTab === 'personal') setActiveTab('parent');
    else if (activeTab === 'parent') setActiveTab('academic');
    else if (activeTab === 'academic') setActiveTab('medical');
  };

  const handlePrevious = () => {
    if (activeTab === 'medical') setActiveTab('academic');
    else if (activeTab === 'academic') setActiveTab('parent');
    else if (activeTab === 'parent') setActiveTab('personal');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setActiveTab('personal');
      setErrors({ name: 'Student full name is required' });
      showToast('Please enter student full name');
      return;
    }
    if (!formData.parentName.trim()) {
      setActiveTab('parent');
      setErrors({ parentName: 'Parent name is required' });
      showToast('Please enter parent name');
      return;
    }
    if (!formData.phone.trim()) {
      setActiveTab('parent');
      setErrors({ phone: 'Primary phone is required' });
      showToast('Please enter contact phone');
      return;
    }

    // Call context to persist
    enrollStudent({
      name: formData.name,
      batchName: formData.batchName,
      gradeLevel: formData.gradeLevel,
      parentName: formData.parentName,
      phone: formData.phone,
      totalFee: formData.totalFee
    });

    if (onSuccess) {
      onSuccess(formData);
    }

    showToast(`Student ${formData.name} successfully registered in ${formData.gradeLevel}!`);
    onClose();
  };

  const TABS = [
    { id: 'personal', label: 'Personal Details', icon: User, num: 1 },
    { id: 'parent', label: 'Parent & Emergency', icon: Users, num: 2 },
    { id: 'academic', label: 'Academic & Financial', icon: GraduationCap, num: 3 },
    { id: 'medical', label: 'Medical / Notes', icon: HeartPulse, num: 4 }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-[#122D4A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 border border-[#E2EDF8] dark:border-slate-800 rounded-[22px] shadow-[0_12px_35px_rgba(39,94,150,0.12)] w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-scaleUp text-[#122D4A] dark:text-slate-100"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2EDF8] dark:border-slate-800 flex items-center justify-between bg-[#F8FBFF] dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] text-[#3979C5] flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#122D4A] dark:text-white">
                  Add New Student
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3FC] text-[#3979C5] border border-[#D5E5F7]">
                  Official Enrollment Form
                </span>
              </div>
              <p className="text-xs text-[#5A7184] dark:text-slate-400">
                Register student profile, academic placement, parent contacts &amp; fee structure
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#122D4A] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Enrollment Overview Banner */}
        <div className="px-6 py-2.5 bg-[#F0F5FA] dark:bg-slate-800/60 border-b border-[#E2EDF8] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-[#5A7184] dark:text-slate-300">
              Student ID: <strong className="font-mono text-[#3979C5]">STU-2026-NEW</strong>
            </span>
            <span className="text-[11px] font-semibold text-[#5A7184] dark:text-slate-300">
              Selected: <strong className="text-[#122D4A] dark:text-white">{formData.gradeLevel} ({formData.batchName || 'General'})</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#5A7184] dark:text-slate-300">
              Annual Fee: <strong className="font-mono text-[#122D4A] dark:text-white">₹{formData.totalFee.toLocaleString('en-IN')}</strong>
            </span>
            {formData.scholarship > 0 && (
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                -₹{formData.scholarship.toLocaleString('en-IN')} Concession
              </span>
            )}
            <span className="text-[11px] font-bold text-[#3979C5] bg-[#EBF3FC] px-2.5 py-0.5 rounded-full border border-[#D5E5F7]">
              Net: ₹{netFee.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 4 Clean Section Tabs */}
        <div className="px-6 py-2 bg-white dark:bg-slate-900 border-b border-[#E2EDF8] dark:border-slate-800 overflow-x-auto flex items-center gap-2 shrink-0 scrollbar-thin">
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
                    ? 'bg-[#3979C5] text-white shadow-xs'
                    : 'text-[#5A7184] hover:text-[#122D4A] hover:bg-[#F0F5FA] dark:text-slate-300 dark:hover:bg-slate-800'
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
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA] dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3979C5] flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>1. Student Identity &amp; Demographics</span>
                </h4>
                <span className="text-[11px] text-[#8EA0B4]">* Required information</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                  Student Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Diya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Gender *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['FEMALE', 'MALE', 'OTHER'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formData.gender === g
                            ? 'bg-[#EBF3FC] border-[#3979C5] text-[#3979C5] ring-1 ring-[#3979C5]/30'
                            : 'bg-[#F8FBFF] border-[#DCE7F3] text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {g === 'FEMALE' ? 'Female' : g === 'MALE' ? 'Male' : 'Other'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                  Student Personal Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. diya.sharma@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Flat 402, Lotus Residency, MG Road, Pune, Maharashtra - 411001"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARENT & EMERGENCY */}
          {activeTab === 'parent' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA] dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3979C5] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>2. Parent / Guardian &amp; Emergency Protocols</span>
                </h4>
                <span className="text-[11px] text-[#8EA0B4]">Automated SMS alerts link to this number</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Meera Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                  {errors.parentName && <p className="text-[11px] text-rose-600 mt-1">{errors.parentName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Relationship to Student *
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Primary Contact Phone (SMS &amp; Calls) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Parent Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="e.g. meera.sharma@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Alternative Emergency Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="+91 98765 99999"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Emergency Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactPerson}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPerson: e.target.value })}
                    placeholder="e.g. Dr. Alok Sharma (Uncle / Neighbor)"
                    className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIC & FINANCIAL */}
          {activeTab === 'academic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA] dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3979C5] flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>3. Academic Placement &amp; Course Fee Structure</span>
                </h4>
                <span className="text-[11px] text-[#8EA0B4]">All 1st to 12th standards supported</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Grade / Class *
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  >
                    {[
                      'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
                      'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
                      'Class 11 Science (PCM)', 'Class 11 Medical (PCB)', 'Class 11 Commerce',
                      'Class 12 Science (PCM)', 'Class 12 Medical (PCB)', 'Class 12 Commerce'
                    ].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Batch Section *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.batchName}
                    onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                    placeholder="e.g. 10-A (Morning)"
                    className="w-full px-3 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Education Board *
                  </label>
                  <select
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  >
                    <option value="CBSE">CBSE (Central Board)</option>
                    <option value="ICSE">ICSE / CISCE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB (International Baccalaureate)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Enrollment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Previous School / Institution
                  </label>
                  <input
                    type="text"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    placeholder="e.g. St. Xavier High School"
                    className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
              </div>

              {/* Financial Box */}
              <div className="p-4 rounded-2xl bg-[#F8FBFF] dark:bg-slate-800/80 border border-[#DCE7F3] dark:border-slate-700 space-y-3">
                <span className="text-[11px] font-bold text-[#3979C5] uppercase tracking-wider block">
                  Fee Structure &amp; Installment Scheme
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                      Annual Course Fee (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.totalFee}
                      onChange={(e) => setFormData({ ...formData, totalFee: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#DCE7F3] dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-bold text-[#122D4A] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                      Discount / Scholarship (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.scholarship}
                      onChange={(e) => setFormData({ ...formData, scholarship: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#DCE7F3] dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-emerald-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                      Payment Plan *
                    </label>
                    <select
                      value={formData.paymentPlan}
                      onChange={(e) => setFormData({ ...formData, paymentPlan: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#DCE7F3] dark:border-slate-700 rounded-xl text-xs sm:text-sm text-[#122D4A] dark:text-white font-medium"
                    >
                      <option value="Annual">Annual (Full Lump-Sum)</option>
                      <option value="Quarterly">Quarterly (4 Installments)</option>
                      <option value="Bi-Annual">Bi-Annual (2 Installments)</option>
                      <option value="Monthly">Monthly (10 Installments)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#5A7184] dark:text-slate-400">Total Net Amount Payable:</span>
                  <span className="text-sm font-black font-mono text-[#3979C5]">
                    ₹{netFee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDICAL / NOTES */}
          {activeTab === 'medical' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F5FA] dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3979C5] flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" />
                  <span>4. Health Protocols &amp; Special Remarks</span>
                </h4>
                <span className="text-[11px] text-[#8EA0B4]">Confidential Student Record</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                    Medical Conditions / Allergies
                  </label>
                  <input
                    type="text"
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                    placeholder="e.g. Mild asthma (inhaler carried), penicillin allergy, or None"
                    className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#122D4A] dark:text-slate-200 mb-1">
                  Mentor / Counselor Remarks &amp; Academic Focus
                </label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. Excels in Science & Mathematics; preparing for NTSE / Foundation Olympiads. Needs extra support in Hindi grammar."
                  className="w-full px-3.5 py-2.5 bg-[#F8FBFF] focus:bg-white border border-[#DCE7F3] rounded-xl text-xs sm:text-sm text-[#122D4A] dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3979C5]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All student health information and parent contacts are protected under 256-Bit institutional encryption and FERPA &amp; GDPR compliance standards.
                </span>
              </div>
            </div>
          )}
        </form>

        {/* Modal Action Footer */}
        <div className="px-6 py-3.5 bg-[#F8FBFF] dark:bg-slate-850 border-t border-[#E2EDF8] dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DCE7F3] dark:border-slate-700 text-xs font-semibold text-[#5A7184] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'personal' && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-3.5 py-2 rounded-xl border border-[#DCE7F3] dark:border-slate-700 text-xs font-semibold text-[#122D4A] dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {activeTab !== 'medical' ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-[#EBF3FC] text-[#3979C5] hover:bg-[#DCEBFB] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-[#3979C5] hover:bg-[#2F68AC] text-white font-bold text-xs shadow-[0_4px_14px_rgba(57,121,197,0.25)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
