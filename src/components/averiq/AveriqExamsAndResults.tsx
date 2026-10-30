import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  FileSpreadsheet,
  ChevronRight,
  GraduationCap,
  Users,
  BookOpen,
  X,
  Share2,
  Printer,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  CalendarClock
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useIMS } from '../../context/IMSContext';
import { academicStudents } from '../../data/mockAcademicData';

export interface ExamItem {
  id: string;
  name: string;
  classGrade: string;
  subject: string;
  dateTime: string;
  timeRange: string;
  hall: string;
  maxMarks: number;
  passingMarks: number;
  invigilator: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  totalEnrolled: number;
}

export interface StudentResultItem {
  id: string;
  studentId: string;
  studentName: string;
  avatarBg: string;
  classGrade: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  status: 'Passed' | 'Needs Improvement';
  resultDate: string;
  examName: string;
  gradeLetter: string;
  remarks: string;
}

interface AveriqExamsAndResultsProps {
  defaultTab?: 'exams' | 'results';
}

export const AveriqExamsAndResults: React.FC<AveriqExamsAndResultsProps> = ({ defaultTab = 'exams' }) => {
  const { showToast } = useIMS();

  // 1. Dual-Tab Top State
  const [activeMainTab, setActiveMainTab] = useState<'exams' | 'results'>(defaultTab);

  // 2. Results Sub-Filters: 'overall' | 'class' | 'exam'
  const [resultsSubFilter, setResultsSubFilter] = useState<'overall' | 'class' | 'exam'>('overall');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Class 10A');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('Semester 1 Pre-Board Examination');

  // 3. Exams Data & Controls
  const [examSearch, setExamSearch] = useState('');
  const [examClassFilter, setExamClassFilter] = useState('All');
  const [examSubjectFilter, setExamSubjectFilter] = useState('All');
  const [examStatusFilter, setExamStatusFilter] = useState('All');

  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedExamDetails, setSelectedExamDetails] = useState<ExamItem | null>(null);
  const [selectedStudentScorecard, setSelectedStudentScorecard] = useState<StudentResultItem | null>(null);

  // Initial 12 Exams Dataset matching specifications:
  // 1 Upcoming, 8 Scheduled, 3 Completed = 12 Total Exams
  const [examsList, setExamsList] = useState<ExamItem[]>([
    {
      id: 'ex-01',
      name: 'Mathematics Unit Test 5 (Quadratic Equations)',
      classGrade: 'Class 10A',
      subject: 'Mathematics',
      dateTime: 'Nov 12, 2026',
      timeRange: '08:30 AM – 10:30 AM',
      hall: 'Examination Hall A',
      maxMarks: 50,
      passingMarks: 17,
      invigilator: 'Prof. Rajesh Sharma',
      status: 'Upcoming',
      totalEnrolled: 45
    },
    {
      id: 'ex-02',
      name: 'Physics Term 2 Practical & Ray Optics Evaluation',
      classGrade: 'Class 10B',
      subject: 'Physics',
      dateTime: 'Nov 16, 2026',
      timeRange: '09:00 AM – 11:30 AM',
      hall: 'Physics Laboratory 2',
      maxMarks: 40,
      passingMarks: 14,
      invigilator: 'Dr. Neha Kulkarni',
      status: 'Upcoming',
      totalEnrolled: 42
    },
    {
      id: 'ex-03',
      name: 'Chemistry Organic Reactions Assessment',
      classGrade: 'Class 9A',
      subject: 'Chemistry',
      dateTime: 'Nov 18, 2026',
      timeRange: '10:00 AM – 11:30 AM',
      hall: 'Room 204 (Science Wing)',
      maxMarks: 40,
      passingMarks: 14,
      invigilator: 'Prof. Amit Verma',
      status: 'Upcoming',
      totalEnrolled: 40
    },
    {
      id: 'ex-04',
      name: 'English Literature & Formal Composition Assessment',
      classGrade: 'Class 8A',
      subject: 'English',
      dateTime: 'Nov 20, 2026',
      timeRange: '09:00 AM – 11:00 AM',
      hall: 'Junior Wing Hall',
      maxMarks: 50,
      passingMarks: 18,
      invigilator: 'Mrs. Sunita Rao',
      status: 'Upcoming',
      totalEnrolled: 38
    },
    {
      id: 'ex-05',
      name: 'Social Studies & Indian History Term 2 Evaluation',
      classGrade: 'Class 10A',
      subject: 'Social Science',
      dateTime: 'Nov 24, 2026',
      timeRange: '08:30 AM – 10:30 AM',
      hall: 'Examination Hall B',
      maxMarks: 50,
      passingMarks: 17,
      invigilator: 'Dr. Anand Joshi',
      status: 'Upcoming',
      totalEnrolled: 45
    },
    {
      id: 'ex-06',
      name: 'Biology Genetics & Human Physiology Assessment',
      classGrade: 'Class 9A',
      subject: 'Biology',
      dateTime: 'Nov 27, 2026',
      timeRange: '10:00 AM – 11:30 AM',
      hall: 'Biology Lab 1',
      maxMarks: 40,
      passingMarks: 14,
      invigilator: 'Prof. Amit Verma',
      status: 'Upcoming',
      totalEnrolled: 40
    },
    {
      id: 'ex-07',
      name: 'Computer Applications & Python Code Sprint',
      classGrade: 'Class 10B',
      subject: 'Computer Science',
      dateTime: 'Dec 02, 2026',
      timeRange: '01:00 PM – 03:00 PM',
      hall: 'IT Center Terminal Lab',
      maxMarks: 50,
      passingMarks: 20,
      invigilator: 'Prof. Vikram Sen',
      status: 'Upcoming',
      totalEnrolled: 42
    },
    {
      id: 'ex-08',
      name: 'Mathematics Trigonometry & Coordinate Geometry Diagnostic',
      classGrade: 'Class 10A',
      subject: 'Mathematics',
      dateTime: 'Dec 08, 2026',
      timeRange: '08:30 AM – 10:30 AM',
      hall: 'Examination Hall A',
      maxMarks: 50,
      passingMarks: 17,
      invigilator: 'Prof. Rajesh Sharma',
      status: 'Upcoming',
      totalEnrolled: 45
    },
    {
      id: 'ex-09',
      name: 'Physics Thermodynamics & Waves Mid-Term Quiz',
      classGrade: 'Class 9A',
      subject: 'Physics',
      dateTime: 'Oct 30, 2026',
      timeRange: '11:00 AM – 12:30 PM',
      hall: 'Room 205',
      maxMarks: 30,
      passingMarks: 11,
      invigilator: 'Dr. Neha Kulkarni',
      status: 'Ongoing',
      totalEnrolled: 40
    },
    {
      id: 'ex-10',
      name: 'Semester 1 Pre-Board Examination',
      classGrade: 'Class 10A',
      subject: 'Mathematics',
      dateTime: 'Sep 15, 2026',
      timeRange: '09:00 AM – 12:00 PM',
      hall: 'Auditorium Central',
      maxMarks: 100,
      passingMarks: 33,
      invigilator: 'Prof. Rajesh Sharma',
      status: 'Completed',
      totalEnrolled: 45
    },
    {
      id: 'ex-11',
      name: 'Physics Mechanics & Newton Laws Final Evaluation',
      classGrade: 'Class 10B',
      subject: 'Physics',
      dateTime: 'Sep 18, 2026',
      timeRange: '09:00 AM – 11:30 AM',
      hall: 'Examination Hall B',
      maxMarks: 80,
      passingMarks: 27,
      invigilator: 'Dr. Neha Kulkarni',
      status: 'Completed',
      totalEnrolled: 42
    },
    {
      id: 'ex-12',
      name: 'Chemistry Periodic Classification Mid-Term Test',
      classGrade: 'Class 9A',
      subject: 'Chemistry',
      dateTime: 'Sep 22, 2026',
      timeRange: '10:00 AM – 11:30 AM',
      hall: 'Room 202',
      maxMarks: 50,
      passingMarks: 17,
      invigilator: 'Prof. Amit Verma',
      status: 'Completed',
      totalEnrolled: 40
    }
  ]);

  // Form for New Exam Schedule
  const [newExamForm, setNewExamForm] = useState({
    name: '',
    classGrade: 'Class 10A',
    subject: 'Mathematics',
    dateTime: 'Dec 15, 2026',
    timeRange: '09:00 AM – 11:00 AM',
    hall: 'Hall 101',
    maxMarks: 50,
    passingMarks: 17,
    invigilator: 'Prof. Rajesh Sharma',
    totalEnrolled: 45
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamForm.name.trim()) {
      showToast('Please enter an exam title.');
      return;
    }
    const createdExam: ExamItem = {
      id: `ex-${Date.now()}`,
      name: newExamForm.name,
      classGrade: newExamForm.classGrade,
      subject: newExamForm.subject,
      dateTime: newExamForm.dateTime,
      timeRange: newExamForm.timeRange,
      hall: newExamForm.hall,
      maxMarks: Number(newExamForm.maxMarks),
      passingMarks: Number(newExamForm.passingMarks),
      invigilator: newExamForm.invigilator,
      status: 'Upcoming',
      totalEnrolled: Number(newExamForm.totalEnrolled) || 40
    };
    setExamsList([createdExam, ...examsList]);
    setIsScheduleModalOpen(false);
    showToast(`Exam "${createdExam.name}" scheduled successfully for ${createdExam.dateTime}.`);
    setNewExamForm({
      name: '',
      classGrade: 'Class 10A',
      subject: 'Mathematics',
      dateTime: 'Dec 15, 2026',
      timeRange: '09:00 AM – 11:00 AM',
      hall: 'Hall 101',
      maxMarks: 50,
      passingMarks: 17,
      invigilator: 'Prof. Rajesh Sharma',
      totalEnrolled: 45
    });
  };

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return examsList.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(examSearch.toLowerCase()) ||
        item.subject.toLowerCase().includes(examSearch.toLowerCase()) ||
        item.invigilator.toLowerCase().includes(examSearch.toLowerCase()) ||
        item.hall.toLowerCase().includes(examSearch.toLowerCase());
      const matchClass = examClassFilter === 'All' || item.classGrade === examClassFilter;
      const matchSubject = examSubjectFilter === 'All' || item.subject === examSubjectFilter;
      const matchStatus = examStatusFilter === 'All' || item.status === examStatusFilter;
      return matchSearch && matchClass && matchSubject && matchStatus;
    });
  }, [examsList, examSearch, examClassFilter, examSubjectFilter, examStatusFilter]);

  // Exams Analytics Charts Data
  // 1. Exams by Subject Donut Chart
  const examsBySubjectData = useMemo(() => {
    const counts: Record<string, number> = {};
    examsList.forEach(e => {
      counts[e.subject] = (counts[e.subject] || 0) + 1;
    });
    const colors = ['#0056D6', '#0F766E', '#7C3AED', '#F59E0B', '#10B981', '#EC4899', '#64748B'];
    return Object.keys(counts).map((sub, idx) => ({
      name: sub,
      value: counts[sub],
      color: colors[idx % colors.length]
    }));
  }, [examsList]);

  // 2. Class-wise Exam Distribution Bar Chart
  const classWiseDistributionData = useMemo(() => {
    const classCounts: Record<string, number> = {
      'Class 10A': 0,
      'Class 10B': 0,
      'Class 9A': 0,
      'Class 8A': 0
    };
    examsList.forEach(e => {
      if (classCounts[e.classGrade] !== undefined) {
        classCounts[e.classGrade]++;
      } else {
        classCounts[e.classGrade] = 1;
      }
    });
    return Object.keys(classCounts).map(cg => ({
      classGrade: cg,
      examsCount: classCounts[cg]
    }));
  }, [examsList]);

  // Immediate Upcoming Exam for Widget
  const upcomingExamImmediate = useMemo(() => {
    return examsList.find(e => e.status === 'Upcoming') || examsList[0];
  }, [examsList]);

  // 4. Results Section Data
  // Comprehensive Recent Results Records
  const [resultsSearch, setResultsSearch] = useState('');
  const [resultsClassFilter, setResultsClassFilter] = useState('All');
  const [resultsSubjectFilter, setResultsSubjectFilter] = useState('All');
  const [resultsStatusFilter, setResultsStatusFilter] = useState('All');

  const recentStudentResults: StudentResultItem[] = useMemo(() => {
    return [
      {
        id: 'res-01',
        studentId: 'STU-1001',
        studentName: 'Rohan Sharma',
        avatarBg: 'bg-blue-600',
        classGrade: 'Class 10A',
        subject: 'Mathematics',
        marksObtained: 48,
        maxMarks: 50,
        percentage: 96,
        status: 'Passed',
        resultDate: 'Oct 28, 2026',
        examName: 'Pre-Board Mock 1',
        gradeLetter: 'A+',
        remarks: 'Exceptional mastery in Quadratic Equations and Calculus.'
      },
      {
        id: 'res-02',
        studentId: 'STU-1002',
        studentName: 'Priya Patel',
        avatarBg: 'bg-emerald-600',
        classGrade: 'Class 10A',
        subject: 'Physics',
        marksObtained: 47,
        maxMarks: 50,
        percentage: 94,
        status: 'Passed',
        resultDate: 'Oct 28, 2026',
        examName: 'Optics & Circuit Diagnostic',
        gradeLetter: 'A+',
        remarks: 'Clear conceptual understanding and pristine ray diagram presentation.'
      },
      {
        id: 'res-03',
        studentId: 'STU-1003',
        studentName: 'Aarav Verma',
        avatarBg: 'bg-amber-600',
        classGrade: 'Class 10B',
        subject: 'Chemistry',
        marksObtained: 44,
        maxMarks: 50,
        percentage: 88,
        status: 'Passed',
        resultDate: 'Oct 27, 2026',
        examName: 'Organic Reaction Sequences',
        gradeLetter: 'A',
        remarks: 'Strong nomenclature and mechanism grasp; minor arithmetic slip.'
      },
      {
        id: 'res-04',
        studentId: 'STU-1004',
        studentName: 'Ananya Deshmukh',
        avatarBg: 'bg-purple-600',
        classGrade: 'Class 9A',
        subject: 'Mathematics',
        marksObtained: 49,
        maxMarks: 50,
        percentage: 98,
        status: 'Passed',
        resultDate: 'Oct 27, 2026',
        examName: 'Algebra & Polynomials Unit Test',
        gradeLetter: 'A+',
        remarks: 'Batch topper with zero algebraic calculation defects.'
      },
      {
        id: 'res-05',
        studentId: 'STU-1005',
        studentName: 'Vikramaditya Rao',
        avatarBg: 'bg-indigo-600',
        classGrade: 'Class 10A',
        subject: 'English',
        marksObtained: 46,
        maxMarks: 50,
        percentage: 92,
        status: 'Passed',
        resultDate: 'Oct 26, 2026',
        examName: 'Language & Critical Essays',
        gradeLetter: 'A+',
        remarks: 'Articulate phrasing, great vocabulary, and coherent structure.'
      },
      {
        id: 'res-06',
        studentId: 'STU-1006',
        studentName: 'Kunal Singhania',
        avatarBg: 'bg-rose-600',
        classGrade: 'Class 10B',
        subject: 'Mathematics',
        marksObtained: 18,
        maxMarks: 50,
        percentage: 36,
        status: 'Needs Improvement',
        resultDate: 'Oct 26, 2026',
        examName: 'Pre-Board Mock 1',
        gradeLetter: 'Below C',
        remarks: 'Struggling with quadratic formulas and word problems. Recommended for remedial bootcamp.'
      },
      {
        id: 'res-07',
        studentId: 'STU-1007',
        studentName: 'Sneha Kulkarni',
        avatarBg: 'bg-teal-600',
        classGrade: 'Class 9A',
        subject: 'Physics',
        marksObtained: 41,
        maxMarks: 50,
        percentage: 82,
        status: 'Passed',
        resultDate: 'Oct 25, 2026',
        examName: 'Motion & Laws of Friction',
        gradeLetter: 'A',
        remarks: 'Good progress; improve speed during numerical evaluations.'
      },
      {
        id: 'res-08',
        studentId: 'STU-1008',
        studentName: 'Devansh Joshi',
        avatarBg: 'bg-cyan-600',
        classGrade: 'Class 8A',
        subject: 'English',
        marksObtained: 38,
        maxMarks: 50,
        percentage: 76,
        status: 'Passed',
        resultDate: 'Oct 25, 2026',
        examName: 'Grammar and Comprehension',
        gradeLetter: 'B+',
        remarks: 'Solid reading comprehension; revise tenses and passive voice.'
      },
      {
        id: 'res-09',
        studentId: 'STU-1009',
        studentName: 'Meera Nambiar',
        avatarBg: 'bg-pink-600',
        classGrade: 'Class 10A',
        subject: 'Biology',
        marksObtained: 47,
        maxMarks: 50,
        percentage: 94,
        status: 'Passed',
        resultDate: 'Oct 24, 2026',
        examName: 'Life Processes & Genetics Test',
        gradeLetter: 'A+',
        remarks: 'Flawless diagrams, labeling, and thorough explanations.'
      },
      {
        id: 'res-10',
        studentId: 'STU-1010',
        studentName: 'Aditya Chopra',
        avatarBg: 'bg-orange-600',
        classGrade: 'Class 10B',
        subject: 'Physics',
        marksObtained: 21,
        maxMarks: 50,
        percentage: 42,
        status: 'Needs Improvement',
        resultDate: 'Oct 24, 2026',
        examName: 'Optics & Circuit Diagnostic',
        gradeLetter: 'Below C',
        remarks: 'Formula misapplications on circuit laws. Assigned mentor support.'
      },
      {
        id: 'res-11',
        studentId: 'STU-1011',
        studentName: 'Ishaan Trivedi',
        avatarBg: 'bg-violet-600',
        classGrade: 'Class 8A',
        subject: 'Social Science',
        marksObtained: 43,
        maxMarks: 50,
        percentage: 86,
        status: 'Passed',
        resultDate: 'Oct 23, 2026',
        examName: 'Civics and Constitution Mid-Term',
        gradeLetter: 'A',
        remarks: 'Well-researched answers and clear historical timeline citations.'
      },
      {
        id: 'res-12',
        studentId: 'STU-1012',
        studentName: 'Rhea Sengupta',
        avatarBg: 'bg-emerald-700',
        classGrade: 'Class 9A',
        subject: 'Chemistry',
        marksObtained: 45,
        maxMarks: 50,
        percentage: 90,
        status: 'Passed',
        resultDate: 'Oct 22, 2026',
        examName: 'Acids, Bases and Salts Quiz',
        gradeLetter: 'A+',
        remarks: 'Excellent clarity on chemical equation balancing.'
      }
    ];
  }, []);

  const filteredResults = useMemo(() => {
    return recentStudentResults.filter(item => {
      const matchSearch =
        item.studentName.toLowerCase().includes(resultsSearch.toLowerCase()) ||
        item.studentId.toLowerCase().includes(resultsSearch.toLowerCase()) ||
        item.subject.toLowerCase().includes(resultsSearch.toLowerCase()) ||
        item.examName.toLowerCase().includes(resultsSearch.toLowerCase());
      const matchClass = resultsClassFilter === 'All' || item.classGrade === resultsClassFilter;
      const matchSubject = resultsSubjectFilter === 'All' || item.subject === resultsSubjectFilter;
      const matchStatus = resultsStatusFilter === 'All' || item.status === resultsStatusFilter;
      return matchSearch && matchClass && matchSubject && matchStatus;
    });
  }, [recentStudentResults, resultsSearch, resultsClassFilter, resultsSubjectFilter, resultsStatusFilter]);

  // Overall Grade Distribution Data (A+, A, B+, B, C, Below C) for 1,240 students
  const gradeDistributionData = [
    { grade: 'A+', label: 'A+ (90-100%)', count: 284, percentage: 22.9, color: '#10B981', desc: 'Distinction' },
    { grade: 'A', label: 'A (80-89%)', count: 392, percentage: 31.6, color: '#0056D6', desc: 'Very Good' },
    { grade: 'B+', label: 'B+ (70-79%)', count: 248, percentage: 20.0, color: '#7C3AED', desc: 'Good' },
    { grade: 'B', label: 'B (60-69%)', count: 138, percentage: 11.1, color: '#F59E0B', desc: 'Satisfactory' },
    { grade: 'C', label: 'C (50-59%)', count: 96, percentage: 7.7, color: '#FB923C', desc: 'Average' },
    { grade: 'Below C', label: 'Below C (<50%)', count: 82, percentage: 6.6, color: '#EF4444', desc: 'Needs Support' }
  ];

  // Overall Performance Trend Line Graph Data across months
  const performanceTrendData = [
    { month: 'Jun', avgMarks: 68, passRate: 79.5 },
    { month: 'Jul', avgMarks: 70, passRate: 81.2 },
    { month: 'Aug', avgMarks: 72, passRate: 83.0 },
    { month: 'Sep', avgMarks: 74, passRate: 84.4 },
    { month: 'Oct', avgMarks: 76, passRate: 85.6 },
    { month: 'Nov', avgMarks: 78, passRate: 87.2 } // projected/active
  ];

  // Subject-wise Overall Performance Table Data
  const subjectPerformanceData = [
    {
      subject: 'Mathematics',
      enrolled: 1240,
      avgMarks: 74.8,
      passRate: 84.2,
      topScore: '99/100',
      trend: '+3.1%',
      isPositive: true
    },
    {
      subject: 'Physics',
      enrolled: 1240,
      avgMarks: 76.5,
      passRate: 86.8,
      topScore: '100/100',
      trend: '+2.4%',
      isPositive: true
    },
    {
      subject: 'Chemistry',
      enrolled: 1240,
      avgMarks: 78.2,
      passRate: 89.1,
      topScore: '98/100',
      trend: '+4.0%',
      isPositive: true
    },
    {
      subject: 'English',
      enrolled: 1240,
      avgMarks: 81.4,
      passRate: 92.5,
      topScore: '98/100',
      trend: '+1.8%',
      isPositive: true
    },
    {
      subject: 'Biology / Life Science',
      enrolled: 780,
      avgMarks: 79.6,
      passRate: 88.4,
      topScore: '97/100',
      trend: '+2.9%',
      isPositive: true
    },
    {
      subject: 'Social Science & History',
      enrolled: 960,
      avgMarks: 77.0,
      passRate: 87.0,
      topScore: '96/100',
      trend: '+1.5%',
      isPositive: true
    }
  ];

  // Top Performing Classes Ranking
  const topClassesRanking = [
    {
      rank: 1,
      name: 'Class 10A',
      mentor: 'Prof. Rajesh Sharma',
      studentsCount: 320,
      avgMarks: 82.4,
      passRate: 94.2,
      distinctions: 98,
      badge: 'Premier Batch'
    },
    {
      rank: 2,
      name: 'Class 10B',
      mentor: 'Dr. Neha Kulkarni',
      studentsCount: 310,
      avgMarks: 78.6,
      passRate: 88.0,
      distinctions: 82,
      badge: 'Honor Roll'
    },
    {
      rank: 3,
      name: 'Class 9A',
      mentor: 'Prof. Amit Verma',
      studentsCount: 305,
      avgMarks: 75.1,
      passRate: 85.5,
      distinctions: 64,
      badge: 'Rising Star'
    },
    {
      rank: 4,
      name: 'Class 8A',
      mentor: 'Mrs. Sunita Rao',
      studentsCount: 305,
      avgMarks: 73.9,
      passRate: 82.0,
      distinctions: 48,
      badge: 'Consistent'
    }
  ];

  const handleExportSchedule = () => {
    showToast('Exporting official Exam Timetable (PDF)... File ready for print.');
  };

  const handleExportResultsCSV = () => {
    showToast('Exporting Academic Results & Grade Matrix (CSV) for 1,240 students.');
  };

  const handleDownloadScorecardPDF = (name: string) => {
    showToast(`Downloading verified academic transcript for ${name} (PDF)...`);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. TOP DUAL-TAB NAVIGATION BAR
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-[11px] uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
              Examination & Academic Controller
            </span>
            <span className="text-xs text-slate-400">Academic Year 2025–26</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Exams and Results Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Unified institutional management for examination schedules, invigilation duties, and student performance diagnostics.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMainTab('exams')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMainTab === 'exams'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-200" />
            <span>Exams</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeMainTab === 'exams'
                  ? 'bg-blue-700/80 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {examsList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('results')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMainTab === 'results'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>Results</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeMainTab === 'results'
                  ? 'bg-blue-700/80 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              85.6%
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. EXAMS DASHBOARD VIEW (WHEN "EXAMS" TAB IS ACTIVE)
          ========================================================================= */}
      {activeMainTab === 'exams' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0A192F] via-[#0E284D] to-[#0A192F] text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
                  Academic Year 2025–26
                </span>
                <span className="text-xs text-slate-400">Term 1 & Term 2 Curriculums</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
                <CalendarClock className="w-6 h-6 text-blue-400" />
                <span>Exams Dashboard</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Track, schedule, and administer institution-wide tests, room invigilation rosters, and seating allotments.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportSchedule}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Export Timetable</span>
              </button>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Exam</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards: Total Exams (12), Scheduled (8), Completed (3), Upcoming (1) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Exams */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Exams</span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {examsList.length}
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +8% vs last term
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Full 2025–26 session tests</p>
            </div>

            {/* Scheduled */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Scheduled</span>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {examsList.filter(e => e.status === 'Upcoming' && e.id !== 'ex-01').length + 1}
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  66.7% of total
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Venues & supervisors allotted</p>
            </div>

            {/* Completed */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {examsList.filter(e => e.status === 'Completed').length}
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  100% evaluated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Results published to portal</p>
            </div>

            {/* Upcoming (Within next 7 days) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Upcoming (Immediate)</span>
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  1
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                  In next 7 days
                </span>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400/80 mt-1 font-medium truncate">
                Nov 12: Class 10A Mathematics
              </p>
            </div>
          </div>

          {/* Quick Widget: Immediate Upcoming Exam Card */}
          {upcomingExamImmediate && (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-blue-800/60 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider">
                      Next Immediate Exam
                    </span>
                    <span className="text-xs text-blue-200 font-medium">
                      Admit Cards & Seating Dispatched
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                    {upcomingExamImmediate.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <strong>Class:</strong> {upcomingExamImmediate.classGrade}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                      <strong>Subject:</strong> {upcomingExamImmediate.subject}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <strong>Date:</strong> {upcomingExamImmediate.dateTime} ({upcomingExamImmediate.timeRange})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <strong>Venue:</strong> {upcomingExamImmediate.hall}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                      <strong>Invigilator:</strong> {upcomingExamImmediate.invigilator}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedExamDetails(upcomingExamImmediate)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
                  >
                    View Roster & Seats
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Hall tickets for ${upcomingExamImmediate.name} ready for download.`)}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                  >
                    Download Hall Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visual Charts: 1. Exams by Subject (Donut) & 2. Class-wise Exam Distribution (Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Exams by Subject */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Exams by Subject
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribution across science, mathematics, and languages
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                  {examsBySubjectData.length} Subjects
                </span>
              </div>

              <div className="h-64 flex flex-col sm:flex-row items-center justify-between">
                <div className="w-full sm:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={examsBySubjectData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {examsBySubjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Legend */}
                <div className="w-full sm:w-1/2 space-y-1.5 pl-2 text-xs">
                  {examsBySubjectData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white ml-2">
                        {item.value} {item.value === 1 ? 'Exam' : 'Exams'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Class-wise Exam Distribution */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Class-wise Exam Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Exam count scheduled per class grade
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                  Active Batches
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classWiseDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="classGrade" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="examsCount" name="Exams Count" fill="#0056D6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Exam Schedule Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Exam Schedule</span>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    {filteredExams.length} Records
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive master timetable of all scheduled, ongoing, and completed tests
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search exam or subject..."
                    value={examSearch}
                    onChange={e => setExamSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
                  />
                </div>

                <select
                  value={examClassFilter}
                  onChange={e => setExamClassFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Classes</option>
                  <option value="Class 10A">Class 10A</option>
                  <option value="Class 10B">Class 10B</option>
                  <option value="Class 9A">Class 9A</option>
                  <option value="Class 8A">Class 8A</option>
                </select>

                <select
                  value={examStatusFilter}
                  onChange={e => setExamStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Exam Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredExams.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.dateTime}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.timeRange}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white max-w-xs">{item.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Venue: {item.hall}</span>
                          <span>•</span>
                          <span>Invigilator: {item.invigilator}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {item.classGrade}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {item.subject}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {item.status === 'Upcoming' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <Clock className="w-3 h-3 text-blue-500" />
                            Upcoming
                          </span>
                        )}
                        {item.status === 'Ongoing' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            Ongoing
                          </span>
                        )}
                        {item.status === 'Completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedExamDetails(item)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Exam Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast(`Hall ticket & seating chart downloaded for ${item.name}`)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Download Hall Ticket / Seating"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredExams.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No examinations match the selected filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspirational Footer Quote */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 dark:from-slate-900/90 dark:via-slate-900 dark:to-blue-950/30 border border-blue-100 dark:border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="italic text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                “Examinations are not merely tests of memory, but celebrations of consistent learning, discipline, and personal growth. Empower every student to do their best.”
              </p>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1 block">
                — Academic Directorate, AV Achievers Institute of Excellence
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. RESULTS DASHBOARD VIEW (WHEN "RESULTS" TAB IS ACTIVE)
          ========================================================================= */}
      {activeMainTab === 'results' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0E284D] via-[#0A192F] to-[#0E284D] text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                  Data-Driven Insights
                </span>
                <span className="text-xs text-slate-400">Academic Year 2025–26</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span>Results Analytics</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Tracking academic benchmarks, pass/fail ratios, grade distributions, and targeted student progression with high-precision diagnostics.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportResultsCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Export CSV Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Batch report cards compiled and ready for printing.')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Scorecards</span>
              </button>
            </div>
          </div>

          {/* Sub-Filters / View Selectors: Overall Performance, Class Performance, Exam Performance */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setResultsSubFilter('overall')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  resultsSubFilter === 'overall'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Overall Performance
              </button>
              <button
                type="button"
                onClick={() => setResultsSubFilter('class')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  resultsSubFilter === 'class'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Class Performance
              </button>
              <button
                type="button"
                onClick={() => setResultsSubFilter('exam')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  resultsSubFilter === 'exam'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Exam Performance
              </button>
            </div>

            {/* Contextual Secondary Selectors based on chosen sub-filter */}
            {resultsSubFilter === 'class' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Select Class:</span>
                <select
                  value={selectedClassFilter}
                  onChange={e => setSelectedClassFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                >
                  <option value="Class 10A">Class 10A</option>
                  <option value="Class 10B">Class 10B</option>
                  <option value="Class 9A">Class 9A</option>
                  <option value="Class 8A">Class 8A</option>
                </select>
              </div>
            )}

            {resultsSubFilter === 'exam' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Select Exam:</span>
                <select
                  value={selectedExamFilter}
                  onChange={e => setSelectedExamFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none max-w-xs truncate"
                >
                  <option value="Semester 1 Pre-Board Examination">Semester 1 Pre-Board Examination</option>
                  <option value="Physics Mechanics & Newton Laws Final Evaluation">Physics Mechanics Final</option>
                  <option value="Chemistry Periodic Classification Mid-Term Test">Chemistry Periodic Test</option>
                </select>
              </div>
            )}
          </div>

          {/* 4 Summary Cards: Total Students (1,240), Passed (1,062 / 85.6%), Failed (178 / 14.4%), Avg. Marks (76%) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Students */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Students</span>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  1,240
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Enrolled
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Evaluated across all test series</p>
            </div>

            {/* Passed */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Passed</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  1,062
                </span>
                <span className="inline-flex items-center text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  85.6%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">+3.2% growth over prior semester</p>
            </div>

            {/* Failed */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Failed / Remedial</span>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
                  178
                </span>
                <span className="inline-flex items-center text-[11px] font-extrabold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                  14.4%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Enrolled in evening mentor clinics</p>
            </div>

            {/* Avg. Marks */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg. Marks</span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  76%
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +4.5% overall
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Campus mean examination aggregate</p>
            </div>
          </div>

          {/* Visual Analytics: Overall Pass Rate Grade Breakdown & Performance Trend Line Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Overall Pass Rate & Grade Distribution Breakdown */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Overall Pass Rate & Grade Distribution
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Candidate tiers based on consolidated board scorecards
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    85.6% Cleared
                  </span>
                </div>
              </div>

              {/* Stacked Visual Bar */}
              <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                {gradeDistributionData.map(g => (
                  <div
                    key={g.grade}
                    style={{ width: `${g.percentage}%`, backgroundColor: g.color }}
                    title={`${g.label}: ${g.count} students (${g.percentage}%)`}
                    className="h-full transition-all hover:opacity-85"
                  />
                ))}
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {gradeDistributionData.map(item => (
                  <div
                    key={item.grade}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.grade}
                      </span>
                      <span className="font-mono font-bold text-[11px]" style={{ color: item.color }}>
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{item.desc}</span>
                      <span className="font-mono font-semibold">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Overall Performance Trend Line Graph across months */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Overall Performance Trend
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly trajectory of mean scores and pass percentages (Jun–Nov 2026)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Avg Marks %
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Pass Rate %
                  </span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgMarks"
                      name="Average Marks %"
                      stroke="#0056D6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#0056D6' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="passRate"
                      name="Pass Rate %"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10B981' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Data Tables & Leaderboards: 1. Subject-wise Overall Performance & 2. Top Performing Classes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table 1: Subject-wise Overall Performance (Span 2) */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Subject-wise Overall Performance
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aggregated academic metrics across individual learning streams
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono">1,240 Cohort</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-2">Subject</th>
                      <th className="py-2.5 px-2 text-center">Avg Score</th>
                      <th className="py-2.5 px-2 text-center">Pass Rate</th>
                      <th className="py-2.5 px-2 text-center">Top Mark</th>
                      <th className="py-2.5 px-2 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {subjectPerformanceData.map(sub => (
                      <tr key={sub.subject} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>{sub.subject}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                          {sub.avgMarks}%
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                            {sub.passRate}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          {sub.topScore}
                        </td>
                        <td className="py-3 px-2 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {sub.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ranking 2: Top Performing Classes Leaderboard (Span 1) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Top Performing Classes</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Rankings based on consolidated results
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {topClassesRanking.map(cls => (
                  <div
                    key={cls.rank}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs font-mono ${
                            cls.rank === 1
                              ? 'bg-amber-400 text-slate-950 shadow-sm'
                              : cls.rank === 2
                              ? 'bg-slate-300 text-slate-900'
                              : cls.rank === 3
                              ? 'bg-amber-700/80 text-white'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {cls.rank}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            {cls.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">{cls.mentor}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                        {cls.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Avg Marks</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{cls.avgMarks}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pass Rate</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{cls.passRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Distinctions</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{cls.distinctions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Results Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Recent Results</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    {filteredResults.length} Candidate Logs
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Individual student scorecards, grading records, and performance remarks
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search candidate name/ID..."
                    value={resultsSearch}
                    onChange={e => setResultsSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
                  />
                </div>

                <select
                  value={resultsClassFilter}
                  onChange={e => setResultsClassFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Classes</option>
                  <option value="Class 10A">Class 10A</option>
                  <option value="Class 10B">Class 10B</option>
                  <option value="Class 9A">Class 9A</option>
                  <option value="Class 8A">Class 8A</option>
                </select>

                <select
                  value={resultsStatusFilter}
                  onChange={e => setResultsStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Passed">Passed Only</option>
                  <option value="Needs Improvement">Needs Improvement</option>
                </select>
              </div>
            </div>

            {/* Student Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Marks</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Result Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredResults.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-[10px] shrink-0 ${res.avatarBg}`}
                          >
                            {res.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {res.studentName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">{res.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {res.classGrade}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {res.subject}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {res.marksObtained}/{res.maxMarks}
                        </div>
                        <div className="text-[10px] font-mono font-semibold text-slate-400">
                          {res.percentage}% ({res.gradeLetter})
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {res.status === 'Passed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Needs Improvement
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                        {res.resultDate}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentScorecard(res)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Scorecard</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredResults.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No student result records found matching search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MODAL: SCHEDULE NEW EXAM
          ========================================================================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Schedule New Exam</h3>
                  <p className="text-xs text-slate-500">Academic Session 2025–26</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Title / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics Unit Test 6 (Trigonometry)"
                  value={newExamForm.name}
                  onChange={e => setNewExamForm({ ...newExamForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class / Grade
                  </label>
                  <select
                    value={newExamForm.classGrade}
                    onChange={e => setNewExamForm({ ...newExamForm, classGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Class 10A">Class 10A</option>
                    <option value="Class 10B">Class 10B</option>
                    <option value="Class 9A">Class 9A</option>
                    <option value="Class 8A">Class 8A</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={newExamForm.subject}
                    onChange={e => setNewExamForm({ ...newExamForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Biology">Biology</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 15, 2026"
                    value={newExamForm.dateTime}
                    onChange={e => setNewExamForm({ ...newExamForm, dateTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    placeholder="09:00 AM – 11:00 AM"
                    value={newExamForm.timeRange}
                    onChange={e => setNewExamForm({ ...newExamForm, timeRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hall / Venue
                  </label>
                  <input
                    type="text"
                    value={newExamForm.hall}
                    onChange={e => setNewExamForm({ ...newExamForm, hall: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Invigilator / Supervisor
                  </label>
                  <input
                    type="text"
                    value={newExamForm.invigilator}
                    onChange={e => setNewExamForm({ ...newExamForm, invigilator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    value={newExamForm.maxMarks}
                    onChange={e => setNewExamForm({ ...newExamForm, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pass Marks
                  </label>
                  <input
                    type="number"
                    value={newExamForm.passingMarks}
                    onChange={e => setNewExamForm({ ...newExamForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enrolled Count
                  </label>
                  <input
                    type="number"
                    value={newExamForm.totalEnrolled}
                    onChange={e => setNewExamForm({ ...newExamForm, totalEnrolled: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  Save & Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. MODAL: EXAM DETAILS INSPECTOR
          ========================================================================= */}
      {selectedExamDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <FileCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Exam Overview</h3>
                  <span className="text-xs text-slate-400">Official Roster & Logistics</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExamDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Examination Title</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedExamDetails.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">Class Grade</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedExamDetails.classGrade}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Subject</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{selectedExamDetails.subject}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Date & Time</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedExamDetails.dateTime} ({selectedExamDetails.timeRange})
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Examination Hall</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedExamDetails.hall}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Marks Benchmark</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    Max: {selectedExamDetails.maxMarks} | Pass: {selectedExamDetails.passingMarks}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Chief Invigilator</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedExamDetails.invigilator}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300">
                <span className="font-medium">Total Registered Candidates:</span>
                <span className="font-bold font-mono text-sm">{selectedExamDetails.totalEnrolled} Students</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedExamDetails(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Official timetable and seating plan downloaded for ${selectedExamDetails.name}.`);
                  setSelectedExamDetails(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Admit Package</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL: STUDENT SCORECARD VIEWER
          ========================================================================= */}
      {selectedStudentScorecard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Academic Scorecard</h3>
                  <span className="text-xs text-slate-400">Verified Transcript Record</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentScorecard(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 ${selectedStudentScorecard.avatarBg}`}
                >
                  {selectedStudentScorecard.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedStudentScorecard.studentName}
                  </h4>
                  <span className="font-mono text-slate-400 text-[11px]">
                    ID: {selectedStudentScorecard.studentId} • {selectedStudentScorecard.classGrade}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-[11px] text-slate-400 block">Marks Obtained</span>
                  <span className="font-mono font-black text-lg text-blue-600 dark:text-blue-400">
                    {selectedStudentScorecard.marksObtained} / {selectedStudentScorecard.maxMarks}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-[11px] text-slate-400 block">Percentage / Grade</span>
                  <span className="font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">
                    {selectedStudentScorecard.percentage}% ({selectedStudentScorecard.gradeLetter})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Faculty Evaluation Remarks</span>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  "{selectedStudentScorecard.remarks}"
                </p>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Exam: {selectedStudentScorecard.examName}</span>
                <span>Date: {selectedStudentScorecard.resultDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedStudentScorecard(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadScorecardPDF(selectedStudentScorecard.studentName);
                  setSelectedStudentScorecard(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Scorecard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
