export type SeverityLevel = 'red' | 'orange' | 'yellow' | 'green';

export interface Symptom {
  id: string;
  text: string;
  severity: SeverityLevel;
}

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    points: number;
  }[];
}

export interface HealthLocation {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'emergency';
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  phone?: string;
  hours?: string;
  hasEmergency?: boolean;
}

export interface TriageResult {
  severity: SeverityLevel;
  title: string;
  description: string;
  action: string;
  locations: HealthLocation[];
  recommendations: string[];
  medications?: string[];
}

export interface SymptomHistory {
  id: string;
  date: Date;
  symptoms: string[];
  severity: SeverityLevel;
  result: string;
}
