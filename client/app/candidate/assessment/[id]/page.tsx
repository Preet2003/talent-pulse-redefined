"use client"
import { AssessmentTakingInterface } from "@/components/assessment-taking-interface"
import { useRouter } from "next/navigation"

// Mock data - in real app, this would come from API
const mockAssessment = {
  id: "assessment-1",
  title: "Full Stack Developer Assessment",
  totalQuestions: 25,
  timeLimit: 90, // minutes
  questions: [
    {
      id: "q1",
      type: "multiple-choice" as const,
      question: "Which of the following is NOT a valid HTTP method?",
      options: ["GET", "POST", "FETCH", "DELETE"],
      points: 2,
    },
    {
      id: "q2",
      type: "multiple-select" as const,
      question: "Which of the following are JavaScript frameworks? (Select all that apply)",
      options: ["React", "Angular", "Vue.js", "Django", "Express.js"],
      points: 3,
    },
    {
      id: "q3",
      type: "essay" as const,
      question:
        "Explain the difference between SQL and NoSQL databases. Provide examples of when you would use each type.",
      points: 10,
    },
    {
      id: "q4",
      type: "code" as const,
      question: "Write a JavaScript function that takes an array of numbers and returns the sum of all even numbers.",
      language: "JavaScript",
      code: "function sumEvenNumbers(numbers) {\n  // Your code here\n}",
      timeLimit: 15,
      points: 15,
    },
    {
      id: "q5",
      type: "file-upload" as const,
      question: "Upload your portfolio or a sample project that demonstrates your full-stack development skills.",
      points: 20,
    },
    // Add more mock questions to reach 25 total
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `q${i + 6}`,
      type: "multiple-choice" as const,
      question: `Sample question ${i + 6}: Which of the following best describes ${["React", "Node.js", "MongoDB", "Express", "TypeScript"][i % 5]}?`,
      options: ["A frontend library", "A backend framework", "A database", "A programming language"],
      points: 2,
    })),
  ],
}

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleAssessmentComplete = (answers: Record<string, any>) => {
    // In real app, submit answers to API
    console.log("Assessment completed with answers:", answers)

    // Navigate to completion page
    router.push(`/candidate/assessment/${params.id}/complete`)
  }

  return (
    <AssessmentTakingInterface
      assessmentId={params.id}
      title={mockAssessment.title}
      totalQuestions={mockAssessment.totalQuestions}
      timeLimit={mockAssessment.timeLimit}
      questions={mockAssessment.questions}
      onComplete={handleAssessmentComplete}
    />
  )
}
