-- FÁZE B: Public token pro self-service zadavatele
-- Spusťte v Supabase SQL Editor

-- 1. Přidej public_token do listings
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='listings' AND column_name='public_token'
    ) THEN
        ALTER TABLE listings ADD COLUMN public_token TEXT UNIQUE;
    END IF;
END $$;

-- 2. Přidej public_token do requests
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='public_token'
    ) THEN
        ALTER TABLE requests ADD COLUMN public_token TEXT UNIQUE;
    END IF;
END $$;

-- 3. Přidej public_note do listings (pro upřesnění od zadavatele)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='listings' AND column_name='public_note'
    ) THEN
        ALTER TABLE listings ADD COLUMN public_note TEXT;
    END IF;
END $$;

-- 4. Přidej public_note do requests
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='public_note'
    ) THEN
        ALTER TABLE requests ADD COLUMN public_note TEXT;
    END IF;
END $$;

-- 5. Vytvoř indexy pro rychlé vyhledávání podle tokenu
CREATE INDEX IF NOT EXISTS idx_listings_public_token ON listings(public_token);
CREATE INDEX IF NOT EXISTS idx_requests_public_token ON requests(public_token);

-- 6. Pro existující záznamy vygeneruj tokeny (volitelné)
-- UPDATE listings SET public_token = gen_random_uuid()::text WHERE public_token IS NULL;
-- UPDATE requests SET public_token = gen_random_uuid()::text WHERE public_token IS NULL;

-- Hotovo! ✅
