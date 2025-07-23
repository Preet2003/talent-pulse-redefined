"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Clock,
  Calendar,
  Mail,
  Bell,
  Star,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Home,
  BarChart3,
  MessageSquare,
  Download,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface PostAssessmentCompletionProps {
  assessmentTitle: string
  completionTime: string
  totalQuestions: number
  answeredQuestions: number
  estimatedResultsTime: string
  nextSteps: string[]
  onReturnToDashboard: () => void
}

export function PostAssessmentCompletion({
  assessmentTitle,
  completionTime,
  totalQuestions,
  answeredQuestions,
  estimatedResultsTime,
  nextSteps,
  onReturnToDashboard,
}: PostAssessmentCompletionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [feedback, setFeedback] = useState({
    difficulty: "",
    clarity: "",
    technical: "",
    overall: "",
    comments: "",
  })
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const router = useRouter()

  const steps = ["Confirmation", "Results Timeline", "Next Steps", "Feedback", "Complete"]

  useEffect(() => {
    // Auto-progress through first few steps
    const timer = setTimeout(() => {
      if (currentStep < 2) {
        setCurrentStep((prev) => prev + 1)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentStep])

  const handleFeedbackSubmit = async () => {
    setIsSubmittingFeedback(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmittingFeedback(false)
    setShowThankYou(true)

    setTimeout(() => {
      setCurrentStep(4)
    }, 2000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-600">Assessment Submitted Successfully!</h2>
              <p className="text-muted-foreground">
                Your responses have been securely recorded and are being processed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Completion Time</div>
                  <div className="text-lg font-bold">{completionTime}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">Questions Answered</div>
                  <div className="text-lg font-bold">
                    {answeredQuestions}/{totalQuestions}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <div className="text-sm font-medium">Completion Rate</div>
                  <div className="text-lg font-bold">{Math.round((answeredQuestions / totalQuestions) * 100)}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Processing your submission...</span>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Results Timeline</h2>
              <p className="text-muted-foreground">Here's when you can expect to receive your assessment results</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Assessment Submitted</div>
                      <div className="text-sm text-muted-foreground">Just now</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Initial Processing</div>
                      <div className="text-sm text-muted-foreground">In progress - 15 minutes</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Detailed Analysis</div>
                      <div className="text-sm text-muted-foreground">2-4 hours</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Results Available</div>
                      <div className="text-sm text-muted-foreground">{estimatedResultsTime}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    You'll be notified when results are ready
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    We'll send you an email and in-app notification as soon as your detailed results are available.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <ArrowRight className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold mb-2">What's Next?</h2>
              <p className="text-muted-foreground">
                Here are the recommended next steps while you wait for your results
              </p>
            </div>

            <div className="grid gap-4">
              {nextSteps.map((step, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-sm font-medium text-purple-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{step}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-medium">Join Study Groups</div>
                      <div className="text-sm text-muted-foreground">Connect with other candidates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-medium">Practice More</div>
                      <div className="text-sm text-muted-foreground">Access practice questions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button onClick={() => setCurrentStep(3)} className="px-8">
                Continue to Feedback
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h2 className="text-2xl font-bold mb-2">Share Your Experience</h2>
              <p className="text-muted-foreground">
                Your feedback helps us improve the assessment experience for everyone
              </p>
            </div>

            {showThankYou ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Thank you for your feedback!</h3>
                <p className="text-muted-foreground">
                  Your input is valuable and will help us enhance future assessments.
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">How would you rate the difficulty level?</Label>
                      <RadioGroup
                        value={feedback.difficulty}
                        onValueChange={(value) => setFeedback((prev) => ({ ...prev, difficulty: value }))}
                        className="flex gap-4 mt-2"
                      >
                        {["Too Easy", "Just Right", "Too Hard"].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`difficulty-${option}`} />
                            <Label htmlFor={`difficulty-${option}`} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Were the questions clear and well-written?</Label>
                      <RadioGroup
                        value={feedback.clarity}
                        onValueChange={(value) => setFeedback((prev) => ({ ...prev, clarity: value }))}
                        className="flex gap-4 mt-2"
                      >
                        {["Very Clear", "Mostly Clear", "Somewhat Unclear", "Very Unclear"].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`clarity-${option}`} />
                            <Label htmlFor={`clarity-${option}`} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">How was the technical experience?</Label>
                      <RadioGroup
                        value={feedback.technical}
                        onValueChange={(value) => setFeedback((prev) => ({ ...prev, technical: value }))}
                        className="flex gap-4 mt-2"
                      >
                        {["Excellent", "Good", "Fair", "Poor"].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`technical-${option}`} />
                            <Label htmlFor={`technical-${option}`} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Overall satisfaction</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => setFeedback((prev) => ({ ...prev, overall: rating.toString() }))}
                          >
                            <Star
                              className={cn(
                                "h-6 w-6",
                                Number.parseInt(feedback.overall) >= rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300",
                              )}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="comments" className="text-sm font-medium">
                        Additional comments (optional)
                      </Label>
                      <Textarea
                        id="comments"
                        placeholder="Share any additional thoughts about your assessment experience..."
                        value={feedback.comments}
                        onChange={(e) => setFeedback((prev) => ({ ...prev, comments: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(4)} className="flex-1">
                      Skip Feedback
                    </Button>
                    <Button onClick={handleFeedbackSubmit} disabled={isSubmittingFeedback} className="flex-1">
                      {isSubmittingFeedback ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Feedback"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Award className="h-10 w-10 text-blue-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Assessment Complete!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for completing the {assessmentTitle}. Your results will be available soon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent"
                onClick={() => router.push("/candidate/dashboard")}
              >
                <Home className="h-6 w-6" />
                <span>Dashboard</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent"
                onClick={() => router.push("/candidate/dashboard?tab=results")}
              >
                <BarChart3 className="h-6 w-6" />
                <span>View Results</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent"
                onClick={() => router.push("/candidate/dashboard?tab=practice")}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Practice More</span>
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Share Your Achievement</h3>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            </div>

            <Button onClick={onReturnToDashboard} className="px-8">
              Return to Dashboard
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step} className={cn("flex items-center", index < steps.length - 1 && "flex-1")}>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium",
                      index <= currentStep ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-4", index < currentStep ? "bg-primary" : "bg-muted")} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          </div>

          {/* Step content */}
          <Card>
            <CardContent className="p-8">{renderStepContent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
