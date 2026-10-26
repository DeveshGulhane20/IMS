import React from 'react';
import { Flame, Atom, CheckCircle2, Award, Star, Trophy, Sparkles } from 'lucide-react';
import { Badge } from '../../types/ims';

interface BadgeShowcaseProps {
  badges: Badge[];
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-indigo-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-teal-500" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      default:
        return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {badges.map(b => (
        <div
          key={b.id}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C44] flex items-start gap-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            {getIcon(b.icon)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {b.name}
              </h4>
              <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                +{b.points} XP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              {b.description}
            </p>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Earned</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{b.earnedAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
