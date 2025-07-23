"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Camera,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Upload,
  Code,
  CheckCircle,
  Save,
  Flag,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  type: "multiple-choice" | "multiple-select" | "essay" | "code" | "file-upload"
  question: string
  options?: string[]
  code?: string
  language?: string
  timeLimit?: number
  points: number
}

interface AssessmentTakingInterfaceProps {
  assessmentId: string
  title: string
  totalQuestions: number
  timeLimit: number
  questions: Question[]
  onComplete: (answers: Record<string, any>) => void
}

export function AssessmentTakingInterface({
  assessmentId,
  title,
  totalQuestions,
  timeLimit,
  questions,
  onComplete,
}: AssessmentTakingInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // Convert to seconds
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number | null>(null)
  const [isProctoring, setIsProctoring] = useState(true)
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0)
  const [behaviorWarnings, setBehaviorWarnings] = useState<string[]>([])
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)

  // Timer effects
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitAssessment()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Question timer effect
  useEffect(() => {
    const currentQ = questions[currentQuestion]
    if (currentQ?.timeLimit) {
      setQuestionTimeRemaining(currentQ.timeLimit * 60)
      const timer = setInterval(() => {
        setQuestionTimeRemaining((prev) => {
          if (prev && prev <= 1) {
            handleNextQuestion()
            return null
          }
          return prev ? prev - 1 : null
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      setQuestionTimeRemaining(null)
    }
  }, [currentQuestion])

  // Auto-save effect
  useEffect(() => {
    const autoSave = setTimeout(() => {
      setAutoSaveStatus("saving")
      // Simulate auto-save
      setTimeout(() => {
        setAutoSaveStatus("saved")
      }, 1000)
    }, 2000)

    return () => clearTimeout(autoSave)
  }, [answers])

  // Proctoring effects
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isProctoring) {
        setTabSwitchWarnings((prev) => prev + 1)
        setBehaviorWarnings((prev) => [...prev, `Tab switched at ${new Date().toLocaleTimeString()}`])
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      if (isProctoring) {
        e.preventDefault()
        setBehaviorWarnings((prev) => [...prev, `Right-click attempted at ${new Date().toLocaleTimeString()}`])
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProctoring && (e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v" || e.key === "a")) {
        e.preventDefault()
        setBehaviorWarnings((prev) => [...prev, `Copy/paste attempted at ${new Date().toLocaleTimeString()}`])
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isProctoring])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleBookmark = (questionIndex: number) => {
    setBookmarkedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleQuestionJump = (questionIndex: number) => {
    setCurrentQuestion(questionIndex)
  }

  const handleFileUpload = (questionId: string, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [questionId]: file,
    }))
    handleAnswerChange(questionId, file.name)
  }

  const handleSubmitAssessment = () => {
    const finalAnswers = {
      ...answers,
      ...uploadedFiles,
      metadata: {
        tabSwitchWarnings,
        behaviorWarnings,
        timeSpent: timeLimit * 60 - timeRemaining,
        completedAt: new Date().toISOString(),
      },
    }
    onComplete(finalAnswers)
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  const renderQuestion = () => {
    if (!currentQ) return null

    switch (currentQ.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            className="space-y-3"
          >
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "multiple-select":
        const selectedOptions = answers[currentQ.id] || []
        return (
          <div className="space-y-3">
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    const newSelection = checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter((item: string) => item !== option)
                    handleAnswerChange(currentQ.id, newSelection)
                  }}
                />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "essay":
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={answers[currentQ.id] || ""}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="text-sm text-muted-foreground">
              Word count: {(answers[currentQ.id] || "").split(" ").filter(Boolean).length}
            </div>
          </div>
        )

      case "code":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code className="h-4 w-4" />
              Language: {currentQ.language || "JavaScript"}
            </div>
            <div className="relative">
              <Textarea
                ref={codeEditorRef}
                placeholder={`// Write your ${currentQ.language || "JavaScript"} code here...\n${currentQ.code || ""}`}
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                className="min-h-[300px] font-mono text-sm resize-none"
              />
            </div>
          </div>
        )

      case "file-upload":
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Upload your file</p>
                <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(currentQ.id, file)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
            {uploadedFiles[currentQ.id] && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{uploadedFiles[currentQ.id].name}</span>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {totalQuestions}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Auto-save status */}
              <div className="flex items-center gap-2 text-sm">
                <Save
                  className={cn(
                    "h-4 w-4",
                    autoSaveStatus === "saved" && "text-green-600",
                    autoSaveStatus === "saving" && "text-yellow-600 animate-spin",
                    autoSaveStatus === "error" && "text-red-600",
                  )}
                />
                <span className="text-muted-foreground">
                  {autoSaveStatus === "saved" && "Saved"}
                  {autoSaveStatus === "saving" && "Saving..."}
                  {autoSaveStatus === "error" && "Error saving"}
                </span>
              </div>

              {/* Proctoring indicator */}
              {isProctoring && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    <Camera className="h-4 w-4 text-red-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">Monitored</span>
                </div>
              )}

              {/* Time remaining */}
              <div className="flex items-center gap-2">
                <Clock className={cn("h-4 w-4", timeRemaining < 300 && "text-red-500")} />
                <span className={cn("font-mono text-sm", timeRemaining < 300 && "text-red-500 font-semibold")}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Question timer */}
              {questionTimeRemaining && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    Q: {formatTime(questionTimeRemaining)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Progress: {answeredQuestions}/{totalQuestions} answered
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Warnings */}
      {(tabSwitchWarnings > 0 || behaviorWarnings.length > 0) && (
        <div className="border-b bg-yellow-50 dark:bg-yellow-950">
          <div className="container mx-auto px-4 py-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {tabSwitchWarnings > 0 && (
                  <span className="block">
                    Warning: {tabSwitchWarnings} tab switch(es) detected. Excessive violations may result in assessment
                    termination.
                  </span>
                )}
                {behaviorWarnings.length > 0 && (
                  <span className="block text-xs mt-1">
                    Recent activity: {behaviorWarnings[behaviorWarnings.length - 1]}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestion === index ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "relative h-8 w-8 p-0",
                        answers[questions[index].id] &&
                          currentQuestion !== index &&
                          "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700",
                        bookmarkedQuestions.has(index) && "ring-2 ring-yellow-400",
                      )}
                      onClick={() => handleQuestionJump(index)}
                    >
                      {index + 1}
                      {bookmarkedQuestions.has(index) && (
                        <BookmarkCheck className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                      )}
                    </Button>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-primary rounded" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 border-2 border-yellow-400 rounded" />
                    <span>Bookmarked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{currentQ?.type?.replace("-", " ").toUpperCase()}</Badge>
                      <Badge variant="outline">
                        {currentQ?.points} {currentQ?.points === 1 ? "point" : "points"}
                      </Badge>
                      {currentQ?.timeLimit && <Badge variant="outline">{currentQ.timeLimit} min limit</Badge>}
                    </div>
                    <CardTitle className="text-lg leading-relaxed">{currentQ?.question}</CardTitle>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => handleBookmark(currentQuestion)} className="ml-4">
                    {bookmarkedQuestions.has(currentQuestion) ? (
                      <BookmarkCheck className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {renderQuestion()}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {bookmarkedQuestions.size > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const bookmarked = Array.from(bookmarkedQuestions)
                          const nextBookmarked = bookmarked.find((q) => q > currentQuestion) || bookmarked[0]
                          if (nextBookmarked !== undefined) {
                            handleQuestionJump(nextBookmarked)
                          }
                        }}
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Review Bookmarked
                      </Button>
                    )}

                    {currentQuestion === questions.length - 1 ? (
                      <Button onClick={() => setShowSubmitConfirm(true)} className="bg-green-600 hover:bg-green-700">
                        Submit Assessment
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Submit Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to submit your assessment? This action cannot be undone.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Questions answered:</span>
                  <span>
                    {answeredQuestions}/{totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Questions bookmarked:</span>
                  <span>{bookmarkedQuestions.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time remaining:</span>
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {answeredQuestions < totalQuestions && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You have {totalQuestions - answeredQuestions} unanswered questions.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} className="flex-1">
                  Continue Assessment
                </Button>
                <Button onClick={handleSubmitAssessment} className="flex-1 bg-green-600 hover:bg-green-700">
                  Submit Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
