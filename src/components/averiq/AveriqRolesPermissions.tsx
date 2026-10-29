import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Users,
  KeyRound,
  Check,
  X,
  AlertCircle,
  Plus,
  Shield,
  FileText,
  Sliders,
  History,
  Info
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

interface RoleDefinition {
  id: string;
  name: string;
  badgeColor: string;
  description: string;
  userCount: number;
  isSystemRole: boolean;
  permissions: Record<string, boolean>;
}

interface PermissionGroup {
  groupName: string;
  keys: { key: string; label: string; description: string }[];
}

export const AveriqRolesPermissions: React.FC = () => {
  const { showToast } = useIMS();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-admin');
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    description: '',
    badgeColor: 'bg-indigo-600'
  });

  const permissionGroups: PermissionGroup[] = [
    {
      groupName: 'Student & Academic Roster',
      keys: [
        { key: 'student_view', label: 'View Student Directory', description: 'Access full student directory, batch assignments, and contact profiles' },
        { key: 'student_edit', label: 'Create & Edit Students', description: 'Add new student enrollments, modify batch or profile details' },
        { key: 'student_delete', label: 'Deactivate / Archive Student', description: 'Mark student as left, transfer, or archived in records' },
        { key: 'student_export', label: 'Export Student Data (CSV/Excel)', description: 'Download master academic and demographic data lists' }
      ]
    },
    {
      groupName: 'Fee Management & Accounts',
      keys: [
        { key: 'fee_view', label: 'View Fee Balances & Ledgers', description: 'Inspect billed fees, paid amounts, and pending balances' },
        { key: 'fee_collect', label: 'Record Fee Payments', description: 'Log UPI, NetBanking, Card, and Cash transactions' },
        { key: 'fee_receipt', label: 'Generate & Sign Receipts', description: 'Issue official stamped institutional payment receipts' },
        { key: 'fee_discount', label: 'Grant Fee Concession / Waiver', description: 'Apply merit scholarships and fee reductions' }
      ]
    },
    {
      groupName: 'Exams, Grades & Report Cards',
      keys: [
        { key: 'exam_create', label: 'Schedule New Examinations', description: 'Create Unit Tests, Semester 1 & 2 Boards, and term dates' },
        { key: 'exam_grade', label: 'Enter & Edit Student Marks', description: 'Submit subject-wise scores and evaluation grades' },
        { key: 'exam_publish', label: 'Publish Results & Report Cards', description: 'Release final scorecards to parent and student portals' }
      ]
    },
    {
      groupName: 'Timetable & Class Allocation',
      keys: [
        { key: 'timetable_view', label: 'View Master Timetables', description: 'See weekly schedules across all sections and lecture rooms' },
        { key: 'timetable_edit', label: 'Modify Schedules & Rooms', description: 'Allocate time slots, change classrooms, or assign substitutes' }
      ]
    },
    {
      groupName: 'Study Materials & Digital Library',
      keys: [
        { key: 'material_view', label: 'View & Download Resources', description: 'Access question papers, notes, formula sheets, and manuals' },
        { key: 'material_upload', label: 'Upload Study Materials', description: 'Publish documents, PDFs, and practice tests to students' }
      ]
    },
    {
      groupName: 'Communications & Announcements',
      keys: [
        { key: 'comm_broadcast', label: 'Broadcast Official Circulars', description: 'Send school-wide notices and urgent alerts' },
        { key: 'comm_sms', label: 'Trigger WhatsApp / SMS Blasts', description: 'Send fee reminder SMS and automated attendance alerts' }
      ]
    },
    {
      groupName: 'Administration & Security',
      keys: [
        { key: 'sec_roles', label: 'Manage Roles & RBAC', description: 'Configure access permissions and user credential privileges' },
        { key: 'sec_audit', label: 'View System Audit Logs', description: 'Inspect login histories, payment audit trails, and data changes' }
      ]
    }
  ];

  const [rolesList, setRolesList] = useState<RoleDefinition[]>([
    {
      id: 'role-super',
      name: 'Super Administrator',
      badgeColor: 'bg-red-600',
      description: 'Full unconstrained root authority over all academic, financial, faculty, and system configuration data.',
      userCount: 2,
      isSystemRole: true,
      permissions: {
        student_view: true, student_edit: true, student_delete: true, student_export: true,
        fee_view: true, fee_collect: true, fee_receipt: true, fee_discount: true,
        exam_create: true, exam_grade: true, exam_publish: true,
        timetable_view: true, timetable_edit: true,
        material_view: true, material_upload: true,
        comm_broadcast: true, comm_sms: true,
        sec_roles: true, sec_audit: true
      }
    },
    {
      id: 'role-admin',
      name: 'School Administrator / Principal',
      badgeColor: 'bg-blue-600',
      description: 'Daily operational management: admissions, fee reconciliation, faculty allocation, and circular publishing.',
      userCount: 3,
      isSystemRole: true,
      permissions: {
        student_view: true, student_edit: true, student_delete: false, student_export: true,
        fee_view: true, fee_collect: true, fee_receipt: true, fee_discount: true,
        exam_create: true, exam_grade: true, exam_publish: true,
        timetable_view: true, timetable_edit: true,
        material_view: true, material_upload: true,
        comm_broadcast: true, comm_sms: true,
        sec_roles: false, sec_audit: true
      }
    },
    {
      id: 'role-hod',
      name: 'Head of Department (HOD)',
      badgeColor: 'bg-purple-600',
      description: 'Academic oversight for specific departments, exam moderation, and curriculum syllabus pacing.',
      userCount: 4,
      isSystemRole: false,
      permissions: {
        student_view: true, student_edit: false, student_delete: false, student_export: true,
        fee_view: false, fee_collect: false, fee_receipt: false, fee_discount: false,
        exam_create: true, exam_grade: true, exam_publish: false,
        timetable_view: true, timetable_edit: true,
        material_view: true, material_upload: true,
        comm_broadcast: true, comm_sms: false,
        sec_roles: false, sec_audit: false
      }
    },
    {
      id: 'role-teacher',
      name: 'Teacher / Faculty Member',
      badgeColor: 'bg-emerald-600',
      description: 'Classroom instruction, daily attendance roll call, test score evaluation, and study notes publishing.',
      userCount: 5,
      isSystemRole: true,
      permissions: {
        student_view: true, student_edit: false, student_delete: false, student_export: false,
        fee_view: false, fee_collect: false, fee_receipt: false, fee_discount: false,
        exam_create: true, exam_grade: true, exam_publish: false,
        timetable_view: true, timetable_edit: false,
        material_view: true, material_upload: true,
        comm_broadcast: false, comm_sms: false,
        sec_roles: false, sec_audit: false
      }
    },
    {
      id: 'role-accountant',
      name: 'Cashier & Accounts Executive',
      badgeColor: 'bg-amber-600',
      description: 'Tuition fee collection, payment mode entry, invoice reconciliation, and defaulter tracking.',
      userCount: 2,
      isSystemRole: false,
      permissions: {
        student_view: true, student_edit: false, student_delete: false, student_export: true,
        fee_view: true, fee_collect: true, fee_receipt: true, fee_discount: false,
        exam_create: false, exam_grade: false, exam_publish: false,
        timetable_view: false, timetable_edit: false,
        material_view: false, material_upload: false,
        comm_broadcast: false, comm_sms: true,
        sec_roles: false, sec_audit: false
      }
    },
    {
      id: 'role-parent',
      name: 'Parent / Guardian',
      badgeColor: 'bg-indigo-600',
      description: 'Restricted to their enrolled child: attendance records, fee payment history, scorecards, and institute circulars.',
      userCount: 50,
      isSystemRole: true,
      permissions: {
        student_view: false, student_edit: false, student_delete: false, student_export: false,
        fee_view: true, fee_collect: true, fee_receipt: true, fee_discount: false,
        exam_create: false, exam_grade: false, exam_publish: false,
        timetable_view: true, timetable_edit: false,
        material_view: true, material_upload: false,
        comm_broadcast: false, comm_sms: false,
        sec_roles: false, sec_audit: false
      }
    },
    {
      id: 'role-student',
      name: 'Student Learner',
      badgeColor: 'bg-sky-600',
      description: 'Personal academic dashboard: class timetable, digital study notes, personal results, and assignment submissions.',
      userCount: 50,
      isSystemRole: true,
      permissions: {
        student_view: false, student_edit: false, student_delete: false, student_export: false,
        fee_view: false, fee_collect: false, fee_receipt: false, fee_discount: false,
        exam_create: false, exam_grade: false, exam_publish: false,
        timetable_view: true, timetable_edit: false,
        material_view: true, material_upload: false,
        comm_broadcast: false, comm_sms: false,
        sec_roles: false, sec_audit: false
      }
    }
  ]);

  const activeRole = rolesList.find(r => r.id === selectedRoleId) || rolesList[1];

  // Toggle permission
  const handleTogglePermission = (permKey: string) => {
    if (activeRole.id === 'role-super') {
      showToast('Super Administrator retains all system permissions by security policy.');
      return;
    }

    setRolesList(prev =>
      prev.map(r => {
        if (r.id === activeRole.id) {
          const updated = {
            ...r,
            permissions: {
              ...r.permissions,
              [permKey]: !r.permissions[permKey]
            }
          };
          return updated;
        }
        return r;
      })
    );

    const isNowGranted = !activeRole.permissions[permKey];
    showToast(`${isNowGranted ? 'Granted' : 'Revoked'}: ${permKey} for ${activeRole.name}`);
  };

  // Add Custom Role
  const handleAddRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleForm.name.trim()) return;

    const newRole: RoleDefinition = {
      id: `role-${Date.now()}`,
      name: newRoleForm.name,
      badgeColor: newRoleForm.badgeColor,
      description: newRoleForm.description || 'Custom staff role with tailored functional privileges.',
      userCount: 1,
      isSystemRole: false,
      permissions: {
        student_view: true,
        student_edit: false,
        student_delete: false,
        student_export: false,
        fee_view: false,
        fee_collect: false,
        fee_receipt: false,
        fee_discount: false,
        exam_create: false,
        exam_grade: false,
        exam_publish: false,
        timetable_view: true,
        timetable_edit: false,
        material_view: true,
        material_upload: false,
        comm_broadcast: false,
        comm_sms: false,
        sec_roles: false,
        sec_audit: false
      }
    };

    setRolesList([...rolesList, newRole]);
    setSelectedRoleId(newRole.id);
    setIsAddRoleModalOpen(false);
    setNewRoleForm({ name: '', description: '', badgeColor: 'bg-indigo-600' });
    showToast(`Custom role "${newRole.name}" created.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#102747] to-[#0A192F] rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 font-mono font-bold text-xs uppercase tracking-wider border border-purple-500/30">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs text-slate-400">Security & Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span>Roles and Permissions</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Audit and enforce granular access rights across students, faculty, accountants, parents, and system administrators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddRoleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* 2. Role Selector Tabs & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Role List Column */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            System & User Roles ({rolesList.length})
          </span>

          <div className="space-y-1.5">
            {rolesList.map(role => {
              const isSelected = role.id === activeRole.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {role.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {role.userCount} users
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {role.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Permissions Matrix for Selected Role */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Role Header Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeRole.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200 dark:border-blue-800">
                  {activeRole.isSystemRole ? 'Built-in Role' : 'Custom Configured'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeRole.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 shrink-0">
              <span className="text-slate-400 font-medium">Assigned Users:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{activeRole.userCount} accounts</strong>
            </div>
          </div>

          {/* Granular Permissions Sections */}
          <div className="space-y-4">
            {permissionGroups.map(group => (
              <div
                key={group.groupName}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{group.groupName}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.keys.map(perm => {
                    const isGranted = !!activeRole.permissions[perm.key];
                    return (
                      <div
                        key={perm.key}
                        onClick={() => handleTogglePermission(perm.key)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isGranted
                            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                            : 'bg-slate-50/40 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800 opacity-75'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isGranted ? 'bg-[#0056D6] text-white shadow-xs' : 'bg-slate-200 dark:bg-slate-700 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 dark:text-white">
                            {perm.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {perm.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Add Custom Role Modal */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Create Custom User Role</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddRoleModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Assistant / Examination Supervisor"
                  value={newRoleForm.name}
                  onChange={e => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Role Scope & Purpose</label>
                <textarea
                  rows={3}
                  placeholder="Describe functional duties, report hierarchy, and security clearance..."
                  value={newRoleForm.description}
                  onChange={e => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-bold"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
