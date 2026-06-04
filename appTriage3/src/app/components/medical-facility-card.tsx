import React from 'react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Phone, Navigation, Clock } from 'lucide-react';

type FacilityType = 'hospital' | 'clinic' | 'pharmacy';
type FacilityStatus = 'open' | 'closed' | 'closing-soon';

interface MedicalFacilityCardProps {
  name: string;
  type: FacilityType;
  distance: string;
  address?: string;
  hours?: string;
  status?: FacilityStatus;
  phone?: string;
  onNavigate?: () => void;
  onCall?: () => void;
  className?: string;
}

const facilityTypeLabels: Record<FacilityType, string> = {
  hospital: 'Hospital',
  clinic: 'Centro de Salud',
  pharmacy: 'Farmacia',
};

const statusConfig: Record<FacilityStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  open: { label: 'Abierto', variant: 'default' },
  closed: { label: 'Cerrado', variant: 'destructive' },
  'closing-soon': { label: 'Cierra pronto', variant: 'secondary' },
};

export function MedicalFacilityCard({
  name,
  type,
  distance,
  address,
  hours,
  status = 'open',
  phone,
  onNavigate,
  onCall,
  className,
}: MedicalFacilityCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 space-y-4 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{name}</h4>
            <p className="text-sm text-muted-foreground">{facilityTypeLabels[type]}</p>
          </div>
          {status && (
            <Badge variant={statusInfo.variant} className="flex-shrink-0">
              {statusInfo.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{distance}</span>
        </div>
        {address && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{address}</span>
          </div>
        )}
        {hours && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{hours}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onNavigate && (
          <Button
            onClick={onNavigate}
            className="flex-1 min-h-[var(--touch-target-min)]"
            variant="default"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navegar
          </Button>
        )}
        {onCall && phone && (
          <Button
            onClick={onCall}
            className="flex-1 min-h-[var(--touch-target-min)]"
            variant="outline"
          >
            <Phone className="w-4 h-4 mr-2" />
            Llamar
          </Button>
        )}
      </div>
    </div>
  );
}
