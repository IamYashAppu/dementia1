"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Calendar, Languages, ArrowRight, ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface UserProfile {
  name: string
  age: string
  language: string
  primaryConcerns: string[]
  hasUsedTechBefore: string
}

export default function AssessmentPage() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    language: 'english',
    primaryConcerns: [],
    hasUsedTechBefore: 'yes'
  })

  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ]

  const concerns = [
    'Memory issues',
    'Difficulty finding words', 
    'Trouble concentrating',
    'Confusion with daily tasks',
    'Changes in mood or behavior',
    'General health checkup'
  ]

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const toggleConcern = (concern: string) => {
    setProfile(prev => ({
      ...prev,
      primaryConcerns: prev.primaryConcerns.includes(concern)
        ? prev.primaryConcerns.filter(c => c !== concern)
        : [...prev.primaryConcerns, concern]
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return profile.name.trim().length > 0
      case 2: return profile.age.trim().length > 0
      case 3: return profile.language.length > 0
      case 4: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Let's Get Started
          </h1>
          <p className="text-lg text-gray-600">
            We'll need a few details to personalize your assessment experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 4</span>
            <span className="text-sm text-gray-600">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                {step === 1 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What's your name?</h2>
                    <p className="text-gray-600 mb-6">This helps us personalize your experience</p>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What's your age?</h2>
                    <p className="text-gray-600 mb-6">This helps us tailor the assessment appropriately</p>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Enter your age"
                      min="18"
                      max="120"
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Languages className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Preferred Language</h2>
                    <p className="text-gray-600 mb-6">Choose the language you're most comfortable with</p>
                    <div className="grid gap-4">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setProfile(prev => ({ ...prev, language: lang.code }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            profile.language === lang.code
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-lg font-semibold">{lang.name}</div>
                          <div className="text-xl text-gray-600">{lang.native}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Any specific concerns?</h2>
                    <p className="text-gray-600 mb-6">Select any areas you'd like us to focus on (optional)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {concerns.map((concern) => (
                        <button
                          key={concern}
                          onClick={() => toggleConcern(concern)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                            profile.primaryConcerns.includes(concern)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {concern}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {step < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/assessment/cognitive">
              <Button className="flex items-center">
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Encouragement */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your information is kept completely private and secure
          </p>
        </div>
      </div>
    </div>
  )
}