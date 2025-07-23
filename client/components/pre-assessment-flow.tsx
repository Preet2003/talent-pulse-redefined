"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Mic,
  Monitor,
  Wifi,
  FileText,
  Play,
  ArrowRight,
  ArrowLeft,
  Shield,
  Eye,
  Zap,
  Globe,
  Target,
  BookOpen,
  Timer,
  Users,
  Award,
  Info,
} from "lucide-react"

interface PreAssessmentFlowProps {
  assessment: {
    id: number
    title: string
    company: string
    description: string
    duration: number
    questions: number
    difficulty: string
    category: string
    proctored: boolean
    passingScore: number
    attempts: number
  }
  onStart: () => void
  onCancel: () => void
}

export function PreAssessmentFlow({ assessment, onStart, onCancel }: PreAssessmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [systemChecks, setSystemChecks] = useState({
    camera: null as boolean | null,
    microphone: null as boolean | null,
    browser: null as boolean | null,
    internet: null as boolean | null,
  })
  const [practiceScore, setPracticeScore] = useState<number | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [isRunningChecks, setIsRunningChecks] = useState(false)
  const [showPractice, setShowPractice] = useState(false)
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0)
  const [practiceAnswers, setPracticeAnswers] = useState<string[]>([])

  const steps = [
    { id: 0, title: "Instructions", icon: FileText },
    { id: 1, title: "System Check", icon: Monitor },
    { id: 2, title: "Practice", icon: BookOpen },
    { id: 3, title: "Terms & Privacy", icon: Shield },
    { id: 4, title: "Confirmation", icon: CheckCircle },
  ]

  const practiceQuestions = [
    {
      question: "What is the primary purpose of version control systems like Git?",
      options: [
        "To compile code faster",
        "To track changes and collaborate on code",
        "To debug applications",
        "To deploy applications to production",
      ],
      correct: 1,
      explanation:
        "Version control systems like Git are primarily used to track changes in code over time and enable multiple developers to collaborate on the same project safely.",
    },
    {
      question: "Which of the following is NOT a valid JavaScript data type?",
      options: ["string", "boolean", "integer", "undefined"],
      correct: 2,
      explanation:
        "JavaScript doesn't have a specific 'integer' data type. Numbers in JavaScript are represented as 'number' type, which can be integers or floating-point numbers.",
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
      correct: 2,
      explanation:
        "CSS stands for Cascading Style Sheets. It's used to describe the presentation of a document written in HTML or XML.",
    },
  ]

  const runSystemChecks = async () => {
    setIsRunningChecks(true)

    // Camera check
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setSystemChecks((prev) => ({ ...prev, camera: true }))
      stream.getTracks().forEach((track) => track.stop())
    } catch {
      setSystemChecks((prev) => ({ ...prev, camera: false }))
    }

    // Microphone check
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setSystemChecks((prev) => ({ ...prev, microphone: true }))
      stream.getTracks().forEach((track) => track.stop())
    } catch {
      setSystemChecks((prev) => ({ ...prev, microphone: false }))
    }

    // Browser compatibility check
    const isCompatible = "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices
    setSystemChecks((prev) => ({ ...prev, browser: isCompatible }))

    // Internet connection check
    const isOnline = navigator.onLine
    setSystemChecks((prev) => ({ ...prev, internet: isOnline }))

    setIsRunningChecks(false)
  }

  const handlePracticeAnswer = (answerIndex: string) => {
    const newAnswers = [...practiceAnswers]
    newAnswers[practiceQuestionIndex] = answerIndex
    setPracticeAnswers(newAnswers)
  }

  const calculatePracticeScore = () => {
    let correct = 0
    practiceAnswers.forEach((answer, index) => {
      if (Number.parseInt(answer) === practiceQuestions[index].correct) {
        correct++
      }
    })
    return Math.round((correct / practiceQuestions.length) * 100)
  }

  const finishPractice = () => {
    const score = calculatePracticeScore()
    setPracticeScore(score)
    setShowPractice(false)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return Object.values(systemChecks).every((check) => check === true)
      case 3:
        return termsAccepted && privacyAccepted
      default:
        return true
    }
  }

  const getStepProgress = () => ((currentStep + 1) / steps.length) * 100

  const renderInstructions = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Assessment Instructions</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please read the following instructions carefully before starting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Assessment Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Timer className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Questions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.questions} questions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Passing Score</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.passingScore}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Attempts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.attempts} allowed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Time Management</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You have {assessment.duration} minutes to complete all questions. Plan your time accordingly.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Navigation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can navigate between questions and review your answers before submitting.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Auto-Save</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your progress is automatically saved. You can resume if disconnected.
                </p>
              </div>
            </div>
            {assessment.proctored && (
              <div className="flex items-start space-x-3">
                <Eye className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Proctored Assessment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This assessment is monitored. Keep your camera on and avoid suspicious behavior.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {assessment.proctored && (
        <Alert>
          <Camera className="h-4 w-4" />
          <AlertDescription>
            <strong>Proctoring Notice:</strong> This assessment requires camera and microphone access for monitoring
            purposes. Ensure you're in a quiet, well-lit environment with minimal distractions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )

  const renderSystemCheck = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System Requirements Check</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We'll verify your system meets the requirements for this assessment
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Camera className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Camera Access</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Required for proctored assessments</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {systemChecks.camera === null ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : systemChecks.camera ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {systemChecks.camera === null ? "Checking..." : systemChecks.camera ? "Available" : "Not Available"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mic className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Microphone Access</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Required for audio monitoring</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {systemChecks.microphone === null ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : systemChecks.microphone ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {systemChecks.microphone === null
                    ? "Checking..."
                    : systemChecks.microphone
                      ? "Available"
                      : "Not Available"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Browser Compatibility</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modern browser with media support</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {systemChecks.browser === null ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : systemChecks.browser ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {systemChecks.browser === null
                    ? "Checking..."
                    : systemChecks.browser
                      ? "Compatible"
                      : "Not Compatible"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Internet Connection</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stable connection required</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {systemChecks.internet === null ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : systemChecks.internet ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {systemChecks.internet === null
                    ? "Checking..."
                    : systemChecks.internet
                      ? "Connected"
                      : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button onClick={runSystemChecks} disabled={isRunningChecks} className="bg-blue-600 hover:bg-blue-700">
              {isRunningChecks ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Running Checks...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Run System Check
                </>
              )}
            </Button>
          </div>

          {Object.values(systemChecks).some((check) => check === false) && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Some system requirements are not met. Please ensure you have granted camera and microphone permissions,
                and are using a compatible browser with a stable internet connection.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderPractice = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Practice Questions</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Warm up with these sample questions to get familiar with the format
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {!showPractice ? (
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-lg font-medium">Ready to practice?</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Try {practiceQuestions.length} sample questions to get familiar with the assessment format. This won't
                  affect your actual score.
                </p>
              </div>

              {practiceScore !== null && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Practice Complete!</strong> You scored {practiceScore}% on the practice questions. You can
                    retake the practice or proceed to the assessment.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center space-x-3">
                <Button onClick={() => setShowPractice(true)} variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  {practiceScore !== null ? "Retake Practice" : "Start Practice"}
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="bg-blue-600 hover:bg-blue-700">
                  Skip Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Question {practiceQuestionIndex + 1} of {practiceQuestions.length}
                </h3>
                <Badge variant="outline">Practice Mode</Badge>
              </div>

              <Progress value={((practiceQuestionIndex + 1) / practiceQuestions.length) * 100} className="w-full" />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">{practiceQuestions[practiceQuestionIndex].question}</h4>

                <div className="space-y-2">
                  {practiceQuestions[practiceQuestionIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-${index}`}
                        checked={practiceAnswers[practiceQuestionIndex] === index.toString()}
                        onCheckedChange={() => handlePracticeAnswer(index.toString())}
                      />
                      <label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {practiceAnswers[practiceQuestionIndex] && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Explanation:</strong> {practiceQuestions[practiceQuestionIndex].explanation}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setPracticeQuestionIndex(Math.max(0, practiceQuestionIndex - 1))}
                  disabled={practiceQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {practiceQuestionIndex < practiceQuestions.length - 1 ? (
                  <Button
                    onClick={() => setPracticeQuestionIndex(practiceQuestionIndex + 1)}
                    disabled={!practiceAnswers[practiceQuestionIndex]}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={finishPractice}
                    disabled={practiceAnswers.length !== practiceQuestions.length}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Finish Practice
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderTermsAndPrivacy = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Terms & Privacy</h2>
        <p className="text-gray-600 dark:text-gray-400">Please review and accept our terms and privacy policy</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Terms & Conditions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 w-full border rounded p-4">
              <div className="space-y-3 text-sm">
                <p>
                  <strong>1. Assessment Rules</strong>
                </p>
                <p>
                  By taking this assessment, you agree to follow all rules and guidelines. Any form of cheating or
                  misconduct will result in disqualification.
                </p>

                <p>
                  <strong>2. Time Limits</strong>
                </p>
                <p>
                  You must complete the assessment within the allocated time. Extensions are not typically granted
                  except in exceptional circumstances.
                </p>

                <p>
                  <strong>3. Technical Issues</strong>
                </p>
                <p>
                  If you experience technical difficulties, contact support immediately. We are not responsible for
                  issues caused by your internet connection or device.
                </p>

                <p>
                  <strong>4. Results and Scoring</strong>
                </p>
                <p>
                  Results will be provided according to the timeline specified. Scores are final and not subject to
                  appeal unless there was a technical error.
                </p>

                <p>
                  <strong>5. Intellectual Property</strong>
                </p>
                <p>
                  All assessment content is proprietary and confidential. You may not share, reproduce, or discuss
                  assessment questions with others.
                </p>
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                I have read and accept the Terms & Conditions
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Privacy Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 w-full border rounded p-4">
              <div className="space-y-3 text-sm">
                <p>
                  <strong>1. Data Collection</strong>
                </p>
                <p>
                  We collect your responses, timing data, and if applicable, proctoring footage for assessment purposes
                  only.
                </p>

                <p>
                  <strong>2. Data Usage</strong>
                </p>
                <p>
                  Your data is used solely for evaluation and may be shared with the organization that invited you to
                  take this assessment.
                </p>

                <p>
                  <strong>3. Data Storage</strong>
                </p>
                <p>
                  Assessment data is stored securely and retained according to our data retention policy. Proctoring
                  footage is deleted after evaluation.
                </p>

                <p>
                  <strong>4. Third Parties</strong>
                </p>
                <p>
                  We do not sell or share your personal information with third parties except as necessary for
                  assessment delivery and evaluation.
                </p>

                <p>
                  <strong>5. Your Rights</strong>
                </p>
                <p>
                  You have the right to request access to your data and, in some cases, request deletion after the
                  assessment process is complete.
                </p>
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="privacy" checked={privacyAccepted} onCheckedChange={setPrivacyAccepted} />
              <label htmlFor="privacy" className="text-sm cursor-pointer">
                I have read and accept the Privacy Policy
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {assessment.proctored && (
        <Alert>
          <Camera className="h-4 w-4" />
          <AlertDescription>
            <strong>Proctoring Consent:</strong> By proceeding, you consent to video and audio recording during the
            assessment. This data will be used solely for monitoring purposes and will be handled according to our
            privacy policy.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to Start</h2>
        <p className="text-gray-600 dark:text-gray-400">
          All requirements have been met. You're ready to begin the assessment.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assessment</p>
              <p className="font-semibold">{assessment.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
              <p className="font-semibold">{assessment.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
              <p className="font-semibold">{assessment.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Questions</p>
              <p className="font-semibold">{assessment.questions} questions</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Passing Score</p>
              <p className="font-semibold">{assessment.passingScore}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty</p>
              <Badge
                className={
                  assessment.difficulty === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : assessment.difficulty === "Intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {assessment.difficulty}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Pre-Assessment Checklist</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Instructions reviewed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>System requirements verified</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Practice completed {practiceScore !== null ? `(${practiceScore}%)` : "(Skipped)"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Terms and privacy accepted</span>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Once you start the assessment, the timer will begin immediately. Make sure
              you're in a quiet environment and won't be interrupted.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onStart} size="lg" className="bg-green-600 hover:bg-green-700 px-8">
          <Play className="mr-2 h-5 w-5" />
          Start Assessment
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pre-Assessment Setup</h1>
              <Badge variant="outline">{assessment.title}</Badge>
            </div>

            <Progress value={getStepProgress()} className="w-full" />

            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      index <= currentStep ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-400",
                    )}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium text-center",
                      index <= currentStep ? "text-blue-600" : "text-gray-400",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {currentStep === 0 && renderInstructions()}
        {currentStep === 1 && renderSystemCheck()}
        {currentStep === 2 && renderPractice()}
        {currentStep === 3 && renderTermsAndPrivacy()}
        {currentStep === 4 && renderConfirmation()}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => (currentStep === 0 ? onCancel() : setCurrentStep(currentStep - 1))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 0 ? "Cancel" : "Previous"}
            </Button>

            {currentStep < steps.length - 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
