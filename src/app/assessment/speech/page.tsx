"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Volume2,
  CheckCircle,
  Timer,
  MessageSquare,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface SpeechTask {
  id: string
  type: 'description' | 'storytelling' | 'fluency' | 'reading'
  title: string
  instruction: string
  prompt: string
  duration: number
  icon: any
  color: string
}

interface SpeechAnalysis {
  taskId: string
  duration: number
  pauseCount: number
  wordCount: number
  speechRate: number
  fluencyScore: number
  analysisNotes: string[]
}

export default function SpeechAnalysisPage() {
  const [currentTask, setCurrentTask] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [speechAnalyses, setSpeechAnalyses] = useState<SpeechAnalysis[]>([])
  const [showInstructions, setShowInstructions] = useState(true)
  const [isRecordingSupported, setIsRecordingSupported] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recordingStartTimeRef = useRef<number>(0)

  // Check if recording is supported on mount
  useEffect(() => {
    // Set client-side flag
    setIsClient(true)
    
    const checkRecordingSupport = () => {
      if (typeof window === 'undefined') {
        setIsRecordingSupported(false)
        return
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsRecordingSupported(false)
        return
      }

      // Additional check for MediaRecorder support
      if (typeof MediaRecorder === 'undefined') {
        setIsRecordingSupported(false)
        return
      }

      setIsRecordingSupported(true)
    }

    checkRecordingSupport()
  }, [])

  const speechTasks: SpeechTask[] = [
    {
      id: 'description',
      type: 'description',
      title: 'Picture Description',
      instruction: 'Look at the image and describe what you see in detail',
      prompt: 'Describe this peaceful garden scene: What do you see? What colors, objects, and activities can you observe?',
      duration: 120, // 2 minutes
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'storytelling',
      type: 'storytelling',
      title: 'Story Telling',
      instruction: 'Tell a story based on the given prompt',
      prompt: 'Tell me about a memorable day from your childhood. What happened? Who was there? How did you feel?',
      duration: 180, // 3 minutes
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'fluency',
      type: 'fluency',
      title: 'Word Fluency',
      instruction: 'Say as many words as you can that start with the given letter',
      prompt: 'Say as many words as you can that start with the letter "S". For example: sun, smile, special...',
      duration: 60, // 1 minute
      icon: Volume2,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'reading',
      type: 'reading',
      title: 'Reading Passage',
      instruction: 'Read the following passage aloud clearly and naturally',
      prompt: 'The morning sun cast long shadows across the peaceful meadow. Birds chirped melodiously in the distance while a gentle breeze rustled through the leaves of the old oak tree.',
      duration: 90, // 1.5 minutes
      icon: BookOpen,
      color: 'from-orange-500 to-red-500'
    }
  ]

  // Timer effect for recording
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Recording not available on server side')
      }

      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices API not supported in this browser')
      }

      // Check if we're on HTTPS (required for getUserMedia)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Media recording requires HTTPS connection')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        if (audioRef.current) {
          audioRef.current.src = audioUrl
        }
        
        // Simulate speech analysis
        analyzeRecording(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      recordingStartTimeRef.current = Date.now()
    } catch (error) {
      console.error('Error starting recording:', error)
      let errorMessage = 'Unable to access microphone. '
      
      if (error instanceof Error) {
        if (error.message.includes('not supported')) {
          errorMessage += 'Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.'
        } else if (error.message.includes('HTTPS')) {
          errorMessage += 'Audio recording requires a secure connection. Please ensure you\'re using HTTPS.'
        } else if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow microphone access in your browser settings and try again.'
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No microphone found. Please connect a microphone and try again.'
        } else {
          errorMessage += 'Please check your permissions and microphone settings.'
        }
      }
      
      alert(errorMessage)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    setIsRecording(false)
    setIsPaused(false)
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const analyzeRecording = (audioBlob: Blob) => {
    // Simulate AI analysis - in real implementation, this would send to AI service
    const task = speechTasks[currentTask]
    const duration = recordingTime
    
    // Simulate analysis metrics
    const analysis: SpeechAnalysis = {
      taskId: task.id,
      duration: duration,
      pauseCount: Math.floor(Math.random() * 5) + 2,
      wordCount: Math.floor(duration * (1.5 + Math.random())), // Simulate words per second
      speechRate: Math.floor(120 + Math.random() * 60), // Words per minute
      fluencyScore: Math.floor(70 + Math.random() * 25), // Score out of 100
      analysisNotes: [
        duration > 30 ? 'Good speech duration' : 'Speech could be longer',
        'Clear articulation detected',
        'Natural flow observed',
        'Appropriate pauses noted'
      ]
    }

    setSpeechAnalyses(prev => [...prev, analysis])
    setCompletedTasks(prev => [...prev, task.id])
  }

  const playRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
        audioRef.current.onended = () => setIsPlaying(false)
      }
    }
  }

  const resetRecording = () => {
    stopRecording()
    setRecordingTime(0)
    if (audioRef.current) {
      audioRef.current.src = ''
    }
  }

  const nextTask = () => {
    if (currentTask < speechTasks.length - 1) {
      setCurrentTask(currentTask + 1)
      setShowInstructions(true)
      resetRecording()
    }
  }

  const prevTask = () => {
    if (currentTask > 0) {
      setCurrentTask(currentTask - 1)
      setShowInstructions(true)
      resetRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const task = speechTasks[currentTask]
  const Icon = task.icon
  const isTaskCompleted = completedTasks.includes(task.id)
  const allTasksCompleted = completedTasks.length === speechTasks.length

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading speech analysis...</p>
        </div>
      </div>
    )
  }

  if (allTasksCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Speech Analysis Complete!</h1>
            <p className="text-lg text-gray-600">Excellent work completing all speech tasks</p>
          </motion.div>

          <div className="grid gap-6 mb-8">
            {speechAnalyses.map((analysis, index) => {
              const taskInfo = speechTasks.find(t => t.id === analysis.taskId)
              return (
                <Card key={analysis.taskId}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{taskInfo?.title}</h3>
                        <p className="text-gray-600">Duration: {formatTime(analysis.duration)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysis.fluencyScore}/100
                        </div>
                        <div className="text-sm text-gray-500">Fluency Score</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">{analysis.wordCount}</div>
                        <div className="text-gray-500">Words</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{analysis.speechRate}</div>
                        <div className="text-gray-500">WPM</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{analysis.pauseCount}</div>
                        <div className="text-gray-500">Pauses</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <Link href="/assessment/results">
              <Button size="lg" className="mr-4">
                View Complete Results
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" size="lg">
                Back to Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/assessment/cognitive" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cognitive Tests
          </Link>
          <div className="text-sm text-gray-600">
            Task {currentTask + 1} of {speechTasks.length}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {completedTasks.length}/{speechTasks.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedTasks.length / speechTasks.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Task Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {speechTasks.map((t, index) => {
            const TaskIcon = t.icon
            const isCompleted = completedTasks.includes(t.id)
            const isCurrent = index === currentTask
            
            return (
              <Card 
                key={t.id} 
                className={`text-center ${
                  isCurrent ? 'ring-2 ring-blue-500' : ''
                } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
              >
                <CardContent className="p-4">
                  <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-r ${t.color} flex items-center justify-center mb-2 relative`}>
                    <TaskIcon className="w-5 h-5 text-white" />
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-600 absolute -top-1 -right-1 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{t.title}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Task Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${task.color} flex items-center justify-center mb-4`}>
              <Icon className="w-8 h-8 text-white" />
              {isTaskCompleted && (
                <CheckCircle className="w-6 h-6 text-green-600 absolute -top-2 -right-2 bg-white rounded-full" />
              )}
            </div>
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            <CardDescription className="text-base max-w-2xl mx-auto">
              {task.instruction}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {showInstructions ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Task Instructions:</h3>
                  <p className="text-blue-800 text-lg leading-relaxed mb-4">{task.prompt}</p>
                  <div className="flex items-center justify-center text-blue-600">
                    <Timer className="w-4 h-4 mr-2" />
                    Recommended time: {formatTime(task.duration)}
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowInstructions(false)}
                  size="lg"
                  className="mb-4"
                >
                  I'm Ready to Start
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-sm text-gray-500">
                  Make sure your microphone is working and you're in a quiet environment
                </p>
              </motion.div>
            ) : (
              <div className="text-center">
                {/* Recording Interface */}
                <div className="mb-8">
                  <div className="text-lg font-semibold text-gray-900 mb-4">
                    {task.prompt}
                  </div>
                  
                  {/* Recording Status */}
                  <div className="mb-6">
                    {isRecording ? (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Mic className="w-10 h-10 text-white" />
                      </motion.div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MicOff className="w-10 h-10 text-gray-600" />
                      </div>
                    )}
                    
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatTime(recordingTime)}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {isRecording ? (isPaused ? 'Recording Paused' : 'Recording...') : 'Ready to Record'}
                    </div>
                  </div>

                  {/* Recording Controls */}
                  <div className="flex justify-center gap-4 mb-6">
                    {!isRecordingSupported ? (
                      <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="text-yellow-800 font-semibold mb-2">Recording Not Available</div>
                        <div className="text-yellow-700 text-sm mb-4">
                          Audio recording is not supported in your current environment. This may be because:
                        </div>
                        <ul className="text-yellow-700 text-sm text-left space-y-1 mb-4">
                          <li>• Your browser doesn't support audio recording</li>
                          <li>• You're not using a secure (HTTPS) connection</li>
                          <li>• No microphone is available</li>
                        </ul>
                        <Button
                          onClick={() => {
                            // Mark task as completed for demo purposes
                            analyzeRecording(new Blob())
                          }}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Continue Without Recording (Demo)
                        </Button>
                      </div>
                    ) : !isRecording ? (
                      <Button
                        onClick={startRecording}
                        size="lg"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <>
                        {isPaused ? (
                          <Button
                            onClick={resumeRecording}
                            size="lg"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Resume
                          </Button>
                        ) : (
                          <Button
                            onClick={pauseRecording}
                            size="lg"
                            className="bg-yellow-500 hover:bg-yellow-600"
                          >
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                          </Button>
                        )}
                        
                        <Button
                          onClick={stopRecording}
                          size="lg"
                          variant="outline"
                        >
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                    
                    <Button
                      onClick={resetRecording}
                      size="lg"
                      variant="outline"
                      disabled={isRecording}
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Playback */}
                  {audioRef.current?.src && !isRecording && (
                    <div className="border-t pt-6">
                      <p className="text-sm text-gray-600 mb-4">Listen to your recording:</p>
                      <Button
                        onClick={playRecording}
                        variant="outline"
                        className="mr-4"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                    </div>
                  )}

                  <audio ref={audioRef} style={{ display: 'none' }} />
                </div>

                {/* Task Completed State */}
                {isTaskCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold">Task Completed Successfully!</p>
                    <p className="text-green-600 text-sm">Your speech has been analyzed</p>
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={prevTask}
            variant="outline"
            disabled={currentTask === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Task
          </Button>

          {currentTask < speechTasks.length - 1 ? (
            <Button
              onClick={nextTask}
              disabled={!isTaskCompleted}
            >
              Next Task
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Link href="/assessment/results">
              <Button disabled={!isTaskCompleted}>
                View Results
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}