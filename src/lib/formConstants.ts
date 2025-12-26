// Konstanty pro poptávkový formulář

export const REQUEST_KIND_OPTIONS = [
  { value: 'buy', label: 'Koupě' },
  { value: 'rent', label: 'Podnájem' },
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'byt', label: 'Byt', icon: '🏢' },
  { value: 'dum', label: 'Dům', icon: '🏡' },
  { value: 'pozemek', label: 'Pozemek', icon: '🌳' },
  { value: 'komercni', label: 'Komerční', icon: '🏪' },
  { value: 'ostatni', label: 'Ostatní', icon: '🅿️' },
] as const;

// Kategorie pro byty
export const BYT_DISPOSITIONS = [
  '1+kk', '1+1', '2+kk', '2+1',
  '3+kk', '3+1', '4+kk', '4+1',
  '5+kk', '5+1', 'Atypický', 'Pokoj'
] as const;

export const BYT_FLOOR_PREFERENCES = [
  'Přízemí',
  'Mezipatro',
  'Poslední patro',
  'S výtahem',
  'Bez výtahu',
  'Nezáleží',
] as const;

// Kategorie pro domy
export const DUM_TYPES = [
  'Rodinný dům',
  'Vila',
  'Chalupa',
  'Chata',
  'Zemědělská usedlost',
  'Jiné',
] as const;

// Kategorie pro pozemky
export const POZEMEK_TYPES = [
  'Stavební parcela',
  'Zahrada',
  'Louka',
  'Pole',
  'Les',
  'Rybník',
  'Jiné',
] as const;

// Kategorie pro komerční
export const KOMERCNI_TYPES = [
  'Kancelář',
  'Sklad',
  'Výroba',
  'Obchod',
  'Restaurace/Kavárna',
  'Hotel/Penzion',
  'Jiné',
] as const;

// Kategorie pro ostatní
export const OSTATNI_TYPES = [
  'Garáž',
  'Garážové stání',
  'Vinný sklep',
  'Jiné',
] as const;

// Stav nemovitosti
export const PROPERTY_STATES = [
  'Novostavba',
  'Velmi dobrý',
  'Dobrý',
  'Před rekonstrukcí',
  'Projekt',
  'Nezáleží',
] as const;

// Konstrukce
export const CONSTRUCTION_TYPES = [
  'Cihlová',
  'Panelová',
  'Dřevostavba',
  'Montovaná',
  'Nezáleží',
] as const;

// Vybavení/Komfort
export const COMFORT_FEATURES = [
  'Balkon/Lodžie',
  'Terasa',
  'Sklep',
  'Parkování',
  'Zahrada',
  'Bazén',
  'Klimatizace',
  'Nezáleží',
] as const;

// Financování
export const FINANCING_OPTIONS = [
  'Hotovost',
  'Hypotéka',
  'Kombinace',
  'Nevím ještě',
] as const;

// Časový horizont
export const TIMEFRAME_OPTIONS = [
  { value: 'asap', label: 'Co nejdříve' },
  { value: '3months', label: 'Do 3 měsíců' },
  { value: '6months', label: 'Do 6 měsíců' },
  { value: '1year', label: 'Do 1 roku' },
  { value: 'flexible', label: 'Nemám časový limit' },
] as const;

// Step titles
export const STEP_TITLES = [
  'Základní info',
  'Kategorie',
  'Parametry',
  'Stav a vybavení',
  'Financování',
  'Kontakt',
] as const;
