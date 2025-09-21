"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Type, Eye, Volume2, Zap, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAccessibility } from '@/contexts/AccessibilityContext'

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSettings, speak } = useAccessibility()

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value })
    
    // Provide voice feedback for changes
    if (settings.voiceGuidance) {
      speak(`${key} changed to ${value}`)
    }
  }

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true)
          speak('Accessibility settings opened')
        }}
        className="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false)
                speak('Accessibility settings closed')
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Accessibility Settings
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                      speak('Accessibility settings closed')
                    }}
                    aria-label="Close accessibility settings"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Type className="w-4 h-4 mr-2" />
                      Text Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['normal', 'large', 'extra-large'].map((size) => (
                        <Button
                          key={size}
                          variant={settings.fontSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSettingChange('fontSize', size)}
                          className="text-xs"
                        >
                          {size === 'normal' ? 'Normal' : 
                           size === 'large' ? 'Large' : 'Extra Large'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Eye className="w-4 h-4 mr-2" />
                      Contrast
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['normal', 'high'].map((contrast) => (
                        <Button
                          key={contrast}
                          variant={settings.contrast === contrast ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSettingChange('contrast', contrast)}
                          className="text-xs"
                        >
                          {contrast === 'normal' ? 'Normal' : 'High Contrast'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Guidance */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Voice Guidance
                    </label>
                    <Button
                      variant={settings.voiceGuidance ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newValue = !settings.voiceGuidance
                        handleSettingChange('voiceGuidance', newValue)
                        if (newValue) {
                          speak('Voice guidance enabled')
                        }
                      }}
                      className="w-full"
                    >
                      {settings.voiceGuidance ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  {/* Reduced Motion */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Zap className="w-4 h-4 mr-2" />
                      Animation
                    </label>
                    <Button
                      variant={settings.reducedMotion ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                      className="w-full"
                    >
                      {settings.reducedMotion ? 'Reduced Motion' : 'Normal Motion'}
                    </Button>
                  </div>

                  {/* Test Voice */}
                  <div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => speak('This is a test of the voice guidance feature. You can enable or disable this in the accessibility settings.')}
                      className="w-full"
                      disabled={!settings.voiceGuidance}
                    >
                      Test Voice Guidance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}