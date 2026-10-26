import React from 'react';
import { SeverityLevel } from '../../types/ims';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface AtRiskBadgeProps {
  severity: SeverityLevel;
  category: string;
}

export const AtRiskBadge: React.FC<AtRiskBadgeProps> = ({ severity, category }) => {
  const getSeverityStyle = () => {
    switch (severity) {
      case 'CRITICAL':
        return {
          textColor: 'text-rose-700 dark:text-rose-400',
          borderColor: 'border-rose-200 dark:border-rose-900/60',
          bgColor: 'bg-rose-50 dark:bg-rose-950/40',
          icon: ShieldAlert
        };
      case 'HIGH':
        return {
          textColor: 'text-amber-700 dark:text-amber-400',
          borderColor: 'border-amber-200 dark:border-amber-900/60',
          bgColor: 'bg-amber-50 dark:bg-amber-950/40',
          icon: AlertTriangle
        };
      case 'MEDIUM':
        return {
          textColor: 'text-yellow-700 dark:text-yellow-400',
          borderColor: 'border-yellow-200 dark:border-yellow-900/60',
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/40',
          icon: AlertCircle
        };
      case 'LOW':
      default:
        return {
          textColor: 'text-blue-700 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-900/60',
          bgColor: 'bg-blue-50 dark:bg-blue-950/40',
          icon: Info
        };
    }
  };

  const style = getSeverityStyle();
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${style.bgColor} ${style.borderColor} ${style.textColor}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{severity}</span>
      <span aria-hidden="true" className="opacity-40">·</span>
      <span className="font-normal opacity-90">{category.replace('_', ' ')}</span>
    </span>
  );
};
