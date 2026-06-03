import { HealthLocation } from '../types';

// Ubicaciones de salud en Tandil, Buenos Aires, Argentina
export const healthLocations: HealthLocation[] = [
  // Hospitales
  {
    id: 'hosp-1',
    name: 'Hospital Municipal Ramón Santamarina',
    type: 'hospital',
    address: 'Av. Buzón 1224, Tandil, Buenos Aires',
    lat: -37.3213,
    lng: -59.1349,
    phone: '(0249) 442-5555',
    hours: '24 horas',
    hasEmergency: true
  },
  {
    id: 'hosp-2',
    name: 'Clínica del Niño y la Madre',
    type: 'hospital',
    address: 'Chacabuco 851, Tandil, Buenos Aires',
    lat: -37.3245,
    lng: -59.1420,
    phone: '(0249) 444-2500',
    hours: '24 horas',
    hasEmergency: true
  },
  
  // Clínicas
  {
    id: 'clinic-1',
    name: 'Clínica San Miguel',
    type: 'clinic',
    address: 'San Martín 785, Tandil, Buenos Aires',
    lat: -37.3268,
    lng: -59.1387,
    phone: '(0249) 442-3456',
    hours: 'Lun-Vie 8:00-20:00, Sáb 9:00-13:00'
  },
  {
    id: 'clinic-2',
    name: 'Centro Médico Tandil',
    type: 'clinic',
    address: 'Av. Avellaneda 950, Tandil, Buenos Aires',
    lat: -37.3195,
    lng: -59.1325,
    phone: '(0249) 443-7890',
    hours: 'Lun-Vie 7:30-20:00'
  },
  {
    id: 'clinic-3',
    name: 'Sanatorio Tandil',
    type: 'clinic',
    address: 'Rodríguez 1050, Tandil, Buenos Aires',
    lat: -37.3280,
    lng: -59.1450,
    phone: '(0249) 442-8900',
    hours: '24 horas',
    hasEmergency: true
  },
  {
    id: 'clinic-4',
    name: 'Centro de Salud Norte',
    type: 'clinic',
    address: 'Garibaldi 1450, Tandil, Buenos Aires',
    lat: -37.3105,
    lng: -59.1280,
    phone: '(0249) 443-2100',
    hours: 'Lun-Vie 8:00-16:00'
  },
  
  // Farmacias
  {
    id: 'pharm-1',
    name: 'Farmacia del Centro',
    type: 'pharmacy',
    address: '9 de Julio 555, Tandil, Buenos Aires',
    lat: -37.3250,
    lng: -59.1365,
    phone: '(0249) 442-1234',
    hours: 'Lun-Sáb 8:00-22:00'
  },
  {
    id: 'pharm-2',
    name: 'Farmacia San Roque',
    type: 'pharmacy',
    address: 'Pinto 850, Tandil, Buenos Aires',
    lat: -37.3290,
    lng: -59.1410,
    phone: '(0249) 443-5678',
    hours: '24 horas'
  },
  {
    id: 'pharm-3',
    name: 'Farmacia Nueva',
    type: 'pharmacy',
    address: 'Av. España 1200, Tandil, Buenos Aires',
    lat: -37.3180,
    lng: -59.1295,
    phone: '(0249) 444-9012',
    hours: 'Lun-Dom 7:00-23:00'
  },
  {
    id: 'pharm-4',
    name: 'Farmacia Belgrano',
    type: 'pharmacy',
    address: 'Belgrano 670, Tandil, Buenos Aires',
    lat: -37.3238,
    lng: -59.1378,
    phone: '(0249) 442-7890',
    hours: 'Lun-Vie 8:30-20:30'
  },
  
  // Emergencias
  {
    id: 'emer-1',
    name: 'Servicio de Emergencias SAME Tandil',
    type: 'emergency',
    address: 'Base Central - Av. Buzón s/n, Tandil',
    lat: -37.3220,
    lng: -59.1360,
    phone: '107',
    hours: '24 horas'
  }
];

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
