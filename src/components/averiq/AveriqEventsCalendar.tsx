import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Filter,
  Tag,
  BookOpen,
  GraduationCap,
  Layers,
  Plus,
  Search,
  UserCheck,
  CalendarCheck,
  CalendarDays,
  Bell,
  FileSpreadsheet,
  Download,
  Share2,
  Eye,
  Check,
  X,
  Send,
  AlertCircle,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

interface TimetableSlotMatrix {
  timeSlot: string; // e.g. "08:00 AM - 09:00 AM"
  period: string; // e.g. "Period 1"
  mon: { subject: string; teacher: string; room: string; color: string; type: string };
  tue: { subject: string; teacher: string; room: string; color: string; type: string };
  wed: { subject: string; teacher: string; room: string; color: string; type: string };
  thu: { subject: string; teacher: string; room: string; color: string; type: string };
  fri: { subject: string; teacher: string; room: string; color: string; type: string };
  sat: { subject: string; teacher: string; room: string; color: string; type: string };
}

interface EventItem {
  id: string;
  title: string;
  category: 'Event' | 'Exam' | 'Holiday' | 'Meeting' | 'Class';
  date: string;
  time: string;
  venue: string;
  coordinator: string;
  attendeesCount: number;
  description: string;
  badgeColor: string;
}

export const AveriqEventsCalendar: React.FC = () => {
  const { showToast } = useIMS();

  // Primary Master Timetable Sub-Tab
  const [timetableSubTab, setTimetableSubTab] = useState<'class' | 'exam' | 'event'>('class');
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [timetableDayFilter, setTimetableDayFilter] = useState<'all' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'>('all');

  // Calendar State
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // November 2026
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(15);

  // Modals state
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isAddTimetableModalOpen, setIsAddTimetableModalOpen] = useState(false);
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
  const [isSendReminderModalOpen, setIsSendReminderModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<EventItem | null>(null);

  // Forms
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    category: 'Event' as 'Event' | 'Exam' | 'Holiday' | 'Meeting' | 'Class',
    date: 'Nov 20, 2026',
    time: '10:00 AM – 12:00 PM',
    venue: 'Auditorium Central',
    description: ''
  });

  const [newSlotForm, setNewSlotForm] = useState({
    classGrade: 'Class 10',
    day: 'mon',
    timeSlot: '08:00 AM - 09:00 AM',
    subject: 'Mathematics',
    teacher: 'Prof. Rajesh Sharma',
    room: 'Hall 101'
  });

  const [newHolidayForm, setNewHolidayForm] = useState({
    title: 'Guru Nanak Jayanti',
    date: 'Nov 27, 2026',
    type: 'Gazetted Holiday'
  });

  const [reminderForm, setReminderForm] = useState({
    batch: 'Class 10',
    channel: 'SMS & WhatsApp',
    message: 'Reminder: Mathematics revision test scheduled for tomorrow at 08:30 AM.'
  });

  // Upcoming Events Feed
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([
    {
      id: 'ev-1',
      title: 'Annual Science Exhibition & Robotics Expo',
      category: 'Event',
      date: 'Nov 15, 2026',
      time: '09:00 AM – 03:00 PM',
      venue: 'Main Auditorium & STEM Labs',
      coordinator: 'Dr. Neha Kulkarni',
      attendeesCount: 450,
      description: 'Interactive STEM models, student working prototypes, and robotics demonstrations.',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    },
    {
      id: 'ev-2',
      title: 'Parent Teacher Meeting (PTM) – Term 1 Review',
      category: 'Meeting',
      date: 'Nov 18, 2026',
      time: '02:00 PM – 05:30 PM',
      venue: 'Conference Hall & Classrooms',
      coordinator: 'Prof. Rajesh Sharma',
      attendeesCount: 320,
      description: 'One-on-one progress discussions with subject mentors and attendance report reviews.',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'ev-3',
      title: 'Cultural Fest "Spandana 2026"',
      category: 'Event',
      date: 'Nov 24, 2026',
      time: '10:00 AM – 06:00 PM',
      venue: 'Open Air Amphitheater',
      coordinator: 'Mrs. Sunita Rao',
      attendeesCount: 600,
      description: 'Annual inter-class classical dance, vocal music, drama, and fine arts carnival.',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    },
    {
      id: 'ev-4',
      title: 'Board Exam Orientation & Counseling Seminar',
      category: 'Exam',
      date: 'Dec 02, 2026',
      time: '11:00 AM – 01:00 PM',
      venue: 'Seminar Hall 1',
      coordinator: 'Academic Directorate',
      attendeesCount: 280,
      description: 'Time management tactics, stress reduction workshops, and answer-sheet writing guidelines.',
      badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    },
    {
      id: 'ev-5',
      title: 'Annual Sports Meet & Track Athletics',
      category: 'Event',
      date: 'Dec 12, 2026',
      time: '08:00 AM – 04:00 PM',
      venue: 'Institute Sports Complex & Ground',
      coordinator: 'Coach V. Ranade',
      attendeesCount: 520,
      description: 'Inter-house relay sprints, high jump, shot put, football finals, and martial arts.',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    }
  ]);

  // Master Weekly Matrix Table Data (from 08:00 AM to 02:00 PM across Mon - Sat)
  // Mapping Mathematics, Physics, Chemistry, English, Hindi, Science, Social Science, Computer, Art, Physical Education, Library
  const weeklyMatrix: TimetableSlotMatrix[] = [
    {
      timeSlot: '08:00 AM – 09:00 AM',
      period: 'Period 1',
      mon: { subject: 'Mathematics', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800', type: 'Theory' },
      tue: { subject: 'Physics', teacher: 'Dr. Neha Kulkarni', room: 'Lab 2', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800', type: 'Lab' },
      wed: { subject: 'Chemistry', teacher: 'Prof. Amit Verma', room: 'Room 204', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', type: 'Theory' },
      thu: { subject: 'English', teacher: 'Mrs. Sunita Rao', room: 'Hall 101', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', type: 'Theory' },
      fri: { subject: 'Mathematics', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800', type: 'Theory' },
      sat: { subject: 'Computer', teacher: 'Prof. Vikram Sen', room: 'IT Lab', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800', type: 'Practical' }
    },
    {
      timeSlot: '09:00 AM – 10:00 AM',
      period: 'Period 2',
      mon: { subject: 'Physics', teacher: 'Dr. Neha Kulkarni', room: 'Hall 101', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800', type: 'Theory' },
      tue: { subject: 'Chemistry', teacher: 'Prof. Amit Verma', room: 'Chem Lab', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', type: 'Lab' },
      wed: { subject: 'Mathematics', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800', type: 'Theory' },
      thu: { subject: 'Hindi', teacher: 'Dr. S. Mishra', room: 'Hall 101', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800', type: 'Theory' },
      fri: { subject: 'Science', teacher: 'Dr. Priya Nair', room: 'Lab 1', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800', type: 'Theory' },
      sat: { subject: 'Art & Craft', teacher: 'Ms. Kavita Shah', room: 'Studio 3', color: 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-800', type: 'Activity' }
    },
    {
      timeSlot: '10:00 AM – 11:00 AM',
      period: 'Period 3',
      mon: { subject: 'Chemistry', teacher: 'Prof. Amit Verma', room: 'Hall 101', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', type: 'Theory' },
      tue: { subject: 'Mathematics', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800', type: 'Theory' },
      wed: { subject: 'Social Science', teacher: 'Dr. Anand Joshi', room: 'Room 205', color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800', type: 'Theory' },
      thu: { subject: 'Computer', teacher: 'Prof. Vikram Sen', room: 'IT Lab', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800', type: 'Practical' },
      fri: { subject: 'Social Science', teacher: 'Dr. Anand Joshi', room: 'Hall 101', color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800', type: 'Theory' },
      sat: { subject: 'Library', teacher: 'Mr. Raman Iyer', room: 'Central Library', color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800', type: 'Reading' }
    },
    {
      timeSlot: '11:00 AM – 11:30 AM',
      period: 'Recess',
      mon: { subject: 'Short Break / Lunch', teacher: 'Campus Cafeteria', room: 'Dining Hall', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border-dashed border-slate-200 dark:border-slate-700', type: 'Break' },
      tue: { subject: 'Short Break / Lunch', teacher: 'Campus Cafeteria', room: 'Dining Hall', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border-dashed border-slate-200 dark:border-slate-700', type: 'Break' },
      wed: { subject: 'Short Break / Lunch', teacher: 'Campus Cafeteria', room: 'Dining Hall', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border-dashed border-slate-200 dark:border-slate-700', type: 'Break' },
      thu: { subject: 'Short Break / Lunch', teacher: 'Campus Cafeteria', room: 'Dining Hall', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border-dashed border-slate-200 dark:border-slate-700', type: 'Break' },
      fri: { subject: 'Short Break / Lunch', teacher: 'Campus Cafeteria', room: 'Dining Hall', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border-dashed border-slate-200 dark:border-slate-700', type: 'Break' },
      sat: { subject: 'Short Break / Lunch', teacher: 'Campus Cafeteria', room: 'Dining Hall', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400 border-dashed border-slate-200 dark:border-slate-700', type: 'Break' }
    },
    {
      timeSlot: '11:30 AM – 12:30 PM',
      period: 'Period 4',
      mon: { subject: 'English', teacher: 'Mrs. Sunita Rao', room: 'Hall 101', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', type: 'Theory' },
      tue: { subject: 'Hindi', teacher: 'Dr. S. Mishra', room: 'Hall 101', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800', type: 'Theory' },
      wed: { subject: 'Physics', teacher: 'Dr. Neha Kulkarni', room: 'Hall 101', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800', type: 'Theory' },
      thu: { subject: 'Science', teacher: 'Dr. Priya Nair', room: 'Bio Lab', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800', type: 'Lab' },
      fri: { subject: 'English', teacher: 'Mrs. Sunita Rao', room: 'Hall 101', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', type: 'Theory' },
      sat: { subject: 'Physical Education', teacher: 'Coach V. Ranade', room: 'Sports Arena', color: 'bg-lime-50 text-lime-700 dark:bg-lime-950/50 dark:text-lime-300 border-lime-200 dark:border-lime-800', type: 'Sports' }
    },
    {
      timeSlot: '12:30 PM – 01:15 PM',
      period: 'Period 5',
      mon: { subject: 'Hindi', teacher: 'Dr. S. Mishra', room: 'Hall 101', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800', type: 'Theory' },
      tue: { subject: 'Social Science', teacher: 'Dr. Anand Joshi', room: 'Hall 101', color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800', type: 'Theory' },
      wed: { subject: 'Computer', teacher: 'Prof. Vikram Sen', room: 'IT Lab', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800', type: 'Practical' },
      thu: { subject: 'Mathematics', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800', type: 'Theory' },
      fri: { subject: 'Hindi', teacher: 'Dr. S. Mishra', room: 'Hall 101', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800', type: 'Theory' },
      sat: { subject: 'Mathematics (Quiz)', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800', type: 'Tutorial' }
    },
    {
      timeSlot: '01:15 PM – 02:00 PM',
      period: 'Period 6',
      mon: { subject: 'Physical Education', teacher: 'Coach V. Ranade', room: 'Ground', color: 'bg-lime-50 text-lime-700 dark:bg-lime-950/50 dark:text-lime-300 border-lime-200 dark:border-lime-800', type: 'Sports' },
      tue: { subject: 'English', teacher: 'Mrs. Sunita Rao', room: 'Hall 101', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', type: 'Theory' },
      wed: { subject: 'Library', teacher: 'Mr. Raman Iyer', room: 'Library', color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800', type: 'Reading' },
      thu: { subject: 'Physics', teacher: 'Dr. Neha Kulkarni', room: 'Hall 101', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800', type: 'Theory' },
      fri: { subject: 'Art & Craft', teacher: 'Ms. Kavita Shah', room: 'Studio 3', color: 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-800', type: 'Activity' },
      sat: { subject: 'Science (Doubt Clinic)', teacher: 'Dr. Priya Nair', room: 'Room 204', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800', type: 'Tutorial' }
    }
  ];

  // Calendar dates generation for November 2026 (30 days, starts on Sunday)
  const calendarDays = useMemo(() => {
    const days = [];
    // Start day offset for Nov 2026 is Sunday (0)
    for (let i = 1; i <= 30; i++) {
      let eventType: 'Exam' | 'Event' | 'Holiday' | 'Meeting' | 'Class' | null = null;
      let label = '';
      if (i === 12) {
        eventType = 'Exam';
        label = 'Maths Unit Test';
      } else if (i === 15) {
        eventType = 'Event';
        label = 'Science Expo';
      } else if (i === 16) {
        eventType = 'Exam';
        label = 'Physics Pract.';
      } else if (i === 18) {
        eventType = 'Meeting';
        label = 'PTM Review';
      } else if (i === 24) {
        eventType = 'Event';
        label = 'Cultural Fest';
      } else if (i === 27) {
        eventType = 'Holiday';
        label = 'Guru Nanak Jayanti';
      } else if (i % 7 !== 0) {
        eventType = 'Class';
        label = 'Regular Classes';
      }
      days.push({ day: i, eventType, label });
    }
    return days;
  }, []);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title.trim()) return;
    const created: EventItem = {
      id: `ev-${Date.now()}`,
      title: newEventForm.title,
      category: newEventForm.category,
      date: newEventForm.date,
      time: newEventForm.time,
      venue: newEventForm.venue,
      coordinator: 'Administrator',
      attendeesCount: 200,
      description: newEventForm.description || 'Institutional event scheduled on master timetable.',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    };
    setUpcomingEvents([created, ...upcomingEvents]);
    setIsCreateEventModalOpen(false);
    showToast(`Event "${created.title}" successfully added to calendar.`);
    setNewEventForm({
      title: '',
      category: 'Event',
      date: 'Nov 20, 2026',
      time: '10:00 AM – 12:00 PM',
      venue: 'Auditorium Central',
      description: ''
    });
  };

  const handleAddTimetableSlot = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Timetable slot for ${newSlotForm.subject} (${newSlotForm.classGrade}) added.`);
    setIsAddTimetableModalOpen(false);
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Holiday "${newHolidayForm.title}" recorded on institutional calendar.`);
    setIsAddHolidayModalOpen(false);
  };

  const handleSendReminder = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Broadcast reminder dispatched to all ${reminderForm.batch} students via ${reminderForm.channel}.`);
    setIsSendReminderModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. HEADER & TOP METRIC CARDS
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-7 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="flex items-start gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <CalendarDays className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-[11px] uppercase tracking-wider border border-blue-500/30">
                Institutional Academic Scheduling
              </span>
              <span className="text-xs text-slate-400">Term 1 & Term 2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Events & Timetable
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Plan, manage and never miss an important event or class.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 z-10 self-start md:self-auto">
          <button
            type="button"
            onClick={() => showToast('Exporting consolidated master timetable (PDF)... File ready.')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export Timetable</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateEventModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards: Total Events (24), Upcoming Events (8), Classes Today (36), On-Time Attendance (92%) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Events</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">24</span>
            <span className="text-[11px] font-bold text-slate-500">Recorded</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Full academic session events</p>
        </div>

        {/* Upcoming Events */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upcoming Events</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">8</span>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
              Next 30 Days
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Includes Science Expo & PTM</p>
        </div>

        {/* Classes Today */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Classes Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">36</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              Active Roster
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Spanning 6 batch sections</p>
        </div>

        {/* On-Time Attendance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">On-Time Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">92%</span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +2.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Biometric lecture punch-ins</p>
        </div>
      </div>

      {/* =========================================================================
          2. PRIMARY PRIORITY SECTION - MASTER TIMETABLE VIEW + RIGHT ACTIONS SIDEBAR
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 Columns: Master Timetable View (Absolute Priority) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            {/* Timetable Sub-Navigation Tabs & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              {/* Sub-tabs: Class Timetable | Exam Schedule | Event Timetable */}
              <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTimetableSubTab('class')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    timetableSubTab === 'class'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Class Timetable
                </button>
                <button
                  type="button"
                  onClick={() => setTimetableSubTab('exam')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    timetableSubTab === 'exam'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Exam Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setTimetableSubTab('event')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    timetableSubTab === 'event'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Event Timetable
                </button>
              </div>

              {/* Class Selector Dropdown & Day Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Class 10">Class 10 (Senior Secondary)</option>
                  <option value="Class 9">Class 9 (High School)</option>
                  <option value="Class 8">Class 8 (Middle School)</option>
                  <option value="Class 11">Class 11 (Science / Commerce)</option>
                  <option value="Class 12">Class 12 (Board Prep)</option>
                </select>
              </div>
            </div>

            {/* Timetable Header Subtext */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Weekly Master Timetable – {selectedClass}</span>
                  <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                    6 Days • 08:00 AM – 02:00 PM
                  </span>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Subject slots, invigilation mentors, and assigned instructional venues
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Active Week 45</span>
              </div>
            </div>

            {/* FULL WEEKLY MATRIX TABLE: Monday to Saturday & 08:00 AM to 02:00 PM */}
            {timetableSubTab === 'class' && (
              <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 w-32">Time / Period</th>
                      <th className="py-3 px-2">Mon</th>
                      <th className="py-3 px-2">Tue</th>
                      <th className="py-3 px-2">Wed</th>
                      <th className="py-3 px-2">Thu</th>
                      <th className="py-3 px-2">Fri</th>
                      <th className="py-3 px-2">Sat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 font-medium">
                    {weeklyMatrix.map((slot, idx) => (
                      <tr key={idx} className={slot.period === 'Recess' ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/30'}>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          <div className="font-bold text-slate-900 dark:text-white text-[11px]">{slot.period}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{slot.timeSlot}</div>
                        </td>

                        {/* Mon */}
                        <td className="p-1.5">
                          <div className={`p-2 rounded-xl border text-[11px] ${slot.mon.color}`}>
                            <span className="font-bold block truncate">{slot.mon.subject}</span>
                            <span className="text-[10px] block opacity-80 truncate">{slot.mon.teacher}</span>
                            <span className="text-[9px] font-mono opacity-70 block">{slot.mon.room}</span>
                          </div>
                        </td>

                        {/* Tue */}
                        <td className="p-1.5">
                          <div className={`p-2 rounded-xl border text-[11px] ${slot.tue.color}`}>
                            <span className="font-bold block truncate">{slot.tue.subject}</span>
                            <span className="text-[10px] block opacity-80 truncate">{slot.tue.teacher}</span>
                            <span className="text-[9px] font-mono opacity-70 block">{slot.tue.room}</span>
                          </div>
                        </td>

                        {/* Wed */}
                        <td className="p-1.5">
                          <div className={`p-2 rounded-xl border text-[11px] ${slot.wed.color}`}>
                            <span className="font-bold block truncate">{slot.wed.subject}</span>
                            <span className="text-[10px] block opacity-80 truncate">{slot.wed.teacher}</span>
                            <span className="text-[9px] font-mono opacity-70 block">{slot.wed.room}</span>
                          </div>
                        </td>

                        {/* Thu */}
                        <td className="p-1.5">
                          <div className={`p-2 rounded-xl border text-[11px] ${slot.thu.color}`}>
                            <span className="font-bold block truncate">{slot.thu.subject}</span>
                            <span className="text-[10px] block opacity-80 truncate">{slot.thu.teacher}</span>
                            <span className="text-[9px] font-mono opacity-70 block">{slot.thu.room}</span>
                          </div>
                        </td>

                        {/* Fri */}
                        <td className="p-1.5">
                          <div className={`p-2 rounded-xl border text-[11px] ${slot.fri.color}`}>
                            <span className="font-bold block truncate">{slot.fri.subject}</span>
                            <span className="text-[10px] block opacity-80 truncate">{slot.fri.teacher}</span>
                            <span className="text-[9px] font-mono opacity-70 block">{slot.fri.room}</span>
                          </div>
                        </td>

                        {/* Sat */}
                        <td className="p-1.5">
                          <div className={`p-2 rounded-xl border text-[11px] ${slot.sat.color}`}>
                            <span className="font-bold block truncate">{slot.sat.subject}</span>
                            <span className="text-[10px] block opacity-80 truncate">{slot.sat.teacher}</span>
                            <span className="text-[9px] font-mono opacity-70 block">{slot.sat.room}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Exam Schedule Sub-tab */}
            {timetableSubTab === 'exam' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
                  <span className="font-medium">Term 1 Pre-Board Exam Seating & Roster Active</span>
                  <span className="font-mono font-bold">12 Total Test Papers</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Exam Paper</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3">Hall</th>
                        <th className="py-2.5 px-3">Invigilator</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="py-3 px-3 font-mono">Nov 12, 2026</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Mathematics Unit Test 5</td>
                        <td className="py-3 px-3 font-mono text-slate-500">08:30 AM – 10:30 AM</td>
                        <td className="py-3 px-3">Hall A</td>
                        <td className="py-3 px-3">Prof. Rajesh Sharma</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">Upcoming</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="py-3 px-3 font-mono">Nov 16, 2026</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Physics Term 2 Practical</td>
                        <td className="py-3 px-3 font-mono text-slate-500">09:00 AM – 11:30 AM</td>
                        <td className="py-3 px-3">Physics Lab</td>
                        <td className="py-3 px-3">Dr. Neha Kulkarni</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">Upcoming</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="py-3 px-3 font-mono">Nov 18, 2026</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">Chemistry Organic Assessment</td>
                        <td className="py-3 px-3 font-mono text-slate-500">10:00 AM – 11:30 AM</td>
                        <td className="py-3 px-3">Room 204</td>
                        <td className="py-3 px-3">Prof. Amit Verma</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">Upcoming</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Event Timetable Sub-tab */}
            {timetableSubTab === 'event' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {upcomingEvents.map(ev => (
                    <div key={ev.id} className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${ev.badgeColor}`}>
                          {ev.category}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{ev.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ev.title}</h4>
                      <p className="text-slate-500 text-[11px] line-clamp-2">{ev.description}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {ev.time}
                        </span>
                        <span>{ev.venue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Quick Actions Sidebar + Today's Summary Widget */}
        <div className="space-y-6">
          {/* 1. Quick Actions Card */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                <h3 className="font-bold text-sm">Quick Actions</h3>
              </div>
              <p className="text-[11px] text-blue-100 mt-1">
                Schedule and administer academic timelines
              </p>
            </div>

            <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setIsCreateEventModalOpen(true)}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                    Create Event
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsAddTimetableModalOpen(true)}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                    Add Timetable
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsAddHolidayModalOpen(true)}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                    Add Holiday
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsSendReminderModalOpen(true)}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors">
                    Send Reminder
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => showToast('Opening institutional timetable and attendance analytics reports...')}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 transition-colors">
                    View Reports
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* 2. Today's Summary Widget */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Today's Summary</span>
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                Live Status
              </span>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">Classes Conducted</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">28 / 36 Completed</span>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">77.7%</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">Events Today</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">2 Scheduled</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600">On Track</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">Pending Reminders</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">4 Broadcasts</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600">Action Req.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. SECONDARY SECTIONS: INTERACTIVE CALENDAR & UPCOMING EVENTS FEED
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Interactive Calendar Widget (Span 3) */}
        <div className="lg:col-span-3 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span>Academic Calendar – November 2026</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Double-click or select any date to view scheduled events, exams, and classes
              </p>
            </div>

            {/* View Selectors: Month / Week / Day */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setCalendarView('month')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  calendarView === 'month' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => setCalendarView('week')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  calendarView === 'week' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setCalendarView('day')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  calendarView === 'day' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Color-Coded Category Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium pt-1">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Exams
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              Events
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Holidays
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Classes
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Meetings
            </span>
          </div>

          {/* Monthly Calendar Grid */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-center font-bold text-[11px] text-slate-500 py-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {calendarDays.map(item => {
                const isSelected = selectedCalendarDate === item.day;
                return (
                  <div
                    key={item.day}
                    onClick={() => {
                      setSelectedCalendarDate(item.day);
                      if (item.label && item.eventType) {
                        showToast(`Nov ${item.day}: ${item.label} (${item.eventType})`);
                      }
                    }}
                    onDoubleClick={() => setIsCreateEventModalOpen(true)}
                    className={`min-h-[64px] p-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-900/30 font-bold'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono ${isSelected ? 'text-blue-600 font-black' : 'text-slate-700 dark:text-slate-300'}`}>
                        {item.day}
                      </span>
                      {item.eventType && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.eventType === 'Exam'
                              ? 'bg-rose-500'
                              : item.eventType === 'Event'
                              ? 'bg-indigo-600'
                              : item.eventType === 'Holiday'
                              ? 'bg-emerald-500'
                              : item.eventType === 'Meeting'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        />
                      )}
                    </div>

                    {item.label && (
                      <div
                        className={`mt-1 px-1 py-0.5 rounded text-[9px] font-semibold truncate ${
                          item.eventType === 'Exam'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                            : item.eventType === 'Event'
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                            : item.eventType === 'Holiday'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : item.eventType === 'Meeting'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        }`}
                      >
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Feed (Span 2) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span>Upcoming Events</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional activities and key dates
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Opening comprehensive events schedule...')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEventDetails(event)}
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${event.badgeColor}`}>
                    {event.category}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px] font-semibold">{event.date}</span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h4>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {event.venue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODALS: CREATE EVENT / ADD TIMETABLE / ADD HOLIDAY / SEND REMINDER
          ========================================================================= */}

      {/* 1. CREATE EVENT MODAL */}
      {isCreateEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Create New Event</h3>
                  <span className="text-xs text-slate-400">Add to Master Calendar</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateEventModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition & Model Presentation"
                  value={newEventForm.title}
                  onChange={e => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newEventForm.category}
                    onChange={e => setNewEventForm({ ...newEventForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Event">Event</option>
                    <option value="Exam">Exam</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Meeting">Meeting / PTM</option>
                    <option value="Class">Special Class</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newEventForm.date}
                    onChange={e => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    value={newEventForm.time}
                    onChange={e => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={newEventForm.venue}
                    onChange={e => setNewEventForm({ ...newEventForm, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Remarks
                </label>
                <textarea
                  rows={2}
                  value={newEventForm.description}
                  onChange={e => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  placeholder="Details for participants and attendees..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  Save & Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD TIMETABLE SLOT MODAL */}
      {isAddTimetableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Timetable Slot</h3>
                  <span className="text-xs text-slate-400">Class Lecture Allocation</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTimetableModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTimetableSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class
                  </label>
                  <select
                    value={newSlotForm.classGrade}
                    onChange={e => setNewSlotForm({ ...newSlotForm, classGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Day
                  </label>
                  <select
                    value={newSlotForm.day}
                    onChange={e => setNewSlotForm({ ...newSlotForm, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="mon">Monday</option>
                    <option value="tue">Tuesday</option>
                    <option value="wed">Wednesday</option>
                    <option value="thu">Thursday</option>
                    <option value="fri">Friday</option>
                    <option value="sat">Saturday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newSlotForm.subject}
                    onChange={e => setNewSlotForm({ ...newSlotForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teacher
                  </label>
                  <input
                    type="text"
                    value={newSlotForm.teacher}
                    onChange={e => setNewSlotForm({ ...newSlotForm, teacher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={newSlotForm.timeSlot}
                    onChange={e => setNewSlotForm({ ...newSlotForm, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Classroom / Lab
                  </label>
                  <input
                    type="text"
                    value={newSlotForm.room}
                    onChange={e => setNewSlotForm({ ...newSlotForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTimetableModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD HOLIDAY MODAL */}
      {isAddHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Institute Holiday</h3>
                  <span className="text-xs text-slate-400">Official Calendar Non-Working Day</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddHolidayModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHoliday} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Holiday Name
                </label>
                <input
                  type="text"
                  required
                  value={newHolidayForm.title}
                  onChange={e => setNewHolidayForm({ ...newHolidayForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newHolidayForm.date}
                    onChange={e => setNewHolidayForm({ ...newHolidayForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newHolidayForm.type}
                    onChange={e => setNewHolidayForm({ ...newHolidayForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Gazetted Holiday">Gazetted Holiday</option>
                    <option value="Institutional Break">Institutional Break</option>
                    <option value="Staff Development Day">Staff Development Day</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddHolidayModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. SEND REMINDER MODAL */}
      {isSendReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Send Broadcast Reminder</h3>
                  <span className="text-xs text-slate-400">Class & Event Alerts</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSendReminderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReminder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Class / Batch
                  </label>
                  <select
                    value={reminderForm.batch}
                    onChange={e => setReminderForm({ ...reminderForm, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="Class 10">Class 10 (All Sections)</option>
                    <option value="Class 9">Class 9 (All Sections)</option>
                    <option value="Class 8">Class 8</option>
                    <option value="All Batches">All Enrolled Batches</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dispatch Channel
                  </label>
                  <select
                    value={reminderForm.channel}
                    onChange={e => setReminderForm({ ...reminderForm, channel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="SMS & WhatsApp">SMS & WhatsApp</option>
                    <option value="Portal Notification">Portal Notification</option>
                    <option value="All Channels">All Channels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reminder Message
                </label>
                <textarea
                  rows={3}
                  value={reminderForm.message}
                  onChange={e => setReminderForm({ ...reminderForm, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSendReminderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. EVENT DETAILS VIEWER MODAL */}
      {selectedEventDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selectedEventDetails.badgeColor}`}>
                {selectedEventDetails.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedEventDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {selectedEventDetails.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedEventDetails.description}
              </p>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date & Time</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedEventDetails.date} ({selectedEventDetails.time})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Venue</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedEventDetails.venue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Faculty In-Charge</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedEventDetails.coordinator}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Expected Attendees</span>
                  <span className="font-bold font-mono text-blue-600">{selectedEventDetails.attendeesCount} Students</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedEventDetails(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Event itinerary printed for ${selectedEventDetails.title}.`);
                  setSelectedEventDetails(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
              >
                Download Itinerary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
