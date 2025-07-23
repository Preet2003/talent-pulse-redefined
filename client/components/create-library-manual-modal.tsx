"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  X,
  ArrowRight,
  ArrowLeft,
  Plus,
  BookOpen,
  Lock,
  Globe,
  CheckCircle,
  FileText,
  Target,
  Layers,
  Trash2,
  AlertCircle,
  Info,
  HelpCircle,
  Type,
  List,
  CheckSquare,
  Code,
} from "lucide-react"
import { QuestionCreationOptionsModal } from "./question-creation-options-modal"
import { BulkUploadQuestionsModal } from "./bulk-upload-questions-modal"
import { AIQuestionGenerationModal } from "./ai-question-generation-modal"
import { PDFQuestionGenerationModal } from "./pdf-question-generation-modal"
import { LibraryImportModal } from "./library-import-modal"

interface CreateLibraryManualModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLibraryCreated?: (library: any) => void
}

interface FormData {
  libraryName: string
  domain: string
  topic: string
  subtopic: string
  level: string
  visibility: "public" | "private"
  summary: string
  description: string
}

interface SkillArea {
  id: string
  name: string
  description: string
  questionCount: number
  questions: Question[]
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
}

const questionTypes = [
  { id: "multiple-choice", label: "Multiple Choice", icon: List, description: "Single or multiple correct answers" },
  { id: "true-false", label: "True/False", icon: CheckSquare, description: "Binary choice questions" },
  { id: "short-answer", label: "Short Answer", icon: Type, description: "Brief text responses" },
  { id: "essay", label: "Essay", icon: FileText, description: "Long-form written responses" },
  { id: "coding", label: "Coding", icon: Code, description: "Programming challenges" },
]

export function CreateLibraryManualModal({ open, onOpenChange, onLibraryCreated }: CreateLibraryManualModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    libraryName: "",
    domain: "",
    topic: "",
    subtopic: "",
    level: "",
    visibility: "private",
    summary: "",
    description: "",
  })
  const [skillAreas, setSkillAreas] = useState<SkillArea[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showQuestionOptionsModal, setShowQuestionOptionsModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [showAIGenerationModal, setShowAIGenerationModal] = useState(false)
  const [showPDFGenerationModal, setShowPDFGenerationModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [showLibraryImportModal, setShowLibraryImportModal] = useState(false)
  const [currentSkillArea, setCurrentSkillArea] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1)
      setFormData({
        libraryName: "",
        domain: "",
        topic: "",
        subtopic: "",
        level: "",
        visibility: "private",
        summary: "",
        description: "",
      })
      setSkillAreas([])
      setFormErrors({})
    }
  }, [open])

  const validateStep1 = () => {
    const errors: Record<string, string> = {}

    if (!formData.libraryName.trim()) {
      errors.libraryName = "Library name is required"
    } else if (formData.libraryName.length < 3) {
      errors.libraryName = "Library name must be at least 3 characters"
    }

    if (!formData.domain) {
      errors.domain = "Please select a domain"
    }

    if (!formData.level) {
      errors.level = "Please select a difficulty level"
    }

    if (!formData.summary.trim()) {
      errors.summary = "Summary is required"
    } else if (formData.summary.length < 10) {
      errors.summary = "Summary must be at least 10 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
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

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleCreateLibrary = async () => {
    setIsCreating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newLibrary = {
      id: Date.now().toString(),
      name: formData.libraryName,
      domain: formData.domain,
      topic: formData.topic,
      subtopic: formData.subtopic,
      level: formData.level,
      visibility: formData.visibility,
      summary: formData.summary,
      description: formData.description,
      skillAreas: skillAreas,
      totalQuestions: skillAreas.reduce((sum, area) => sum + area.questionCount, 0),
      createdAt: new Date().toISOString(),
    }

    setIsCreating(false)
    onOpenChange(false)

    // Call the callback to update the parent component
    if (onLibraryCreated) {
      onLibraryCreated(newLibrary)
    }
  }

  const addSkillArea = () => {
    const newSkillArea: SkillArea = {
      id: Date.now().toString(),
      name: `Skill Area ${skillAreas.length + 1}`,
      description: "",
      questionCount: 0,
      questions: [],
    }
    setSkillAreas((prev) => [...prev, newSkillArea])
  }

  const updateSkillArea = (id: string, updates: Partial<SkillArea>) => {
    setSkillAreas((prev) => prev.map((area) => (area.id === id ? { ...area, ...updates } : area)))
  }

  const deleteSkillArea = (id: string) => {
    setSkillAreas((prev) => prev.filter((area) => area.id !== id))
  }

  const openQuestionOptionsModal = (skillAreaId?: string) => {
    setCurrentSkillArea(skillAreaId || null)
    setShowQuestionOptionsModal(true)
  }

  const handleQuestionOptionSelected = (option: string) => {
    setShowQuestionOptionsModal(false)
    if (option === "manual") {
      setShowQuestionModal(true)
    } else if (option === "bulk-upload") {
      setShowBulkUploadModal(true)
    } else if (option === "ai-generate") {
      setShowAIGenerationModal(true)
    } else if (option === "pdf-generate") {
      setShowPDFGenerationModal(true)
    } else if (option === "library-import") {
      setShowLibraryImportModal(true)
    }
    // Handle other options here when implemented
  }

  const handleQuestionsUploaded = (questions: Question[]) => {
    if (currentSkillArea) {
      // Add to specific skill area
      setSkillAreas((prev) =>
        prev.map((area) =>
          area.id === currentSkillArea
            ? {
                ...area,
                questions: [...area.questions, ...questions],
                questionCount: area.questionCount + questions.length,
              }
            : area,
        ),
      )
    } else {
      // Create new skill area for custom questions
      const newSkillArea: SkillArea = {
        id: Date.now().toString(),
        name: "Bulk Uploaded Questions",
        description: "Questions imported via bulk upload",
        questionCount: questions.length,
        questions: questions,
      }
      setSkillAreas((prev) => [...prev, newSkillArea])
    }
  }

  const handleQuestionsGenerated = (questions: Question[]) => {
    if (currentSkillArea) {
      // Add to specific skill area
      setSkillAreas((prev) =>
        prev.map((area) =>
          area.id === currentSkillArea
            ? {
                ...area,
                questions: [...area.questions, ...questions],
                questionCount: area.questionCount + questions.length,
              }
            : area,
        ),
      )
    } else {
      // Create new skill area for AI generated questions
      const newSkillArea: SkillArea = {
        id: Date.now().toString(),
        name: "AI Generated Questions",
        description: "Questions generated using artificial intelligence",
        questionCount: questions.length,
        questions: questions,
      }
      setSkillAreas((prev) => [...prev, newSkillArea])
    }
  }

  const handlePDFQuestionsGenerated = (questions: Question[]) => {
    if (currentSkillArea) {
      // Add to specific skill area
      setSkillAreas((prev) =>
        prev.map((area) =>
          area.id === currentSkillArea
            ? {
                ...area,
                questions: [...area.questions, ...questions],
                questionCount: area.questionCount + questions.length,
              }
            : area,
        ),
      )
    } else {
      // Create new skill area for PDF generated questions
      const newSkillArea: SkillArea = {
        id: Date.now().toString(),
        name: "PDF Generated Questions",
        description: "Questions generated from PDF document analysis",
        questionCount: questions.length,
        questions: questions,
      }
      setSkillAreas((prev) => [...prev, newSkillArea])
    }
  }

  const steps = [
    { number: 1, title: "Basic Details", icon: FileText },
    { number: 2, title: "Add Sections/Questions", icon: Layers },
    { number: 3, title: "Finalization", icon: CheckCircle },
  ]

  const totalQuestions = skillAreas.reduce((sum, area) => sum + area.questionCount, 0)

  return (
    <>
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
              <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Library Manually
              </DialogTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
                Build your question library step by step with complete control
              </p>
            </DialogHeader>

            {/* Enhanced Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          currentStep >= step.number
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110"
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
                              ? "text-blue-600 dark:text-blue-400"
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
                              ? "bg-gradient-to-r from-blue-600 to-blue-500"
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
            <div className="min-h-[600px]">
              {/* Step 1: Enhanced Basic Details */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Basic Details</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Provide essential information about your question library
                    </p>
                  </div>

                  <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardContent className="p-8">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label
                              htmlFor="libraryName"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                            >
                              Library Name <span className="text-red-500 ml-1">*</span>
                              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
                            </Label>
                            <Input
                              id="libraryName"
                              placeholder="e.g., JavaScript Fundamentals, Marketing Strategy Basics"
                              value={formData.libraryName}
                              onChange={(e) => updateFormData("libraryName", e.target.value)}
                              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 h-12 ${
                                formErrors.libraryName ? "border-red-500 focus:ring-red-500" : ""
                              }`}
                            />
                            {formErrors.libraryName && (
                              <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{formErrors.libraryName}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="domain"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                            >
                              Domain <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Select value={formData.domain} onValueChange={(value) => updateFormData("domain", value)}>
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
                              <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{formErrors.domain}</span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label htmlFor="topic" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Topic
                              </Label>
                              <Select
                                value={formData.topic}
                                onValueChange={(value) => updateFormData("topic", value)}
                                disabled={!formData.domain}
                              >
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select topic" />
                                </SelectTrigger>
                                <SelectContent>
                                  {formData.domain &&
                                    topicsByDomain[formData.domain]?.map((topic) => (
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
                                value={formData.subtopic}
                                onValueChange={(value) => updateFormData("subtopic", value)}
                                disabled={!formData.topic}
                              >
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select subtopic" />
                                </SelectTrigger>
                                <SelectContent>
                                  {formData.topic &&
                                    subtopicsByTopic[formData.topic]?.map((subtopic) => (
                                      <SelectItem key={subtopic} value={subtopic}>
                                        {subtopic}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label
                              htmlFor="level"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                            >
                              Difficulty Level <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Select value={formData.level} onValueChange={(value) => updateFormData("level", value)}>
                              <SelectTrigger className={`h-12 ${formErrors.level ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Beginner</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="intermediate">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span>Intermediate</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="expert">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>Expert</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.level && (
                              <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{formErrors.level}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Visibility</Label>
                            <RadioGroup
                              value={formData.visibility}
                              onValueChange={(value: "public" | "private") => updateFormData("visibility", value)}
                              className="grid grid-cols-2 gap-4"
                            >
                              <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 transition-colors">
                                <RadioGroupItem value="public" id="public" />
                                <Label htmlFor="public" className="flex items-center space-x-2 cursor-pointer flex-1">
                                  <Globe className="h-5 w-5 text-green-600" />
                                  <div>
                                    <div className="font-medium">Public</div>
                                    <div className="text-xs text-gray-500">Visible to everyone</div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                <RadioGroupItem value="private" id="private" />
                                <Label htmlFor="private" className="flex items-center space-x-2 cursor-pointer flex-1">
                                  <Lock className="h-5 w-5 text-gray-600" />
                                  <div>
                                    <div className="font-medium">Private</div>
                                    <div className="text-xs text-gray-500">Only you can access</div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="summary"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"
                            >
                              Summary <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Textarea
                              id="summary"
                              placeholder="Brief summary of what this library covers..."
                              value={formData.summary}
                              onChange={(e) => updateFormData("summary", e.target.value)}
                              rows={3}
                              className={`resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                                formErrors.summary ? "border-red-500 focus:ring-red-500" : ""
                              }`}
                            />
                            {formErrors.summary && (
                              <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{formErrors.summary}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-8" />

                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Detailed Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Provide a detailed description of the library content, learning objectives, and target audience..."
                          value={formData.description}
                          onChange={(e) => updateFormData("description", e.target.value)}
                          rows={4}
                          className="resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Info className="h-4 w-4" />
                          <span>This helps users understand what they'll learn from this library</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Enhanced Add Sections/Questions */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Add Skill Areas</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Organize your questions into skill areas for better structure
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button
                      onClick={addSkillArea}
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 h-12 px-6"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create Skill Area
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openQuestionOptionsModal()}
                      className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 bg-transparent h-12 px-6"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Add Custom Question
                    </Button>
                  </div>

                  {skillAreas.length > 0 ? (
                    <div className="grid gap-6">
                      {skillAreas.map((area, index) => (
                        <Card
                          key={area.id}
                          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-left-4 group"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4 flex-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                  <Target className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={area.name}
                                    onChange={(e) => updateSkillArea(area.id, { name: e.target.value })}
                                    className="font-semibold text-lg border-0 p-0 h-auto focus:ring-0 bg-transparent"
                                    placeholder="Skill Area Name"
                                  />
                                  <Textarea
                                    value={area.description}
                                    onChange={(e) => updateSkillArea(area.id, { description: e.target.value })}
                                    placeholder="Brief description of this skill area..."
                                    className="mt-2 text-sm border-0 p-0 resize-none focus:ring-0 bg-transparent"
                                    rows={2}
                                  />
                                  <div className="flex items-center space-x-4 mt-3">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                                    >
                                      {area.questionCount} questions
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                                    >
                                      {area.questions.reduce((sum, q) => sum + q.points, 0)} points
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openQuestionOptionsModal(area.id)}
                                  className="bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Question
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteSkillArea(area.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {area.questions.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="grid gap-2">
                                  {area.questions.slice(0, 3).map((question, qIndex) => (
                                    <div
                                      key={question.id}
                                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                      <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                                        {(() => {
                                          const QuestionIcon = questionTypes.find((t) => t.id === question.type)?.icon
                                          return QuestionIcon ? (
                                            <QuestionIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                          ) : null
                                        })()}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {question.title}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <Badge variant="outline" className="text-xs">
                                            {question.type.replace("-", " ")}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {question.points} pts
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                              question.difficulty === "easy"
                                                ? "text-green-600"
                                                : question.difficulty === "medium"
                                                  ? "text-yellow-600"
                                                  : "text-red-600"
                                            }`}
                                          >
                                            {question.difficulty}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {area.questions.length > 3 && (
                                    <div className="text-center py-2">
                                      <span className="text-sm text-gray-500">
                                        +{area.questions.length - 3} more questions
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="p-16 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <Layers className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No skill areas yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                          Create skill areas to organize your questions by topic or difficulty level. This helps
                          candidates understand the structure of your assessment.
                        </p>
                        <Button
                          onClick={addSkillArea}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 h-12 px-8"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Create Your First Skill Area
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 3: Enhanced Finalization */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Finalize Library</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Review your library details before creating
                    </p>
                  </div>

                  <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center space-x-3 text-xl">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        <span>Library Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Library Name</Label>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                              {formData.libraryName || "Untitled Library"}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Category Path
                            </Label>
                            <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-3 py-1"
                              >
                                {formData.domain || "No domain"}
                              </Badge>
                              {formData.topic && (
                                <>
                                  <ArrowRight className="h-4 w-4 text-gray-400" />
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 px-3 py-1"
                                  >
                                    {formData.topic}
                                  </Badge>
                                </>
                              )}
                              {formData.subtopic && (
                                <>
                                  <ArrowRight className="h-4 w-4 text-gray-400" />
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-1"
                                  >
                                    {formData.subtopic}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Difficulty Level
                              </Label>
                              <Badge
                                variant="outline"
                                className={`mt-2 capitalize px-3 py-1 ${
                                  formData.level === "beginner"
                                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                                    : formData.level === "intermediate"
                                      ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400"
                                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                                }`}
                              >
                                {formData.level || "Not specified"}
                              </Badge>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Visibility</Label>
                              <div className="mt-2">
                                {formData.visibility === "public" ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-1"
                                  >
                                    <Globe className="mr-2 h-4 w-4" />
                                    Public
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 px-3 py-1"
                                  >
                                    <Lock className="mr-2 h-4 w-4" />
                                    Private
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Content Overview
                            </Label>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {skillAreas.length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Skill Areas</div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                  {totalQuestions}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
                              </div>
                            </div>
                          </div>

                          {skillAreas.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Skill Areas
                              </Label>
                              <div className="space-y-3 mt-4">
                                {skillAreas.map((area) => (
                                  <div
                                    key={area.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Target className="h-5 w-5 text-blue-600" />
                                      <span className="font-medium text-gray-900 dark:text-white">{area.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {area.questionCount} questions
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {formData.summary && (
                        <>
                          <Separator />
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Summary</Label>
                            <p className="text-gray-900 dark:text-white mt-2 leading-relaxed">{formData.summary}</p>
                          </div>
                        </>
                      )}

                      {formData.description && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                          <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</Label>
                          <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                            {formData.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 h-12 px-6"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                )}
              </div>

              <div>
                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 h-12 px-8"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateLibrary}
                    disabled={isCreating}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-green-600/30 disabled:opacity-50 h-12 px-8"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Creating Library...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Create Library
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Creation Options Modal */}
      <QuestionCreationOptionsModal
        open={showQuestionOptionsModal}
        onOpenChange={setShowQuestionOptionsModal}
        onOptionSelected={handleQuestionOptionSelected}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadQuestionsModal
        open={showBulkUploadModal}
        onOpenChange={setShowBulkUploadModal}
        onQuestionsUploaded={handleQuestionsUploaded}
        skillAreaId={currentSkillArea}
      />

      {/* AI Generation Modal */}
      <AIQuestionGenerationModal
        open={showAIGenerationModal}
        onOpenChange={setShowAIGenerationModal}
        onQuestionsGenerated={handleQuestionsGenerated}
        skillAreaId={currentSkillArea}
      />

      {/* PDF Generation Modal */}
      <PDFQuestionGenerationModal
        open={showPDFGenerationModal}
        onOpenChange={setShowPDFGenerationModal}
        onQuestionsGenerated={handlePDFQuestionsGenerated}
        skillAreaId={currentSkillArea}
      />

      {/* Question Creation Modal */}
      <QuestionCreationModal
        open={showQuestionModal}
        onOpenChange={setShowQuestionModal}
        skillAreaId={currentSkillArea}
        onQuestionCreated={(question, skillAreaId) => {
          if (skillAreaId) {
            // Add to specific skill area
            setSkillAreas((prev) =>
              prev.map((area) =>
                area.id === skillAreaId
                  ? {
                      ...area,
                      questions: [...area.questions, question],
                      questionCount: area.questionCount + 1,
                    }
                  : area,
              ),
            )
          } else {
            // Create new skill area for custom question
            const newSkillArea: SkillArea = {
              id: Date.now().toString(),
              name: "Custom Questions",
              description: "Standalone questions not part of any specific skill area",
              questionCount: 1,
              questions: [question],
            }
            setSkillAreas((prev) => [...prev, newSkillArea])
          }
        }}
      />

      {/* Library Import Modal */}
      <LibraryImportModal
        open={showLibraryImportModal}
        onOpenChange={setShowLibraryImportModal}
        onQuestionsImported={handleQuestionsUploaded}
        skillAreaId={currentSkillArea}
      />
    </>
  )
}

// Question Creation Modal Component
function QuestionCreationModal({
  open,
  onOpenChange,
  skillAreaId,
  onQuestionCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  skillAreaId: string | null
  onQuestionCreated: (question: Question, skillAreaId?: string) => void
}) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [questionData, setQuestionData] = useState({
    title: "",
    content: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
    difficulty: "medium" as "easy" | "medium" | "hard",
    timeLimit: 60,
    explanation: "",
  })

  const resetForm = () => {
    setSelectedType("")
    setQuestionData({
      title: "",
      content: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
      difficulty: "medium",
      timeLimit: 60,
      explanation: "",
    })
  }

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const handleCreateQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: selectedType as Question["type"],
      title: questionData.title,
      content: questionData.content,
      options: selectedType === "multiple-choice" ? questionData.options.filter((opt) => opt.trim()) : undefined,
      correctAnswer: questionData.correctAnswer,
      points: questionData.points,
      difficulty: questionData.difficulty,
      timeLimit: questionData.timeLimit,
      explanation: questionData.explanation,
    }

    onQuestionCreated(newQuestion, skillAreaId || undefined)
    onOpenChange(false)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionData.options]
    newOptions[index] = value
    setQuestionData((prev) => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    setQuestionData((prev) => ({ ...prev, options: [...prev.options, ""] }))
  }

  const removeOption = (index: number) => {
    const newOptions = questionData.options.filter((_, i) => i !== index)
    setQuestionData((prev) => ({ ...prev, options: newOptions }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden">
        <div className="p-8">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 z-10 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create New Question</DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {skillAreaId ? "Add a question to this skill area" : "Create a standalone question"}
            </p>
          </DialogHeader>

          {!selectedType ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Choose Question Type</h3>
                <p className="text-gray-600 dark:text-gray-400">Select the type of question you want to create</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {questionTypes.map((type) => (
                  <Card
                    key={type.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 group"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <type.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{type.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {questionTypes.find((t) => t.id === selectedType)?.icon && (
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      {(() => {
                        const SelectedIcon = questionTypes.find((t) => t.id === selectedType)?.icon
                        return SelectedIcon ? (
                          <SelectedIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : null
                      })()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {questionTypes.find((t) => t.id === selectedType)?.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {questionTypes.find((t) => t.id === selectedType)?.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedType("")} className="bg-transparent">
                  Change Type
                </Button>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium">
                          Question Title
                        </Label>
                        <Input
                          id="title"
                          placeholder="Enter question title"
                          value={questionData.title}
                          onChange={(e) => setQuestionData((prev) => ({ ...prev, title: e.target.value }))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="content" className="text-sm font-medium">
                          Question Content
                        </Label>
                        <Textarea
                          id="content"
                          placeholder="Enter the question content..."
                          value={questionData.content}
                          onChange={(e) => setQuestionData((prev) => ({ ...prev, content: e.target.value }))}
                          rows={4}
                          className="mt-1 resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="points" className="text-sm font-medium">
                            Points
                          </Label>
                          <Input
                            id="points"
                            type="number"
                            min="1"
                            value={questionData.points}
                            onChange={(e) =>
                              setQuestionData((prev) => ({ ...prev, points: Number.parseInt(e.target.value) || 1 }))
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="difficulty" className="text-sm font-medium">
                            Difficulty
                          </Label>
                          <Select
                            value={questionData.difficulty}
                            onValueChange={(value: "easy" | "medium" | "hard") =>
                              setQuestionData((prev) => ({ ...prev, difficulty: value }))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="timeLimit" className="text-sm font-medium">
                            Time (sec)
                          </Label>
                          <Input
                            id="timeLimit"
                            type="number"
                            min="30"
                            value={questionData.timeLimit}
                            onChange={(e) =>
                              setQuestionData((prev) => ({ ...prev, timeLimit: Number.parseInt(e.target.value) || 60 }))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="explanation" className="text-sm font-medium">
                          Explanation (Optional)
                        </Label>
                        <Textarea
                          id="explanation"
                          placeholder="Explain the correct answer..."
                          value={questionData.explanation}
                          onChange={(e) => setQuestionData((prev) => ({ ...prev, explanation: e.target.value }))}
                          rows={3}
                          className="mt-1 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {selectedType === "multiple-choice" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Answer Options</Label>
                        <Button variant="outline" size="sm" onClick={addOption} className="bg-transparent">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Option
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {questionData.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <Input
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="flex-1"
                            />
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm">Correct</Label>
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={questionData.correctAnswer === index.toString()}
                                onChange={() =>
                                  setQuestionData((prev) => ({ ...prev, correctAnswer: index.toString() }))
                                }
                                className="w-4 h-4 text-blue-600"
                              />
                            </div>
                            {questionData.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedType === "true-false" && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Correct Answer</Label>
                      <RadioGroup
                        value={questionData.correctAnswer}
                        onValueChange={(value) => setQuestionData((prev) => ({ ...prev, correctAnswer: value }))}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true">True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false">False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {(selectedType === "short-answer" || selectedType === "essay") && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sampleAnswer" className="text-sm font-medium">
                          Sample Answer (Optional)
                        </Label>
                        <Textarea
                          id="sampleAnswer"
                          placeholder="Provide a sample answer or key points..."
                          value={questionData.correctAnswer}
                          onChange={(e) => setQuestionData((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                          rows={3}
                          className="mt-1 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {selectedType === "coding" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="codeTemplate" className="text-sm font-medium">
                          Code Template (Optional)
                        </Label>
                        <Textarea
                          id="codeTemplate"
                          placeholder="function solution() {&#10;  // Your code here&#10;}"
                          value={questionData.correctAnswer}
                          onChange={(e) => setQuestionData((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                          rows={6}
                          className="mt-1 resize-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateQuestion}
                  disabled={!questionData.title || !questionData.content}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Question
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
