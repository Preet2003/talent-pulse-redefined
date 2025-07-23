"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  FileText,
  Upload,
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
  AlertCircle,
  File,
  Trash2,
  Brain,
  Target,
} from "lucide-react"

interface PDFQuestionGenerationModalProps {
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
  source?: string
}

interface GenerationConfig {
  domain: string
  topic: string
  subtopic: string
  difficulty: string
  btLevel: string
  numberOfQuestions: number
  pdfFile: File | null
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

export function PDFQuestionGenerationModal({
  open,
  onOpenChange,
  onQuestionsGenerated,
  skillAreaId,
}: PDFQuestionGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set())
  const [pdfProcessing, setPdfProcessing] = useState(false)
  const [pdfAnalysis, setPdfAnalysis] = useState<{
    pageCount: number
    wordCount: number
    topics: string[]
    extractedText: string
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [config, setConfig] = useState<GenerationConfig>({
    domain: "",
    topic: "",
    subtopic: "",
    difficulty: "",
    btLevel: "",
    numberOfQuestions: 5,
    pdfFile: null,
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
      pdfFile: null,
    })
    setGeneratedQuestions([])
    setSelectedQuestions(new Set())
    setFormErrors({})
    setIsGenerating(false)
    setGenerationProgress(0)
    setPdfProcessing(false)
    setPdfAnalysis(null)
  }

  const updateConfig = (field: keyof GenerationConfig, value: string | number | File | null) => {
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
    if (formErrors[field as string]) {
      setFormErrors((prev) => ({ ...prev, [field as string]: "" }))
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
    if (!config.pdfFile) errors.pdfFile = "Please upload a PDF file"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      updateConfig("pdfFile", file)
      setPdfProcessing(true)

      // Simulate PDF processing
      setTimeout(() => {
        setPdfAnalysis({
          pageCount: Math.floor(Math.random() * 50) + 10,
          wordCount: Math.floor(Math.random() * 10000) + 5000,
          topics: ["Introduction", "Core Concepts", "Advanced Topics", "Case Studies", "Conclusion"],
          extractedText: "Sample extracted text from PDF...",
        })
        setPdfProcessing(false)
      }, 2000)
    } else {
      setFormErrors((prev) => ({ ...prev, pdfFile: "Please select a valid PDF file" }))
    }
  }

  const removePdfFile = () => {
    updateConfig("pdfFile", null)
    setPdfAnalysis(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleGenerate = async () => {
    if (!validateStep1()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setCurrentStep(2)

    // Simulate PDF analysis and question generation
    const steps = [
      "Analyzing PDF content...",
      "Extracting key concepts...",
      "Identifying relevant sections...",
      "Applying educational framework...",
      "Generating questions...",
      "Finalizing content...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    // Generate mock questions based on PDF
    const mockQuestions = generateMockQuestionsFromPDF(config)
    setGeneratedQuestions(mockQuestions)
    setSelectedQuestions(new Set(mockQuestions.map((_, index) => index)))
    setIsGenerating(false)
    setCurrentStep(3)
  }

  const generateMockQuestionsFromPDF = (config: GenerationConfig): Question[] => {
    const questions: Question[] = []
    const questionTypes: Question["type"][] = ["multiple-choice", "true-false", "short-answer", "essay"]

    for (let i = 0; i < config.numberOfQuestions; i++) {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      const btLevelLabel = bloomsTaxonomyLevels.find((level) => level.value === config.btLevel)?.label || "Apply"

      const question: Question = {
        id: `pdf-${Date.now()}-${i}`,
        type,
        title: `PDF-Based Question ${i + 1}: ${btLevelLabel} Level`,
        content: `This question is generated from the uploaded PDF document about ${config.topic || config.domain}. It tests ${btLevelLabel.toLowerCase()} skills at ${config.difficulty} level.`,
        points: config.difficulty === "beginner" ? 1 : config.difficulty === "intermediate" ? 2 : 3,
        difficulty: config.difficulty as Question["difficulty"],
        timeLimit: type === "essay" ? 300 : type === "short-answer" ? 120 : 60,
        btLevel: config.btLevel,
        explanation: `This question is derived from the PDF content and assesses ${btLevelLabel.toLowerCase()} skills in ${config.topic || config.domain}.`,
        source: `Page ${Math.floor(Math.random() * (pdfAnalysis?.pageCount || 10)) + 1} of ${config.pdfFile?.name}`,
      }

      if (type === "multiple-choice") {
        question.options = [
          `Correct answer based on PDF content`,
          `Incorrect option A`,
          `Incorrect option B`,
          `Incorrect option C`,
        ]
        question.correctAnswer = 0
      } else if (type === "true-false") {
        question.correctAnswer = Math.random() > 0.5 ? "true" : "false"
      } else {
        question.correctAnswer = `Sample answer derived from PDF content about ${config.topic || config.domain}`
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
    { number: 1, title: "Configuration & Upload", icon: Upload },
    { number: 2, title: "PDF Analysis", icon: Brain },
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
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              PDF Question Generation
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Generate intelligent questions from your PDF documents
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
                          ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/30 scale-110"
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
                            ? "text-orange-600 dark:text-orange-400"
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
                            ? "bg-gradient-to-r from-orange-600 to-red-600"
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
            {/* Step 1: Configuration & Upload */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    Configure PDF Generation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Upload your PDF document and specify parameters for intelligent question generation
                  </p>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Left Column - Configuration */}
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
                              <AlertCircle className="h-4 w-4 mr-1" />
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
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.difficulty}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor="btLevel" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              BT-Level <span className="text-red-500">*</span>
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
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formErrors.btLevel}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="numberOfQuestions"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Questions <span className="text-red-500">*</span>
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
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formErrors.numberOfQuestions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - PDF Upload */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            PDF Document <span className="text-red-500">*</span>
                          </Label>

                          {!config.pdfFile ? (
                            <Card
                              className={`border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-600 ${
                                formErrors.pdfFile
                                  ? "border-red-300 dark:border-red-600"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                  <Upload className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                  Upload PDF Document
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                  Click to browse or drag and drop your PDF file
                                </p>
                                <div className="text-xs text-gray-500">Supported: PDF files up to 50MB</div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
                              <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                    <File className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                      {config.pdfFile.name}
                                    </h4>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {(config.pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                                      </span>
                                      {pdfProcessing && (
                                        <div className="flex items-center space-x-2">
                                          <RefreshCw className="h-4 w-4 text-orange-600 animate-spin" />
                                          <span className="text-sm text-orange-600">Processing...</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removePdfFile}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {pdfAnalysis && (
                                  <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                                        <span className="font-medium">{pdfAnalysis.pageCount}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Words:</span>
                                        <span className="font-medium">{pdfAnalysis.wordCount.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="mt-3">
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Detected Topics:</span>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {pdfAnalysis.topics.map((topic, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs"
                                          >
                                            {topic}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />

                          {formErrors.pdfFile && (
                            <p className="text-red-600 text-sm flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.pdfFile}
                            </p>
                          )}
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
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">PDF:</span>
                              <span className="font-medium">{config.pdfFile ? "Uploaded" : "Not uploaded"}</span>
                            </div>
                          </div>
                        </div>

                        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/30">
                          <Info className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-orange-800 dark:text-orange-200">
                            <strong>AI Processing:</strong> Our AI will analyze your PDF content and generate questions
                            that align with the document's key concepts and your specified parameters.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={handleGenerate}
                    disabled={pdfProcessing}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-600/25 h-12 px-8"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Generate from PDF
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: PDF Analysis */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                    <Brain className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Analyzing PDF Content</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    AI is processing your PDF document and generating {config.numberOfQuestions} contextual questions
                  </p>
                </div>

                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center space-y-8">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/30">
                          <RefreshCw className="h-16 w-16 text-white animate-spin" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                          <Zap className="h-4 w-4 text-yellow-800" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Processing PDF Document</h4>
                        <div className="max-w-md mx-auto space-y-3">
                          <Progress value={generationProgress} className="h-3" />
                          <p className="text-sm text-gray-500">{Math.round(generationProgress)}% complete</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                          <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Content Analysis</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Extracting key concepts</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                          <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Context Mapping</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Applying framework</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                          <BookOpen className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Question Creation</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Generating content</div>
                        </div>
                      </div>

                      {config.pdfFile && pdfAnalysis && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl max-w-2xl mx-auto">
                          <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Document Overview</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">{pdfAnalysis.pageCount}</div>
                              <div className="text-gray-600 dark:text-gray-400">Pages</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">
                                {pdfAnalysis.wordCount.toLocaleString()}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">Words</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/30 max-w-2xl mx-auto">
                        <Info className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800 dark:text-orange-200">
                          <strong>Deep Analysis in Progress:</strong> AI is reading through your PDF, identifying key
                          concepts, and creating questions that test understanding of the material. This process
                          typically takes 1-3 minutes.
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
                    Review PDF-Generated Questions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    AI has successfully generated {generatedQuestions.length} questions from your PDF. Review and select
                    which ones to import.
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
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
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
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
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(index)}
                            onChange={() => handleQuestionToggle(index)}
                            className="w-5 h-5 text-orange-600 rounded mt-1"
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
                                <Badge variant="outline" className="text-orange-600">
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

                            {question.source && (
                              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                                <p className="text-sm text-orange-800 dark:text-orange-200">
                                  <strong>Source:</strong> {question.source}
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
                              <div className="flex items-center space-x-1">
                                <FileText className="h-3 w-3" />
                                <span>PDF-generated</span>
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
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-600/25 h-12 px-8"
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
