// Konstanty pro nabídkový formulář

export const LISTING_KIND_OPTIONS = [
  { value: 'sale', label: 'Prodat' },
  { value: 'rent', label: 'Pronajmout' },
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'byt', label: 'Byt', icon: '🏢' },
  { value: 'dum', label: 'Dům', icon: '🏡' },
  { value: 'pozemek', label: 'Pozemek', icon: '🌳' },
  { value: 'komercni', label: 'Komerční', icon: '🏪' },
] as const;

// Dispozice pro byty
export const BYT_DISPOSITIONS = [
  '1+kk', '1+1', '2+kk', '2+1',
  '3+kk', '3+1', '4+kk', '4+1',
  '5+kk', '5+1', '6+kk', '6+1',
  'Atypický', 'Pokoj'
] as const;

// Vlastnictví
export const OWNERSHIP_TYPES = [
  'Osobní',
  'Družstevní',
  'Obecní',
  'Jiné',
] as const;

// Typy domů
export const DUM_TYPES = [
  'Rodinný dům',
  'Vila',
  'Řadový dům',
  'Chalupa',
  'Chata',
  'Zemědělská usedlost',
  'Jiné',
] as const;

// Konstrukce domu
export const CONSTRUCTION_TYPES = [
  'Cihlová',
  'Panelová',
  'Dřevěná',
  'Smíšená',
  'Jiná',
] as const;

// Typy pozemků
export const POZEMEK_TYPES = [
  'Stavební parcela',
  'Zahrada',
  'Louka',
  'Pole',
  'Les',
  'Rybník',
  'Orná půda',
  'Jiné',
] as const;

// Typy komerčních nemovitostí
export const KOMERCNI_TYPES = [
  'Kancelář',
  'Sklad',
  'Retail / Obchod',
  'Restaurace',
  'Hotel',
  'Výrobní prostory',
  'Jiné',
] as const;

// Stav nemovitosti
export const PROPERTY_STATE = [
  'Novostavba',
  'Po kompletní rekonstrukci',
  'Po částečné rekonstrukci',
  'Před rekonstrukcí',
  'Původní stav',
  'Ve výstavbě',
  'Projekt',
] as const;

// Energetická náročnost (PENB)
export const PENB_CLASSES = [
  'A - Mimořádně úsporná',
  'B - Velmi úsporná',
  'C - Úsporná',
  'D - Méně úsporná',
  'E - Nehospodárná',
  'F - Velmi nehospodárná',
  'G - Mimořádně nehospodárná',
  'Neznámá',
] as const;

// Dostupnost
export const AVAILABILITY_OPTIONS = [
  'Ihned',
  'Do 1 měsíce',
  'Do 3 měsíců',
  'Do 6 měsíců',
  'Po dohodě',
  'Neurčeno',
] as const;

// Parkování
export const PARKING_OPTIONS = [
  'Garážové stání',
  'Venkovní stání',
  'Garáž',
  'Ulice',
  'Bez parkování',
] as const;

// Orientace
export const ORIENTATION_OPTIONS = [
  'Sever',
  'Jih',
  'Východ',
  'Západ',
  'Severovýchod',
  'Jihovýchod',
  'Severozápad',
  'Jihozápad',
] as const;

// Obsazenost
export const OCCUPANCY_STATUS = [
  'Volné',
  'Pronajato - běžná smlouva',
  'Pronajato - neurčitě',
  'Obývané majitelem',
] as const;

// Právní omezení
export const LEGAL_RESTRICTIONS = [
  'Hypotéka',
  'Zástava',
  'Věcné břemeno',
  'Předkupní právo',
  'Exekuce',
  'Bez omezení',
] as const;

// Ochota vyjednávat
export const NEGOTIATION_WILLINGNESS = [
  'Pevná cena',
  'Mírně vyjednávám',
  'Výrazně vyjednávám',
  'Cena orientační',
] as const;

// Způsob prodeje
export const SALE_METHOD = [
  'Prodej přes inzerci',
  'Rychlý výkup',
  'Aukce',
  'Nevím / poraďte',
] as const;

// Časový horizont
export const LISTING_TIMEFRAME = [
  { value: 'urgent', label: 'Do 1 měsíce' },
  { value: '1-3months', label: '1-3 měsíce' },
  { value: '3-6months', label: '3-6 měsíců' },
  { value: '6-12months', label: '6-12 měsíců' },
  { value: 'flexible', label: 'Nemám časový tlak' },
] as const;

// Důvod prodeje
export const SALE_REASON = [
  'Stěhování',
  'Upgrade nemovitosti',
  'Dědictví',
  'Rozvod',
  'Finanční důvody',
  'Investice',
  'Jiný důvod',
  'Nechci uvádět',
] as const;

// USP (Unique Selling Points)
export const USP_OPTIONS = [
  'Výhled',
  'Ticho / Klidná lokalita',
  'Dobrá doprava / MHD',
  'Škola v okolí',
  'Obchody v okolí',
  'Park / Příroda',
  'Nová rekonstrukce',
  'Kvalitní vybavení',
  'Nízké náklady',
  'Velký sklep',
  'Balkon / Terasa',
  'Zahrada',
  'Garáž',
] as const;

// Preference kontaktu
export const CONTACT_PREFERENCE = [
  'Telefon',
  'E-mail',
  'SMS',
  'Jakkoliv',
] as const;

// Step titles pro wizard
export const LISTING_STEP_TITLES = [
  'Co nabízíte?',      // 0: Kind (Prodat/Pronajmout)
  'Kde se nachází?',   // 1: Lokalita
  'Co nabízíte?',      // 2: Typ + Kategorie
  'Parametry',         // 3: Tvrdá data
  'Právní situace',    // 4: Vlastnictví + Omezení
  'Cena a preference', // 5: Cena + Horizont
  'Fotky a detaily',   // 6: Upload + USP
  'Kontakt',           // 7: Jméno, Email, Tel
] as const;

// Dokumenty checklist
export const DOCUMENTS_CHECKLIST = [
  'PENB (Průkaz energetické náročnosti)',
  'List vlastnictví',
  'Nabývací titul',
  'Stavební dokumentace',
  'Revize (plyn, elektro)',
  'Pojištění',
] as const;
