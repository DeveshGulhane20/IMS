export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE';

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'LATE' | 'EVALUATED';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';

export interface Institute {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email: string;
  logoUrl?: string;
  campusCount: number;
  totalStudents: number;
  totalFaculty: number;
}

export interface User {
  id: string;
  instituteId: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  title?: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  name: string;
  employeeCode: string;
  qualification: string;
  specialization: string;
  joiningDate: string;
  workloadHoursPerWeek: number;
  permittedModules: string;
}

export interface ParentProfile {
  id: string;
  userId: string;
  occupation: string;
  childrenIds: string[]; // studentProfile ids
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  parentId?: string;
  batchId: string;
  batchName: string;
  rollNumber: string;
  admissionNumber: string;
  admissionDate: string;
  dateOfBirth?: string;
  gender: Gender;
  bloodGroup?: string;
  address?: string;
  currentStreak: number;
  highestStreak: number;
  badgePoints: number;
  gradeLevel: string;
  status: 'Active' | 'Admission' | 'Inactive' | 'Leaving';
  parentName: string;
  phone: string;
  totalFee: number;
  paidFee: number;
}

export interface Course {
  id: string;
  instituteId: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface Subject {
  id: string;
  courseId: string;
  name: string;
  code: string;
}

export interface Batch {
  id: string;
  instituteId: string;
  courseId: string;
  name: string;
  courseName: string;
  teacherName: string;
  startDate: string;
  endDate?: string;
  maxCapacity: number;
  enrolledCount: number;
  roomNumber?: string;
}

export interface TimetableSlot {
  id: string;
  batchId: string;
  dayOfWeek: number; // 1 = Monday, 6 = Saturday
  dayName: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  classroom: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
  date: string;
}

export interface AttendanceSession {
  id: string;
  batchId: string;
  date: string;
  takenById: string;
  records: AttendanceRecord[];
}

export interface Test {
  id: string;
  batchId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  title: string;
  maxMarks: number;
  passingMarks: number;
  testDate: string;
  testTime?: string;
  isPublished: boolean;
  isCancelled?: boolean;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  marksObtained: number;
  percentile?: number;
  remarks?: string;
}

export interface Homework {
  id: string;
  batchId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  totalSubmissions: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submissionDate: string;
  fileUrl?: string;
  fileName?: string;
  status: SubmissionStatus;
  grade?: string;
  score?: number;
  feedback?: string;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: PaymentStatus;
  receiptNumber?: string;
  paymentMethod?: string;
  paidDate?: string;
  referenceNo?: string;
}

export interface FeePayment {
  id: string;
  studentName: string;
  amount: number;
  date: string;
  mode: 'Cash' | 'UPI' | 'Card' | 'Bank';
  referenceNo?: string;
}

export interface PerformanceAlert {
  id: string;
  studentId: string;
  studentName: string;
  batchName: string;
  category: 'ATTENDANCE' | 'ACADEMIC_DROP' | 'HOMEWORK' | 'CHRONIC_WEAKNESS';
  title: string;
  message: string;
  severity: SeverityLevel;
  isResolved: boolean;
  createdAt: string;
}

export interface ImprovementPlanTask {
  id: string;
  planId: string;
  assignedById: string;
  title: string;
  isDone: boolean;
}

export interface ImprovementPlan {
  id: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  focusArea: string;
  targetScore: number;
  deadline: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  tasks: ImprovementPlanTask[];
}

export interface StudentRemark {
  id: string;
  studentId: string;
  authorName: string;
  authorRole: string;
  category: string;
  comment: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  instituteId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  targetRole?: Role | 'ALL';
  priority: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  earnedAt: string;
  icon: string;
  description: string;
  category: 'ATTENDANCE' | 'ACADEMIC' | 'HOMEWORK' | 'LEADERSHIP';
  points: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  details: string;
  ipAddress: string;
}

// TuitionPro CRM & Institute Operations Models
export interface InquiryLead {
  id: string;
  name: string;
  phone: string;
  course: string;
  source: 'Call' | 'Walk-in' | 'Website' | 'Other';
  assignedTo: string;
  followUpDate: string;
  status: 'New' | 'Contacted' | 'Demo Scheduled' | 'Follow-Up' | 'Admitted' | 'Lost';
  notes?: string;
}

export interface StudyMaterial {
  id: string;
  type: 'Notes' | 'Worksheet' | 'Video';
  title: string;
  subject: string;
  batch: string;
  url: string;
  uploadedDate: string;
}

export interface PTMMeeting {
  id: string;
  date: string;
  time: string;
  location: string;
  batch: string;
  notes?: string;
}

export interface FinanceTransaction {
  id: string;
  type: 'Debit' | 'Credit';
  category: 'Rent' | 'Salaries' | 'Utilities' | 'Stationery' | 'Student fees' | 'Other';
  amount: number;
  date: string;
  description: string;
  mode: 'Cash' | 'UPI' | 'Card' | 'Bank';
}

export interface SubstituteAssignment {
  id: string;
  slot: string;
  batch: string;
  substituteTeacher: string;
  originalTeacher?: string;
  assignedAt: string;
}

export interface InstituteVisitFeedback {
  instituteName: string;
  monthlyPriceWilling: string;
  studentCount: string;
  pilotBatch: string;
  painPoint: string;
  screenRatings: Record<string, { rating: 'Must have' | 'Nice to have' | 'Not needed'; comment: string }>;
}
