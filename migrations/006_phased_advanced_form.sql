-- FÁZE D: Rozšířený poptávkový formulář
-- Spusťte v Supabase SQL Editor

-- 1. Přidej details (jsonb) pro všechny odpovědi z formuláře
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='details'
    ) THEN
        ALTER TABLE requests ADD COLUMN details JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. Přidej request_kind (buy/rent)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='request_kind'
    ) THEN
        ALTER TABLE requests ADD COLUMN request_kind TEXT;
    END IF;
END $$;

-- 3. Přidej contact_name
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='contact_name'
    ) THEN
        ALTER TABLE requests ADD COLUMN contact_name TEXT;
    END IF;
END $$;

-- 4. Přidej budget_min (už máme budget_max)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='budget_min'
    ) THEN
        ALTER TABLE requests ADD COLUMN budget_min DECIMAL(12, 2);
    END IF;
END $$;

-- 5. Přidej area_max_m2 (už máme area_min_m2)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='area_max_m2'
    ) THEN
        ALTER TABLE requests ADD COLUMN area_max_m2 DECIMAL(10, 2);
    END IF;
END $$;

-- 6. Ujisti se že radius_km existuje
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='radius_km'
    ) THEN
        ALTER TABLE requests ADD COLUMN radius_km INTEGER DEFAULT 20;
    END IF;
END $$;

-- 7. Index na details (GIN pro JSONB)
CREATE INDEX IF NOT EXISTS idx_requests_details ON requests USING GIN (details);

-- 8. Index na request_kind
CREATE INDEX IF NOT EXISTS idx_requests_request_kind ON requests(request_kind);

-- Hotovo! ✅
