import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getHelpCenterAnalytics } from "@/app/actions/help-centers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Search, ThumbsUp, Eye } from "lucide-react"

interface Props {
  params: Promise<{ org: string; hc: string }>
}

export default async function AnalyticsPage({ params }: Props) {
  const { hc: hcSlug } = await params
  const supabase = await createClient()

  const { data: hc } = await supabase
    .from("help_centers")
    .select("id, name")
    .eq("slug", hcSlug)
    .single()

  if (!hc) notFound()

  const analytics = await getHelpCenterAnalytics(hc.id)

  // Recent search queries (last 30)
  const { data: recentSearches } = await supabase
    .from("search_queries")
    .select("query, result_count, created_at")
    .eq("help_center_id", hc.id)
    .order("created_at", { ascending: false })
    .limit(30)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">アナリティクス</h1>
        <p className="mt-1 text-sm text-slate-500">{hc.name}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-slate-500">総検索数</p>
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{analytics.totalSearches.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-slate-500">ゼロ結果率</p>
              <TrendingDown className={`w-3.5 h-3.5 ${analytics.zeroResultRate > 20 ? "text-red-400" : "text-slate-400"}`} />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{analytics.zeroResultRate}%</p>
            <p className="text-xs text-slate-400 mt-1">20%以下が目標</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-slate-500">フィードバック数</p>
              <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{analytics.totalFeedback.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-slate-500">有用性スコア</p>
              <TrendingUp className={`w-3.5 h-3.5 ${analytics.helpfulnessRate > 70 ? "text-green-400" : "text-amber-400"}`} />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{analytics.helpfulnessRate}%</p>
            <p className="text-xs text-slate-400 mt-1">70%以上が目標</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Zero result queries */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">ゼロ結果クエリ TOP 10</CardTitle>
            <p className="text-xs text-slate-400">これらのキーワードで記事を作成することを推奨</p>
          </CardHeader>
          <CardContent className="pt-0">
            {analytics.topZeroResults.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">データがありません</p>
            ) : (
              <div className="space-y-2">
                {analytics.topZeroResults.map(({ query, count }) => (
                  <div key={query} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-700">&ldquo;{query}&rdquo;</span>
                    <Badge variant="outline" className="text-xs">{count}件</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top articles */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">閲覧数トップ 10</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {analytics.topArticles.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">データがありません</p>
            ) : (
              <div className="space-y-2">
                {analytics.topArticles.map((a, i) => {
                  const total = a.helpful_count + a.not_helpful_count
                  const helpfulRate = total > 0 ? Math.round((a.helpful_count / total) * 100) : null

                  return (
                    <div key={a.id} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
                      <span className="text-xs text-slate-300 w-4 shrink-0">{i + 1}</span>
                      <span className="text-sm text-slate-700 flex-1 truncate">{a.title}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {a.view_count.toLocaleString()}
                        </span>
                        {helpfulRate !== null && (
                          <span className={`text-xs ${helpfulRate >= 70 ? "text-green-600" : "text-amber-600"}`}>
                            {helpfulRate}%
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent searches */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">最近の検索クエリ（直近30件）</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {(!recentSearches || recentSearches.length === 0) ? (
            <p className="text-sm text-slate-400 py-6 text-center">データがありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-medium text-slate-400 py-2 pr-4">クエリ</th>
                    <th className="text-right text-xs font-medium text-slate-400 py-2 pr-4">結果数</th>
                    <th className="text-right text-xs font-medium text-slate-400 py-2">日時</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentSearches.map(s => (
                    <tr key={`${s.query}-${s.created_at}`} className="hover:bg-slate-50">
                      <td className="py-2 pr-4 text-slate-700">{s.query}</td>
                      <td className="py-2 pr-4 text-right">
                        {s.result_count === 0 ? (
                          <Badge variant="outline" className="text-xs text-red-500 border-red-200">0件</Badge>
                        ) : (
                          <span className="text-xs text-slate-400">{s.result_count}件</span>
                        )}
                      </td>
                      <td className="py-2 text-right text-xs text-slate-400">
                        {new Date(s.created_at).toLocaleString("ja-JP", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
