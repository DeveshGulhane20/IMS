import { academicStudents, academicTeachers } from '../data/mockAcademicData';

export interface StudentHomeworkRecord {
  status: 'PENDING' | 'DONE';
  completedAt?: string;
  remarks?: string;
  score?: number; // e.g. out of 10 or 100
}

export interface ClassHomework {
  id: string;
  title: string;
  description: string;
  batchId: string; // 'batch-10a', 'batch-10b', 'batch-9a', 'batch-8a'
  className: string; // 'Class 10A', 'Class 10B', etc.
  subject: string; // 'Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'OVERDUE';
  attachmentName?: string;
  attachmentSize?: string;
  // studentId -> status
  studentSubmissions: Record<string, StudentHomeworkRecord>;
}

const STORAGE_KEY = 'averiq_homework_records_v1';

// Seed Initial Realistic Homework Data
const seedInitialHomework = (): ClassHomework[] => {
  const students10A = academicStudents.filter(s => s.batchId === 'batch-10a');
  const students10B = academicStudents.filter(s => s.batchId === 'batch-10b');
  const students9A = academicStudents.filter(s => s.batchId === 'batch-9a');
  const students8A = academicStudents.filter(s => s.batchId === 'batch-8a');

  // Submissions map helper
  const createSubmissions = (
    students: typeof academicStudents,
    doneRatio: number,
    remarksDefault: string = 'Verified on-time'
  ) => {
    const map: Record<string, StudentHomeworkRecord> = {};
    students.forEach((s, idx) => {
      const isDone = (idx / students.length) < doneRatio;
      map[s.id] = {
        status: isDone ? 'DONE' : 'PENDING',
        completedAt: isDone ? '2026-10-29 04:30 PM' : undefined,
        remarks: isDone ? remarksDefault : undefined,
        score: isDone ? Math.floor(8 + Math.random() * 3) : undefined
      };
    });
    return map;
  };

  return [
    {
      id: 'hw-101',
      title: 'Trigonometric Identities & Height/Distance Proofs',
      description: 'Complete NCERT Exercise 9.1 questions 1 to 16 with step-by-step diagrammatic proofs and angle of elevation derivations.',
      batchId: 'batch-10a',
      className: 'Class 10A',
      subject: 'Mathematics',
      teacherName: 'Prof. Rajesh Sharma',
      assignedDate: '2026-10-27',
      dueDate: '2026-11-01',
      status: 'ACTIVE',
      attachmentName: 'Trigonometry_ProblemSet_9.1.pdf',
      attachmentSize: '1.8 MB',
      studentSubmissions: createSubmissions(students10A, 0.73, 'Completed full derivations')
    },
    {
      id: 'hw-102',
      title: 'Ray Optics: Lens Maker Equation & Refraction at Spherical Surfaces',
      description: 'Derive focal length formula for thin biconvex lenses. Solve numerical problems 4 through 12 from Chapter 9.',
      batchId: 'batch-10a',
      className: 'Class 10A',
      subject: 'Physics',
      teacherName: 'Dr. Neha Kulkarni',
      assignedDate: '2026-10-28',
      dueDate: '2026-11-02',
      status: 'ACTIVE',
      attachmentName: 'Ray_Optics_Practice_Problems.pdf',
      attachmentSize: '2.4 MB',
      studentSubmissions: createSubmissions(students10A, 0.60, 'Neat ray diagrams')
    },
    {
      id: 'hw-103',
      title: 'Periodic Table Trends & Chemical Bonding Worksheet',
      description: 'Tabulate atomic radius, ionization energy, and electron gain enthalpy trends across Period 3 elements with explanations.',
      batchId: 'batch-10b',
      className: 'Class 10B',
      subject: 'Chemistry',
      teacherName: 'Prof. Amit Verma',
      assignedDate: '2026-10-26',
      dueDate: '2026-10-31',
      status: 'ACTIVE',
      attachmentName: 'Periodic_Trends_Worksheet.pdf',
      attachmentSize: '1.2 MB',
      studentSubmissions: createSubmissions(students10B, 0.80, 'Accurate trend analysis')
    },
    {
      id: 'hw-104',
      title: 'Formal Letter to Editor & Analytical Paragraph Writing',
      description: 'Draft a 150-word formal editorial letter on plastic waste management in urban residential sectors following CBSE marking rubrics.',
      batchId: 'batch-10b',
      className: 'Class 10B',
      subject: 'English',
      teacherName: 'Mrs. Priya Kapoor',
      assignedDate: '2026-10-25',
      dueDate: '2026-10-29',
      status: 'OVERDUE',
      attachmentName: 'Editorial_Writing_Rubric.pdf',
      attachmentSize: '850 KB',
      studentSubmissions: createSubmissions(students10B, 0.53, 'Good vocabulary and format')
    },
    {
      id: 'hw-105',
      title: 'Cell Structure, Organelles & Mitosis Cell Division Cycle',
      description: 'Draw labeled diagrams of Plant Cell vs Animal Cell organelles. Summarize the 4 stages of Mitosis with brief notes.',
      batchId: 'batch-9a',
      className: 'Class 9A',
      subject: 'Biology',
      teacherName: 'Dr. Sunita Deshmukh',
      assignedDate: '2026-10-27',
      dueDate: '2026-11-03',
      status: 'ACTIVE',
      attachmentName: 'Cell_Division_Diagrams.pdf',
      attachmentSize: '3.1 MB',
      studentSubmissions: createSubmissions(students9A, 0.70, 'Diagrams well illustrated')
    },
    {
      id: 'hw-106',
      title: 'Linear Equations in Two Variables & Coordinate Graphs',
      description: 'Solve paired linear equations using substitution and elimination methods. Plot graphs for 5 linear equations on graph sheets.',
      batchId: 'batch-9a',
      className: 'Class 9A',
      subject: 'Mathematics',
      teacherName: 'Prof. Rajesh Sharma',
      assignedDate: '2026-10-24',
      dueDate: '2026-10-28',
      status: 'COMPLETED',
      attachmentName: 'Linear_Equations_Plotting.pdf',
      attachmentSize: '1.5 MB',
      studentSubmissions: createSubmissions(students9A, 1.0, 'All solutions submitted')
    },
    {
      id: 'hw-107',
      title: 'Force, Pressure & Atmospheric Pressure Experiments',
      description: 'Complete worksheet questions on contact and non-contact forces. Write observation summary for liquid pressure at various depths.',
      batchId: 'batch-8a',
      className: 'Class 8A',
      subject: 'Physics',
      teacherName: 'Dr. Neha Kulkarni',
      assignedDate: '2026-10-28',
      dueDate: '2026-11-04',
      status: 'ACTIVE',
      attachmentName: 'Force_and_Pressure_WS.pdf',
      attachmentSize: '1.1 MB',
      studentSubmissions: createSubmissions(students8A, 0.60, 'Clear observational logic')
    }
  ];
};

export const HomeworkService = {
  getHomeworkList: (): ClassHomework[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    const initial = seedInitialHomework();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  },

  saveHomeworkList: (list: ClassHomework[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('averiq_homework_updated'));
    } catch (e) {
      console.error('Failed to save homework records:', e);
    }
  },

  assignHomework: (params: {
    title: string;
    description: string;
    batchId: string;
    className: string;
    subject: string;
    teacherName: string;
    dueDate: string;
    attachmentName?: string;
  }): ClassHomework => {
    const list = HomeworkService.getHomeworkList();
    const studentsInBatch = academicStudents.filter(s => s.batchId === params.batchId);
    
    // Assign to every student in this batch initialized as PENDING
    const studentSubmissions: Record<string, StudentHomeworkRecord> = {};
    studentsInBatch.forEach(s => {
      studentSubmissions[s.id] = {
        status: 'PENDING'
      };
    });

    const newHw: ClassHomework = {
      id: `hw-${Date.now()}`,
      title: params.title,
      description: params.description,
      batchId: params.batchId,
      className: params.className,
      subject: params.subject,
      teacherName: params.teacherName,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: params.dueDate,
      status: 'ACTIVE',
      attachmentName: params.attachmentName || 'Assignment_Guidelines.pdf',
      attachmentSize: '1.5 MB',
      studentSubmissions
    };

    const updated = [newHw, ...list];
    HomeworkService.saveHomeworkList(updated);
    return newHw;
  },

  toggleStudentStatus: (homeworkId: string, studentId: string): ClassHomework | null => {
    const list = HomeworkService.getHomeworkList();
    const hw = list.find(h => h.id === homeworkId);
    if (!hw) return null;

    const currentRecord = hw.studentSubmissions[studentId] || { status: 'PENDING' };
    const nextStatus: 'PENDING' | 'DONE' = currentRecord.status === 'DONE' ? 'PENDING' : 'DONE';

    hw.studentSubmissions[studentId] = {
      ...currentRecord,
      status: nextStatus,
      completedAt: nextStatus === 'DONE' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined,
      remarks: nextStatus === 'DONE' ? (currentRecord.remarks || 'Completed by student') : undefined
    };

    HomeworkService.saveHomeworkList([...list]);
    return hw;
  },

  markAllStudentsInHomework: (homeworkId: string, status: 'DONE' | 'PENDING'): ClassHomework | null => {
    const list = HomeworkService.getHomeworkList();
    const hw = list.find(h => h.id === homeworkId);
    if (!hw) return null;

    const students = academicStudents.filter(s => s.batchId === hw.batchId);
    students.forEach(s => {
      hw.studentSubmissions[s.id] = {
        ...(hw.studentSubmissions[s.id] || {}),
        status,
        completedAt: status === 'DONE' ? 'Marked complete by teacher' : undefined
      };
    });

    HomeworkService.saveHomeworkList([...list]);
    return hw;
  },

  getStudentHomeworkSummary: (studentId: string, batchId: string) => {
    const list = HomeworkService.getHomeworkList();
    const studentHws = list.filter(h => h.batchId === batchId);
    
    let total = studentHws.length;
    let completed = 0;
    let pending = 0;

    const items = studentHws.map(h => {
      const rec = h.studentSubmissions[studentId] || { status: 'PENDING' };
      if (rec.status === 'DONE') completed++;
      else pending++;

      return {
        homework: h,
        record: rec
      };
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

    return {
      total,
      completed,
      pending,
      completionRate,
      items
    };
  }
};
