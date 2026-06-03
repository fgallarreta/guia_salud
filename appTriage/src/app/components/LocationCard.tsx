import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { HealthLocation } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface LocationCardProps {
  location: HealthLocation;
  onGetDirections?: () => void;
}

export function LocationCard({ location, onGetDirections }: LocationCardProps) {
  const typeLabels = {
    hospital: 'Hospital',
    clinic: 'Clínica',
    pharmacy: 'Farmacia',
    emergency: 'Emergencia'
  };

  const typeColors = {
    hospital: 'bg-red-100 text-red-800',
    clinic: 'bg-blue-100 text-blue-800',
    pharmacy: 'bg-green-100 text-green-800',
    emergency: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-1 rounded-full ${typeColors[location.type]}`}>
              {typeLabels[location.type]}
            </span>
            {location.hasEmergency && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                24hs
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">{location.name}</h3>
        </div>
        {location.distance && (
          <span className="text-sm font-semibold text-blue-600">
            {location.distance.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{location.address}</span>
        </div>
        {location.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <a href={`tel:${location.phone}`} className="text-blue-600 hover:underline">
              {location.phone}
            </a>
          </div>
        )}
        {location.hours && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{location.hours}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {location.phone && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.open(`tel:${location.phone}`)}
          >
            <Phone className="w-4 h-4 mr-1" />
            Llamar
          </Button>
        )}
        <Button
          size="sm"
          className="flex-1"
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
            window.open(url, '_blank');
          }}
        >
          <Navigation className="w-4 h-4 mr-1" />
          Cómo llegar
        </Button>
      </div>
    </Card>
  );
}
