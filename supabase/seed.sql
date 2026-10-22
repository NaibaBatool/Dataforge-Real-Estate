-- ==========================================================
-- DataForge Estates — Database Seed Data
-- ==========================================================

-- 1. Insert Agents
INSERT INTO public.agents (name, role, phone, email, photo_url, active) VALUES
('Elena Vasquez', 'Senior Property Advisor', '+92 300 0000001', 'elena@dataforgeestates.com', '/images/agent-1.png', true),
('Marcus Bennett', 'Managing Broker', '+92 300 0000002', 'marcus@dataforgeestates.com', '/images/agent-2.png', true),
('Omar Farooq', 'Rentals Specialist', '+92 300 0000003', 'omar@dataforgeestates.com', '/images/agent-3.png', true),
('Nadia Sheikh', 'Investment Advisor', '+92 300 0000004', 'nadia@dataforgeestates.com', '/images/agent-4.png', true)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Properties
INSERT INTO public.properties (
    id, title, description, type, purpose, price, price_formatted, area, city,
    bedrooms, bathrooms, size_sqft, image_url, image_alt, features, status, featured, available
) VALUES
(
    'prop-01',
    'Modern Family House with Garden',
    'An elegant, light-filled family residence featuring an open-concept kitchen, hardwood floors throughout, private landscaped lawn, and a spacious master suite with walk-in closet.',
    'house',
    'buy',
    485000.00,
    '$485,000',
    'Emerald Heights',
    'Metropolis',
    4,
    3.0,
    2600,
    '/images/property-1.png',
    'Modern two-story family house with white and wood facade',
    '["Private Garden", "Double Garage", "Smart Thermostat", "Walk-in Closet"]'::jsonb,
    'sale',
    true,
    true
),
(
    'prop-02',
    'City View Apartment Residences',
    'Contemporary high-floor residence situated in the center of Downtown. Features expansive floor-to-ceiling windows, modern kitchen cabinetry, quartz countertops, and concierge access.',
    'apartment',
    'rent',
    1650.00,
    '$1,650/mo',
    'Downtown District',
    'Metropolis',
    2,
    2.0,
    1150,
    '/images/property-2.png',
    'Sleek modern apartment building with glass facade',
    '["Balcony View", "Concierge Service", "Fitness Center", "In-Unit Laundry"]'::jsonb,
    'rent',
    true,
    true
),
(
    'prop-03',
    'Bright Interior Townhome',
    'Architectural townhouse featuring soaring ceilings, a designer Scandinavian interior palette, custom millwork, and a tranquil rooftop terrace overlooking tree-lined streets.',
    'house',
    'buy',
    362000.00,
    '$362,000',
    'Willowbrook',
    'Metropolis',
    3,
    2.0,
    1850,
    '/images/property-3.png',
    'Luxurious modern living room interior',
    '["Rooftop Terrace", "Designer Lighting", "Energy Efficient", "Pet Friendly"]'::jsonb,
    'new',
    true,
    true
),
(
    'prop-04',
    'Contemporary Villa with Pool',
    'A show-stopping luxury estate built for effortless entertaining. Includes a heated infinity pool, expansive outdoor kitchen, double-height great room, and a private wine cellar.',
    'house',
    'buy',
    920000.00,
    '$920,000',
    'Emerald Heights',
    'Metropolis',
    5,
    4.0,
    3800,
    '/images/property-4.png',
    'Contemporary villa with swimming pool',
    '["Swimming Pool", "Outdoor Kitchen", "Wine Cellar", "Home Automation"]'::jsonb,
    'sale',
    true,
    true
),
(
    'prop-05',
    'Penthouse with Skyline Views',
    'Exclusive penthouse crowning Downtown most desirable tower. Expansive wrap-around terrace, private elevator foyer, Gaggenau kitchen appliances, and dramatic sunset views.',
    'apartment',
    'rent',
    2900.00,
    '$2,900/mo',
    'Downtown District',
    'Metropolis',
    3,
    3.0,
    2100,
    '/images/property-5.png',
    'Modern penthouse interior with open kitchen',
    '["Skyline Views", "Wrap-around Terrace", "Private Elevator", "Valet Parking"]'::jsonb,
    'rent',
    true,
    true
),
(
    'prop-06',
    'Residential Plot in Green Valley',
    'Premium corner plot situated in a quiet, master-planned residential community. Flat terrain, fully demarcated boundaries, clear titles, and ready for immediate architectural development.',
    'plot',
    'buy',
    140000.00,
    '$140,000',
    'Green Valley',
    'Metropolis',
    0,
    0.0,
    5000,
    '/images/property-6.png',
    'Empty residential land plot with green grass',
    '["Corner Lot", "Underground Utilities", "Clear Title", "Park Facing"]'::jsonb,
    'new',
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert FAQs
INSERT INTO public.faqs (question, answer, category) VALUES
('How does DataForge Estates match properties to my requirements?', 'Our automated qualification engine evaluates your budget, target neighborhood, property type, and timeline against current inventory. You receive immediate recommendations on-screen and a dedicated advisor follows up with off-market matches.', 'matching'),
('Do I need to sign up or create an account to browse properties?', 'No. You can freely browse our full inventory on the Properties page without providing a phone number or email address.', 'browsing'),
('Can I schedule a private tour before making an offer?', 'Yes, every listing has an instant WhatsApp and phone connection to our advisory team so you can arrange accompanied on-site visits at your convenience.', 'viewings');
