// Database types
export interface Listing {
  id: string;
  type: PropertyType;
  layout: string | null;
  city: string;
  zipcode: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  area_m2: number | null;
  contact_email: string;
  contact_phone: string | null;
  photos: string[];
  status: ListingStatus;
  agent_id: string | null;
  public_token: string | null;
  public_note: string | null;
  created_at: string;
}

export interface Request {
  id: string;
  request_kind: string | null; // buy/rent - NOVÉ
  type: PropertyType;
  layout_min: string | null;
  city: string;
  district: string | null;
  radius_km: number;
  budget_min: number | null; // NOVÉ
  budget_max: number | null;
  area_min_m2: number | null;
  area_max_m2: number | null; // NOVÉ
  latitude: number | null;
  longitude: number | null;
  contact_name: string | null; // NOVÉ
  contact_email: string;
  contact_phone: string | null;
  status: RequestStatus;
  agent_id: string | null;
  public_token: string | null;
  public_note: string | null;
  details: any; // JSONB - NOVÉ
  created_at: string;
}
}

export interface Match {
  id: string;
  listing_id: string;
  request_id: string;
  score: number;
  reasons: MatchReasons;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export type PropertyType = "byt" | "dum" | "pozemek";

export type ListingStatus = "new" | "verified" | "active" | "reserved" | "closed" | "archived";
export type RequestStatus = "new" | "active" | "paused" | "resolved" | "archived";

export interface MatchReasons {
  type?: boolean;
  city?: boolean;
  district?: boolean;
  price?: "within_budget" | "slightly_over" | "over_budget" | "missing";
  area?: "sufficient" | "close" | "insufficient" | "missing";
  layout?: "match" | "close" | "insufficient" | "n/a";
  // Geo/distance fieldy
  geo?: string; // "within_radius" | "outside_radius" | "missing_fallback_city" atd.
  distance_km?: number | null;
  radius_km?: number;
  distance_score?: number;
  gate_failed?: string; // Který gate selhal (pokud score=0)
}

// Form data types
export interface ListingFormData {
  type: PropertyType;
  layout: string;
  city: string;
  zipcode: string;
  district: string;
  price: string;
  area_m2: string;
  contact_email: string;
  contact_phone: string;
  photos: File[];
}

export interface RequestFormData {
  type: PropertyType;
  layout_min: string;
  city: string;
  district: string;
  budget_max: string;
  area_min_m2: string;
  contact_email: string;
  contact_phone: string;
}

// Match with related data
export interface MatchWithListing extends Match {
  listing: Listing;
}

export interface MatchWithRequest extends Match {
  request: Request;
}
