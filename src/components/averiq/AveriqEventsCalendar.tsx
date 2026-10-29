import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Filter,
  Tag,
  BookOpen,
  GraduationCap,
  Layers,
  Plus,
  Search,
  UserCheck
} from 'lucide-react';
import { academicEvents, academicMetrics, academicTeachers } from '../../data/mockAcademicData';
import { AcademicEvent } from '../../types/academic';
import { InteractivePieChart } from '../charts/InteractivePieChart';
import { useIMS } from '../../context/IMSContext';

interface TimetableSlot {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  time: string;
  grade: string;
  section: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'Theory' | 'Lab' | 'Tutorial';
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export const AveriqEventsCalendar: React.FC = () => {
  const { showToast } = useIMS();
  const [activeMainTab, setActiveMainTab] = useState<'events' | 'timetable'>('events');

  // Events State
  const [filterType, setFilterType] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  // Timetable State
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'>('Mon');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [timetableSearch, setTimetableSearch] = useState<string>('');

  // Master Timetable Slots Data
  const masterTimetable: TimetableSlot[] = [
    { id: 'tt-1', day: 'Mon', time: '08:00 AM – 09:00 AM', grade: 'Class 10', section: 'A', subject: 'Mathematics (Calculus)', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', type: 'Theory', status: 'Completed' },
    { id: 'tt-2', day: 'Mon', time: '09:15 AM – 10:15 AM', grade: 'Class 10', section: 'A', subject: 'Physics (Optics & Ray Diagrams)', teacher: 'Dr. Neha Kulkarni', room: 'Lab 2', type: 'Lab', status: 'Completed' },
    { id: 'tt-3', day: 'Mon', time: '10:30 AM – 11:30 AM', grade: 'Class 10', section: 'B', subject: 'Chemistry (Chemical Bonding)', teacher: 'Prof. Amit Verma', room: 'Hall 102', type: 'Theory', status: 'Completed' },
    { id: 'tt-4', day: 'Mon', time: '11:45 AM – 12:45 PM', grade: 'Class 9', section: 'A', subject: 'Mathematics (Polynomials)', teacher: 'Prof. Rajesh Sharma', room: 'Room 204', type: 'Theory', status: 'In Progress' },
    { id: 'tt-5', day: 'Mon', time: '01:15 PM – 02:15 PM', grade: 'Class 11', section: 'PCM', subject: 'Advanced Physics (Mechanics)', teacher: 'Dr. Neha Kulkarni', room: 'Senior Lab', type: 'Lab', status: 'Upcoming' },
    { id: 'tt-6', day: 'Mon', time: '02:15 PM – 03:00 PM', grade: 'Class 8', section: 'A', subject: 'General Science & Biology', teacher: 'Dr. Priya Nair', room: 'Junior 108', type: 'Theory', status: 'Upcoming' },

    { id: 'tt-7', day: 'Tue', time: '08:00 AM – 09:00 AM', grade: 'Class 10', section: 'B', subject: 'Mathematics (Trigonometry)', teacher: 'Prof. Rajesh Sharma', room: 'Hall 102', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-8', day: 'Tue', time: '09:15 AM – 10:15 AM', grade: 'Class 10', section: 'A', subject: 'Chemistry (Organic Reactions)', teacher: 'Prof. Amit Verma', room: 'Chemistry Lab', type: 'Lab', status: 'Upcoming' },
    { id: 'tt-9', day: 'Tue', time: '10:30 AM – 11:30 AM', grade: 'Class 9', section: 'B', subject: 'English Grammar & Writing', teacher: 'Mrs. Sunita Rao', room: 'Room 205', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-10', day: 'Tue', time: '11:45 AM – 12:45 PM', grade: 'Class 12', section: 'PCM', subject: 'Physics (Electromagnetism)', teacher: 'Dr. Neha Kulkarni', room: 'Hall 301', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-11', day: 'Tue', time: '01:15 PM – 02:15 PM', grade: 'Class 8', section: 'B', subject: 'Mathematics (Algebra)', teacher: 'Prof. Rajesh Sharma', room: 'Junior 109', type: 'Theory', status: 'Upcoming' },

    { id: 'tt-12', day: 'Wed', time: '08:00 AM – 09:00 AM', grade: 'Class 10', section: 'A', subject: 'Biology (Genetics & Life Systems)', teacher: 'Dr. Priya Nair', room: 'Biology Lab', type: 'Lab', status: 'Upcoming' },
    { id: 'tt-13', day: 'Wed', time: '09:15 AM – 10:15 AM', grade: 'Class 10', section: 'B', subject: 'Physics (Electricity & Circuits)', teacher: 'Dr. Neha Kulkarni', room: 'Hall 102', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-14', day: 'Wed', time: '10:30 AM – 11:30 AM', grade: 'Class 9', section: 'A', subject: 'Chemistry (Atomic Structure)', teacher: 'Prof. Amit Verma', room: 'Room 204', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-15', day: 'Wed', time: '11:45 AM – 12:45 PM', grade: 'Class 10', section: 'A', subject: 'Mathematics (Coordinate Geometry)', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-16', day: 'Wed', time: '01:15 PM – 02:15 PM', grade: 'Class 11', section: 'PCM', subject: 'Chemistry (Chemical Equilibrium)', teacher: 'Prof. Amit Verma', room: 'Senior Lab', type: 'Lab', status: 'Upcoming' },

    { id: 'tt-17', day: 'Thu', time: '08:00 AM – 09:00 AM', grade: 'Class 10', section: 'A', subject: 'Computer Science (Python & Logic)', teacher: 'Dr. Priya Nair', room: 'Computer Lab 1', type: 'Lab', status: 'Upcoming' },
    { id: 'tt-18', day: 'Thu', time: '09:15 AM – 10:15 AM', grade: 'Class 9', section: 'B', subject: 'Social Studies & History', teacher: 'Mrs. Sunita Rao', room: 'Room 205', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-19', day: 'Thu', time: '10:30 AM – 11:30 AM', grade: 'Class 10', section: 'B', subject: 'Mathematics (Surface Areas)', teacher: 'Prof. Rajesh Sharma', room: 'Hall 102', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-20', day: 'Thu', time: '11:45 AM – 12:45 PM', grade: 'Class 8', section: 'A', subject: 'English Literature', teacher: 'Mrs. Sunita Rao', room: 'Junior 108', type: 'Theory', status: 'Upcoming' },

    { id: 'tt-21', day: 'Fri', time: '08:00 AM – 09:00 AM', grade: 'Class 10', section: 'A', subject: 'Mathematics (Problem Doubt Clinic)', teacher: 'Prof. Rajesh Sharma', room: 'Hall 101', type: 'Tutorial', status: 'Upcoming' },
    { id: 'tt-22', day: 'Fri', time: '09:15 AM – 10:15 AM', grade: 'Class 10', section: 'B', subject: 'Physics (Sound & Wave Optics)', teacher: 'Dr. Neha Kulkarni', room: 'Hall 102', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-23', day: 'Fri', time: '10:30 AM – 11:30 AM', grade: 'Class 12', section: 'PCM', subject: 'Chemistry (Electrochemistry)', teacher: 'Prof. Amit Verma', room: 'Hall 301', type: 'Theory', status: 'Upcoming' },
    { id: 'tt-24', day: 'Fri', time: '11:45 AM – 12:45 PM', grade: 'Class 9', section: 'A', subject: 'Biology (Tissue Systems)', teacher: 'Dr. Priya Nair', room: 'Room 204', type: 'Theory', status: 'Upcoming' },

    { id: 'tt-25', day: 'Sat', time: '08:30 AM – 10:30 AM', grade: 'Class 10', section: 'A', subject: 'Weekly Cumulative Mock Examination', teacher: 'All Faculty', room: 'Examination Hall', type: 'Tutorial', status: 'Upcoming' },
    { id: 'tt-26', day: 'Sat', time: '11:00 AM – 01:00 PM', grade: 'Class 10', section: 'B', subject: 'Weekly Cumulative Mock Examination', teacher: 'All Faculty', room: 'Examination Hall', type: 'Tutorial', status: 'Upcoming' }
  ];

  // Category Distribution Pie data
  const categoryPieData = useMemo(() => {
    const counts = { Academic: 0, Sports: 0, Cultural: 0, Examination: 0, Workshop: 0 };
    academicEvents.forEach(e => {
      counts[e.category]++;
    });

    return [
      { name: 'Academic', value: counts.Academic, color: '#0056D6' },
      { name: 'Cultural', value: counts.Cultural, color: '#7C3AED' },
      { name: 'Sports', value: counts.Sports, color: '#00C853' },
      { name: 'Examination', value: counts.Examination, color: '#F57C00' },
      { name: 'Workshop / AI', value: counts.Workshop, color: '#0284C7' }
    ];
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return academicEvents.filter(e => {
      const matchType = filterType === 'All' || e.type === filterType;
      const matchCategory = selectedCategory === 'All' || e.category === selectedCategory;
      return matchType && matchCategory;
    });
  }, [filterType, selectedCategory]);

  // Filter timetable
  const filteredTimetable = useMemo(() => {
    return masterTimetable.filter(slot => {
      const matchDay = slot.day === selectedDay;
      const matchClass = selectedClassFilter === 'All' || slot.grade === selectedClassFilter;
      const matchSearch =
        slot.subject.toLowerCase().includes(timetableSearch.toLowerCase()) ||
        slot.teacher.toLowerCase().includes(timetableSearch.toLowerCase()) ||
        slot.room.toLowerCase().includes(timetableSearch.toLowerCase());
      return matchDay && matchClass && matchSearch;
    });
  }, [masterTimetable, selectedDay, selectedClassFilter, timetableSearch]);

  const handleToggleRegister = (id: string) => {
    if (registeredEvents.includes(id)) {
      setRegisteredEvents(registeredEvents.filter(eId => eId !== id));
      showToast('Registration cancelled.');
    } else {
      setRegisteredEvents([...registeredEvents, id]);
      showToast('Successfully registered for this event.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Unified Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0E274A] to-[#0A192F] rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 font-mono font-bold text-xs uppercase tracking-wider border border-blue-500/30">
              Campus Schedule & Milestones
            </span>
            <span className="text-xs text-slate-400">Academic Year 2025–26</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            <span>Event and Time table</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Unified scheduling dashboard combining institutional milestones, sports, competitions, alongside the daily master timetable.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveMainTab('events')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMainTab === 'events'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Campus Events ({academicEvents.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('timetable')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMainTab === 'timetable'
                ? 'bg-[#0056D6] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Master Timetable</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: CAMPUS EVENTS */}
      {activeMainTab === 'events' && (
        <div className="space-y-6">
          {/* Graphical Representation Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs lg:col-span-1">
              <InteractivePieChart
                title="Event Category Distribution"
                subtitle="Campus calendar event domain breakdown"
                data={categoryPieData}
                centerLabel="Total Events"
                centerValue={academicEvents.length}
                size={180}
              />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Co-Curricular Engagement & Participation
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Over 2,850 cumulative attendees recorded across athletic, scientific, and cultural milestones this academic session.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <span className="text-[11px] text-blue-600 font-medium">Upcoming Events</span>
                  <div className="text-xl font-black text-blue-700 dark:text-blue-300">
                    {academicMetrics.upcomingEventsCount}
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="text-[11px] text-emerald-600 font-medium">Completed Milestones</span>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                    {academicMetrics.pastEventsCount}
                  </div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-100 dark:border-purple-900/40">
                  <span className="text-[11px] text-purple-600 font-medium">Student Attendees</span>
                  <div className="text-xl font-black text-purple-700 dark:text-purple-300">
                    2,850+
                  </div>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-100 dark:border-amber-900/40">
                  <span className="text-[11px] text-amber-600 font-medium">Awards & Citations</span>
                  <div className="text-xl font-black text-amber-700 dark:text-amber-300">
                    124 Medals
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Timeline:</span>
              {(['All', 'Upcoming', 'Past'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filterType === t
                      ? 'bg-[#0056D6] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Domain:</span>
              {['All', 'Academic', 'Sports', 'Cultural', 'Examination', 'Workshop'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map(event => {
              const isRegistered = registeredEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          event.type === 'Upcoming'
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {event.type} Event
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        {event.date}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="mt-3.5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Participants: {event.targetAudience} ({event.attendeesCount} enrolled)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      Status: <strong className="text-blue-600 dark:text-blue-400 font-semibold">{event.status}</strong>
                    </span>
                    {event.type === 'Upcoming' && (
                      <button
                        type="button"
                        onClick={() => handleToggleRegister(event.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isRegistered
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-[#0056D6] hover:bg-blue-600 text-white'
                        }`}
                      >
                        {isRegistered ? 'Registered ✓' : 'Register / RSVP'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB 2: MASTER TIMETABLE */}
      {activeMainTab === 'timetable' && (
        <div className="space-y-6">
          {/* Day Selector and Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Days of Week */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const).map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDay === day
                      ? 'bg-[#0056D6] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {day}day
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedClassFilter}
                onChange={e => setSelectedClassFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="All">All Grades (8–12)</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter subject, teacher, room..."
                  value={timetableSearch}
                  onChange={e => setTimetableSearch(e.target.value)}
                  className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Timetable Schedule List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{selectedDay}day Master Schedule ({filteredTimetable.length} periods active)</span>
                </h3>
                <span className="text-xs text-slate-500">Regular campus teaching timetable · 45 & 60 min slots</span>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-mono font-bold">
                Normal Operations Active
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTimetable.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No scheduled lecture slots matching the selected criteria.
                </div>
              ) : (
                filteredTimetable.map(slot => (
                  <div key={slot.id} className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start md:items-center gap-3">
                      <div className="w-24 shrink-0 font-mono text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.time.split('–')[0]}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {slot.subject}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                            {slot.grade} - {slot.section}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            slot.type === 'Lab' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {slot.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-slate-400" />
                            Faculty: <strong className="text-slate-700 dark:text-slate-300">{slot.teacher}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {slot.room}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          slot.status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200'
                            : slot.status === 'In Progress'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
