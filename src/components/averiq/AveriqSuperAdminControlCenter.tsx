import React, { useState } from 'react';
import {
  Building2,
  Plus,
  ShieldCheck,
  Server,
  Users,
  GraduationCap,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Database,
  Globe,
  Lock,
  Layers,
  ChevronRight,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Laptop
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';
import { Institute } from '../../types/ims';

interface AveriqSuperAdminControlCenterProps {
  onEnterInstitute?: (instituteId: string) => void;
}

export const AveriqSuperAdminControlCenter: React.FC<AveriqSuperAdminControlCenterProps> = ({
  onEnterInstitute
}) => {
  const {
    institutes,
    activeInstituteId,
    switchInstitute,
    provisionInstitute,
    setRole,
    showToast
  } = useIMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  // New Provision Form State
  const [provisionForm, setProvisionForm] = useState({
    name: '',
    code: '',
    type: 'Coaching Academy' as Institute['type'],
    board: 'CBSE' as Institute['board'],
    subdomain: '',
    primaryContactName: '',
    email: '',
    phone: '',
    address: '',
    campusCount: 1,
    plan: 'Pro Cloud' as Institute['plan'],
    monthlyFeeInr: 15000,
    totalStudents: 40,
    totalFaculty: 4
  });

  const [selectedInstDetails, setSelectedInstDetails] = useState<Institute | null>(null);

  // Filtered institutes list
  const filteredInstitutes = institutes.filter(inst => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inst.email && inst.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inst.subdomain && inst.subdomain.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === 'All' ||
      inst.type === filterType ||
      inst.plan === filterType;

    return matchesSearch && matchesType;
  });

  // Cross-tenant aggregated metrics
  const totalTenants = institutes.length;
  const activeTenants = institutes.filter(i => (i.status || 'Active') === 'Active').length;
  const totalGlobalStudents = institutes.reduce((acc, i) => acc + (i.totalStudents || 50), 0);
  const totalGlobalFaculty = institutes.reduce((acc, i) => acc + (i.totalFaculty || 5), 0);
  const totalMonthlyMRR = institutes.reduce((acc, i) => acc + (i.monthlyFeeInr || 15000), 0);

  const handleOpenProvisionModal = () => {
    const nextNum = institutes.length + 1;
    setProvisionForm({
      name: '',
      code: `INS-202${nextNum}`,
      type: 'Coaching Academy',
      board: 'CBSE',
      subdomain: '',
      primaryContactName: '',
      email: '',
      phone: '+91 98',
      address: '',
      campusCount: 1,
      plan: 'Pro Cloud',
      monthlyFeeInr: 18000,
      totalStudents: 45,
      totalFaculty: 5
    });
    setIsProvisionModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const autoCode = name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 4) + '-' + Math.floor(100 + Math.random() * 900);
    const autoSub = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.averiq.edu';
    setProvisionForm(prev => ({
      ...prev,
      name,
      code: prev.code && !prev.code.startsWith('INS-') ? prev.code : autoCode,
      subdomain: autoSub
    }));
  };

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisionForm.name.trim()) {
      showToast('Please enter the official Institute Name');
      return;
    }
    if (!provisionForm.email.trim()) {
      showToast('Please provide an administrative email for this tenant');
      return;
    }

    const created = provisionInstitute({
      name: provisionForm.name.trim(),
      code: provisionForm.code || `INST-${Date.now().toString().slice(-4)}`,
      type: provisionForm.type,
      board: provisionForm.board,
      subdomain: provisionForm.subdomain || `${provisionForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.averiq.edu`,
      primaryContactName: provisionForm.primaryContactName || 'Director / Dean',
      email: provisionForm.email.trim(),
      phone: provisionForm.phone || '+91 98000 00000',
      address: provisionForm.address || 'City Campus',
      campusCount: Number(provisionForm.campusCount) || 1,
      plan: provisionForm.plan,
      monthlyFeeInr: Number(provisionForm.monthlyFeeInr) || 15000,
      totalStudents: Number(provisionForm.totalStudents) || 35,
      totalFaculty: Number(provisionForm.totalFaculty) || 4,
      status: 'Active'
    });

    setIsProvisionModalOpen(false);
    showToast(`Tenant "${created.name}" provisioned successfully with isolated database partition!`);
  };

  const handleLaunchTenantPortal = (inst: Institute) => {
    switchInstitute(inst.id);
    setRole('ADMIN');
    if (onEnterInstitute) {
      onEnterInstitute(inst.id);
    }
    showToast(`Switched active workspace to "${inst.name}" as Administrator.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header: Platform Super Admin Banner (Pristine Glacier Light Theme) */}
      <div
        className="p-6 sm:p-8 rounded-[22px] bg-gradient-to-r from-[#F0F7FF] via-[#F8FBFF] to-[#F3F0FF] border border-[#D5E5F7] transition-all relative overflow-hidden"
        style={{
          boxShadow: '0 12px 35px rgba(39,94,150,0.055)'
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-purple-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AVERIQ PLATFORM SUPER ADMIN HQ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#122D4A] tracking-tight">
              Multi-Tenant Cloud Control Center
            </h1>

            <p className="text-sm text-[#5A7184] leading-relaxed">
              Global administration console for provisioning independent institute tenants, managing row-level security (RLS) database partitions, domain routing, and platform subscription tiers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-[#173a5d]">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cloud Multi-Tenancy: Operational</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                <Database className="w-3.5 h-3.5" />
                <span>Storage: PostgreSQL RLS Isolated</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                <Globe className="w-3.5 h-3.5" />
                <span>Region: Asia-South (Mumbai)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenProvisionModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#3979C5] to-[#205BA3] hover:from-[#2e6bb5] hover:to-[#174b8c] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Institute</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards: Cross-Tenant KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Provisioned Institutes */}
        <div
          className="p-5 rounded-[22px] bg-white border border-[#E2EDF8] transition-all hover:border-[#C5DDF5]"
          style={{ boxShadow: '0 12px 35px rgba(39,94,150,0.055)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5A7184] uppercase tracking-wider">Active Institutes</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3979C5] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#122D4A] font-mono">{activeTenants}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              100% Online
            </span>
          </div>
          <p className="text-[11px] text-[#8EA0B4] mt-2">
            AV Achievers &amp; Shapers Academy live on separate subdomains
          </p>
        </div>

        {/* Metric 2: Global Enrolled Students */}
        <div
          className="p-5 rounded-[22px] bg-white border border-[#E2EDF8] transition-all hover:border-[#C5DDF5]"
          style={{ boxShadow: '0 12px 35px rgba(39,94,150,0.055)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5A7184] uppercase tracking-wider">Global Enrolled Students</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#122D4A] font-mono">{totalGlobalStudents}</span>
            <span className="text-xs font-medium text-[#5A7184]">Unified Database</span>
          </div>
          <p className="text-[11px] text-[#8EA0B4] mt-2">
            50 AV Achievers + 68 Shapers Academy cohort
          </p>
        </div>

        {/* Metric 3: Total Monthly Recurring Revenue */}
        <div
          className="p-5 rounded-[22px] bg-white border border-[#E2EDF8] transition-all hover:border-[#C5DDF5]"
          style={{ boxShadow: '0 12px 35px rgba(39,94,150,0.055)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5A7184] uppercase tracking-wider">Platform SaaS MRR</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#122D4A] font-mono">
              ₹{(totalMonthlyMRR).toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              +18% MoM
            </span>
          </div>
          <p className="text-[11px] text-[#8EA0B4] mt-2">
            Active recurring subscriptions collected automatically
          </p>
        </div>

        {/* Metric 4: Total Faculty Across Tenants */}
        <div
          className="p-5 rounded-[22px] bg-white border border-[#E2EDF8] transition-all hover:border-[#C5DDF5]"
          style={{ boxShadow: '0 12px 35px rgba(39,94,150,0.055)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#5A7184] uppercase tracking-wider">Total Faculty Members</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#122D4A] font-mono">{totalGlobalFaculty}</span>
            <span className="text-xs font-medium text-[#5A7184]">Instructors</span>
          </div>
          <p className="text-[11px] text-[#8EA0B4] mt-2">
            Master teaching staff across all connected campuses
          </p>
        </div>
      </div>

      {/* 3. Institute Management & Tenant Directory Section */}
      <div
        className="p-6 rounded-[22px] bg-white border border-[#E2EDF8]"
        style={{ boxShadow: '0 12px 35px rgba(39,94,150,0.055)' }}
      >
        {/* Controls Toolbar: Search, Filters, and Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#F0F5FA]">
          <div>
            <h2 className="text-lg font-bold text-[#122D4A]">Provisioned Institution Tenants</h2>
            <p className="text-xs text-[#5A7184]">
              Each institution operates in its own isolated workspace with distinct branding, rosters, and fee books.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-[#8EA0B4] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search institute name, code, domain..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] placeholder-[#8EA0B4] focus:outline-none focus:ring-2 focus:ring-[#3979C5]/30"
              />
            </div>

            {/* Filter Pill */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Tiers &amp; Types</option>
              <option value="K12 School & Integrated Coaching">K12 School &amp; Coaching</option>
              <option value="Coaching Academy & Test Prep">Coaching &amp; Test Prep</option>
              <option value="Pro Cloud">Pro Cloud Plan</option>
              <option value="Enterprise Multi-Campus">Enterprise Multi-Campus</option>
            </select>
          </div>
        </div>

        {/* Tenant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredInstitutes.map((inst) => {
            const isCurrentActive = inst.id === activeInstituteId;
            return (
              <div
                key={inst.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrentActive
                    ? 'border-[#3979C5] bg-[#F8FBFF] ring-2 ring-[#3979C5]/20'
                    : 'border-[#E2EDF8] bg-white hover:border-[#C5DDF5] hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#D5E5F7] p-1.5 shadow-xs flex items-center justify-center shrink-0">
                      {inst.logoUrl ? (
                        <img src={inst.logoUrl} alt={inst.name} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-[#3979C5]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#122D4A]">{inst.name}</h3>
                        {isCurrentActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#3979C5] text-white">
                            CURRENT ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#5A7184] mt-0.5">
                        <span className="font-mono font-semibold text-[#122D4A]">{inst.code}</span>
                        <span>•</span>
                        <span>{inst.board || 'CBSE'}</span>
                        <span>•</span>
                        <span className="text-[#3979C5] font-medium">{inst.type}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {inst.status || 'Active'}
                  </span>
                </div>

                {/* Subdomain & Contact metadata */}
                <div className="p-3 rounded-xl bg-white border border-[#EBF3FC] space-y-1.5 text-xs text-[#5A7184] mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8EA0B4]">Dedicated Subdomain:</span>
                    <span className="font-mono text-[#3979C5] font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {inst.subdomain || `${inst.code.toLowerCase()}.averiq.edu`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8EA0B4]">Principal / Dean:</span>
                    <span className="font-medium text-[#122D4A]">{inst.primaryContactName || 'Director Office'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8EA0B4]">Subscription Plan:</span>
                    <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {inst.plan || 'Pro Cloud'} (₹{(inst.monthlyFeeInr || 15000).toLocaleString('en-IN')}/mo)
                    </span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pb-4 border-b border-[#F0F5FA] mb-4">
                  <div className="p-2 rounded-lg bg-[#F8FBFF]">
                    <div className="text-base font-extrabold text-[#122D4A] font-mono">
                      {inst.totalStudents || 50}
                    </div>
                    <div className="text-[10px] text-[#8EA0B4] font-medium">Students</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FBFF]">
                    <div className="text-base font-extrabold text-[#122D4A] font-mono">
                      {inst.totalFaculty || 5}
                    </div>
                    <div className="text-[10px] text-[#8EA0B4] font-medium">Faculty</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FBFF]">
                    <div className="text-base font-extrabold text-[#122D4A] font-mono">
                      {inst.campusCount || 1}
                    </div>
                    <div className="text-[10px] text-[#8EA0B4] font-medium">Campuses</div>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchTenantPortal(inst)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#3979C5] to-[#205BA3] hover:from-[#2e6bb5] hover:to-[#174b8c] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Enter {inst.name} Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInstDetails(inst)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] text-xs font-semibold transition-all cursor-pointer"
                  >
                    Tenant Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Architecture & Technical Isolation Strip */}
      <div
        className="p-6 rounded-[22px] bg-gradient-to-br from-[#0F1E36] to-[#0A1628] text-white border border-[#1E2E48]"
        style={{ boxShadow: '0 12px 35px rgba(0,0,0,0.12)' }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Multi-Tenant Cloud Isolation Architecture</h3>
              <p className="text-xs text-slate-400">
                Single unified Next.js/React codebase with strict logical separation per tenant
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            RLS ENFORCED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
              <Database className="w-4 h-4" />
              <span>1. Row-Level Security (RLS)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every table query enforces <code className="text-blue-300">WHERE institute_id = :active_tenant</code> at the database engine level, preventing cross-school data leakage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <Globe className="w-4 h-4" />
              <span>2. Subdomain &amp; White-Labeling</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automatic wildcard DNS routing assigns unique subdomains like <code className="text-emerald-300">avachievers.averiq.edu</code> and custom school logos on fee slips.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
              <Lock className="w-4 h-4" />
              <span>3. Tenant Provisioning In 2 Seconds</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Onboarding a new coaching center creates their admin credentials, initial class tiers, and fee accounts without writing code or deploying extra servers.
            </p>
          </div>
        </div>
      </div>

      {/* 5. One-Click Provisioning Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-white rounded-[22px] border border-[#D5E5F7] p-6 sm:p-8 shadow-2xl relative my-8"
            style={{ boxShadow: '0 20px 60px rgba(18,45,74,0.18)' }}
          >
            <button
              type="button"
              onClick={() => setIsProvisionModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] text-[#3979C5] flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#122D4A]">Provision New Institution Tenant</h3>
                <p className="text-xs text-[#5A7184]">
                  Deploy an isolated institutional workspace with independent database partitioning
                </p>
              </div>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-4 text-xs">
              {/* Row 1: Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-[#173a5d]">Institute Name *</label>
                  <input
                    type="text"
                    required
                    value={provisionForm.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. Apex Scholars Academy"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none focus:ring-2 focus:ring-[#3979C5]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Institute Code *</label>
                  <input
                    type="text"
                    required
                    value={provisionForm.code}
                    onChange={e => setProvisionForm({ ...provisionForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. APX-303"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] font-mono text-[#122D4A] focus:outline-none focus:ring-2 focus:ring-[#3979C5]/30"
                  />
                </div>
              </div>

              {/* Row 2: Type, Board, Subdomain */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Institution Type</label>
                  <select
                    value={provisionForm.type}
                    onChange={e => setProvisionForm({ ...provisionForm, type: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none"
                  >
                    <option value="Coaching Academy">Coaching Academy</option>
                    <option value="K12 School & Integrated Coaching">K12 School &amp; Coaching</option>
                    <option value="Junior College">Junior College</option>
                    <option value="Test Prep">Test Prep (JEE / NEET)</option>
                    <option value="International School">International School</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Board / Curriculum</label>
                  <select
                    value={provisionForm.board}
                    onChange={e => setProvisionForm({ ...provisionForm, board: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none"
                  >
                    <option value="CBSE">CBSE Board</option>
                    <option value="ICSE">ICSE Board</option>
                    <option value="State Board">State Board</option>
                    <option value="IB International">IB International</option>
                    <option value="Integrated JEE/NEET">Integrated JEE/NEET</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Subdomain URL</label>
                  <input
                    type="text"
                    value={provisionForm.subdomain}
                    onChange={e => setProvisionForm({ ...provisionForm, subdomain: e.target.value })}
                    placeholder="apex.averiq.edu"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] font-mono text-[#3979C5] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Admin Contact & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Dean / Principal Name</label>
                  <input
                    type="text"
                    value={provisionForm.primaryContactName}
                    onChange={e => setProvisionForm({ ...provisionForm, primaryContactName: e.target.value })}
                    placeholder="e.g. Dr. Arvind Joshi"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={provisionForm.email}
                    onChange={e => setProvisionForm({ ...provisionForm, email: e.target.value })}
                    placeholder="director@apex.edu"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Contact Phone</label>
                  <input
                    type="tel"
                    value={provisionForm.phone}
                    onChange={e => setProvisionForm({ ...provisionForm, phone: e.target.value })}
                    placeholder="+91 98250 12345"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Plan & Financials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Subscription Plan</label>
                  <select
                    value={provisionForm.plan}
                    onChange={e => {
                      const p = e.target.value as any;
                      const fee = p === 'Starter' ? 8000 : p === 'Pro Cloud' ? 18000 : 32000;
                      setProvisionForm({ ...provisionForm, plan: p, monthlyFeeInr: fee });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none"
                  >
                    <option value="Starter">Starter (Up to 150 students)</option>
                    <option value="Pro Cloud">Pro Cloud (Up to 500 students)</option>
                    <option value="Enterprise Multi-Campus">Enterprise (Unlimited Campuses)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Monthly SaaS Fee (₹)</label>
                  <input
                    type="number"
                    value={provisionForm.monthlyFeeInr}
                    onChange={e => setProvisionForm({ ...provisionForm, monthlyFeeInr: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] font-mono text-[#122D4A] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#173a5d]">Campuses Count</label>
                  <input
                    type="number"
                    min="1"
                    value={provisionForm.campusCount}
                    onChange={e => setProvisionForm({ ...provisionForm, campusCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FBFF] border border-[#D5E5F7] text-[#122D4A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F0F5FA]">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D5E5F7] text-[#5A7184] hover:bg-slate-50 transition-colors cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3979C5] to-[#205BA3] hover:from-[#2e6bb5] hover:to-[#174b8c] text-white font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Deploy Tenant Instance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Tenant Details Inspection Modal */}
      {selectedInstDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-white rounded-[22px] border border-[#D5E5F7] p-6 shadow-2xl relative"
            style={{ boxShadow: '0 20px 60px rgba(18,45,74,0.18)' }}
          >
            <button
              type="button"
              onClick={() => setSelectedInstDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBF3FC] text-[#3979C5] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#122D4A]">{selectedInstDetails.name}</h3>
                <span className="text-xs text-[#5A7184] font-mono">{selectedInstDetails.code}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#122D4A] bg-[#F8FBFF] p-4 rounded-xl border border-[#E2EDF8]">
              <div className="flex justify-between py-1 border-b border-[#E2EDF8]">
                <span className="text-[#5A7184]">Institution ID:</span>
                <span className="font-mono font-bold">{selectedInstDetails.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EDF8]">
                <span className="text-[#5A7184]">Subdomain:</span>
                <span className="font-mono text-[#3979C5]">{selectedInstDetails.subdomain}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EDF8]">
                <span className="text-[#5A7184]">Curriculum Board:</span>
                <span className="font-bold">{selectedInstDetails.board}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EDF8]">
                <span className="text-[#5A7184]">Dean / Contact:</span>
                <span>{selectedInstDetails.primaryContactName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EDF8]">
                <span className="text-[#5A7184]">Email:</span>
                <span>{selectedInstDetails.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2EDF8]">
                <span className="text-[#5A7184]">Phone:</span>
                <span>{selectedInstDetails.phone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#5A7184]">Database Isolation:</span>
                <span className="text-emerald-700 font-semibold">Row-Level Security (RLS)</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  handleLaunchTenantPortal(selectedInstDetails);
                  setSelectedInstDetails(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#3979C5] text-white font-bold text-xs hover:bg-[#205BA3] transition-colors"
              >
                Switch to this Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
