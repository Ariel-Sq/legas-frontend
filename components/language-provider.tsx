"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Locale, type TranslationKeys } from "@/lib/translations"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const value = {
    locale,
    setLocale,
    t: translations[locale],
  }

  if (!mounted) {
    return <>{children}</>
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
