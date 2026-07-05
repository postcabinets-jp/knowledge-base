"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Settings } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/articles", label: "記事", icon: BookOpen },
  { href: "/dashboard/settings", label: "設定", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-white">
              <path d="M3 8h10M8 3v10" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          knowledge-base
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(item => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
