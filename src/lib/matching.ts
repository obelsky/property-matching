import { Listing, Request, MatchReasons } from "./types";
import { calculateDistance, isWithinRadius } from "./geocoding";

// Převod dispozice na číslo (1+kk=1, 2+kk=2, 3+1=3 atd.)
function layoutToNumber(layout: string | null): number {
  if (!layout) return 0;
  const match = layout.match(/^(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * NOVÁ MATCHING LOGIKA s hard gates
 * 
 * Hard gates:
 * 1. Typ musí být stejný
 * 2. Lokalita musí být v rádiusu (geo nebo fallback na city)
 * 
 * Scoring (0-100):
 * - Cena: 0-45
 * - Plocha: 0-25
 * - Dispozice: 0-20 (jen byt/dům)
 * - Lokalita: 0-10 (bonus podle vzdálenosti)
 */
export function calculateMatchScore(
  listing: Listing,
  request: Request
): { score: number; reasons: MatchReasons } {
  const reasons: MatchReasons = {};

  // ========================================
  // HARD GATE 1: TYP NEMOVITOSTI
  // ========================================
  if (listing.type !== request.type) {
    reasons.type = false;
    reasons.gate_failed = "type_mismatch";
    return { score: 0, reasons };
  }
  reasons.type = true;

  // ========================================
  // HARD GATE 2: LOKALITA / GEO RADIUS
  // ========================================
  const radiusKm = request.radius_km || 20;
  let distanceKm: number | null = null;
  let geoAvailable = false;

  // Pokud máme lat/lon, použij geocoding
  if (
    listing.latitude &&
    listing.longitude &&
    request.latitude &&
    request.longitude
  ) {
    const geoCheck = isWithinRadius(
      listing.latitude,
      listing.longitude,
      request.latitude,
      request.longitude,
      radiusKm
    );

    distanceKm = geoCheck.distance;
    geoAvailable = true;

    if (!geoCheck.within) {
      reasons.geo = "outside_radius";
      reasons.distance_km = distanceKm;
      reasons.radius_km = radiusKm;
      reasons.gate_failed = "location_radius";
      return { score: 0, reasons };
    }

    // V rádiusu
    reasons.geo = "within_radius";
    reasons.distance_km = distanceKm;
    reasons.radius_km = radiusKm;
  } else {
    // Fallback: kontrola city/district
    const cityMatch =
      listing.city.toLowerCase() === request.city.toLowerCase();
    const districtMatch =
      listing.district &&
      request.district &&
      listing.district.toLowerCase() === request.district.toLowerCase();

    if (!cityMatch && !districtMatch) {
      reasons.geo = "missing_fallback_city";
      reasons.gate_failed = "location_city";
      return { score: 0, reasons };
    }

    reasons.geo = cityMatch
      ? "missing_fallback_city_match"
      : "missing_fallback_district_match";
  }

  // ========================================
  // SCORING (gates prošly)
  // ========================================
  let score = 0;

  // ----------------------------------------
  // CENA (0-45 bodů)
  // ----------------------------------------
  if (listing.price && request.budget_max) {
    if (listing.price <= request.budget_max) {
      score += 45;
      reasons.price = "within_budget";
    } else if (listing.price <= request.budget_max * 1.1) {
      score += 20; // Do 10% nad
      reasons.price = "slightly_over";
    } else {
      score += 0;
      reasons.price = "over_budget";
    }
  } else {
    score += 10; // Tolerance pro missing
    reasons.price = "missing";
  }

  // ----------------------------------------
  // PLOCHA (0-25 bodů)
  // ----------------------------------------
  if (listing.area_m2 && request.area_min_m2) {
    if (listing.area_m2 >= request.area_min_m2) {
      score += 25;
      reasons.area = "sufficient";
    } else if (listing.area_m2 >= request.area_min_m2 * 0.9) {
      score += 12; // Do -10%
      reasons.area = "close";
    } else {
      score += 0;
      reasons.area = "insufficient";
    }
  } else {
    score += 8; // Tolerance
    reasons.area = "missing";
  }

  // ----------------------------------------
  // DISPOZICE (0-20 bodů) - jen byt/dům
  // ----------------------------------------
  if (listing.type === "byt" || listing.type === "dum") {
    if (listing.layout && request.layout_min) {
      const listingNum = layoutToNumber(listing.layout);
      const requestNum = layoutToNumber(request.layout_min);

      if (listingNum >= requestNum) {
        score += 20;
        reasons.layout = "match";
      } else if (listingNum === requestNum - 1) {
        score += 8; // O 1 menší
        reasons.layout = "close";
      } else {
        score += 0;
        reasons.layout = "insufficient";
      }
    } else {
      score += 6; // Tolerance
      reasons.layout = "n/a";
    }
  }

  // ----------------------------------------
  // LOKALITA BONUS (0-10 bodů)
  // ----------------------------------------
  if (geoAvailable && distanceKm !== null) {
    // Score podle vzdálenosti v rádiusu
    const locationScore = Math.round(
      10 * (1 - distanceKm / radiusKm)
    );
    const finalLocationScore = Math.max(0, Math.min(10, locationScore));
    score += finalLocationScore;
    reasons.distance_score = finalLocationScore;
  } else {
    // Fallback: city nebo district match
    if (reasons.geo === "missing_fallback_city_match") {
      score += 10; // Plný bonus pro same city
      reasons.city = true;
    } else if (reasons.geo === "missing_fallback_district_match") {
      score += 5; // Poloviční bonus pro same district
      reasons.district = true;
    }
  }

  return { score, reasons };
}

/**
 * Minimální score pro uložení matche do DB
 * Matches pod tímto score se neuloží (filtruje šum)
 */
const MIN_MATCH_SCORE = 40;

/**
 * Najde top N matches pro danou nabídku mezi všemi poptávkami
 * FILTRUJE matches pod MIN_MATCH_SCORE
 */
export function findTopMatchesForListing(
  listing: Listing,
  requests: Request[],
  topN: number = 10
): Array<{ request: Request; score: number; reasons: MatchReasons }> {
  const matches = requests
    .map((request) => {
      const { score, reasons } = calculateMatchScore(listing, request);
      return { request, score, reasons };
    })
    .filter((match) => match.score >= MIN_MATCH_SCORE); // Filtruj šum

  return matches.sort((a, b) => b.score - a.score).slice(0, topN);
}

/**
 * Najde top N matches pro danou poptávku mezi všemi nabídkami
 * FILTRUJE matches pod MIN_MATCH_SCORE
 */
export function findTopMatchesForRequest(
  request: Request,
  listings: Listing[],
  topN: number = 10
): Array<{ listing: Listing; score: number; reasons: MatchReasons }> {
  const matches = listings
    .map((listing) => {
      const { score, reasons } = calculateMatchScore(listing, request);
      return { listing, score, reasons };
    })
    .filter((match) => match.score >= MIN_MATCH_SCORE); // Filtruj šum

  return matches.sort((a, b) => b.score - a.score).slice(0, topN);
}

// Formátuje důvody shody pro zobrazení
export function formatMatchReasons(reasons: MatchReasons): string[] {
  const formatted: string[] = [];

  if (reasons.type) {
    formatted.push("Stejný typ nemovitosti");
  }

  if (reasons.city) {
    formatted.push("Stejné město");
  }

  if (reasons.district) {
    formatted.push("Stejná městská část");
  }

  if (reasons.price === "within_budget") {
    formatted.push("Cena v rozpočtu");
  } else if (reasons.price === "slightly_over") {
    formatted.push("Cena mírně nad rozpočtem");
  }

  if (reasons.area === "sufficient") {
    formatted.push("Dostatečná plocha");
  } else if (reasons.area === "close") {
    formatted.push("Plocha téměř odpovídající");
  }

  if (reasons.layout === "match") {
    formatted.push("Odpovídající dispozice");
  } else if (reasons.layout === "close") {
    formatted.push("Podobná dispozice");
  }

  return formatted;
}
