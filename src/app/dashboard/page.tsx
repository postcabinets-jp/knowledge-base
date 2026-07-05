import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getMyOrganizations } from "@/app/actions/organizations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Building2, BookOpen, BarChart2 } from "lucide-react"

export const metadata = { title: "ダッシュボード | knowledge-base" }

export default async function DashboardPage() {
  const orgs = await getMyOrganizations()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">ダッシュボード</h1>
          <p className="mt-1 text-sm text-slate-500">組織とヘルプセンターを管理します</p>
        </div>
        <Link href="/dashboard/new-org">
          <Button className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-1.5" />
            新規組織
          </Button>
        </Link>
      </div>

      {orgs.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-white">
          <CardContent className="py-16 text-center">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-slate-700 mb-2">組織がありません</h2>
            <p className="text-sm text-slate-400 mb-6">
              新しい組織を作成してヘルプセンターを立ち上げましょう
            </p>
            <Link href="/dashboard/new-org">
              <Button className="bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-1.5" />
                最初の組織を作成
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orgs.map(org => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  )
}

async function OrgCard({ org }: { org: { id: string; name: string; slug: string; plan: string; role: string } }) {
  const supabase = await createClient()

  const { data: helpCenters } = await supabase
    .from("help_centers")
    .select("id, name, slug, is_public")
    .eq("org_id", org.id)

  const { count: articleCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .in("help_center_id", helpCenters?.map(h => h.id) ?? [])
    .is("deleted_at", null)

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold text-sm">
              {org.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">{org.name}</CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">{org.slug}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs capitalize">{org.role}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{org.plan}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {helpCenters?.length ?? 0} ヘルプセンター
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" />
            {articleCount ?? 0} 記事
          </span>
        </div>

        <div className="space-y-2">
          {helpCenters?.map(hc => (
            <div key={hc.id} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">{hc.name}</span>
                {hc.is_public && <Badge variant="secondary" className="text-xs py-0">公開</Badge>}
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/help/${hc.slug}`} target="_blank">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500">プレビュー</Button>
                </Link>
                <Link href={`/dashboard/${org.slug}/${hc.slug}`}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">管理</Button>
                </Link>
              </div>
            </div>
          ))}
          <Link href={`/dashboard/${org.slug}/new-hc`}>
            <Button variant="outline" size="sm" className="w-full mt-1 text-xs border-dashed">
              <Plus className="w-3.5 h-3.5 mr-1" />
              ヘルプセンターを追加
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
