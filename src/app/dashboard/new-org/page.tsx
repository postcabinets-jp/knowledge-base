"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createOrganization } from "@/app/actions/organizations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewOrgPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const router = useRouter()

  function handleNameChange(value: string) {
    setName(value)
    if (!slugManuallyEdited) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createOrganization(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードへ戻る
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">新しい組織を作成</h1>
        <p className="mt-1 text-sm text-slate-500">組織ごとに複数のヘルプセンターを管理できます</p>
      </div>

      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">組織情報</CardTitle>
          <CardDescription className="text-sm">後から変更できます</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="slug" value={slug} />
            <div className="space-y-1.5">
              <Label htmlFor="name">組織名</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="株式会社Acme"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug-display">URL スラッグ</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 shrink-0">knowledge-base.app/</span>
                <Input
                  id="slug-display"
                  value={slug}
                  onChange={e => {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    setSlugManuallyEdited(true)
                  }}
                  placeholder="acme"
                  required
                  className="h-10"
                />
              </div>
              <p className="text-xs text-slate-400">英小文字・数字・ハイフンのみ</p>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
            )}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800"
                disabled={loading || !name || !slug}
              >
                {loading ? "作成中..." : "組織を作成"}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline">キャンセル</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
