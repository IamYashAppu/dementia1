"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Clock, 
  Target, 
  Shuffle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Timer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface TestResult {
  testName: string
  score: number
  maxScore: number
  timeSpent: number
  responses: unknown[]
}

export default function CognitiveAssessmentPage() {
  const [currentTest, setCurrentTest] = useState(0)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isTestActive, setIsTestActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [startTime, setStartTime] = useState(0)

  // Memory Test State
  const [memorySequence, setMemorySequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [showingSequence, setShowingSequence] = useState(false)
  const [memoryScore, setMemoryScore] = useState(0)

  // Attention Test State
  const [attentionTarget, setAttentionTarget] = useState('')
  const [attentionOptions, setAttentionOptions] = useState<string[]>([])
  const [attentionScore, setAttentionScore] = useState(0)
  const [attentionRound, setAttentionRound] = useState(0)

  // Reasoning Test State
  const [reasoningQuestion, setReasoningQuestion] = useState('')
  const [reasoningOptions, setReasoningOptions] = useState<string[]>([])
  const [reasoningAnswers, setReasoningAnswers] = useState<string[]>([])
  const [reasoningScore, setReasoningScore] = useState(0)

  const tests = [
    {
      id: 'memory',
      name: 'Memory Test',
      description: 'Remember and repeat sequences of numbers',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      duration: 300 // 5 minutes
    },
    {
      id: 'attention',
      name: 'Attention Test', 
      description: 'Focus on specific targets among distractors',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      duration: 240 // 4 minutes
    },
    {
      id: 'reasoning',
      name: 'Reasoning Test',
      description: 'Solve logical puzzles and patterns',
      icon: Shuffle,
      color: 'from-green-500 to-emerald-500',
      duration: 360 // 6 minutes
    }
  ]

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTestActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTestActive) {
      finishCurrentTest()
    }
    return () => clearInterval(interval)
  }, [isTestActive, timeLeft])

  const startTest = (testIndex: number) => {
    setCurrentTest(testIndex)
    setIsTestActive(true)
    setTimeLeft(tests[testIndex].duration)
    setStartTime(Date.now())
    
    // Initialize test-specific state
    if (tests[testIndex].id === 'memory') {
      generateMemorySequence()
    } else if (tests[testIndex].id === 'attention') {
      generateAttentionTask()
    } else if (tests[testIndex].id === 'reasoning') {
      generateReasoningQuestion()
    }
  }

  const finishCurrentTest = () => {
    const test = tests[currentTest]
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    let score = 0
    let maxScore = 10
    let responses: unknown[] = []

    if (test.id === 'memory') {
      score = memoryScore
      responses = [{ sequence: memorySequence, userInput: userSequence }]
    } else if (test.id === 'attention') {
      score = attentionScore
      maxScore = 10
    } else if (test.id === 'reasoning') {
      score = reasoningScore
      responses = reasoningAnswers
    }

    const result: TestResult = {
      testName: test.name,
      score,
      maxScore,
      timeSpent,
      responses
    }

    setTestResults(prev => [...prev, result])
    setIsTestActive(false)
    
    // Reset test states
    resetTestStates()
  }

  const resetTestStates = () => {
    setMemorySequence([])
    setUserSequence([])
    setShowingSequence(false)
    setMemoryScore(0)
    setAttentionTarget('')
    setAttentionOptions([])
    setAttentionScore(0)
    setAttentionRound(0)
    setReasoningQuestion('')
    setReasoningOptions([])
    setReasoningAnswers([])
    setReasoningScore(0)
  }

  // Memory Test Functions
  const generateMemorySequence = () => {
    const sequence = Array.from({ length: 4 + Math.floor(Math.random() * 3) }, 
      () => Math.floor(Math.random() * 9) + 1)
    setMemorySequence(sequence)
    setUserSequence([])
    showSequenceToUser(sequence)
  }

  const showSequenceToUser = async (sequence: number[]) => {
    setShowingSequence(true)
    // Show sequence for 2 seconds
    setTimeout(() => {
      setShowingSequence(false)
    }, 2000)
  }

  const addToUserSequence = (num: number) => {
    const newSequence = [...userSequence, num]
    setUserSequence(newSequence)
    
    if (newSequence.length === memorySequence.length) {
      checkMemoryAnswer(newSequence)
    }
  }

  const checkMemoryAnswer = (sequence: number[]) => {
    const correct = sequence.every((num, index) => num === memorySequence[index])
    if (correct) {
      setMemoryScore(prev => prev + 1)
    }
    
    setTimeout(() => {
      if (memoryScore < 10) {
        generateMemorySequence()
      }
    }, 1000)
  }

  // Attention Test Functions
  const generateAttentionTask = () => {
    const targets = ['🔴', '🔵', '🟢', '🟡', '🟣']
    const target = targets[Math.floor(Math.random() * targets.length)]
    const distractors = targets.filter(t => t !== target)
    
    const options = [target]
    for (let i = 0; i < 7; i++) {
      options.push(distractors[Math.floor(Math.random() * distractors.length)])
    }
    
    setAttentionTarget(target)
    setAttentionOptions(shuffleArray(options))
  }

  const handleAttentionClick = (option: string) => {
    if (option === attentionTarget) {
      setAttentionScore(prev => prev + 1)
    }
    
    setAttentionRound(prev => prev + 1)
    if (attentionRound < 9) {
      setTimeout(generateAttentionTask, 500)
    }
  }

  // Reasoning Test Functions
  const generateReasoningQuestion = () => {
    const questions = [
      {
        question: "What comes next in this sequence: 2, 4, 8, 16, ?",
        options: ["24", "32", "28", "20"],
        correct: "32"
      },
      {
        question: "If all cats are animals, and some animals are pets, then:",
        options: ["All cats are pets", "Some cats might be pets", "No cats are pets", "All pets are cats"],
        correct: "Some cats might be pets"
      },
      {
        question: "What is the missing number: 3, 6, 12, 24, ?",
        options: ["36", "48", "40", "32"],
        correct: "48"
      }
    ]
    
    const q = questions[Math.floor(Math.random() * questions.length)]
    setReasoningQuestion(q.question)
    setReasoningOptions(q.options)
  }

  const handleReasoningAnswer = (answer: string) => {
    setReasoningAnswers(prev => [...prev, answer])
    // Simplified scoring for demo
    if (reasoningAnswers.length < 5) {
      setTimeout(generateReasoningQuestion, 1000)
    }
  }

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (testResults.length === tests.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
            <p className="text-lg text-gray-600">Great job completing all the cognitive tests</p>
          </motion.div>

          <div className="grid gap-6 mb-8">
            {testResults.map((result, index) => (
              <Card key={result.testName}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{result.testName}</h3>
                      <p className="text-gray-600">
                        Score: {result.score}/{result.maxScore} | Time: {formatTime(result.timeSpent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((result.score / result.maxScore) * 100)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/assessment/speech">
              <Button size="lg" className="mr-4">
                Continue to Speech Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/assessment/results">
              <Button variant="outline" size="lg">
                View Detailed Results
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isTestActive) {
    const test = tests[currentTest]
    const Icon = test.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Test Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${test.color} flex items-center justify-center mr-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{test.name}</h1>
                <p className="text-gray-600">{test.description}</p>
              </div>
            </div>
            <div className="flex items-center text-lg font-semibold text-blue-600">
              <Timer className="w-5 h-5 mr-2" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Test Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {test.id === 'memory' && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-6">
                    {showingSequence ? 'Memorize this sequence:' : 'Enter the sequence you saw:'}
                  </h2>
                  
                  {showingSequence ? (
                    <div className="flex justify-center gap-4 mb-8">
                      {memorySequence.map((num, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="w-16 h-16 bg-blue-500 text-white rounded-xl flex items-center justify-center text-2xl font-bold"
                        >
                          {num}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center gap-4 mb-8">
                        {userSequence.map((num, index) => (
                          <div
                            key={index}
                            className="w-16 h-16 bg-green-500 text-white rounded-xl flex items-center justify-center text-2xl font-bold"
                          >
                            {num}
                          </div>
                        ))}
                        {Array.from({ length: memorySequence.length - userSequence.length }).map((_, index) => (
                          <div
                            key={index + userSequence.length}
                            className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-2xl"
                          >
                            ?
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <Button
                            key={num}
                            onClick={() => addToUserSequence(num)}
                            disabled={userSequence.length >= memorySequence.length}
                            className="h-16 text-xl font-bold"
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div className="mt-6 text-lg">
                    Score: {memoryScore}/10
                  </div>
                </div>
              )}

              {test.id === 'attention' && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-6">
                    Click on all {attentionTarget} symbols
                  </h2>
                  
                  <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
                    {attentionOptions.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAttentionClick(option)}
                        className="h-20 text-4xl"
                        variant={option === attentionTarget ? "primary" : "outline"}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="text-lg">
                    Score: {attentionScore}/10 | Round: {attentionRound + 1}/10
                  </div>
                </div>
              )}

              {test.id === 'reasoning' && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-6">{reasoningQuestion}</h2>
                  
                  <div className="grid gap-4 max-w-lg mx-auto mb-8">
                    {reasoningOptions.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleReasoningAnswer(option)}
                        className="p-4 text-left justify-start"
                        variant="outline"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="text-lg">
                    Questions answered: {reasoningAnswers.length}/5
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex justify-center">
            <Button
              onClick={finishCurrentTest}
              variant="outline"
              className="mr-4"
            >
              Finish Test Early
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Link href="/assessment" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cognitive Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete three quick tests to evaluate your memory, attention, and reasoning abilities. 
            Take your time and do your best!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tests.map((test, index) => {
            const Icon = test.icon
            const isCompleted = testResults.some(result => result.testName === test.name)
            
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${isCompleted ? 'border-green-500 bg-green-50' : ''}`}>
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${test.color} flex items-center justify-center mb-4 relative`}>
                      <Icon className="w-8 h-8 text-white" />
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-600 absolute -top-2 -right-2 bg-white rounded-full" />
                      )}
                    </div>
                    <CardTitle className="text-xl">{test.name}</CardTitle>
                    <CardDescription className="text-base">
                      {test.description}
                    </CardDescription>
                    <div className="text-sm text-gray-500 flex items-center justify-center mt-2">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.floor(test.duration / 60)} minutes
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    {isCompleted ? (
                      <div className="text-green-600 font-semibold">
                        ✓ Completed
                      </div>
                    ) : (
                      <Button
                        onClick={() => startTest(index)}
                        className="w-full"
                        disabled={isTestActive}
                      >
                        Start Test
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {testResults.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-4">
              Progress: {testResults.length}/{tests.length} tests completed
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(testResults.length / tests.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}