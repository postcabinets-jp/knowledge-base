import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getHelpCenterAnalytics } from "@/app/actions/help-centers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart2, ThumbsUp, Search, AlertTriangle, Plus, ExternalLink } from "lucide-react"

interface Props {
  params: Promise<{ org: string; hc: string }>
}

export default async function HelpCenterPage({ params }: Props) {
  const { org: orgSlug, hc: hcSlug } = await params
  const supabase = await createClient()

  const { data: hc } = await supabase
    .from("help_centers")
    .select("*, organizations!inner(slug, name)")
    .eq("slug", hcSlug)
    .single()

  if (!hc) notFound()

  const analytics = await getHelpCenterAnalytics(hc.id)

  const { count: draftCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("help_center_id", hc.id)
    .eq("status", "draft")
    .is("deleted_at", null)

  const { count: reviewCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("help_center_id", hc.id)
    .eq("status", "in_review")
    .is("deleted_at", null)

  const { count: publishedCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("help_center_id", hc.id)
    .eq("status", "published")
    .is("deleted_at", null)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-400">{(hc.organizations as { name: string }).name}</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-600 font-medium">{hc.name}</span>
            {hc.is_public && <Badge variant="secondary" className="text-xs py-0">公開中</Badge>}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{hc.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/help/${hc.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              公開ページを表示
            </Button>
          </Link>
          <Link href={`/dashboard/${orgSlug}/${hcSlug}/articles/new`}>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              記事を作成
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="公開記事" value={publishedCount ?? 0} icon={BookOpen} />
        <StatCard label="フィードバックスコア" value={`${analytics.helpfulnessRate}%`} icon={ThumbsUp} />
        <StatCard label="検索数（直近）" value={analytics.totalSearches} icon={Search} />
        <StatCard label="ゼロ件率" value={`${analytics.zeroResultRate}%`} icon={AlertTriangle} variant={analytics.zeroResultRate > 20 ? "warning" : "default"} />
      </div>

      {/* Status overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatusCard
          label="下書き"
          count={draftCount ?? 0}
          href={`/dashboard/${orgSlug}/${hcSlug}/articles?status=draft`}
          color="bg-slate-100 text-slate-600"
        />
        <StatusCard
          label="レビュー待ち"
          count={reviewCount ?? 0}
          href={`/dashboard/${orgSlug}/${hcSlug}/articles?status=in_review`}
          color="bg-amber-50 text-amber-700"
        />
        <StatusCard
          label="公開中"
          count={publishedCount ?? 0}
          href={`/dashboard/${orgSlug}/${hcSlug}/articles?status=published`}
          color="bg-green-50 text-green-700"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top articles */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">閲覧数トップ記事</CardTitle>
              <Link href={`/dashboard/${orgSlug}/${hcSlug}/analytics`}>
                <Button variant="ghost" size="sm" className="text-xs h-7">詳細</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {analytics.topArticles.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">記事がありません</p>
            ) : (
              <div className="space-y-2">
                {analytics.topArticles.slice(0, 5).map(a => (
                  <div key={a.id} className="flex items-center justify-between py-1">
                    <Link
                      href={`/dashboard/${orgSlug}/${hcSlug}/articles/${a.id}`}
                      className="text-sm text-slate-700 hover:text-slate-900 truncate flex-1"
                    >
                      {a.title}
                    </Link>
                    <span className="text-xs text-slate-400 ml-2 shrink-0">{a.view_count.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zero-result queries */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">ゼロ結果クエリ</CardTitle>
              <Link href={`/dashboard/${orgSlug}/${hcSlug}/analytics`}>
                <Button variant="ghost" size="sm" className="text-xs h-7">詳細</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {analytics.topZeroResults.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">データがありません</p>
            ) : (
              <div className="space-y-2">
                {analytics.topZeroResults.map(({ query, count }) => (
                  <div key={query} className="flex items-center justify-between py-1">
                    <span className="text-sm text-slate-700 truncate flex-1">&ldquo;{query}&rdquo;</span>
                    <Badge variant="outline" className="text-xs ml-2 shrink-0">{count}回</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  label, value, icon: Icon, variant = "default"
}: {
  label: string
  value: string | number
  icon: React.ElementType
  variant?: "default" | "warning"
}) {
  return (
    <Card className={`bg-white border-slate-200 ${variant === "warning" ? "border-amber-200" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
          </div>
          <div className={`p-1.5 rounded-md ${variant === "warning" ? "bg-amber-50" : "bg-slate-50"}`}>
            <Icon className={`w-4 h-4 ${variant === "warning" ? "text-amber-500" : "text-slate-400"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusCard({ label, count, href, color }: { label: string; count: number; href: string; color: string }) {
  return (
    <Link href={href}>
      <Card className="bg-white border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
        <CardContent className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${color}`}>{count}</span>
        </CardContent>
      </Card>
    </Link>
  )
}
