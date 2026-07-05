# knowledge-base

Zendesk Guide / Helpjuice のオープンソース代替。AI検索・コンテンツワークフロー・バージョン履歴・マルチブランド対応のヘルプセンターをセルフホストで運用できます。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/knowledge-base&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,NEXT_PUBLIC_APP_URL)

## なぜ knowledge-base か

| 課題 | Zendesk Guide | Helpjuice | knowledge-base |
|---|---|---|---|
| 月額コスト | $55〜$219/席 | $249〜$799 | 無料（セルフホスト） |
| 編集者上限 | 席数に比例 | プランに依存 | 無制限 |
| コンテンツワークフロー | なし | $449〜のみ | 標準搭載 |
| セルフホスト | 不可 | 不可 | Docker Compose対応 |
| AI検索 | +$50/席 | $449〜のみ | BYO APIキー |

## 機能

- **リッチテキストエディタ** — TipTap ベース、コードブロック・callout・テーブル・画像対応
- **3層カテゴリ構造** — カテゴリ → セクション → 記事
- **4ステートワークフロー** — draft → in_review → approved → published
- **全文検索 + AI検索** — PostgreSQL FTS + pgvector セマンティック検索（BYO OpenAI APIキー）
- **バージョン履歴** — 全編集を自動記録・ロールバック対応
- **検索アナリティクス** — ゼロ件クエリ、CTR、閲覧数、フィードバックスコア
- **記事フィードバック** — 👍👎 + コメント、Helpfulness Rate 自動計算
- **SEO最適化** — JSON-LD構造化データ、OGタグ、カスタムメタ
- **完全なRLS** — Supabase Row Level Security で全テーブル保護
- **マルチテナント** — 1インスタンスで複数組織・複数ヘルプセンター

## クイックスタート

### 1. Vercel にデプロイ（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/knowledge-base&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,NEXT_PUBLIC_APP_URL)

1. 上のボタンをクリック
2. [Supabase](https://supabase.com) でプロジェクトを作成
3. Supabase の SQL Editor で `supabase/migrations/` 内のマイグレーションファイルを実行
4. 環境変数を設定してデプロイ

### 2. ローカル開発

```bash
git clone https://github.com/postcabinets-jp/knowledge-base
cd knowledge-base
cp .env.example .env.local
npm install
npm run dev
```

### 3. Docker Compose（セルフホスト）

```bash
git clone https://github.com/postcabinets-jp/knowledge-base
cd knowledge-base
cp .env.example .env
docker compose up -d
```

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## データベースセットアップ

Supabase の SQL Editor で以下を順に実行：

1. `supabase/migrations/20260705000001_initial_schema.sql`
2. `supabase/seed.sql`（デモデータ、任意）

## 技術スタック

- **Next.js 15** App Router + TypeScript strict
- **Supabase** PostgreSQL + Auth + RLS + Storage
- **Tailwind CSS v4** + shadcn/ui
- **pgvector** セマンティック検索
- **Vercel** デプロイ

## セキュリティ

- セキュリティヘッダー（X-Frame-Options, X-Content-Type-Options 等）標準設定済み
- API レートリミット 60 req/min/IP
- 全テーブル RLS 有効
- CORS: same-origin only

## ライセンス

MIT License

---

Built by [POST CABINETS](https://postcabinets.co.jp)
