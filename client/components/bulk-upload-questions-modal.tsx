"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  X,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Info,
  RefreshCw,
} from "lucide-react"

interface BulkUploadQuestionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuestionsUploaded: (questions: Question[]) => void
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
  category?: string
}

interface ParsedQuestion extends Omit<Question, "id"> {
  rowNumber: number
  isValid: boolean
  errors: string[]
}

export function BulkUploadQuestionsModal({
  open,
  onOpenChange,
  onQuestionsUploaded,
  skillAreaId,
}: BulkUploadQuestionsModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadTemplate = () => {
    // Create a sample CSV content
    const csvContent = `Question Type,Question Title,Question Content,Option A,Option B,Option C,Option D,Correct Answer,Points,Difficulty,Time Limit (seconds),Explanation,Category
multiple-choice,What is JavaScript?,JavaScript is a programming language used for,Web development,Database management,Hardware design,Network security,A,2,easy,60,JavaScript is primarily used for web development,Programming
true-false,JavaScript is a compiled language,JavaScript is a compiled programming language,,,,,false,1,easy,30,JavaScript is an interpreted language not compiled,Programming
short-answer,Define a variable in JavaScript,How do you define a variable in JavaScript?,,,,,var x = 5; or let x = 5; or const x = 5;,3,medium,120,Variables can be defined using var let or const keywords,Programming
essay,Explain closures in JavaScript,Explain the concept of closures in JavaScript with an example,,,,,A closure is a function that has access to variables in its outer scope even after the outer function has returned,5,hard,300,Closures are an important concept in JavaScript functional programming,Programming`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "question-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate file processing with progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const text = await file.text()
      const lines = text.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      const questions: ParsedQuestion[] = []

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map((v) => v.trim())
          const question = parseQuestionRow(values, headers, i + 1)
          questions.push(question)
        }
      }

      setParsedQuestions(questions)
      setSelectedQuestions(new Set(questions.map((_, index) => index)))
      setProcessingProgress(100)

      setTimeout(() => {
        setIsProcessing(false)
        setCurrentStep(3)
      }, 500)
    } catch (error) {
      console.error("Error processing file:", error)
      setIsProcessing(false)
    }
  }

  const parseQuestionRow = (values: string[], headers: string[], rowNumber: number): ParsedQuestion => {
    const errors: string[] = []

    const questionType = values[0]?.toLowerCase().replace(/[^a-z-]/g, "") as Question["type"]
    const title = values[1] || ""
    const content = values[2] || ""
    const optionA = values[3] || ""
    const optionB = values[4] || ""
    const optionC = values[5] || ""
    const optionD = values[6] || ""
    const correctAnswer = values[7] || ""
    const points = Number.parseInt(values[8]) || 1
    const difficulty = (values[9]?.toLowerCase() || "medium") as Question["difficulty"]
    const timeLimit = Number.parseInt(values[10]) || 60
    const explanation = values[11] || ""
    const category = values[12] || ""

    // Validation
    if (!title) errors.push("Question title is required")
    if (!content) errors.push("Question content is required")
    if (!["multiple-choice", "true-false", "short-answer", "essay", "coding"].includes(questionType)) {
      errors.push("Invalid question type")
    }
    if (questionType === "multiple-choice" && (!optionA || !optionB)) {
      errors.push("Multiple choice questions need at least 2 options")
    }
    if (!correctAnswer) errors.push("Correct answer is required")

    const options =
      questionType === "multiple-choice" ? [optionA, optionB, optionC, optionD].filter(Boolean) : undefined

    return {
      rowNumber,
      type: questionType,
      title,
      content,
      options,
      correctAnswer: questionType === "multiple-choice" ? correctAnswer : correctAnswer,
      points,
      difficulty,
      timeLimit,
      explanation,
      category,
      isValid: errors.length === 0,
      errors,
    }
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
    const validQuestions = parsedQuestions.map((_, index) => index).filter((index) => parsedQuestions[index].isValid)
    setSelectedQuestions(new Set(validQuestions))
  }

  const handleDeselectAll = () => {
    setSelectedQuestions(new Set())
  }

  const handleImportQuestions = () => {
    const questionsToImport = Array.from(selectedQuestions)
      .map((index) => parsedQuestions[index])
      .filter((q) => q.isValid)
      .map((q) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: q.type,
        title: q.title,
        content: q.content,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        explanation: q.explanation,
      }))

    onQuestionsUploaded(questionsToImport)
    onOpenChange(false)
    resetModal()
  }

  const resetModal = () => {
    setCurrentStep(1)
    setUploadedFile(null)
    setParsedQuestions([])
    setSelectedQuestions(new Set())
    setIsProcessing(false)
    setProcessingProgress(0)
  }

  const validQuestions = parsedQuestions.filter((q) => q.isValid)
  const invalidQuestions = parsedQuestions.filter((q) => !q.isValid)
  const selectedValidQuestions = Array.from(selectedQuestions).filter((index) => parsedQuestions[index]?.isValid)

  const steps = [
    { number: 1, title: "Download Template", icon: Download },
    { number: 2, title: "Upload File", icon: Upload },
    { number: 3, title: "Review & Import", icon: CheckCircle },
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
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Bulk Upload Questions
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
              Import multiple questions at once using our Excel template
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
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/30 scale-110"
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
                            ? "text-green-600 dark:text-green-400"
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
                            ? "bg-gradient-to-r from-green-600 to-green-500"
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
            {/* Step 1: Download Template */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <FileSpreadsheet className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Download Template</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Start by downloading our Excel template. This template includes all the required columns and sample
                    data to help you format your questions correctly.
                  </p>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Template Features</h4>
                          <div className="space-y-3">
                            {[
                              "Pre-formatted columns for all question types",
                              "Sample questions to guide you",
                              "Built-in validation rules",
                              "Support for multiple choice, true/false, short answer, essay, and coding questions",
                              "Difficulty levels and point assignments",
                              "Time limits and explanations",
                            ].map((feature, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800 dark:text-blue-200">
                            <strong>Pro Tip:</strong> Keep the header row intact and follow the sample format exactly
                            for best results.
                          </AlertDescription>
                        </Alert>
                      </div>

                      <div className="text-center space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                          <FileSpreadsheet className="h-16 w-16 text-green-600 mx-auto mb-4" />
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excel Template</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Ready-to-use template with sample questions
                          </p>
                          <Button
                            onClick={handleDownloadTemplate}
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 w-full"
                          >
                            <Download className="mr-2 h-5 w-5" />
                            Download Template
                          </Button>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">File format: CSV • Size: ~2KB</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 h-12 px-8"
                  >
                    I've Downloaded the Template
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Upload File */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Upload Your File</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Upload your completed Excel file. We'll validate and process all your questions automatically.
                  </p>
                </div>

                {!isProcessing && !uploadedFile && (
                  <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <CardContent className="p-16 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Upload className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Drop your file here or click to browse
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Supported formats: CSV, Excel (.xlsx, .xls)
                        <br />
                        Maximum file size: 10MB
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 h-12 px-8"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        Choose File
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {isProcessing && (
                  <Card className="border-0 shadow-xl">
                    <CardContent className="p-8">
                      <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                          <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Processing Your File</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            We're validating and parsing your questions...
                          </p>
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                          <Progress value={processingProgress} className="h-3" />
                          <p className="text-sm text-gray-500">{processingProgress}% complete</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {uploadedFile && !isProcessing && parsedQuestions.length === 0 && (
                  <Card className="border-0 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{uploadedFile.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {(uploadedFile.size / 1024).toFixed(1)} KB • Uploaded successfully
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setUploadedFile(null)
                            setParsedQuestions([])
                          }}
                          className="bg-transparent"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 3: Review & Import */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Review Questions</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Review your imported questions and select which ones to add to your library.
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {parsedQuestions.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {validQuestions.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Valid Questions</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {invalidQuestions.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Invalid Questions</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {selectedValidQuestions.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Selection Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={handleSelectAll} className="bg-transparent">
                      Select All Valid
                    </Button>
                    <Button variant="outline" onClick={handleDeselectAll} className="bg-transparent">
                      Deselect All
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedValidQuestions.length} of {validQuestions.length} questions selected
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {parsedQuestions.map((question, index) => (
                    <Card
                      key={index}
                      className={`border-2 transition-all duration-200 ${
                        question.isValid
                          ? selectedQuestions.has(index)
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          : "border-red-200 bg-red-50 dark:bg-red-950/20"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {question.isValid && (
                            <input
                              type="checkbox"
                              checked={selectedQuestions.has(index)}
                              onChange={() => handleQuestionToggle(index)}
                              className="w-5 h-5 text-green-600 rounded mt-1"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                  {question.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{question.content}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    question.isValid
                                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                                      : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                                  }`}
                                >
                                  Row {question.rowNumber}
                                </Badge>
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
                              </div>
                            </div>

                            {question.type === "multiple-choice" && question.options && (
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded-lg text-sm ${
                                      question.correctAnswer === String.fromCharCode(65 + optIndex)
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    <span className="font-medium">{String.fromCharCode(65 + optIndex)}:</span> {option}
                                  </div>
                                ))}
                              </div>
                            )}

                            {!question.isValid && (
                              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                  <div className="space-y-1">
                                    {question.errors.map((error, errorIndex) => (
                                      <div key={errorIndex}>• {error}</div>
                                    ))}
                                  </div>
                                </AlertDescription>
                              </Alert>
                            )}

                            {question.explanation && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                  <strong>Explanation:</strong> {question.explanation}
                                </p>
                              </div>
                            )}
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
              {currentStep > 1 && (
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
              >
                Cancel
              </Button>

              {currentStep === 3 && (
                <Button
                  onClick={handleImportQuestions}
                  disabled={selectedValidQuestions.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 h-12 px-8"
                >
                  Import {selectedValidQuestions.length} Questions
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
