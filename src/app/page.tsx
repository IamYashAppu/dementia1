"use client"

import { motion } from 'framer-motion'
import { Brain, Heart, Shield, Users, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LanguageSelector } from '@/components/LanguageSelector'
import { getGreeting } from '@/lib/utils'
import Link from 'next/link'

export default function Home() {
  const greeting = getGreeting()

  const features = [
    {
      icon: Brain,
      title: "Cognitive Assessment",
      description: "Comprehensive memory, attention, and reasoning tests designed by neurological experts",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Heart,
      title: "Speech Analysis",
      description: "Advanced AI analyzes speech patterns, pauses, and linguistic complexity",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Early Detection",
      description: "Identify subtle cognitive changes before they become noticeable in daily life",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Multi-Language Support",
      description: "Available in English, Hindi, and Kannada with culturally appropriate content",
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Cognitive Health Screening
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              <span className="block">{greeting}!</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cogni Health
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Early detection of cognitive changes through advanced AI analysis of speech, behavior, and cognitive patterns. 
              Simple, accessible, and designed for everyone.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/assessment">
                <Button size="xl" className="group">
                  Start Assessment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/learn-more">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Cogni Health Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach combines multiple assessment methods for accurate, early detection
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center group hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Take Control of Your Cognitive Health Today
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Early detection can make all the difference. Start your journey towards better cognitive health with our AI-powered assessment.
            </p>
            <Link href="/assessment">
              <Button 
                size="xl" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-12 py-4"
              >
                Begin Assessment Now
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
