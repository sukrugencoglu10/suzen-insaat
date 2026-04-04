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
-- 6. STORAGE POLİCYLERİ (resim yükleme için zorunlu!)
-- ============================================================

-- Herkese okuma izni
CREATE POLICY "public_read_firsat_storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'firsat-images');

CREATE POLICY "public_read_proje_storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proje-images');

-- Giriş yapmış admin yükleyebilir
CREATE POLICY "auth_insert_firsat_storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'firsat-images' AND auth.role() = 'authenticated');

CREATE POLICY "auth_insert_proje_storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'proje-images' AND auth.role() = 'authenticated');

-- Giriş yapmış admin güncelleyebilir
CREATE POLICY "auth_update_firsat_storage"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'firsat-images' AND auth.role() = 'authenticated');

CREATE POLICY "auth_update_proje_storage"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'proje-images' AND auth.role() = 'authenticated');

-- Giriş yapmış admin silebilir
CREATE POLICY "auth_delete_firsat_storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'firsat-images' AND auth.role() = 'authenticated');

CREATE POLICY "auth_delete_proje_storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'proje-images' AND auth.role() = 'authenticated');

-- ============================================================
-- 7. PROJELER — ÇOK RESİM DESTEĞİ
-- Mevcut projeler tablosuna images kolonu ekler (en fazla 10 URL)
-- ============================================================
ALTER TABLE projeler
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
