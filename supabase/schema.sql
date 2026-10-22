-- ==========================================================
-- Aurelia Estates -> DataForge Estates — Supabase PostgreSQL Database Schema
-- Multi-entity real estate CRM, property catalog & lead qualification
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------
-- 1. AGENTS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    photo_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 2. PROPERTIES TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id VARCHAR(100) PRIMARY KEY, -- Slug or UUID format (e.g. prop-01)
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('house', 'apartment', 'plot', 'commercial')),
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('buy', 'rent')),
    price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
    price_formatted VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Metropolis',
    bedrooms INT DEFAULT 0 CHECK (bedrooms >= 0),
    bathrooms NUMERIC(3, 1) DEFAULT 0 CHECK (bathrooms >= 0),
    size_sqft INT NOT NULL CHECK (size_sqft > 0),
    image_url TEXT NOT NULL,
    image_alt TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'sale' CHECK (status IN ('sale', 'rent', 'new')),
    featured BOOLEAN DEFAULT FALSE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for frequent property search queries
CREATE INDEX IF NOT EXISTS idx_properties_purpose ON public.properties(purpose);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_area ON public.properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_available ON public.properties(available);

-- ----------------------------------------------------------
-- 3. LEADS TABLE (Customer Qualification Submissions)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('buy', 'rent', 'invest')),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('house', 'apartment', 'plot', 'commercial')),
    areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    budget_min NUMERIC(14, 2) NOT NULL CHECK (budget_min >= 0),
    budget_max NUMERIC(14, 2) NOT NULL CHECK (budget_max >= budget_min),
    timeline VARCHAR(50) NOT NULL CHECK (timeline IN ('immediately', '1-3_months', '3-6_months', 'exploring')),
    notes TEXT,
    score INT NOT NULL DEFAULT 0,
    tier VARCHAR(20) NOT NULL DEFAULT 'cold' CHECK (tier IN ('hot', 'warm', 'cold')),
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'lost')),
    source VARCHAR(100) DEFAULT 'web_qualification_form',
    consent BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_tier ON public.leads(tier);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- ----------------------------------------------------------
-- 4. LEAD EVENTS TABLE (Audit Trail & Interaction Log)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- e.g. lead_created, viewed_matches, inquiry_sent, viewing_requested
    property_id VARCHAR(100) REFERENCES public.properties(id) ON DELETE SET NULL,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON public.lead_events(lead_id);

-- ----------------------------------------------------------
-- 5. INQUIRIES TABLE (Direct Property Questions)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    property_id VARCHAR(100) NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.inquiries(property_id);

-- ----------------------------------------------------------
-- 6. VIEWINGS TABLE (Scheduled Property Tours)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.viewings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    property_id VARCHAR(100) NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 7. FAQS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 1. Public can read active properties
CREATE POLICY "Public properties are viewable by everyone"
ON public.properties FOR SELECT
USING (available = TRUE);

-- 2. Public can read active FAQs
CREATE POLICY "Public faqs are viewable by everyone"
ON public.faqs FOR SELECT
USING (active = TRUE);

-- 3. Public can submit new leads (INSERT only)
CREATE POLICY "Anyone can submit a lead qualification form"
ON public.leads FOR INSERT
WITH CHECK (consent = TRUE);

-- 4. Public CANNOT read other users' leads
-- (Only service_role / authenticated agents can SELECT from leads)
CREATE POLICY "Leads readable only by authenticated staff"
ON public.leads FOR SELECT
TO authenticated
USING (true);

-- 5. Public can submit an inquiry
CREATE POLICY "Anyone can submit a property inquiry"
ON public.inquiries FOR INSERT
WITH CHECK (true);
