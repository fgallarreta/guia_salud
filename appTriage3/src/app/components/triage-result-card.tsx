import React from 'react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { TriageLevel, TriageBadge, triageConfig } from './triage-badge';

interface TriageResultCardProps {
  level: TriageLevel;
  explanation: string;
  nextSteps: string[];
  ctaLabel: string;
  onCtaClick: () => void;
  className?: string;
}

export function TriageResultCard({
  level,
  explanation,
  nextSteps,
  ctaLabel,
  onCtaClick,
  className,
}: TriageResultCardProps) {
  const config = triageConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-6 space-y-6',
        config.bgClass,
        config.borderClass,
        className
      )}
    >
      {/* Header with icon and badge */}
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center',
            config.textClass,
            'bg-white/50 dark:bg-black/20'
          )}
        >
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <TriageBadge level={level} showIcon={false} />
          <h3 className={cn('mt-2', config.textClass)}>{config.description}</h3>
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">Explicación</h4>
        <p className="text-sm text-foreground/80">{explanation}</p>
      </div>

      {/* Next steps */}
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground">Próximos pasos</h4>
        <ul className="space-y-2">
          {nextSteps.map((step, index) => (
            <li key={index} className="flex gap-2 text-sm text-foreground/80">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/70 dark:bg-black/20 flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <span className="flex-1">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onCtaClick}
        className="w-full min-h-[var(--touch-target-min)]"
        size="lg"
        variant={level === 'red' ? 'destructive' : 'default'}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
