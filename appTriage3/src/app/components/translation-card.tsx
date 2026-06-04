import React, { useState } from 'react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Copy, Volume2, Check } from 'lucide-react';

interface TranslationCardProps {
  localPhrase: string;
  translation: string;
  language?: string;
  onPlay?: () => void;
  className?: string;
}

export function TranslationCard({
  localPhrase,
  translation,
  language = 'ES',
  onPlay,
  className,
}: TranslationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 space-y-4 shadow-sm',
        className
      )}
    >
      {/* Original phrase */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Español</p>
        </div>
        <p className="text-foreground">{localPhrase}</p>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Translation */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{language}</p>
        </div>
        <p className="text-lg font-medium text-foreground">{translation}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex-1 min-h-[var(--touch-target-min)]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </>
          )}
        </Button>
        {onPlay && (
          <Button
            onClick={onPlay}
            variant="outline"
            size="sm"
            className="flex-1 min-h-[var(--touch-target-min)]"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Reproducir
          </Button>
        )}
      </div>
    </div>
  );
}
