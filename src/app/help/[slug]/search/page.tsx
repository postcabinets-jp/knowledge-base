import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SearchBar } from "@/components/public/search-bar"
import { FileText, Search } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { q } = await searchParams
  const supabase = await createClient()

  const { data: hc } = await supabase
    .from("help_centers")
    .select("id, name, slug, primary_color")
    .eq("slug", slug)
    .eq("is_public", true)
    .single()

  if (!hc) notFound()

  let results: Array<{ id: string; title: string; slug: string; content_text: string | null }> = []
  let zeroResults = false

  if (q && q.trim()) {
    const { data } = await supabase.rpc("search_articles", {
      p_help_center_id: hc.id,
      p_query: q.trim(),
      p_limit: 15,
    })
    results = (data ?? []) as typeof results
    zeroResults = results.length === 0

    // Track search
    await supabase.from("search_queries").insert({
      help_center_id: hc.id,
      query: q.trim(),
      result_count: results.length,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="py-10 px-4" style={{ backgroundColor: hc.primary_color ?? "#0F172A" }}>
        <div className="max-w-2xl mx-auto space-y-4">
          <Link href={`/help/${slug}`} className="text-slate-300 hover:text-white text-sm">
            ← {hc.name}
          </Link>
          <SearchBar hcSlug={slug} initialValue={q ?? ""} placeholder="何をお探しですか？" autoFocus />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {!q ? (
          <div className="text-center py-16 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p>キーワードを入力して検索</p>
          </div>
        ) : zeroResults ? (
          <div className="text-center py-16">
            <div className="text-slate-400 mb-4">
              <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-slate-700">&ldquo;{q}&rdquo; に一致する記事がありません</p>
              <p className="text-sm mt-2">別のキーワードでお試しください</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-500 mb-6">&ldquo;{q}&rdquo; の検索結果 — {results.length}件</p>
            <div className="space-y-4">
              {results.map(article => (
                <Link
                  key={article.id}
                  href={`/help/${slug}/articles/${article.slug}`}
                  className="block p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <h2 className="font-medium text-slate-900 text-sm">{article.title}</h2>
                      {article.content_text && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {article.content_text.slice(0, 200)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
