"use client"
import { PostAssessmentCompletion } from "@/components/post-assessment-completion"
import { useRouter } from "next/navigation"

export default function AssessmentCompletePage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Mock data - in real app, this would come from API based on the assessment
  const mockCompletionData = {
    assessmentTitle: "Full Stack Developer Assessment",
    completionTime: "1h 23m",
    totalQuestions: 25,
    answeredQuestions: 24,
    estimatedResultsTime: "Within 24 hours",
    nextSteps: [
      "Check your email for a detailed results notification",
      "Review your performance analytics in the dashboard",
      "Explore recommended learning resources based on your results",
      "Schedule a follow-up interview if you performed well",
      "Consider taking additional practice assessments to improve your skills",
    ],
  }

  const handleReturnToDashboard = () => {
    router.push("/candidate/dashboard")
  }

  return (
    <PostAssessmentCompletion
      assessmentTitle={mockCompletionData.assessmentTitle}
      completionTime={mockCompletionData.completionTime}
      totalQuestions={mockCompletionData.totalQuestions}
      answeredQuestions={mockCompletionData.answeredQuestions}
      estimatedResultsTime={mockCompletionData.estimatedResultsTime}
      nextSteps={mockCompletionData.nextSteps}
      onReturnToDashboard={handleReturnToDashboard}
    />
  )
}
