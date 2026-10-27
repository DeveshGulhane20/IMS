import {
  DetailedStudent,
  DetailedTeacher,
  DetailedParent,
  InquiryRecord,
  AcademicEvent,
  SemesterRecord,
  StudentFeeDetail,
  StudentAttendanceDetail
} from '../types/academic';

// 5 Teachers
export const academicTeachers: DetailedTeacher[] = [
  {
    id: 'tea-001',
    employeeCode: 'EMP-FAC-01',
    name: 'Prof. Rajesh Sharma',
    designation: 'Head of Department - Mathematics',
    qualification: 'M.Sc. Mathematics, B.Ed (Gold Medalist, Delhi Univ)',
    specialization: 'Calculus, Trigonometry & Coordinate Geometry',
    primarySubject: 'Mathematics',
    department: 'Mathematics & Computing',
    joiningDate: '2020-04-10',
    workloadHoursPerWeek: 24,
    assignedBatches: ['Class 10A Science', 'Class 10B Science', 'Class 9A'],
    assignedSubjects: ['Mathematics', 'Advanced Math'],
    email: 'rajesh.sharma@averiq.edu',
    phone: '+91 98251 10001',
    rating: 4.9,
    totalStudentsTaught: 380,
    avatarBg: 'bg-blue-600'
  },
  {
    id: 'tea-002',
    employeeCode: 'EMP-FAC-02',
    name: 'Dr. Neha Kulkarni',
    designation: 'Senior Faculty - Physics',
    qualification: 'Ph.D. Applied Physics, M.Sc (IIT Bombay)',
    specialization: 'Optics, Mechanics & Electromagnetism',
    primarySubject: 'Physics',
    department: 'Physical Sciences',
    joiningDate: '2021-06-15',
    workloadHoursPerWeek: 22,
    assignedBatches: ['Class 10A Science', 'Class 10B Science', 'Class 9B'],
    assignedSubjects: ['Physics', 'General Science'],
    email: 'neha.kulkarni@averiq.edu',
    phone: '+91 98251 10002',
    rating: 4.85,
    totalStudentsTaught: 320,
    avatarBg: 'bg-purple-600'
  },
  {
    id: 'tea-003',
    employeeCode: 'EMP-FAC-03',
    name: 'Prof. Amit Verma',
    designation: 'Senior Faculty - Chemistry & Lab Director',
    qualification: 'M.Sc. Organic Chemistry (BITS Pilani), NET Qualified',
    specialization: 'Chemical Reactions, Periodic Tables & Lab Experiments',
    primarySubject: 'Chemistry',
    department: 'Chemical Sciences',
    joiningDate: '2021-08-01',
    workloadHoursPerWeek: 20,
    assignedBatches: ['Class 10A Science', 'Class 10B Science', 'Class 9A'],
    assignedSubjects: ['Chemistry', 'Practical Chemistry'],
    email: 'amit.verma@averiq.edu',
    phone: '+91 98251 10003',
    rating: 4.8,
    totalStudentsTaught: 290,
    avatarBg: 'bg-emerald-600'
  },
  {
    id: 'tea-004',
    employeeCode: 'EMP-FAC-04',
    name: 'Mrs. Priya Kapoor',
    designation: 'Senior Lecturer - English & Humanities',
    qualification: 'M.A. English Literature, B.Ed (St. Xavier\'s College)',
    specialization: 'Grammar, Creative Writing, Public Speaking & Poetry',
    primarySubject: 'English',
    department: 'Languages & Humanities',
    joiningDate: '2019-07-20',
    workloadHoursPerWeek: 22,
    assignedBatches: ['Class 10A Science', 'Class 10B Science', 'Class 8A General', 'Class 9A'],
    assignedSubjects: ['English Literature', 'English Language'],
    email: 'priya.kapoor@averiq.edu',
    phone: '+91 98251 10004',
    rating: 4.95,
    totalStudentsTaught: 450,
    avatarBg: 'bg-amber-600'
  },
  {
    id: 'tea-005',
    employeeCode: 'EMP-FAC-05',
    name: 'Dr. Sunita Deshmukh',
    designation: 'Associate Professor - Life Sciences & Biology',
    qualification: 'M.Sc., Ph.D. Zoology & Biotechnology',
    specialization: 'Cell Biology, Genetics, Ecology & Environmental Studies',
    primarySubject: 'Biology / Social Science',
    department: 'Biological Sciences',
    joiningDate: '2022-01-10',
    workloadHoursPerWeek: 21,
    assignedBatches: ['Class 10A Science', 'Class 10B Science', 'Class 8A General'],
    assignedSubjects: ['Biology', 'Environmental Science', 'Social Studies'],
    email: 'sunita.deshmukh@averiq.edu',
    phone: '+91 98251 10005',
    rating: 4.75,
    totalStudentsTaught: 275,
    avatarBg: 'bg-rose-600'
  }
];

// Helper to generate 50 Students & 50 Parents
const firstNamesM = [
  'Rohan', 'Aarav', 'Kabir', 'Ishaan', 'Devansh', 'Aryan', 'Reyansh', 'Aditya', 'Vihaan', 'Arjun',
  'Dhruv', 'Atharv', 'Shaurya', 'Aayush', 'Samar', 'Neil', 'Kunal', 'Harsh', 'Manav', 'Pranav',
  'Tejas', 'Rudra', 'Tanmay', 'Yash', 'Siddharth'
];

const firstNamesF = [
  'Ananya', 'Diya', 'Meera', 'Sana', 'Aditi', 'Priya', 'Neha', 'Tanya', 'Riya', 'Anushka',
  'Sneha', 'Isha', 'Avani', 'Kavya', 'Sara', 'Pooja', 'Mira', 'Navya', 'Trisha', 'Khushi',
  'Simran', 'Palak', 'Anvi', 'Shruti', 'Bhavna'
];

const lastNames = [
  'Sharma', 'Patel', 'Mehta', 'Shah', 'Verma', 'Gupta', 'Singh', 'Malhotra', 'Saxena', 'Singhania',
  'Mukherjee', 'Joshi', 'Chopra', 'Nair', 'Iyer', 'Desai', 'Kulkarni', 'Reddy', 'Bhatia', 'Agarwal',
  'Mishra', 'Choudhary', 'Bose', 'Menon', 'Rao'
];

const occupations = [
  'Senior Software Architect', 'Cardiologist', 'Civil Engineer', 'Chartered Accountant',
  'Senior Corporate Lawyer', 'University Professor', 'Banking Vice President', 'Pharmaceutical Director',
  'Architectural Consultant', 'Data Scientist', 'Business Executive', 'Dental Surgeon',
  'School Vice Principal', 'Merchant Navy Officer', 'Government Officer'
];

// Seed generator for 50 linked students and parents
function generateAcademicData() {
  const studentsList: DetailedStudent[] = [];
  const parentsList: DetailedParent[] = [];

  for (let i = 1; i <= 50; i++) {
    const isMale = i % 2 !== 0;
    const fnList = isMale ? firstNamesM : firstNamesF;
    const fn = (i === 1) ? 'Rohan' : (i === 15) ? 'Ananya' : fnList[(i - 1) % fnList.length];
    const ln = (i === 1 || i === 15) ? 'Sharma' : lastNames[(i - 1) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const codeNumber = i.toString().padStart(3, '0');
    const studentCode = `STU-2025-${codeNumber}`;
    const parentCode = `PAR-2025-${codeNumber}`;

    // Class distribution: Class 10A (1-20), Class 10B (21-35), Class 9A (36-44), Class 8A (45-50)
    let gradeLevel = 'Class 10';
    let section = 'A';
    let batchName = 'Science Batch 2025-26';
    let batchId = 'batch-10a';

    if (i > 44 || i === 15) {
      gradeLevel = 'Class 8';
      section = 'A';
      batchName = 'Class 8 | Batch: General 2025-26';
      batchId = 'batch-8a';
    } else if (i > 35) {
      gradeLevel = 'Class 9';
      section = 'A';
      batchName = 'Class 9 | Foundation Batch 2025-26';
      batchId = 'batch-9a';
    } else if (i > 20) {
      gradeLevel = 'Class 10';
      section = 'B';
      batchName = 'Class 10B | Science Batch 2025-26';
      batchId = 'batch-10b';
    }

    const rollNumber = `${gradeLevel.replace('Class ', '')}${section}-${i.toString().padStart(2, '0')}`;
    const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-'];
    const bloodGroup = bloodGroups[i % bloodGroups.length];

    const fatherName = (i === 1 || i === 15) ? 'Mr. Rajesh Sharma' : `Mr. ${lastNames[(i + 3) % lastNames.length]} ${ln}`;
    const motherName = (i === 1 || i === 15) ? 'Mrs. Sunita Sharma' : `Mrs. Anita ${ln}`;
    const parentName = `${fatherName} & ${motherName}`;
    const parentOccupation = occupations[i % occupations.length];
    const parentPhone = `+91 98${(25000000 + i * 1111).toString().slice(0, 8)}`;
    const studentEmail = `${fn.toLowerCase()}.${ln.toLowerCase()}@student.averiq.edu`;
    const parentEmail = `parent.${fn.toLowerCase()}@averiq.family`;
    const address = `${12 + (i * 3)}, Sector ${(i % 18) + 1}, Averiq Green Enclave, City Campus`;

    // Semester 1 marks calculation (realistic variance)
    const baseVariance = (i * 7) % 25; // 0 to 24
    const s1_math = Math.min(99, Math.max(55, 88 - (baseVariance % 18) + (i % 5)));
    const s1_phys = Math.min(98, Math.max(58, 84 - ((baseVariance + 3) % 16) + (i % 4)));
    const s1_chem = Math.min(96, Math.max(54, 82 - ((baseVariance + 5) % 19) + (i % 6)));
    const s1_eng = Math.min(95, Math.max(62, 79 + (i % 12) - ((baseVariance % 10))));
    const s1_soc = Math.min(98, Math.max(60, 86 - ((baseVariance + 2) % 14) + (i % 5)));

    // Semester 2 marks calculation (slight improvement or progression)
    const prog = (i % 3 === 0) ? 4 : (i % 2 === 0) ? 2 : -1;
    const s2_math = Math.min(100, Math.max(58, s1_math + prog));
    const s2_phys = Math.min(99, Math.max(60, s1_phys + prog + 1));
    const s2_chem = Math.min(98, Math.max(57, s1_chem + prog));
    const s2_eng = Math.min(97, Math.max(65, s1_eng + (prog > 0 ? 2 : 0)));
    const s2_soc = Math.min(99, Math.max(63, s1_soc + prog));

    const getGrade = (p: number): 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F' => {
      if (p >= 90) return 'A+';
      if (p >= 80) return 'A';
      if (p >= 70) return 'B+';
      if (p >= 60) return 'B';
      if (p >= 50) return 'C';
      if (p >= 35) return 'D';
      return 'F';
    };

    const getGP = (p: number) => {
      if (p >= 90) return 10.0;
      if (p >= 80) return 9.0;
      if (p >= 70) return 8.0;
      if (p >= 60) return 7.0;
      if (p >= 50) return 6.0;
      return 5.0;
    };

    const sem1Subjects = [
      { subject: 'Mathematics', code: 'MTH-101', maxMarks: 100, marksObtained: (i === 1 ? 78 : s1_math), percentage: (i === 1 ? 78 : s1_math), grade: getGrade(i === 1 ? 78 : s1_math), credits: 4, gradePoint: getGP(i === 1 ? 78 : s1_math), remarks: 'Strong algebraic fundamentals' },
      { subject: 'Physics', code: 'PHY-101', maxMarks: 100, marksObtained: (i === 1 ? 82 : s1_phys), percentage: (i === 1 ? 82 : s1_phys), grade: getGrade(i === 1 ? 82 : s1_phys), credits: 4, gradePoint: getGP(i === 1 ? 82 : s1_phys), remarks: 'Excellent lab comprehension' },
      { subject: 'Chemistry', code: 'CHM-101', maxMarks: 100, marksObtained: (i === 1 ? 75 : s1_chem), percentage: (i === 1 ? 75 : s1_chem), grade: getGrade(i === 1 ? 75 : s1_chem), credits: 4, gradePoint: getGP(i === 1 ? 75 : s1_chem), remarks: 'Good practical accuracy' },
      { subject: 'English', code: 'ENG-101', maxMarks: 100, marksObtained: (i === 1 ? 68 : s1_eng), percentage: (i === 1 ? 68 : s1_eng), grade: getGrade(i === 1 ? 68 : s1_eng), credits: 3, gradePoint: getGP(i === 1 ? 68 : s1_eng), remarks: 'Creative writing needs practice' },
      { subject: 'Social Science', code: 'SOC-101', maxMarks: 100, marksObtained: (i === 1 ? 85 : s1_soc), percentage: (i === 1 ? 85 : s1_soc), grade: getGrade(i === 1 ? 85 : s1_soc), credits: 3, gradePoint: getGP(i === 1 ? 85 : s1_soc), remarks: 'Deep analytical essays' }
    ];

    const sem1Total = sem1Subjects.reduce((acc, s) => acc + s.marksObtained, 0);
    const sem1Pct = Math.round((sem1Total / 500) * 100);

    const sem2Subjects = [
      { subject: 'Mathematics', code: 'MTH-102', maxMarks: 100, marksObtained: (i === 1 ? 84 : s2_math), percentage: (i === 1 ? 84 : s2_math), grade: getGrade(i === 1 ? 84 : s2_math), credits: 4, gradePoint: getGP(i === 1 ? 84 : s2_math), remarks: 'Impressive jump in Calculus' },
      { subject: 'Physics', code: 'PHY-102', maxMarks: 100, marksObtained: (i === 1 ? 88 : s2_phys), percentage: (i === 1 ? 88 : s2_phys), grade: getGrade(i === 1 ? 88 : s2_phys), credits: 4, gradePoint: getGP(i === 1 ? 88 : s2_phys), remarks: 'Top scores in Mechanics' },
      { subject: 'Chemistry', code: 'CHM-102', maxMarks: 100, marksObtained: (i === 1 ? 80 : s2_chem), percentage: (i === 1 ? 80 : s2_chem), grade: getGrade(i === 1 ? 80 : s2_chem), credits: 4, gradePoint: getGP(i === 1 ? 80 : s2_chem), remarks: 'Mastered organic reactions' },
      { subject: 'English', code: 'ENG-102', maxMarks: 100, marksObtained: (i === 1 ? 76 : s2_eng), percentage: (i === 1 ? 76 : s2_eng), grade: getGrade(i === 1 ? 76 : s2_eng), credits: 3, gradePoint: getGP(i === 1 ? 76 : s2_eng), remarks: 'Noticeable grammar improvement' },
      { subject: 'Social Science', code: 'SOC-102', maxMarks: 100, marksObtained: (i === 1 ? 90 : s2_soc), percentage: (i === 1 ? 90 : s2_soc), grade: getGrade(i === 1 ? 90 : s2_soc), credits: 3, gradePoint: getGP(i === 1 ? 90 : s2_soc), remarks: 'Distinction in History & Civics' }
    ];

    const sem2Total = sem2Subjects.reduce((acc, s) => acc + s.marksObtained, 0);
    const sem2Pct = Math.round((sem2Total / 500) * 100);

    const sem1: SemesterRecord = {
      semesterId: 'sem1',
      semesterName: 'Semester 1 (Mid-Term 2025)',
      academicYear: '2025-2026',
      totalMarks: sem1Total,
      maxMarks: 500,
      percentage: sem1Pct,
      gpa: Number(((sem1Pct / 10)).toFixed(2)),
      grade: sem1Pct >= 85 ? 'A+' : sem1Pct >= 75 ? 'A' : 'B+',
      rank: ((i * 3) % 25) + 1,
      attendancePct: i === 1 ? 92 : Math.min(99, 85 + (i % 14)),
      subjects: sem1Subjects,
      status: sem1Pct >= 75 ? 'Distinction' : 'Passed',
      remarks: 'Consistent academic dedication demonstrated.'
    };

    const sem2: SemesterRecord = {
      semesterId: 'sem2',
      semesterName: 'Semester 2 (Final Evaluation 2026)',
      academicYear: '2025-2026',
      totalMarks: sem2Total,
      maxMarks: 500,
      percentage: sem2Pct,
      gpa: Number(((sem2Pct / 10)).toFixed(2)),
      grade: sem2Pct >= 85 ? 'A+' : sem2Pct >= 75 ? 'A' : 'B+',
      rank: Math.max(1, sem1.rank - (prog > 0 ? 1 : 0)),
      attendancePct: i === 1 ? 94 : Math.min(99, 87 + (i % 12)),
      subjects: sem2Subjects,
      status: sem2Pct >= 75 ? 'Distinction' : 'Passed',
      remarks: 'Significant upward progress across STEM subjects.'
    };

    // Fees calculation
    const totalFee = 15000 + (i % 4) * 3000;
    let paidFee = totalFee;
    let pendingFee = 0;
    let feeStatus: 'PAID' | 'PARTIAL' | 'OVERDUE' = 'PAID';

    if (i === 1) {
      paidFee = 13000;
      pendingFee = 2000;
      feeStatus = 'PARTIAL';
    } else if (i % 5 === 0) {
      pendingFee = 4000;
      paidFee = totalFee - pendingFee;
      feeStatus = 'OVERDUE';
    } else if (i % 3 === 0) {
      pendingFee = 3000;
      paidFee = totalFee - pendingFee;
      feeStatus = 'PARTIAL';
    }

    const feeDetail: StudentFeeDetail = {
      tuitionFee: Math.round(totalFee * 0.65),
      laboratoryFee: Math.round(totalFee * 0.15),
      libraryFee: Math.round(totalFee * 0.05),
      sportsFee: Math.round(totalFee * 0.05),
      transportFee: Math.round(totalFee * 0.05),
      examFee: Math.round(totalFee * 0.05),
      totalFee,
      paidFee,
      pendingFee,
      dueDate: '15 Nov 2025',
      status: feeStatus,
      lastPaymentDate: '10 Oct 2025',
      transactions: [
        {
          id: `tx-${studentCode}-1`,
          receiptNo: `RCP-2025-${codeNumber}-A`,
          date: '15 Jul 2025',
          amount: Math.round(paidFee * 0.6),
          mode: 'UPI',
          status: 'Completed',
          referenceNo: `UPI/2025${i}9823`,
          description: 'Term 1 Tuition & Laboratory Advance'
        },
        ...(paidFee > Math.round(paidFee * 0.6) ? [{
          id: `tx-${studentCode}-2`,
          receiptNo: `RCP-2025-${codeNumber}-B`,
          date: '10 Oct 2025',
          amount: paidFee - Math.round(paidFee * 0.6),
          mode: 'NetBanking' as const,
          status: 'Completed' as const,
          referenceNo: `NBK/2025${i}1102`,
          description: 'Term 2 Fee Instalment & Library Access'
        }] : [])
      ]
    };

    // Attendance calculation
    const totalWorkingDays = 110;
    const attPct = i === 1 ? 92 : i === 15 ? 96 : Math.min(99, Math.max(76, 85 + (i % 14)));
    const presentDays = Math.round((attPct / 100) * totalWorkingDays);
    const absentDays = Math.max(1, totalWorkingDays - presentDays - (i % 3));
    const lateDays = i % 4;
    const excusedDays = Math.max(0, totalWorkingDays - presentDays - absentDays);

    const monthlyTrends = [
      { month: 'Jun', workingDays: 20, presentDays: 19, absentDays: 1, lateDays: 0, percentage: 95 },
      { month: 'Jul', workingDays: 22, presentDays: 21, absentDays: 1, lateDays: 1, percentage: 95 },
      { month: 'Aug', workingDays: 21, presentDays: 19, absentDays: 2, lateDays: 1, percentage: 90 },
      { month: 'Sep', workingDays: 22, presentDays: 20, absentDays: 2, lateDays: 0, percentage: 91 },
      { month: 'Oct', workingDays: 25, presentDays: 23, absentDays: 2, lateDays: 1, percentage: 92 }
    ];

    const attDetail: StudentAttendanceDetail = {
      totalWorkingDays,
      presentDays,
      absentDays,
      lateDays,
      excusedDays,
      overallPercentage: attPct,
      sem1Percentage: attPct,
      sem2Percentage: Math.min(100, attPct + 2),
      monthlyTrends
    };

    const studentRecord: DetailedStudent = {
      id: `stu-${codeNumber}`,
      studentCode,
      rollNumber,
      name: fullName,
      avatarUrl: '',
      gender: isMale ? 'MALE' : 'FEMALE',
      dateOfBirth: `2010-0${(i % 9) + 1}-1${(i % 8) + 1}`,
      bloodGroup,
      gradeLevel,
      section,
      batchName,
      batchId,
      status: 'Active',
      parentName,
      parentId: parentCode,
      phone: parentPhone,
      email: studentEmail,
      address,
      semesters: {
        sem1,
        sem2
      },
      fees: feeDetail,
      attendance: attDetail
    };

    studentsList.push(studentRecord);

    const parentRecord: DetailedParent = {
      id: `par-${codeNumber}`,
      parentCode,
      fatherName,
      motherName,
      primaryContactName: fatherName,
      phone: parentPhone,
      email: parentEmail,
      occupation: parentOccupation,
      address,
      relation: 'Father / Guardian',
      wardStudentCodes: [studentCode],
      wardNames: [fullName]
    };

    parentsList.push(parentRecord);
  }

  // Cross-link Rohan & Ananya as siblings sharing Mr. & Mrs. Sharma
  parentsList[0].wardStudentCodes = ['STU-2025-001', 'STU-2025-015'];
  parentsList[0].wardNames = ['Rohan Sharma', 'Ananya Sharma'];

  return { studentsList, parentsList };
}

const { studentsList, parentsList } = generateAcademicData();
export const academicStudents: DetailedStudent[] = studentsList;
export const academicParents: DetailedParent[] = parentsList;

// Admission Inquiries (CRM Pipeline)
export const academicInquiries: InquiryRecord[] = [
  {
    id: 'inq-101',
    inquiryCode: 'INQ-2025-101',
    studentName: 'Aarush Mehta',
    parentName: 'Gaurav Mehta',
    phone: '+91 98252 44101',
    email: 'gaurav.mehta@gmail.com',
    targetClass: 'Class 10',
    stream: 'Science (PCM)',
    source: 'Website',
    status: 'Demo Scheduled',
    counselor: 'Pooja Tanna',
    inquiryDate: '2025-10-22',
    followUpDate: '2025-11-10',
    notes: 'Interested in IIT-JEE Foundation weekend batches.'
  },
  {
    id: 'inq-102',
    inquiryCode: 'INQ-2025-102',
    studentName: 'Prisha Saxena',
    parentName: 'Ramesh Saxena',
    phone: '+91 98252 44102',
    email: 'saxena.ramesh@yahoo.com',
    targetClass: 'Class 9',
    stream: 'General CBSE',
    source: 'Walk-in',
    status: 'Enrolled',
    counselor: 'Anand Roy',
    inquiryDate: '2025-10-20',
    followUpDate: '2025-11-02',
    notes: 'Completed registration and fee down payment of ₹5,000.'
  },
  {
    id: 'inq-103',
    inquiryCode: 'INQ-2025-103',
    studentName: 'Vihaan Joshi',
    parentName: 'Manish Joshi',
    phone: '+91 98252 44103',
    email: 'manish.joshi@outlook.com',
    targetClass: 'Class 10',
    stream: 'Science (PCB)',
    source: 'Referral',
    status: 'Contacted',
    counselor: 'Pooja Tanna',
    inquiryDate: '2025-10-24',
    followUpDate: '2025-11-12',
    notes: 'Parent asked for scholarship test syllabus and fee concessions.'
  },
  {
    id: 'inq-104',
    inquiryCode: 'INQ-2025-104',
    studentName: 'Kavya Singhania',
    parentName: 'Vivek Singhania',
    phone: '+91 98252 44104',
    email: 'vivek.s@corp.in',
    targetClass: 'Class 8',
    stream: 'Foundation ICSE',
    source: 'Education Expo',
    status: 'New',
    counselor: 'Vikram Seth',
    inquiryDate: '2025-10-26',
    followUpDate: '2025-11-09',
    notes: 'Met at City Education Fair; parent requested brochure callback.'
  },
  {
    id: 'inq-105',
    inquiryCode: 'INQ-2025-105',
    studentName: 'Reyan Choudhury',
    parentName: 'Subhash Choudhury',
    phone: '+91 98252 44105',
    email: 'subhash.c@gmail.com',
    targetClass: 'Class 10',
    stream: 'Science & Math Booster',
    source: 'Social Media',
    status: 'Demo Scheduled',
    counselor: 'Anand Roy',
    inquiryDate: '2025-10-25',
    followUpDate: '2025-11-11',
    notes: 'Attending trial class with Prof. Rajesh Sharma this Saturday.'
  },
  {
    id: 'inq-106',
    inquiryCode: 'INQ-2025-106',
    studentName: 'Ananya Deshpande',
    parentName: 'Sanjay Deshpande',
    phone: '+91 98252 44106',
    email: 'sanjay.d@fin.org',
    targetClass: 'Class 9',
    stream: 'CBSE Math & Science',
    source: 'Website',
    status: 'Enrolled',
    counselor: 'Pooja Tanna',
    inquiryDate: '2025-10-18',
    followUpDate: '2025-10-30',
    notes: 'Enrolled in 9A batch. Uniform and kit assigned.'
  },
  {
    id: 'inq-107',
    inquiryCode: 'INQ-2025-107',
    studentName: 'Shaurya Pratap',
    parentName: 'Devendra Pratap',
    phone: '+91 98252 44107',
    email: 'd.pratap@gov.in',
    targetClass: 'Class 10',
    stream: 'Board Exam Crash Course',
    source: 'Walk-in',
    status: 'Contacted',
    counselor: 'Vikram Seth',
    inquiryDate: '2025-10-27',
    followUpDate: '2025-11-13',
    notes: 'Requested flexible evening batch timings.'
  },
  {
    id: 'inq-108',
    inquiryCode: 'INQ-2025-108',
    studentName: 'Tanvi Iyer',
    parentName: 'Suresh Iyer',
    phone: '+91 98252 44108',
    email: 'suresh.iyer@tcs.com',
    targetClass: 'Class 8',
    stream: 'Junior Olympiad Prep',
    source: 'Referral',
    status: 'Enrolled',
    counselor: 'Anand Roy',
    inquiryDate: '2025-10-15',
    followUpDate: '2025-10-28',
    notes: 'Referred by Mrs. Sharma; full tuition fee cleared.'
  },
  {
    id: 'inq-109',
    inquiryCode: 'INQ-2025-109',
    studentName: 'Manan Agarwal',
    parentName: 'Deepak Agarwal',
    phone: '+91 98252 44109',
    email: 'deepak.a@agarwal.com',
    targetClass: 'Class 10',
    stream: 'Science (PCM)',
    source: 'Website',
    status: 'Lost',
    counselor: 'Pooja Tanna',
    inquiryDate: '2025-10-05',
    followUpDate: '2025-10-20',
    notes: 'Family relocated to another campus zone.'
  },
  {
    id: 'inq-110',
    inquiryCode: 'INQ-2025-110',
    studentName: 'Ishita Nair',
    parentName: 'Karthik Nair',
    phone: '+91 98252 44110',
    email: 'karthik.nair@wipro.com',
    targetClass: 'Class 9',
    stream: 'Science & English',
    source: 'Education Expo',
    status: 'New',
    counselor: 'Vikram Seth',
    inquiryDate: '2025-10-28',
    followUpDate: '2025-11-14',
    notes: 'Requested parent-counselor meeting slot.'
  }
];

// Academic Events (Past & Upcoming)
export const academicEvents: AcademicEvent[] = [
  // Past Events
  {
    id: 'evt-past-01',
    title: 'Inter-School Science & Innovation Expo 2025',
    category: 'Academic',
    type: 'Past',
    date: '2025-09-18',
    time: '09:00 AM - 04:30 PM',
    venue: 'Averiq Main Auditorium & Robotics Hall',
    targetAudience: 'Class 8 to 10 Students & Parents',
    attendeesCount: 420,
    status: 'Completed',
    description: 'Annual STEM fair featuring 45 working models across Renewable Energy, AI in Healthcare, and Smart Agriculture.',
    highlights: ['1st Prize won by Averiq Class 10A solar irrigation model', 'Over 15 external schools participated', 'Keynote by Prof. Kulkarni']
  },
  {
    id: 'evt-past-02',
    title: 'Annual Track & Sports Championship 2025',
    category: 'Sports',
    type: 'Past',
    date: '2025-10-04',
    time: '08:00 AM - 05:00 PM',
    venue: 'Central Sports Complex & Athletic Ground',
    targetAudience: 'All Batches',
    attendeesCount: 560,
    status: 'Completed',
    description: 'Full-day sports meet featuring track sprints, relay races, badminton finals, and inter-house football championship.',
    highlights: ['Blue House secured overall Champions Trophy', 'Rohan Sharma won Silver in 400m sprint', '100% student athletic participation']
  },
  {
    id: 'evt-past-03',
    title: 'Independence Day Cultural Gala & Speech Fest',
    category: 'Cultural',
    type: 'Past',
    date: '2025-08-15',
    time: '08:30 AM - 12:30 PM',
    venue: 'Campus Open Air Amphitheatre',
    targetAudience: 'Students, Faculty & Families',
    attendeesCount: 650,
    status: 'Completed',
    description: 'Flag hoisting ceremony followed by patriotic dances, student orchestra recitals, and poetry recitations.',
    highlights: ['Flag hoisted by Academic Director', 'Symphony performance by Senior Band', 'Distribution of Merit Badges']
  },
  {
    id: 'evt-past-04',
    title: 'Semester 1 Mid-Term Examination Session',
    category: 'Examination',
    type: 'Past',
    date: '2025-09-25',
    endDate: '2025-10-02',
    time: '09:00 AM - 12:00 PM',
    venue: 'Exam Blocks A, B & C',
    targetAudience: 'All Enrolled Students (Class 8-10)',
    attendeesCount: 248,
    status: 'Completed',
    description: 'Comprehensive mid-term evaluations covering all core subjects: Mathematics, Physics, Chemistry, English, and Social Science.',
    highlights: ['100% attendance recorded across all exam sessions', 'Prompt automated report card distribution', 'Zero disciplinary issues']
  },
  {
    id: 'evt-past-05',
    title: 'Teacher’s Day Honor & Student-Led Seminars',
    category: 'Workshop',
    type: 'Past',
    date: '2025-09-05',
    time: '10:00 AM - 02:00 PM',
    venue: 'Conference Seminar Hall',
    targetAudience: 'Faculty & Student Leaders',
    attendeesCount: 140,
    status: 'Completed',
    description: 'Students took over morning lectures while faculties received Excellence in Pedagogy citations.',
    highlights: ['Lifetime mentoring award to Prof. Rajesh Sharma', 'Fun quizzes and student performances']
  },

  // Upcoming Events
  {
    id: 'evt-up-01',
    title: 'Term 2 Parent-Teacher Conference (PTM)',
    category: 'Academic',
    type: 'Upcoming',
    date: '2025-11-15',
    time: '09:30 AM - 02:30 PM',
    venue: 'Respective Classrooms (10A, 10B, 9A, 8A)',
    targetAudience: 'Parents & Guardians of All Batches',
    attendeesCount: 230,
    status: 'Scheduled',
    description: 'One-on-one academic consultations with subject mentors to review Semester 1 scores and Semester 2 goals.',
    highlights: ['Individual performance diagnostic reports', 'Direct interaction with teachers', 'Coffee & networking lounge']
  },
  {
    id: 'evt-up-02',
    title: 'Pre-Board Mock Examinations – Phase 1',
    category: 'Examination',
    type: 'Upcoming',
    date: '2025-11-30',
    endDate: '2025-12-08',
    time: '09:00 AM - 12:30 PM',
    venue: 'Main Examination Halls 1 to 4',
    targetAudience: 'Class 10 Board Aspirants',
    attendeesCount: 145,
    status: 'Scheduled',
    description: 'Standardized mock examinations mirroring CBSE/ICSE board exam pattern with strict invigilation.',
    highlights: ['OMR & Subjective paper simulation', 'Detailed answer key discussion sessions', 'Individual weakness mapping']
  },
  {
    id: 'evt-up-03',
    title: 'Spandana 2025: Annual Cultural Fest & Drama Night',
    category: 'Cultural',
    type: 'Upcoming',
    date: '2025-12-18',
    time: '04:00 PM - 09:30 PM',
    venue: 'City Convention Center & Grand Stage',
    targetAudience: 'Students, Alumni, Parents & Dignitaries',
    attendeesCount: 850,
    status: 'Registration Open',
    description: 'Flagship annual festival celebrating theatre, classical & western dance, instrumental battles, and student art gallery.',
    highlights: ['Live musical fusion concert', 'Inter-batch drama contest', 'Food stalls curated by culinary club']
  },
  {
    id: 'evt-up-04',
    title: 'National Mathematics & Science Olympiad (Stage 1)',
    category: 'Academic',
    type: 'Upcoming',
    date: '2025-12-24',
    time: '10:00 AM - 01:00 PM',
    venue: 'Computer Labs & Test Centers',
    targetAudience: 'Registered Olympiad Candidates',
    attendeesCount: 110,
    status: 'Registration Open',
    description: 'Nationwide aptitude competition testing conceptual depth, logical reasoning, and mathematical agility.',
    highlights: ['National rank certificates', 'Scholarship awards for top 5 scorers', 'Special coaching credits']
  },
  {
    id: 'evt-up-05',
    title: 'Winter Robotics, IoT & AI Coding Bootcamp',
    category: 'Workshop',
    type: 'Upcoming',
    date: '2026-01-10',
    endDate: '2026-01-14',
    time: '10:00 AM - 03:00 PM',
    venue: 'Innovation & Robotics Tinkering Lab',
    targetAudience: 'Class 8 to 10 Technology Enthusiasts',
    attendeesCount: 95,
    status: 'Registration Open',
    description: 'Hands-on 5-day bootcamp on micro-controllers, Arduino programming, Python AI basics, and sensor design.',
    highlights: ['Every participant receives an IoT hardware kit', 'Build a line-following robot', 'Certificate of Completion']
  }
];

// Helper calculations for summary stats
export const academicMetrics = {
  totalStudents: 50,
  totalTeachers: 5,
  totalParents: 50,
  totalInquiries: academicInquiries.length,
  totalEvents: academicEvents.length,
  pastEventsCount: academicEvents.filter(e => e.type === 'Past').length,
  upcomingEventsCount: academicEvents.filter(e => e.type === 'Upcoming').length,
  
  // Fees aggregates
  totalFeesBilled: academicStudents.reduce((acc, s) => acc + s.fees.totalFee, 0),
  totalFeesCollected: academicStudents.reduce((acc, s) => acc + s.fees.paidFee, 0),
  totalFeesPending: academicStudents.reduce((acc, s) => acc + s.fees.pendingFee, 0),
  
  // Attendance aggregates
  overallAttendancePct: Math.round(
    academicStudents.reduce((acc, s) => acc + s.attendance.overallPercentage, 0) / academicStudents.length
  ),
  
  // Academic Performance aggregates
  averageSem1Score: Math.round(
    academicStudents.reduce((acc, s) => acc + s.semesters.sem1.percentage, 0) / academicStudents.length
  ),
  averageSem2Score: Math.round(
    academicStudents.reduce((acc, s) => acc + s.semesters.sem2.percentage, 0) / academicStudents.length
  ),

  // Inquiry Status counts
  inquiryStatusCounts: {
    New: academicInquiries.filter(i => i.status === 'New').length,
    Contacted: academicInquiries.filter(i => i.status === 'Contacted').length,
    'Demo Scheduled': academicInquiries.filter(i => i.status === 'Demo Scheduled').length,
    Enrolled: academicInquiries.filter(i => i.status === 'Enrolled').length,
    Lost: academicInquiries.filter(i => i.status === 'Lost').length
  },

  // Event Category distribution
  eventCategoryCounts: {
    Academic: academicEvents.filter(e => e.category === 'Academic').length,
    Sports: academicEvents.filter(e => e.category === 'Sports').length,
    Cultural: academicEvents.filter(e => e.category === 'Cultural').length,
    Examination: academicEvents.filter(e => e.category === 'Examination').length,
    Workshop: academicEvents.filter(e => e.category === 'Workshop').length
  }
};
