"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createCategory(helpCenterId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string | null
  const icon = formData.get("icon") as string | null

  if (!name?.trim()) return { error: "カテゴリ名は必須です" }

  const finalSlug = slug?.trim() || name.trim().toLowerCase().replace(/\s+/g, "-")

  const { data, error } = await supabase
    .from("categories")
    .insert({
      help_center_id: helpCenterId,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      icon: icon?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return { error: "このスラッグは既に使用されています" }
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { data }
}

export async function updateCategory(categoryId: string, updates: {
  name?: string
  description?: string | null
  icon?: string | null
  sort_order?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", categoryId)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/dashboard")
  return { data }
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { error } = await supabase.from("categories").delete().eq("id", categoryId)
  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function createSection(categoryId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string | null

  if (!name?.trim()) return { error: "セクション名は必須です" }

  const finalSlug = slug?.trim() || name.trim().toLowerCase().replace(/\s+/g, "-")

  const { data, error } = await supabase
    .from("sections")
    .insert({
      category_id: categoryId,
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return { error: "このスラッグは既に使用されています" }
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { data }
}

export async function getCategoriesWithSections(helpCenterId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*, sections(*)")
    .eq("help_center_id", helpCenterId)
    .order("sort_order", { ascending: true })

  if (error) return { error: error.message }
  return { data }
}
