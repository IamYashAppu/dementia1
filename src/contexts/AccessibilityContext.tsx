"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large'
  contrast: 'normal' | 'high'
  voiceGuidance: boolean
  reducedMotion: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void
  speak: (text: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    contrast: 'normal',
    voiceGuidance: false,
    reducedMotion: false
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cogni-accessibility')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load accessibility settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('cogni-accessibility', JSON.stringify(settings))
    applySettings(settings)
  }, [settings])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const speak = (text: string) => {
    if (settings.voiceGuidance && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, speak }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement

  // Apply font size
  root.classList.remove('text-normal', 'text-large', 'text-extra-large')
  root.classList.add(`text-${settings.fontSize}`)

  // Apply contrast
  root.classList.remove('contrast-normal', 'contrast-high')
  root.classList.add(`contrast-${settings.contrast}`)

  // Apply reduced motion
  if (settings.reducedMotion) {
    root.style.setProperty('--animation-duration', '0.01ms')
  } else {
    root.style.removeProperty('--animation-duration')
  }
}