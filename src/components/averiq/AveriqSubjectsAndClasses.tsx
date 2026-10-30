import React, { useState, useMemo } from 'react';
import {
  Layers,
  BookOpen,
  Users,
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Settings,
  Edit2,
  Check,
  Package,
  Sliders,
  Globe,
  FileSpreadsheet,
  Download,
  Award
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

export type EducationBoard = 'CBSE' | 'ICSE' | 'State Board' | 'IB';

export interface ClassRecord {
  id: string;
  name: string;
  gradeLevel: string; // "Nursery", "1st Standard", ... "10th Standard", "11th Standard", "12th Standard"
  section: string;
  board: EducationBoard;
  stream?: string; // "General", "Science (PCM)", "Science (PCB)", "Commerce", "Humanities"
  room: string;
  classTeacher: string;
  enrolled: number;
  capacity: number;
  subjects: string[];
  selectionMode: 'prefixed' | 'individual';
  packagePresetName?: string;
  syllabusProgress: number;
  schedule: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  category: 'Sciences & Math' | 'Languages' | 'Social Sciences' | 'Commerce' | 'Technology' | 'Electives & Arts';
  boards: EducationBoard[];
  gradeLevels: string[];
  weeklyHours: number;
  leadTeacher: string;
  isElective?: boolean;
}

// Standardized Prefixed Subject Bundles
interface SubjectPackage {
  id: string;
  name: string;
  board: EducationBoard;
  grades: string[];
  stream: string;
  description: string;
  subjects: string[];
}

export const AveriqSubjectsAndClasses: React.FC = () => {
  const { showToast } = useIMS();

  // Navigation Sub-tabs: 'classes' | 'curriculum-config' | 'all-subjects'
  const [activeMainTab, setActiveMainTab] = useState<'classes' | 'curriculum-config' | 'all-subjects'>('classes');

  // Filtering Controls
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<'All' | EducationBoard>('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isConfigureSubjectsModalOpen, setIsConfigureSubjectsModalOpen] = useState(false);
  const [selectedClassForConfig, setSelectedClassForConfig] = useState<ClassRecord | null>(null);

  // Form State for Add / Edit Class
  const [classForm, setClassForm] = useState({
    name: '',
    gradeLevel: '10th Standard',
    section: 'A',
    board: 'CBSE' as EducationBoard,
    stream: 'Science & Math',
    room: 'Hall 101',
    classTeacher: 'Prof. Rajesh Sharma',
    capacity: 35,
    selectionMode: 'prefixed' as 'prefixed' | 'individual',
    selectedPackageId: 'pkg-cbse-10',
    customSubjects: ['Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language', 'Hindi Course A', 'Computer Applications']
  });

  // Prefixed Standard Packages
  const standardPackages: SubjectPackage[] = [
    {
      id: 'pkg-pre-primary',
      name: 'Early Years Foundation Package',
      board: 'CBSE',
      grades: ['Nursery', 'LKG', 'UKG'],
      stream: 'Early Learning',
      description: 'Foundational literacy, phonics, numeracy, environmental rhymes, and sensory motor activities.',
      subjects: ['English Phonics & Rhymes', 'Early Numeracy', 'General Awareness (EVS)', 'Art & Craft', 'Physical Play & Motor Skills']
    },
    {
      id: 'pkg-primary-cbse',
      name: 'CBSE Primary Foundation (1st–5th)',
      board: 'CBSE',
      grades: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard'],
      stream: 'Primary Core',
      description: 'Standard NCERT primary bundle emphasizing language bilingualism and conceptual mathematics.',
      subjects: ['English Language & Reading', 'Hindi (Second Language)', 'Mathematics', 'Environmental Studies (EVS)', 'Computer Literacy', 'Visual Art', 'Physical Education']
    },
    {
      id: 'pkg-primary-icse',
      name: 'ICSE Primary Comprehensive (1st–5th)',
      board: 'ICSE',
      grades: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard'],
      stream: 'Primary Core',
      description: 'Strong grammar, phonetics, mental math, science discovery, and regional language inclusion.',
      subjects: ['English Grammar & Reading', 'Second Language (Hindi/Regional)', 'Mathematics & Reasoning', 'General Science', 'Social Studies', 'Computer Studies', 'Creative Arts']
    },
    {
      id: 'pkg-middle-cbse',
      name: 'CBSE Middle School Core (6th–8th)',
      board: 'CBSE',
      grades: ['6th Standard', '7th Standard', '8th Standard'],
      stream: 'Middle School',
      description: 'Delineated sciences, algebra & geometry foundations, third language, and IT coding.',
      subjects: ['Mathematics', 'General Science', 'Social Science (History, Civics, Geography)', 'English Literature', 'Hindi (Course A)', 'Sanskrit / Third Language', 'Information Technology', 'Physical Health Education']
    },
    {
      id: 'pkg-middle-state',
      name: 'State Board Middle Curriculum (6th–8th)',
      board: 'State Board',
      grades: ['6th Standard', '7th Standard', '8th Standard'],
      stream: 'Middle School',
      description: 'Regional state syllabus with dedicated mother-tongue curriculum and vocational crafts.',
      subjects: ['Mathematics', 'General Science', 'Social Sciences', 'First Language (Regional/State)', 'Second Language (Hindi)', 'Third Language (English)', 'Work Education & Computer']
    },
    {
      id: 'pkg-cbse-10',
      name: 'CBSE Secondary Board (9th–10th)',
      board: 'CBSE',
      grades: ['9th Standard', '10th Standard'],
      stream: 'High School',
      description: 'Standard 5 core subjects plus vocational IT/AI skill subject for national board candidates.',
      subjects: ['Mathematics Standard', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language & Literature', 'Hindi Course A / Regional', 'Artificial Intelligence / Computer']
    },
    {
      id: 'pkg-icse-10',
      name: 'ICSE Secondary 10-Paper Package (9th–10th)',
      board: 'ICSE',
      grades: ['9th Standard', '10th Standard'],
      stream: 'High School',
      description: 'Rigorous distinct papers for Physics, Chemistry, Biology, History-Civics, and Geography.',
      subjects: ['English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'Computer Applications', 'Commercial Studies']
    },
    {
      id: 'pkg-state-10',
      name: 'State Board SSC Matriculation (9th–10th)',
      board: 'State Board',
      grades: ['9th Standard', '10th Standard'],
      stream: 'High School',
      description: 'Official State Board SSC curriculum with Mathematics, Science, and 3 languages.',
      subjects: ['Mathematics (Algebra & Geometry)', 'Science & Technology (Part 1 & 2)', 'Social Sciences (History, Pol Sci, Geography)', 'First Language (English)', 'Second Language (Hindi)', 'Third Language (Regional State)']
    },
    {
      id: 'pkg-ib-myp',
      name: 'IB Middle Years Programme (MYP 9th–10th)',
      board: 'IB',
      grades: ['9th Standard', '10th Standard'],
      stream: 'International MYP',
      description: 'Inquiry-based international curriculum with personal projects and global interdisciplinary units.',
      subjects: ['Language and Literature (English)', 'Language Acquisition (French/Spanish)', 'Individuals and Societies', 'Integrated Sciences', 'Mathematics Extended', 'Design & Technology', 'Physical & Health Education']
    },
    {
      id: 'pkg-11-12-pcm',
      name: 'Higher Secondary Science – PCM Stream (11th–12th)',
      board: 'CBSE',
      grades: ['11th Standard', '12th Standard'],
      stream: 'Science (PCM)',
      description: 'Rigorous engineering entrance prep curriculum with practical laboratory allocations.',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'English Core', 'Computer Science (Python)', 'Physical Education']
    },
    {
      id: 'pkg-11-12-pcb',
      name: 'Higher Secondary Science – PCB Stream (11th–12th)',
      board: 'CBSE',
      grades: ['11th Standard', '12th Standard'],
      stream: 'Science (PCB)',
      description: 'Medical and life science curriculum with botany, zoology, and organic chemistry synthesis.',
      subjects: ['Physics', 'Chemistry', 'Biology (Botany & Zoology)', 'English Core', 'Psychology / Biotechnology', 'Physical Education']
    },
    {
      id: 'pkg-11-12-comm',
      name: 'Higher Secondary Commerce Stream (11th–12th)',
      board: 'CBSE',
      grades: ['11th Standard', '12th Standard'],
      stream: 'Commerce',
      description: 'Comprehensive business finance, taxation, economics, and commercial enterprise accounting.',
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Applied Mathematics / Informatics Practices', 'English Core', 'Entrepreneurship']
    },
    {
      id: 'pkg-11-12-ibdp',
      name: 'IB Diploma Programme (IBDP 11th–12th)',
      board: 'IB',
      grades: ['11th Standard', '12th Standard'],
      stream: 'IB Diploma',
      description: 'Prestigious 6-subject international diploma including Theory of Knowledge (TOK) and Extended Essay.',
      subjects: ['IB English A Literature HL', 'IB Mathematics Analysis & Approaches HL', 'IB Physics HL', 'IB Chemistry SL', 'IB Economics SL', 'Theory of Knowledge (TOK)', 'Creativity, Activity, Service (CAS)']
    }
  ];

  // Master Catalog of Individual Electives & Subjects
  const allMasterSubjects: SubjectItem[] = [
    // Sciences & Math
    { id: 'sub-mth', code: 'MTH-101', name: 'Mathematics', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Rajesh Sharma' },
    { id: 'sub-amth', code: 'MTH-301', name: 'Advanced Mathematics (Calculus & Vectors)', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 7, leadTeacher: 'Prof. Rajesh Sharma' },
    { id: 'sub-phy', code: 'PHY-201', name: 'Physics & Experimental Dynamics', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'Dr. Neha Kulkarni' },
    { id: 'sub-chm', code: 'CHM-201', name: 'Chemistry & Practical Synthesis', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Amit Verma' },
    { id: 'sub-bio', code: 'BIO-201', name: 'Biology & Life Systems', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Dr. Priya Nair' },
    { id: 'sub-gsci', code: 'SCI-050', name: 'General Science & Discovery', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard'], weeklyHours: 5, leadTeacher: 'Dr. Priya Nair' },
    { id: 'sub-evs', code: 'EVS-010', name: 'Environmental Studies (EVS)', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['Nursery', 'LKG', 'UKG', '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard'], weeklyHours: 4, leadTeacher: 'Mrs. Sunita Rao' },

    // Languages
    { id: 'sub-eng', code: 'ENG-101', name: 'English Language & Literature', category: 'Languages', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Mrs. Sunita Rao' },
    { id: 'sub-hin', code: 'HIN-101', name: 'Hindi Course A & B', category: 'Languages', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Dr. S. Mishra' },
    { id: 'sub-san', code: 'SAN-101', name: 'Sanskrit Grammar & Classics', category: 'Languages', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 3, leadTeacher: 'Acharya V. Shastri', isElective: true },
    { id: 'sub-mar', code: 'MAR-101', name: 'Marathi (State Regional)', category: 'Languages', boards: ['State Board'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Mrs. V. Deshpande' },
    { id: 'sub-frn', code: 'FRN-201', name: 'French Language & Culture', category: 'Languages', boards: ['CBSE', 'ICSE', 'IB'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 3, leadTeacher: 'Madame C. Leroux', isElective: true },
    { id: 'sub-spn', code: 'SPN-201', name: 'Spanish Language Studies', category: 'Languages', boards: ['IB', 'CBSE'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 3, leadTeacher: 'Senor R. Morales', isElective: true },

    // Social Sciences
    { id: 'sub-sst', code: 'SST-101', name: 'Social Sciences (History, Pol Sci, Geo)', category: 'Social Sciences', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Anand Joshi' },
    { id: 'sub-eco', code: 'ECO-301', name: 'Economics & Public Policy', category: 'Social Sciences', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Prof. K. Subramanian', isElective: true },
    { id: 'sub-psy', code: 'PSY-301', name: 'Psychology & Behavioral Science', category: 'Social Sciences', boards: ['CBSE', 'IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Shweta Roy', isElective: true },

    // Commerce
    { id: 'sub-acc', code: 'ACC-301', name: 'Accountancy & Financial Statements', category: 'Commerce', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'CA Ramesh Bhandari' },
    { id: 'sub-bst', code: 'BST-301', name: 'Business Studies & Enterprise', category: 'Commerce', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Prof. N. Kulkarni' },

    // Technology
    { id: 'sub-cs', code: 'CSC-101', name: 'Computer Science (Python & Coding)', category: 'Technology', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 4, leadTeacher: 'Prof. Vikram Sen' },
    { id: 'sub-ai', code: 'AI-201', name: 'Artificial Intelligence & Machine Learning', category: 'Technology', boards: ['CBSE', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 3, leadTeacher: 'Prof. Vikram Sen', isElective: true },

    // Electives & Arts
    { id: 'sub-pe', code: 'PED-101', name: 'Physical Education & Sports Health', category: 'Electives & Arts', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 2, leadTeacher: 'Coach V. Ranade' },
    { id: 'sub-art', code: 'ART-101', name: 'Visual Arts & Fine Arts', category: 'Electives & Arts', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 2, leadTeacher: 'Ms. Kavita Shah', isElective: true }
  ];

  // Comprehensive Classes List spanning 1st to 12th standards + Pre-primary across CBSE, ICSE, State Board, IB
  const [classesList, setClassesList] = useState<ClassRecord[]>([
    {
      id: 'cls-10a-cbse',
      name: 'Class 10A – Science & Math Honors',
      gradeLevel: '10th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'High School',
      room: 'Hall 101',
      classTeacher: 'Prof. Rajesh Sharma',
      enrolled: 32,
      capacity: 35,
      subjects: ['Mathematics Standard', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language & Literature', 'Hindi Course A', 'Artificial Intelligence'],
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Secondary Board (9th–10th)',
      syllabusProgress: 84,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-10b-icse',
      name: 'Class 10B – ICSE Board Aspirants',
      gradeLevel: '10th Standard',
      section: 'B',
      board: 'ICSE',
      stream: 'High School',
      room: 'Hall 102',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 30,
      capacity: 35,
      subjects: ['English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'Computer Applications'],
      selectionMode: 'prefixed',
      packagePresetName: 'ICSE Secondary 10-Paper Package',
      syllabusProgress: 81,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-10c-state',
      name: 'Class 10C – State SSC Matriculation',
      gradeLevel: '10th Standard',
      section: 'C',
      board: 'State Board',
      stream: 'High School',
      room: 'Room 201',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 35,
      capacity: 40,
      subjects: ['Mathematics (Algebra & Geometry)', 'Science & Technology (Part 1 & 2)', 'Social Sciences', 'First Language (English)', 'Second Language (Hindi)', 'Third Language (Marathi)'],
      selectionMode: 'prefixed',
      packagePresetName: 'State Board SSC Matriculation',
      syllabusProgress: 88,
      schedule: '08:30 AM – 02:30 PM'
    },
    {
      id: 'cls-9a-cbse',
      name: 'Class 9A – Secondary Scholars',
      gradeLevel: '9th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'High School',
      room: 'Room 204',
      classTeacher: 'Mrs. Sunita Rao',
      enrolled: 32,
      capacity: 35,
      subjects: ['Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language', 'Hindi Course A', 'Information Technology'],
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Secondary Board (9th–10th)',
      syllabusProgress: 76,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-9b-ib',
      name: 'Class 9B – IB Middle Years Programme (MYP)',
      gradeLevel: '9th Standard',
      section: 'B',
      board: 'IB',
      stream: 'International MYP',
      room: 'STEM Lab 2',
      classTeacher: 'Madame C. Leroux',
      enrolled: 24,
      capacity: 25,
      subjects: ['Language and Literature (English)', 'Language Acquisition (French)', 'Individuals and Societies', 'Integrated Sciences', 'Mathematics Extended', 'Design & Technology'],
      selectionMode: 'individual',
      syllabusProgress: 74,
      schedule: '08:30 AM – 03:00 PM'
    },
    {
      id: 'cls-8a-cbse',
      name: 'Class 8A – Middle Foundation',
      gradeLevel: '8th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'Middle School',
      room: 'Junior Hall 108',
      classTeacher: 'Dr. Priya Nair',
      enrolled: 28,
      capacity: 30,
      subjects: ['Mathematics', 'General Science', 'Social Science', 'English Literature', 'Hindi (Course A)', 'Sanskrit', 'Information Technology'],
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Middle School Core',
      syllabusProgress: 89,
      schedule: '09:00 AM – 02:00 PM'
    },
    {
      id: 'cls-7a-icse',
      name: 'Class 7A – ICSE Junior Achievers',
      gradeLevel: '7th Standard',
      section: 'A',
      board: 'ICSE',
      stream: 'Middle School',
      room: 'Junior Hall 109',
      classTeacher: 'Acharya V. Shastri',
      enrolled: 26,
      capacity: 30,
      subjects: ['Mathematics', 'General Science', 'Social Studies', 'English Literature', 'Hindi', 'Computer Applications', 'Visual Arts'],
      selectionMode: 'individual',
      syllabusProgress: 86,
      schedule: '09:00 AM – 02:00 PM'
    },
    {
      id: 'cls-5a-cbse',
      name: 'Class 5A – Primary Champions',
      gradeLevel: '5th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'Primary Core',
      room: 'Primary Block 102',
      classTeacher: 'Mrs. V. Deshpande',
      enrolled: 25,
      capacity: 30,
      subjects: ['English Language & Reading', 'Hindi', 'Mathematics', 'Environmental Studies (EVS)', 'Computer Literacy', 'Visual Art', 'Physical Education'],
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Primary Foundation',
      syllabusProgress: 91,
      schedule: '09:00 AM – 01:30 PM'
    },
    {
      id: 'cls-3a-state',
      name: 'Class 3A – Primary State Stream',
      gradeLevel: '3rd Standard',
      section: 'A',
      board: 'State Board',
      stream: 'Primary Core',
      room: 'Primary Block 104',
      classTeacher: 'Mrs. V. Deshpande',
      enrolled: 24,
      capacity: 30,
      subjects: ['English Language', 'Hindi', 'Marathi (State)', 'Mathematics', 'Environmental Studies', 'Arts & Craft'],
      selectionMode: 'individual',
      syllabusProgress: 94,
      schedule: '09:00 AM – 01:30 PM'
    },
    {
      id: 'cls-1a-cbse',
      name: 'Class 1A – Primary Inceptors',
      gradeLevel: '1st Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'Primary Core',
      room: 'Primary Block 101',
      classTeacher: 'Ms. Kavita Shah',
      enrolled: 22,
      capacity: 25,
      subjects: ['English Language & Reading', 'Hindi (Second Language)', 'Mathematics', 'Environmental Studies (EVS)', 'Visual Art', 'Physical Education'],
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Primary Foundation',
      syllabusProgress: 96,
      schedule: '09:00 AM – 01:00 PM'
    },
    {
      id: 'cls-11sci-pcm',
      name: 'Class 11 Science – Engineering Stream (PCM)',
      gradeLevel: '11th Standard',
      section: 'PCM',
      board: 'CBSE',
      stream: 'Science (PCM)',
      room: 'Senior Block Lab 3',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 30,
      capacity: 35,
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'English Core', 'Computer Science (Python)', 'Physical Education'],
      selectionMode: 'prefixed',
      packagePresetName: 'Higher Secondary Science – PCM Stream',
      syllabusProgress: 68,
      schedule: '08:00 AM – 03:00 PM'
    },
    {
      id: 'cls-12sci-pcb',
      name: 'Class 12 Science – Medical Stream (PCB)',
      gradeLevel: '12th Standard',
      section: 'PCB',
      board: 'CBSE',
      stream: 'Science (PCB)',
      room: 'Senior Block Seminar Hall',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 32,
      capacity: 35,
      subjects: ['Physics', 'Chemistry', 'Biology (Botany & Zoology)', 'English Core', 'Psychology', 'Physical Education'],
      selectionMode: 'individual',
      syllabusProgress: 94,
      schedule: '08:00 AM – 03:00 PM'
    },
    {
      id: 'cls-12comm-cbse',
      name: 'Class 12 Commerce & Economics Hub',
      gradeLevel: '12th Standard',
      section: 'COMM',
      board: 'CBSE',
      stream: 'Commerce',
      room: 'Senior Block Room 302',
      classTeacher: 'CA Ramesh Bhandari',
      enrolled: 28,
      capacity: 32,
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Applied Mathematics', 'English Core', 'Entrepreneurship'],
      selectionMode: 'prefixed',
      packagePresetName: 'Higher Secondary Commerce Stream',
      syllabusProgress: 92,
      schedule: '08:00 AM – 03:00 PM'
    },
    {
      id: 'cls-12ib-dp',
      name: 'Class 12 – IB Diploma Cohort (DP2)',
      gradeLevel: '12th Standard',
      section: 'IBDP',
      board: 'IB',
      stream: 'IB Diploma',
      room: 'International Wing Hall 401',
      classTeacher: 'Dr. Shweta Roy',
      enrolled: 18,
      capacity: 20,
      subjects: ['IB English A Literature HL', 'IB Mathematics Analysis & Approaches HL', 'IB Physics HL', 'IB Chemistry SL', 'IB Economics SL', 'Theory of Knowledge (TOK)'],
      selectionMode: 'prefixed',
      packagePresetName: 'IB Diploma Programme (IBDP)',
      syllabusProgress: 95,
      schedule: '08:30 AM – 03:30 PM'
    }
  ]);

  // Filtered Classes
  const filteredClasses = useMemo(() => {
    return classesList.filter(c => {
      const matchBoard = selectedBoardFilter === 'All' || c.board === selectedBoardFilter;
      const matchGrade = selectedGradeFilter === 'All' || c.gradeLevel.toLowerCase().includes(selectedGradeFilter.toLowerCase());
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.board.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.stream && c.stream.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchBoard && matchGrade && matchSearch;
    });
  }, [classesList, selectedBoardFilter, selectedGradeFilter, searchQuery]);

  // Handlers
  const handleOpenAddClass = () => {
    setClassForm({
      name: '',
      gradeLevel: '10th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'General',
      room: 'Hall 101',
      classTeacher: 'Prof. Rajesh Sharma',
      capacity: 35,
      selectionMode: 'prefixed',
      selectedPackageId: 'pkg-cbse-10',
      customSubjects: ['Mathematics Standard', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language', 'Hindi Course A', 'Computer Applications']
    });
    setIsAddClassModalOpen(true);
  };

  const handleSaveNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name.trim()) {
      showToast('Please provide a class name.');
      return;
    }

    let finalSubjects: string[] = [];
    let packageName: string | undefined = undefined;

    if (classForm.selectionMode === 'prefixed') {
      const pkg = standardPackages.find(p => p.id === classForm.selectedPackageId);
      finalSubjects = pkg ? pkg.subjects : classForm.customSubjects;
      packageName = pkg?.name;
    } else {
      finalSubjects = classForm.customSubjects;
    }

    const newClass: ClassRecord = {
      id: `cls-${Date.now()}`,
      name: classForm.name,
      gradeLevel: classForm.gradeLevel,
      section: classForm.section,
      board: classForm.board,
      stream: classForm.stream,
      room: classForm.room,
      classTeacher: classForm.classTeacher,
      enrolled: 0,
      capacity: Number(classForm.capacity),
      subjects: finalSubjects,
      selectionMode: classForm.selectionMode,
      packagePresetName: packageName,
      syllabusProgress: 0,
      schedule: '08:00 AM – 02:00 PM'
    };

    setClassesList([newClass, ...classesList]);
    setIsAddClassModalOpen(false);
    showToast(`New class "${newClass.name}" (${newClass.board} • ${newClass.gradeLevel}) created with ${finalSubjects.length} subjects.`);
  };

  const handleOpenConfigureSubjects = (cls: ClassRecord) => {
    setSelectedClassForConfig(cls);
    setClassForm({
      name: cls.name,
      gradeLevel: cls.gradeLevel,
      section: cls.section,
      board: cls.board,
      stream: cls.stream || 'General',
      room: cls.room,
      classTeacher: cls.classTeacher,
      capacity: cls.capacity,
      selectionMode: cls.selectionMode,
      selectedPackageId: standardPackages.find(p => p.board === cls.board && p.name === cls.packagePresetName)?.id || standardPackages[0].id,
      customSubjects: [...cls.subjects]
    });
    setIsConfigureSubjectsModalOpen(true);
  };

  const handleSaveConfiguredSubjects = () => {
    if (!selectedClassForConfig) return;

    let finalSubjects: string[] = [];
    let packageName: string | undefined = undefined;

    if (classForm.selectionMode === 'prefixed') {
      const pkg = standardPackages.find(p => p.id === classForm.selectedPackageId);
      finalSubjects = pkg ? pkg.subjects : classForm.customSubjects;
      packageName = pkg?.name;
    } else {
      finalSubjects = classForm.customSubjects;
    }

    setClassesList(
      classesList.map(c =>
        c.id === selectedClassForConfig.id
          ? {
              ...c,
              board: classForm.board,
              subjects: finalSubjects,
              selectionMode: classForm.selectionMode,
              packagePresetName: packageName
            }
          : c
      )
    );

    setIsConfigureSubjectsModalOpen(false);
    showToast(`Curriculum and subject selection updated for ${selectedClassForConfig.name} (${finalSubjects.length} subjects).`);
  };

  const toggleSubjectCheckbox = (subjectName: string) => {
    if (classForm.customSubjects.includes(subjectName)) {
      setClassForm({
        ...classForm,
        customSubjects: classForm.customSubjects.filter(s => s !== subjectName)
      });
    } else {
      setClassForm({
        ...classForm,
        customSubjects: [...classForm.customSubjects, subjectName]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. HEADER BANNER & BOARD DISTRIBUTION PILL BAR
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0E284D] to-[#0A192F] text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-[11px] uppercase tracking-wider border border-blue-500/30">
                1st to 12th Standard • Multi-Board Curriculum
              </span>
              <span className="text-xs text-slate-400">CBSE • ICSE • State Board • IB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Subject and Classes Configuration
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Configure complete standards (1st to 12th + pre-primary), select educational boards, and assign standardized preset packages or individual elective subjects.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 z-10 self-start md:self-auto">
          <button
            type="button"
            onClick={() => showToast('Exporting curriculum matrix across all standards & boards (PDF)... Ready.')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export Curriculum</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddClass}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class & Curriculum</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. EDUCATION BOARD SELECTION & METRIC TILES
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* CBSE Tile */}
        <div
          onClick={() => setSelectedBoardFilter(selectedBoardFilter === 'CBSE' ? 'All' : 'CBSE')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            selectedBoardFilter === 'CBSE'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">CBSE Curriculum</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
              National
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {classesList.filter(c => c.board === 'CBSE').length}
            </span>
            <span className="text-[11px] font-bold text-slate-400">Classes Configured</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">NCERT 1st to 12th standards</p>
        </div>

        {/* ICSE Tile */}
        <div
          onClick={() => setSelectedBoardFilter(selectedBoardFilter === 'ICSE' ? 'All' : 'ICSE')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            selectedBoardFilter === 'ICSE'
              ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-purple-600 dark:text-purple-400">ICSE Curriculum</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
              CISCE
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {classesList.filter(c => c.board === 'ICSE').length}
            </span>
            <span className="text-[11px] font-bold text-slate-400">Classes Configured</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Detailed literature & practicals</p>
        </div>

        {/* State Board Tile */}
        <div
          onClick={() => setSelectedBoardFilter(selectedBoardFilter === 'State Board' ? 'All' : 'State Board')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            selectedBoardFilter === 'State Board'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">State Board</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
              Regional SSC/HSC
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {classesList.filter(c => c.board === 'State Board').length}
            </span>
            <span className="text-[11px] font-bold text-slate-400">Classes Configured</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">State textbook curriculum</p>
        </div>

        {/* IB Tile */}
        <div
          onClick={() => setSelectedBoardFilter(selectedBoardFilter === 'IB' ? 'All' : 'IB')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            selectedBoardFilter === 'IB'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400">IB International</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
              MYP & DP
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {classesList.filter(c => c.board === 'IB').length}
            </span>
            <span className="text-[11px] font-bold text-slate-400">Classes Configured</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Global Baccalaureate units</p>
        </div>
      </div>

      {/* =========================================================================
          3. NAVIGATION SUB-TABS & UNIFIED FILTER BAR
          ========================================================================= */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Sub-Tabs */}
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMainTab('classes')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeMainTab === 'classes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Classes & Batches ({filteredClasses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('curriculum-config')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeMainTab === 'curriculum-config'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Prefixed Subject Packages ({standardPackages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('all-subjects')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeMainTab === 'all-subjects'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Master Subject Directory ({allMasterSubjects.length})
          </button>
        </div>

        {/* Board & Grade Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Board Selector */}
          <select
            value={selectedBoardFilter}
            onChange={e => setSelectedBoardFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Education Boards</option>
            <option value="CBSE">CBSE Board</option>
            <option value="ICSE">ICSE Board</option>
            <option value="State Board">State Board</option>
            <option value="IB">IB International</option>
          </select>

          {/* Grade Selector (1st to 12th + Pre-Primary) */}
          <select
            value={selectedGradeFilter}
            onChange={e => setSelectedGradeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Grade Levels</option>
            <option value="Nursery">Nursery / KG</option>
            <option value="1st Standard">1st Standard</option>
            <option value="2nd Standard">2nd Standard</option>
            <option value="3rd Standard">3rd Standard</option>
            <option value="4th Standard">4th Standard</option>
            <option value="5th Standard">5th Standard</option>
            <option value="6th Standard">6th Standard</option>
            <option value="7th Standard">7th Standard</option>
            <option value="8th Standard">8th Standard</option>
            <option value="9th Standard">9th Standard</option>
            <option value="10th Standard">10th Standard</option>
            <option value="11th Standard">11th Standard</option>
            <option value="12th Standard">12th Standard</option>
          </select>

          {/* Live Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search class, stream, board..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. TAB 1: CLASSES & BATCHES DIRECTORY (WITH SUBJECT PILLS & BOARD BADGES)
          ========================================================================= */}
      {activeMainTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map(cls => (
            <div
              key={cls.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {/* Board Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase border ${
                      cls.board === 'CBSE'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : cls.board === 'ICSE'
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                        : cls.board === 'State Board'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {cls.board} • {cls.gradeLevel}
                  </span>

                  {/* Mode Badge: Prefixed vs Individual */}
                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cls.selectionMode === 'prefixed'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                    }`}
                  >
                    {cls.selectionMode === 'prefixed' ? <Package className="w-3 h-3" /> : <Sliders className="w-3 h-3" />}
                    <span>{cls.selectionMode === 'prefixed' ? 'Preset Package' : 'Custom Electives'}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                  {cls.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <strong>Teacher:</strong> {cls.classTeacher}
                  </span>
                  <span>•</span>
                  <span>Room: {cls.room}</span>
                </div>

                {/* Enrolled & Capacity */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Class Enrollment</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {cls.enrolled} / {cls.capacity} Students
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (cls.enrolled / cls.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Mapped Subjects Pill List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Enrolled Subjects ({cls.subjects.length})</span>
                  {cls.packagePresetName && (
                    <span className="truncate max-w-[150px] text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                      {cls.packagePresetName}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                  {cls.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{cls.schedule}</span>
                <button
                  type="button"
                  onClick={() => handleOpenConfigureSubjects(cls)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-bold text-xs transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Subjects</span>
                </button>
              </div>
            </div>
          ))}

          {filteredClasses.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800">
              <Layers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="font-semibold text-sm">No classes configured matching the selected board or standard filters.</p>
              <button
                type="button"
                onClick={handleOpenAddClass}
                className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                + Add New Class Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          4. TAB 2: PREFIXED SUBJECT PACKAGES DIRECTORY
          ========================================================================= */}
      {activeMainTab === 'curriculum-config' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Prefixed Subject Packages</strong> automatically map the full accredited core curriculum when spinning up new classes for CBSE, ICSE, State Board, or IB.
              </span>
            </div>
            <span className="font-mono font-bold">{standardPackages.length} Accredited Presets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {standardPackages.map(pkg => (
              <div
                key={pkg.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase border ${
                        pkg.board === 'CBSE'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : pkg.board === 'ICSE'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : pkg.board === 'State Board'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {pkg.board} • {pkg.stream}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {pkg.subjects.length} Core Subjects
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {pkg.name}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block">Preset Subject Bundling:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] border border-slate-200 dark:border-slate-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Standards: {pkg.grades.join(', ')}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setClassForm({
                        ...classForm,
                        board: pkg.board,
                        gradeLevel: pkg.grades[0],
                        selectionMode: 'prefixed',
                        selectedPackageId: pkg.id,
                        customSubjects: [...pkg.subjects]
                      });
                      setIsAddClassModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                  >
                    Apply Package to Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. TAB 3: MASTER SUBJECT DIRECTORY & ELECTIVES
          ========================================================================= */}
      {activeMainTab === 'all-subjects' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Master Subject Catalog & Electives</span>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  {allMasterSubjects.length} Disciplines
                </span>
              </h3>
              <p className="text-xs text-slate-500">Curated across all boards and standards (1st to 12th)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">Subject Name & Code</th>
                  <th className="py-3 px-3">Discipline Category</th>
                  <th className="py-3 px-3">Supported Boards</th>
                  <th className="py-3 px-3">Weekly Hours</th>
                  <th className="py-3 px-3">Head of Department</th>
                  <th className="py-3 px-3">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {allMasterSubjects.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{sub.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{sub.code}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {sub.category}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {sub.boards.map(b => (
                          <span key={b} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {sub.weeklyHours} Hrs/Week
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200">
                      {sub.leadTeacher}
                    </td>
                    <td className="py-3 px-3">
                      {sub.isElective ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200">
                          Elective / Optional
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200">
                          Core Compulsory
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. MODAL: ADD CLASS & CURRICULUM CONFIGURATION
          ========================================================================= */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Create Class & Configure Curriculum</h3>
                  <span className="text-xs text-slate-400">Accredited Grade & Subject Mapping</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddClassModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClass} className="space-y-4 text-xs">
              {/* Row 1: Class Name & Board */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Title / Section Label
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 10A Science & Math"
                    value={classForm.name}
                    onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Education Board
                  </label>
                  <select
                    value={classForm.board}
                    onChange={e => setClassForm({ ...classForm, board: e.target.value as EducationBoard })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="CBSE">CBSE (Central Board)</option>
                    <option value="ICSE">ICSE (CISCE Board)</option>
                    <option value="State Board">State Secondary Board</option>
                    <option value="IB">IB (International Baccalaureate)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Standard (1st to 12th) & Section */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grade Standard
                  </label>
                  <select
                    value={classForm.gradeLevel}
                    onChange={e => setClassForm({ ...classForm, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="Nursery">Nursery / KG</option>
                    <option value="1st Standard">1st Standard</option>
                    <option value="2nd Standard">2nd Standard</option>
                    <option value="3rd Standard">3rd Standard</option>
                    <option value="4th Standard">4th Standard</option>
                    <option value="5th Standard">5th Standard</option>
                    <option value="6th Standard">6th Standard</option>
                    <option value="7th Standard">7th Standard</option>
                    <option value="8th Standard">8th Standard</option>
                    <option value="9th Standard">9th Standard</option>
                    <option value="10th Standard">10th Standard</option>
                    <option value="11th Standard">11th Standard</option>
                    <option value="12th Standard">12th Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={classForm.section}
                    onChange={e => setClassForm({ ...classForm, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Classroom
                  </label>
                  <input
                    type="text"
                    value={classForm.room}
                    onChange={e => setClassForm({ ...classForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Class Teacher & Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Mentor / Lead Teacher
                  </label>
                  <select
                    value={classForm.classTeacher}
                    onChange={e => setClassForm({ ...classForm, classTeacher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Prof. Rajesh Sharma">Prof. Rajesh Sharma (Mathematics)</option>
                    <option value="Dr. Neha Kulkarni">Dr. Neha Kulkarni (Physics)</option>
                    <option value="Prof. Amit Verma">Prof. Amit Verma (Chemistry)</option>
                    <option value="Mrs. Sunita Rao">Mrs. Sunita Rao (English & Languages)</option>
                    <option value="Dr. Priya Nair">Dr. Priya Nair (Life Sciences & Tech)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    value={classForm.capacity}
                    onChange={e => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* SUBJECT CONFIGURATION MODE: Prefixed Packages vs Individual Selection */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Curriculum Subject Assignment Mode</span>
                  </span>
                  <div className="inline-flex p-0.5 bg-slate-200 dark:bg-slate-700 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setClassForm({ ...classForm, selectionMode: 'prefixed' })}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                        classForm.selectionMode === 'prefixed'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Prefixed Package
                    </button>
                    <button
                      type="button"
                      onClick={() => setClassForm({ ...classForm, selectionMode: 'individual' })}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                        classForm.selectionMode === 'individual'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Individual Selection
                    </button>
                  </div>
                </div>

                {/* Option 1: Prefixed Package Dropdown */}
                {classForm.selectionMode === 'prefixed' && (
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Select Standardized Board Package:
                    </label>
                    <select
                      value={classForm.selectedPackageId}
                      onChange={e => {
                        const pkg = standardPackages.find(p => p.id === e.target.value);
                        setClassForm({
                          ...classForm,
                          selectedPackageId: e.target.value,
                          customSubjects: pkg ? [...pkg.subjects] : classForm.customSubjects
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      {standardPackages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} ({pkg.board} • {pkg.subjects.length} Subjects)
                        </option>
                      ))}
                    </select>

                    {/* Preview of Subjects */}
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Bundled Curriculum Subjects:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {classForm.customSubjects.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Option 2: Individual Checkbox Selector */}
                {classForm.selectionMode === 'individual' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Check subjects to allocate for this class ({classForm.customSubjects.length} selected):
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      {allMasterSubjects.map(sub => {
                        const isChecked = classForm.customSubjects.includes(sub.name);
                        return (
                          <label
                            key={sub.id}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSubjectCheckbox(sub.name)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="truncate">
                              <span className="block truncate text-xs">{sub.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {sub.category} • {sub.weeklyHours}h/wk
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  Save & Publish Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL: CONFIGURE SUBJECTS FOR EXISTING CLASS
          ========================================================================= */}
      {isConfigureSubjectsModalOpen && selectedClassForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Configure Subjects – {selectedClassForConfig.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {selectedClassForConfig.board} • {selectedClassForConfig.gradeLevel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigureSubjectsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Board Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Accredited Education Board
                </label>
                <select
                  value={classForm.board}
                  onChange={e => setClassForm({ ...classForm, board: e.target.value as EducationBoard })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                >
                  <option value="CBSE">CBSE (Central Board)</option>
                  <option value="ICSE">ICSE (CISCE Board)</option>
                  <option value="State Board">State Board (SSC/HSC)</option>
                  <option value="IB">IB (International Baccalaureate)</option>
                </select>
              </div>

              {/* Selection Mode Switcher */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Curriculum Allocation Strategy</span>
                  <span className="text-slate-400 text-[11px]">Choose between standardized packages or custom electives</span>
                </div>
                <div className="inline-flex p-0.5 bg-slate-200 dark:bg-slate-700 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setClassForm({ ...classForm, selectionMode: 'prefixed' })}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      classForm.selectionMode === 'prefixed'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Preset Package
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassForm({ ...classForm, selectionMode: 'individual' })}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                      classForm.selectionMode === 'individual'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Custom Electives
                  </button>
                </div>
              </div>

              {/* Mode 1: Package Selector */}
              {classForm.selectionMode === 'prefixed' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Apply Package:
                  </label>
                  <select
                    value={classForm.selectedPackageId}
                    onChange={e => {
                      const pkg = standardPackages.find(p => p.id === e.target.value);
                      setClassForm({
                        ...classForm,
                        selectedPackageId: e.target.value,
                        customSubjects: pkg ? [...pkg.subjects] : classForm.customSubjects
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                  >
                    {standardPackages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.board} • {pkg.subjects.length} Subjects)
                      </option>
                    ))}
                  </select>

                  <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 block mb-1">
                      Assigned Subjects:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {classForm.customSubjects.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Individual Checkbox Selector */}
              {classForm.selectionMode === 'individual' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Hand-pick subjects and electives ({classForm.customSubjects.length} selected):
                  </span>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    {allMasterSubjects.map(sub => {
                      const isChecked = classForm.customSubjects.includes(sub.name);
                      return (
                        <label
                          key={sub.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSubjectCheckbox(sub.name)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="truncate">
                            <span className="block truncate text-xs">{sub.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {sub.category} • {sub.weeklyHours}h
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsConfigureSubjectsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfiguredSubjects}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
              >
                Save Subject Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
