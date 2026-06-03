import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Filter } from "lucide-react";
import { BottomTabBar } from "../components/BottomTabBar";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { fetchHealthLocations, HealthLocation } from "../services/overpass";

type FilterType = "all" | "hospital" | "clinic" | "pharmacy" | "emergency";

export function MapScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [locations, setLocations] = useState<HealthLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const userPosition: [number, number] = [-37.3213, -59.1349];

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchHealthLocations(userPosition[0], userPosition[1], 5000);
        if (active) setLocations(data);
      } catch (e) {
        console.error("Overpass error:", e);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const filteredLocations = useMemo(() => {
    if (filter === "all") return locations;
    return locations.filter((l) => l.type === filter);
  }, [locations, filter]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">

      {/* Header */}
      <div className="bg-white border-b p-3">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">Mapa de salud</h1>
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <TabsList className="grid grid-cols-4 w-full mt-2">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="hospital">Hosp</TabsTrigger>
            <TabsTrigger value="clinic">Clínicas</TabsTrigger>
            <TabsTrigger value="pharmacy">Farm</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* MAPA */}
      <div className="flex-1">
        <MapContainer
          center={userPosition}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />

          <Marker position={userPosition}>
            <Popup>Tu ubicación</Popup>
          </Marker>

          {filteredLocations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                {loc.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <BottomTabBar />
    </div>
  );
}