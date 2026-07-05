-- =====================================================
-- Seed Data — knowledge-base
-- =====================================================
-- NOTE: This seed creates demo data for development.
-- Auth users must be created separately via Supabase Auth API.
-- Run this after setting up auth users.

-- Demo organization
INSERT INTO organizations (id, name, slug, owner_id, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Acme Corporation',
  'acme',
  -- Replace with actual auth.users UUID after creating test user
  (SELECT id FROM auth.users LIMIT 1),
  'pro'
) ON CONFLICT (slug) DO NOTHING;

-- Demo help center
INSERT INTO help_centers (id, org_id, name, slug, description, primary_color, default_locale, is_public, seo_title, seo_description)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Acme サポートセンター',
  'acme-support',
  '製品の使い方、トラブルシューティング、ベストプラクティスをご案内します。',
  '#0F172A',
  'ja',
  true,
  'Acme サポートセンター | よくある質問・使い方ガイド',
  'Acme製品に関するよくある質問、使い方ガイド、トラブルシューティングをご覧いただけます。'
) ON CONFLICT (slug) DO NOTHING;

-- Organization member (owner)
INSERT INTO organization_members (org_id, user_id, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM auth.users LIMIT 1),
  'owner'
) ON CONFLICT (org_id, user_id) DO NOTHING;

-- Categories
INSERT INTO categories (id, help_center_id, name, slug, description, icon, sort_order)
VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000010', 'はじめに', 'getting-started', 'Acme製品を初めてお使いの方向けのガイドです。', 'BookOpen', 1),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000010', 'アカウント管理', 'account', 'アカウント設定、請求、チームメンバー管理について。', 'Settings', 2),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000010', 'トラブルシューティング', 'troubleshooting', 'よくある問題と解決方法。', 'AlertCircle', 3),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000010', 'APIリファレンス', 'api', 'REST APIの使い方と認証方法。', 'Code', 4)
ON CONFLICT (help_center_id, slug) DO NOTHING;

-- Sections
INSERT INTO sections (id, category_id, name, slug, description, sort_order)
VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', 'インストールとセットアップ', 'installation', '環境構築とインストール手順。', 1),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', '基本的な使い方', 'basic-usage', '最初の一歩となる基本操作。', 2),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000002', 'プロフィールと設定', 'profile-settings', 'アカウント情報の変更方法。', 1),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000002', '請求と支払い', 'billing', 'プラン変更、請求書、支払い方法の管理。', 2),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000003', 'ログインの問題', 'login-issues', 'ログインできない場合の対処法。', 1),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000003', 'パフォーマンス', 'performance', '動作が遅い・重い場合の対処法。', 2)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Articles
INSERT INTO articles (id, help_center_id, section_id, title, slug, content, content_text, status, locale, view_count, helpful_count, not_helpful_count, created_by, published_at)
SELECT
  '00000000-0000-0000-0003-000000000001',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0002-000000000001',
  'Acme CLIのインストール方法',
  'install-acme-cli',
  '[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"システム要件"}]},{"type":"paragraph","content":[{"type":"text","text":"Acme CLIをインストールする前に、以下の要件を確認してください。"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Node.js v18.0.0以上"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"npm v9.0.0以上またはpnpm v8.0.0以上"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"macOS 12+、Windows 10+、Ubuntu 20.04+"}]}]}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"インストール手順"}]},{"type":"paragraph","content":[{"type":"text","text":"以下のコマンドでグローバルにインストールします。"}]},{"type":"codeBlock","attrs":{"language":"bash"},"content":[{"type":"text","text":"npm install -g @acme/cli\n# または\npnpm add -g @acme/cli"}]},{"type":"paragraph","content":[{"type":"text","text":"インストール完了後、バージョンを確認してください。"}]},{"type":"codeBlock","attrs":{"language":"bash"},"content":[{"type":"text","text":"acme --version\n# 出力例: 2.4.1"}]},{"type":"callout","attrs":{"type":"info"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Windowsユーザーは管理者権限でPowerShellを実行してください。"}]}]}]'::jsonb,
  'Acme CLIのインストール方法 システム要件 Node.js v18.0.0以上 npm v9.0.0以上またはpnpm v8.0.0以上 インストール手順',
  'published',
  'ja',
  1247,
  89,
  3,
  (SELECT id FROM auth.users LIMIT 1),
  now() - interval '30 days'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'install-acme-cli' AND help_center_id = '00000000-0000-0000-0000-000000000010');

INSERT INTO articles (id, help_center_id, section_id, title, slug, content, content_text, status, locale, view_count, helpful_count, not_helpful_count, created_by, published_at)
SELECT
  '00000000-0000-0000-0003-000000000002',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0002-000000000002',
  'はじめての設定：5分でできるクイックスタート',
  'quickstart',
  '[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"ステップ1：プロジェクトの初期化"}]},{"type":"paragraph","content":[{"type":"text","text":"インストール後、新しいプロジェクトディレクトリで以下を実行します。"}]},{"type":"codeBlock","attrs":{"language":"bash"},"content":[{"type":"text","text":"acme init my-project\ncd my-project"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"ステップ2：APIキーの設定"}]},{"type":"paragraph","content":[{"type":"text","text":"ダッシュボードからAPIキーをコピーし、.envファイルに設定します。"}]},{"type":"codeBlock","attrs":{"language":"bash"},"content":[{"type":"text","text":"ACME_API_KEY=ak_live_xxxxxxxxxxxxxxxx"}]},{"type":"callout","attrs":{"type":"warning"},"content":[{"type":"paragraph","content":[{"type":"text","text":"APIキーは絶対にGitHubにコミットしないでください。.envをgitignoreに追加してください。"}]}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"ステップ3：最初のAPIコール"}]},{"type":"codeBlock","attrs":{"language":"javascript"},"content":[{"type":"text","text":"import { AcmeClient } from ''@acme/sdk'';\n\nconst client = new AcmeClient(process.env.ACME_API_KEY);\nconst result = await client.projects.list();\nconsole.log(result.projects);"}]}]'::jsonb,
  'はじめての設定 クイックスタート ステップ1 プロジェクトの初期化 APIキーの設定',
  'published',
  'ja',
  3892,
  234,
  12,
  (SELECT id FROM auth.users LIMIT 1),
  now() - interval '25 days'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'quickstart' AND help_center_id = '00000000-0000-0000-0000-000000000010');

INSERT INTO articles (id, help_center_id, section_id, title, slug, content, content_text, status, locale, view_count, helpful_count, not_helpful_count, created_by, published_at)
SELECT
  '00000000-0000-0000-0003-000000000003',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0002-000000000005',
  'ログインできない場合の対処法',
  'login-troubleshooting',
  '[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"パスワードを忘れた場合"}]},{"type":"paragraph","content":[{"type":"text","text":"ログイン画面の「パスワードを忘れた方はこちら」をクリックし、登録済みメールアドレスを入力してください。リセットメールが届かない場合は迷惑メールフォルダをご確認ください。"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"2段階認証のコードが届かない"}]},{"type":"paragraph","content":[{"type":"text","text":"認証アプリ（Google AuthenticatorまたはAuhy）が正しい時刻に設定されているか確認してください。スマートフォンの時刻がズレていると正しいコードが生成されません。"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"iOSの場合：設定 → 一般 → 日付と時刻 → 自動設定をオン"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Androidの場合：設定 → 一般管理 → 日付と時刻 → 自動の日付と時刻をオン"}]}]}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"アカウントがロックされた"}]},{"type":"paragraph","content":[{"type":"text","text":"パスワードを5回以上間違えるとアカウントが30分間ロックされます。時間を置いてから再度お試しください。解除されない場合はサポートにお問い合わせください。"}]}]'::jsonb,
  'ログインできない場合の対処法 パスワードを忘れた 2段階認証 アカウントロック',
  'published',
  'ja',
  5621,
  412,
  8,
  (SELECT id FROM auth.users LIMIT 1),
  now() - interval '20 days'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'login-troubleshooting' AND help_center_id = '00000000-0000-0000-0000-000000000010');

INSERT INTO articles (id, help_center_id, section_id, title, slug, content, content_text, status, locale, view_count, helpful_count, not_helpful_count, created_by, published_at)
SELECT
  '00000000-0000-0000-0003-000000000004',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0002-000000000004',
  'プランの変更とダウングレード',
  'change-plan',
  '[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"アップグレードの手順"}]},{"type":"paragraph","content":[{"type":"text","text":"プランの変更は設定画面の「請求」タブから即時で行えます。アップグレードは日割り計算で即日反映されます。"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"ダウングレードの注意事項"}]},{"type":"callout","attrs":{"type":"warning"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Proプランからフリープランにダウングレードすると、プロジェクト数が5件を超える分は閲覧専用になります。"}]}]},{"type":"paragraph","content":[{"type":"text","text":"ダウングレードは次の請求サイクル開始時に適用されます。月途中でダウングレードしても現在の期間終了まで現プランの機能が使えます。"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"返金ポリシー"}]},{"type":"paragraph","content":[{"type":"text","text":"初回登録から14日以内であれば全額返金対応いたします。14日を超えた場合は日割り計算での返金となります。"}]}]'::jsonb,
  'プランの変更 ダウングレード アップグレード 請求 返金ポリシー',
  'published',
  'ja',
  2341,
  187,
  15,
  (SELECT id FROM auth.users LIMIT 1),
  now() - interval '15 days'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'change-plan' AND help_center_id = '00000000-0000-0000-0000-000000000010');

-- Draft article (not published)
INSERT INTO articles (id, help_center_id, section_id, title, slug, content, content_text, status, locale, created_by)
SELECT
  '00000000-0000-0000-0003-000000000005',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0002-000000000001',
  'Docker Composeを使ったセルフホスト手順（下書き）',
  'self-hosting-docker',
  '[{"type":"paragraph","content":[{"type":"text","text":"作成中..."}]}]'::jsonb,
  '作成中',
  'draft',
  'ja',
  (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'self-hosting-docker' AND help_center_id = '00000000-0000-0000-0000-000000000010');

-- Labels
INSERT INTO labels (org_id, name, color)
VALUES
  ('00000000-0000-0000-0000-000000000001', '重要', '#EF4444'),
  ('00000000-0000-0000-0000-000000000001', '更新予定', '#F59E0B'),
  ('00000000-0000-0000-0000-000000000001', 'ビデオあり', '#8B5CF6'),
  ('00000000-0000-0000-0000-000000000001', 'API', '#3B82F6')
ON CONFLICT (org_id, name) DO NOTHING;

-- Article feedback samples
INSERT INTO article_feedback (article_id, is_helpful, comment, visitor_fingerprint)
VALUES
  ('00000000-0000-0000-0003-000000000001', true, NULL, 'fp_abc123'),
  ('00000000-0000-0000-0003-000000000001', true, 'わかりやすかったです！', 'fp_def456'),
  ('00000000-0000-0000-0003-000000000001', false, 'Windowsの手順がもう少し詳しいと助かります', 'fp_ghi789'),
  ('00000000-0000-0000-0003-000000000002', true, NULL, 'fp_jkl012'),
  ('00000000-0000-0000-0003-000000000002', true, '5分以内でセットアップできました', 'fp_mno345'),
  ('00000000-0000-0000-0003-000000000003', true, NULL, 'fp_pqr678'),
  ('00000000-0000-0000-0003-000000000003', true, '2FAの時刻ズレが原因でした。ありがとうございます', 'fp_stu901');

-- Search queries analytics
INSERT INTO search_queries (help_center_id, query, result_count, clicked_article_id)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'インストール方法', 3, '00000000-0000-0000-0003-000000000001'),
  ('00000000-0000-0000-0000-000000000010', 'ログインできない', 5, '00000000-0000-0000-0003-000000000003'),
  ('00000000-0000-0000-0000-000000000010', 'パスワード変更', 2, NULL),
  ('00000000-0000-0000-0000-000000000010', 'Docker', 0, NULL),
  ('00000000-0000-0000-0000-000000000010', 'セルフホスト', 0, NULL),
  ('00000000-0000-0000-0000-000000000010', '料金 返金', 1, '00000000-0000-0000-0003-000000000004'),
  ('00000000-0000-0000-0000-000000000010', '2段階認証', 3, '00000000-0000-0000-0003-000000000003'),
  ('00000000-0000-0000-0000-000000000010', 'API rate limit', 0, NULL),
  ('00000000-0000-0000-0000-000000000010', 'webhook 設定', 0, NULL),
  ('00000000-0000-0000-0000-000000000010', 'クイックスタート', 4, '00000000-0000-0000-0003-000000000002');
