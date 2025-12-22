-- Property Matching MVP - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Listings table (nabídky nemovitostí)
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('byt', 'dum', 'pozemek')),
    layout TEXT, -- např. 1+kk, 2+kk, 3+1, NULL pro pozemek
    city TEXT NOT NULL,
    zipcode TEXT,
    district TEXT, -- městská část
    lat NUMERIC,
    lon NUMERIC,
    price NUMERIC,
    area_m2 NUMERIC,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    photos TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'matched', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requests table (poptávky nemovitostí)
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('byt', 'dum', 'pozemek')),
    layout_min TEXT, -- minimální dispozice např. 2+kk
    city TEXT NOT NULL,
    district TEXT,
    radius_km INTEGER DEFAULT 20,
    budget_max NUMERIC,
    area_min_m2 NUMERIC,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'matched', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table (uložené shody)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    reasons JSONB, -- důvody shody jako JSON
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_status ON listings(status);

CREATE INDEX idx_requests_type ON requests(type);
CREATE INDEX idx_requests_city ON requests(city);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_status ON requests(status);

CREATE INDEX idx_matches_listing_id ON matches(listing_id);
CREATE INDEX idx_matches_request_id ON matches(request_id);
CREATE INDEX idx_matches_score ON matches(score DESC);
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);

-- Row Level Security (RLS) - Zatím disabled pro jednoduchost MVP
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Allow public read access (pro MVP)
CREATE POLICY "Allow public read access on listings" ON listings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on listings" ON listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on requests" ON requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on requests" ON requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on matches" ON matches FOR INSERT WITH CHECK (true);

-- Comments
COMMENT ON TABLE listings IS 'Nabídky nemovitostí k prodeji/pronájmu';
COMMENT ON TABLE requests IS 'Poptávky nemovitostí ke koupi/pronájmu';
COMMENT ON TABLE matches IS 'Vypočítané shody mezi nabídkami a poptávkami';

COMMENT ON COLUMN listings.photos IS 'Array of public URLs or paths to photos';
COMMENT ON COLUMN matches.reasons IS 'JSON object with matching reasons, e.g., {"type": true, "city": true, "price": "within_budget"}';
