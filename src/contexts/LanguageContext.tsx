"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'hi' | 'kn'

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (lang: Language) => void
  languages: { code: Language; name: string; native: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  const languages = [
    { code: 'en' as Language, name: 'English', native: 'English' },
    { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी' },
    { code: 'kn' as Language, name: 'Kannada', native: 'ಕನ್ನಡ' }
  ]

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem('cogni-language')
    if (saved && ['en', 'hi', 'kn'].includes(saved)) {
      setCurrentLanguage(saved as Language)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    localStorage.setItem('cogni-language', lang)
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}