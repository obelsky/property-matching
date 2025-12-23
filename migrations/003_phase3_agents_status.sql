-- FÁZE 3: Status, Makléři, Agent Management
-- Tuto migraci spusťte v Supabase SQL Editor

-- 1. Vytvoř tabulku agents
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Přidej agent_id do listings (pokud ještě neexistuje)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='listings' AND column_name='agent_id'
    ) THEN
        ALTER TABLE listings ADD COLUMN agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Přidej agent_id do requests (pokud ještě neexistuje)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='agent_id'
    ) THEN
        ALTER TABLE requests ADD COLUMN agent_id UUID REFERENCES requests(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Uprav CHECK constraint pro listings status
-- Nejdřív odstraň starý constraint
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;

-- Přidej nový constraint s rozšířenými hodnotami
ALTER TABLE listings ADD CONSTRAINT listings_status_check 
    CHECK (status IN ('new', 'verified', 'active', 'reserved', 'closed', 'archived'));

-- 5. Uprav CHECK constraint pro requests status
-- Nejdřív odstraň starý constraint
ALTER TABLE requests DROP CONSTRAINT IF EXISTS requests_status_check;

-- Přidej nový constraint s rozšířenými hodnotami
ALTER TABLE requests ADD CONSTRAINT requests_status_check 
    CHECK (status IN ('new', 'active', 'paused', 'resolved', 'archived'));

-- 6. Vytvoř indexy pro lepší výkon
CREATE INDEX IF NOT EXISTS idx_listings_agent_id ON listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_requests_agent_id ON requests(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);

-- 7. (Volitelné) Vložte testovací makléře
-- INSERT INTO agents (name, email, phone) VALUES
--     ('Jan Novák', 'jan.novak@zfp.cz', '+420 777 123 456'),
--     ('Eva Svobodová', 'eva.svobodova@zfp.cz', '+420 777 234 567'),
--     ('Petr Dvořák', 'petr.dvorak@zfp.cz', '+420 777 345 678');

-- Hotovo! ✅
