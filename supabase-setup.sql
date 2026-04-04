-- ============================================================
-- SÜZEN İNŞAAT — SUPABASE KURULUM SCRIPTI
-- Supabase Dashboard > SQL Editor > New Query'e yapıştırın
-- ============================================================

-- 1. Fırsat Ürünleri tablosu
CREATE TABLE IF NOT EXISTS firsat_urunleri (
  id          UUID      DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT      NOT NULL,
  description TEXT      DEFAULT '',
  old_price   INTEGER   DEFAULT 0,
  new_price   INTEGER   DEFAULT 0,
  image_url   TEXT      DEFAULT '',
  badge       TEXT      DEFAULT '✅ STOKTA HAZIR',
  sort_order  INTEGER   DEFAULT 0,
  active      BOOLEAN   DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projeler tablosu (hero accordion)
CREATE TABLE IF NOT EXISTS projeler (
  id          UUID      DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT      NOT NULL,
  description TEXT      DEFAULT '',
  image_url   TEXT      DEFAULT '',
  link_url    TEXT      DEFAULT '#',
  sort_order  INTEGER   DEFAULT 0,
  active      BOOLEAN   DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security aç
ALTER TABLE firsat_urunleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE projeler        ENABLE ROW LEVEL SECURITY;

-- 4. Herkese okuma izni (site ziyaretçileri okuyabilir)
CREATE POLICY "public_read_firsat"   ON firsat_urunleri FOR SELECT USING (true);
CREATE POLICY "public_read_projeler" ON projeler        FOR SELECT USING (true);

-- 5. Sadece giriş yapmış admin yazabilir
CREATE POLICY "admin_write_firsat"   ON firsat_urunleri FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_projeler" ON projeler        FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET KURULUMU (Dashboard'dan yapın):
-- Storage > New Bucket > "firsat-images"  → Public: ON
-- Storage > New Bucket > "proje-images"   → Public: ON
--
-- AUTH KURULUMU:
-- Authentication > Users > Invite User > admin e-posta ve şifre girin
-- ============================================================
