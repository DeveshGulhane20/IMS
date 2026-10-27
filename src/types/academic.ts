export type SemesterType = 'sem1' | 'sem2';

export interface SubjectScore {
  subject: string;
  code: string;
  maxMarks: number;
  marksObtained: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  credits: number;
  gradePoint: number;
  remarks: string;
}

export interface SemesterRecord {
  semesterId: SemesterType;
  semesterName: string;
  academicYear: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  gpa: number;
  grade: string;
  rank: number;
  attendancePct: number;
  subjects: SubjectScore[];
  status: 'Passed' | 'Distinction' | 'Pending';
  remarks: string;
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  date: string;
  amount: number;
  mode: 'UPI' | 'NetBanking' | 'Card' | 'Cash';
  status: 'Completed' | 'Pending' | 'Failed';
  referenceNo: string;
  description: string;
}

export interface StudentFeeDetail {
  tuitionFee: number;
  laboratoryFee: number;
  libraryFee: number;
  sportsFee: number;
  transportFee: number;
  examFee: number;
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'OVERDUE';
  lastPaymentDate?: string;
  transactions: FeeTransaction[];
}

export interface MonthlyAttendance {
  month: string;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}

export interface StudentAttendanceDetail {
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  overallPercentage: number;
  sem1Percentage: number;
  sem2Percentage: number;
  monthlyTrends: MonthlyAttendance[];
}

export interface DetailedStudent {
  id: string;
  studentCode: string; // e.g. STU-2025-001
  rollNumber: string;
  name: string;
  avatarUrl?: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  bloodGroup: string;
  gradeLevel: string; // "Class 10", "Class 9", etc.
  section: string; // "A" or "B"
  batchName: string;
  batchId: string;
  status: 'Active' | 'Admission' | 'Inactive' | 'Leaving';
  parentName: string;
  parentId: string;
  phone: string;
  email: string;
  address: string;
  semesters: {
    sem1: SemesterRecord;
    sem2: SemesterRecord;
  };
  fees: StudentFeeDetail;
  attendance: StudentAttendanceDetail;
}

export interface DetailedTeacher {
  id: string;
  employeeCode: string; // e.g. EMP-FAC-01
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  primarySubject: string;
  department: string;
  joiningDate: string;
  workloadHoursPerWeek: number;
  assignedBatches: string[];
  assignedSubjects: string[];
  email: string;
  phone: string;
  rating: number; // e.g. 4.9
  totalStudentsTaught: number;
  avatarBg: string;
}

export interface DetailedParent {
  id: string;
  parentCode: string; // e.g. PAR-2025-001
  fatherName: string;
  motherName: string;
  primaryContactName: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
  relation: string;
  wardStudentCodes: string[];
  wardNames: string[];
}

export interface InquiryRecord {
  id: string;
  inquiryCode: string; // e.g. INQ-2025-101
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  targetClass: string;
  stream?: string;
  source: 'Website' | 'Walk-in' | 'Referral' | 'Social Media' | 'Education Expo';
  status: 'New' | 'Contacted' | 'Demo Scheduled' | 'Enrolled' | 'Lost';
  counselor: string;
  inquiryDate: string;
  followUpDate: string;
  notes: string;
}

export interface AcademicEvent {
  id: string;
  title: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Examination' | 'Workshop';
  type: 'Past' | 'Upcoming';
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  targetAudience: string;
  attendeesCount: number;
  status: 'Completed' | 'Scheduled' | 'Registration Open';
  description: string;
  highlights: string[];
}
