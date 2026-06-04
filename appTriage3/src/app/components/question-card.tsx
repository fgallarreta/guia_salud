import React from 'react';
import { cn } from './ui/utils';
import { LucideIcon } from 'lucide-react';

interface QuestionCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function QuestionCard({
  icon: Icon,
  title,
  description,
  selected = false,
  disabled = false,
  onClick,
  className,
}: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styles
        'w-full min-h-[var(--touch-target-min)] p-4 rounded-lg border-2 transition-all duration-200',
        'flex items-start gap-3 text-left',
        // Default state
        'bg-card border-border hover:border-primary/50 hover:shadow-sm',
        // Selected state
        selected && 'border-primary bg-primary/5 shadow-md',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:shadow-none',
        // Focus state (accessibility)
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground">{title}</h4>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
    </button>
  );
}
