-- FÁZE C: Geocoding a inteligentní matching
-- Spusťte v Supabase SQL Editor

-- 1. Přidej lat/lon do listings
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='listings' AND column_name='latitude'
    ) THEN
        ALTER TABLE listings ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='listings' AND column_name='longitude'
    ) THEN
        ALTER TABLE listings ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
END $$;

-- 2. Přidej lat/lon do requests
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='latitude'
    ) THEN
        ALTER TABLE requests ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='longitude'
    ) THEN
        ALTER TABLE requests ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
END $$;

-- 3. Ujisti se že requests má radius_km (mělo by být z předchozích migrací)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='radius_km'
    ) THEN
        ALTER TABLE requests ADD COLUMN radius_km INTEGER DEFAULT 20;
    END IF;
END $$;

-- 4. Indexy pro geo queries
CREATE INDEX IF NOT EXISTS idx_listings_lat_lon ON listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_requests_lat_lon ON requests(latitude, longitude);

-- Hotovo! ✅
-- Poznámka: Existující záznamy budou mít NULL lat/lon - geocoding se spustí při další aktualizaci
