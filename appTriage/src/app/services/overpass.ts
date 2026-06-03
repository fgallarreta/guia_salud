export type HealthLocation = {
  id: string;
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "emergency";
  address?: string;
  lat: number;
  lng: number;
  phone?: string;
  hours?: string;
};

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

function mapType(amenity: string): HealthLocation["type"] {
  switch (amenity) {
    case "hospital":
      return "hospital";
    case "clinic":
      return "clinic";
    case "pharmacy":
      return "pharmacy";
    case "doctors":
      return "clinic";
    default:
      return "clinic";
  }
}

export async function fetchHealthLocations(
  lat: number,
  lng: number,
  radius = 5000
): Promise<HealthLocation[]> {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="pharmacy"](around:${radius},${lat},${lng});
      node["amenity"="doctors"](around:${radius},${lat},${lng});
    );
    out;
  `;

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
  });

  if (!res.ok) throw new Error("Overpass API error");

  const data = await res.json();

  return data.elements.map((el: any) => ({
    id: String(el.id),
    name: el.tags?.name || "Sin nombre",
    type: mapType(el.tags?.amenity),
    address:
      `${el.tags?.["addr:street"] || ""} ${el.tags?.["addr:housenumber"] || ""}`.trim() ||
      "Sin dirección",
    lat: el.lat,
    lng: el.lon,
    phone: el.tags?.phone,
    hours: el.tags?.opening_hours,
  }));
}