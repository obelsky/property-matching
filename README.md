# Property Matching MVP - ZFP Reality

Jednoduchá webová aplikace pro párování nabídek a poptávek nemovitostí.

## Technologie

- **Next.js 14+** (App Router) s TypeScript
- **Supabase** (Postgres + Storage)
- **Tailwind CSS** pro styling
- Design podle ZFP Reality Design Manual

## Instalace a spuštění

### 1. Instalace závislostí

```bash
npm install
```

### 2. Nastavení Supabase

1. Vytvořte projekt na [supabase.com](https://supabase.com)
2. Spusťte SQL skript z `schema.sql` v SQL Editor
3. Vytvořte storage bucket s názvem `photos`:
   - Jděte do Storage > Create bucket
   - Název: `photos`
   - Public: true

### 3. Konfigurace prostředí

Zkopírujte `.env.example` do `.env.local`:

```bash
cp .env.example .env.local
```

Vyplňte hodnoty:
- `NEXT_PUBLIC_SUPABASE_URL` - z Project Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - z Project Settings > API
- `SUPABASE_SERVICE_ROLE_KEY` - z Project Settings > API (service_role)
- `ADMIN_KEY` - vlastní heslo pro admin přístup

### 4. Spuštění dev serveru

```bash
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000)

## Struktura aplikace

- `/` - Hlavní stránka se 2 CTA tlačítky
- `/nabidka` - Formulář pro nabídku nemovitosti
- `/poptavka` - Formulář pro poptávku nemovitosti
- `/dekujeme/nabidka/[id]` - Poděkování + top 3 matches na poptávky
- `/dekujeme/poptavka/[id]` - Poděkování + top 3 matches na nabídky
- `/admin` - Admin rozhraní (vyžaduje ?key=ADMIN_KEY)
- `/admin/listings/[id]` - Detail nabídky
- `/admin/requests/[id]` - Detail poptávky (TODO)

## Matching algoritmus

Score 0-100 bodů:
- **Typ** (0/20): stejný typ nemovitosti
- **Lokalita** (0-30): město a městská část
- **Cena** (0-25): porovnání s budgetem
- **Plocha** (0-15): minimální požadovaná plocha
- **Dispozice** (0-10): počet místností

## Admin přístup

Admin stránky jsou chráněné query parametrem nebo headerem:
- URL: `/admin?key=ADMIN_KEY`
- Header: `x-admin-key: ADMIN_KEY`

## Design

Aplikace používá design ZFP Reality:
- **Primární barva**: #CF5400 (oranžová)
- **Hover**: #E07E3C
- **Text**: #333333
- **Pozadí**: #F7F7F7 / #FFFFFF
- **Fonty**: Bree Serif / system fallback

## Build pro produkci

```bash
npm run build
npm start
```
