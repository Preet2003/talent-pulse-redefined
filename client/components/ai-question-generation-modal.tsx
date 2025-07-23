"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  X,
  Sparkles,
  Brain,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  RefreshCw,
  Info,
  Zap,
  BookOpen,
  Clock,
  Award,
} from "lucide-react"

interface AIQuestionGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuestionsGenerated: (questions: Question[]) => void
  skillAreaId?: string
}

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay" | "coding"
  title: string
  content: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: "easy" | "medium" | "hard"
  timeLimit?: number
  explanation?: string
  btLevel?: string
}

interface GenerationConfig {
  domain: string
  topic: string
  subtopic: string
  difficulty: string
  btLevel: string
  numberOfQuestions: number
}

const domains = ["Technology", "Business", "Marketing", "Finance", "Healthcare", "Education", "Engineering"]

const topicsByDomain: Record<string, string[]> = {
  Technology: ["Software Development", "Data Science", "Cybersecurity", "Cloud Computing", "AI/ML"],
  Business: ["Strategy", "Operations", "Leadership", "Project Management", "Analytics"],
  Marketing: ["Digital Marketing", "Content Marketing", "SEO/SEM", "Social Media", "Brand Management"],
  Finance: ["Investment Banking", "Financial Analysis", "Risk Management", "Accounting", "Corporate Finance"],
  Healthcare: ["Clinical Practice", "Healthcare Management", "Medical Research", "Public Health", "Nursing"],
  Education: ["Curriculum Design", "Educational Technology", "Assessment", "Pedagogy", "Administration"],
  Engineering: [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Software Engineering",
    "Chemical Engineering",
  ],
}

const subtopicsByTopic: Record<string, string[]> = {
  "Software Development": ["Frontend Development", "Backend Development", "Full Stack", "Mobile Development", "DevOps"],
  "Data Science": ["Machine Learning", "Data Analysis", "Statistics", "Data Visualization", "Big Data"],
  "Digital Marketing": [
    "PPC Advertising",
    "Email Marketing",
    "Content Strategy",
    "Analytics",
    "Conversion Optimization",
  ],
  Cybersecurity: ["Network Security", "Ethical Hacking", "Risk Assessment", "Compliance", "Incident Response"],
  Strategy: ["Business Planning", "Competitive Analysis", "Market Research", "Strategic Planning", "Innovation"],
}

const bloomsTaxonomyLevels = [
  { value: "remember", label: "Remember", description: "Recall facts and basic concepts" },
  { value: "understand", label: "Understand", description: "Explain ideas or concepts" },
  { value: "apply", label: "Apply", description: "Use information in new situations" },
  { value: "analyze", label: "Analyze", description: "Draw connections among ideas" },
  { value: "evaluate", label: "Evaluate", description: "Justify a stand or decision" },
  { value: "create", label: "Create", description: "Produce new or original work" },
]

const difficultyLevels = [
  { value: "beginner", label: "Beginner", description: "Basic concepts and fundamentals", color: "green" },
  { value: "intermediate", label: "Intermediate", description: "Applied knowledge and skills", color: "yellow" },
  { value: "advanced", label: "Advanced", description: "Complex problem-solving", color: "orange" },
  { value: "expert", label: "Expert", description: "Mastery and innovation", color: "red" },
]

export function AIQuestionGenerationModal({
  open,
  onOpenChange,
  onQuestionsGenerated,
  skillAreaId,
}: AIQuestionGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set())

  const [config, setConfig] = useState<GenerationConfig>({
    domain: "",
    topic: "",
    subtopic: "",
    difficulty: "",
    btLevel: "",
    numberOfQuestions: 5,
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) {
      resetModal()
    }
  }, [open])

  const resetModal = () => {
    setCurrentStep(1)
    setConfig({
      domain: "",
      topic: "",
      subtopic: "",
      difficulty: "",
      btLevel: "",
      numberOfQuestions: 5,
    })
    setGeneratedQuestions([])
    setSelectedQuestions(new Set())
    setFormErrors({})
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const updateConfig = (field: keyof GenerationConfig, value: string | number) => {
    setConfig((prev) => {
      const updated = { ...prev, [field]: value }

      // Reset dependent fields when parent changes
      if (field === "domain") {
        updated.topic = ""
        updated.subtopic = ""
      } else if (field === "topic") {
        updated.subtopic = ""
      }

      return updated
    })

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep1 = () => {
    const errors: Record<string, string> = {}

    if (!config.domain) errors.domain = "Please select a domain"
    if (!config.difficulty) errors.difficulty = "Please select a difficulty level"
    if (!config.btLevel) errors.btLevel = "Please select a Bloom's Taxonomy level"
    if (config.numberOfQuestions < 1 || config.numberOfQuestions > 50) {
      errors.numberOfQuestions = "Number of questions must be between 1 and 50"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGenerate = async () => {
    if (!validateStep1()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setCurrentStep(2)

    // Simulate AI generation process
    const steps = [
      "Analyzing domain and topic...",
      "Applying Bloom's Taxonomy framework...",
      "Generating question content...",
      "Creating answer options...",
      "Adding explanations...",
      "Finalizing questions...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    // Generate mock questions
    const mockQuestions = generateMockQuestions(config)
    setGeneratedQuestions(mockQuestions)
    setSelectedQuestions(new Set(mockQuestions.map((_, index) => index)))
    setIsGenerating(false)
    setCurrentStep(3)
  }

  const generateMockQuestions = (config: GenerationConfig): Question[] => {
    const questions: Question[] = []
    const questionTypes: Question["type"][] = ["multiple-choice", "true-false", "short-answer", "essay"]

    for (let i = 0; i < config.numberOfQuestions; i++) {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      const btLevelLabel = bloomsTaxonomyLevels.find((level) => level.value === config.btLevel)?.label || "Apply"

      const question: Question = {
        id: `ai-${Date.now()}-${i}`,
        type,
        title: `${config.domain} Question ${i + 1}: ${btLevelLabel} Level`,
        content: `This is an AI-generated ${config.difficulty} level question about ${config.topic || config.domain} that tests the ${btLevelLabel.toLowerCase()} cognitive level according to Bloom's Taxonomy.`,
        points: config.difficulty === "beginner" ? 1 : config.difficulty === "intermediate" ? 2 : 3,
        difficulty: config.difficulty as Question["difficulty"],
        timeLimit: type === "essay" ? 300 : type === "short-answer" ? 120 : 60,
        btLevel: config.btLevel,
        explanation: `This question is designed to assess ${btLevelLabel.toLowerCase()} skills in ${config.topic || config.domain}.`,
      }

      if (type === "multiple-choice") {
        question.options = [
          `Correct answer for ${config.topic || config.domain}`,
          `Incorrect option A`,
          `Incorrect option B`,
          `Incorrect option C`,
        ]
        question.correctAnswer = 0
      } else if (type === "true-false") {
        question.correctAnswer = Math.random() > 0.5 ? "true" : "false"
      } else {
        question.correctAnswer = `Sample answer for ${config.topic || config.domain} question`
      }

      questions.push(question)
    }

    return questions
  }

  const handleQuestionToggle = (index: number) => {
    const newSelected = new Set(selectedQuestions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedQuestions(newSelected)
  }

  const handleSelectAll = () => {
    setSelectedQuestions(new Set(generatedQuestions.map((_, index) => index)))
  }

  const handleDeselectAll = () => {
    setSelectedQuestions(new Set())
  }

  const handleImportQuestions = () => {
    const questionsToImport = Array.from(selectedQuestions).map((index) => generatedQuestions[index])
    onQuestionsGenerated(questionsToImport)
    onOpenChange(false)
    resetModal()
  }

  const steps = [
    { number: 1, title: "Configuration", icon: Brain },
    { number: 2, title: "AI Generation", icon: Sparkles },
    { number: 3, title: "Review & Import", icon: CheckCircle },
  ]

  const selectedDifficulty = difficultyLevels.find((d) => d.value === config.difficulty)
  const selectedBTLevel = bloomsTaxonomyLevels.find((bt) => bt.value === config.btLevel)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto p-0 [&>button]:hidden">
        <div className="p-8">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 z-10 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <DialogHeader className="text-center pb-8">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Question Generation
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Generate intelligent questions using advanced AI technology
            </p>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-110"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <step.icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-4 hidden sm:block">
                      <p
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          currentStep >= step.number
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        Step {step.number}
                      </p>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          currentStep >= step.number
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-6">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${
                          currentStep > step.number
                            ? "bg-gradient-to-r from-purple-600 to-pink-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[500px]">
            {/* Step 1: Configuration */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Configure AI Generation</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Specify the parameters for AI to generate contextually relevant and educationally sound questions
                  </p>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="domain" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Domain <span className="text-red-500">*</span>
                          </Label>
                          <Select value={config.domain} onValueChange={(value) => updateConfig("domain", value)}>
                            <SelectTrigger className={`h-12 ${formErrors.domain ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select domain" />
                            </SelectTrigger>
                            <SelectContent>
                              {domains.map((domain) => (
                                <SelectItem key={domain} value={domain}>
                                  {domain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.domain && (
                            <p className="text-red-600 text-sm flex items-center">
                              <X className="h-4 w-4 mr-1" />
                              {formErrors.domain}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor="topic" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Topic
                            </Label>
                            <Select
                              value={config.topic}
                              onValueChange={(value) => updateConfig("topic", value)}
                              disabled={!config.domain}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder={config.domain ? "Select topic" : "Select domain first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {config.domain &&
                                  topicsByDomain[config.domain]?.map((topic) => (
                                    <SelectItem key={topic} value={topic}>
                                      {topic}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="subtopic"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Subtopic
                            </Label>
                            <Select
                              value={config.subtopic}
                              onValueChange={(value) => updateConfig("subtopic", value)}
                              disabled={!config.topic}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder={config.topic ? "Select subtopic" : "Select topic first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {config.topic &&
                                  subtopicsByTopic[config.topic]?.map((subtopic) => (
                                    <SelectItem key={subtopic} value={subtopic}>
                                      {subtopic}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="difficulty"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Difficulty Level <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={config.difficulty}
                            onValueChange={(value) => updateConfig("difficulty", value)}
                          >
                            <SelectTrigger className={`h-12 ${formErrors.difficulty ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficultyLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className={`w-3 h-3 rounded-full bg-${level.color}-500`}
                                      style={{
                                        backgroundColor:
                                          level.color === "green"
                                            ? "#10b981"
                                            : level.color === "yellow"
                                              ? "#f59e0b"
                                              : level.color === "orange"
                                                ? "#f97316"
                                                : "#ef4444",
                                      }}
                                    />
                                    <div>
                                      <div className="font-medium">{level.label}</div>
                                      <div className="text-xs text-gray-500">{level.description}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.difficulty && (
                            <p className="text-red-600 text-sm flex items-center">
                              <X className="h-4 w-4 mr-1" />
                              {formErrors.difficulty}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="btLevel" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Bloom's Taxonomy Level <span className="text-red-500">*</span>
                          </Label>
                          <Select value={config.btLevel} onValueChange={(value) => updateConfig("btLevel", value)}>
                            <SelectTrigger className={`h-12 ${formErrors.btLevel ? "border-red-500" : ""}`}>
                              <SelectValue placeholder="Select BT-level" />
                            </SelectTrigger>
                            <SelectContent>
                              {bloomsTaxonomyLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div>
                                    <div className="font-medium">{level.label}</div>
                                    <div className="text-xs text-gray-500">{level.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formErrors.btLevel && (
                            <p className="text-red-600 text-sm flex items-center">
                              <X className="h-4 w-4 mr-1" />
                              {formErrors.btLevel}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="numberOfQuestions"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Number of Questions <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="numberOfQuestions"
                            type="number"
                            min="1"
                            max="50"
                            value={config.numberOfQuestions}
                            onChange={(e) => updateConfig("numberOfQuestions", Number.parseInt(e.target.value) || 1)}
                            className={`h-12 ${formErrors.numberOfQuestions ? "border-red-500" : ""}`}
                          />
                          {formErrors.numberOfQuestions && (
                            <p className="text-red-600 text-sm flex items-center">
                              <X className="h-4 w-4 mr-1" />
                              {formErrors.numberOfQuestions}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Info className="h-4 w-4" />
                            <span>Recommended: 5-15 questions for optimal quality</span>
                          </div>
                        </div>

                        {/* Generation Preview */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Eye className="h-5 w-5 mr-2" />
                            Generation Preview
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Domain:</span>
                              <span className="font-medium">{config.domain || "Not selected"}</span>
                            </div>
                            {config.topic && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Topic:</span>
                                <span className="font-medium">{config.topic}</span>
                              </div>
                            )}
                            {config.subtopic && (
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtopic:</span>
                                <span className="font-medium">{config.subtopic}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                              <span className="font-medium">{selectedDifficulty?.label || "Not selected"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">BT Level:</span>
                              <span className="font-medium">{selectedBTLevel?.label || "Not selected"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                              <span className="font-medium">{config.numberOfQuestions}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-600/25 h-12 px-8"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Questions
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: AI Generation */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                    <Sparkles className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    AI is Generating Questions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Our advanced AI is creating {config.numberOfQuestions} high-quality questions based on your
                    specifications
                  </p>
                </div>

                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center space-y-8">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30">
                          <RefreshCw className="h-16 w-16 text-white animate-spin" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                          <Zap className="h-4 w-4 text-yellow-800" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Processing Your Request</h4>
                        <div className="max-w-md mx-auto space-y-3">
                          <Progress value={generationProgress} className="h-3" />
                          <p className="text-sm text-gray-500">{Math.round(generationProgress)}% complete</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Analyzing Context</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Understanding domain & topic</div>
                        </div>
                        <div className="text-center p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
                          <Target className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Applying Framework</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Using Bloom's Taxonomy</div>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                          <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Creating Content</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Generating questions</div>
                        </div>
                      </div>

                      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 max-w-2xl mx-auto">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                          <strong>AI Magic in Progress:</strong> We're creating questions that align with educational
                          standards and your specific requirements. This usually takes 30-60 seconds.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Review & Import */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    Review Generated Questions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    AI has successfully generated {generatedQuestions.length} questions. Review and select which ones to
                    import.
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {generatedQuestions.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Generated</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {generatedQuestions.reduce((sum, q) => sum + q.points, 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {Math.round(generatedQuestions.reduce((sum, q) => sum + (q.timeLimit || 60), 0) / 60)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Est. Minutes</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                        {selectedQuestions.size}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Selection Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={handleSelectAll} className="bg-transparent">
                      Select All
                    </Button>
                    <Button variant="outline" onClick={handleDeselectAll} className="bg-transparent">
                      Deselect All
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedQuestions.size} of {generatedQuestions.length} questions selected
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generatedQuestions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={`border-2 transition-all duration-200 ${
                        selectedQuestions.has(index)
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(index)}
                            onChange={() => handleQuestionToggle(index)}
                            className="w-5 h-5 text-purple-600 rounded mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                  {question.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{question.content}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge variant="outline" className="capitalize">
                                  {question.type.replace("-", " ")}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`${
                                    question.difficulty === "easy"
                                      ? "text-green-600"
                                      : question.difficulty === "medium"
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {question.difficulty}
                                </Badge>
                                <Badge variant="outline">{question.points} pts</Badge>
                                <Badge variant="outline" className="text-purple-600">
                                  {bloomsTaxonomyLevels.find((bt) => bt.value === question.btLevel)?.label}
                                </Badge>
                              </div>
                            </div>

                            {question.type === "multiple-choice" && question.options && (
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded-lg text-sm ${
                                      question.correctAnswer === optIndex
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    <span className="font-medium">{String.fromCharCode(65 + optIndex)}:</span> {option}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === "true-false" && (
                              <div className="mb-3">
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                >
                                  Correct Answer: {question.correctAnswer}
                                </Badge>
                              </div>
                            )}

                            {question.explanation && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                  <strong>Explanation:</strong> {question.explanation}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{question.timeLimit}s</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Award className="h-3 w-3" />
                                <span>{question.points} points</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
            <div>
              {currentStep > 1 && !isGenerating && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 h-12 px-6"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  resetModal()
                }}
                className="bg-transparent h-12 px-6"
                disabled={isGenerating}
              >
                Cancel
              </Button>

              {currentStep === 3 && (
                <Button
                  onClick={handleImportQuestions}
                  disabled={selectedQuestions.size === 0}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-600/25 h-12 px-8"
                >
                  Import {selectedQuestions.size} Questions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
