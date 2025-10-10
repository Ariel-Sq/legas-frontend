"use client"

import { Search, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState, type FormEvent } from "react"
import { useLanguage } from "@/components/language-provider"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClear = () => {
    setQuery("")
    if (pathname === "/shop") {
      router.push("/shop")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        className="w-full pl-10 pr-10 py-2 rounded-lg bg-muted/50 border-transparent focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm cursor-text"
        placeholder={t.header.search}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
