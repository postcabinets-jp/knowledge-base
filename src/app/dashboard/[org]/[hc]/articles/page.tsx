import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye, ThumbsUp } from "lucide-react"
import type { ArticleStatus } from "@/types/database"

interface Props {
  params: Promise<{ org: string; hc: string }>
  searchParams: Promise<{ status?: string }>
}

const statusColors: Record<ArticleStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  in_review: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  published: "bg-green-50 text-green-700",
  archived: "bg-slate-100 text-slate-400",
}

const statusLabels: Record<ArticleStatus, string> = {
  draft: "下書き",
  in_review: "レビュー待ち",
  approved: "承認済み",
  published: "公開中",
  archived: "アーカイブ",
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const { org: orgSlug, hc: hcSlug } = await params
  const { status } = await searchParams
  const supabase = await createClient()

  const { data: hc } = await supabase
    .from("help_centers")
    .select("id, name")
    .eq("slug", hcSlug)
    .single()

  if (!hc) notFound()

  let query = supabase
    .from("articles")
    .select("*, sections(name)")
    .eq("help_center_id", hc.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })

  if (status) query = query.eq("status", status)

  const { data: articles } = await query

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">記事</h1>
          <p className="mt-1 text-sm text-slate-500">{hc.name}</p>
        </div>
        <Link href={`/dashboard/${orgSlug}/${hcSlug}/articles/new`}>
          <Button className="bg-slate-900 hover:bg-slate-800 gap-1.5">
            <Plus className="w-4 h-4" />
            新規作成
          </Button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 border-b border-slate-200 pb-0">
        {[undefined, "draft", "in_review", "approved", "published", "archived"].map(s => (
          <Link
            key={s ?? "all"}
            href={`/dashboard/${orgSlug}/${hcSlug}/articles${s ? `?status=${s}` : ""}`}
            className={`px-3 py-2 text-sm rounded-t-md -mb-px transition-colors ${
              status === s || (!status && !s)
                ? "border border-b-white border-slate-200 bg-white text-slate-900 font-medium"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {s ? statusLabels[s as ArticleStatus] : "すべて"}
          </Link>
        ))}
      </div>

      {/* Article list */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {(!articles || articles.length === 0) ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-400 mb-4">記事がありません</p>
            <Link href={`/dashboard/${orgSlug}/${hcSlug}/articles/new`}>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-3.5 h-3.5 mr-1.5" />最初の記事を作成
              </Button>
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">タイトル</th>
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-3 hidden md:table-cell">ステータス</th>
                <th className="text-left text-xs font-medium text-slate-400 px-4 py-3 hidden lg:table-cell">セクション</th>
                <th className="text-right text-xs font-medium text-slate-400 px-4 py-3 hidden md:table-cell">閲覧</th>
                <th className="text-right text-xs font-medium text-slate-400 px-4 py-3 hidden md:table-cell">評価</th>
                <th className="text-right text-xs font-medium text-slate-400 px-4 py-3">更新</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/${orgSlug}/${hcSlug}/articles/${article.id}`}
                      className="text-sm font-medium text-slate-800 hover:text-slate-900"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[article.status as ArticleStatus]}`}>
                      {statusLabels[article.status as ArticleStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-slate-400">
                      {(article.sections as { name: string } | null)?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <Eye className="w-3 h-3" />
                      {article.view_count.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {article.helpful_count + article.not_helpful_count > 0
                        ? `${Math.round((article.helpful_count / (article.helpful_count + article.not_helpful_count)) * 100)}%`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-slate-400">
                      {new Date(article.updated_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
