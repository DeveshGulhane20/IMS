import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Role,
  Institute,
  User,
  TeacherProfile,
  StudentProfile,
  ParentProfile,
  Course,
  Subject,
  Batch,
  TimetableSlot,
  AttendanceRecord,
  AttendanceStatus,
  Test,
  TestResult,
  Homework,
  HomeworkSubmission,
  FeeInvoice,
  FeePayment,
  PerformanceAlert,
  ImprovementPlan,
  StudentRemark,
  Notice,
  Badge,
  AuditLog,
  InquiryLead,
  StudyMaterial,
  PTMMeeting,
  FinanceTransaction,
  SubstituteAssignment,
  ViewportMode
} from '../types/ims';
import {
  mockInstitute,
  mockUsers,
  mockTeachers,
  mockStudents,
  mockParents,
  mockCourses,
  mockSubjects,
  mockBatches,
  mockTimetable,
  initialAttendanceRecords,
  mockTests,
  mockTestResults,
  mockHomeworks,
  mockHomeworkSubmissions,
  mockFeeInvoices,
  mockFeePayments,
  mockPerformanceAlerts,
  mockImprovementPlans,
  mockStudentRemarks,
  mockNotices,
  mockBadges,
  mockAuditLogs,
  mockInquiryLeads,
  mockStudyMaterials,
  mockPTMs,
  mockFinanceTransactions,
  mockSubstituteAssignments
} from '../data/mockData';
import { computeStudentDiagnostics, StudentDiagnosticResult } from '../services/analyticsEngine';

interface IMSContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: User;
  switchUser: (userId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  isMobilePreviewOpen: boolean;
  setMobilePreviewOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Data Collections
  institute: Institute;
  users: User[];
  teachers: TeacherProfile[];
  students: StudentProfile[];
  parents: ParentProfile[];
  courses: Course[];
  subjects: Subject[];
  batches: Batch[];
  timetable: TimetableSlot[];
  attendanceRecords: AttendanceRecord[];
  tests: Test[];
  testResults: TestResult[];
  homeworks: Homework[];
  homeworkSubmissions: HomeworkSubmission[];
  feeInvoices: FeeInvoice[];
  feePayments: FeePayment[];
  performanceAlerts: PerformanceAlert[];
  improvementPlans: ImprovementPlan[];
  studentRemarks: StudentRemark[];
  notices: Notice[];
  badges: Badge[];
  auditLogs: AuditLog[];
  inquiries: InquiryLead[];
  studyMaterials: StudyMaterial[];
  ptmMeetings: PTMMeeting[];
  financeTransactions: FinanceTransaction[];
  substitutes: SubstituteAssignment[];

  // Helpers
  getStudentUser: (studentProfileId: string) => User | undefined;
  getTeacherUser: (teacherProfileId: string) => User | undefined;
  getBatchStudents: (batchId: string) => Array<{ student: StudentProfile; user: User }>;
  getStudentDiagnostic: (studentId: string) => StudentDiagnosticResult;
  getStudentPaidAmount: (studentName: string) => number;
  getStudentBalance: (studentName: string) => number;

  // Actions
  markBatchAttendance: (
    batchId: string,
    date: string,
    records: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>,
    remarks?: Record<string, string>
  ) => void;
  importBiometricAttendance: (csvText: string) => { matched: number; duplicates: number; unmatched: string[] };
  createTest: (
    test: Omit<Test, 'id'>,
    initialMarks?: Record<string, number>
  ) => void;
  saveTestMarks: (
    testId: string,
    results: Array<{ studentId: string; marksObtained: number; remarks?: string }>
  ) => void;
  togglePublishTest: (testId: string) => void;
  cancelTest: (testId: string) => void;
  createHomework: (hw: Omit<Homework, 'id' | 'totalSubmissions'>) => void;
  submitHomework: (homeworkId: string, studentId: string, fileName: string) => void;
  gradeHomework: (submissionId: string, grade: string, score: number, feedback: string) => void;
  collectFee: (studentName: string, amount: number, paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Bank', referenceNo?: string) => void;
  sendFeeReminders: () => number;
  createImprovementPlan: (plan: Omit<ImprovementPlan, 'id' | 'status'>) => void;
  togglePlanTask: (planId: string, taskId: string) => void;
  addStudentRemark: (studentId: string, category: string, comment: string) => void;
  publishNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  enrollStudent: (studentData: {
    name: string;
    batchName: string;
    gradeLevel: string;
    parentName: string;
    phone: string;
    totalFee: number;
  }) => void;
  updateStudentStatus: (studentId: string, status: 'Active' | 'Admission' | 'Inactive' | 'Leaving') => void;
  transferStudentBatch: (studentId: string, newBatchId: string) => void;
  resolveAlert: (alertId: string) => void;

  // CRM / Material / Finance / Timetable Actions
  addInquiry: (inquiry: Omit<InquiryLead, 'id'>) => void;
  updateInquiryStatus: (inquiryId: string, status: InquiryLead['status']) => void;
  updateInquiryFollowUp: (inquiryId: string, followUpDate: string) => void;
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedDate'>) => void;
  deleteStudyMaterial: (materialId: string) => void;
  schedulePTM: (ptm: Omit<PTMMeeting, 'id'>) => void;
  cancelPTM: (ptmId: string) => void;
  addFinanceTransaction: (entry: Omit<FinanceTransaction, 'id'>) => void;
  assignSubstitute: (batch: string, slot: string, substituteTeacher: string, originalTeacher?: string) => void;
  addCourse: (name: string) => void;
  toggleCourseStatus: (courseId: string) => void;
  addBatch: (name: string, courseName: string, teacherName: string) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => boolean;
}

const IMSContext = createContext<IMSContextType | undefined>(undefined);

export const IMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('STUDENT');
  const [currentUserId, setCurrentUserId] = useState<string>('u-student-aarav');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isMobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State Collections
  const [institute] = useState<Institute>(mockInstitute);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [teachers, setTeachers] = useState<TeacherProfile[]>(mockTeachers);
  const [students, setStudents] = useState<StudentProfile[]>(mockStudents);
  const [parents] = useState<ParentProfile[]>(mockParents);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(mockTimetable);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [tests, setTests] = useState<Test[]>(mockTests);
  const [testResults, setTestResults] = useState<TestResult[]>(mockTestResults);
  const [homeworks, setHomeworks] = useState<Homework[]>(mockHomeworks);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkSubmission[]>(mockHomeworkSubmissions);
  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>(mockFeeInvoices);
  const [feePayments, setFeePayments] = useState<FeePayment[]>(mockFeePayments);
  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>(mockPerformanceAlerts);
  const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>(mockImprovementPlans);
  const [studentRemarks, setStudentRemarks] = useState<StudentRemark[]>(mockStudentRemarks);
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [badges] = useState<Badge[]>(mockBadges);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [inquiries, setInquiries] = useState<InquiryLead[]>(mockInquiryLeads);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(mockStudyMaterials);
  const [ptmMeetings, setPtmMeetings] = useState<PTMMeeting[]>(mockPTMs);
  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>(mockFinanceTransactions);
  const [substitutes, setSubstitutes] = useState<SubstituteAssignment[]>(mockSubstituteAssignments);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'ADMIN') setCurrentUserId('u-admin');
    else if (newRole === 'TEACHER') setCurrentUserId('u-teacher-mehta');
    else if (newRole === 'STUDENT') setCurrentUserId('u-student-aarav');
    else if (newRole === 'PARENT') setCurrentUserId('u-parent-aarav');
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      setRoleState(user.role);
    }
  };

  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const getStudentUser = (studentProfileId: string) => {
    const prof = students.find(s => s.id === studentProfileId);
    return prof ? users.find(u => u.id === prof.userId) : undefined;
  };

  const getTeacherUser = (teacherProfileId: string) => {
    const prof = teachers.find(t => t.id === teacherProfileId);
    return prof ? users.find(u => u.id === prof.userId) : undefined;
  };

  const getBatchStudents = (batchId: string) => {
    return students
      .filter(s => s.batchId === batchId || s.batchName === batchId)
      .map(student => ({
        student,
        user: users.find(u => u.id === student.userId) || {
          id: student.userId,
          instituteId: 'inst-01',
          email: `${student.name.toLowerCase()}@tuitionpro.edu`,
          role: 'STUDENT' as Role,
          firstName: student.name,
          lastName: '',
          phone: student.phone,
          isActive: true
        }
      }));
  };

  const getStudentPaidAmount = (studentName: string) => {
    return feePayments
      .filter(p => p.studentName.toLowerCase() === studentName.toLowerCase())
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const getStudentBalance = (studentName: string) => {
    const st = students.find(s => s.name.toLowerCase() === studentName.toLowerCase());
    if (!st) return 0;
    return st.totalFee - getStudentPaidAmount(studentName);
  };

  const getStudentDiagnostic = (studentId: string): StudentDiagnosticResult => {
    const student = students.find(s => s.id === studentId || s.name === studentId);
    if (!student) {
      return {
        studentId,
        overallAverage: 0,
        classAverageDelta: 0,
        attendanceRate: 100,
        subjectWeaknesses: [],
        subjectStrengths: [],
        flags: [],
        automatedRecommendations: []
      };
    }

    const studentAtt = attendanceRecords.filter(a => a.studentId === student.id || a.studentName === student.name);
    const studentTestInputs = testResults
      .filter(tr => tr.studentId === student.id || tr.studentName === student.name)
      .map(tr => {
        const test = tests.find(t => t.id === tr.testId);
        if (!test) return null;
        const allScores = testResults.filter(r => r.testId === test.id);
        const avgMarks =
          allScores.length > 0
            ? allScores.reduce((acc, curr) => acc + curr.marksObtained, 0) / allScores.length
            : test.passingMarks;
        return {
          subjectName: test.subjectName,
          marksObtained: tr.marksObtained,
          maxMarks: test.maxMarks,
          testDate: test.testDate,
          classAveragePct: (avgMarks / test.maxMarks) * 100
        };
      })
      .filter(Boolean) as any[];

    return computeStudentDiagnostics(student.id, studentTestInputs, studentAtt, 1);
  };

  // Actions
  const markBatchAttendance = (
    batchId: string,
    date: string,
    records: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>,
    remarks?: Record<string, string>
  ) => {
    const newRecords: AttendanceRecord[] = [];
    const otherRecords = attendanceRecords.filter(r => !(r.date === date && Object.keys(records).includes(r.studentId)));

    Object.entries(records).forEach(([studentId, status]) => {
      const student = students.find(s => s.id === studentId || s.name === studentId);
      newRecords.push({
        id: `att-${date}-${studentId}-${Date.now()}`,
        sessionId: `sess-${date}`,
        studentId,
        studentName: student?.name || studentId,
        status,
        date,
        remarks: remarks?.[studentId]
      });
    });

    setAttendanceRecords([...otherRecords, ...newRecords]);

    // Recalculate streaks
    setStudents(prev =>
      prev.map(s => {
        if (records[s.id] || records[s.name]) {
          const st = records[s.id] || records[s.name];
          if (st === 'PRESENT' || st === 'LATE') {
            const next = s.currentStreak + 1;
            return { ...s, currentStreak: next, highestStreak: Math.max(s.highestStreak, next) };
          } else if (st === 'ABSENT') {
            return { ...s, currentStreak: 0 };
          }
        }
        return s;
      })
    );

    // Audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userId: currentUser.id,
      userName: currentUser.firstName,
      action: 'ATTENDANCE_SAVED',
      entity: `Batch: ${batchId}`,
      details: `Saved roll call for ${Object.keys(records).length} students on ${date}`,
      ipAddress: '192.168.1.1'
    };
    setAuditLogs(prev => [log, ...prev]);
    try {
      const offlineKey = 'ims-offline-attendance';
      const existing = JSON.parse(localStorage.getItem(offlineKey) || '[]');
      existing.unshift({ batchId, date, records, savedAt: new Date().toISOString(), synced: navigator.onLine });
      localStorage.setItem(offlineKey, JSON.stringify(existing.slice(0, 50)));
    } catch {}
    const offlineMsg = !navigator.onLine ? ' (saved offline)' : '';
    showToast(`Attendance saved for ${date}${offlineMsg}`);
  };

  const importBiometricAttendance = (csvText: string) => {
    let matched = 0;
    let duplicates = 0;
    const unmatched: string[] = [];

    const lines = csvText.split('\n');
    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 2) return;
      const [name, dt, val] = parts;
      const student = students.find(s => s.name.toLowerCase() === name.toLowerCase());
      if (!student) {
        unmatched.push(name);
        return;
      }
      const existing = attendanceRecords.find(a => a.date === dt && (a.studentId === student.id || a.studentName === student.name));
      if (existing) {
        duplicates++;
        return;
      }
      const newRec: AttendanceRecord = {
        id: `att-bio-${Date.now()}-${student.id}`,
        sessionId: `sess-${dt}`,
        studentId: student.id,
        studentName: student.name,
        date: dt,
        status: (val === 'A' ? 'ABSENT' : val === 'L' ? 'LATE' : 'PRESENT') as AttendanceStatus
      };
      setAttendanceRecords(prev => [...prev, newRec]);
      matched++;
    });

    showToast(`Biometric Import: ${matched} matched, ${duplicates} duplicates skipped`);
    return { matched, duplicates, unmatched };
  };

  const createTest = (test: Omit<Test, 'id'>, initialMarks?: Record<string, number>) => {
    const newTestId = `test-${Date.now()}`;
    const newTest: Test = { ...test, id: newTestId };
    setTests(prev => [newTest, ...prev]);

    if (initialMarks) {
      const results: TestResult[] = Object.entries(initialMarks).map(([studentId, marks]) => {
        const student = students.find(s => s.id === studentId || s.name === studentId);
        return {
          id: `tr-${newTestId}-${studentId}`,
          testId: newTestId,
          studentId,
          studentName: student?.name || studentId,
          marksObtained: marks,
          percentile: Math.min(99, Math.round((marks / test.maxMarks) * 100))
        };
      });
      setTestResults(prev => [...prev, ...results]);
    }
    showToast(`Scheduled exam: ${test.title}`);
  };

  const saveTestMarks = (testId: string, results: Array<{ studentId: string; marksObtained: number; remarks?: string }>) => {
    const test = tests.find(t => t.id === testId);
    const max = test?.maxMarks || 50;
    const newResults: TestResult[] = results.map(r => {
      const student = students.find(s => s.id === r.studentId || s.name === r.studentId);
      return {
        id: `tr-${testId}-${r.studentId}`,
        testId,
        studentId: r.studentId,
        studentName: student?.name || r.studentId,
        marksObtained: r.marksObtained,
        percentile: Math.round((r.marksObtained / max) * 100),
        remarks: r.remarks
      };
    });

    const otherResults = testResults.filter(tr => tr.testId !== testId);
    setTestResults([...otherResults, ...newResults]);
    showToast(`Marks committed for ${test?.title}`);
  };

  const togglePublishTest = (testId: string) => {
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, isPublished: !t.isPublished } : t))
    );
    showToast('Result publish state updated');
  };

  const cancelTest = (testId: string) => {
    setTests(prev =>
      prev.map(t => (t.id === testId ? { ...t, isCancelled: true } : t))
    );
    showToast('Exam cancelled');
  };

  const createHomework = (hw: Omit<Homework, 'id' | 'totalSubmissions'>) => {
    const newHw: Homework = { ...hw, id: `hw-${Date.now()}`, totalSubmissions: 0 };
    setHomeworks(prev => [newHw, ...prev]);
    showToast(`Assignment published: ${hw.title}`);
  };

  const submitHomework = (homeworkId: string, studentId: string, fileName: string) => {
    const newSubmission: HomeworkSubmission = {
      id: `sub-${Date.now()}`,
      homeworkId,
      studentId,
      submissionDate: new Date().toISOString().split('T')[0],
      fileName,
      status: 'SUBMITTED'
    };
    setHomeworkSubmissions(prev => [newSubmission, ...prev.filter(s => !(s.homeworkId === homeworkId && s.studentId === studentId))]);
    setHomeworks(prev =>
      prev.map(h => (h.id === homeworkId ? { ...h, totalSubmissions: h.totalSubmissions + 1 } : h))
    );
    showToast('Assignment submitted successfully!');
  };

  const gradeHomework = (submissionId: string, grade: string, score: number, feedback: string) => {
    setHomeworkSubmissions(prev =>
      prev.map(s => (s.id === submissionId ? { ...s, status: 'EVALUATED', grade, score, feedback } : s))
    );
    showToast('Grade and feedback saved!');
  };

  const collectFee = (studentName: string, amount: number, paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Bank', referenceNo?: string) => {
    const payment: FeePayment = {
      id: `pay-${Date.now()}`,
      studentName,
      amount,
      date: new Date().toISOString().split('T')[0],
      mode: paymentMethod,
      referenceNo: referenceNo || `REF-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setFeePayments(prev => [payment, ...prev]);

    // Also update student paidFee
    setStudents(prev =>
      prev.map(s => {
        if (s.name.toLowerCase() === studentName.toLowerCase()) {
          return { ...s, paidFee: s.paidFee + amount };
        }
        return s;
      })
    );

    // Also record into finance transactions
    const fin: FinanceTransaction = {
      id: `fin-${Date.now()}`,
      type: 'Credit',
      category: 'Student fees',
      amount,
      date: new Date().toISOString().split('T')[0],
      description: studentName,
      mode: paymentMethod
    };
    setFinanceTransactions(prev => [fin, ...prev]);

    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} recorded for ${studentName}`);
  };

  const sendFeeReminders = () => {
    const defaulters = students.filter(s => getStudentBalance(s.name) > 0);
    showToast(`Reminders queued for ${defaulters.length} parents (WhatsApp & SMS simulated)`);
    return defaulters.length;
  };

  const createImprovementPlan = (plan: Omit<ImprovementPlan, 'id' | 'status'>) => {
    const newPlan: ImprovementPlan = { ...plan, id: `plan-${Date.now()}`, status: 'IN_PROGRESS' };
    setImprovementPlans(prev => [newPlan, ...prev]);
    showToast('Remediation plan assigned');
  };

  const togglePlanTask = (planId: string, taskId: string) => {
    setImprovementPlans(prev =>
      prev.map(p => {
        if (p.id === planId) {
          const updated = p.tasks.map(t => (t.id === taskId ? { ...t, isDone: !t.isDone } : t));
          return { ...p, tasks: updated, status: updated.every(t => t.isDone) ? 'COMPLETED' : 'IN_PROGRESS' };
        }
        return p;
      })
    );
  };

  const addStudentRemark = (studentId: string, category: string, comment: string) => {
    const student = students.find(s => s.id === studentId || s.name === studentId);
    const newRemark: StudentRemark = {
      id: `rem-${Date.now()}`,
      studentId,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      authorRole: currentUser.title || currentUser.role,
      category,
      comment,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStudentRemarks(prev => [newRemark, ...prev]);
    showToast('Remark dispatched to parent feed');
  };

  const publishNotice = (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = { ...notice, id: `not-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    setNotices(prev => [newNotice, ...prev]);
    showToast('Notice published to circulars');
  };

  const enrollStudent = (studentData: {
    name: string;
    batchName: string;
    gradeLevel: string;
    parentName: string;
    phone: string;
    totalFee: number;
  }) => {
    const newId = `sp-${studentData.name.toLowerCase()}`;
    const newStudent: StudentProfile = {
      id: newId,
      userId: `u-${newId}`,
      name: studentData.name,
      batchId: `batch-${studentData.batchName.toLowerCase()}`,
      batchName: studentData.batchName,
      rollNumber: `${studentData.batchName}-${Math.floor(10 + Math.random() * 89)}`,
      admissionNumber: `ADM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`,
      admissionDate: new Date().toISOString().split('T')[0],
      gender: 'MALE',
      currentStreak: 0,
      highestStreak: 0,
      badgePoints: 50,
      gradeLevel: studentData.gradeLevel,
      status: 'Admission',
      parentName: studentData.parentName,
      phone: studentData.phone,
      totalFee: studentData.totalFee,
      paidFee: 0
    };
    setStudents(prev => [...prev, newStudent]);
    showToast(`Student ${studentData.name} enrolled in batch ${studentData.batchName}`);
  };

  const updateStudentStatus = (studentId: string, status: 'Active' | 'Admission' | 'Inactive' | 'Leaving') => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId || s.name === studentId ? { ...s, status } : s))
    );
    showToast(`Status updated to ${status}`);
  };

  const transferStudentBatch = (studentId: string, newBatchId: string) => {
    const targetBatch = batches.find(b => b.id === newBatchId || b.name === newBatchId);
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId || s.name === studentId
          ? { ...s, batchId: newBatchId, batchName: targetBatch?.name || newBatchId }
          : s
      )
    );
    showToast('Student batch transferred');
  };

  const resolveAlert = (alertId: string) => {
    setPerformanceAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, isResolved: true } : a))
    );
    showToast('Alert marked resolved');
  };

  // CRM Actions
  const addInquiry = (inquiry: Omit<InquiryLead, 'id'>) => {
    const newInq: InquiryLead = { ...inquiry, id: `inq-${Date.now()}` };
    setInquiries(prev => [newInq, ...prev]);
    showToast(`Inquiry added for ${inquiry.name}`);
  };

  const updateInquiryStatus = (inquiryId: string, status: InquiryLead['status']) => {
    setInquiries(prev =>
      prev.map(i => (i.id === inquiryId ? { ...i, status } : i))
    );
    showToast('Inquiry status updated');
  };

  const updateInquiryFollowUp = (inquiryId: string, followUpDate: string) => {
    setInquiries(prev =>
      prev.map(i => (i.id === inquiryId ? { ...i, followUpDate } : i))
    );
    showToast('Follow-up date saved');
  };

  // Study Material Actions
  const addStudyMaterial = (material: Omit<StudyMaterial, 'id' | 'uploadedDate'>) => {
    const newMat: StudyMaterial = {
      ...material,
      id: `mat-${Date.now()}`,
      uploadedDate: new Date().toISOString().split('T')[0]
    };
    setStudyMaterials(prev => [newMat, ...prev]);
    showToast(`Material uploaded: ${material.title}`);
  };

  const deleteStudyMaterial = (materialId: string) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== materialId));
    showToast('Material deleted');
  };

  // PTM Actions
  const schedulePTM = (ptm: Omit<PTMMeeting, 'id'>) => {
    const newPtm: PTMMeeting = { ...ptm, id: `ptm-${Date.now()}` };
    setPtmMeetings(prev => [newPtm, ...prev]);
    showToast(`PTM scheduled for ${ptm.date}`);
  };

  const cancelPTM = (ptmId: string) => {
    setPtmMeetings(prev => prev.filter(p => p.id !== ptmId));
    showToast('PTM cancelled');
  };

  // Finance Actions
  const addFinanceTransaction = (entry: Omit<FinanceTransaction, 'id'>) => {
    const newEntry: FinanceTransaction = { ...entry, id: `fin-${Date.now()}` };
    setFinanceTransactions(prev => [newEntry, ...prev]);
    showToast(`Finance entry ₹${entry.amount.toLocaleString('en-IN')} saved`);
  };

  // Substitute Teacher Assignment with conflict detection
  const assignSubstitute = (batch: string, slot: string, substituteTeacher: string, originalTeacher?: string) => {
    const newSub: SubstituteAssignment = {
      id: `sub-${Date.now()}`,
      batch,
      slot,
      substituteTeacher,
      originalTeacher,
      assignedAt: new Date().toISOString().split('T')[0]
    };
    setSubstitutes(prev => [newSub, ...prev]);
    showToast(`Substitute ${substituteTeacher} assigned to batch ${batch}!`);
  };

  const addCourse = (name: string) => {
    const newC: Course = {
      id: `course-${Date.now()}`,
      instituteId: 'inst-01',
      name,
      code: name.substring(0, 4).toUpperCase(),
      isActive: true
    };
    setCourses(prev => [...prev, newC]);
    showToast(`Course ${name} added`);
  };

  const toggleCourseStatus = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const addBatch = (name: string, courseName: string, teacherName: string) => {
    const newB: Batch = {
      id: `batch-${Date.now()}`,
      instituteId: 'inst-01',
      courseId: 'course-10',
      name,
      courseName,
      teacherName,
      startDate: new Date().toISOString().split('T')[0],
      maxCapacity: 35,
      enrolledCount: 0,
      roomNumber: 'Room R1'
    };
    setBatches(prev => [...prev, newB]);
    showToast(`Batch ${name} created`);
  };

  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    // Conflict check
    const conflict = timetable.find(
      s => s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime && (s.teacherName === slot.teacherName || s.batchId === slot.batchId || s.classroom === slot.classroom)
    );
    if (conflict) {
      showToast(`Conflict detected: ${conflict.teacherName === slot.teacherName ? 'Teacher' : conflict.batchId === slot.batchId ? 'Batch' : 'Room'} already occupied at this time!`);
      return false;
    }
    const newSlot: TimetableSlot = { ...slot, id: `slot-${Date.now()}` };
    setTimetable(prev => [...prev, newSlot]);
    showToast('Class slot scheduled successfully');
    return true;
  };

  return (
    <IMSContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        switchUser,
        isDarkMode,
        toggleDarkMode,
        viewportMode,
        setViewportMode,
        isMobilePreviewOpen,
        setMobilePreviewOpen,
        toastMessage,
        showToast,

        institute,
        users,
        teachers,
        students,
        parents,
        courses,
        subjects,
        batches,
        timetable,
        attendanceRecords,
        tests,
        testResults,
        homeworks,
        homeworkSubmissions,
        feeInvoices,
        feePayments,
        performanceAlerts,
        improvementPlans,
        studentRemarks,
        notices,
        badges,
        auditLogs,
        inquiries,
        studyMaterials,
        ptmMeetings,
        financeTransactions,
        substitutes,

        getStudentUser,
        getTeacherUser,
        getBatchStudents,
        getStudentDiagnostic,
        getStudentPaidAmount,
        getStudentBalance,

        markBatchAttendance,
        importBiometricAttendance,
        createTest,
        saveTestMarks,
        togglePublishTest,
        cancelTest,
        createHomework,
        submitHomework,
        gradeHomework,
        collectFee,
        sendFeeReminders,
        createImprovementPlan,
        togglePlanTask,
        addStudentRemark,
        publishNotice,
        enrollStudent,
        updateStudentStatus,
        transferStudentBatch,
        resolveAlert,

        addInquiry,
        updateInquiryStatus,
        updateInquiryFollowUp,
        addStudyMaterial,
        deleteStudyMaterial,
        schedulePTM,
        cancelPTM,
        addFinanceTransaction,
        assignSubstitute,
        addCourse,
        toggleCourseStatus,
        addBatch,
        addTimetableSlot
      }}
    >
      <div className={isDarkMode ? 'dark' : ''}>
        {children}
      </div>
    </IMSContext.Provider>
  );
};

export const useIMS = () => {
  const context = useContext(IMSContext);
  if (!context) throw new Error('useIMS must be used within IMSProvider');
  return context;
};
