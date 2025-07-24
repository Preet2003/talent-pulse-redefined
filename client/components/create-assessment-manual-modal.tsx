"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  X,
  Plus,
  FileText,
  Users,
  Eye,
  EyeOff,
  Target,
  BookOpen,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
} from "lucide-react"
import { QuestionCreationOptionsModal } from "./question-creation-options-modal"
import { AIQuestionGenerationModal } from "./ai-question-generation-modal"
import { BulkUploadQuestionsModal } from "./bulk-upload-questions-modal"
import { LibraryImportModal } from "./library-import-modal"
import { PDFQuestionGenerationModal } from "./pdf-question-generation-modal"

interface CreateAssessmentManualModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

interface Section {
  id: string
  name: string
  description: string
  questions: Question[]
  timeLimit?: number
  instructions?: string
}

interface AssessmentData {
  title: string
  description: string
  instructions: string
  duration: number
  passingScore: number
  maxAttempts: number
  shuffleQuestions: boolean
  showResults: boolean
  allowReview: boolean
  proctoring: boolean
  sections: Section[]
  visibility: "public" | "private" | "restricted"
  tags: string[]
  category: string
}

const categories = [
  "Technical Skills",
  "Soft Skills",
  "Domain Knowledge",
  "Certification",
  "Screening",
  "Performance Review",
  "Training Assessment",
  "Custom",
]

export function CreateAssessmentManualModal({ open, onOpenChange }: CreateAssessmentManualModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    title: "",
    description: "",
    instructions: "",
    duration: 60,
    passingScore: 70,
    maxAttempts: 3,
    shuffleQuestions: false,
    showResults: true,
    allowReview: true,
    proctoring: false,
    sections: [],
    visibility: "private",
    tags: [],
    category: "",
  })

  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
  const [showQuestionOptions, setShowQuestionOptions] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showLibraryImport, setShowLibraryImport] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    setCurrentStep(1)
    setAssessmentData({
      title: "",
      description: "",
      instructions: "",
      duration: 60,
      passingScore: 70,
      maxAttempts: 3,
      shuffleQuestions: false,
      showResults: true,
      allowReview: true,
      proctoring: false,
      sections: [],
      visibility: "private",
      tags: [],
      category: "",
    })
    setCurrentSectionId(null)
    setFormErrors({})
    setNewTag("")
  }

  const validateStep1 = () => {
    const errors: Record<string, string> = {}

    if (!assessmentData.title.trim()) errors.title = "Assessment title is required"
    if (!assessmentData.description.trim()) errors.description = "Description is required"
    if (!assessmentData.category) errors.category = "Category is required"
    if (assessmentData.duration < 5) errors.duration = "Duration must be at least 5 minutes"
    if (assessmentData.passingScore < 0 || assessmentData.passingScore > 100) {
      errors.passingScore = "Passing score must be between 0 and 100"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    const errors: Record<string, string> = {}

    if (assessmentData.sections.length === 0) {
      errors.sections = "At least one section is required"
    } else {
      const hasQuestionsInAnySection = assessmentData.sections.some((section) => section.questions.length > 0)
      if (!hasQuestionsInAnySection) {
        errors.questions = "At least one question is required"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateAssessmentData = (field: keyof AssessmentData, value: any) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: `Section ${assessmentData.sections.length + 1}`,
      description: "",
      questions: [],
      instructions: "",
    }
    setAssessmentData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
    setCurrentSectionId(newSection.id)
  }

  const updateSection = (sectionId: string, field: keyof Section, value: any) => {
    setAssessmentData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, [field]: value } : section)),
    }))
  }

  const deleteSection = (sectionId: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
    if (currentSectionId === sectionId) {
      setCurrentSectionId(null)
    }
  }

  const handleQuestionOptionSelected = (option: string) => {
    setShowQuestionOptions(false)

    switch (option) {
      case "ai-generate":
        setShowAIModal(true)
        break
      case "bulk-upload":
        setShowBulkUpload(true)
        break
      case "library-import":
        setShowLibraryImport(true)
        break
      case "pdf-generate":
        setShowPDFModal(true)
        break
      case "manual":
        // Handle manual creation
        break
    }
  }

  const handleQuestionsGenerated = (questions: Question[]) => {
    if (currentSectionId) {
      setAssessmentData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === currentSectionId ? { ...section, questions: [...section.questions, ...questions] } : section,
        ),
      }))
    }
  }

  const removeQuestion = (sectionId: string, questionId: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, questions: section.questions.filter((q) => q.id !== questionId) }
          : section,
      ),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !assessmentData.tags.includes(newTag.trim())) {
      updateAssessmentData("tags", [...assessmentData.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateAssessmentData(
      "tags",
      assessmentData.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleSaveAssessment = () => {
    // Here you would typically save to your backend
    console.log("Saving assessment:", assessmentData)
    onOpenChange(false)
    resetForm()
  }

  const getTotalQuestions = () => {
    return assessmentData.sections.reduce((total, section) => total + section.questions.length, 0)
  }

  const getTotalPoints = () => {
    return assessmentData.sections.reduce(
      (total, section) =>
        total + section.questions.reduce((sectionTotal, question) => sectionTotal + question.points, 0),
      0,
    )
  }

  const steps = [
    { number: 1, title: "Basic Details", icon: FileText },
    { number: 2, title: "Questions & Sections", icon: BookOpen },
    { number: 3, title: "Review & Publish", icon: CheckCircle },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-7xl max-h-[95vh] overflow-y-auto p-0 [&>button]:hidden">
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
                Create Assessment Manually
              </DialogTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
                Build your assessment step by step with complete control
              </p>
            </DialogHeader>

            {/* Progress Steps */}
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
                            currentStep > step.number ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
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
              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <FileText className="h-6 w-6 mr-3 text-blue-600" />
                        Assessment Information
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Assessment Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="title"
                              value={assessmentData.title}
                              onChange={(e) => updateAssessmentData("title", e.target.value)}
                              placeholder="Enter assessment title"
                              className={`h-12 ${formErrors.title ? "border-red-500" : ""}`}
                            />
                            {formErrors.title && (
                              <p className="text-red-600 text-sm flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formErrors.title}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="description"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="description"
                              value={assessmentData.description}
                              onChange={(e) => updateAssessmentData("description", e.target.value)}
                              placeholder="Describe what this assessment evaluates"
                              rows={4}
                              className={formErrors.description ? "border-red-500" : ""}
                            />
                            {formErrors.description && (
                              <p className="text-red-600 text-sm flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formErrors.description}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="category"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={assessmentData.category}
                              onValueChange={(value) => updateAssessmentData("category", value)}
                            >
                              <SelectTrigger className={`h-12 ${formErrors.category ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.category && (
                              <p className="text-red-600 text-sm flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {formErrors.category}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</Label>
                            <div className="flex space-x-2">
                              <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add a tag"
                                onKeyPress={(e) => e.key === "Enter" && addTag()}
                                className="h-10"
                              />
                              <Button onClick={addTag} variant="outline" className="h-10 px-4 bg-transparent">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {assessmentData.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {assessmentData.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="px-3 py-1">
                                    {tag}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                                      onClick={() => removeTag(tag)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label
                                htmlFor="duration"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Duration (minutes) <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="duration"
                                type="number"
                                min="5"
                                value={assessmentData.duration}
                                onChange={(e) => updateAssessmentData("duration", Number(e.target.value))}
                                className={`h-12 ${formErrors.duration ? "border-red-500" : ""}`}
                              />
                              {formErrors.duration && (
                                <p className="text-red-600 text-sm flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {formErrors.duration}
                                </p>
                              )}
                            </div>

                            <div className="space-y-3">
                              <Label
                                htmlFor="passingScore"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Passing Score (%) <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="passingScore"
                                type="number"
                                min="0"
                                max="100"
                                value={assessmentData.passingScore}
                                onChange={(e) => updateAssessmentData("passingScore", Number(e.target.value))}
                                className={`h-12 ${formErrors.passingScore ? "border-red-500" : ""}`}
                              />
                              {formErrors.passingScore && (
                                <p className="text-red-600 text-sm flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  {formErrors.passingScore}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="maxAttempts"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Maximum Attempts
                            </Label>
                            <Select
                              value={assessmentData.maxAttempts.toString()}
                              onValueChange={(value) => updateAssessmentData("maxAttempts", Number(value))}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 attempt</SelectItem>
                                <SelectItem value="2">2 attempts</SelectItem>
                                <SelectItem value="3">3 attempts</SelectItem>
                                <SelectItem value="5">5 attempts</SelectItem>
                                <SelectItem value="-1">Unlimited</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="visibility"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Visibility
                            </Label>
                            <Select
                              value={assessmentData.visibility}
                              onValueChange={(value: any) => updateAssessmentData("visibility", value)}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="private">
                                  <div className="flex items-center space-x-2">
                                    <EyeOff className="h-4 w-4" />
                                    <span>Private</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="public">
                                  <div className="flex items-center space-x-2">
                                    <Eye className="h-4 w-4" />
                                    <span>Public</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="restricted">
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4" />
                                    <span>Restricted</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Assessment Settings
                            </Label>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label htmlFor="shuffleQuestions" className="text-sm font-medium">
                                    Shuffle Questions
                                  </Label>
                                  <p className="text-xs text-gray-500">Randomize question order for each candidate</p>
                                </div>
                                <Switch
                                  id="shuffleQuestions"
                                  checked={assessmentData.shuffleQuestions}
                                  onCheckedChange={(checked) => updateAssessmentData("shuffleQuestions", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label htmlFor="showResults" className="text-sm font-medium">
                                    Show Results
                                  </Label>
                                  <p className="text-xs text-gray-500">Display results immediately after completion</p>
                                </div>
                                <Switch
                                  id="showResults"
                                  checked={assessmentData.showResults}
                                  onCheckedChange={(checked) => updateAssessmentData("showResults", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label htmlFor="allowReview" className="text-sm font-medium">
                                    Allow Review
                                  </Label>
                                  <p className="text-xs text-gray-500">Let candidates review their answers</p>
                                </div>
                                <Switch
                                  id="allowReview"
                                  checked={assessmentData.allowReview}
                                  onCheckedChange={(checked) => updateAssessmentData("allowReview", checked)}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label htmlFor="proctoring" className="text-sm font-medium">
                                    Enable Proctoring
                                  </Label>
                                  <p className="text-xs text-gray-500">Monitor candidates during assessment</p>
                                </div>
                                <Switch
                                  id="proctoring"
                                  checked={assessmentData.proctoring}
                                  onCheckedChange={(checked) => updateAssessmentData("proctoring", checked)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="instructions"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Instructions for Candidates
                        </Label>
                        <Textarea
                          id="instructions"
                          value={assessmentData.instructions}
                          onChange={(e) => updateAssessmentData("instructions", e.target.value)}
                          placeholder="Provide detailed instructions for candidates taking this assessment"
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Questions & Sections */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                      Questions & Sections
                    </h3>
                    <Button onClick={addSection} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>

                  {formErrors.sections && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {formErrors.sections}
                      </p>
                    </div>
                  )}

                  {formErrors.questions && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {formErrors.questions}
                      </p>
                    </div>
                  )}

                  {assessmentData.sections.length === 0 ? (
                    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No sections yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                          Create sections to organize your questions. Each section can have its own instructions and
                          time limits.
                        </p>
                        <Button onClick={addSection} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Section
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {assessmentData.sections.map((section, index) => (
                        <Card key={section.id} className="border-0 shadow-lg">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <Input
                                    value={section.name}
                                    onChange={(e) => updateSection(section.id, "name", e.target.value)}
                                    className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                                    placeholder="Section name"
                                  />
                                  <Input
                                    value={section.description}
                                    onChange={(e) => updateSection(section.id, "description", e.target.value)}
                                    className="text-sm text-gray-600 dark:text-gray-400 border-none p-0 h-auto bg-transparent focus-visible:ring-0 mt-1"
                                    placeholder="Section description"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {section.questions.length} questions
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteSection(section.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              <Textarea
                                value={section.instructions || ""}
                                onChange={(e) => updateSection(section.id, "instructions", e.target.value)}
                                placeholder="Instructions for this section (optional)"
                                rows={2}
                                className="text-sm"
                              />

                              {section.questions.length === 0 ? (
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    No questions in this section yet
                                  </p>
                                  <Button
                                    onClick={() => {
                                      setCurrentSectionId(section.id)
                                      setShowQuestionOptions(true)
                                    }}
                                    variant="outline"
                                    className="bg-transparent"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Questions
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Questions</h4>
                                    <Button
                                      onClick={() => {
                                        setCurrentSectionId(section.id)
                                        setShowQuestionOptions(true)
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="bg-transparent"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add More
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {section.questions.map((question, qIndex) => (
                                      <div
                                        key={question.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {qIndex + 1}.
                                          </span>
                                          <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                              {question.title}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                              <Badge variant="outline" className="text-xs capitalize">
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
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeQuestion(section.id, question.id)}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review & Publish */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      Review Your Assessment
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                      Review all details before publishing your assessment
                    </p>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {assessmentData.sections.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Sections</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {getTotalQuestions()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                          {getTotalPoints()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {assessmentData.duration}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Assessment Details */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Assessment Details</h3>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Title</Label>
                            <p className="text-gray-900 dark:text-white mt-1">{assessmentData.title}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Description
                            </Label>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{assessmentData.description}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</Label>
                            <p className="text-gray-900 dark:text-white mt-1">{assessmentData.category}</p>
                          </div>
                          {assessmentData.tags.length > 0 && (
                            <div>
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {assessmentData.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</Label>
                              <p className="text-gray-900 dark:text-white mt-1">{assessmentData.duration} minutes</p>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Passing Score
                              </Label>
                              <p className="text-gray-900 dark:text-white mt-1">{assessmentData.passingScore}%</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Max Attempts
                              </Label>
                              <p className="text-gray-900 dark:text-white mt-1">
                                {assessmentData.maxAttempts === -1 ? "Unlimited" : assessmentData.maxAttempts}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Visibility
                              </Label>
                              <p className="text-gray-900 dark:text-white mt-1 capitalize">
                                {assessmentData.visibility}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Settings</Label>
                            <div className="mt-2 space-y-1">
                              {assessmentData.shuffleQuestions && (
                                <Badge variant="outline" className="mr-2">
                                  Shuffle Questions
                                </Badge>
                              )}
                              {assessmentData.showResults && (
                                <Badge variant="outline" className="mr-2">
                                  Show Results
                                </Badge>
                              )}
                              {assessmentData.allowReview && (
                                <Badge variant="outline" className="mr-2">
                                  Allow Review
                                </Badge>
                              )}
                              {assessmentData.proctoring && (
                                <Badge variant="outline" className="mr-2">
                                  Proctoring Enabled
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sections Preview */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sections Overview</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assessmentData.sections.map((section, index) => (
                          <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {index + 1}. {section.name}
                              </h4>
                              <Badge variant="outline">{section.questions.length} questions</Badge>
                            </div>
                            {section.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{section.description}</p>
                            )}
                            <div className="text-xs text-gray-500">
                              Total Points: {section.questions.reduce((sum, q) => sum + q.points, 0)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Navigation */}
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

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false)
                    resetForm()
                  }}
                  className="bg-transparent h-12 px-6"
                >
                  Cancel
                </Button>

                {currentStep < 3 ? (
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8">
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSaveAssessment}
                    className="bg-green-600 hover:bg-green-700 text-white h-12 px-8"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Publish Assessment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuestionCreationOptionsModal
        open={showQuestionOptions}
        onOpenChange={setShowQuestionOptions}
        onOptionSelected={handleQuestionOptionSelected}
      />

      <AIQuestionGenerationModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        onQuestionsGenerated={handleQuestionsGenerated}
        skillAreaId={currentSectionId}
      />

      <BulkUploadQuestionsModal
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        onQuestionsUploaded={handleQuestionsGenerated}
        skillAreaId={currentSectionId}
      />

      <LibraryImportModal
        open={showLibraryImport}
        onOpenChange={setShowLibraryImport}
        onQuestionsImported={handleQuestionsGenerated}
        skillAreaId={currentSectionId}
      />

      <PDFQuestionGenerationModal
        open={showPDFModal}
        onOpenChange={setShowPDFModal}
        onQuestionsGenerated={handleQuestionsGenerated}
        skillAreaId={currentSectionId}
      />
    </>
  )
}
