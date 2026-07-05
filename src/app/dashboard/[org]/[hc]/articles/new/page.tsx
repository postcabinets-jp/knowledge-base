"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createArticle } from "@/app/actions/articles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

interface Props {
  params: Promise<{ org: string; hc: string }>
}

export default function NewArticlePage({ params }: Props) {
  const { org: orgSlug, hc: hcSlug } = use(params)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Get help center ID from context — simplified for MVP (would use server action to resolve slug)
    const formData = new FormData(e.currentTarget)
    formData.set("content", JSON.stringify([
      { type: "paragraph", content: [{ type: "text", text: body }] }
    ]))

    // We need the help_center_id — fetch from slug
    const response = await fetch(`/api/hc-id?slug=${hcSlug}`)
    const { hcId } = await response.json()

    const result = await createArticle(hcId, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(`/dashboard/${orgSlug}/${hcSlug}/articles`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href={`/dashboard/${orgSlug}/${hcSlug}/articles`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          記事一覧へ戻る
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">新規記事作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="記事のタイトルを入力"
                required
                className="h-11 text-base font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="body">本文</Label>
              <Textarea
                id="body"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="記事の内容を入力..."
                rows={16}
                className="resize-none font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-slate-400">Markdown形式で入力できます（フルエディタはPhase 2で追加予定）</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="slug">スラッグ（任意）</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="my-article-slug"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo_title">SEOタイトル（任意）</Label>
                <Input
                  id="seo_title"
                  name="seo_title"
                  placeholder="検索エンジン向けタイトル"
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" className="bg-slate-900 hover:bg-slate-800 gap-1.5" disabled={loading || !title}>
            <Save className="w-4 h-4" />
            {loading ? "保存中..." : "下書きとして保存"}
          </Button>
          <Link href={`/dashboard/${orgSlug}/${hcSlug}/articles`}>
            <Button type="button" variant="outline">キャンセル</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
