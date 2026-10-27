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
  Tag
} from 'lucide-react';
import { academicEvents, academicMetrics } from '../../data/mockAcademicData';
import { AcademicEvent } from '../../types/academic';
import { InteractivePieChart } from '../charts/InteractivePieChart';

export const AveriqEventsCalendar: React.FC = () => {
  const [filterType, setFilterType] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

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

  const handleToggleRegister = (id: string) => {
    if (registeredEvents.includes(id)) {
      setRegisteredEvents(registeredEvents.filter(eId => eId !== id));
    } else {
      setRegisteredEvents([...registeredEvents, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Academic Events, Sports & Cultural Calendar</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              {academicEvents.length} Events (Past & Upcoming)
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Campus championships, science olympiads, PTM sessions, pre-board mocks, and annual festivals
          </p>
        </div>
      </div>

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

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'All', label: 'All Events (10)' },
            { id: 'Upcoming', label: 'Upcoming (5)' },
            { id: 'Past', label: 'Past Completed (5)' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0">Category:</span>
          {['All', 'Academic', 'Sports', 'Cultural', 'Examination', 'Workshop'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map(event => {
          const isRegistered = registeredEvents.includes(event.id);
          const isPast = event.type === 'Past';

          return (
            <div
              key={event.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-xs flex flex-col justify-between ${
                isPast
                  ? 'border-slate-200/90 dark:border-slate-800 opacity-95'
                  : 'border-blue-200/80 dark:border-blue-900/60 ring-1 ring-blue-500/10 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Header with Type & Category */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      event.category === 'Academic'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : event.category === 'Cultural'
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : event.category === 'Sports'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : event.category === 'Examination'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300'
                    }`}
                  >
                    {event.category}
                  </span>

                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isPast
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* Details (Date, Time, Venue) */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold">{event.date}</span>
                    {event.endDate && <span className="text-slate-400">to {event.endDate}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Target: {event.targetAudience} ({event.attendeesCount} Expected)</span>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Highlights & Notes:</span>
                  <ul className="space-y-1">
                    {event.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              {!isPast && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Free Entry for Enrolled Families</span>
                  <button
                    type="button"
                    onClick={() => handleToggleRegister(event.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isRegistered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isRegistered ? '✓ Registered' : 'RSVP / Register'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
