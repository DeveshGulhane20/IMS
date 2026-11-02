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
  Award,
  ArrowLeft,
  Trash2,
  UserCheck,
  ChevronDown,
  School,
  Compass
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

export type EducationBoard = 'CBSE' | 'ICSE' | 'State Board' | 'IB';

export interface ClassRecord {
  id: string;
  name: string;
  gradeLevel: string; // "Nursery", "1st Standard", ... "10th Standard", "11th Standard", "12th Standard"
  section: string;
  board: EducationBoard;
  stream?: string; // "General", "Science (PCM)", "Science (PCB)", "Commerce", "Humanities", "International MYP", "IB Diploma"
  room: string;
  classTeacher: string;
  enrolled: number;
  capacity: number;
  subjects: string[];
  subjectTeachers?: Record<string, string>; // subjectName -> teacherName
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
  const { showToast, academicTeachers, assignTeacherToSubject, removeTeacherFromSubject } = useIMS();

  // Board-Specific Drill-Down Navigation State: null = Master View, or 'CBSE' | 'ICSE' | 'State Board' | 'IB'
  const [selectedBoardView, setSelectedBoardView] = useState<EducationBoard | null>(null);

  // Navigation Sub-tabs in master view: 'classes' | 'curriculum-config' | 'all-subjects'
  const [activeMainTab, setActiveMainTab] = useState<'classes' | 'curriculum-config' | 'all-subjects'>('classes');

  // Filtering Controls
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<'All' | EducationBoard>('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('All');
  const [selectedStreamFilter, setSelectedStreamFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state for Classes
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false);
  const [isConfigureSubjectsModalOpen, setIsConfigureSubjectsModalOpen] = useState(false);
  const [selectedClassForConfig, setSelectedClassForConfig] = useState<ClassRecord | null>(null);
  const [classToEdit, setClassToEdit] = useState<ClassRecord | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRecord | null>(null);

  // Modals state for Boards
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<any | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<any | null>(null);

  // Modals state for Master Subjects
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [isDeleteSubjectModalOpen, setIsDeleteSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectItem | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectItem | null>(null);

  // Inline Subject Addition State per class
  const [addingSubjectForClassId, setAddingSubjectForClassId] = useState<string | null>(null);
  const [newSubjectSelection, setNewSubjectSelection] = useState<string>('');
  const [newSubjectTeacher, setNewSubjectTeacher] = useState<string>('Prof. Rajesh Sharma');

  // Form State for Add / Edit Class
  const [classForm, setClassForm] = useState({
    name: '',
    gradeLevel: '10th Standard',
    section: 'A',
    board: 'CBSE' as EducationBoard,
    stream: 'High School',
    room: 'Hall 101',
    classTeacher: 'Prof. Rajesh Sharma',
    capacity: 35,
    selectionMode: 'prefixed' as 'prefixed' | 'individual',
    selectedPackageId: 'pkg-cbse-10',
    customSubjects: ['Mathematics Standard', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language', 'Hindi Course A', 'Computer Applications']
  });

  // Form State for Edit Class Details
  const [classEditForm, setClassEditForm] = useState({
    name: '',
    room: '',
    classTeacher: '',
    capacity: 35,
    schedule: '08:00 AM – 02:00 PM'
  });

  // Form State for Add / Edit Board
  const [boardFormData, setBoardFormData] = useState({
    name: '',
    acronym: 'CBSE',
    tagline: '',
    authority: '',
    standardsLabel: '1st Standard to 12th Standard',
    gradingScheme: 'Standard GPA / Percentage System',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Form State for Add / Edit Subject
  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    category: 'Sciences & Math' as SubjectItem['category'],
    boards: ['CBSE', 'ICSE', 'State Board', 'IB'] as EducationBoard[],
    weeklyHours: 5,
    leadTeacher: 'Prof. Rajesh Sharma',
    isElective: false
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
      subjects: ['Mathematics Standard', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language & Literature', 'Hindi Course A', 'Artificial Intelligence']
    },
    {
      id: 'pkg-icse-10',
      name: 'ICSE Secondary 10-Paper Package (9th–10th)',
      board: 'ICSE',
      grades: ['9th Standard', '10th Standard'],
      stream: 'High School',
      description: 'Rigorous distinct papers for Physics, Chemistry, Biology, History-Civics, and Geography.',
      subjects: ['English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'Computer Applications']
    },
    {
      id: 'pkg-state-10',
      name: 'State Board SSC Matriculation (9th–10th)',
      board: 'State Board',
      grades: ['9th Standard', '10th Standard'],
      stream: 'High School',
      description: 'Official State Board SSC curriculum with Mathematics, Science, and 3 languages.',
      subjects: ['Mathematics (Algebra & Geometry)', 'Science & Technology (Part 1 & 2)', 'Social Sciences', 'First Language (English)', 'Second Language (Hindi)', 'Third Language (Marathi)']
    },
    {
      id: 'pkg-ib-myp',
      name: 'IB Middle Years Programme (MYP 9th–10th)',
      board: 'IB',
      grades: ['9th Standard', '10th Standard'],
      stream: 'International MYP',
      description: 'Inquiry-based international curriculum with personal projects and global interdisciplinary units.',
      subjects: ['Language and Literature (English)', 'Language Acquisition (French)', 'Individuals and Societies', 'Integrated Sciences', 'Mathematics Extended', 'Design & Technology']
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
      subjects: ['Physics', 'Chemistry', 'Biology (Botany & Zoology)', 'English Core', 'Psychology', 'Physical Education']
    },
    {
      id: 'pkg-11-12-comm',
      name: 'Higher Secondary Commerce Stream (11th–12th)',
      board: 'CBSE',
      grades: ['11th Standard', '12th Standard'],
      stream: 'Commerce',
      description: 'Comprehensive business finance, taxation, economics, and commercial enterprise accounting.',
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Applied Mathematics', 'English Core', 'Entrepreneurship']
    },
    {
      id: 'pkg-11-12-ibdp',
      name: 'IB Diploma Programme (IBDP 11th–12th)',
      board: 'IB',
      grades: ['11th Standard', '12th Standard'],
      stream: 'IB Diploma',
      description: 'Prestigious 6-subject international diploma including Theory of Knowledge (TOK) and Extended Essay.',
      subjects: ['IB English A Literature HL', 'IB Mathematics Analysis & Approaches HL', 'IB Physics HL', 'IB Chemistry SL', 'IB Economics SL', 'Theory of Knowledge (TOK)']
    }
  ];

  // Master Catalog of Individual Electives & Subjects (State for Add, Edit, Delete)
  const [allMasterSubjects, setAllMasterSubjects] = useState<SubjectItem[]>([
    // Sciences & Math
    { id: 'sub-mth', code: 'MTH-101', name: 'Mathematics', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Rajesh Sharma' },
    { id: 'sub-mth-std', code: 'MTH-201', name: 'Mathematics Standard', category: 'Sciences & Math', boards: ['CBSE'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Rajesh Sharma' },
    { id: 'sub-amth', code: 'MTH-301', name: 'Advanced Mathematics (Calculus & Vectors)', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 7, leadTeacher: 'Prof. Rajesh Sharma' },
    { id: 'sub-phy', code: 'PHY-201', name: 'Physics', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'Dr. Neha Kulkarni' },
    { id: 'sub-chm', code: 'CHM-201', name: 'Chemistry', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Amit Verma' },
    { id: 'sub-bio', code: 'BIO-201', name: 'Biology (Botany & Zoology)', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Dr. Sunita Deshmukh' },
    { id: 'sub-sci-cbse', code: 'SCI-200', name: 'Science (Physics, Chemistry, Biology)', category: 'Sciences & Math', boards: ['CBSE'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 6, leadTeacher: 'Dr. Neha Kulkarni' },
    { id: 'sub-gsci', code: 'SCI-050', name: 'General Science', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard'], weeklyHours: 5, leadTeacher: 'Dr. Sunita Deshmukh' },
    { id: 'sub-evs', code: 'EVS-010', name: 'Environmental Studies (EVS)', category: 'Sciences & Math', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['Nursery', 'LKG', 'UKG', '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard'], weeklyHours: 4, leadTeacher: 'Mrs. Sunita Rao' },
    { id: 'sub-sci-tech', code: 'SCI-100', name: 'Science & Technology (Part 1 & 2)', category: 'Sciences & Math', boards: ['State Board'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Amit Verma' },
    { id: 'sub-alg-geo', code: 'MTH-102', name: 'Mathematics (Algebra & Geometry)', category: 'Sciences & Math', boards: ['State Board'], gradeLevels: ['8th Standard', '9th Standard', '10th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Rajesh Sharma' },

    // Languages
    { id: 'sub-eng', code: 'ENG-101', name: 'English Language & Literature', category: 'Languages', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Mrs. Priya Kapoor' },
    { id: 'sub-eng-lang', code: 'ENG-102', name: 'English Language', category: 'Languages', boards: ['ICSE', 'CBSE'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 5, leadTeacher: 'Mrs. Priya Kapoor' },
    { id: 'sub-eng-lit', code: 'ENG-103', name: 'English Literature', category: 'Languages', boards: ['ICSE', 'CBSE'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 5, leadTeacher: 'Mrs. Priya Kapoor' },
    { id: 'sub-eng-core', code: 'ENG-301', name: 'English Core', category: 'Languages', boards: ['CBSE'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Mrs. Priya Kapoor' },
    { id: 'sub-hin', code: 'HIN-101', name: 'Hindi Course A', category: 'Languages', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Mrs. Priya Kapoor' },
    { id: 'sub-mar', code: 'MAR-101', name: 'Marathi (Third/Regional Language)', category: 'Languages', boards: ['State Board'], gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Mrs. V. Deshpande' },
    { id: 'sub-san', code: 'SAN-101', name: 'Sanskrit / Third Language', category: 'Languages', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard'], weeklyHours: 3, leadTeacher: 'Acharya V. Shastri', isElective: true },
    { id: 'sub-frn', code: 'FRN-201', name: 'Language Acquisition (French)', category: 'Languages', boards: ['IB', 'CBSE', 'ICSE'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 4, leadTeacher: 'Madame C. Leroux', isElective: true },

    // Social Sciences
    { id: 'sub-sst', code: 'SST-101', name: 'Social Science', category: 'Social Sciences', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Sunita Deshmukh' },
    { id: 'sub-hist-civ', code: 'HIS-101', name: 'History & Civics', category: 'Social Sciences', boards: ['ICSE'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Sunita Deshmukh' },
    { id: 'sub-geo', code: 'GEO-101', name: 'Geography', category: 'Social Sciences', boards: ['ICSE'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Sunita Deshmukh' },
    { id: 'sub-eco', code: 'ECO-301', name: 'Economics', category: 'Social Sciences', boards: ['CBSE', 'ICSE', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'CA Ramesh Bhandari', isElective: true },
    { id: 'sub-psy', code: 'PSY-301', name: 'Psychology', category: 'Social Sciences', boards: ['CBSE', 'IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Sunita Deshmukh', isElective: true },

    // Commerce
    { id: 'sub-acc', code: 'ACC-301', name: 'Accountancy', category: 'Commerce', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'CA Ramesh Bhandari' },
    { id: 'sub-bst', code: 'BST-301', name: 'Business Studies', category: 'Commerce', boards: ['CBSE', 'ICSE', 'State Board'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'CA Ramesh Bhandari' },
    { id: 'sub-ent', code: 'ENT-301', name: 'Entrepreneurship', category: 'Commerce', boards: ['CBSE'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 4, leadTeacher: 'CA Ramesh Bhandari' },

    // Technology
    { id: 'sub-cs', code: 'CSC-101', name: 'Computer Science (Python)', category: 'Technology', boards: ['CBSE', 'ICSE', 'State Board', 'IB'], gradeLevels: ['6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Neha Kulkarni' },
    { id: 'sub-ai', code: 'AI-201', name: 'Artificial Intelligence', category: 'Technology', boards: ['CBSE', 'IB'], gradeLevels: ['9th Standard', '10th Standard', '11th Standard', '12th Standard'], weeklyHours: 3, leadTeacher: 'Dr. Neha Kulkarni', isElective: true },
    { id: 'sub-ca', code: 'CA-101', name: 'Computer Applications', category: 'Technology', boards: ['ICSE'], gradeLevels: ['9th Standard', '10th Standard'], weeklyHours: 4, leadTeacher: 'Dr. Neha Kulkarni' },

    // IB Specific
    { id: 'sub-ib-eng', code: 'IB-ENG-HL', name: 'IB English A Literature HL', category: 'Languages', boards: ['IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'Mrs. Priya Kapoor' },
    { id: 'sub-ib-mth', code: 'IB-MTH-HL', name: 'IB Mathematics Analysis & Approaches HL', category: 'Sciences & Math', boards: ['IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'Prof. Rajesh Sharma' },
    { id: 'sub-ib-phy', code: 'IB-PHY-HL', name: 'IB Physics HL', category: 'Sciences & Math', boards: ['IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 6, leadTeacher: 'Dr. Neha Kulkarni' },
    { id: 'sub-ib-chm', code: 'IB-CHM-SL', name: 'IB Chemistry SL', category: 'Sciences & Math', boards: ['IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'Prof. Amit Verma' },
    { id: 'sub-ib-eco', code: 'IB-ECO-SL', name: 'IB Economics SL', category: 'Social Sciences', boards: ['IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 5, leadTeacher: 'CA Ramesh Bhandari' },
    { id: 'sub-ib-tok', code: 'IB-TOK', name: 'Theory of Knowledge (TOK)', category: 'Social Sciences', boards: ['IB'], gradeLevels: ['11th Standard', '12th Standard'], weeklyHours: 3, leadTeacher: 'Mrs. Priya Kapoor' }
  ]);

  // Curriculum Boards state with full CRUD
  const [boardsList, setBoardsList] = useState<any[]>([
    {
      id: 'brd-cbse',
      boardKey: 'CBSE' as EducationBoard,
      title: 'Central Board of Secondary Education (CBSE)',
      acronym: 'CBSE',
      tagline: 'National curriculum governed by NCERT with continuous comprehensive evaluation',
      theme: 'blue',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      cardGradient: 'from-blue-900/90 via-slate-900 to-[#0A192F]',
      authority: 'Ministry of Education, Govt. of India',
      standardsLabel: '1st Standard to 12th Standard (NCERT Framework)',
      activeBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      gradingScheme: 'CBSE 9-Point Grading Scale & Percentage',
      status: 'Active'
    },
    {
      id: 'brd-icse',
      boardKey: 'ICSE' as EducationBoard,
      title: 'Council for the Indian School Certificate Examinations (ICSE / ISC)',
      acronym: 'ICSE',
      tagline: 'In-depth English literature, balanced physical sciences, and distinct 10-paper board curriculum',
      theme: 'purple',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      cardGradient: 'from-purple-950/90 via-slate-900 to-[#120B24]',
      authority: 'CISCE Council for Indian School Certificate Examinations',
      standardsLabel: '1st Standard to 12th Standard (ICSE & ISC Wing)',
      activeBadge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      gradingScheme: 'CISCE 1-9 Point Scale & Direct Marks Assessment',
      status: 'Active'
    },
    {
      id: 'brd-state',
      boardKey: 'State Board' as EducationBoard,
      title: 'State Secondary & Higher Secondary Education Board',
      acronym: 'State Board',
      tagline: 'Regional mother-tongue synthesis, state syllabus standards, and vocational matrix',
      theme: 'emerald',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      cardGradient: 'from-emerald-950/90 via-slate-900 to-[#062016]',
      authority: 'State Department of School Education & Sports',
      standardsLabel: '1st Standard to 12th Standard (SSC & HSC Stream)',
      activeBadge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      gradingScheme: 'State SSC/HSC Standard Percentage & Grades',
      status: 'Active'
    },
    {
      id: 'brd-ib',
      boardKey: 'IB' as EducationBoard,
      title: 'International Baccalaureate Organization (IB PYP, MYP & DP)',
      acronym: 'IB International',
      tagline: 'Inquiry-based international curriculum with global interdisciplinary contexts and TOK synthesis',
      theme: 'amber',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      cardGradient: 'from-amber-950/90 via-slate-900 to-[#261506]',
      authority: 'International Baccalaureate (Geneva, Switzerland)',
      standardsLabel: 'Primary Years (PYP), Middle Years (MYP) & Diploma (DP)',
      activeBadge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      gradingScheme: 'IB 1-7 Scale & TOK/EE Matrix',
      status: 'Active'
    }
  ]);

  // Comprehensive Classes spanning 1st to 12th standards across all 4 boards
  const [classesList, setClassesList] = useState<ClassRecord[]>([
    // ==========================================
    // CBSE CLASSES (1st to 12th)
    // ==========================================
    {
      id: 'cls-10a-cbse',
      name: 'Class 10A – Science & Math Honors',
      gradeLevel: '10th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'High School',
      room: 'Hall 101',
      classTeacher: 'Prof. Rajesh Sharma',
      enrolled: 20,
      capacity: 35,
      subjects: ['Mathematics Standard', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language & Literature', 'Hindi Course A', 'Artificial Intelligence'],
      subjectTeachers: {
        'Mathematics Standard': 'Prof. Rajesh Sharma',
        'Science (Physics, Chemistry, Biology)': 'Dr. Neha Kulkarni',
        'Social Science': 'Dr. Sunita Deshmukh',
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Artificial Intelligence': 'Dr. Neha Kulkarni'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Secondary Board (9th–10th)',
      syllabusProgress: 84,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-9a-cbse',
      name: 'Class 9A – Secondary Scholars',
      gradeLevel: '9th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'High School',
      room: 'Room 204',
      classTeacher: 'Mrs. Priya Kapoor',
      enrolled: 9,
      capacity: 35,
      subjects: ['Mathematics Standard', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'English Language', 'Hindi Course A'],
      subjectTeachers: {
        'Mathematics Standard': 'Prof. Rajesh Sharma',
        'Science (Physics, Chemistry, Biology)': 'Dr. Neha Kulkarni',
        'Social Science': 'Dr. Sunita Deshmukh',
        'English Language': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Secondary Board (9th–10th)',
      syllabusProgress: 76,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-8a-cbse',
      name: 'Class 8A – Middle Foundation',
      gradeLevel: '8th Standard',
      section: 'A',
      board: 'CBSE',
      stream: 'Middle School',
      room: 'Junior Hall 108',
      classTeacher: 'Dr. Sunita Deshmukh',
      enrolled: 6,
      capacity: 30,
      subjects: ['Mathematics', 'General Science', 'Social Science', 'English Language & Literature', 'Hindi Course A', 'Sanskrit / Third Language'],
      subjectTeachers: {
        'Mathematics': 'Prof. Rajesh Sharma',
        'General Science': 'Dr. Sunita Deshmukh',
        'Social Science': 'Dr. Sunita Deshmukh',
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Sanskrit / Third Language': 'Prof. Rajesh Sharma'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Middle School Core',
      syllabusProgress: 89,
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
      classTeacher: 'Mrs. Priya Kapoor',
      enrolled: 0,
      capacity: 30,
      subjects: ['Mathematics', 'General Science', 'English Language & Literature', 'Hindi Course A', 'Environmental Studies (EVS)'],
      subjectTeachers: {
        'Mathematics': 'Prof. Rajesh Sharma',
        'General Science': 'Dr. Sunita Deshmukh',
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Environmental Studies (EVS)': 'Dr. Sunita Deshmukh'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'CBSE Primary Foundation',
      syllabusProgress: 91,
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
      classTeacher: 'Mrs. Priya Kapoor',
      enrolled: 0,
      capacity: 25,
      subjects: ['Mathematics', 'English Language & Literature', 'Hindi Course A', 'Environmental Studies (EVS)'],
      subjectTeachers: {
        'Mathematics': 'Prof. Rajesh Sharma',
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Environmental Studies (EVS)': 'Dr. Sunita Deshmukh'
      },
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
      enrolled: 0,
      capacity: 35,
      subjects: ['Physics', 'Chemistry', 'Advanced Mathematics (Calculus & Vectors)', 'English Core', 'Computer Science (Python)'],
      subjectTeachers: {
        'Physics': 'Dr. Neha Kulkarni',
        'Chemistry': 'Prof. Amit Verma',
        'Advanced Mathematics (Calculus & Vectors)': 'Prof. Rajesh Sharma',
        'English Core': 'Mrs. Priya Kapoor',
        'Computer Science (Python)': 'Dr. Neha Kulkarni'
      },
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
      enrolled: 0,
      capacity: 35,
      subjects: ['Physics', 'Chemistry', 'Biology (Botany & Zoology)', 'English Core', 'Psychology'],
      subjectTeachers: {
        'Physics': 'Dr. Neha Kulkarni',
        'Chemistry': 'Prof. Amit Verma',
        'Biology (Botany & Zoology)': 'Dr. Sunita Deshmukh',
        'English Core': 'Mrs. Priya Kapoor',
        'Psychology': 'Dr. Sunita Deshmukh'
      },
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
      classTeacher: 'Prof. Rajesh Sharma',
      enrolled: 0,
      capacity: 32,
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'English Core', 'Entrepreneurship'],
      subjectTeachers: {
        'Accountancy': 'Prof. Rajesh Sharma',
        'Business Studies': 'Prof. Rajesh Sharma',
        'Economics': 'Prof. Rajesh Sharma',
        'English Core': 'Mrs. Priya Kapoor',
        'Entrepreneurship': 'Prof. Amit Verma'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'Higher Secondary Commerce Stream',
      syllabusProgress: 92,
      schedule: '08:00 AM – 03:00 PM'
    },

    // ==========================================
    // ICSE CLASSES (1st to 12th)
    // ==========================================
    {
      id: 'cls-10b-icse',
      name: 'Class 10B – ICSE Board Aspirants',
      gradeLevel: '10th Standard',
      section: 'B',
      board: 'ICSE',
      stream: 'High School',
      room: 'Hall 102',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 15,
      capacity: 35,
      subjects: ['English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology (Botany & Zoology)', 'History & Civics', 'Geography', 'Computer Applications'],
      subjectTeachers: {
        'English Language': 'Mrs. Priya Kapoor',
        'English Literature': 'Mrs. Priya Kapoor',
        'Mathematics': 'Prof. Rajesh Sharma',
        'Physics': 'Dr. Neha Kulkarni',
        'Chemistry': 'Prof. Amit Verma',
        'Biology (Botany & Zoology)': 'Dr. Sunita Deshmukh',
        'History & Civics': 'Dr. Sunita Deshmukh',
        'Geography': 'Dr. Sunita Deshmukh',
        'Computer Applications': 'Dr. Neha Kulkarni'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'ICSE Secondary 10-Paper Package',
      syllabusProgress: 81,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-9b-icse',
      name: 'Class 9B – ICSE Secondary Foundations',
      gradeLevel: '9th Standard',
      section: 'B',
      board: 'ICSE',
      stream: 'High School',
      room: 'Hall 105',
      classTeacher: 'Mrs. Priya Kapoor',
      enrolled: 0,
      capacity: 32,
      subjects: ['English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology (Botany & Zoology)', 'History & Civics'],
      subjectTeachers: {
        'English Language': 'Mrs. Priya Kapoor',
        'English Literature': 'Mrs. Priya Kapoor',
        'Mathematics': 'Prof. Rajesh Sharma',
        'Physics': 'Dr. Neha Kulkarni',
        'Chemistry': 'Prof. Amit Verma',
        'Biology (Botany & Zoology)': 'Dr. Sunita Deshmukh',
        'History & Civics': 'Dr. Sunita Deshmukh'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'ICSE Secondary 10-Paper Package',
      syllabusProgress: 75,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-7a-icse',
      name: 'Class 7A – ICSE Junior Achievers',
      gradeLevel: '7th Standard',
      section: 'A',
      board: 'ICSE',
      stream: 'Middle School',
      room: 'Junior Hall 109',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 0,
      capacity: 30,
      subjects: ['Mathematics', 'General Science', 'Social Science', 'English Language & Literature', 'Hindi Course A', 'Computer Applications'],
      subjectTeachers: {
        'Mathematics': 'Prof. Rajesh Sharma',
        'General Science': 'Prof. Amit Verma',
        'Social Science': 'Dr. Sunita Deshmukh',
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Computer Applications': 'Dr. Neha Kulkarni'
      },
      selectionMode: 'individual',
      syllabusProgress: 86,
      schedule: '09:00 AM – 02:00 PM'
    },
    {
      id: 'cls-1a-icse',
      name: 'Class 1A – ICSE Primary Comprehensive',
      gradeLevel: '1st Standard',
      section: 'A',
      board: 'ICSE',
      stream: 'Primary Core',
      room: 'Primary Block 105',
      classTeacher: 'Mrs. Priya Kapoor',
      enrolled: 0,
      capacity: 25,
      subjects: ['English Language & Literature', 'Mathematics', 'General Science', 'Hindi Course A', 'Environmental Studies (EVS)'],
      subjectTeachers: {
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Mathematics': 'Prof. Rajesh Sharma',
        'General Science': 'Dr. Sunita Deshmukh',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Environmental Studies (EVS)': 'Dr. Sunita Deshmukh'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'ICSE Primary Comprehensive',
      syllabusProgress: 94,
      schedule: '08:30 AM – 01:30 PM'
    },
    {
      id: 'cls-12-isc',
      name: 'Class 12 ISC – Science & Research Stream',
      gradeLevel: '12th Standard',
      section: 'ISC',
      board: 'ICSE',
      stream: 'Science (PCM)',
      room: 'Senior Wing Hall 201',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 0,
      capacity: 30,
      subjects: ['Physics', 'Chemistry', 'Advanced Mathematics (Calculus & Vectors)', 'English Language', 'Computer Science (Python)'],
      subjectTeachers: {
        'Physics': 'Dr. Neha Kulkarni',
        'Chemistry': 'Prof. Amit Verma',
        'Advanced Mathematics (Calculus & Vectors)': 'Prof. Rajesh Sharma',
        'English Language': 'Mrs. Priya Kapoor',
        'Computer Science (Python)': 'Dr. Neha Kulkarni'
      },
      selectionMode: 'prefixed',
      syllabusProgress: 91,
      schedule: '08:00 AM – 02:30 PM'
    },

    // ==========================================
    // STATE BOARD CLASSES (1st to 12th)
    // ==========================================
    {
      id: 'cls-10c-state',
      name: 'Class 10C – State SSC Matriculation',
      gradeLevel: '10th Standard',
      section: 'C',
      board: 'State Board',
      stream: 'High School',
      room: 'Room 201',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 0,
      capacity: 40,
      subjects: ['Mathematics (Algebra & Geometry)', 'Science & Technology (Part 1 & 2)', 'Social Science', 'English Language', 'Hindi Course A', 'Marathi (Third/Regional Language)'],
      subjectTeachers: {
        'Mathematics (Algebra & Geometry)': 'Prof. Rajesh Sharma',
        'Science & Technology (Part 1 & 2)': 'Prof. Amit Verma',
        'Social Science': 'Dr. Sunita Deshmukh',
        'English Language': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Marathi (Third/Regional Language)': 'Prof. Amit Verma'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'State Board SSC Matriculation',
      syllabusProgress: 88,
      schedule: '08:30 AM – 02:30 PM'
    },
    {
      id: 'cls-9c-state',
      name: 'Class 9C – State Secondary Aspirants',
      gradeLevel: '9th Standard',
      section: 'C',
      board: 'State Board',
      stream: 'High School',
      room: 'Room 202',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 0,
      capacity: 40,
      subjects: ['Mathematics (Algebra & Geometry)', 'Science & Technology (Part 1 & 2)', 'Social Science', 'English Language', 'Marathi (Third/Regional Language)'],
      subjectTeachers: {
        'Mathematics (Algebra & Geometry)': 'Prof. Rajesh Sharma',
        'Science & Technology (Part 1 & 2)': 'Prof. Amit Verma',
        'Social Science': 'Dr. Sunita Deshmukh',
        'English Language': 'Mrs. Priya Kapoor',
        'Marathi (Third/Regional Language)': 'Prof. Amit Verma'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'State Board SSC Matriculation',
      syllabusProgress: 79,
      schedule: '08:30 AM – 02:30 PM'
    },
    {
      id: 'cls-6a-state',
      name: 'Class 6A – State Middle Curriculum',
      gradeLevel: '6th Standard',
      section: 'A',
      board: 'State Board',
      stream: 'Middle School',
      room: 'Room 103',
      classTeacher: 'Dr. Sunita Deshmukh',
      enrolled: 0,
      capacity: 35,
      subjects: ['Mathematics', 'General Science', 'Social Science', 'English Language', 'Marathi (Third/Regional Language)'],
      subjectTeachers: {
        'Mathematics': 'Prof. Rajesh Sharma',
        'General Science': 'Dr. Sunita Deshmukh',
        'Social Science': 'Dr. Sunita Deshmukh',
        'English Language': 'Mrs. Priya Kapoor',
        'Marathi (Third/Regional Language)': 'Prof. Amit Verma'
      },
      selectionMode: 'prefixed',
      syllabusProgress: 85,
      schedule: '09:00 AM – 02:00 PM'
    },
    {
      id: 'cls-3a-state',
      name: 'Class 3A – Primary State Stream',
      gradeLevel: '3rd Standard',
      section: 'A',
      board: 'State Board',
      stream: 'Primary Core',
      room: 'Primary Block 104',
      classTeacher: 'Mrs. Priya Kapoor',
      enrolled: 0,
      capacity: 30,
      subjects: ['English Language', 'Hindi Course A', 'Marathi (Third/Regional Language)', 'Mathematics', 'Environmental Studies (EVS)'],
      subjectTeachers: {
        'English Language': 'Mrs. Priya Kapoor',
        'Hindi Course A': 'Mrs. Priya Kapoor',
        'Marathi (Third/Regional Language)': 'Prof. Amit Verma',
        'Mathematics': 'Prof. Rajesh Sharma',
        'Environmental Studies (EVS)': 'Dr. Sunita Deshmukh'
      },
      selectionMode: 'individual',
      syllabusProgress: 94,
      schedule: '09:00 AM – 01:30 PM'
    },
    {
      id: 'cls-12-hsc',
      name: 'Class 12 HSC – State Board Science',
      gradeLevel: '12th Standard',
      section: 'HSC',
      board: 'State Board',
      stream: 'Science (PCM)',
      room: 'Senior Block Room 205',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 0,
      capacity: 40,
      subjects: ['Physics', 'Chemistry', 'Advanced Mathematics (Calculus & Vectors)', 'Biology (Botany & Zoology)', 'English Core'],
      subjectTeachers: {
        'Physics': 'Dr. Neha Kulkarni',
        'Chemistry': 'Prof. Amit Verma',
        'Advanced Mathematics (Calculus & Vectors)': 'Prof. Rajesh Sharma',
        'Biology (Botany & Zoology)': 'Dr. Sunita Deshmukh',
        'English Core': 'Mrs. Priya Kapoor'
      },
      selectionMode: 'prefixed',
      syllabusProgress: 93,
      schedule: '08:00 AM – 02:30 PM'
    },

    // ==========================================
    // IB INTERNATIONAL CLASSES (1st to 12th)
    // ==========================================
    {
      id: 'cls-9b-ib',
      name: 'Class 9B – IB Middle Years Programme (MYP)',
      gradeLevel: '9th Standard',
      section: 'B',
      board: 'IB',
      stream: 'International MYP',
      room: 'STEM Lab 2',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 0,
      capacity: 25,
      subjects: ['English Language & Literature', 'Language Acquisition (French)', 'Social Science', 'Physics', 'Mathematics'],
      subjectTeachers: {
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Language Acquisition (French)': 'Mrs. Priya Kapoor',
        'Social Science': 'Dr. Sunita Deshmukh',
        'Physics': 'Dr. Neha Kulkarni',
        'Mathematics': 'Prof. Rajesh Sharma'
      },
      selectionMode: 'individual',
      syllabusProgress: 74,
      schedule: '08:30 AM – 03:00 PM'
    },
    {
      id: 'cls-10-ib-myp',
      name: 'Class 10 – IB MYP E-Assessment Cohort',
      gradeLevel: '10th Standard',
      section: 'MYP',
      board: 'IB',
      stream: 'International MYP',
      room: 'STEM Lab 1',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 0,
      capacity: 25,
      subjects: ['English Language & Literature', 'Language Acquisition (French)', 'Physics', 'Chemistry', 'Mathematics Standard', 'Social Science'],
      subjectTeachers: {
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Language Acquisition (French)': 'Mrs. Priya Kapoor',
        'Physics': 'Dr. Neha Kulkarni',
        'Chemistry': 'Prof. Amit Verma',
        'Mathematics Standard': 'Prof. Rajesh Sharma',
        'Social Science': 'Dr. Sunita Deshmukh'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'IB Middle Years Programme',
      syllabusProgress: 83,
      schedule: '08:30 AM – 03:00 PM'
    },
    {
      id: 'cls-5-ib-pyp',
      name: 'Class 5 – IB Primary Exhibition Cohort',
      gradeLevel: '5th Standard',
      section: 'PYP',
      board: 'IB',
      stream: 'Primary Core',
      room: 'Inquiry Hub 1',
      classTeacher: 'Mrs. Priya Kapoor',
      enrolled: 0,
      capacity: 20,
      subjects: ['English Language & Literature', 'Mathematics', 'General Science', 'Social Science'],
      subjectTeachers: {
        'English Language & Literature': 'Mrs. Priya Kapoor',
        'Mathematics': 'Prof. Rajesh Sharma',
        'General Science': 'Dr. Sunita Deshmukh',
        'Social Science': 'Dr. Sunita Deshmukh'
      },
      selectionMode: 'prefixed',
      syllabusProgress: 88,
      schedule: '09:00 AM – 02:00 PM'
    },
    {
      id: 'cls-12ib-dp',
      name: 'Class 12 – IB Diploma Cohort (DP2)',
      gradeLevel: '12th Standard',
      section: 'IBDP',
      board: 'IB',
      stream: 'IB Diploma',
      room: 'International Wing Hall 401',
      classTeacher: 'Prof. Rajesh Sharma',
      enrolled: 0,
      capacity: 20,
      subjects: ['IB English A Literature HL', 'IB Mathematics Analysis & Approaches HL', 'IB Physics HL', 'IB Chemistry SL', 'IB Economics SL', 'Theory of Knowledge (TOK)'],
      subjectTeachers: {
        'IB English A Literature HL': 'Mrs. Priya Kapoor',
        'IB Mathematics Analysis & Approaches HL': 'Prof. Rajesh Sharma',
        'IB Physics HL': 'Dr. Neha Kulkarni',
        'IB Chemistry SL': 'Prof. Amit Verma',
        'IB Economics SL': 'Prof. Rajesh Sharma',
        'Theory of Knowledge (TOK)': 'Mrs. Priya Kapoor'
      },
      selectionMode: 'prefixed',
      packagePresetName: 'IB Diploma Programme (IBDP)',
      syllabusProgress: 95,
      schedule: '08:30 AM – 03:30 PM'
    }
  ]);

  // Available Faculty Members for Subject Assignments
  const facultyList = useMemo(() => {
    if (academicTeachers && academicTeachers.length > 0) {
      return academicTeachers.map(t => ({
        id: t.id,
        name: t.name,
        code: t.employeeCode,
        specialization: t.specialization,
        primarySubject: t.primarySubject,
        avatarBg: t.avatarBg
      }));
    }
    return [
      { id: 'tea-001', name: 'Prof. Rajesh Sharma', code: 'EMP-FAC-01', specialization: 'Mathematics', primarySubject: 'Mathematics', avatarBg: 'bg-blue-600' },
      { id: 'tea-002', name: 'Dr. Neha Kulkarni', code: 'EMP-FAC-02', specialization: 'Physics & STEM', primarySubject: 'Physics', avatarBg: 'bg-purple-600' },
      { id: 'tea-003', name: 'Prof. Amit Verma', code: 'EMP-FAC-03', specialization: 'Chemistry & Tech', primarySubject: 'Chemistry', avatarBg: 'bg-emerald-600' },
      { id: 'tea-004', name: 'Mrs. Priya Kapoor', code: 'EMP-FAC-04', specialization: 'English & Literature', primarySubject: 'English', avatarBg: 'bg-amber-600' },
      { id: 'tea-005', name: 'Dr. Sunita Deshmukh', code: 'EMP-FAC-05', specialization: 'Biology & Life Science', primarySubject: 'Biology / Social Science', avatarBg: 'bg-rose-600' }
    ];
  }, [academicTeachers]);

  // Filtered Classes based on current view (Board Drill-Down vs Master Overview)
  const displayedClasses = useMemo(() => {
    return classesList.filter(c => {
      // If we are drilled down into a specific board, force match that board
      if (selectedBoardView && c.board !== selectedBoardView) return false;

      // In master view, check selectedBoardFilter
      if (!selectedBoardView && selectedBoardFilter !== 'All' && c.board !== selectedBoardFilter) return false;

      // Check grade level filter
      const matchGrade = selectedGradeFilter === 'All' || c.gradeLevel.toLowerCase().includes(selectedGradeFilter.toLowerCase());

      // Check stream filter
      const matchStream = selectedStreamFilter === 'All' || (c.stream && c.stream.toLowerCase().includes(selectedStreamFilter.toLowerCase()));

      // Check search query
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.board.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.stream && c.stream.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchGrade && matchStream && matchSearch;
    });
  }, [classesList, selectedBoardView, selectedBoardFilter, selectedGradeFilter, selectedStreamFilter, searchQuery]);

  // Handlers for Board Navigation
  const handleOpenBoardDrillDown = (board: EducationBoard) => {
    setSelectedBoardView(board);
    setSelectedGradeFilter('All');
    setSelectedStreamFilter('All');
    setSearchQuery('');
  };

  const handleBackToAllBoards = () => {
    setSelectedBoardView(null);
    setSelectedGradeFilter('All');
    setSelectedStreamFilter('All');
    setSearchQuery('');
  };

  // Handlers for Add Class
  const handleOpenAddClass = (preselectedBoard?: EducationBoard) => {
    const targetBoard = preselectedBoard || selectedBoardView || 'CBSE';
    const defaultPackage = standardPackages.find(p => p.board === targetBoard) || standardPackages[0];

    setClassForm({
      name: '',
      gradeLevel: '10th Standard',
      section: 'A',
      board: targetBoard,
      stream: targetBoard === 'IB' ? 'International MYP' : 'High School',
      room: 'Hall 101',
      classTeacher: 'Prof. Rajesh Sharma',
      capacity: 35,
      selectionMode: 'prefixed',
      selectedPackageId: defaultPackage.id,
      customSubjects: [...defaultPackage.subjects]
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

    // Default subject teacher mapping based on subject names
    const initialSubjectTeachers: Record<string, string> = {};
    finalSubjects.forEach(sub => {
      const lower = sub.toLowerCase();
      if (lower.includes('math') || lower.includes('alg') || lower.includes('geo')) {
        initialSubjectTeachers[sub] = 'Prof. Rajesh Sharma';
      } else if (lower.includes('phy') || lower.includes('computer') || lower.includes('ai') || lower.includes('stem')) {
        initialSubjectTeachers[sub] = 'Dr. Neha Kulkarni';
      } else if (lower.includes('chem') || lower.includes('marathi') || lower.includes('lab')) {
        initialSubjectTeachers[sub] = 'Prof. Amit Verma';
      } else if (lower.includes('eng') || lower.includes('lit') || lower.includes('hindi') || lower.includes('french')) {
        initialSubjectTeachers[sub] = 'Mrs. Priya Kapoor';
      } else {
        initialSubjectTeachers[sub] = 'Dr. Sunita Deshmukh';
      }
    });

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
      subjectTeachers: initialSubjectTeachers,
      selectionMode: classForm.selectionMode,
      packagePresetName: packageName,
      syllabusProgress: 0,
      schedule: '08:00 AM – 02:00 PM'
    };

    setClassesList([newClass, ...classesList]);

    // Also register assignments with useIMS
    Object.entries(initialSubjectTeachers).forEach(([sub, teacher]) => {
      assignTeacherToSubject(teacher, newClass.id, newClass.name, sub, newClass.board, newClass.gradeLevel);
    });

    setIsAddClassModalOpen(false);
    showToast(`Created class "${newClass.name}" in ${newClass.board} (${newClass.gradeLevel}) with ${finalSubjects.length} subjects.`);
  };

  // Configure Subjects Modal Handlers
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
    showToast(`Updated subjects for ${selectedClassForConfig.name} (${finalSubjects.length} subjects configured).`);
  };

  // Teacher-to-Subject Dynamic Assignment Handler
  const handleAssignTeacher = (cls: ClassRecord, subjectName: string, newTeacherName: string) => {
    setClassesList(prev =>
      prev.map(c => {
        if (c.id === cls.id) {
          return {
            ...c,
            subjectTeachers: {
              ...(c.subjectTeachers || {}),
              [subjectName]: newTeacherName
            }
          };
        }
        return c;
      })
    );

    // Call IMSContext assignment to immediately populate under that teacher's profile in the Teachers module
    assignTeacherToSubject(
      newTeacherName,
      cls.id,
      cls.name,
      subjectName,
      cls.board,
      cls.gradeLevel
    );

    showToast(`Assigned ${newTeacherName} to ${subjectName} in ${cls.name} (${cls.board})`);
  };

  // Add Subject Inline to Class
  const handleInlineAddSubject = (cls: ClassRecord) => {
    if (!newSubjectSelection.trim()) {
      showToast('Please select or specify a subject name.');
      return;
    }

    if (cls.subjects.includes(newSubjectSelection)) {
      showToast(`"${newSubjectSelection}" is already assigned to ${cls.name}.`);
      return;
    }

    setClassesList(prev =>
      prev.map(c => {
        if (c.id === cls.id) {
          return {
            ...c,
            subjects: [...c.subjects, newSubjectSelection],
            subjectTeachers: {
              ...(c.subjectTeachers || {}),
              [newSubjectSelection]: newSubjectTeacher
            }
          };
        }
        return c;
      })
    );

    // Wire to teacher profile
    assignTeacherToSubject(
      newSubjectTeacher,
      cls.id,
      cls.name,
      newSubjectSelection,
      cls.board,
      cls.gradeLevel
    );

    showToast(`Added ${newSubjectSelection} to ${cls.name} & assigned to ${newSubjectTeacher}.`);
    setAddingSubjectForClassId(null);
    setNewSubjectSelection('');
  };

  // Remove Subject from Class
  const handleRemoveSubject = (cls: ClassRecord, subjectName: string) => {
    setClassesList(prev =>
      prev.map(c => {
        if (c.id === cls.id) {
          const updatedSubs = c.subjects.filter(s => s !== subjectName);
          const updatedTeachers = { ...(c.subjectTeachers || {}) };
          delete updatedTeachers[subjectName];
          return {
            ...c,
            subjects: updatedSubs,
            subjectTeachers: updatedTeachers
          };
        }
        return c;
      })
    );

    removeTeacherFromSubject(cls.id, subjectName);
    showToast(`Removed ${subjectName} from ${cls.name}.`);
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

  // ==========================================
  // CLASS EDIT & DELETE HANDLERS
  // ==========================================
  const handleOpenEditClass = (cls: ClassRecord) => {
    setClassToEdit(cls);
    setClassEditForm({
      name: cls.name,
      room: cls.room,
      classTeacher: cls.classTeacher,
      capacity: cls.capacity,
      schedule: cls.schedule
    });
    setIsEditClassModalOpen(true);
  };

  const handleSaveEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classToEdit) return;
    setClassesList(prev =>
      prev.map(c =>
        c.id === classToEdit.id
          ? {
              ...c,
              name: classEditForm.name,
              room: classEditForm.room,
              classTeacher: classEditForm.classTeacher,
              capacity: Number(classEditForm.capacity),
              schedule: classEditForm.schedule
            }
          : c
      )
    );
    setIsEditClassModalOpen(false);
    showToast(`Updated class details for "${classEditForm.name}".`);
  };

  const handleOpenDeleteClass = (cls: ClassRecord) => {
    setClassToDelete(cls);
    setIsDeleteClassModalOpen(true);
  };

  const handleConfirmDeleteClass = () => {
    if (!classToDelete) return;
    setClassesList(prev => prev.filter(c => c.id !== classToDelete.id));
    setIsDeleteClassModalOpen(false);
    showToast(`Removed class "${classToDelete.name}" (${classToDelete.board} ${classToDelete.gradeLevel}).`);
    setClassToDelete(null);
  };

  // ==========================================
  // BOARD ADD, EDIT & DELETE HANDLERS
  // ==========================================
  const handleOpenAddBoard = () => {
    setBoardFormData({
      name: '',
      acronym: 'State Board',
      tagline: '',
      authority: '',
      standardsLabel: '1st Standard to 12th Standard',
      gradingScheme: 'Standard Percentage / GPA Matrix',
      status: 'Active'
    });
    setIsAddBoardModalOpen(true);
  };

  const handleSaveAddBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardFormData.name.trim()) {
      showToast('Please enter a board name.');
      return;
    }
    const newBoard = {
      id: `brd-${Date.now()}`,
      boardKey: (boardFormData.acronym || 'State Board') as EducationBoard,
      title: boardFormData.name,
      acronym: boardFormData.acronym || 'Board',
      tagline: boardFormData.tagline || 'Curriculum framework governed by Department of Education',
      theme: 'blue',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      cardGradient: 'from-blue-900/90 via-slate-900 to-[#0A192F]',
      authority: boardFormData.authority || 'Educational Authority',
      standardsLabel: boardFormData.standardsLabel,
      activeBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      gradingScheme: boardFormData.gradingScheme,
      status: boardFormData.status
    };
    setBoardsList(prev => [...prev, newBoard]);
    setIsAddBoardModalOpen(false);
    showToast(`Added educational board: ${newBoard.title}`);
  };

  const handleOpenEditBoard = (board: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBoardToEdit(board);
    setBoardFormData({
      name: board.title || board.name,
      acronym: board.acronym,
      tagline: board.tagline,
      authority: board.authority,
      standardsLabel: board.standardsLabel,
      gradingScheme: board.gradingScheme,
      status: board.status || 'Active'
    });
    setIsEditBoardModalOpen(true);
  };

  const handleSaveEditBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardToEdit) return;
    setBoardsList(prev =>
      prev.map(b =>
        b.id === boardToEdit.id
          ? {
              ...b,
              title: boardFormData.name,
              acronym: boardFormData.acronym,
              tagline: boardFormData.tagline,
              authority: boardFormData.authority,
              standardsLabel: boardFormData.standardsLabel,
              gradingScheme: boardFormData.gradingScheme,
              status: boardFormData.status
            }
          : b
      )
    );
    setIsEditBoardModalOpen(false);
    showToast(`Updated curriculum parameters for ${boardFormData.name}`);
  };

  const handleOpenDeleteBoard = (board: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBoardToDelete(board);
    setIsDeleteBoardModalOpen(true);
  };

  const handleConfirmDeleteBoard = () => {
    if (!boardToDelete) return;
    setBoardsList(prev => prev.filter(b => b.id !== boardToDelete.id));
    setIsDeleteBoardModalOpen(false);
    showToast(`Deactivated / removed board ${boardToDelete.title || boardToDelete.acronym}.`);
    setBoardToDelete(null);
  };

  // ==========================================
  // SUBJECT ADD, EDIT & DELETE HANDLERS
  // ==========================================
  const handleOpenAddSubject = () => {
    setSubjectFormData({
      name: '',
      code: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Sciences & Math',
      boards: ['CBSE', 'ICSE', 'State Board', 'IB'],
      weeklyHours: 5,
      leadTeacher: facultyList[0]?.name || 'Prof. Rajesh Sharma',
      isElective: false
    });
    setIsAddSubjectModalOpen(true);
  };

  const handleSaveAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectFormData.name.trim()) {
      showToast('Please provide a subject title.');
      return;
    }
    const newSub: SubjectItem = {
      id: `sub-${Date.now()}`,
      code: subjectFormData.code,
      name: subjectFormData.name,
      category: subjectFormData.category,
      boards: subjectFormData.boards,
      gradeLevels: ['1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard', '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard', '11th Standard', '12th Standard'],
      weeklyHours: Number(subjectFormData.weeklyHours),
      leadTeacher: subjectFormData.leadTeacher,
      isElective: subjectFormData.isElective
    };
    setAllMasterSubjects(prev => [newSub, ...prev]);
    setIsAddSubjectModalOpen(false);
    showToast(`Registered subject "${newSub.name}" (${newSub.code}) in master catalog.`);
  };

  const handleOpenEditSubject = (sub: SubjectItem) => {
    setSubjectToEdit(sub);
    setSubjectFormData({
      name: sub.name,
      code: sub.code,
      category: sub.category,
      boards: sub.boards,
      weeklyHours: sub.weeklyHours,
      leadTeacher: sub.leadTeacher,
      isElective: !!sub.isElective
    });
    setIsEditSubjectModalOpen(true);
  };

  const handleSaveEditSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectToEdit) return;
    setAllMasterSubjects(prev =>
      prev.map(s =>
        s.id === subjectToEdit.id
          ? {
              ...s,
              name: subjectFormData.name,
              code: subjectFormData.code,
              category: subjectFormData.category,
              boards: subjectFormData.boards,
              weeklyHours: Number(subjectFormData.weeklyHours),
              leadTeacher: subjectFormData.leadTeacher,
              isElective: subjectFormData.isElective
            }
          : s
      )
    );
    setIsEditSubjectModalOpen(false);
    showToast(`Updated master details for ${subjectFormData.name}.`);
  };

  const handleOpenDeleteSubject = (sub: SubjectItem) => {
    setSubjectToDelete(sub);
    setIsDeleteSubjectModalOpen(true);
  };

  const handleConfirmDeleteSubject = () => {
    if (!subjectToDelete) return;
    setAllMasterSubjects(prev => prev.filter(s => s.id !== subjectToDelete.id));
    setIsDeleteSubjectModalOpen(false);
    showToast(`Removed subject "${subjectToDelete.name}" from catalog.`);
    setSubjectToDelete(null);
  };

  // =========================================================================
  // VIEW: DEDICATED BOARD-SPECIFIC DRILL-DOWN VIEW (e.g. ICSE / CBSE / State / IB)
  // =========================================================================
  if (selectedBoardView) {
    const boardClasses = classesList.filter(c => c.board === selectedBoardView);
    const totalBoardStudents = boardClasses.reduce((acc, c) => acc + c.enrolled, 0);
    const avgSyllabus = Math.round(boardClasses.reduce((acc, c) => acc + c.syllabusProgress, 0) / (boardClasses.length || 1));

    // Collect all assigned teachers for this board
    const boardTeachersSet = new Set<string>();
    boardClasses.forEach(c => {
      if (c.classTeacher) boardTeachersSet.add(c.classTeacher);
      if (c.subjectTeachers) {
        Object.values(c.subjectTeachers).forEach(t => boardTeachersSet.add(t));
      }
    });

    const boardConfig = {
      CBSE: {
        title: 'Central Board of Secondary Education (CBSE)',
        acronym: 'CBSE',
        tagline: 'National curriculum governed by NCERT with continuous comprehensive evaluation',
        theme: 'blue',
        badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        cardGradient: 'from-blue-900/90 via-slate-900 to-[#0A192F]',
        authority: 'Ministry of Education, Govt. of India',
        standardsLabel: '1st Standard to 12th Standard (NCERT Framework)',
        activeBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      },
      ICSE: {
        title: 'Council for the Indian School Certificate Examinations (ICSE / ISC)',
        acronym: 'ICSE',
        tagline: 'In-depth English literature, balanced physical sciences, and distinct 10-paper board curriculum',
        theme: 'purple',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        cardGradient: 'from-purple-950/90 via-slate-900 to-[#120B24]',
        authority: 'CISCE Council for Indian School Certificate Examinations',
        standardsLabel: '1st Standard to 12th Standard (ICSE & ISC Wing)',
        activeBadge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      },
      'State Board': {
        title: 'State Secondary & Higher Secondary Education Board',
        acronym: 'State Board',
        tagline: 'Regional mother-tongue synthesis, state syllabus standards, and vocational matrix',
        theme: 'emerald',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        cardGradient: 'from-emerald-950/90 via-slate-900 to-[#062016]',
        authority: 'State Department of School Education & Sports',
        standardsLabel: '1st Standard to 12th Standard (SSC & HSC Stream)',
        activeBadge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      },
      IB: {
        title: 'International Baccalaureate Organization (IB PYP, MYP & DP)',
        acronym: 'IB International',
        tagline: 'Inquiry-based international curriculum with global interdisciplinary contexts and TOK synthesis',
        theme: 'amber',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        cardGradient: 'from-amber-950/90 via-slate-900 to-[#261506]',
        authority: 'International Baccalaureate (Geneva, Switzerland)',
        standardsLabel: 'Primary Years (PYP), Middle Years (MYP) & Diploma (DP)',
        activeBadge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      }
    }[selectedBoardView];

    return (
      <div className="space-y-6">
        {/* Top Back Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToAllBoards}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 transition-colors shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to All Curriculum Boards</span>
            </button>
            <div className="hidden sm:block text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Curriculum Management</span>
              <span className="mx-1.5">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{boardConfig.acronym} Classes & Subjects</span>
            </div>
          </div>

          {/* Quick Board Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
            {(['CBSE', 'ICSE', 'State Board', 'IB'] as EducationBoard[]).map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBoardView(b)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedBoardView === b
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Board Sub-Page Clean Light Header (Matching Student Directory style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{selectedBoardView} Curriculum & Classes</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                {boardClasses.length} Configured Classes
              </span>
              <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {boardConfig.acronym}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {boardConfig.tagline} • Spans 1st to 12th standards with faculty allocations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast(`Exported ${selectedBoardView} curriculum matrix & teacher allocation sheet (PDF).`)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export {selectedBoardView} Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAddClass(selectedBoardView)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class & Curriculum</span>
            </button>
          </div>
        </div>

        {/* Board KPI Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total Configured Classes</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {boardClasses.length} Classes
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5 block">
              1st to 12th Standard
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Enrolled Students</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {totalBoardStudents} Students
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Active Enrollments
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Assigned Faculty Mentors</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {boardTeachersSet.size} Teachers
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5 block">
              Mapped to Subjects
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Avg Syllabus Progress</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {avgSyllabus}%
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
              Term Evaluation Pace
            </span>
          </div>
        </div>

        {/* Board Classes Controls: Grade Filtering & Search Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Grade Standard Selector Pills */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Standards:
            </span>
            {['All', 'Primary', 'Middle', 'Secondary', '11th Standard', '12th Standard'].map(grade => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGradeFilter(grade === 'All' ? 'All' : grade)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  (selectedGradeFilter === 'All' && grade === 'All') || selectedGradeFilter === grade
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {grade === 'All' ? 'All Grades' : grade}
              </button>
            ))}
          </div>

          {/* Search within this board */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${selectedBoardView} classes, subjects, rooms...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 sm:w-64"
            />
          </div>
        </div>

        {/* CLASSES & DYNAMIC SUBJECT-TEACHER MAPPING LIST */}
        <div className="space-y-6">
          {displayedClasses.map(cls => (
            <div
              key={cls.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-5 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              {/* Class Header Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase border ${boardConfig.activeBadge}`}>
                      {cls.board} • {cls.gradeLevel} • Sec {cls.section}
                    </span>
                    {cls.stream && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                        {cls.stream}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                      {cls.selectionMode === 'prefixed' ? <Package className="w-3 h-3" /> : <Sliders className="w-3 h-3" />}
                      <span>{cls.selectionMode === 'prefixed' ? (cls.packagePresetName || 'Standard Package') : 'Custom Electives'}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{cls.name}</span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                      Class Mentor: <strong className="text-slate-800 dark:text-slate-200">{cls.classTeacher}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Classroom: <strong className="text-slate-800 dark:text-slate-200">{cls.room}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {cls.schedule}
                    </span>
                  </div>
                </div>

                {/* Enrollment & Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Enrollment</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                      {cls.enrolled} / {cls.capacity} Students
                    </span>
                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (cls.enrolled / cls.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenConfigureSubjects(cls)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Configure Curriculum</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditClass(cls)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Class Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDeleteClass(cls)}
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Class Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* INTEGRATED SUBJECTS & TEACHER ASSIGNMENT WORKFLOW */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Configured Subjects & Faculty-to-Subject Allocations ({cls.subjects.length} Subjects)
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAddingSubjectForClassId(addingSubjectForClassId === cls.id ? null : cls.id);
                      setNewSubjectSelection('');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{addingSubjectForClassId === cls.id ? 'Close Subject Form' : '+ Add Subject to this Class'}</span>
                  </button>
                </div>

                {/* Inline Add Subject Drawer */}
                {addingSubjectForClassId === cls.id && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                      <span>Add New Subject & Allocate Teacher for {cls.name}</span>
                      <button
                        type="button"
                        onClick={() => setAddingSubjectForClassId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Select Subject from Catalog:
                        </label>
                        <select
                          value={newSubjectSelection}
                          onChange={e => setNewSubjectSelection(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- Choose Subject --</option>
                          {allMasterSubjects
                            .filter(s => s.boards.includes(cls.board))
                            .map(sub => (
                              <option key={sub.id} value={sub.name}>
                                {sub.name} ({sub.category} • {sub.weeklyHours}h/wk)
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Assign Faculty Teacher:
                        </label>
                        <select
                          value={newSubjectTeacher}
                          onChange={e => setNewSubjectTeacher(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          {facultyList.map(t => (
                            <option key={t.id} value={t.name}>
                              {t.name} ({t.specialization})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleInlineAddSubject(cls)}
                          disabled={!newSubjectSelection}
                          className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Assign to Class
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subject-to-Teacher Allocation Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Subject Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Weekly Hours</th>
                        <th className="py-2.5 px-3">Assigned Faculty (Click to Reassign)</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {cls.subjects.map((sub, sIdx) => {
                        const currentTeacher = cls.subjectTeachers?.[sub] || cls.classTeacher || facultyList[0].name;
                        const subjectMeta = allMasterSubjects.find(s => s.name === sub);

                        return (
                          <tr key={sIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                              {sub}
                            </td>

                            <td className="py-2.5 px-3 text-slate-500">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                                {subjectMeta?.category || 'Core Academic'}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {subjectMeta?.weeklyHours || 5} hrs/week
                            </td>

                            {/* TEACHER ASSIGNMENT DROPDOWN (Directly syncs to Teachers module) */}
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="relative inline-block w-64">
                                  <select
                                    value={currentTeacher}
                                    onChange={e => handleAssignTeacher(cls, sub, e.target.value)}
                                    className="w-full pl-3 pr-7 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50/50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none truncate"
                                  >
                                    {facultyList.map(fac => (
                                      <option key={fac.id} value={fac.name}>
                                        {fac.name} • {fac.specialization}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" />
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
                                  <CheckCircle2 className="w-3 h-3" /> Synced
                                </span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                title="Remove subject from this class"
                                onClick={() => handleRemoveSubject(cls, sub)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

          {displayedClasses.length === 0 && (
            <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-3">
              <Layers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="font-semibold text-sm">No classes found in {selectedBoardView} matching your filter criteria.</p>
              <button
                type="button"
                onClick={() => handleOpenAddClass(selectedBoardView)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                + Add Class & Curriculum Now
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN SUBJECT & CLASSES MASTER OVERVIEW (WITH CLICKABLE BOARD CARDS)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* 1. Clean Light Header (Matching Student Academic Directory style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Subjects & Classes</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              {classesList.length} Configured Classes
            </span>
            <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              50 Enrolled Students
            </span>
            <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              4 Boards (CBSE • ICSE • State • IB)
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage curriculum, grade levels, boards, and subject assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast('Exporting curriculum matrix across all standards & boards (PDF)... Ready.')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Curriculum</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenAddClass()}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class & Curriculum</span>
          </button>
        </div>
      </div>

      {/* 2. BOARD-SPECIFIC DRILL-DOWN TILES (DYNAMIC WITH ADD, EDIT & DELETE) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Curriculum Boards & Educational Authorities ({boardsList.length} Boards)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Click card to drill down</span>
            <button
              type="button"
              onClick={handleOpenAddBoard}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Curriculum Board</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boardsList.map(board => {
            const classCount = classesList.filter(c => c.board === board.boardKey).length;
            const themeBorder =
              board.boardKey === 'CBSE'
                ? 'border-blue-200/90 dark:border-blue-900/60 hover:border-blue-500'
                : board.boardKey === 'ICSE'
                ? 'border-purple-200/90 dark:border-purple-900/60 hover:border-purple-500'
                : board.boardKey === 'State Board'
                ? 'border-emerald-200/90 dark:border-emerald-900/60 hover:border-emerald-500'
                : 'border-amber-200/90 dark:border-amber-900/60 hover:border-amber-500';

            const themeText =
              board.boardKey === 'CBSE'
                ? 'text-blue-600 dark:text-blue-400'
                : board.boardKey === 'ICSE'
                ? 'text-purple-600 dark:text-purple-400'
                : board.boardKey === 'State Board'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400';

            return (
              <div
                key={board.id}
                onClick={() => handleOpenBoardDrillDown(board.boardKey)}
                className={`p-5 rounded-3xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden ${themeBorder}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${board.badgeBg || 'bg-slate-100 text-slate-700'}`}>
                      {board.authority ? 'Accredited Board' : 'Regional Board'}
                    </span>

                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={e => handleOpenEditBoard(board, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Board Parameters"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={e => handleOpenDeleteBoard(board, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Deactivate Board"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-black text-slate-900 dark:text-white group-hover:${themeText} transition-colors`}>
                      {board.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {board.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono ${themeText}`}>
                      {classCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Classes Configured</span>
                  </div>
                </div>

                <div className={`flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100 dark:border-slate-800 ${themeText}`}>
                  <span>Open {board.acronym} Classes</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs & Master Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Sub-Tabs */}
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMainTab('classes')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeMainTab === 'classes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Classes & Batches ({classesList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('curriculum-config')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
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
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeMainTab === 'all-subjects'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Master Subject Catalog ({allMasterSubjects.length})
          </button>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedBoardFilter}
            onChange={e => setSelectedBoardFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Education Boards</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
            <option value="IB">IB</option>
          </select>

          <select
            value={selectedGradeFilter}
            onChange={e => setSelectedGradeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Grade Levels</option>
            <option value="1st Standard">1st Standard</option>
            <option value="3rd Standard">3rd Standard</option>
            <option value="5th Standard">5th Standard</option>
            <option value="6th Standard">6th Standard</option>
            <option value="7th Standard">7th Standard</option>
            <option value="8th Standard">8th Standard</option>
            <option value="9th Standard">9th Standard</option>
            <option value="10th Standard">10th Standard</option>
            <option value="11th Standard">11th Standard</option>
            <option value="12th Standard">12th Standard</option>
          </select>

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

      {/* 4. TAB 1: ALL CLASSES & BATCHES DIRECTORY */}
      {activeMainTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedClasses.map(cls => (
            <div
              key={cls.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
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

                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cls.selectionMode === 'prefixed'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                    }`}
                  >
                    {cls.selectionMode === 'prefixed' ? <Package className="w-3 h-3" /> : <Sliders className="w-3 h-3" />}
                    <span>{cls.selectionMode === 'prefixed' ? 'Preset' : 'Custom'}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                  {cls.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <strong>Mentor:</strong> {cls.classTeacher}
                  </span>
                  <span>•</span>
                  <span>Room: {cls.room}</span>
                </div>

                {/* Enrollment Bar */}
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

              {/* Mapped Subjects Preview */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Enrolled Subjects ({cls.subjects.length})</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                    {cls.packagePresetName || 'Custom'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pt-1">
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
                <button
                  type="button"
                  onClick={() => handleOpenBoardDrillDown(cls.board)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                >
                  <span>Drill Down into {cls.board} →</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenConfigureSubjects(cls)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditClass(cls)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Class Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDeleteClass(cls)}
                    className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Class Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. TAB 2: PREFIXED SUBJECT PACKAGES DIRECTORY */}
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
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Apply Package to Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 3: MASTER SUBJECT DIRECTORY & ELECTIVES */}
      {activeMainTab === 'all-subjects' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Master Subject Catalog & Electives</span>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  {allMasterSubjects.length} Disciplines
                </span>
              </h3>
              <p className="text-xs text-slate-500">Curated across all boards and standards (1st to 12th)</p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddSubject}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject to Catalog</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">Subject Name & Code</th>
                  <th className="py-3 px-3">Discipline Category</th>
                  <th className="py-3 px-3">Supported Boards</th>
                  <th className="py-3 px-3">Weekly Hours</th>
                  <th className="py-3 px-3">Lead Subject Specialist</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-right">Actions</th>
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
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSubject(sub)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteSubject(sub)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL: ADD CLASS & CURRICULUM CONFIGURATION
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
                  <span className="text-xs text-slate-400">Accredited Grade & Subject Mapping for 1st to 12th Standard</span>
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
                    placeholder="e.g. Class 10A Science & Math Honors"
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
                    onChange={e => {
                      const newBoard = e.target.value as EducationBoard;
                      const pkg = standardPackages.find(p => p.board === newBoard) || standardPackages[0];
                      setClassForm({
                        ...classForm,
                        board: newBoard,
                        selectedPackageId: pkg.id,
                        customSubjects: [...pkg.subjects]
                      });
                    }}
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
                    {facultyList.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.specialization})
                      </option>
                    ))}
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
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
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
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
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
                      {standardPackages
                        .filter(p => p.board === classForm.board)
                        .map(pkg => (
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
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Save & Publish Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL: CONFIGURE SUBJECTS FOR EXISTING CLASS
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
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
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
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
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
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfiguredSubjects}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Save Subject Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL: EDIT CLASS DETAILS
          ========================================================================= */}
      {isEditClassModalOpen && classToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Class Section</h3>
                  <span className="text-xs text-slate-400">{classToEdit.board} • {classToEdit.gradeLevel} (Sec {classToEdit.section})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditClassModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  value={classEditForm.name}
                  onChange={e => setClassEditForm({ ...classEditForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    required
                    value={classEditForm.room}
                    onChange={e => setClassEditForm({ ...classEditForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={classEditForm.capacity}
                    onChange={e => setClassEditForm({ ...classEditForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Head Class Teacher</label>
                <select
                  value={classEditForm.classTeacher}
                  onChange={e => setClassEditForm({ ...classEditForm, classTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                >
                  {facultyList.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Daily Timetable Schedule</label>
                <input
                  type="text"
                  value={classEditForm.schedule}
                  onChange={e => setClassEditForm({ ...classEditForm, schedule: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Save Class Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. MODAL: DELETE CLASS CONFIRMATION
          ========================================================================= */}
      {isDeleteClassModalOpen && classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Class Section?</h3>
                <span className="text-xs text-slate-400">Confirmation Required</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to remove <strong>{classToDelete.name}</strong> ({classToDelete.board} • {classToDelete.gradeLevel})?
              Currently this class has <strong>{classToDelete.enrolled}</strong> active enrolled students and {classToDelete.subjects.length} allocated subjects.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteClassModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
              >
                Keep Class
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteClass}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Yes, Delete Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. MODAL: ADD / EDIT BOARD
          ========================================================================= */}
      {(isAddBoardModalOpen || isEditBoardModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isAddBoardModalOpen ? 'Add Curriculum Board' : 'Edit Curriculum Board'}
                  </h3>
                  <span className="text-xs text-slate-400">Institutional Accreditation Parameters</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddBoardModalOpen(false);
                  setIsEditBoardModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAddBoardModalOpen ? handleSaveAddBoard : handleSaveEditBoard}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Board Official Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cambridge Assessment International (CIE)"
                  value={boardFormData.name}
                  onChange={e => setBoardFormData({ ...boardFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Acronym / Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CIE / IGCSE"
                    value={boardFormData.acronym}
                    onChange={e => setBoardFormData({ ...boardFormData, acronym: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={boardFormData.status}
                    onChange={e => setBoardFormData({ ...boardFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Governing Authority</label>
                <input
                  type="text"
                  placeholder="e.g. University of Cambridge Local Examinations Syndicate"
                  value={boardFormData.authority}
                  onChange={e => setBoardFormData({ ...boardFormData, authority: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tagline / Mission</label>
                <input
                  type="text"
                  placeholder="e.g. International benchmark education preparing students for global life"
                  value={boardFormData.tagline}
                  onChange={e => setBoardFormData({ ...boardFormData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Grading & Evaluation Scheme</label>
                <input
                  type="text"
                  placeholder="e.g. A* to G Grading Scale with Core & Extended papers"
                  value={boardFormData.gradingScheme}
                  onChange={e => setBoardFormData({ ...boardFormData, gradingScheme: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddBoardModalOpen(false);
                    setIsEditBoardModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  {isAddBoardModalOpen ? 'Create Board' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          11. MODAL: DELETE BOARD CONFIRMATION
          ========================================================================= */}
      {isDeleteBoardModalOpen && boardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Deactivate Board?</h3>
                <span className="text-xs text-slate-400">Confirmation Required</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to deactivate or remove <strong>{boardToDelete.title || boardToDelete.acronym}</strong>?
              Associated classes will remain in the database but board-level curriculum mappings will be archived.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteBoardModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBoard}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          12. MODAL: ADD / EDIT SUBJECT
          ========================================================================= */}
      {(isAddSubjectModalOpen || isEditSubjectModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {isAddSubjectModalOpen ? 'Add Subject to Master Catalog' : 'Edit Subject Details'}
                  </h3>
                  <span className="text-xs text-slate-400">Institutional Curriculum Discipline</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddSubjectModalOpen(false);
                  setIsEditSubjectModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAddSubjectModalOpen ? handleSaveAddSubject : handleSaveEditSubject}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Applied Robotics"
                    value={subjectFormData.name}
                    onChange={e => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROB-101"
                    value={subjectFormData.code}
                    onChange={e => setSubjectFormData({ ...subjectFormData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Discipline Category</label>
                  <select
                    value={subjectFormData.category}
                    onChange={e => setSubjectFormData({ ...subjectFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="Sciences & Math">Sciences & Math</option>
                    <option value="Languages">Languages</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Technology">Technology</option>
                    <option value="Electives & Arts">Electives & Arts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Weekly Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    required
                    value={subjectFormData.weeklyHours}
                    onChange={e => setSubjectFormData({ ...subjectFormData, weeklyHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Subject Specialist</label>
                <select
                  value={subjectFormData.leadTeacher}
                  onChange={e => setSubjectFormData({ ...subjectFormData, leadTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                >
                  {facultyList.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={subjectFormData.isElective}
                    onChange={e => setSubjectFormData({ ...subjectFormData, isElective: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Optional Elective Subject (Students can opt in / opt out)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddSubjectModalOpen(false);
                    setIsEditSubjectModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  {isAddSubjectModalOpen ? 'Add to Catalog' : 'Save Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          13. MODAL: DELETE SUBJECT CONFIRMATION
          ========================================================================= */}
      {isDeleteSubjectModalOpen && subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Subject from Catalog?</h3>
                <span className="text-xs text-slate-400">Confirmation Required</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to remove <strong>{subjectToDelete.name}</strong> ({subjectToDelete.code}) from the master institutional catalog?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setIsDeleteSubjectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
              >
                Keep Subject
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSubject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Yes, Remove Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
