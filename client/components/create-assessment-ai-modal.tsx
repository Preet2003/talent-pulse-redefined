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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import {
  X,
  Sparkles,
  Brain,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Info,
  Zap,
  BookOpen,
  Settings,
  Save,
  Wand2,
  Lightbulb,
  TrendingUp,
} from "lucide-react"

interface CreateAssessmentAIModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AIAssessmentConfig {
  jobTitle: string
  jobDescription: string
  experienceLevel: string
  assessmentType: string
  focusAreas: string[]
  difficulty: string
  duration: number
  questionCount: number
  includeSkillAreas: string[]
  customRequirements: string
  industry: string
  teamSize: string
  workEnvironment: string
}

interface GeneratedAssessment {
  title: string
  description: string
  instructions: string
  sections: Array<{
    id: string
    name: string
    description: string
    questions: Array<{
      id: string
      type: string
      title: string
      content: string
      options?: string[]
      correctAnswer?: string | number
      points: number
      difficulty: string
      timeLimit?: number
      explanation?: string
    }>
  }>
  estimatedDuration: number
  totalPoints: number
  passingScore: number
  tags: string[]
  category: string
}

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)", description: "New graduates or career changers" },
  { value: "junior", label: "Junior (2-4 years)", description: "Some professional experience" },
  { value: "mid", label: "Mid-Level (4-7 years)", description: "Solid experience and skills" },
  { value: "senior", label: "Senior (7-10 years)", description: "Advanced skills and leadership" },
  { value: "lead", label: "Lead/Principal (10+ years)", description: "Expert level with team leadership" },
]

const assessmentTypes = [
  { value: "technical", label: "Technical Skills", description: "Focus on technical competencies" },
  { value: "behavioral", label: "Behavioral", description: "Soft skills and personality traits" },
  { value: "mixed", label: "Mixed Assessment", description: "Combination of technical and behavioral" },
  { value: "cognitive", label: "Cognitive Abilities", description: "Problem-solving and reasoning" },
  { value: "domain", label: "Domain Knowledge", description: "Industry-specific knowledge" },
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Media",
  "Government",
  "Non-profit",
  "Other",
]

const focusAreaOptions = [
  "Problem Solving",
  "Technical Skills",
  "Communication",
  "Leadership",
  "Teamwork",
  "Creativity",
  "Analytical Thinking",
  "Project Management",
  "Customer Service",
  "Sales",
  "Marketing",
  "Data Analysis",
]

const skillAreaOptions = [
  "Programming",
  "System Design",
  "Database Management",
  "Security",
  "Cloud Computing",
  "DevOps",
  "Mobile Development",
  "Web Development",
  "Machine Learning",
  "Data Science",
  "UI/UX Design",
  "Quality Assurance",
]

export function CreateAssessmentAIModal({ open, onOpenChange }: CreateAssessmentAIModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedAssessment, setGeneratedAssessment] = useState<GeneratedAssessment | null>(null)

  const [config, setConfig] = useState<AIAssessmentConfig>({
    jobTitle: "",
    jobDescription: "",
    experienceLevel: "",
    assessmentType: "",
    focusAreas: [],
    difficulty: "adaptive",
    duration: 60,
    questionCount: 20,
    includeSkillAreas: [],
    customRequirements: "",
    industry: "",
    teamSize: "",
    workEnvironment: "",
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
      jobTitle: "",
      jobDescription: "",
      experienceLevel: "",
      assessmentType: "",
      focusAreas: [],
      difficulty: "adaptive",
      duration: 60,
      questionCount: 20,
      includeSkillAreas: [],
      customRequirements: "",
      industry: "",
      teamSize: "",
      workEnvironment: "",
    })
    setGeneratedAssessment(null)
    setFormErrors({})
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const updateConfig = (field: keyof AIAssessmentConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const toggleFocusArea = (area: string) => {
    setConfig((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }))
  }

  const toggleSkillArea = (area: string) => {
    setConfig((prev) => ({
      ...prev,
      includeSkillAreas: prev.includeSkillAreas.includes(area)
        ? prev.includeSkillAreas.filter((a) => a !== area)
        : [...prev.includeSkillAreas, area],
    }))
  }

  const validateStep1 = () => {
    const errors: Record<string, string> = {}

    if (!config.jobTitle.trim()) errors.jobTitle = "Job title is required"
    if (!config.jobDescription.trim()) errors.jobDescription = "Job description is required"
    if (!config.experienceLevel) errors.experienceLevel = "Experience level is required"
    if (!config.assessmentType) errors.assessmentType = "Assessment type is required"
    if (config.focusAreas.length === 0) errors.focusAreas = "Select at least one focus area"

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
      "Analyzing job requirements...",
      "Identifying key competencies...",
      "Generating assessment structure...",
      "Creating targeted questions...",
      "Optimizing difficulty levels...",
      "Finalizing assessment...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    // Generate mock assessment
    const mockAssessment = generateMockAssessment(config)
    setGeneratedAssessment(mockAssessment)
    setIsGenerating(false)
    setCurrentStep(3)
  }

  const generateMockAssessment = (config: AIAssessmentConfig): GeneratedAssessment => {
    const sections = [
      {
        id: "section-1",
        name: "Technical Competency",
        description: `Evaluate ${config.jobTitle} technical skills and knowledge`,
        questions: Array.from({ length: Math.ceil(config.questionCount * 0.6) }, (_, i) => ({
          id: `tech-q-${i + 1}`,
          type: "multiple-choice",
          title: `${config.jobTitle} Technical Question ${i + 1}`,
          content: `This question evaluates technical competency for a ${config.experienceLevel} level ${config.jobTitle} position.`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          points: 3,
          difficulty:
            config.difficulty === "adaptive"
              ? ["easy", "medium", "hard"][Math.floor(Math.random() * 3)]
              : config.difficulty,
          timeLimit: 120,
          explanation: `This tests core technical skills required for ${config.jobTitle}`,
        })),
      },
      {
        id: "section-2",
        name: "Problem Solving & Analysis",
        description: "Assess analytical thinking and problem-solving abilities",
        questions: Array.from({ length: Math.ceil(config.questionCount * 0.4) }, (_, i) => ({
          id: `prob-q-${i + 1}`,
          type: "short-answer",
          title: `Problem Solving Scenario ${i + 1}`,
          content: `Scenario-based question testing problem-solving skills for ${config.jobTitle}`,
          points: 5,
          difficulty: "medium",
          timeLimit: 300,
          explanation: "Tests analytical thinking and structured problem-solving approach",
        })),
      },
    ]

    return {
      title: `${config.jobTitle} Assessment - ${config.experienceLevel} Level`,
      description: `Comprehensive assessment for ${config.jobTitle} candidates with ${config.experienceLevel} experience level`,
      instructions: `This assessment evaluates key competencies for the ${config.jobTitle} role. Please read each question carefully and provide your best answer.`,
      sections,
      estimatedDuration: config.duration,
      totalPoints: sections.reduce(
        (total, section) => total + section.questions.reduce((sectionTotal, q) => sectionTotal + q.points, 0),
        0,
      ),
      passingScore: config.experienceLevel === "entry" ? 60 : config.experienceLevel === "senior" ? 80 : 70,
      tags: [config.jobTitle, config.experienceLevel, config.assessmentType, ...config.focusAreas.slice(0, 3)],
      category: "AI Generated Assessment",
    }
  }

  const handleSaveAssessment = () => {
    // Here you would save the generated assessment
    console.log("Saving AI-generated assessment:", generatedAssessment)
    onOpenChange(false)
    resetModal()
  }

  const steps = [
    { number: 1, title: "Job Requirements", icon: Target },
    { number: 2, title: "AI Generation", icon: Sparkles },
    { number: 3, title: "Review & Customize", icon: CheckCircle },
  ]

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
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assessment Generator
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Describe your role and let AI create the perfect assessment
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
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/30 scale-110"
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
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
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
            {/* Step 1: Job Requirements */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    Define Your Requirements
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Tell us about the role and we'll create a tailored assessment
                  </p>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      {/* Basic Job Information */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                          Job Information
                        </h4>

                        <div className="grid lg:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label
                              htmlFor="jobTitle"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Job Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="jobTitle"
                              value={config.jobTitle}
                              onChange={(e) => updateConfig("jobTitle", e.target.value)}
                              placeholder="e.g., Senior Software Engineer, Marketing Manager"
                              className={`h-12 ${formErrors.jobTitle ? "border-red-500" : ""}`}
                            />
                            {formErrors.jobTitle && (
                              <p className="text-red-600 text-sm flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                {formErrors.jobTitle}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="industry"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Industry
                            </Label>
                            <Select value={config.industry} onValueChange={(value) => updateConfig("industry", value)}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="jobDescription"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Job Description <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="jobDescription"
                            value={config.jobDescription}
                            onChange={(e) => updateConfig("jobDescription", e.target.value)}
                            placeholder="Describe the key responsibilities, required skills, and qualifications for this role..."
                            rows={4}
                            className={formErrors.jobDescription ? "border-red-500" : ""}
                          />
                          {formErrors.jobDescription && (
                            <p className="text-red-600 text-sm flex items-center">
                              <X className="h-4 w-4 mr-1" />
                              {formErrors.jobDescription}
                            </p>
                          )}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label
                              htmlFor="experienceLevel"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Experience Level <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={config.experienceLevel}
                              onValueChange={(value) => updateConfig("experienceLevel", value)}
                            >
                              <SelectTrigger className={`h-12 ${formErrors.experienceLevel ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                              <SelectContent>
                                {experienceLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    <div>
                                      <div className="font-medium">{level.label}</div>
                                      <div className="text-xs text-gray-500">{level.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.experienceLevel && (
                              <p className="text-red-600 text-sm flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                {formErrors.experienceLevel}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label
                              htmlFor="assessmentType"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Assessment Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={config.assessmentType}
                              onValueChange={(value) => updateConfig("assessmentType", value)}
                            >
                              <SelectTrigger className={`h-12 ${formErrors.assessmentType ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Select assessment type" />
                              </SelectTrigger>
                              <SelectContent>
                                {assessmentTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div>
                                      <div className="font-medium">{type.label}</div>
                                      <div className="text-xs text-gray-500">{type.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.assessmentType && (
                              <p className="text-red-600 text-sm flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                {formErrors.assessmentType}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Focus Areas */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                          Focus Areas <span className="text-red-500 text-sm ml-1">*</span>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {focusAreaOptions.map((area) => (
                            <div
                              key={area}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                config.focusAreas.includes(area)
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                              onClick={() => toggleFocusArea(area)}
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    config.focusAreas.includes(area)
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-300 dark:border-gray-600"
                                  }`}
                                >
                                  {config.focusAreas.includes(area) && <CheckCircle className="h-3 w-3 text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{area}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {formErrors.focusAreas && (
                          <p className="text-red-600 text-sm flex items-center">
                            <X className="h-4 w-4 mr-1" />
                            {formErrors.focusAreas}
                          </p>
                        )}
                      </div>

                      {/* Assessment Configuration */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <Settings className="h-5 w-5 mr-2 text-green-600" />
                          Assessment Configuration
                        </h4>

                        <div className="grid lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Duration: {config.duration} minutes
                              </Label>
                              <Slider
                                value={[config.duration]}
                                onValueChange={(value) => updateConfig("duration", value[0])}
                                max={180}
                                min={15}
                                step={15}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>15 min</span>
                                <span>180 min</span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Number of Questions: {config.questionCount}
                              </Label>
                              <Slider
                                value={[config.questionCount]}
                                onValueChange={(value) => updateConfig("questionCount", value[0])}
                                max={50}
                                min={5}
                                step={5}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>5 questions</span>
                                <span>50 questions</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-3">
                              <Label
                                htmlFor="difficulty"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Difficulty Level
                              </Label>
                              <Select
                                value={config.difficulty}
                                onValueChange={(value) => updateConfig("difficulty", value)}
                              >
                                <SelectTrigger className="h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                  <SelectItem value="adaptive">Adaptive (Recommended)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-3">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Additional Context
                              </Label>
                              <div className="grid grid-cols-2 gap-3">
                                <Select
                                  value={config.teamSize}
                                  onValueChange={(value) => updateConfig("teamSize", value)}
                                >
                                  <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Team size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="individual">Individual Contributor</SelectItem>
                                    <SelectItem value="small">Small Team (2-5)</SelectItem>
                                    <SelectItem value="medium">Medium Team (6-15)</SelectItem>
                                    <SelectItem value="large">Large Team (15+)</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Select
                                  value={config.workEnvironment}
                                  onValueChange={(value) => updateConfig("workEnvironment", value)}
                                >
                                  <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Work environment" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                    <SelectItem value="onsite">On-site</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Technical Skill Areas (conditional) */}
                        {config.assessmentType === "technical" && (
                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Technical Skill Areas (Optional)
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {skillAreaOptions.map((area) => (
                                <div
                                  key={area}
                                  className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    config.includeSkillAreas.includes(area)
                                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                  }`}
                                  onClick={() => toggleSkillArea(area)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className={`w-3 h-3 rounded border flex items-center justify-center ${
                                        config.includeSkillAreas.includes(area)
                                          ? "border-purple-500 bg-purple-500"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {config.includeSkillAreas.includes(area) && (
                                        <CheckCircle className="h-2 w-2 text-white" />
                                      )}
                                    </div>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">{area}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <Label
                            htmlFor="customRequirements"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                          >
                            Custom Requirements (Optional)
                          </Label>
                          <Textarea
                            id="customRequirements"
                            value={config.customRequirements}
                            onChange={(e) => updateConfig("customRequirements", e.target.value)}
                            placeholder="Any specific requirements, constraints, or focus areas for this assessment..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/25 h-12 px-8"
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Assessment with AI
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: AI Generation */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                    <Sparkles className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    AI is Creating Your Assessment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Our advanced AI is analyzing your requirements and generating a tailored assessment
                  </p>
                </div>

                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center space-y-8">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
                          <RefreshCw className="h-16 w-16 text-white animate-spin" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                          <Zap className="h-4 w-4 text-yellow-800" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Processing Your Requirements
                        </h4>
                        <div className="max-w-md mx-auto space-y-3">
                          <Progress value={generationProgress} className="h-3" />
                          <p className="text-sm text-gray-500">{Math.round(generationProgress)}% complete</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Analyzing Role</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Understanding job requirements</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Creating Structure</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Building assessment framework</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                          <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Generating Questions</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Creating targeted content</div>
                        </div>
                      </div>

                      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 max-w-2xl mx-auto">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                          <strong>AI Magic in Progress:</strong> We're creating a customized assessment based on your
                          job requirements, experience level, and focus areas. This usually takes 60-90 seconds.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Review & Customize */}
            {currentStep === 3 && generatedAssessment && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    Your Assessment is Ready!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Review the AI-generated assessment and make any adjustments before publishing
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {generatedAssessment.sections.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Sections</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {generatedAssessment.sections.reduce((total, section) => total + section.questions.length, 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {generatedAssessment.totalPoints}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {generatedAssessment.estimatedDuration}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Assessment Details */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Assessment Overview</h3>
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">AI Generated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Title</Label>
                        <Input
                          value={generatedAssessment.title}
                          onChange={(e) =>
                            setGeneratedAssessment((prev) => (prev ? { ...prev, title: e.target.value } : null))
                          }
                          className="mt-1 text-lg font-medium"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</Label>
                        <Textarea
                          value={generatedAssessment.description}
                          onChange={(e) =>
                            setGeneratedAssessment((prev) => (prev ? { ...prev, description: e.target.value } : null))
                          }
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instructions</Label>
                        <Textarea
                          value={generatedAssessment.instructions}
                          onChange={(e) =>
                            setGeneratedAssessment((prev) => (prev ? { ...prev, instructions: e.target.value } : null))
                          }
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Passing Score (%)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={generatedAssessment.passingScore}
                            onChange={(e) =>
                              setGeneratedAssessment((prev) =>
                                prev ? { ...prev, passingScore: Number(e.target.value) } : null,
                              )
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</Label>
                          <Input
                            value={generatedAssessment.category}
                            onChange={(e) =>
                              setGeneratedAssessment((prev) => (prev ? { ...prev, category: e.target.value } : null))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {generatedAssessment.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                              {tag}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() =>
                                  setGeneratedAssessment((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          tags: prev.tags.filter((_, i) => i !== index),
                                        }
                                      : null,
                                  )
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sections Preview */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Assessment Sections</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedAssessment.sections.map((section, index) => (
                        <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <Input
                                  value={section.name}
                                  onChange={(e) =>
                                    setGeneratedAssessment((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            sections: prev.sections.map((s) =>
                                              s.id === section.id ? { ...s, name: e.target.value } : s,
                                            ),
                                          }
                                        : null,
                                    )
                                  }
                                  className="font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                                />
                                <Input
                                  value={section.description}
                                  onChange={(e) =>
                                    setGeneratedAssessment((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            sections: prev.sections.map((s) =>
                                              s.id === section.id ? { ...s, description: e.target.value } : s,
                                            ),
                                          }
                                        : null,
                                    )
                                  }
                                  className="text-sm text-gray-600 dark:text-gray-400 border-none p-0 h-auto bg-transparent focus-visible:ring-0 mt-1"
                                />
                              </div>
                            </div>
                            <Badge variant="outline">{section.questions.length} questions</Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            Total Points: {section.questions.reduce((sum, q) => sum + q.points, 0)} | Avg. Time:{" "}
                            {Math.round(
                              section.questions.reduce((sum, q) => sum + (q.timeLimit || 120), 0) /
                                section.questions.length /
                                60,
                            )}{" "}
                            min
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

              {currentStep === 1 && (
                <Button
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/25 h-12 px-8"
                >
                  Generate with AI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}

              {currentStep === 3 && (
                <Button
                  onClick={handleSaveAssessment}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 h-12 px-8"
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
  )
}
