import { SeverityLevel } from '../types';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const config = {
    red: {
      icon: AlertTriangle,
      text: 'Emergencia',
      bg: 'bg-red-100',
      text_color: 'text-red-800',
      border: 'border-red-300'
    },
    orange: {
      icon: AlertCircle,
      text: 'Urgente',
      bg: 'bg-orange-100',
      text_color: 'text-orange-800',
      border: 'border-orange-300'
    },
    yellow: {
      icon: Info,
      text: 'Consulta',
      bg: 'bg-yellow-100',
      text_color: 'text-yellow-800',
      border: 'border-yellow-300'
    },
    green: {
      icon: CheckCircle,
      text: 'Autocuidado',
      bg: 'bg-green-100',
      text_color: 'text-green-800',
      border: 'border-green-300'
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const { icon: Icon, text, bg, text_color, border } = config[severity];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bg} ${text_color} ${border} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      <span className="font-medium">{text}</span>
    </span>
  );
}
