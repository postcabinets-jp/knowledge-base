"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface SearchBarProps {
  hcSlug: string
  placeholder?: string
  initialValue?: string
  autoFocus?: boolean
}

export function SearchBar({ hcSlug, placeholder = "検索...", initialValue = "", autoFocus = false }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/help/${hcSlug}/search?q=${encodeURIComponent(value.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent shadow-sm"
        />
      </div>
    </form>
  )
}
