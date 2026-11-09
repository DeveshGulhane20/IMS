import { Institute } from '../types/ims';
import { DetailedStudent, DetailedTeacher } from '../types/academic';
import { academicStudents as initialAcademicStudents } from './mockAcademicData';

export const initialInstitutes: Institute[] = [
  {
    id: 'inst-av-achievers',
    name: 'AV Achievers',
    code: 'AVA-101',
    type: 'K12 School & Integrated Coaching',
    board: 'CBSE',
    address: 'Campus 1: MG Road, Model Colony, Pune, Maharashtra',
    phone: '+91 98765 00000',
    email: 'admin@averiq.edu',
    logoUrl: '/assets/aistudio/WhatsApp_Image_2026-10-28_at_9.50.44_PM__1__a1189775.jpeg',
    campusCount: 2,
    totalStudents: 50,
    totalFaculty: 5,
    status: 'Active',
    plan: 'Pro Cloud',
    monthlyFeeInr: 18500,
    createdAt: '2025-01-15',
    subdomain: 'avachievers.averiq.edu',
    primaryContactName: 'Dr. Ramesh Sharma (Principal)'
  },
  {
    id: 'inst-shapers-academy',
    name: 'Shapers Academy',
    code: 'SHP-202',
    type: 'Coaching Academy & Test Prep',
    board: 'Integrated JEE/NEET',
    address: 'Plot 42, Silicon Knowledge City, Kothrud, Pune, Maharashtra',
    phone: '+91 98230 45678',
    email: 'director@shapersacademy.edu',
    logoUrl: '',
    campusCount: 3,
    totalStudents: 68,
    totalFaculty: 8,
    status: 'Active',
    plan: 'Enterprise Multi-Campus',
    monthlyFeeInr: 29500,
    createdAt: '2025-03-01',
    subdomain: 'shapers.averiq.edu',
    primaryContactName: 'Dr. Shailesh Kulkarni (Founder & Dean)'
  }
];

export const shapersAcademyTeachers: DetailedTeacher[] = [
  {
    id: 'fac-shp-01',
    employeeCode: 'SHP-FAC-01',
    name: 'Dr. Shailesh Kulkarni',
    department: 'Department of Chemistry',
    designation: 'Director & HOD Chemistry',
    qualification: 'Ph.D. Organic Chemistry (IIT Bombay)',
    specialization: 'Reaction Mechanisms & Stereochemistry (JEE Advanced)',
    primarySubject: 'Chemistry',
    joiningDate: '2024-04-10',
    workloadHoursPerWeek: 26,
    assignedBatches: ['shp-batch-jee-alpha', 'shp-batch-neet-top30'],
    assignedSubjects: ['Organic Chemistry', 'Coordination Chemistry'],
    email: 'kulkarni@shapersacademy.edu',
    phone: '+91 98230 45679',
    rating: 4.95,
    totalStudentsTaught: 380,
    avatarBg: 'bg-emerald-600'
  },
  {
    id: 'fac-shp-02',
    employeeCode: 'SHP-FAC-02',
    name: 'Prof. Vandana Rao',
    department: 'Department of Physics',
    designation: 'Senior Professor',
    qualification: 'M.Tech Physics (IIT Delhi)',
    specialization: 'Rotational Dynamics & Electromagnetism',
    primarySubject: 'Physics',
    joiningDate: '2024-05-01',
    workloadHoursPerWeek: 24,
    assignedBatches: ['shp-batch-jee-alpha'],
    assignedSubjects: ['Advanced Mechanics', 'Optics & Waves'],
    email: 'vandana.rao@shapersacademy.edu',
    phone: '+91 98230 45680',
    rating: 4.9,
    totalStudentsTaught: 340,
    avatarBg: 'bg-indigo-600'
  },
  {
    id: 'fac-shp-03',
    employeeCode: 'SHP-FAC-03',
    name: 'Prof. Manish Sen',
    department: 'Department of Mathematics',
    designation: 'HOD Mathematics',
    qualification: 'M.Sc. Pure Mathematics (ISI Kolkata)',
    specialization: 'Calculus, Vectors & Coordinate Geometry',
    primarySubject: 'Mathematics',
    joiningDate: '2024-06-15',
    workloadHoursPerWeek: 25,
    assignedBatches: ['shp-batch-jee-alpha'],
    assignedSubjects: ['Differential Calculus', 'Vector Algebra'],
    email: 'manish.sen@shapersacademy.edu',
    phone: '+91 98230 45681',
    rating: 4.88,
    totalStudentsTaught: 310,
    avatarBg: 'bg-blue-600'
  },
  {
    id: 'fac-shp-04',
    employeeCode: 'SHP-FAC-04',
    name: 'Dr. Anjali Deshmukh',
    department: 'Department of Biology & Medicine',
    designation: 'NEET Master Trainer',
    qualification: 'M.B.B.S, M.D. Physiology (B.J. Medical College)',
    specialization: 'Human Anatomy, Genetics & Biotechnology',
    primarySubject: 'Biology',
    joiningDate: '2024-07-01',
    workloadHoursPerWeek: 22,
    assignedBatches: ['shp-batch-neet-top30'],
    assignedSubjects: ['Genetics & Evolution', 'Human Physiology'],
    email: 'anjali.neet@shapersacademy.edu',
    phone: '+91 98230 45682',
    rating: 4.96,
    totalStudentsTaught: 420,
    avatarBg: 'bg-rose-600'
  }
];

// Seed dedicated Shapers Academy cohort from the master model with custom competitive marks
export const shapersAcademyStudents: DetailedStudent[] = [
  {
    ...initialAcademicStudents[0],
    id: 'stu-shp-001',
    studentCode: 'SHP-2025-001',
    rollNumber: '2001',
    name: 'Aditya Deshmukh',
    gradeLevel: 'Class 12',
    batchName: 'JEE Advanced Alpha Batch',
    batchId: 'shp-batch-jee-alpha',
    section: 'A',
    email: 'aditya.deshmukh@shapers.edu',
    parentName: 'Dr. Nitin Deshmukh',
    parentId: 'par-shp-001',
    phone: '+91 98231 11001',
    address: 'Kothrud, Pune, Maharashtra',
    fees: {
      ...initialAcademicStudents[0].fees,
      totalFee: 125000,
      paidFee: 125000,
      pendingFee: 0,
      status: 'PAID'
    },
    attendance: {
      ...initialAcademicStudents[0].attendance,
      overallPercentage: 98,
      presentDays: 148,
      absentDays: 3,
      totalWorkingDays: 151
    }
  },
  {
    ...initialAcademicStudents[1],
    id: 'stu-shp-002',
    studentCode: 'SHP-2025-002',
    rollNumber: '2002',
    name: 'Suhani Kadam',
    gradeLevel: 'Class 12',
    batchName: 'NEET Super 30 Medical',
    batchId: 'shp-batch-neet-top30',
    section: 'A',
    email: 'suhani.kadam@shapers.edu',
    parentName: 'Prakash Kadam',
    parentId: 'par-shp-002',
    phone: '+91 98231 11003',
    address: 'Baner, Pune, Maharashtra',
    fees: {
      ...initialAcademicStudents[1].fees,
      totalFee: 110000,
      paidFee: 90000,
      pendingFee: 20000,
      status: 'PARTIAL'
    },
    attendance: {
      ...initialAcademicStudents[1].attendance,
      overallPercentage: 96,
      presentDays: 145,
      absentDays: 6,
      totalWorkingDays: 151
    }
  },
  {
    ...initialAcademicStudents[2],
    id: 'stu-shp-003',
    studentCode: 'SHP-2025-003',
    rollNumber: '2003',
    name: 'Tanmay Saxena',
    gradeLevel: 'Class 11',
    batchName: 'JEE Advanced Alpha Batch',
    batchId: 'shp-batch-jee-alpha',
    section: 'A',
    email: 'tanmay.saxena@shapers.edu',
    parentName: 'Gaurav Saxena',
    parentId: 'par-shp-003',
    phone: '+91 98231 11005',
    address: 'Aundh, Pune, Maharashtra',
    fees: {
      ...initialAcademicStudents[2].fees,
      totalFee: 125000,
      paidFee: 100000,
      pendingFee: 25000,
      status: 'PARTIAL'
    },
    attendance: {
      ...initialAcademicStudents[2].attendance,
      overallPercentage: 92,
      presentDays: 139,
      absentDays: 12,
      totalWorkingDays: 151
    }
  },
  {
    ...initialAcademicStudents[3],
    id: 'stu-shp-004',
    studentCode: 'SHP-2025-004',
    rollNumber: '2004',
    name: 'Riddhi Patel',
    gradeLevel: 'Class 12',
    batchName: 'NEET Super 30 Medical',
    batchId: 'shp-batch-neet-top30',
    section: 'A',
    email: 'riddhi.patel@shapers.edu',
    parentName: 'Bhavesh Patel',
    parentId: 'par-shp-004',
    phone: '+91 98231 11007',
    address: 'Viman Nagar, Pune, Maharashtra',
    fees: {
      ...initialAcademicStudents[3].fees,
      totalFee: 110000,
      paidFee: 110000,
      pendingFee: 0,
      status: 'PAID'
    },
    attendance: {
      ...initialAcademicStudents[3].attendance,
      overallPercentage: 95,
      presentDays: 143,
      absentDays: 8,
      totalWorkingDays: 151
    }
  }
];
