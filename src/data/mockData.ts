import {
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
  SubstituteAssignment
} from '../types/ims';

export const mockInstitute: Institute = {
  id: 'inst-01',
  name: 'Sunrise Coaching Institute',
  code: 'SCI-01',
  address: '12 Education Hub, Ahmedabad',
  phone: '+91 98250 10000',
  email: 'admin@sunrisecoaching.edu',
  logoUrl: '',
  campusCount: 2,
  totalStudents: 120,
  totalFaculty: 12
};

export const mockUsers: User[] = [
  {
    id: 'u-admin',
    instituteId: 'inst-01',
    email: 'admin@tuitionpro.edu',
    role: 'ADMIN',
    firstName: 'Director',
    lastName: 'Admin',
    phone: '+91 98250 00001',
    isActive: true,
    title: 'Managing Director & Operations Head'
  },
  {
    id: 'u-superadmin',
    instituteId: 'inst-01',
    email: 'chancellor@tuitionpro.edu',
    role: 'SUPER_ADMIN',
    firstName: 'Dr. Arvind',
    lastName: 'Sharma',
    phone: '+91 98250 00002',
    isActive: true,
    title: 'Academic Trustee & Chairman'
  },
  {
    id: 'u-teacher-mehta',
    instituteId: 'inst-01',
    email: 'mehta@tuitionpro.edu',
    role: 'TEACHER',
    firstName: 'Prof.',
    lastName: 'Mehta',
    phone: '+91 98250 00011',
    isActive: true,
    title: 'Senior Faculty – Mathematics'
  },
  {
    id: 'u-teacher-shah',
    instituteId: 'inst-01',
    email: 'shah@tuitionpro.edu',
    role: 'TEACHER',
    firstName: 'Prof.',
    lastName: 'Shah',
    phone: '+91 98250 00012',
    isActive: true,
    title: 'Senior Faculty – Physics'
  },
  {
    id: 'u-teacher-patel',
    instituteId: 'inst-01',
    email: 'patel@tuitionpro.edu',
    role: 'TEACHER',
    firstName: 'Prof.',
    lastName: 'Patel',
    phone: '+91 98250 00013',
    isActive: true,
    title: 'Faculty – Science & Study Materials'
  },
  // Students
  {
    id: 'u-student-aarav',
    instituteId: 'inst-01',
    email: 'aarav@student.tuitionpro.edu',
    role: 'STUDENT',
    firstName: 'Aarav',
    lastName: 'Patel',
    phone: '9825010000',
    isActive: true,
    title: 'Class 10 Boards – Batch 10-A'
  },
  {
    id: 'u-student-diya',
    instituteId: 'inst-01',
    email: 'diya@student.tuitionpro.edu',
    role: 'STUDENT',
    firstName: 'Diya',
    lastName: 'Shah',
    phone: '9825010111',
    isActive: true,
    title: 'Class 10 Boards – Batch 10-A'
  },
  {
    id: 'u-student-kabir',
    instituteId: 'inst-01',
    email: 'kabir@student.tuitionpro.edu',
    role: 'STUDENT',
    firstName: 'Kabir',
    lastName: 'Sharma',
    phone: '9825010222',
    isActive: true,
    title: 'Class 10 Boards – Batch 10-A'
  },
  {
    id: 'u-student-meera',
    instituteId: 'inst-01',
    email: 'meera@student.tuitionpro.edu',
    role: 'STUDENT',
    firstName: 'Meera',
    lastName: 'Joshi',
    phone: '9825010333',
    isActive: true,
    title: 'JEE Foundation – Batch JEE-1'
  },
  {
    id: 'u-student-rohan',
    instituteId: 'inst-01',
    email: 'rohan@student.tuitionpro.edu',
    role: 'STUDENT',
    firstName: 'Rohan',
    lastName: 'Mehta',
    phone: '9825010444',
    isActive: true,
    title: 'JEE Foundation – Batch JEE-1'
  },
  {
    id: 'u-student-sana',
    instituteId: 'inst-01',
    email: 'sana@student.tuitionpro.edu',
    role: 'STUDENT',
    firstName: 'Sana',
    lastName: 'Khan',
    phone: '9825010555',
    isActive: true,
    title: 'JEE Foundation – Batch JEE-1'
  },
  // Parent
  {
    id: 'u-parent-aarav',
    instituteId: 'inst-01',
    email: 'parent.aarav@gmail.com',
    role: 'PARENT',
    firstName: 'Aarav',
    lastName: 'Parent',
    phone: '9825010000',
    isActive: true,
    title: 'Guardian of Aarav (Batch 10-A)'
  }
];

export const mockTeachers: TeacherProfile[] = [
  {
    id: 'tp-mehta',
    userId: 'u-teacher-mehta',
    name: 'Mehta',
    employeeCode: 'EMP-FAC-01',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    specialization: 'Maths (Algebra & Calculus)',
    joiningDate: '2022-06-01',
    workloadHoursPerWeek: 22,
    permittedModules: 'Attendance, Marks, Timetable'
  },
  {
    id: 'tp-shah',
    userId: 'u-teacher-shah',
    name: 'Shah',
    employeeCode: 'EMP-FAC-02',
    qualification: 'M.Sc. Physics (IIT Bombay)',
    specialization: 'Physics (Mechanics & Waves)',
    joiningDate: '2021-08-15',
    workloadHoursPerWeek: 20,
    permittedModules: 'Attendance, Marks, Tests'
  },
  {
    id: 'tp-patel',
    userId: 'u-teacher-patel',
    name: 'Patel',
    employeeCode: 'EMP-FAC-03',
    qualification: 'M.Sc. Chemistry, M.Phil',
    specialization: 'Chemistry & Biology',
    joiningDate: '2023-01-10',
    workloadHoursPerWeek: 18,
    permittedModules: 'Study material, Attendance'
  }
];

export const mockStudents: StudentProfile[] = [
  {
    id: 'sp-aarav',
    userId: 'u-student-aarav',
    name: 'Aarav',
    batchId: 'batch-10a',
    batchName: '10-A',
    rollNumber: '10A-01',
    admissionNumber: 'ADM-2026-001',
    admissionDate: '2026-06-10',
    dateOfBirth: '2010-04-12',
    gender: 'MALE',
    bloodGroup: 'O+',
    address: '42 Pinecrest Avenue',
    currentStreak: 16,
    highestStreak: 22,
    badgePoints: 420,
    gradeLevel: '10',
    status: 'Active',
    parentName: 'Aarav Parent',
    phone: '9825010000',
    totalFee: 24000,
    paidFee: 12000
  },
  {
    id: 'sp-diya',
    userId: 'u-student-diya',
    name: 'Diya',
    batchId: 'batch-10a',
    batchName: '10-A',
    rollNumber: '10A-02',
    admissionNumber: 'ADM-2026-002',
    admissionDate: '2026-06-10',
    gender: 'FEMALE',
    bloodGroup: 'A+',
    address: '88 Cedar Boulevard',
    currentStreak: 12,
    highestStreak: 18,
    badgePoints: 380,
    gradeLevel: '10',
    status: 'Active',
    parentName: 'Diya Parent',
    phone: '9825010111',
    totalFee: 24000,
    paidFee: 24000
  },
  {
    id: 'sp-kabir',
    userId: 'u-student-kabir',
    name: 'Kabir',
    batchId: 'batch-10a',
    batchName: '10-A',
    rollNumber: '10A-03',
    admissionNumber: 'ADM-2026-003',
    admissionDate: '2026-06-10',
    gender: 'MALE',
    bloodGroup: 'B+',
    address: '14 Elm Road',
    currentStreak: 3,
    highestStreak: 7,
    badgePoints: 120,
    gradeLevel: '10',
    status: 'Active',
    parentName: 'Kabir Parent',
    phone: '9825010222',
    totalFee: 24000,
    paidFee: 0
  },
  {
    id: 'sp-meera',
    userId: 'u-student-meera',
    name: 'Meera',
    batchId: 'batch-jee1',
    batchName: 'JEE-1',
    rollNumber: 'JEE-01',
    admissionNumber: 'ADM-2026-004',
    admissionDate: '2026-06-10',
    gender: 'FEMALE',
    bloodGroup: 'AB+',
    address: '23 Willow Court',
    currentStreak: 14,
    highestStreak: 20,
    badgePoints: 450,
    gradeLevel: '11',
    status: 'Active',
    parentName: 'Meera Parent',
    phone: '9825010333',
    totalFee: 36000,
    paidFee: 18000
  },
  {
    id: 'sp-rohan',
    userId: 'u-student-rohan',
    name: 'Rohan',
    batchId: 'batch-jee1',
    batchName: 'JEE-1',
    rollNumber: 'JEE-02',
    admissionNumber: 'ADM-2026-005',
    admissionDate: '2026-06-10',
    gender: 'MALE',
    bloodGroup: 'O-',
    address: '77 Silicon Grove',
    currentStreak: 1,
    highestStreak: 6,
    badgePoints: 95,
    gradeLevel: '11',
    status: 'Active',
    parentName: 'Rohan Parent',
    phone: '9825010444',
    totalFee: 36000,
    paidFee: 9000
  },
  {
    id: 'sp-sana',
    userId: 'u-student-sana',
    name: 'Sana',
    batchId: 'batch-jee1',
    batchName: 'JEE-1',
    rollNumber: 'JEE-03',
    admissionNumber: 'ADM-2026-006',
    admissionDate: '2026-06-10',
    gender: 'FEMALE',
    bloodGroup: 'A-',
    address: '109 Orchard Lane',
    currentStreak: 11,
    highestStreak: 17,
    badgePoints: 340,
    gradeLevel: '11',
    status: 'Active',
    parentName: 'Sana Parent',
    phone: '9825010555',
    totalFee: 36000,
    paidFee: 0
  }
];

export const mockParents: ParentProfile[] = [
  {
    id: 'pp-aarav',
    userId: 'u-parent-aarav',
    occupation: 'Senior Engineer',
    childrenIds: ['sp-aarav']
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course-10',
    instituteId: 'inst-01',
    name: 'Class 10 Boards',
    code: 'CBSE-10',
    description: 'Comprehensive curriculum for Board Examination preparation',
    isActive: true
  },
  {
    id: 'course-jee',
    instituteId: 'inst-01',
    name: 'JEE Foundation',
    code: 'JEE-FND',
    description: 'Rigorous engineering entrance foundation for 11th & 12th',
    isActive: true
  },
  {
    id: 'course-neet',
    instituteId: 'inst-01',
    name: 'NEET Pre-Medical',
    code: 'NEET-PM',
    description: 'Medical entrance preparatory track',
    isActive: true
  }
];

export const mockSubjects: Subject[] = [
  { id: 'sub-maths', courseId: 'course-10', name: 'Maths', code: 'MTH-10' },
  { id: 'sub-science', courseId: 'course-10', name: 'Science', code: 'SCI-10' },
  { id: 'sub-physics', courseId: 'course-jee', name: 'Physics', code: 'PHY-JEE' },
  { id: 'sub-chem', courseId: 'course-jee', name: 'Chemistry', code: 'CHM-JEE' }
];

export const mockBatches: Batch[] = [
  {
    id: 'batch-10a',
    instituteId: 'inst-01',
    courseId: 'course-10',
    name: '10-A',
    courseName: 'Class 10 Boards',
    teacherName: 'Mehta',
    startDate: '2026-06-15',
    maxCapacity: 35,
    enrolledCount: 3,
    roomNumber: 'Room R1'
  },
  {
    id: 'batch-jee1',
    instituteId: 'inst-01',
    courseId: 'course-jee',
    name: 'JEE-1',
    courseName: 'JEE Foundation',
    teacherName: 'Shah',
    startDate: '2026-06-15',
    maxCapacity: 35,
    enrolledCount: 3,
    roomNumber: 'Room R2'
  }
];

export const mockTimetable: TimetableSlot[] = [
  { id: 'slot-1', batchId: 'batch-10a', dayOfWeek: 1, dayName: 'Mon', startTime: '16:00', endTime: '17:30', subjectName: 'Maths', teacherName: 'Mehta', classroom: 'R1' },
  { id: 'slot-2', batchId: 'batch-jee1', dayOfWeek: 1, dayName: 'Mon', startTime: '18:00', endTime: '19:30', subjectName: 'Physics', teacherName: 'Shah', classroom: 'R2' },
  { id: 'slot-3', batchId: 'batch-jee1', dayOfWeek: 2, dayName: 'Tue', startTime: '16:00', endTime: '17:30', subjectName: 'Physics', teacherName: 'Shah', classroom: 'R2' },
  { id: 'slot-4', batchId: 'batch-10a', dayOfWeek: 3, dayName: 'Wed', startTime: '16:00', endTime: '17:30', subjectName: 'Science', teacherName: 'Patel', classroom: 'R1' },
  { id: 'slot-5', batchId: 'batch-jee1', dayOfWeek: 4, dayName: 'Thu', startTime: '17:00', endTime: '18:30', subjectName: 'Chemistry', teacherName: 'Patel', classroom: 'R2' },
  { id: 'slot-6', batchId: 'batch-10a', dayOfWeek: 5, dayName: 'Fri', startTime: '16:00', endTime: '17:30', subjectName: 'Maths (Doubt Clinic)', teacherName: 'Mehta', classroom: 'R1' }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  // 2026-10-19
  { id: 'att-1-1', sessionId: 'sess-2026-10-19', studentId: 'sp-aarav', studentName: 'Aarav', date: '2026-10-19', status: 'PRESENT' },
  { id: 'att-1-2', sessionId: 'sess-2026-10-19', studentId: 'sp-diya', studentName: 'Diya', date: '2026-10-19', status: 'PRESENT' },
  { id: 'att-1-3', sessionId: 'sess-2026-10-19', studentId: 'sp-kabir', studentName: 'Kabir', date: '2026-10-19', status: 'PRESENT' },
  { id: 'att-1-4', sessionId: 'sess-2026-10-19', studentId: 'sp-meera', studentName: 'Meera', date: '2026-10-19', status: 'PRESENT' },
  { id: 'att-1-5', sessionId: 'sess-2026-10-19', studentId: 'sp-rohan', studentName: 'Rohan', date: '2026-10-19', status: 'ABSENT' },
  { id: 'att-1-6', sessionId: 'sess-2026-10-19', studentId: 'sp-sana', studentName: 'Sana', date: '2026-10-19', status: 'PRESENT' },

  // 2026-10-20
  { id: 'att-2-1', sessionId: 'sess-2026-10-20', studentId: 'sp-aarav', studentName: 'Aarav', date: '2026-10-20', status: 'PRESENT' },
  { id: 'att-2-2', sessionId: 'sess-2026-10-20', studentId: 'sp-diya', studentName: 'Diya', date: '2026-10-20', status: 'PRESENT' },
  { id: 'att-2-3', sessionId: 'sess-2026-10-20', studentId: 'sp-kabir', studentName: 'Kabir', date: '2026-10-20', status: 'ABSENT' },
  { id: 'att-2-4', sessionId: 'sess-2026-10-20', studentId: 'sp-meera', studentName: 'Meera', date: '2026-10-20', status: 'PRESENT' },
  { id: 'att-2-5', sessionId: 'sess-2026-10-20', studentId: 'sp-rohan', studentName: 'Rohan', date: '2026-10-20', status: 'ABSENT' },
  { id: 'att-2-6', sessionId: 'sess-2026-10-20', studentId: 'sp-sana', studentName: 'Sana', date: '2026-10-20', status: 'PRESENT' },

  // 2026-10-21
  { id: 'att-3-1', sessionId: 'sess-2026-10-21', studentId: 'sp-aarav', studentName: 'Aarav', date: '2026-10-21', status: 'PRESENT' },
  { id: 'att-3-2', sessionId: 'sess-2026-10-21', studentId: 'sp-diya', studentName: 'Diya', date: '2026-10-21', status: 'PRESENT' },
  { id: 'att-3-3', sessionId: 'sess-2026-10-21', studentId: 'sp-kabir', studentName: 'Kabir', date: '2026-10-21', status: 'PRESENT' },
  { id: 'att-3-4', sessionId: 'sess-2026-10-21', studentId: 'sp-meera', studentName: 'Meera', date: '2026-10-21', status: 'PRESENT' },
  { id: 'att-3-5', sessionId: 'sess-2026-10-21', studentId: 'sp-rohan', studentName: 'Rohan', date: '2026-10-21', status: 'ABSENT' },
  { id: 'att-3-6', sessionId: 'sess-2026-10-21', studentId: 'sp-sana', studentName: 'Sana', date: '2026-10-21', status: 'PRESENT' },

  // 2026-10-22
  { id: 'att-4-1', sessionId: 'sess-2026-10-22', studentId: 'sp-aarav', studentName: 'Aarav', date: '2026-10-22', status: 'PRESENT' },
  { id: 'att-4-2', sessionId: 'sess-2026-10-22', studentId: 'sp-diya', studentName: 'Diya', date: '2026-10-22', status: 'PRESENT' },
  { id: 'att-4-3', sessionId: 'sess-2026-10-22', studentId: 'sp-kabir', studentName: 'Kabir', date: '2026-10-22', status: 'PRESENT' },
  { id: 'att-4-4', sessionId: 'sess-2026-10-22', studentId: 'sp-meera', studentName: 'Meera', date: '2026-10-22', status: 'PRESENT' },
  { id: 'att-4-5', sessionId: 'sess-2026-10-22', studentId: 'sp-rohan', studentName: 'Rohan', date: '2026-10-22', status: 'PRESENT' },
  { id: 'att-4-6', sessionId: 'sess-2026-10-22', studentId: 'sp-sana', studentName: 'Sana', date: '2026-10-22', status: 'PRESENT' }
];

export const mockTests: Test[] = [
  {
    id: 'test-ut1',
    batchId: 'batch-10a',
    subjectId: 'sub-maths',
    subjectName: 'Maths',
    teacherId: 'tp-mehta',
    title: 'Unit Test 1',
    maxMarks: 50,
    passingMarks: 17,
    testDate: '2026-08-20',
    testTime: '10:00',
    isPublished: true
  },
  {
    id: 'test-ut2',
    batchId: 'batch-10a',
    subjectId: 'sub-maths',
    subjectName: 'Maths',
    teacherId: 'tp-mehta',
    title: 'Unit Test 2',
    maxMarks: 50,
    passingMarks: 17,
    testDate: '2026-09-25',
    testTime: '10:00',
    isPublished: true
  },
  {
    id: 'test-phy1',
    batchId: 'batch-jee1',
    subjectId: 'sub-physics',
    subjectName: 'Physics',
    teacherId: 'tp-shah',
    title: 'Physics T1',
    maxMarks: 100,
    passingMarks: 33,
    testDate: '2026-08-22',
    testTime: '11:00',
    isPublished: true
  },
  {
    id: 'test-phy2',
    batchId: 'batch-jee1',
    subjectId: 'sub-physics',
    subjectName: 'Physics',
    teacherId: 'tp-shah',
    title: 'Physics T2',
    maxMarks: 100,
    passingMarks: 33,
    testDate: '2026-10-03',
    testTime: '11:00',
    isPublished: true
  },
  {
    id: 'test-ut3',
    batchId: 'batch-10a',
    subjectId: 'sub-maths',
    subjectName: 'Maths',
    teacherId: 'tp-mehta',
    title: 'Unit Test 3',
    maxMarks: 50,
    passingMarks: 17,
    testDate: '2026-11-12',
    testTime: '10:00',
    isPublished: false
  }
];

export const mockTestResults: TestResult[] = [
  // UT-1
  { id: 'tr-1-aarav', testId: 'test-ut1', studentId: 'sp-aarav', studentName: 'Aarav', marksObtained: 41, percentile: 88 },
  { id: 'tr-1-diya', testId: 'test-ut1', studentId: 'sp-diya', studentName: 'Diya', marksObtained: 38, percentile: 80 },
  { id: 'tr-1-kabir', testId: 'test-ut1', studentId: 'sp-kabir', studentName: 'Kabir', marksObtained: 30, percentile: 60 },

  // UT-2
  { id: 'tr-2-aarav', testId: 'test-ut2', studentId: 'sp-aarav', studentName: 'Aarav', marksObtained: 44, percentile: 94 },
  { id: 'tr-2-diya', testId: 'test-ut2', studentId: 'sp-diya', studentName: 'Diya', marksObtained: 33, percentile: 70 },
  { id: 'tr-2-kabir', testId: 'test-ut2', studentId: 'sp-kabir', studentName: 'Kabir', marksObtained: 18, percentile: 25 },

  // Physics T1
  { id: 'tr-3-meera', testId: 'test-phy1', studentId: 'sp-meera', studentName: 'Meera', marksObtained: 72, percentile: 76 },
  { id: 'tr-3-rohan', testId: 'test-phy1', studentId: 'sp-rohan', studentName: 'Rohan', marksObtained: 60, percentile: 60 },
  { id: 'tr-3-sana', testId: 'test-phy1', studentId: 'sp-sana', studentName: 'Sana', marksObtained: 81, percentile: 86 },

  // Physics T2
  { id: 'tr-4-meera', testId: 'test-phy2', studentId: 'sp-meera', studentName: 'Meera', marksObtained: 78, percentile: 82 },
  { id: 'tr-4-rohan', testId: 'test-phy2', studentId: 'sp-rohan', studentName: 'Rohan', marksObtained: 41, percentile: 35 },
  { id: 'tr-4-sana', testId: 'test-phy2', studentId: 'sp-sana', studentName: 'Sana', marksObtained: 84, percentile: 90 }
];

export const mockFeePayments: FeePayment[] = [
  { id: 'pay-1', studentName: 'Aarav', amount: 12000, date: '2026-06-10', mode: 'UPI', referenceNo: 'U1001' },
  { id: 'pay-2', studentName: 'Diya', amount: 24000, date: '2026-06-12', mode: 'Cash', referenceNo: 'CASH-REC-10' },
  { id: 'pay-3', studentName: 'Meera', amount: 18000, date: '2026-07-01', mode: 'Bank', referenceNo: 'B554' },
  { id: 'pay-4', studentName: 'Rohan', amount: 9000, date: '2026-08-05', mode: 'UPI', referenceNo: 'U1130' }
];

export const mockFeeInvoices: FeeInvoice[] = [
  { id: 'inv-aarav', studentId: 'sp-aarav', studentName: 'Aarav', title: 'Class 10 Boards Annual Tuition', amount: 24000, paidAmount: 12000, dueDate: '2026-11-05', status: 'PARTIAL', receiptNumber: 'REC-U1001', paymentMethod: 'UPI', paidDate: '2026-06-10' },
  { id: 'inv-diya', studentId: 'sp-diya', studentName: 'Diya', title: 'Class 10 Boards Annual Tuition', amount: 24000, paidAmount: 24000, dueDate: '2026-11-05', status: 'PAID', receiptNumber: 'REC-CSH-12', paymentMethod: 'Cash', paidDate: '2026-06-12' },
  { id: 'inv-kabir', studentId: 'sp-kabir', studentName: 'Kabir', title: 'Class 10 Boards Annual Tuition', amount: 24000, paidAmount: 0, dueDate: '2026-11-05', status: 'DUE' },
  { id: 'inv-meera', studentId: 'sp-meera', studentName: 'Meera', title: 'JEE Foundation Full Tuition', amount: 36000, paidAmount: 18000, dueDate: '2026-11-05', status: 'PARTIAL', receiptNumber: 'REC-B554', paymentMethod: 'Bank', paidDate: '2026-07-01' },
  { id: 'inv-rohan', studentId: 'sp-rohan', studentName: 'Rohan', title: 'JEE Foundation Full Tuition', amount: 36000, paidAmount: 9000, dueDate: '2026-11-05', status: 'PARTIAL', receiptNumber: 'REC-U1130', paymentMethod: 'UPI', paidDate: '2026-08-05' },
  { id: 'inv-sana', studentId: 'sp-sana', studentName: 'Sana', title: 'JEE Foundation Full Tuition', amount: 36000, paidAmount: 0, dueDate: '2026-11-05', status: 'DUE' }
];

export const mockInquiryLeads: InquiryLead[] = [
  { id: 'inq-1', name: 'Isha Desai', phone: '9876500011', course: 'JEE Foundation', source: 'Walk-in', assignedTo: 'Admin', followUpDate: '2026-10-24', status: 'New', notes: 'Interested in weekend batch timing' },
  { id: 'inq-2', name: 'Yash Jain', phone: '9876500022', course: 'Class 10 Boards', source: 'Call', assignedTo: 'Admin', followUpDate: '2026-10-20', status: 'Follow-Up', notes: 'Wants discount for twin brother admission' },
  { id: 'inq-3', name: 'Neha Verma', phone: '9876500033', course: 'JEE Foundation', source: 'Website', assignedTo: 'Mehta', followUpDate: '2026-10-25', status: 'Demo Scheduled', notes: 'Trial class scheduled for Saturday' },
  { id: 'inq-4', name: 'Arjun Patel', phone: '9876500044', course: 'Class 10 Boards', source: 'Walk-in', assignedTo: 'Admin', followUpDate: '2026-10-18', status: 'Admitted', notes: 'Completed registration and payment' }
];

export const mockStudyMaterials: StudyMaterial[] = [
  { id: 'mat-1', type: 'Notes', title: 'Trigonometry formula sheet & theorems', subject: 'Maths', batch: '10-A', url: 'trig-notes.pdf', uploadedDate: '2026-09-10' },
  { id: 'mat-2', type: 'Video', title: 'Newton Laws of Motion masterclass', subject: 'Physics', batch: 'JEE-1', url: 'https://www.youtube.com', uploadedDate: '2026-09-18' },
  { id: 'mat-3', type: 'Worksheet', title: 'Quadratic equations practice set (50 problems)', subject: 'Maths', batch: '10-A', url: 'quadratic-practice.pdf', uploadedDate: '2026-10-02' },
  { id: 'mat-4', type: 'Notes', title: 'Electrostatics & Coulomb Law revision', subject: 'Physics', batch: 'JEE-1', url: 'electrostatics.pdf', uploadedDate: '2026-10-14' }
];

export const mockPTMs: PTMMeeting[] = [
  { id: 'ptm-1', date: '2026-10-28', time: '17:30', location: 'Hall A & Online Zoom', batch: '10-A', notes: 'Mid-term results review and study schedule planning' },
  { id: 'ptm-2', date: '2026-11-04', time: '18:00', location: 'Conference Room 2', batch: 'JEE-1', notes: 'Advanced problem clinic evaluation' }
];

export const mockFinanceTransactions: FinanceTransaction[] = [
  { id: 'fin-1', type: 'Debit', category: 'Rent', amount: 30000, date: '2026-10-01', description: 'Main Coaching Branch Monthly Lease', mode: 'Bank' },
  { id: 'fin-2', type: 'Debit', category: 'Salaries', amount: 45000, date: '2026-10-05', description: 'Faculty & Administrative Staff Salary', mode: 'Bank' },
  { id: 'fin-3', type: 'Debit', category: 'Utilities', amount: 4800, date: '2026-10-08', description: 'High-speed broadband & power utility', mode: 'UPI' },
  { id: 'fin-4', type: 'Debit', category: 'Stationery', amount: 2500, date: '2026-10-12', description: 'Examination answer booklets and test sheets', mode: 'Cash' }
];

export const mockSubstituteAssignments: SubstituteAssignment[] = [
  { id: 'sub-1', slot: 'Mon 16:00', batch: '10-A', substituteTeacher: 'Patel', originalTeacher: 'Mehta', assignedAt: '2026-10-19' }
];

export const mockHomeworks: Homework[] = [
  {
    id: 'hw-01',
    batchId: 'batch-10a',
    subjectId: 'sub-maths',
    subjectName: 'Maths',
    title: 'Trigonometry Heights & Distances Exercise 9.1',
    description: 'Solve questions 1 through 16 with clear diagrammatic elevations.',
    dueDate: '2026-10-28',
    totalSubmissions: 2
  },
  {
    id: 'hw-02',
    batchId: 'batch-jee1',
    subjectId: 'sub-physics',
    subjectName: 'Physics',
    title: 'Rotational Kinematics & Moment of Inertia',
    description: 'Calculate principal moments for composite cylindrical bodies.',
    dueDate: '2026-10-30',
    totalSubmissions: 2
  }
];

export const mockHomeworkSubmissions: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-01',
    studentId: 'sp-aarav',
    submissionDate: '2026-10-26',
    fileName: 'aarav_trig_assignment.pdf',
    status: 'EVALUATED',
    grade: 'A+',
    score: 48,
    feedback: 'Flawless geometrical proofs and angle conversions.'
  },
  {
    id: 'sub-2',
    homeworkId: 'hw-02',
    studentId: 'sp-meera',
    submissionDate: '2026-10-27',
    fileName: 'meera_physics_pset.pdf',
    status: 'SUBMITTED',
    grade: undefined,
    score: undefined
  }
];

export const mockPerformanceAlerts: PerformanceAlert[] = [
  {
    id: 'alert-01',
    studentId: 'sp-rohan',
    studentName: 'Rohan (JEE-1)',
    batchName: 'JEE-1',
    category: 'ATTENDANCE',
    title: 'Attendance Dropped to 25%',
    message: 'Absence threshold breached: absent 3 out of 4 recorded days.',
    severity: 'CRITICAL',
    isResolved: false,
    createdAt: '2026-10-22'
  },
  {
    id: 'alert-02',
    studentId: 'sp-rohan',
    studentName: 'Rohan (JEE-1)',
    batchName: 'JEE-1',
    category: 'ACADEMIC_DROP',
    title: 'Dropped 19 Points in Physics',
    message: 'Physics T2 dropped from 60% to 41% (-19% contraction). Remedial session needed.',
    severity: 'HIGH',
    isResolved: false,
    createdAt: '2026-10-04'
  },
  {
    id: 'alert-03',
    studentId: 'sp-kabir',
    studentName: 'Kabir (10-A)',
    batchName: '10-A',
    category: 'CHRONIC_WEAKNESS',
    title: 'Below 40% in Unit Test 2',
    message: 'Scored 18/50 (36%) in Maths. Passed threshold is 17.',
    severity: 'MEDIUM',
    isResolved: false,
    createdAt: '2026-09-26'
  }
];

export const mockImprovementPlans: ImprovementPlan[] = [
  {
    id: 'plan-01',
    studentId: 'sp-rohan',
    studentName: 'Rohan',
    subjectName: 'Physics',
    focusArea: 'Laws of Motion & Vector Decomposition',
    targetScore: 70,
    deadline: '2026-11-20',
    status: 'IN_PROGRESS',
    tasks: [
      { id: 't-1', planId: 'plan-01', assignedById: 'tp-shah', title: 'Complete Newton Law Practice Worksheet Set B', isDone: true },
      { id: 't-2', planId: 'plan-01', assignedById: 'tp-shah', title: 'Attend Tuesday After-Class Physics Clinic with Shah Sir', isDone: false },
      { id: 't-3', planId: 'plan-01', assignedById: 'tp-shah', title: 'Retake Diagnostic Module on Friction', isDone: false }
    ]
  }
];

export const mockStudentRemarks: StudentRemark[] = [
  {
    id: 'rem-01',
    studentId: 'sp-aarav',
    authorName: 'Prof. Mehta',
    authorRole: 'Maths Faculty',
    category: 'ACADEMIC_EXCELLENCE',
    comment: 'Aarav scored 44/50 in Unit Test 2. Consistently ranks at the top of the batch.',
    createdAt: '2026-09-26'
  },
  {
    id: 'rem-02',
    studentId: 'sp-rohan',
    authorName: 'Prof. Shah',
    authorRole: 'Physics Faculty',
    category: 'ATTENDANCE_CONCERN',
    comment: 'Rohan missed 3 consecutive lectures. Requested parent to supervise homework schedule.',
    createdAt: '2026-10-21'
  }
];

export const mockNotices: Notice[] = [
  {
    id: 'not-01',
    instituteId: 'inst-01',
    authorId: 'u-admin',
    authorName: 'Admin Desk',
    title: 'Diwali Holidays: 8 to 12 Nov',
    content: 'All coaching sessions will remain suspended during Diwali festival week. Classes resume normal schedule on Nov 13.',
    targetRole: 'ALL',
    priority: 'HIGH',
    createdAt: '2026-10-20'
  },
  {
    id: 'not-02',
    instituteId: 'inst-01',
    authorId: 'u-admin',
    authorName: 'Accounts Office',
    title: 'Term Fee Dues Reminder: Due Date Nov 05',
    content: 'Parents with pending fee balance are requested to complete settlement via UPI or Cash by 2026-11-05.',
    targetRole: 'PARENT',
    priority: 'NORMAL',
    createdAt: '2026-10-18'
  }
];

export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: '16-Day Streak Warrior',
    earnedAt: '2026-10-22',
    icon: 'Flame',
    description: '100% attendance consistency across 16 consecutive class sessions.',
    category: 'ATTENDANCE',
    points: 150
  },
  {
    id: 'badge-2',
    name: 'Maths Board Topper',
    earnedAt: '2026-09-25',
    icon: 'Award',
    description: 'Scored 44/50 (88%) on Unit Test 2.',
    category: 'ACADEMIC',
    points: 120
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-10-24 16:30',
    userId: 'u-admin',
    userName: 'Admin',
    action: 'ATTENDANCE_SAVED',
    entity: 'Batch: 10-A',
    details: 'Attendance marked for batch 10-A on 2026-10-24',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'log-02',
    timestamp: '2026-10-22 11:15',
    userId: 'u-admin',
    userName: 'Admin',
    action: 'MARKS_ENTERED',
    entity: 'Exam: Physics T2',
    details: 'Marks entered and published for batch JEE-1',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'log-03',
    timestamp: '2026-10-19 14:00',
    userId: 'u-admin',
    userName: 'Admin',
    action: 'SUBSTITUTE_ASSIGNED',
    entity: 'Teacher: Patel',
    details: 'Substitute Patel assigned for batch 10-A (Mon 16:00)',
    ipAddress: '192.168.1.1'
  }
];
