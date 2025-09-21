// AI Analytics Engine for Dementia Risk Assessment

export interface CognitiveTestResult {
  testType: 'memory' | 'attention' | 'reasoning'
  score: number
  maxScore: number
  timeSpent: number
  responses: any[]
}

export interface SpeechAnalysisResult {
  taskType: 'description' | 'storytelling' | 'fluency' | 'reading'
  duration: number
  pauseCount: number
  wordCount: number
  speechRate: number
  fluencyScore: number
}

export interface RiskAssessment {
  overallRiskScore: number // 0-100
  riskCategory: 'Low' | 'Moderate' | 'High'
  cognitiveAreas: {
    memory: { score: number; percentile: number; concern: string }
    attention: { score: number; percentile: number; concern: string }
    language: { score: number; percentile: number; concern: string }
    executiveFunction: { score: number; percentile: number; concern: string }
  }
  recommendations: string[]
  clinicalReferralNeeded: boolean
  confidenceLevel: number
}

export class DementiaAIAnalytics {
  static analyzeResults(
    cognitiveResults: CognitiveTestResult[],
    speechResults: SpeechAnalysisResult[],
    userAge: number
  ): RiskAssessment {
    // Calculate cognitive scores
    const memoryResult = cognitiveResults.find(r => r.testType === 'memory')
    const attentionResult = cognitiveResults.find(r => r.testType === 'attention')
    const reasoningResult = cognitiveResults.find(r => r.testType === 'reasoning')

    const memoryScore = this.calculateDomainScore(memoryResult?.score || 0, memoryResult?.maxScore || 10, userAge)
    const attentionScore = this.calculateDomainScore(attentionResult?.score || 0, attentionResult?.maxScore || 10, userAge)
    const languageScore = this.calculateLanguageScore(speechResults)
    const executiveScore = this.calculateDomainScore(reasoningResult?.score || 0, reasoningResult?.maxScore || 10, userAge)

    // Calculate overall risk
    const avgPercentile = (memoryScore.percentile + attentionScore.percentile + executiveScore.percentile) / 3
    const speechRisk = this.analyzeSpeechRisk(speechResults)
    
    const overallRisk = Math.round(100 - (avgPercentile * 0.7 + (100 - speechRisk) * 0.3))
    
    let category: 'Low' | 'Moderate' | 'High'
    if (overallRisk < 30) category = 'Low'
    else if (overallRisk < 70) category = 'Moderate'
    else category = 'High'

    return {
      overallRiskScore: overallRisk,
      riskCategory: category,
      cognitiveAreas: {
        memory: memoryScore,
        attention: attentionScore,
        language: languageScore,
        executiveFunction: executiveScore
      },
      recommendations: this.generateRecommendations(category, memoryScore, attentionScore, speechRisk),
      clinicalReferralNeeded: overallRisk > 65,
      confidenceLevel: 85
    }
  }

  private static calculateDomainScore(score: number, maxScore: number, age: number) {
    const percentage = (score / maxScore) * 100
    const ageAdjustment = age > 65 ? Math.max(0, (age - 65) * 0.5) : 0
    const adjustedPercentile = Math.max(1, Math.min(99, percentage - ageAdjustment))
    
    let concern = 'Normal'
    if (adjustedPercentile < 10) concern = 'Significant concern'
    else if (adjustedPercentile < 25) concern = 'Mild concern'
    else if (adjustedPercentile < 40) concern = 'Monitor'

    return {
      score: Math.round(percentage),
      percentile: Math.round(adjustedPercentile),
      concern
    }
  }

  private static calculateLanguageScore(speechResults: SpeechAnalysisResult[]) {
    const avgFluency = speechResults.reduce((sum, r) => sum + r.fluencyScore, 0) / speechResults.length
    return {
      score: Math.round(avgFluency),
      percentile: Math.round(avgFluency),
      concern: avgFluency < 60 ? 'Mild concern' : 'Normal'
    }
  }

  private static analyzeSpeechRisk(speechResults: SpeechAnalysisResult[]): number {
    let riskScore = 0
    
    speechResults.forEach(result => {
      if (result.speechRate < 120 || result.speechRate > 180) riskScore += 15
      if (result.pauseCount > (result.duration / 60) * 8) riskScore += 20
      if (result.fluencyScore < 60) riskScore += 25
    })
    
    return Math.min(100, riskScore)
  }

  private static generateRecommendations(
    category: 'Low' | 'Moderate' | 'High',
    memoryScore: any,
    attentionScore: any,
    speechRisk: number
  ): string[] {
    const recommendations: string[] = []

    if (category === 'High') {
      recommendations.push('Consult with a neurologist or memory specialist promptly')
      recommendations.push('Consider comprehensive neuropsychological evaluation')
    } else if (category === 'Moderate') {
      recommendations.push('Schedule follow-up assessment in 6-12 months')
      recommendations.push('Discuss results with your primary care physician')
    }

    if (memoryScore.percentile < 25) {
      recommendations.push('Consider memory training exercises')
    }

    if (attentionScore.percentile < 25) {
      recommendations.push('Practice attention and concentration exercises')
    }

    if (speechRisk > 50) {
      recommendations.push('Consider speech-language evaluation')
    }

    recommendations.push('Maintain regular physical exercise')
    recommendations.push('Engage in mentally stimulating activities')
    recommendations.push('Follow a brain-healthy diet')

    return recommendations
  }
}