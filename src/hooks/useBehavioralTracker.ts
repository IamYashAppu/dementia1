"use client"

import { useEffect, useRef, useState } from 'react'

export interface BehavioralData {
  responseTime: number[]
  clickPatterns: { x: number; y: number; timestamp: number; element: string }[]
  hesitationCount: number
  taskSwitchingDifficulty: number
  scrollBehavior: { direction: 'up' | 'down'; speed: number; timestamp: number }[]
  focusEvents: { type: 'focus' | 'blur'; timestamp: number; element: string }[]
  keyboardUsage: { key: string; timestamp: number; context: string }[]
  mouseMovements: { x: number; y: number; timestamp: number }[]
  timeSpentOnElements: { element: string; duration: number }[]
  errorPatterns: { type: string; timestamp: number; context: string }[]
}

interface BehavioralTrackerHook {
  behavioralData: BehavioralData
  startTracking: () => void
  stopTracking: () => void
  recordResponse: (responseTime: number) => void
  recordHesitation: () => void
  recordTaskSwitch: (difficulty: number) => void
  isTracking: boolean
}

export function useBehavioralTracker(): BehavioralTrackerHook {
  const [isTracking, setIsTracking] = useState(false)
  const [behavioralData, setBehavioralData] = useState<BehavioralData>({
    responseTime: [],
    clickPatterns: [],
    hesitationCount: 0,
    taskSwitchingDifficulty: 0,
    scrollBehavior: [],
    focusEvents: [],
    keyboardUsage: [],
    mouseMovements: [],
    timeSpentOnElements: [],
    errorPatterns: []
  })

  const trackingStartTime = useRef<number>(0)
  const elementFocusStart = useRef<{ [key: string]: number }>({})
  const lastMousePosition = useRef({ x: 0, y: 0 })
  const mouseMoveThrottle = useRef<number>(0)

  // Event listeners
  useEffect(() => {
    if (!isTracking) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const elementType = target.tagName.toLowerCase()
      const elementId = target.id || target.className || elementType

      setBehavioralData(prev => ({
        ...prev,
        clickPatterns: [
          ...prev.clickPatterns,
          {
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now(),
            element: elementId
          }
        ]
      }))
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Throttle mouse movement tracking to avoid excessive data
      const now = Date.now()
      if (now - mouseMoveThrottle.current < 100) return // Throttle to 100ms
      mouseMoveThrottle.current = now

      const deltaX = Math.abs(event.clientX - lastMousePosition.current.x)
      const deltaY = Math.abs(event.clientY - lastMousePosition.current.y)
      
      // Only record if there's significant movement
      if (deltaX > 5 || deltaY > 5) {
        setBehavioralData(prev => ({
          ...prev,
          mouseMovements: [
            ...prev.mouseMovements.slice(-50), // Keep only last 50 movements
            {
              x: event.clientX,
              y: event.clientY,
              timestamp: now
            }
          ]
        }))
        
        lastMousePosition.current = { x: event.clientX, y: event.clientY }
      }
    }

    const handleScroll = () => {
      const scrollDirection = window.scrollY > (window.scrollY || 0) ? 'down' : 'up'
      const scrollSpeed = Math.abs(window.scrollY - (window.scrollY || 0))

      setBehavioralData(prev => ({
        ...prev,
        scrollBehavior: [
          ...prev.scrollBehavior.slice(-20), // Keep only last 20 scroll events
          {
            direction: scrollDirection,
            speed: scrollSpeed,
            timestamp: Date.now()
          }
        ]
      }))
    }

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement
      const elementId = target.id || target.className || target.tagName.toLowerCase()
      const timestamp = Date.now()

      elementFocusStart.current[elementId] = timestamp

      setBehavioralData(prev => ({
        ...prev,
        focusEvents: [
          ...prev.focusEvents,
          {
            type: 'focus',
            timestamp,
            element: elementId
          }
        ]
      }))
    }

    const handleBlur = (event: FocusEvent) => {
      const target = event.target as HTMLElement
      const elementId = target.id || target.className || target.tagName.toLowerCase()
      const timestamp = Date.now()

      // Calculate time spent on element
      if (elementFocusStart.current[elementId]) {
        const duration = timestamp - elementFocusStart.current[elementId]
        setBehavioralData(prev => ({
          ...prev,
          timeSpentOnElements: [
            ...prev.timeSpentOnElements,
            { element: elementId, duration }
          ]
        }))
        delete elementFocusStart.current[elementId]
      }

      setBehavioralData(prev => ({
        ...prev,
        focusEvents: [
          ...prev.focusEvents,
          {
            type: 'blur',
            timestamp,
            element: elementId
          }
        ]
      }))
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const context = (event.target as HTMLElement)?.tagName.toLowerCase() || 'unknown'
      
      setBehavioralData(prev => ({
        ...prev,
        keyboardUsage: [
          ...prev.keyboardUsage.slice(-30), // Keep only last 30 key events
          {
            key: event.key,
            timestamp: Date.now(),
            context
          }
        ]
      }))
    }

    // Add event listeners
    document.addEventListener('click', handleClick)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('scroll', handleScroll)
    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      // Cleanup event listeners
      document.removeEventListener('click', handleClick)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isTracking])

  const startTracking = () => {
    setIsTracking(true)
    trackingStartTime.current = Date.now()
    
    // Reset behavioral data
    setBehavioralData({
      responseTime: [],
      clickPatterns: [],
      hesitationCount: 0,
      taskSwitchingDifficulty: 0,
      scrollBehavior: [],
      focusEvents: [],
      keyboardUsage: [],
      mouseMovements: [],
      timeSpentOnElements: [],
      errorPatterns: []
    })
  }

  const stopTracking = () => {
    setIsTracking(false)
    
    // Record any remaining element focus times
    Object.entries(elementFocusStart.current).forEach(([elementId, startTime]) => {
      const duration = Date.now() - startTime
      setBehavioralData(prev => ({
        ...prev,
        timeSpentOnElements: [
          ...prev.timeSpentOnElements,
          { element: elementId, duration }
        ]
      }))
    })
    
    elementFocusStart.current = {}
  }

  const recordResponse = (responseTime: number) => {
    setBehavioralData(prev => ({
      ...prev,
      responseTime: [...prev.responseTime, responseTime]
    }))
  }

  const recordHesitation = () => {
    setBehavioralData(prev => ({
      ...prev,
      hesitationCount: prev.hesitationCount + 1
    }))
  }

  const recordTaskSwitch = (difficulty: number) => {
    setBehavioralData(prev => ({
      ...prev,
      taskSwitchingDifficulty: Math.max(prev.taskSwitchingDifficulty, difficulty)
    }))
  }

  return {
    behavioralData,
    startTracking,
    stopTracking,
    recordResponse,
    recordHesitation,
    recordTaskSwitch,
    isTracking
  }
}

// Behavioral Analytics Functions
export class BehavioralAnalytics {
  static analyzeBehavior(data: BehavioralData): {
    cognitiveLoad: number
    motorControl: number
    attentionPatterns: number
    usabilityIssues: string[]
    recommendations: string[]
  } {
    const cognitiveLoad = this.calculateCognitiveLoad(data)
    const motorControl = this.assessMotorControl(data)
    const attentionPatterns = this.analyzeAttentionPatterns(data)
    const usabilityIssues = this.identifyUsabilityIssues(data)
    const recommendations = this.generateRecommendations(data)

    return {
      cognitiveLoad,
      motorControl,
      attentionPatterns,
      usabilityIssues,
      recommendations
    }
  }

  private static calculateCognitiveLoad(data: BehavioralData): number {
    let loadScore = 0

    // Response time variability indicates cognitive load
    if (data.responseTime.length > 1) {
      const avgResponseTime = data.responseTime.reduce((a, b) => a + b, 0) / data.responseTime.length
      const variance = data.responseTime.reduce((sum, time) => sum + Math.pow(time - avgResponseTime, 2), 0) / data.responseTime.length
      const cv = Math.sqrt(variance) / avgResponseTime // Coefficient of variation
      
      if (cv > 0.5) loadScore += 30 // High variability
      else if (cv > 0.3) loadScore += 15 // Moderate variability
    }

    // Hesitation count
    loadScore += Math.min(data.hesitationCount * 10, 40)

    // Task switching difficulty
    loadScore += data.taskSwitchingDifficulty * 15

    // Error patterns
    loadScore += Math.min(data.errorPatterns.length * 5, 25)

    return Math.min(100, loadScore)
  }

  private static assessMotorControl(data: BehavioralData): number {
    let motorScore = 100 // Start with perfect score

    // Analyze mouse movement patterns
    if (data.mouseMovements.length > 10) {
      const movements = data.mouseMovements
      let totalJerkiness = 0
      
      for (let i = 2; i < movements.length; i++) {
        const prev = movements[i - 1]
        const curr = movements[i]
        const next = movements[i + 1] || curr
        
        // Calculate direction changes (jerkiness)
        const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x)
        const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x)
        const angleDiff = Math.abs(angle1 - angle2)
        
        if (angleDiff > Math.PI / 2) totalJerkiness++
      }
      
      const jerkinessRatio = totalJerkiness / movements.length
      if (jerkinessRatio > 0.3) motorScore -= 30
      else if (jerkinessRatio > 0.15) motorScore -= 15
    }

    // Analyze click precision
    const clickVariability = this.calculateClickVariability(data.clickPatterns)
    if (clickVariability > 0.2) motorScore -= 20
    else if (clickVariability > 0.1) motorScore -= 10

    return Math.max(0, motorScore)
  }

  private static analyzeAttentionPatterns(data: BehavioralData): number {
    let attentionScore = 100

    // Analyze focus switching frequency
    const focusEventsPerMinute = data.focusEvents.length / 5 // Assuming 5-minute session
    if (focusEventsPerMinute > 20) attentionScore -= 25 // Too much switching
    else if (focusEventsPerMinute < 2) attentionScore -= 15 // Too little engagement

    // Time spent on elements
    const avgTimeOnElements = data.timeSpentOnElements.reduce((sum, item) => sum + item.duration, 0) / data.timeSpentOnElements.length
    if (avgTimeOnElements < 1000) attentionScore -= 20 // Less than 1 second average

    // Scroll behavior analysis
    const rapidScrollCount = data.scrollBehavior.filter(scroll => scroll.speed > 100).length
    if (rapidScrollCount > 10) attentionScore -= 15 // Too much rapid scrolling

    return Math.max(0, attentionScore)
  }

  private static calculateClickVariability(clickPatterns: BehavioralData['clickPatterns']): number {
    if (clickPatterns.length < 3) return 0

    let totalVariation = 0
    for (let i = 1; i < clickPatterns.length; i++) {
      const prev = clickPatterns[i - 1]
      const curr = clickPatterns[i]
      const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2))
      totalVariation += distance
    }

    return totalVariation / (clickPatterns.length - 1) / 1000 // Normalize to 0-1 scale
  }

  private static identifyUsabilityIssues(data: BehavioralData): string[] {
    const issues: string[] = []

    if (data.hesitationCount > 5) {
      issues.push('Frequent hesitations detected - interface may be confusing')
    }

    if (data.errorPatterns.length > 3) {
      issues.push('Multiple errors encountered - consider simplifying interactions')
    }

    const avgResponseTime = data.responseTime.reduce((a, b) => a + b, 0) / data.responseTime.length
    if (avgResponseTime > 5000) {
      issues.push('Slow response times - may indicate difficulty understanding tasks')
    }

    return issues
  }

  private static generateRecommendations(data: BehavioralData): string[] {
    const recommendations: string[] = []

    if (data.hesitationCount > 3) {
      recommendations.push('Consider adding more visual cues and guidance')
    }

    if (data.responseTime.some(time => time > 10000)) {
      recommendations.push('Break down complex tasks into smaller steps')
    }

    if (data.focusEvents.length > 50) {
      recommendations.push('Reduce visual distractions on the interface')
    }

    recommendations.push('Continue regular cognitive health monitoring')

    return recommendations
  }
}