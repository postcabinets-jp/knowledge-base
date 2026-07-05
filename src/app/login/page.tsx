import Link from "next/link"
import { LoginForm } from "./login-form"

export const metadata = {
  title: "ログイン | knowledge-base",
}

export default function LoginPage() {
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
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">サインイン</h1>
          <p className="mt-2 text-sm text-slate-500">
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="text-slate-900 font-medium hover:underline">
              新規登録
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
