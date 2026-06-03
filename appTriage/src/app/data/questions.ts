import { Question } from '../types';

export const triageQuestions: Question[] = [
  {
    id: 'q1',
    text: '¿Cómo describirías la intensidad de tu síntoma?',
    options: [
      { id: 'q1-a', text: 'Muy severo, insoportable', points: 10 },
      { id: 'q1-b', text: 'Moderado a severo', points: 7 },
      { id: 'q1-c', text: 'Moderado', points: 4 },
      { id: 'q1-d', text: 'Leve', points: 1 }
    ]
  },
  {
    id: 'q2',
    text: '¿Tienes dificultad para respirar?',
    options: [
      { id: 'q2-a', text: 'Sí, mucha dificultad', points: 10 },
      { id: 'q2-b', text: 'Un poco de dificultad', points: 5 },
      { id: 'q2-c', text: 'No tengo dificultad', points: 0 }
    ]
  },
  {
    id: 'q3',
    text: '¿Experimentas dolor en el pecho?',
    options: [
      { id: 'q3-a', text: 'Sí, dolor intenso', points: 10 },
      { id: 'q3-b', text: 'Molestia leve', points: 3 },
      { id: 'q3-c', text: 'No', points: 0 }
    ]
  },
  {
    id: 'q4',
    text: '¿Cuánto tiempo llevas con estos síntomas?',
    options: [
      { id: 'q4-a', text: 'Menos de 1 hora', points: 8 },
      { id: 'q4-b', text: 'Algunas horas', points: 5 },
      { id: 'q4-c', text: '1-2 días', points: 3 },
      { id: 'q4-d', text: 'Más de 2 días', points: 2 }
    ]
  },
  {
    id: 'q5',
    text: '¿Tienes fiebre?',
    options: [
      { id: 'q5-a', text: 'Sí, más de 39°C', points: 6 },
      { id: 'q5-b', text: 'Sí, entre 38-39°C', points: 4 },
      { id: 'q5-c', text: 'Fiebre leve (37.5-38°C)', points: 2 },
      { id: 'q5-d', text: 'No tengo fiebre', points: 0 }
    ]
  }
];
