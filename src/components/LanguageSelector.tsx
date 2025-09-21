"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLanguage, setLanguage, languages } = useLanguage()

  const currentLang = languages.find(lang => lang.code === currentLanguage)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Languages className="w-4 h-4" />
        <span>{currentLang?.native}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLanguage(language.code)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="font-medium">{language.name}</div>
                <div className="text-sm text-gray-500">{language.native}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}