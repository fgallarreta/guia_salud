import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MedicalFacilityCard } from '../components/medical-facility-card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, MapPin, Navigation2 } from 'lucide-react';

const mockFacilities = [
  {
    id: 1,
    name: 'Hospital General Central',
    type: 'hospital' as const,
    distance: '1.2 km',
    address: 'Av. Principal 123, Centro',
    hours: 'Abierto 24 horas',
    status: 'open' as const,
    phone: '+1234567890',
  },
  {
    id: 2,
    name: 'Centro de Salud Norte',
    type: 'clinic' as const,
    distance: '0.8 km',
    address: 'Calle Norte 456',
    hours: '8:00 - 20:00',
    status: 'open' as const,
    phone: '+1234567891',
  },
  {
    id: 3,
    name: 'Farmacia San José',
    type: 'pharmacy' as const,
    distance: '0.5 km',
    address: 'Av. San José 789',
    hours: '7:00 - 22:00',
    status: 'closing-soon' as const,
    phone: '+1234567892',
  },
  {
    id: 4,
    name: 'Clínica Especializada',
    type: 'clinic' as const,
    distance: '2.1 km',
    address: 'Calle Especialistas 321',
    hours: '9:00 - 18:00',
    status: 'closed' as const,
    phone: '+1234567893',
  },
];

export function Map() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredFacilities = mockFacilities.filter((facility) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || facility.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Centros médicos</h1>
          <p className="text-sm text-muted-foreground">
            Encuentra atención médica cerca de ti
          </p>
        </div>

        {/* Location indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Tu ubicación actual</span>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Navigation2 className="w-3 h-3 mr-1" />
            Actualizar
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="hospital">Hospitales</TabsTrigger>
          <TabsTrigger value="clinic">Clínicas</TabsTrigger>
          <TabsTrigger value="pharmacy">Farmacias</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredFacilities.length} resultados encontrados
        </p>
      </div>

      {/* Results list */}
      <div className="space-y-3">
        {filteredFacilities.length > 0 ? (
          filteredFacilities.map((facility) => (
            <MedicalFacilityCard
              key={facility.id}
              name={facility.name}
              type={facility.type}
              distance={facility.distance}
              address={facility.address}
              hours={facility.hours}
              status={facility.status}
              phone={facility.phone}
              onNavigate={() => console.log('Navigate to', facility.name)}
              onCall={() => console.log('Call', facility.phone)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No se encontraron resultados</p>
          </div>
        )}
      </div>

      {/* Emergency notice */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-sm font-medium text-destructive mb-1">En caso de emergencia</p>
        <p className="text-xs text-destructive/80 mb-3">
          Si tienes una emergencia médica, llama inmediatamente al 911
        </p>
        <Button variant="destructive" className="w-full min-h-[var(--touch-target-min)]">
          Llamar al 911
        </Button>
      </div>
    </div>
  );
}
