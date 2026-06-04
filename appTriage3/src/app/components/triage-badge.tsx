import React from 'react';
import { cn } from './ui/utils';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export type TriageLevel = 'green' | 'yellow' | 'red';

interface TriageBadgeProps {
  level: TriageLevel;
  className?: string;
  showIcon?: boolean;
}

const triageConfig = {
  green: {
    label: 'Autocuidado',
    description: 'Situación de baja urgencia',
    icon: CheckCircle2,
    bgClass: 'bg-[var(--triage-green-bg)] dark:bg-[var(--triage-green-bg)]',
    textClass: 'text-[var(--triage-green)] dark:text-[var(--triage-green)]',
    borderClass: 'border-[var(--triage-green-border)] dark:border-[var(--triage-green-border)]',
  },
  yellow: {
    label: 'Consulta médica',
    description: 'Requiere evaluación profesional',
    icon: AlertCircle,
    bgClass: 'bg-[var(--triage-yellow-bg)] dark:bg-[var(--triage-yellow-bg)]',
    textClass: 'text-[var(--triage-yellow)] dark:text-[var(--triage-yellow)]',
    borderClass: 'border-[var(--triage-yellow-border)] dark:border-[var(--triage-yellow-border)]',
  },
  red: {
    label: 'Atención inmediata',
    description: 'Posible urgencia médica',
    icon: AlertTriangle,
    bgClass: 'bg-[var(--triage-red-bg)] dark:bg-[var(--triage-red-bg)]',
    textClass: 'text-[var(--triage-red)] dark:text-[var(--triage-red)]',
    borderClass: 'border-[var(--triage-red-border)] dark:border-[var(--triage-red-border)]',
  },
};

export function TriageBadge({ level, className, showIcon = true }: TriageBadgeProps) {
  const config = triageConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border',
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      <span className="font-medium text-sm">{config.label}</span>
    </div>
  );
}

export { triageConfig };
