import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search, BookOpen, GitBranch, Zap, Lock, Globe,
  CheckCircle, XCircle, ArrowRight, ChevronRight
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
                <path d="M3 8h10M8 3v10" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            knowledge-base
          </Link>
          <div className="flex items-center gap-2">
            <Link href="https://github.com/postcabinets-jp/knowledge-base" target="_blank">
              <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-slate-900">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-500">サインイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800">始める</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <Badge variant="outline" className="mb-6 text-xs font-normal text-slate-500 border-slate-200">
          Zendesk Guide の OSS 代替
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
          ヘルプセンターを、<br />
          <span className="text-slate-500">月$219 払わずに</span>運用する
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Zendesk Guide は席数課金で編集者にも費用がかかる。Helpjuice は入り口コストが$249。
          knowledge-base はそのどちらでもない、セルフホスト可能なオープンソースのヘルプセンターです。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 h-11 px-6 gap-2">
              無料で始める
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/knowledge-base" target="_blank">
            <Button variant="outline" size="lg" className="h-11 px-6 gap-2 border-slate-200">
              Vercel にデプロイ
            </Button>
          </Link>
        </div>
      </section>

      {/* Demo screenshot placeholder */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-400 w-52 text-center">
                help.acme.com
              </div>
            </div>
          </div>
          <div className="bg-slate-900 py-14 px-6 text-center">
            <h2 className="text-white text-2xl font-semibold mb-4">Acme サポートセンター</h2>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <div className="h-11 pl-11 bg-white rounded-lg border border-slate-200 flex items-center">
                <span className="text-sm text-slate-400">何をお探しですか？</span>
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-8 grid grid-cols-3 gap-4">
            {["はじめに", "アカウント管理", "トラブルシューティング"].map(cat => (
              <div key={cat} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-100 mb-3 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-800">{cat}</p>
                <p className="text-xs text-slate-400 mt-1">4件の記事</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points comparison */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-2">Zendeskは高い。Helpjuiceも高い。</h2>
          <p className="text-slate-500 text-center text-sm mb-12">よくある痛点と、knowledge-base の答え</p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                them: "席数課金で編集者にも費用",
                them2: "10人の編集チームで月$550+",
                us: "無制限の編集者。追加費用ゼロ",
              },
              {
                them: "検索品質が1,000記事超で劣化",
                them2: "Zendesk TrustPilot 1.7/5",
                us: "pgvector でセマンティック検索。BYO APIキー",
              },
              {
                them: "コンテンツワークフロー皆無",
                them2: "下書き→承認フローなし",
                us: "4ステートワークフロー標準搭載",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item.them}</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">{item.them2}</p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-800">{item.us}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-2">機能一覧</h2>
        <p className="text-slate-500 text-sm text-center mb-12">v1.0 で使えるすべての機能</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: "ハイブリッド検索",
              desc: "全文検索 + pgvector セマンティック検索。BYO OpenAI APIキーで semantic search を追加費用ゼロで実現。",
            },
            {
              icon: GitBranch,
              title: "コンテンツワークフロー",
              desc: "draft → in_review → approved → published の4ステート。承認者アサイン・差し戻しコメント標準搭載。",
            },
            {
              icon: BookOpen,
              title: "バージョン履歴",
              desc: "全編集を自動記録。diff表示とワンクリックロールバック。Zendeskにない機能。",
            },
            {
              icon: Globe,
              title: "SEO最適化",
              desc: "JSON-LD構造化データ・OGタグ自動生成・カスタムメタ対応。記事がGoogleに正しくインデックスされる。",
            },
            {
              icon: Zap,
              title: "検索アナリティクス",
              desc: "ゼロ件クエリの一覧・CTR・閲覧数推移・フィードバックスコア。何を書くべきかが一目でわかる。",
            },
            {
              icon: Lock,
              title: "完全なRLS",
              desc: "Supabase RLS で全テーブルを保護。組織をまたいだデータ漏洩は設計上起こらない。",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-12">料金比較</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-4 font-medium text-slate-500 w-40">機能</th>
                  <th className="text-center px-5 py-4 font-medium text-slate-700">Zendesk Guide</th>
                  <th className="text-center px-5 py-4 font-medium text-slate-700">Helpjuice</th>
                  <th className="text-center px-5 py-4 font-semibold text-slate-900 bg-slate-50">
                    knowledge-base
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ["月額", "$55–$219/席", "$249–$799", "無料（セルフホスト）"],
                  ["編集者上限", "席数に比例", "プランに依存", "無制限"],
                  ["検索品質", "1000記事超で劣化", "高品質 ★4.7", "pgvector + FTS"],
                  ["ワークフロー", "なし", "あり（$449〜）", "標準搭載"],
                  ["セルフホスト", "不可", "不可", "Docker Compose"],
                  ["AI機能", "別途+$50/席", "$449〜のみ", "BYO APIキー"],
                ].map(([feature, zendesk, helpjuice, us]) => (
                  <tr key={feature} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-slate-500 font-medium text-xs">{feature}</td>
                    <td className="px-5 py-3.5 text-center text-slate-600 text-xs">{zendesk}</td>
                    <td className="px-5 py-3.5 text-center text-slate-600 text-xs">{helpjuice}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-slate-900 text-xs bg-slate-50">
                      {us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Deploy section */}
      <section className="py-20 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">1クリックでデプロイ</h2>
        <p className="text-slate-500 text-sm mb-8">
          Vercel + Supabase の組み合わせで、5分以内に本番環境が立ち上がります。
          または Docker Compose で完全なセルフホストも可能。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="https://vercel.com/new/clone?repository-url=https://github.com/postcabinets-jp/knowledge-base&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,NEXT_PUBLIC_APP_URL"
            target="_blank"
          >
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 h-11 px-6 gap-2">
              Deploy to Vercel
            </Button>
          </Link>
          <Link href="https://github.com/postcabinets-jp/knowledge-base" target="_blank">
            <Button variant="outline" size="lg" className="h-11 px-6 gap-2 border-slate-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              View on GitHub
            </Button>
          </Link>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-left font-mono text-sm border border-slate-200 max-w-md mx-auto">
          <p className="text-slate-400 text-xs mb-2"># Docker Compose でセルフホスト</p>
          <p className="text-slate-600">git clone https://github.com/postcabinets-jp/knowledge-base</p>
          <p className="text-slate-600">cp .env.example .env</p>
          <p className="text-slate-600">docker compose up -d</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Zendesk に払い続けるのをやめよう
          </h2>
          <p className="text-slate-400 mb-8 text-sm">
            無料で始めて、必要なら自分でホストする。あなたのデータは常にあなたのもの。
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-11 px-8 gap-2">
              無料で始める
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-3 h-3">
                <path d="M3 8h10M8 3v10" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span>knowledge-base — MIT License</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/postcabinets-jp/knowledge-base" className="hover:text-slate-600">GitHub</Link>
            <Link href="/login" className="hover:text-slate-600">サインイン</Link>
            <span>Built by <Link href="https://postcabinets.co.jp" className="hover:text-slate-600">POST CABINETS</Link></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
