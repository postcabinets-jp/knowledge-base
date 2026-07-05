"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Organization } from "@/types/database"

export async function createOrganization(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  if (!name?.trim() || !slug?.trim()) {
    return { error: "名前とスラッグは必須です" }
  }

  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(slug)) {
    return { error: "スラッグは英小文字・数字・ハイフンのみ使用できます" }
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({ name: name.trim(), slug: slug.trim(), owner_id: user.id })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") return { error: "このスラッグは既に使用されています" }
    return { error: error.message }
  }

  // Add owner as member
  await supabase.from("organization_members").insert({
    org_id: data.id,
    user_id: user.id,
    role: "owner",
  })

  revalidatePath("/dashboard")
  return { data }
}

export async function updateOrganization(orgId: string, updates: Partial<Organization>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from("organizations")
    .update(updates)
    .eq("id", orgId)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/org/${orgId}`)
  return { data }
}

export async function getMyOrganizations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("organization_members")
    .select("role, organizations(*)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((m: any) => ({
    ...(m.organizations as Organization),
    role: m.role as Organization["plan"],
  }))
}
