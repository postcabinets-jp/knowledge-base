import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ArticleFeedbackButtons } from "@/components/public/article-feedback"
import { ArrowLeft, Clock, Eye } from "lucide-react"

interface Props {
  params: Promise<{ slug: string; articleSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, articleSlug } = await params
  const supabase = await createClient()

  const { data: hc } = await supabase
    .from("help_centers")
    .select("id")
    .eq("slug", slug)
    .single()

  if (!hc) return {}

  const { data } = await supabase
    .from("articles")
    .select("title, seo_title, seo_description, content_text")
    .eq("help_center_id", hc.id)
    .eq("slug", articleSlug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single()

  return {
    title: data?.seo_title ?? data?.title,
    description: data?.seo_description ?? data?.content_text?.slice(0, 160),
  }
}

function renderContent(content: unknown[]): string {
  if (!Array.isArray(content)) return ""

  return content.map(block => {
    const b = block as Record<string, unknown>
    const innerContent = b.content as Array<{type: string; text?: string; content?: unknown[]}> | undefined

    if (b.type === "heading") {
      const level = (b.attrs as Record<string, number> | undefined)?.level ?? 2
      const text = innerContent?.map(n => n.text ?? "").join("") ?? ""
      return `<h${level} class="font-semibold text-slate-900 mt-6 mb-3">${text}</h${level}>`
    }
    if (b.type === "paragraph") {
      const text = innerContent?.map(n => n.text ?? "").join("") ?? ""
      return text ? `<p class="text-slate-600 leading-relaxed mb-4">${text}</p>` : ""
    }
    if (b.type === "codeBlock") {
      const text = innerContent?.map(n => n.text ?? "").join("") ?? ""
      return `<pre class="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto mb-4"><code class="text-sm font-mono text-slate-700">${text}</code></pre>`
    }
    if (b.type === "bulletList") {
      const items = innerContent?.map(item => {
        const itemContent = (item as Record<string, unknown>).content as Array<{content?: Array<{text?: string}>}> | undefined
        const text = itemContent?.[0]?.content?.map(n => n.text ?? "").join("") ?? ""
        return `<li class="text-slate-600 mb-1">${text}</li>`
      }).join("") ?? ""
      return `<ul class="list-disc list-inside space-y-1 mb-4 pl-2">${items}</ul>`
    }
    if (b.type === "callout") {
      const type = (b.attrs as Record<string, string> | undefined)?.type ?? "info"
      const text = innerContent?.flatMap(n => (n as Record<string, unknown>).content as Array<{text?: string}> | undefined ?? []).map(n => n.text ?? "").join("") ?? ""
      const colors: Record<string, string> = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        danger: "bg-red-50 border-red-200 text-red-800",
      }
      return `<div class="border rounded-lg p-4 mb-4 ${colors[type] ?? colors.info}">${text}</div>`
    }
    return ""
  }).join("")
}

export default async function ArticlePage({ params }: Props) {
  const { slug, articleSlug } = await params
  const supabase = await createClient()

  const { data: hc } = await supabase
    .from("help_centers")
    .select("id, name, slug, primary_color")
    .eq("slug", slug)
    .single()

  if (!hc) notFound()

  const { data: article } = await supabase
    .from("articles")
    .select("*, sections(name, categories(name, slug))")
    .eq("help_center_id", hc.id)
    .eq("slug", articleSlug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single()

  if (!article) notFound()

  // Increment view count (fire and forget)
  await supabase.rpc("increment_view_count", { article_id: article.id }).then(() => {})

  const htmlContent = renderContent(article.content as unknown[])

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 sticky top-0 bg-white z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link href={`/help/${slug}`} className="hover:text-slate-900">{hc.name}</Link>
          {(article.sections as { name: string; categories: { name: string; slug: string } } | null) && (
            <>
              <span className="text-slate-300">/</span>
              <Link
                href={`/help/${slug}/${(article.sections as { categories: { slug: string } }).categories.slug}`}
                className="hover:text-slate-900"
              >
                {(article.sections as { categories: { name: string } }).categories.name}
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {article.published_at && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(article.published_at).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.view_count.toLocaleString()}回閲覧
              </span>
            </div>
          </header>

          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        {/* Feedback */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <ArticleFeedbackButtons articleId={article.id} />
        </div>
      </main>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.seo_description ?? article.content_text?.slice(0, 160),
            datePublished: article.published_at,
            dateModified: article.updated_at,
          }),
        }}
      />
    </div>
  )
}
