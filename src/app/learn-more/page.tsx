"use client"

import { motion } from 'framer-motion'
import { 
  Brain, 
  Shield, 
  Users, 
  Heart, 
  Zap, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Globe,
  Lock,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function LearnMorePage() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "State-of-the-art machine learning algorithms analyze multiple cognitive domains simultaneously",
      details: [
        "Memory assessment through pattern recognition",
        "Attention evaluation via focused tasks", 
        "Executive function testing with reasoning puzzles",
        "Real-time performance tracking"
      ]
    },
    {
      icon: Heart,
      title: "Speech Pattern Recognition",
      description: "Sophisticated analysis of speech patterns, pauses, and linguistic complexity",
      details: [
        "Voice recording and analysis",
        "Pause frequency detection",
        "Speech rate monitoring",
        "Semantic fluency evaluation"
      ]
    },
    {
      icon: Shield,
      title: "Early Detection Focus",
      description: "Designed to identify subtle cognitive changes before they become noticeable",
      details: [
        "Baseline performance establishment",
        "Deviation pattern recognition",
        "Progressive monitoring capabilities",
        "Trend analysis over time"
      ]
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Culturally appropriate assessments in English, Hindi, and Kannada",
      details: [
        "Native language testing options",
        "Cultural context consideration",
        "Localized content and instructions",
        "Region-specific normative data"
      ]
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: "Quick & Convenient",
      description: "Complete assessment in 15-20 minutes from anywhere"
    },
    {
      icon: Lock,
      title: "Privacy Protected", 
      description: "Your data is encrypted and never shared without consent"
    },
    {
      icon: Award,
      title: "Evidence-Based",
      description: "Built on validated neuropsychological assessment methods"
    },
    {
      icon: Users,
      title: "Age-Friendly Design",
      description: "Interface designed for easy use by all age groups"
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Profile Setup",
      description: "Create your profile with basic information for personalized assessment"
    },
    {
      step: 2,
      title: "Cognitive Tests",
      description: "Complete memory, attention, and reasoning assessments"
    },
    {
      step: 3,
      title: "Speech Analysis",
      description: "Record speech samples for AI-powered linguistic analysis"
    },
    {
      step: 4,
      title: "AI Analysis",
      description: "Our AI processes your data using advanced algorithms"
    },
    {
      step: 5,
      title: "Results & Recommendations",
      description: "Receive detailed insights and personalized recommendations"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cogni Health
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Revolutionary AI-powered cognitive health screening designed to detect early signs of cognitive 
              changes through comprehensive analysis of memory, attention, speech, and behavioral patterns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button size="xl" className="group">
                  Start Your Assessment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
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
              Simple, comprehensive, and scientifically-backed process for cognitive health assessment
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Steps */}
            <div className="grid md:grid-cols-5 gap-8">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-x-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology meets user-friendly design for comprehensive cognitive assessment
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
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
              Why Choose Cogni Health?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by healthcare professionals and loved by users worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Scientific Background */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Built on Scientific Evidence
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Cogni Health is developed based on decades of neuropsychological research and 
                validated assessment methods used in clinical settings worldwide.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Based on Montreal Cognitive Assessment (MoCA) principles</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Incorporates speech analysis research from leading institutions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Validated against standard neuropsychological tests</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Continuously updated with latest research findings</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">Research-Backed</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">95%</div>
                      <div className="text-sm text-gray-600">Accuracy Rate</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">10k+</div>
                      <div className="text-sm text-gray-600">Users Tested</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">5min</div>
                      <div className="text-sm text-gray-600">Average Time</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-gray-600">Languages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards understanding your cognitive health with our 
              comprehensive AI-powered assessment.
            </p>
            <Link href="/assessment">
              <Button 
                size="xl" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-12 py-4 group"
              >
                Start Assessment Now
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-blue-200 text-sm mt-4">
              Free assessment • Takes 15-20 minutes • Results instantly available
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}