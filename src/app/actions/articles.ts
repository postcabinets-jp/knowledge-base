"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Article, ArticleStatus } from "@/types/database"

function extractTextFromContent(content: unknown[]): string {
  if (!Array.isArray(content)) return ""
  return content
    .map((block: unknown) => {
      if (typeof block !== "object" || block === null) return ""
      const b = block as Record<string, unknown>
      if (b.type === "paragraph" || b.type === "heading") {
        const innerContent = b.content as Array<{type: string; text?: string}> | undefined
        return innerContent?.map(n => n.text ?? "").join("") ?? ""
      }
      if (b.type === "codeBlock") {
        const innerContent = b.content as Array<{type: string; text?: string}> | undefined
        return innerContent?.map(n => n.text ?? "").join("") ?? ""
      }
      return ""
    })
    .filter(Boolean)
    .join(" ")
}

export async function createArticle(helpCenterId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const sectionId = formData.get("section_id") as string | null
  const content = JSON.parse(formData.get("content") as string || "[]")
  const contentText = extractTextFromContent(content)

  if (!title?.trim()) return { error: "タイトルは必須です" }

  const finalSlug = slug?.trim() || title.trim().toLowerCase()
    .replace(/[^a-z0-9ぁ-ん一-龥]/g, "-")
    .replace(/-+/g, "-")

  const { data, error } = await supabase
    .from("articles")
    .insert({
      help_center_id: helpCenterId,
      section_id: sectionId || null,
      title: title.trim(),
      slug: finalSlug,
      content,
      content_text: contentText,
      status: "draft",
      created_by: user.id,
      last_edited_by: user.id,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return { error: "このスラッグは既に使用されています" }
    return { error: error.message }
  }

  // Save initial version
  await supabase.from("article_versions").insert({
    article_id: data.id,
    title: data.title,
    content: data.content,
    content_text: contentText,
    status: data.status,
    edited_by: user.id,
    change_summary: "初版作成",
  })

  revalidatePath(`/dashboard`)
  return { data }
}

export async function updateArticle(
  articleId: string,
  updates: {
    title?: string
    content?: unknown[]
    status?: ArticleStatus
    section_id?: string | null
    seo_title?: string
    seo_description?: string
    expires_at?: string | null
    change_summary?: string
  }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const contentText = updates.content ? extractTextFromContent(updates.content) : undefined

  const { data, error } = await supabase
    .from("articles")
    .update({
      ...updates,
      content_text: contentText,
      last_edited_by: user.id,
      published_at: updates.status === "published"
        ? new Date().toISOString()
        : undefined,
    })
    .eq("id", articleId)
    .select()
    .single()

  if (error) return { error: error.message }

  // Save version snapshot
  await supabase.from("article_versions").insert({
    article_id: articleId,
    title: data.title,
    content: data.content,
    content_text: contentText ?? null,
    status: data.status,
    edited_by: user.id,
    change_summary: updates.change_summary ?? null,
  })

  revalidatePath(`/dashboard`)
  return { data }
}

export async function deleteArticle(articleId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { error } = await supabase
    .from("articles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", articleId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getArticles(helpCenterId: string, filters?: {
  status?: ArticleStatus
  sectionId?: string
  labelId?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("articles")
    .select("*, sections(name, categories(name))")
    .eq("help_center_id", helpCenterId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.sectionId) query = query.eq("section_id", filters.sectionId)

  const { data, error } = await query
  if (error) return { error: error.message }
  return { data }
}

export async function getArticle(articleId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("articles")
    .select("*, sections(*, categories(*)), article_versions(*), article_labels(label_id, labels(*))")
    .eq("id", articleId)
    .is("deleted_at", null)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function submitArticleFeedback(articleId: string, isHelpful: boolean, comment?: string, fingerprint?: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("article_feedback").insert({
    article_id: articleId,
    is_helpful: isHelpful,
    comment: comment ?? null,
    visitor_fingerprint: fingerprint ?? null,
  })

  // Update counters
  if (!error) {
    if (isHelpful) {
      await supabase.rpc("increment_helpful_count", { article_id: articleId })
    } else {
      await supabase.rpc("increment_not_helpful_count", { article_id: articleId })
    }
  }

  return error ? { error: error.message } : { success: true }
}

export async function trackArticleView(articleId: string) {
  const supabase = await createClient()
  await supabase.rpc("increment_view_count", { article_id: articleId })
}

export async function searchArticles(helpCenterId: string, query: string, sessionId?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("search_articles", {
    p_help_center_id: helpCenterId,
    p_query: query,
    p_limit: 10,
  })

  // Track search query
  await supabase.from("search_queries").insert({
    help_center_id: helpCenterId,
    query,
    result_count: data?.length ?? 0,
    session_id: sessionId ?? null,
  })

  if (error) return { data: [] as Article[], error: error.message }
  return { data: data as Article[] }
}
