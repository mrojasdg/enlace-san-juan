-- Tabla: categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT NOT NULL,      -- Nombre del ícono SVG o emoji fallback
  description TEXT,
  color       TEXT DEFAULT '#EAF5EC',
  order_num   INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- Tabla: businesses
CREATE TABLE businesses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  -- Información básica
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,         -- URL amigable: "pizzas-don-pepe"
  tagline         TEXT,                          -- Frase corta debajo del nombre
  description     TEXT,                          -- Descripción larga
  category_id     UUID REFERENCES categories(id),
  is_featured     BOOLEAN DEFAULT false,         -- Destacado del mes
  is_active       BOOLEAN DEFAULT true,
  verified        BOOLEAN DEFAULT false,         -- Check azul verificado

  -- Imágenes
  logo_url        TEXT,                          -- URL logo desde Supabase Storage
  cover_url       TEXT,                          -- Imagen principal del hero
  gallery_urls    TEXT[] DEFAULT '{}',           -- Array de URLs de galería

  -- Contacto
  phone           TEXT,
  whatsapp        TEXT,                          -- Solo número, ej: "4271234567"
  email           TEXT,
  website         TEXT,

  -- Redes sociales
  facebook        TEXT,
  instagram       TEXT,
  twitter_x       TEXT,
  youtube         TEXT,

  -- Ubicación
  address         TEXT,
  neighborhood    TEXT,                          -- Colonia
  city            TEXT DEFAULT 'San Juan del Río',
  state           TEXT DEFAULT 'Querétaro',
  maps_embed_url  TEXT,                          -- URL del iframe de Google Maps
  latitude        DECIMAL(10,8),
  longitude       DECIMAL(11,8),

  -- Horarios (JSON por día)
  schedule        JSONB DEFAULT '{
    "lunes":      {"open": "09:00", "close": "18:00", "closed": false},
    "martes":     {"open": "09:00", "close": "18:00", "closed": false},
    "miercoles":  {"open": "09:00", "close": "18:00", "closed": false},
    "jueves":     {"open": "09:00", "close": "18:00", "closed": false},
    "viernes":    {"open": "09:00", "close": "18:00", "closed": false},
    "sabado":     {"open": "10:00", "close": "14:00", "closed": false},
    "domingo":    {"open": null,    "close": null,    "closed": true}
  }',

  -- Características / Tags
  features        TEXT[] DEFAULT '{}',           -- ["Pago con Tarjeta", "Estacionamiento", "WiFi"]

  -- Catálogo / Menú PDF
  catalog_pdf_url TEXT,
  catalog_label   TEXT DEFAULT 'Menú / Catálogo',

  -- Productos o servicios destacados (array de objetos)
  products        JSONB DEFAULT '[]',
  -- Ejemplo: [{"name": "Pizza Margarita", "price": "$120", "description": "Tomate, mozzarella, albahaca"}]

  -- Revista
  in_magazine     BOOLEAN DEFAULT false,
  magazine_month  TEXT,                          -- "Junio 2026"

  -- SEO
  meta_title      TEXT,
  meta_description TEXT
);

-- Insertar categorías iniciales
INSERT INTO categories (name, slug, icon, order_num) VALUES
  ('Gastronomía',           'gastronomia',           'utensils',       1),
  ('Salud & Bienestar',     'salud',                 'heart-pulse',    2),
  ('Belleza & Cuidado',     'belleza',               'scissors',       3),
  ('Tiendas & Retail',      'retail',                'shopping-bag',   4),
  ('Servicios al Hogar',    'hogar',                 'home',           5),
  ('Educación',             'educacion',             'graduation-cap', 6),
  ('Servicios Profesionales','profesionales',        'briefcase',      7),
  ('Automotriz',            'automotriz',            'car',            8),
  ('Inmobiliario',          'inmobiliario',          'building',       9),
  ('Eventos & Entretenimiento','eventos',            'calendar-star',  10),
  ('Artesanías & Cultura',  'artesanias',            'palette',        11),
  ('Otros Servicios',       'otros',                 'grid',           12);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Read policies for everyone
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read businesses" ON businesses FOR SELECT USING (is_active = true);

-- Write policies only for authenticated
CREATE POLICY "Admin write categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write businesses" ON businesses FOR ALL TO authenticated USING (true) WITH CHECK (true);
