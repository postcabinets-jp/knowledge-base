import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SearchBar } from "@/components/public/search-bar"
import { BookOpen } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("help_centers")
    .select("name, seo_title, seo_description")
    .eq("slug", slug)
    .single()

  return {
    title: data?.seo_title ?? `${data?.name ?? "ヘルプセンター"}`,
    description: data?.seo_description ?? undefined,
  }
}

export default async function HelpCenterPublicPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: hc } = await supabase
    .from("help_centers")
    .select("*, organizations(name)")
    .eq("slug", slug)
    .eq("is_public", true)
    .single()

  if (!hc) notFound()

  const { data: categories } = await supabase
    .from("categories")
    .select("*, sections(*, articles(id, title, status))")
    .eq("help_center_id", hc.id)
    .order("sort_order", { ascending: true })

  // Count published articles per category
  const categoriesWithCount = (categories ?? []).map(cat => {
    const published = (cat.sections ?? []).flatMap((s: { articles: { status: string }[] }) =>
      (s.articles ?? []).filter(a => a.status === "published")
    ).length
    return { ...cat, articleCount: published }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="py-16 px-4 text-center"
        style={{ backgroundColor: hc.primary_color ?? "#0F172A" }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-semibold text-white">{hc.name}</h1>
          {hc.description && (
            <p className="text-slate-300 text-base">{hc.description}</p>
          )}
          <SearchBar hcSlug={slug} placeholder="何をお探しですか？" />
        </div>
      </header>

      {/* Categories */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {categoriesWithCount.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p>まだ記事がありません</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithCount.map(cat => (
              <Link
                key={cat.id}
                href={`/help/${slug}/${cat.slug}`}
                className="group p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <BookOpen className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900 text-sm group-hover:text-slate-700">{cat.name}</h2>
                    {cat.description && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">{cat.articleCount}件の記事</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center">
        <p className="text-xs text-slate-400">
          Powered by{" "}
          <Link href="/" className="hover:text-slate-600">knowledge-base</Link>
        </p>
      </footer>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: hc.name,
            description: hc.description,
          }),
        }}
      />
    </div>
  )
}
