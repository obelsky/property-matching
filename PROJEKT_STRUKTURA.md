# Struktura projektu Property Matching MVP

## Přehled souborů

```
property-matching-mvp/
├── 📄 README.md                          # Dokumentace a návod k použití
├── 📄 schema.sql                         # SQL schema pro Supabase
├── 📄 .env.example                       # Příklad prostředí
├── 📄 .gitignore                         # Git ignore soubor
├── 📄 package.json                       # NPM závislosti
├── 📄 tsconfig.json                      # TypeScript konfigurace
├── 📄 tailwind.config.ts                 # Tailwind CSS konfigurace (ZFP barvy)
├── 📄 next.config.js                     # Next.js konfigurace
├── 📄 postcss.config.js                  # PostCSS konfigurace
│
├── 📁 public/
│   └── zfp-reality-logo.png              # Logo ZFP Reality
│
└── 📁 src/
    ├── 📁 lib/                           # Pomocné funkce a typy
    │   ├── types.ts                      # TypeScript typy a interfacy
    │   ├── supabase.ts                   # Supabase klient a upload fotek
    │   └── matching.ts                   # Matching algoritmus (score 0-100)
    │
    ├── 📁 components/                    # React komponenty
    │   ├── Header.tsx                    # Hlavička s logem
    │   ├── Footer.tsx                    # Patička
    │   └── MatchCard.tsx                 # Karta pro zobrazení shody
    │
    └── 📁 app/                           # Next.js App Router
        ├── globals.css                   # Globální styly (Tailwind + ZFP)
        ├── layout.tsx                    # Root layout
        ├── page.tsx                      # Homepage (landing se 2 CTA)
        │
        ├── 📁 nabidka/                   # Formulář nabídky
        │   └── page.tsx
        │
        ├── 📁 poptavka/                  # Formulář poptávky
        │   └── page.tsx
        │
        ├── 📁 api/                       # API route handlers
        │   ├── 📁 nabidka/
        │   │   └── route.ts              # POST /api/nabidka
        │   └── 📁 poptavka/
        │       └── route.ts              # POST /api/poptavka
        │
        ├── 📁 dekujeme/                  # Success stránky s matches
        │   ├── 📁 nabidka/[id]/
        │   │   └── page.tsx              # Děkujeme + top 3 poptávky
        │   └── 📁 poptavka/[id]/
        │       └── page.tsx              # Děkujeme + top 3 nabídky
        │
        └── 📁 admin/                     # Admin rozhraní
            ├── page.tsx                  # Přehled listings & requests
            └── 📁 listings/[id]/
                └── page.tsx              # Detail nabídky + matches
```

## Klíčové soubory

### 🎨 Design & Styling

**`tailwind.config.ts`**
- ZFP Reality barvy: #CF5400 (brand orange), #E07E3C (hover), #333333 (text), #F7F7F7 (bg)
- Font: Bree Serif pro nadpisy

**`src/app/globals.css`**
- Custom CSS třídy: `.btn-primary`, `.btn-secondary`, `.input-field`, `.label-field`
- Import Google Fonts (Bree Serif)

### 🧠 Business Logic

**`src/lib/matching.ts`**
- `calculateMatchScore()` - Vypočítá score 0-100 mezi nabídkou a poptávkou
- `findTopMatchesForListing()` - Najde top N matches pro nabídku
- `findTopMatchesForRequest()` - Najde top N matches pro poptávku
- `formatMatchReasons()` - Formátuje důvody shody pro UI

**Matching algoritmus:**
- Typ (0/20 bodů): stejný typ nemovitosti
- Lokalita (0-30 bodů): město + městská část
- Cena (0-25 bodů): porovnání s budgetem
- Plocha (0-15 bodů): min. požadovaná plocha
- Dispozice (0-10 bodů): počet místností

### 🗄️ Database

**`schema.sql`**
- Tabulka `listings` - nabídky nemovitostí
- Tabulka `requests` - poptávky nemovitostí
- Tabulka `matches` - uložené shody (listing_id + request_id + score + reasons)
- Indexy pro rychlé vyhledávání
- RLS povoleno, veřejný přístup pro MVP

### 🔌 API Endpoints

**`src/app/api/nabidka/route.ts`**
1. Přijme FormData z formuláře
2. Nahraje fotky do Supabase Storage
3. Uloží listing do DB
4. Načte všechny requests
5. Spočítá top 10 matches
6. Uloží matches do DB
7. Vrátí ID nového listingu

**`src/app/api/poptavka/route.ts`**
- Stejná logika jako nabídka, jen obráceně

### 🎯 User Flow

1. **Homepage (`src/app/page.tsx`)**
   - 2 CTA tlačítka: "Chci nabídnout" / "Chci koupit"

2. **Formuláře**
   - `/nabidka` - upload fotek, parametry nemovitosti, kontakt
   - `/poptavka` - požadavky na nemovitost, kontakt

3. **Success stránky**
   - `/dekujeme/nabidka/[id]` - potvrzení + top 3 poptávky
   - `/dekujeme/poptavka/[id]` - potvrzení + top 3 nabídky
   - Zobrazuje karty s matches pomocí `MatchCard` komponenty

4. **Admin**
   - `/admin?key=ADMIN_KEY` - přehled všech záznamů
   - `/admin/listings/[id]?key=ADMIN_KEY` - detail nabídky s matches

## Design konvence (ZFP Reality)

### Barvy
- **Primární oranžová**: #CF5400 (tlačítka, odkazy, akcenty)
- **Hover oranžová**: #E07E3C
- **Text**: #333333 (tmavě šedá)
- **Pozadí**: #F7F7F7 (světle šedá) / #FFFFFF (bílá)

### Typografie
- **Nadpisy (H1-H2)**: Bree Serif Bold/SemiBold
- **Podnadpisy (H3-H4)**: Bree Serif Regular
- **Běžný text**: System fonts (Apple System, Segoe UI, Roboto)
- **CTA tlačítka**: Bold, UPPERCASE

### Komponenty
- **Primární CTA**: Oranžové pozadí, bílý text, hover tmavší
- **Sekundární CTA**: Bílé pozadí, oranžový rámeček, hover oranžové pozadí
- **Karty**: Bílé, stín, rounded rohy, hover efekt

## Jak spustit

1. `npm install`
2. Nastavit `.env.local` (viz `.env.example`)
3. Spustit SQL z `schema.sql` v Supabase
4. Vytvořit storage bucket "photos" v Supabase (public)
5. `npm run dev`

## TODO / Možná vylepšení

- [ ] Email notifikace při nových matches
- [ ] Detail stránka pro requests v adminu
- [ ] Možnost editace záznamů v adminu
- [ ] Pokročilé filtrování v admin rozhraní
- [ ] Export dat do CSV/Excel
- [ ] Statistiky a grafy v adminu
- [ ] Public stránka s přehledem nabídek (bez kontaktů)
- [ ] Mapové zobrazení nabídek
- [ ] Autentizace pro majitele nabídek/poptávek
- [ ] Real-time notifikace (Supabase Realtime)
