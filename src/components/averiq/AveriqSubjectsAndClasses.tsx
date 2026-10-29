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
  ChevronRight
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';
import { academicTeachers, academicStudents } from '../../data/mockAcademicData';

interface ClassRecord {
  id: string;
  name: string;
  grade: string;
  section: string;
  room: string;
  classTeacher: string;
  enrolled: number;
  capacity: number;
  subjects: string[];
  syllabusProgress: number;
  schedule: string;
}

interface SubjectDetail {
  id: string;
  code: string;
  name: string;
  department: string;
  leadTeacher: string;
  classesTaught: string[];
  weeklyHours: number;
  totalChapters: number;
  labsRequired: boolean;
  color: string;
}

export const AveriqSubjectsAndClasses: React.FC = () => {
  const { showToast } = useIMS();
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<ClassRecord | null>(null);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // New Class Form State
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    grade: 'Class 10',
    section: 'C',
    room: 'Room 305',
    classTeacher: 'Prof. Rajesh Sharma',
    capacity: 35
  });

  // New Subject Form State
  const [newSubjectForm, setNewSubjectForm] = useState({
    code: 'MTH-201',
    name: '',
    department: 'Mathematics',
    leadTeacher: 'Prof. Rajesh Sharma',
    weeklyHours: 5,
    totalChapters: 12
  });

  // Classes Data
  const [classesList, setClassesList] = useState<ClassRecord[]>([
    {
      id: 'cls-10a',
      name: 'Class 10A - Science & Math Special',
      grade: 'Class 10',
      section: 'A',
      room: 'Academic Hall 101',
      classTeacher: 'Prof. Rajesh Sharma',
      enrolled: 25,
      capacity: 30,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'],
      syllabusProgress: 84,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-10b',
      name: 'Class 10B - General Board Foundation',
      grade: 'Class 10',
      section: 'B',
      room: 'Academic Hall 102',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 25,
      capacity: 30,
      subjects: ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi'],
      syllabusProgress: 80,
      schedule: '08:00 AM – 02:00 PM'
    },
    {
      id: 'cls-9a',
      name: 'Class 9A - Science Explorers',
      grade: 'Class 9',
      section: 'A',
      room: 'Block B - Room 204',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 24,
      capacity: 30,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi'],
      syllabusProgress: 75,
      schedule: '08:30 AM – 02:30 PM'
    },
    {
      id: 'cls-9b',
      name: 'Class 9B - Standard Scholars',
      grade: 'Class 9',
      section: 'B',
      room: 'Block B - Room 205',
      classTeacher: 'Mrs. Sunita Rao',
      enrolled: 26,
      capacity: 30,
      subjects: ['Mathematics', 'General Science', 'Social Studies', 'English', 'Sanskrit'],
      syllabusProgress: 72,
      schedule: '08:30 AM – 02:30 PM'
    },
    {
      id: 'cls-8a',
      name: 'Class 8A - Junior Foundation',
      grade: 'Class 8',
      section: 'A',
      room: 'Junior Wing - Room 108',
      classTeacher: 'Dr. Priya Nair',
      enrolled: 22,
      capacity: 28,
      subjects: ['Mathematics', 'General Science', 'English Grammar', 'Hindi', 'Social Science'],
      syllabusProgress: 88,
      schedule: '09:00 AM – 02:00 PM'
    },
    {
      id: 'cls-8b',
      name: 'Class 8B - Junior Achievers',
      grade: 'Class 8',
      section: 'B',
      room: 'Junior Wing - Room 109',
      classTeacher: 'Prof. Rajesh Sharma',
      enrolled: 20,
      capacity: 28,
      subjects: ['Mathematics', 'General Science', 'English Literature', 'Hindi Literature', 'Computers'],
      syllabusProgress: 85,
      schedule: '09:00 AM – 02:00 PM'
    },
    {
      id: 'cls-11sci',
      name: 'Class 11 - Senior Science (PCM/B)',
      grade: 'Class 11',
      section: 'PCM',
      room: 'Senior Block - Lab 3',
      classTeacher: 'Dr. Neha Kulkarni',
      enrolled: 28,
      capacity: 32,
      subjects: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Biology / IP', 'English'],
      syllabusProgress: 68,
      schedule: '08:00 AM – 03:00 PM'
    },
    {
      id: 'cls-12sci',
      name: 'Class 12 - Board Aspirants & Entrance Prep',
      grade: 'Class 12',
      section: 'PCM',
      room: 'Senior Block - Seminar Hall',
      classTeacher: 'Prof. Amit Verma',
      enrolled: 30,
      capacity: 32,
      subjects: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'],
      syllabusProgress: 92,
      schedule: '08:00 AM – 03:00 PM'
    }
  ]);

  // Subjects Data
  const [subjectsList, setSubjectsList] = useState<SubjectDetail[]>([
    {
      id: 'sub-mth',
      code: 'MTH-101',
      name: 'Mathematics & Statistics',
      department: 'Mathematics',
      leadTeacher: 'Prof. Rajesh Sharma',
      classesTaught: ['Class 10A', 'Class 10B', 'Class 9A', 'Class 8A', 'Class 11', 'Class 12'],
      weeklyHours: 7,
      totalChapters: 15,
      labsRequired: false,
      color: 'bg-blue-600'
    },
    {
      id: 'sub-phy',
      code: 'PHY-102',
      name: 'Physics & Experimental Dynamics',
      department: 'Physical Sciences',
      leadTeacher: 'Dr. Neha Kulkarni',
      classesTaught: ['Class 10A', 'Class 10B', 'Class 9A', 'Class 11', 'Class 12'],
      weeklyHours: 6,
      totalChapters: 14,
      labsRequired: true,
      color: 'bg-purple-600'
    },
    {
      id: 'sub-chm',
      code: 'CHM-103',
      name: 'Chemistry & Practical Synthesis',
      department: 'Chemical Sciences',
      leadTeacher: 'Prof. Amit Verma',
      classesTaught: ['Class 10A', 'Class 10B', 'Class 9A', 'Class 11', 'Class 12'],
      weeklyHours: 6,
      totalChapters: 13,
      labsRequired: true,
      color: 'bg-emerald-600'
    },
    {
      id: 'sub-bio',
      code: 'BIO-104',
      name: 'Biology & Life Systems',
      department: 'Life Sciences',
      leadTeacher: 'Dr. Priya Nair',
      classesTaught: ['Class 10A', 'Class 9A', 'Class 11'],
      weeklyHours: 5,
      totalChapters: 12,
      labsRequired: true,
      color: 'bg-teal-600'
    },
    {
      id: 'sub-eng',
      code: 'ENG-105',
      name: 'English Language & World Literature',
      department: 'Languages',
      leadTeacher: 'Mrs. Sunita Rao',
      classesTaught: ['Class 10A', 'Class 10B', 'Class 9A', 'Class 9B', 'Class 8A', 'Class 8B', 'Class 11', 'Class 12'],
      weeklyHours: 4,
      totalChapters: 10,
      labsRequired: false,
      color: 'bg-amber-600'
    },
    {
      id: 'sub-sst',
      code: 'SST-106',
      name: 'Social Sciences & Civics',
      department: 'Humanities',
      leadTeacher: 'Mrs. Sunita Rao',
      classesTaught: ['Class 10B', 'Class 9B', 'Class 8A', 'Class 8B'],
      weeklyHours: 4,
      totalChapters: 12,
      labsRequired: false,
      color: 'bg-rose-600'
    },
    {
      id: 'sub-cs',
      code: 'CSC-107',
      name: 'Computer Science & AI Applications',
      department: 'Technology',
      leadTeacher: 'Dr. Priya Nair',
      classesTaught: ['Class 10A', 'Class 11', 'Class 12'],
      weeklyHours: 4,
      totalChapters: 11,
      labsRequired: true,
      color: 'bg-sky-600'
    },
    {
      id: 'sub-hin',
      code: 'HIN-108',
      name: 'Hindi Literature & Grammar',
      department: 'Languages',
      leadTeacher: 'Mrs. Sunita Rao',
      classesTaught: ['Class 10B', 'Class 9A', 'Class 8A', 'Class 8B'],
      weeklyHours: 3,
      totalChapters: 8,
      labsRequired: false,
      color: 'bg-orange-600'
    }
  ]);

  // Filtered Classes
  const filteredClasses = useMemo(() => {
    return classesList.filter(c => {
      const matchGrade = gradeFilter === 'All' || c.grade === gradeFilter;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.room.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchSearch;
    });
  }, [classesList, gradeFilter, searchQuery]);

  // Filtered Subjects
  const filteredSubjects = useMemo(() => {
    return subjectsList.filter(s => {
      return (
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.leadTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [subjectsList, searchQuery]);

  // Handle Add Class
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.name.trim()) {
      showToast('Please enter a class name.');
      return;
    }
    const newClass: ClassRecord = {
      id: `cls-${Date.now()}`,
      name: newClassForm.name,
      grade: newClassForm.grade,
      section: newClassForm.section,
      room: newClassForm.room,
      classTeacher: newClassForm.classTeacher,
      enrolled: 0,
      capacity: Number(newClassForm.capacity),
      subjects: ['Mathematics', 'Science', 'English'],
      syllabusProgress: 10,
      schedule: '08:30 AM – 02:30 PM'
    };
    setClassesList([newClass, ...classesList]);
    setIsAddClassModalOpen(false);
    setNewClassForm({
      name: '',
      grade: 'Class 10',
      section: 'C',
      room: 'Room 305',
      classTeacher: 'Prof. Rajesh Sharma',
      capacity: 35
    });
    showToast(`Class "${newClass.name}" added successfully.`);
  };

  // Handle Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectForm.name.trim()) {
      showToast('Please enter a subject name.');
      return;
    }
    const newSub: SubjectDetail = {
      id: `sub-${Date.now()}`,
      code: newSubjectForm.code,
      name: newSubjectForm.name,
      department: newSubjectForm.department,
      leadTeacher: newSubjectForm.leadTeacher,
      classesTaught: ['Class 10A', 'Class 9A'],
      weeklyHours: Number(newSubjectForm.weeklyHours),
      totalChapters: Number(newSubjectForm.totalChapters),
      labsRequired: false,
      color: 'bg-indigo-600'
    };
    setSubjectsList([...subjectsList, newSub]);
    setIsAddSubjectModalOpen(false);
    setNewSubjectForm({
      code: 'MTH-201',
      name: '',
      department: 'Mathematics',
      leadTeacher: 'Prof. Rajesh Sharma',
      weeklyHours: 5,
      totalChapters: 12
    });
    showToast(`Subject "${newSub.name}" configured.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0D2847] to-[#0A192F] rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 font-mono font-bold text-xs uppercase tracking-wider border border-blue-500/30">
              Academic Architecture
            </span>
            <span className="text-xs text-slate-400">Session 2025–26</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            <span>Subject and Classes Management</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Configure academic grade levels, class section rosters, course subject allocations, and faculty assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddClassModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Class</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddSubjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Classes</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {classesList.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Class 8 to 12 active</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Core Subjects</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {subjectsList.length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">Full STEM & Languages</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Faculty Assigned</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {academicTeachers.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">100% Subject Coverage</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Avg Class Progress</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            81%
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">On track for Term 2</div>
        </div>
      </div>

      {/* 3. Navigation View Switcher & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'classes'
                ? 'bg-[#0056D6] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Class Sections ({classesList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'subjects'
                ? 'bg-[#0056D6] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Course Subjects ({subjectsList.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'classes' && (
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400 px-2 font-medium">Grade:</span>
              {['All', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGradeFilter(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    gradeFilter === g
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'classes' ? 'Search class, teacher, room...' : 'Search subject, code, lead...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Tab 1: Class Sections Grid */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map(cls => (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-400/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {cls.grade} · Section {cls.section}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cls.room}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2.5">
                  {cls.name}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Class Teacher: <strong className="text-slate-900 dark:text-white">{cls.classTeacher}</strong></span>
                </div>

                {/* Enrolled Capacity */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Class Strength</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {cls.enrolled} / {cls.capacity} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((cls.enrolled / cls.capacity) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Syllabus Progress */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Syllabus Completion</span>
                  <span className="font-mono font-bold text-emerald-600">{cls.syllabusProgress}%</span>
                </div>

                {/* Subjects Badges */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {cls.subjects.map(sub => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {cls.schedule}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Class Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Tab 2: Course Subjects Grid */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map(sub => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-purple-400/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    {sub.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{sub.department}</span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2.5">
                  {sub.name}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Lead Faculty: <strong className="text-slate-900 dark:text-white">{sub.leadTeacher}</strong></span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Weekly Hours</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{sub.weeklyHours} hrs/week</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Chapters</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{sub.totalChapters} Modules</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-slate-400 block mb-1">Assigned Classes:</span>
                  <div className="flex flex-wrap gap-1">
                    {sub.classesTaught.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Curriculum Approved
                </span>
                <span className="text-[11px] text-slate-400">
                  {sub.labsRequired ? '🔬 Lab Component' : '📖 Theory Heavy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {selectedClass.grade} Section {selectedClass.section}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedClass.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Class Teacher</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedClass.classTeacher}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Location / Room</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedClass.room}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Enrolled Students</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedClass.enrolled} / {selectedClass.capacity}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Daily Schedule</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedClass.schedule}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Subject Breakdown & Faculty:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedClass.subjects.map(s => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">{s}</span>
                    <span className="text-slate-500 font-mono text-[11px]">Active Syllabus 84%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Create Class Modal */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Class Section</h3>
              <button
                type="button"
                onClick={() => setIsAddClassModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Class & Section Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10C - Advanced Science"
                  value={newClassForm.name}
                  onChange={e => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Grade Level</label>
                  <select
                    value={newClassForm.grade}
                    onChange={e => setNewClassForm({ ...newClassForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Section</label>
                  <input
                    type="text"
                    value={newClassForm.section}
                    onChange={e => setNewClassForm({ ...newClassForm, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Assigned Class Teacher</label>
                <select
                  value={newClassForm.classTeacher}
                  onChange={e => setNewClassForm({ ...newClassForm, classTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                >
                  {academicTeachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.primarySubject})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Room / Hall</label>
                  <input
                    type="text"
                    value={newClassForm.room}
                    onChange={e => setNewClassForm({ ...newClassForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Student Capacity</label>
                  <input
                    type="number"
                    value={newClassForm.capacity}
                    onChange={e => setNewClassForm({ ...newClassForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-bold"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Add Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Configure New Subject</h3>
              <button
                type="button"
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Applied Robotics & Electronics"
                  value={newSubjectForm.name}
                  onChange={e => setNewSubjectForm({ ...newSubjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Subject Code</label>
                  <input
                    type="text"
                    value={newSubjectForm.code}
                    onChange={e => setNewSubjectForm({ ...newSubjectForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Department</label>
                  <input
                    type="text"
                    value={newSubjectForm.department}
                    onChange={e => setNewSubjectForm({ ...newSubjectForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Lead Teacher</label>
                <select
                  value={newSubjectForm.leadTeacher}
                  onChange={e => setNewSubjectForm({ ...newSubjectForm, leadTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                >
                  {academicTeachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.primarySubject})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Weekly Hours</label>
                  <input
                    type="number"
                    value={newSubjectForm.weeklyHours}
                    onChange={e => setNewSubjectForm({ ...newSubjectForm, weeklyHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Total Chapters</label>
                  <input
                    type="number"
                    value={newSubjectForm.totalChapters}
                    onChange={e => setNewSubjectForm({ ...newSubjectForm, totalChapters: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
