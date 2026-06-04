import React from 'react';
import { Button } from '../components/ui/button';
import { TriageResultCard } from '../components/triage-result-card';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export function TriageResult() {
  const navigate = useNavigate();

  // Mock result - in real app this would come from evaluation
  const result = {
    level: 'yellow' as const,
    explanation:
      'Basándonos en tus síntomas, recomendamos que consultes con un profesional médico en las próximas 24-48 horas. No parece ser una emergencia inmediata, pero es importante que recibas una evaluación profesional.',
    nextSteps: [
      'Agenda una cita con tu médico de cabecera',
      'Monitorea tus síntomas y anota cualquier cambio',
      'Mantente hidratado y descansa',
      'Si los síntomas empeoran, busca atención inmediata',
    ],
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Resultado de evaluación</h1>
          <p className="text-sm text-muted-foreground">
            Basado en tus respuestas
          </p>
        </div>
      </div>

      {/* Result Card */}
      <TriageResultCard
        level={result.level}
        explanation={result.explanation}
        nextSteps={result.nextSteps}
        ctaLabel="Buscar centros médicos cercanos"
        onCtaClick={() => navigate('/map')}
      />

      {/* Additional actions */}
      <div className="space-y-3">
        <h3 className="font-semibold">Otras acciones</h3>
        
        <Button
          variant="outline"
          className="w-full min-h-[var(--touch-target-min)]"
          onClick={() => navigate('/chat')}
        >
          Consultar con IA
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 min-h-[var(--touch-target-min)]"
          >
            <Download className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Button
            variant="outline"
            className="flex-1 min-h-[var(--touch-target-min)]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground">
        <p className="font-medium mb-1">Aviso importante:</p>
        <p>
          Esta evaluación es solo orientativa y no sustituye el diagnóstico médico profesional.
          Si sientes que tu condición es grave o empeora, busca atención médica inmediata o llama al 911.
        </p>
      </div>
    </div>
  );
}
