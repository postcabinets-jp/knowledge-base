-- =====================================================
-- knowledge-base: Initial Schema
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_bigm";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- Tables
-- =====================================================

-- 組織（マルチテナント）
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  ai_provider TEXT CHECK (ai_provider IN ('openai', 'anthropic')),
  ai_api_key_encrypted TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- 組織メンバー
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner','admin','editor','reviewer','viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ヘルプセンター（マルチブランド対応：1組織→複数ヘルプセンター）
CREATE TABLE help_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  custom_domain TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#0F172A',
  custom_css TEXT,
  default_locale TEXT NOT NULL DEFAULT 'ja',
  is_public BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE help_centers ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_help_centers_org ON help_centers(org_id);

-- カテゴリ（ヘルプセンター内の大分類）
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  help_center_id UUID NOT NULL REFERENCES help_centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(help_center_id, slug)
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_categories_hc ON categories(help_center_id);

-- セクション（カテゴリ内の中分類）
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  sort_order FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sections_category ON sections(category_id);

-- 記事
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  help_center_id UUID NOT NULL REFERENCES help_centers(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '[]',
  content_text TEXT,
  content_embedding VECTOR(1536),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','published','archived')),
  locale TEXT NOT NULL DEFAULT 'ja',
  sort_order FLOAT NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  expires_at TIMESTAMPTZ,
  assigned_reviewer_id UUID REFERENCES auth.users(id),
  view_count BIGINT NOT NULL DEFAULT 0,
  helpful_count INT NOT NULL DEFAULT 0,
  not_helpful_count INT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  last_edited_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(help_center_id, slug, locale)
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_articles_hc ON articles(help_center_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_articles_section ON articles(section_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_articles_fts ON articles USING gin(
  to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content_text,''))
) WHERE deleted_at IS NULL;
CREATE INDEX idx_articles_embedding ON articles USING ivfflat (content_embedding vector_cosine_ops)
  WITH (lists = 100) WHERE content_embedding IS NOT NULL AND deleted_at IS NULL;

-- 記事バージョン履歴
CREATE TABLE article_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  content_text TEXT,
  status TEXT NOT NULL,
  edited_by UUID NOT NULL REFERENCES auth.users(id),
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE article_versions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_article_versions ON article_versions(article_id, created_at DESC);

-- 記事フィードバック（エンドユーザーの役に立ったか）
CREATE TABLE article_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  comment TEXT,
  visitor_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE article_feedback ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_article_feedback ON article_feedback(article_id, created_at DESC);

-- 記事ラベル
CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  UNIQUE(org_id, name)
);

ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE TABLE article_labels (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, label_id)
);

ALTER TABLE article_labels ENABLE ROW LEVEL SECURITY;

-- メディア資産ライブラリ
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- 検索アナリティクス
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  help_center_id UUID NOT NULL REFERENCES help_centers(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  result_count INT NOT NULL DEFAULT 0,
  clicked_article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_search_queries_hc ON search_queries(help_center_id, created_at DESC);
CREATE INDEX idx_search_queries_zero ON search_queries(help_center_id, result_count)
  WHERE result_count = 0;

-- =====================================================
-- Functions & Triggers
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_help_centers_updated_at
  BEFORE UPDATE ON help_centers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_sections_updated_at
  BEFORE UPDATE ON sections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Full-text search function
CREATE OR REPLACE FUNCTION search_articles(
  p_help_center_id UUID,
  p_query TEXT,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  content_text TEXT,
  status TEXT,
  view_count BIGINT,
  rank FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.slug,
    a.content_text,
    a.status,
    a.view_count,
    ts_rank(
      to_tsvector('simple', coalesce(a.title,'') || ' ' || coalesce(a.content_text,'')),
      plainto_tsquery('simple', p_query)
    ) AS rank
  FROM articles a
  WHERE
    a.help_center_id = p_help_center_id
    AND a.status = 'published'
    AND a.deleted_at IS NULL
    AND to_tsvector('simple', coalesce(a.title,'') || ' ' || coalesce(a.content_text,''))
        @@ plainto_tsquery('simple', p_query)
  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS Policies
-- =====================================================

-- organizations
CREATE POLICY "org_select" ON organizations
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = organizations.id AND user_id = auth.uid())
  );

CREATE POLICY "org_insert" ON organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "org_update" ON organizations
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = organizations.id AND user_id = auth.uid() AND role IN ('owner','admin'))
  );

-- organization_members
CREATE POLICY "om_select" ON organization_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM organization_members om2 WHERE om2.org_id = organization_members.org_id AND om2.user_id = auth.uid())
  );

CREATE POLICY "om_insert" ON organization_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = organization_members.org_id AND user_id = auth.uid() AND role IN ('owner','admin'))
    OR
    EXISTS (SELECT 1 FROM organizations WHERE id = organization_members.org_id AND owner_id = auth.uid())
  );

CREATE POLICY "om_delete" ON organization_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM organization_members om2 WHERE om2.org_id = organization_members.org_id AND om2.user_id = auth.uid() AND role IN ('owner','admin'))
  );

-- help_centers
CREATE POLICY "hc_select" ON help_centers
  FOR SELECT USING (
    is_public OR
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = help_centers.org_id AND user_id = auth.uid())
  );

CREATE POLICY "hc_insert" ON help_centers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = help_centers.org_id AND user_id = auth.uid() AND role IN ('owner','admin'))
    OR
    EXISTS (SELECT 1 FROM organizations WHERE id = help_centers.org_id AND owner_id = auth.uid())
  );

CREATE POLICY "hc_update" ON help_centers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = help_centers.org_id AND user_id = auth.uid() AND role IN ('owner','admin'))
  );

-- categories
CREATE POLICY "cat_select" ON categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM help_centers hc
      WHERE hc.id = categories.help_center_id
      AND (hc.is_public OR EXISTS (
        SELECT 1 FROM organization_members om WHERE om.org_id = hc.org_id AND om.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "cat_write" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM help_centers hc
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE hc.id = categories.help_center_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner','admin','editor')
    )
  );

-- sections
CREATE POLICY "sec_select" ON sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM categories c
      JOIN help_centers hc ON hc.id = c.help_center_id
      WHERE c.id = sections.category_id
      AND (hc.is_public OR EXISTS (
        SELECT 1 FROM organization_members om WHERE om.org_id = hc.org_id AND om.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "sec_write" ON sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM categories c
      JOIN help_centers hc ON hc.id = c.help_center_id
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE c.id = sections.category_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner','admin','editor')
    )
  );

-- articles
CREATE POLICY "article_select" ON articles
  FOR SELECT USING (
    deleted_at IS NULL AND (
      (status = 'published' AND EXISTS (SELECT 1 FROM help_centers hc WHERE hc.id = articles.help_center_id AND hc.is_public))
      OR
      EXISTS (
        SELECT 1 FROM help_centers hc
        JOIN organization_members om ON om.org_id = hc.org_id
        WHERE hc.id = articles.help_center_id AND om.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "article_insert" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM help_centers hc
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE hc.id = articles.help_center_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner','admin','editor')
    )
  );

CREATE POLICY "article_update" ON articles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM help_centers hc
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE hc.id = articles.help_center_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner','admin','editor','reviewer')
    )
  );

-- article_versions
CREATE POLICY "av_select" ON article_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM articles a
      JOIN help_centers hc ON hc.id = a.help_center_id
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE a.id = article_versions.article_id AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "av_insert" ON article_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles a
      JOIN help_centers hc ON hc.id = a.help_center_id
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE a.id = article_versions.article_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner','admin','editor')
    )
  );

-- article_feedback
CREATE POLICY "af_insert" ON article_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "af_select" ON article_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM articles a
      JOIN help_centers hc ON hc.id = a.help_center_id
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE a.id = article_feedback.article_id AND om.user_id = auth.uid()
    )
  );

-- labels
CREATE POLICY "label_select" ON labels
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = labels.org_id AND user_id = auth.uid())
  );

CREATE POLICY "label_write" ON labels
  FOR ALL USING (
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = labels.org_id AND user_id = auth.uid() AND role IN ('owner','admin','editor'))
  );

-- article_labels
CREATE POLICY "al_select" ON article_labels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM articles a
      JOIN help_centers hc ON hc.id = a.help_center_id
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE a.id = article_labels.article_id AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "al_write" ON article_labels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM articles a
      JOIN help_centers hc ON hc.id = a.help_center_id
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE a.id = article_labels.article_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner','admin','editor')
    )
  );

-- media_assets
CREATE POLICY "media_select" ON media_assets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = media_assets.org_id AND user_id = auth.uid())
  );

CREATE POLICY "media_insert" ON media_assets
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = media_assets.org_id AND user_id = auth.uid())
  );

CREATE POLICY "media_delete" ON media_assets
  FOR DELETE USING (
    uploaded_by = auth.uid() OR
    EXISTS (SELECT 1 FROM organization_members WHERE org_id = media_assets.org_id AND user_id = auth.uid() AND role IN ('owner','admin'))
  );

-- search_queries
CREATE POLICY "sq_insert" ON search_queries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "sq_select" ON search_queries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM help_centers hc
      JOIN organization_members om ON om.org_id = hc.org_id
      WHERE hc.id = search_queries.help_center_id AND om.user_id = auth.uid()
    )
  );
