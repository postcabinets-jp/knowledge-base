"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { HelpCenter } from "@/types/database"

export async function createHelpCenter(orgId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string | null

  if (!name?.trim() || !slug?.trim()) {
    return { error: "名前とスラッグは必須です" }
  }

  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(slug)) {
    return { error: "スラッグは英小文字・数字・ハイフンのみ使用できます" }
  }

  const { data, error } = await supabase
    .from("help_centers")
    .insert({
      org_id: orgId,
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return { error: "このスラッグは既に使用されています" }
    return { error: error.message }
  }

  revalidatePath(`/dashboard`)
  return { data }
}

export async function updateHelpCenter(hcId: string, updates: Partial<HelpCenter>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from("help_centers")
    .update(updates)
    .eq("id", hcId)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/dashboard")
  return { data }
}

export async function getHelpCenters(orgId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("help_centers")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function getHelpCenterBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("help_centers")
    .select("*, organizations(name, slug)")
    .eq("slug", slug)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getHelpCenterAnalytics(hcId: string) {
  const supabase = await createClient()

  const [articlesRes, feedbackRes, searchRes] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, view_count, helpful_count, not_helpful_count, status, updated_at")
      .eq("help_center_id", hcId)
      .is("deleted_at", null)
      .order("view_count", { ascending: false })
      .limit(10),

    supabase
      .from("article_feedback")
      .select("is_helpful, created_at, articles!inner(help_center_id)")
      .eq("articles.help_center_id", hcId),

    supabase
      .from("search_queries")
      .select("query, result_count, created_at")
      .eq("help_center_id", hcId)
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  const zeroResultQueries = (searchRes.data ?? [])
    .filter(q => q.result_count === 0)
    .reduce<Record<string, number>>((acc, q) => {
      acc[q.query] = (acc[q.query] ?? 0) + 1
      return acc
    }, {})

  const topZeroResults = Object.entries(zeroResultQueries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }))

  const totalSearches = searchRes.data?.length ?? 0
  const zeroResults = (searchRes.data ?? []).filter(q => q.result_count === 0).length

  const totalFeedback = feedbackRes.data?.length ?? 0
  const helpfulFeedback = (feedbackRes.data ?? []).filter(f => f.is_helpful).length
  const helpfulnessRate = totalFeedback > 0 ? Math.round((helpfulFeedback / totalFeedback) * 100) : 0

  return {
    topArticles: articlesRes.data ?? [],
    topZeroResults,
    totalSearches,
    zeroResultRate: totalSearches > 0 ? Math.round((zeroResults / totalSearches) * 100) : 0,
    helpfulnessRate,
    totalFeedback,
  }
}
