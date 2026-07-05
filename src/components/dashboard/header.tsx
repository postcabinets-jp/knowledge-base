"use client"

import { signOut } from "@/app/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@supabase/supabase-js"
import { LogOut, Settings, User as UserIcon } from "lucide-react"

export function DashboardHeader({ user }: { user: User }) {
  const initials = (user.user_metadata?.full_name as string | undefined)
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? user.email?.[0]?.toUpperCase() ?? "U"

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-end px-6 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 h-8 px-2 rounded-md hover:bg-slate-50 transition-colors outline-none">
          <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">
            {initials}
          </div>
          <span className="text-sm text-slate-600 hidden sm:block">
            {(user.user_metadata?.full_name as string | undefined) ?? user.email}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <UserIcon className="w-4 h-4 text-slate-400" />
            プロフィール
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4 text-slate-400" />
            設定
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600">
            <form action={signOut} className="flex items-center gap-2 w-full">
              <LogOut className="w-4 h-4" />
              <button type="submit" className="w-full text-left">サインアウト</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
