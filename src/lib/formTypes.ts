// Types pro rozšířený poptávkový formulář

export type RequestKind = 'buy' | 'rent';

export type PropertyType = 'byt' | 'dum' | 'pozemek' | 'komercni' | 'ostatni';

export interface RequestFormData {
  // Krok 1 - Základ
  request_kind: RequestKind;
  property_type: PropertyType;
  preferred_location: string;
  radius_km: number;

  // Krok 2 - Kategorie (dynamické dle typu)
  category: string[]; // Dispozice pro byty, typy pro domy/pozemky...
  floor_preference?: string[]; // Jen pro byty

  // Krok 3 - Parametry
  area_min_m2?: number;
  area_max_m2?: number;
  budget_min?: number;
  budget_max?: number;

  // Krok 4 - Stav/Konstrukce/Vybavení
  preferred_state?: string[];
  preferred_construction?: string[];
  preferred_comfort?: string[];

  // Krok 5 - Financování/Horizont
  financing_methods?: string[];
  timeframe?: string;

  // Krok 6 - Kontakt
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  note?: string;
  gdpr: boolean;

  // Meta
  early_submit?: boolean;
  current_step?: number;
}

// Pro DB uložení
export interface RequestDBData {
  request_kind: RequestKind;
  type: PropertyType;
  layout_min?: string;
  city: string;
  district?: string;
  radius_km: number;
  budget_min?: number;
  budget_max?: number;
  area_min_m2?: number;
  area_max_m2?: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  public_token: string;
  latitude?: number;
  longitude?: number;
  details: RequestFormData; // Celý formulář jako JSON
}
