import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })

  const supabase = await createClient()
  const { data } = await supabase
    .from("help_centers")
    .select("id")
    .eq("slug", slug)
    .single()

  return NextResponse.json({ hcId: data?.id ?? null })
}
