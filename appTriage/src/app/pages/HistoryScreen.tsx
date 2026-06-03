import { useState } from 'react';
import { Clock, Calendar, Trash2 } from 'lucide-react';
import { BottomTabBar } from '../components/BottomTabBar';
import { SeverityBadge } from '../components/SeverityBadge';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SeverityLevel } from '../types';

interface HistoryEntry {
  id: string;
  date: Date;
  time: string;
  severity: SeverityLevel;
  symptoms: string[];
  result: string;
}

// Datos de ejemplo
const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    date: new Date('2026-05-28'),
    time: '14:30',
    severity: 'yellow',
    symptoms: ['Dolor de cabeza moderado', 'Fiebre leve'],
    result: 'Consulta médica programada'
  },
  {
    id: '2',
    date: new Date('2026-05-15'),
    time: '09:15',
    severity: 'green',
    symptoms: ['Tos leve', 'Malestar general'],
    result: 'Autocuidado en casa'
  },
  {
    id: '3',
    date: new Date('2026-04-22'),
    time: '18:45',
    severity: 'orange',
    symptoms: ['Dolor abdominal severo', 'Náuseas'],
    result: 'Atención en guardia médica'
  }
];

export function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistory);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('es-AR', options);
  };

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">Historial</h1>
        <p className="text-sm text-gray-600 mt-1">
          Tus evaluaciones anteriores
        </p>
      </div>

      {/* Contenido */}
      <div className="px-6 py-6">
        {history.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-semibold text-gray-900 mb-2">
              No hay historial todavía
            </h2>
            <p className="text-sm text-gray-600">
              Tus evaluaciones de síntomas aparecerán aquí
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map(entry => (
              <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(entry.date)}</span>
                    <span className="text-gray-400">•</span>
                    <Clock className="w-4 h-4" />
                    <span>{entry.time}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <SeverityBadge severity={entry.severity} size="sm" />
                </div>

                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Síntomas reportados:
                  </h3>
                  <ul className="space-y-1">
                    {entry.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-[#1a3a5c] mt-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Resultado:</span> {entry.result}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <Card className="p-4 bg-blue-50 border-[#1a3a5c]/20">
              <p className="text-sm text-[#1a3a5c] text-center">
                💡 <strong>Tip:</strong> Mantén un registro de tus síntomas para compartir
                con tu médico en futuras consultas.
              </p>
            </Card>
          </div>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}
