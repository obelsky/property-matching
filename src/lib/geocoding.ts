/**
 * Geocoding helper using OpenStreetMap Nominatim
 * S rate limitingem a cachingem
 */

interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Rate limiting - min 1s mezi requesty (Nominatim policy)
let lastGeocodingRequest = 0;
const MIN_DELAY_MS = 1000;

/**
 * Geocode adresu na souřadnice
 * DŮLEŽITÉ: Volat JEN při vytváření/úpravě záznamu, NIKDY v cyklu!
 */
export async function geocodeAddress(
  city: string,
  zipcode?: string | null,
  district?: string | null
): Promise<GeoLocation | null> {
  if (!city || city.trim() === "") {
    return null;
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastGeocodingRequest;
  if (timeSinceLastRequest < MIN_DELAY_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_DELAY_MS - timeSinceLastRequest)
    );
  }

  try {
    // Sestavit query
    const parts = [city.trim()];
    if (district) parts.push(district.trim());
    if (zipcode) parts.push(zipcode.trim());
    parts.push("Czech Republic"); // Předpokládáme ČR

    const query = parts.join(", ");

    // Nominatim API call
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1&countrycodes=cz`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "PropertyMatchingApp/1.0", // Povinné pro Nominatim
      },
    });

    lastGeocodingRequest = Date.now();

    if (!response.ok) {
      console.error("Geocoding failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    }

    console.log("Geocoding: no results for", query);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Haversine formula - vypočítá vzdálenost mezi dvěma body v km
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius Země v km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Zaokrouhli na 1 desetinné místo
  return Math.round(distance * 10) / 10;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Zkontroluje jestli jsou dva záznamy v povoleném rádiusu
 */
export function isWithinRadius(
  lat1: number | null,
  lon1: number | null,
  lat2: number | null,
  lon2: number | null,
  radiusKm: number
): { within: boolean; distance: number | null } {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return { within: false, distance: null };
  }

  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return {
    within: distance <= radiusKm,
    distance,
  };
}
