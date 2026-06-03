import { SeverityLevel, TriageResult, HealthLocation } from '../types';
import { healthLocations, calculateDistance } from '../data/locations';

export function calculateSeverity(totalPoints: number): SeverityLevel {
  if (totalPoints >= 30) return 'red';
  if (totalPoints >= 18) return 'orange';
  if (totalPoints >= 8) return 'yellow';
  return 'green';
}

export function getTriageResult(
  severity: SeverityLevel,
  userLat: number = -37.3250,
  userLng: number = -59.1365
): TriageResult {
  // Calcular distancias
  const locationsWithDistance = healthLocations.map(loc => ({
    ...loc,
    distance: calculateDistance(userLat, userLng, loc.lat, loc.lng)
  }));

  switch (severity) {
    case 'red':
      return {
        severity: 'red',
        title: '🚨 EMERGENCIA',
        description: 'Necesitas atención médica INMEDIATA. Dirígete al hospital más cercano o llama a emergencias.',
        action: 'Llamar Emergencia AHORA',
        locations: locationsWithDistance
          .filter(loc => loc.type === 'hospital' || loc.type === 'emergency')
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 3),
        recommendations: [
          'No esperes, busca atención inmediata',
          'Si estás solo, pide ayuda a alguien cercano',
          'Mantén la calma y sigue las instrucciones médicas',
          'No conduzcas tú mismo si es posible'
        ]
      };

    case 'orange':
      return {
        severity: 'orange',
        title: '⚠️ URGENTE',
        description: 'Debes buscar atención médica pronto. Ve a una guardia o consulta con un médico en las próximas horas.',
        action: 'Buscar Atención Médica',
        locations: locationsWithDistance
          .filter(loc => loc.type === 'hospital' || loc.type === 'clinic')
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 4),
        recommendations: [
          'Consulta con un médico en las próximas 2-4 horas',
          'No ignores los síntomas',
          'Mantente hidratado',
          'Evita esfuerzos físicos',
          'Monitorea tu estado de salud'
        ]
      };

    case 'yellow':
      return {
        severity: 'yellow',
        title: '💛 CONSULTA MÉDICA',
        description: 'Programa una cita con tu médico. No es urgente, pero es importante que recibas atención profesional.',
        action: 'Programar Cita Médica',
        locations: locationsWithDistance
          .filter(loc => loc.type === 'clinic')
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 4),
        recommendations: [
          'Agenda una cita médica en los próximos días',
          'Lleva un registro de tus síntomas',
          'Mantén buenos hábitos de salud',
          'Descansa lo suficiente',
          'Mantente hidratado'
        ],
        medications: [
          'Paracetamol (para dolor leve/fiebre)',
          'Ibuprofeno (para inflamación)',
          'Consulta con farmacéutico para más información'
        ]
      };

    case 'green':
      return {
        severity: 'green',
        title: '✅ AUTOCUIDADO',
        description: 'Puedes manejar estos síntomas en casa con autocuidado. Si empeoran, consulta a un médico.',
        action: 'Ver Recomendaciones',
        locations: locationsWithDistance
          .filter(loc => loc.type === 'pharmacy')
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 5),
        recommendations: [
          'Descansa lo suficiente',
          'Mantente bien hidratado',
          'Lleva una dieta saludable',
          'Evita actividades extenuantes',
          'Monitorea tus síntomas',
          'Si empeoran, busca atención médica'
        ],
        medications: [
          'Paracetamol (500-1000mg cada 6-8 horas)',
          'Ibuprofeno (400mg cada 8 horas con alimentos)',
          'Antihistamínicos (si hay alergias)',
          'Vitamina C para reforzar el sistema inmune',
          'Hidratación constante (agua, té, caldos)'
        ]
      };
  }
}

export const severityColors = {
  red: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700',
    button: 'bg-red-600 hover:bg-red-700',
    badge: 'bg-red-100 text-red-800'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-500',
    text: 'text-orange-700',
    button: 'bg-orange-600 hover:bg-orange-700',
    badge: 'bg-orange-100 text-orange-800'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    button: 'bg-yellow-600 hover:bg-yellow-700',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700',
    badge: 'bg-green-100 text-green-800'
  }
};
