"use client"

import { useState } from "react"
import Link from "next/link"
import { resetPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await resetPassword(formData)
    if (result?.error) setError(result.error)
    else if (result?.success) setSuccess(result.success)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
            <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#0F172A"/>
              <path d="M7 14h14M14 7v14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            knowledge-base
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">パスワードのリセット</h1>
          <p className="mt-2 text-sm text-slate-500">
            登録済みのメールアドレスにリセットリンクを送信します
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
              {success}
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full">サインインページへ戻る</Button>
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-10" />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
            )}
            <Button type="submit" className="w-full h-10 bg-slate-900 hover:bg-slate-800" disabled={loading}>
              {loading ? "送信中..." : "リセットメールを送信"}
            </Button>
            <p className="text-center text-sm text-slate-500">
              <Link href="/login" className="hover:text-slate-900 hover:underline">サインインに戻る</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
