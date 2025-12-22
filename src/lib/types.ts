// Database types
export interface Listing {
  id: string;
  type: PropertyType;
  layout: string | null;
  city: string;
  zipcode: string | null;
  district: string | null;
  lat: number | null;
  lon: number | null;
  price: number | null;
  area_m2: number | null;
  contact_email: string;
  contact_phone: string | null;
  photos: string[];
  status: string;
  created_at: string;
}

export interface Request {
  id: string;
  type: PropertyType;
  layout_min: string | null;
  city: string;
  district: string | null;
  radius_km: number;
  budget_max: number | null;
  area_min_m2: number | null;
  contact_email: string;
  contact_phone: string | null;
  status: string;
  created_at: string;
}

export interface Match {
  id: string;
  listing_id: string;
  request_id: string;
  score: number;
  reasons: MatchReasons;
  created_at: string;
}

export type PropertyType = "byt" | "dum" | "pozemek";

export interface MatchReasons {
  type?: boolean;
  city?: boolean;
  district?: boolean;
  price?: "within_budget" | "slightly_over" | "missing";
  area?: "sufficient" | "close" | "missing";
  layout?: "match" | "close" | "n/a";
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
