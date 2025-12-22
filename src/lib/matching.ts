import { Listing, Request, MatchReasons } from "./types";

// Převod dispozice na číslo (1+kk=1, 2+kk=2, 3+1=3 atd.)
function layoutToNumber(layout: string | null): number {
  if (!layout) return 0;
  const match = layout.match(/^(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Vypočítá matching score mezi nabídkou a poptávkou
export function calculateMatchScore(
  listing: Listing,
  request: Request
): { score: number; reasons: MatchReasons } {
  let score = 0;
  const reasons: MatchReasons = {};

  // Typ (0/20): stejný typ => +20
  if (listing.type === request.type) {
    score += 20;
    reasons.type = true;
  }

  // Lokalita (0–30)
  if (listing.city.toLowerCase() === request.city.toLowerCase()) {
    score += 30;
    reasons.city = true;

    // Bonus za stejnou městskou část
    if (
      listing.district &&
      request.district &&
      listing.district.toLowerCase() === request.district.toLowerCase()
    ) {
      score += 0; // Už započítáno v city, ale můžeme trackovat
      reasons.district = true;
    }
  } else if (
    listing.district &&
    request.district &&
    listing.district.toLowerCase() === request.district.toLowerCase()
  ) {
    score += 20; // Stejná část, ale jiné město
    reasons.district = true;
  }

  // Cena (0–25)
  if (listing.price && request.budget_max) {
    if (listing.price <= request.budget_max) {
      score += 25;
      reasons.price = "within_budget";
    } else if (listing.price <= request.budget_max * 1.1) {
      score += 10; // Do 10% nad budget
      reasons.price = "slightly_over";
    }
  } else if (!listing.price || !request.budget_max) {
    score += 5; // Tolerance pokud chybí cena
    reasons.price = "missing";
  }

  // Plocha (0–15)
  if (listing.area_m2 && request.area_min_m2) {
    if (listing.area_m2 >= request.area_min_m2) {
      score += 15;
      reasons.area = "sufficient";
    } else if (listing.area_m2 >= request.area_min_m2 * 0.9) {
      score += 7; // Do -10%
      reasons.area = "close";
    }
  } else if (!listing.area_m2 || !request.area_min_m2) {
    score += 3; // Tolerance
    reasons.area = "missing";
  }

  // Dispozice (0–10)
  if (listing.layout && request.layout_min) {
    const listingNum = layoutToNumber(listing.layout);
    const requestNum = layoutToNumber(request.layout_min);

    if (listingNum >= requestNum) {
      score += 10;
      reasons.layout = "match";
    } else if (listingNum === requestNum - 1) {
      score += 4; // O 1 stupeň menší
      reasons.layout = "close";
    }
  } else {
    reasons.layout = "n/a";
  }

  return { score, reasons };
}

// Najde top N matches pro danou nabídku mezi všemi poptávkami
export function findTopMatchesForListing(
  listing: Listing,
  requests: Request[],
  topN: number = 10
): Array<{ request: Request; score: number; reasons: MatchReasons }> {
  const matches = requests.map((request) => {
    const { score, reasons } = calculateMatchScore(listing, request);
    return { request, score, reasons };
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, topN);
}

// Najde top N matches pro danou poptávku mezi všemi nabídkami
export function findTopMatchesForRequest(
  request: Request,
  listings: Listing[],
  topN: number = 10
): Array<{ listing: Listing; score: number; reasons: MatchReasons }> {
  const matches = listings.map((listing) => {
    const { score, reasons } = calculateMatchScore(listing, request);
    return { listing, score, reasons };
  });

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
