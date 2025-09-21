"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Share2,
  Calendar,
  User,
  Phone,
  ArrowLeft,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DementiaAIAnalytics, type CognitiveTestResult, type SpeechAnalysisResult, type RiskAssessment } from '@/lib/ai-analytics'
import Link from 'next/link'

export default function ResultsPage() {
  const [results, setResults] = useState<RiskAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading results from assessment data
    setTimeout(() => {
      // Mock data for demonstration
      const mockCognitiveResults: CognitiveTestResult[] = [
        { testType: 'memory', score: 7, maxScore: 10, timeSpent: 180, responses: [] },
        { testType: 'attention', score: 8, maxScore: 10, timeSpent: 150, responses: [] },
        { testType: 'reasoning', score: 6, maxScore: 10, timeSpent: 200, responses: [] }
      ]

      const mockSpeechResults: SpeechAnalysisResult[] = [
        { taskType: 'description', duration: 120, pauseCount: 5, wordCount: 180, speechRate: 90, fluencyScore: 75 },
        { taskType: 'storytelling', duration: 180, pauseCount: 8, wordCount: 240, speechRate: 80, fluencyScore: 70 },
        { taskType: 'fluency', duration: 60, pauseCount: 3, wordCount: 45, speechRate: 45, fluencyScore: 65 },
        { taskType: 'reading', duration: 90, pauseCount: 2, wordCount: 120, speechRate: 80, fluencyScore: 85 }
      ]

      const analysisResults = DementiaAIAnalytics.analyzeResults(
        mockCognitiveResults,
        mockSpeechResults,
        67 // Mock age
      )

      setResults(analysisResults)
      setIsLoading(false)
    }, 2000)
  }, [])

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200'
      case 'Moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'High': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'Low': return CheckCircle
      case 'Moderate': return AlertTriangle
      case 'High': return AlertTriangle
      default: return Brain
    }
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600'
    if (percentile >= 50) return 'text-blue-600'
    if (percentile >= 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  const downloadResults = () => {
    if (!results) return
    
    const reportData = {
      assessmentDate: new Date().toLocaleDateString(),
      overallRisk: results.riskCategory,
      riskScore: results.overallRiskScore,
      cognitiveAreas: results.cognitiveAreas,
      recommendations: results.recommendations,
      clinicalReferral: results.clinicalReferralNeeded
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cogni-health-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analyzing Your Results</h2>
          <p className="text-gray-600">Our AI is processing your assessment data...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Results Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load your assessment results.</p>
          <Link href="/assessment">
            <Button>Return to Assessment</Button>
          </Link>
        </div>
      </div>
    )
  }

  const RiskIcon = getRiskIcon(results.riskCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/assessment" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessment
          </Link>
          <div className="flex gap-4">
            <Button onClick={downloadResults} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Cognitive Health Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete analysis of your cognitive assessment with personalized insights and recommendations
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
            <Calendar className="w-4 h-4 mr-2" />
            Assessment completed on {new Date().toLocaleDateString()}
          </div>
        </motion.div>

        {/* Overall Risk Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <Card className={`border-2 ${getRiskColor(results.riskCategory)}`}>
            <CardContent className="p-8 text-center">
              <RiskIcon className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">
                {results.riskCategory} Risk
              </h2>
              <div className="text-5xl font-bold mb-4">
                {results.overallRiskScore}/100
              </div>
              <p className="text-lg max-w-2xl mx-auto">
                {results.riskCategory === 'Low' && 
                  "Your assessment shows no significant cognitive concerns. Continue maintaining your healthy lifestyle."}
                {results.riskCategory === 'Moderate' && 
                  "Your assessment shows some areas that may benefit from monitoring and lifestyle adjustments."}
                {results.riskCategory === 'High' && 
                  "Your assessment indicates areas of concern that warrant professional evaluation and intervention."}
              </p>
              {results.clinicalReferralNeeded && (
                <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <div className="flex items-center justify-center text-red-800">
                    <Phone className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Clinical Referral Recommended</span>
                  </div>
                  <p className="text-red-700 mt-2">
                    We recommend consulting with a healthcare professional for further evaluation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Cognitive Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3" />
            Cognitive Domain Analysis
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(results.cognitiveAreas).map(([domain, data]) => (
              <Card key={domain} className="text-center">
                <CardHeader>
                  <CardTitle className="capitalize text-lg">{domain.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold mb-2 ${getPercentileColor(data.percentile)}`}>
                    {data.percentile}%
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Score: {data.score}/100
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    data.concern === 'Normal' ? 'bg-green-100 text-green-800' :
                    data.concern === 'Monitor' ? 'bg-blue-100 text-blue-800' :
                    data.concern === 'Mild concern' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {data.concern}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Detailed Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-3" />
            Detailed Analysis
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Strengths Identified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Object.entries(results.cognitiveAreas)
                    .filter(([_, data]) => data.percentile >= 50)
                    .map(([domain, data]) => (
                      <li key={domain} className="flex items-center text-green-700">
                        <CheckCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>
                          <strong className="capitalize">{domain.replace(/([A-Z])/g, ' $1').trim()}</strong>: 
                          Performing at {data.percentile}th percentile
                        </span>
                      </li>
                    ))}
                  {Object.entries(results.cognitiveAreas).filter(([_, data]) => data.percentile >= 50).length === 0 && (
                    <li className="text-gray-600 italic">
                      Focus on the recommendations below to improve cognitive performance
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-700 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Areas for Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Object.entries(results.cognitiveAreas)
                    .filter(([_, data]) => data.percentile < 50)
                    .map(([domain, data]) => (
                      <li key={domain} className="flex items-center text-yellow-700">
                        <AlertTriangle className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>
                          <strong className="capitalize">{domain.replace(/([A-Z])/g, ' $1').trim()}</strong>: 
                          {data.percentile}th percentile - {data.concern}
                        </span>
                      </li>
                    ))}
                  {Object.entries(results.cognitiveAreas).filter(([_, data]) => data.percentile < 50).length === 0 && (
                    <li className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3" />
                      All areas performing well!
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center">
                <Heart className="w-6 h-6 mr-3" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>
                Evidence-based suggestions to support your cognitive health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-blue-900">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">What's Next?</h2>
              <p className="text-blue-800 mb-6 max-w-2xl mx-auto">
                Your cognitive health journey doesn't end here. Regular monitoring and healthy lifestyle choices 
                are key to maintaining optimal brain health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/assessment">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Take Assessment Again
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
                  Schedule Follow-up
                </Button>
                <Link href="/">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
                    Return Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}