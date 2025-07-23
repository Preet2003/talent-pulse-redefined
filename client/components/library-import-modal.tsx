"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Target,
  FileText,
  Globe,
  Lock,
  Calendar,
  List,
  CheckSquare,
  Type,
  Code,
  Clock,
  Award,
  Layers,
  Download,
} from "lucide-react"

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

interface SkillArea {
  id: string
  name: string
  description: string
  questionCount: number
  questions: Question[]
}

interface Library {
  id: string
  name: string
  domain: string
  topic?: string
  subtopic?: string
  level: string
  visibility: "public" | "private"
  summary: string
  description?: string
  skillAreas: SkillArea[]
  totalQuestions: number
  createdAt: string
}

interface LibraryImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuestionsImported: (questions: Question[]) => void
  skillAreaId?: string | null
}

const questionTypeIcons = {
  "multiple-choice": List,
  "true-false": CheckSquare,
  "short-answer": Type,
  essay: FileText,
  coding: Code,
}

// Mock data for demonstration
const mockLibraries: Library[] = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    domain: "Technology",
    topic: "Software Development",
    subtopic: "Frontend Development",
    level: "beginner",
    visibility: "public",
    summary: "Essential JavaScript concepts and syntax",
    description: "Comprehensive coverage of JavaScript basics including variables, functions, and DOM manipulation",
    totalQuestions: 25,
    createdAt: "2024-01-15T10:00:00Z",
    skillAreas: [
      {
        id: "sa1",
        name: "Variables and Data Types",
        description: "Understanding JavaScript variables and primitive data types",
        questionCount: 8,
        questions: [
          {
            id: "q1",
            type: "multiple-choice",
            title: "JavaScript Variable Declaration",
            content: "Which keyword is used to declare a variable in JavaScript that can be reassigned?",
            options: ["const", "let", "var", "final"],
            correctAnswer: "1",
            points: 2,
            difficulty: "easy",
            timeLimit: 60,
            explanation: "'let' allows reassignment while 'const' does not",
          },
          {
            id: "q2",
            type: "true-false",
            title: "JavaScript Hoisting",
            content: "Variables declared with 'let' are hoisted to the top of their scope.",
            correctAnswer: "false",
            points: 3,
            difficulty: "medium",
            timeLimit: 90,
            explanation: "'let' variables are hoisted but not initialized, creating a temporal dead zone",
          },
        ],
      },
      {
        id: "sa2",
        name: "Functions and Scope",
        description: "JavaScript functions, closures, and scope concepts",
        questionCount: 12,
        questions: [
          {
            id: "q3",
            type: "coding",
            title: "Arrow Function Implementation",
            content:
              "Convert the following function declaration to an arrow function:\n\nfunction add(a, b) {\n  return a + b;\n}",
            correctAnswer: "const add = (a, b) => a + b;",
            points: 5,
            difficulty: "medium",
            timeLimit: 180,
            explanation: "Arrow functions provide a concise syntax for function expressions",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "React Development Essentials",
    domain: "Technology",
    topic: "Software Development",
    subtopic: "Frontend Development",
    level: "intermediate",
    visibility: "private",
    summary: "Core React concepts including components, hooks, and state management",
    totalQuestions: 18,
    createdAt: "2024-01-20T14:30:00Z",
    skillAreas: [
      {
        id: "sa3",
        name: "Components and JSX",
        description: "React components and JSX syntax",
        questionCount: 10,
        questions: [
          {
            id: "q4",
            type: "multiple-choice",
            title: "React Component Types",
            content: "What are the two main types of React components?",
            options: ["Class and Function", "State and Props", "Parent and Child", "Static and Dynamic"],
            correctAnswer: "0",
            points: 2,
            difficulty: "easy",
            timeLimit: 60,
          },
        ],
      },
      {
        id: "sa4",
        name: "Hooks and State",
        description: "React hooks and state management",
        questionCount: 8,
        questions: [
          {
            id: "q5",
            type: "short-answer",
            title: "useState Hook",
            content: "Explain the purpose of the useState hook in React and provide a simple example.",
            correctAnswer:
              "useState is a hook that allows functional components to have state. Example: const [count, setCount] = useState(0);",
            points: 4,
            difficulty: "medium",
            timeLimit: 300,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Digital Marketing Strategy",
    domain: "Marketing",
    topic: "Digital Marketing",
    level: "intermediate",
    visibility: "public",
    summary: "Comprehensive digital marketing strategies and tactics",
    totalQuestions: 30,
    createdAt: "2024-01-10T09:15:00Z",
    skillAreas: [
      {
        id: "sa5",
        name: "SEO Fundamentals",
        description: "Search engine optimization basics",
        questionCount: 15,
        questions: [
          {
            id: "q6",
            type: "essay",
            title: "SEO Strategy Development",
            content: "Describe the key components of an effective SEO strategy for a new e-commerce website.",
            points: 10,
            difficulty: "hard",
            timeLimit: 900,
          },
        ],
      },
      {
        id: "sa6",
        name: "Social Media Marketing",
        description: "Social media platforms and engagement strategies",
        questionCount: 15,
        questions: [
          {
            id: "q7",
            type: "multiple-choice",
            title: "Social Media Metrics",
            content: "Which metric is most important for measuring brand awareness on social media?",
            options: ["Click-through rate", "Reach and impressions", "Conversion rate", "Cost per click"],
            correctAnswer: "1",
            points: 3,
            difficulty: "medium",
            timeLimit: 120,
          },
        ],
      },
    ],
  },
]

export function LibraryImportModal({ open, onOpenChange, onQuestionsImported, skillAreaId }: LibraryImportModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set())
  const [expandedLibraries, setExpandedLibraries] = useState<Set<string>>(new Set())
  const [expandedSkillAreas, setExpandedSkillAreas] = useState<Set<string>>(new Set())
  const [libraries] = useState<Library[]>(mockLibraries)

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedQuestions(new Set())
      setExpandedLibraries(new Set())
      setExpandedSkillAreas(new Set())
    }
  }, [open])

  // Filter libraries and questions based on search query
  const filteredLibraries = libraries.filter((library) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      library.name.toLowerCase().includes(query) ||
      library.domain.toLowerCase().includes(query) ||
      library.topic?.toLowerCase().includes(query) ||
      library.summary.toLowerCase().includes(query) ||
      library.skillAreas.some(
        (skillArea) =>
          skillArea.name.toLowerCase().includes(query) ||
          skillArea.description.toLowerCase().includes(query) ||
          skillArea.questions.some(
            (question) =>
              question.title.toLowerCase().includes(query) || question.content.toLowerCase().includes(query),
          ),
      )
    )
  })

  const toggleLibraryExpansion = (libraryId: string) => {
    setExpandedLibraries((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(libraryId)) {
        newSet.delete(libraryId)
      } else {
        newSet.add(libraryId)
      }
      return newSet
    })
  }

  const toggleSkillAreaExpansion = (skillAreaId: string) => {
    setExpandedSkillAreas((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(skillAreaId)) {
        newSet.delete(skillAreaId)
      } else {
        newSet.add(skillAreaId)
      }
      return newSet
    })
  }

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const toggleSkillAreaSelection = (skillArea: SkillArea) => {
    const skillAreaQuestionIds = skillArea.questions.map((q) => q.id)
    const allSelected = skillAreaQuestionIds.every((id) => selectedQuestions.has(id))

    setSelectedQuestions((prev) => {
      const newSet = new Set(prev)
      if (allSelected) {
        // Deselect all questions in this skill area
        skillAreaQuestionIds.forEach((id) => newSet.delete(id))
      } else {
        // Select all questions in this skill area
        skillAreaQuestionIds.forEach((id) => newSet.add(id))
      }
      return newSet
    })
  }

  const toggleLibrarySelection = (library: Library) => {
    const libraryQuestionIds = library.skillAreas.flatMap((sa) => sa.questions.map((q) => q.id))
    const allSelected = libraryQuestionIds.every((id) => selectedQuestions.has(id))

    setSelectedQuestions((prev) => {
      const newSet = new Set(prev)
      if (allSelected) {
        // Deselect all questions in this library
        libraryQuestionIds.forEach((id) => newSet.delete(id))
      } else {
        // Select all questions in this library
        libraryQuestionIds.forEach((id) => newSet.add(id))
      }
      return newSet
    })
  }

  const handleImportSelected = () => {
    const questionsToImport: Question[] = []

    libraries.forEach((library) => {
      library.skillAreas.forEach((skillArea) => {
        skillArea.questions.forEach((question) => {
          if (selectedQuestions.has(question.id)) {
            questionsToImport.push(question)
          }
        })
      })
    })

    onQuestionsImported(questionsToImport)
    onOpenChange(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "hard":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
      case "intermediate":
        return "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400"
      case "expert":
        return "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getLibraryQuestionCount = (library: Library) => {
    return library.skillAreas.reduce((sum, sa) => sum + sa.questions.length, 0)
  }

  const getSelectedQuestionsInLibrary = (library: Library) => {
    const libraryQuestionIds = library.skillAreas.flatMap((sa) => sa.questions.map((q) => q.id))
    return libraryQuestionIds.filter((id) => selectedQuestions.has(id)).length
  }

  const getSelectedQuestionsInSkillArea = (skillArea: SkillArea) => {
    return skillArea.questions.filter((q) => selectedQuestions.has(q.id)).length
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden p-0 [&>button]:hidden">
        <div className="flex flex-col h-[95vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <BookOpen className="h-6 w-6 mr-3 text-indigo-600" />
                  Import from Library
                </DialogTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Browse and select questions from your existing libraries
                </p>
              </DialogHeader>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search libraries, skill areas or questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredLibraries.length > 0 ? (
              <div className="space-y-4">
                {filteredLibraries.map((library) => {
                  const isExpanded = expandedLibraries.has(library.id)
                  const totalQuestions = getLibraryQuestionCount(library)
                  const selectedCount = getSelectedQuestionsInLibrary(library)
                  const allSelected = totalQuestions > 0 && selectedCount === totalQuestions

                  return (
                    <Card key={library.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
                      <Collapsible open={isExpanded} onOpenChange={() => toggleLibraryExpansion(library.id)}>
                        <CollapsibleTrigger asChild>
                          <div className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                  {isExpanded ? (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                  )}
                                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <BookOpen className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                      {library.name}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      {library.visibility === "public" ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs"
                                        >
                                          <Globe className="mr-1 h-3 w-3" />
                                          Public
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs"
                                        >
                                          <Lock className="mr-1 h-3 w-3" />
                                          Private
                                        </Badge>
                                      )}
                                      <Badge
                                        variant="outline"
                                        className={`text-xs capitalize ${getLevelColor(library.level)}`}
                                      >
                                        {library.level}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center">
                                      <Target className="h-4 w-4 mr-1" />
                                      {library.domain}
                                    </span>
                                    {library.topic && (
                                      <span className="flex items-center">
                                        <Layers className="h-4 w-4 mr-1" />
                                        {library.topic}
                                      </span>
                                    )}
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {formatDate(library.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                    {library.summary}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    Skill Areas: {library.skillAreas.length}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Questions: {totalQuestions}
                                  </div>
                                  {selectedCount > 0 && (
                                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                      {selectedCount} selected
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={() => toggleLibrarySelection(library)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="px-6 pb-6">
                            <Separator className="mb-6" />
                            <div className="space-y-4">
                              {library.skillAreas.map((skillArea) => {
                                const isSkillAreaExpanded = expandedSkillAreas.has(skillArea.id)
                                const skillAreaSelectedCount = getSelectedQuestionsInSkillArea(skillArea)
                                const skillAreaAllSelected =
                                  skillArea.questions.length > 0 &&
                                  skillAreaSelectedCount === skillArea.questions.length

                                return (
                                  <Card
                                    key={skillArea.id}
                                    className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                  >
                                    <Collapsible
                                      open={isSkillAreaExpanded}
                                      onOpenChange={() => toggleSkillAreaExpansion(skillArea.id)}
                                    >
                                      <CollapsibleTrigger asChild>
                                        <div className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                              {isSkillAreaExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-gray-400" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                              )}
                                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                                <Target className="h-4 w-4 text-white" />
                                              </div>
                                              <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                  {skillArea.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                  {skillArea.description}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                              <div className="text-right text-sm">
                                                <div className="text-gray-900 dark:text-white">
                                                  {skillArea.questions.length} questions
                                                </div>
                                                {skillAreaSelectedCount > 0 && (
                                                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                                                    {skillAreaSelectedCount} selected
                                                  </div>
                                                )}
                                              </div>
                                              <Checkbox
                                                checked={skillAreaAllSelected}
                                                onCheckedChange={() => toggleSkillAreaSelection(skillArea)}
                                                onClick={(e) => e.stopPropagation()}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </CollapsibleTrigger>

                                      <CollapsibleContent>
                                        <div className="px-4 pb-4">
                                          <Separator className="mb-4" />
                                          <div className="space-y-3">
                                            {skillArea.questions.map((question) => {
                                              const QuestionIcon = questionTypeIcons[question.type]
                                              const isSelected = selectedQuestions.has(question.id)

                                              return (
                                                <div
                                                  key={question.id}
                                                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                    isSelected
                                                      ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30"
                                                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"
                                                  }`}
                                                  onClick={() => toggleQuestionSelection(question.id)}
                                                >
                                                  <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3 flex-1">
                                                      <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-600">
                                                        <QuestionIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <h5 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                                                          {question.title}
                                                        </h5>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                          {question.content}
                                                        </p>
                                                        <div className="flex items-center space-x-3 flex-wrap gap-2">
                                                          <Badge
                                                            variant="outline"
                                                            className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                                                          >
                                                            {question.type.replace("-", " ")}
                                                          </Badge>
                                                          <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getDifficultyColor(question.difficulty)}`}
                                                          >
                                                            {question.difficulty}
                                                          </Badge>
                                                          <Badge
                                                            variant="outline"
                                                            className="text-xs bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                                                          >
                                                            <Award className="h-3 w-3 mr-1" />
                                                            {question.points} pts
                                                          </Badge>
                                                          {question.timeLimit && (
                                                            <Badge
                                                              variant="outline"
                                                              className="text-xs bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400"
                                                            >
                                                              <Clock className="h-3 w-3 mr-1" />
                                                              {question.timeLimit}s
                                                            </Badge>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <Checkbox
                                                      checked={isSelected}
                                                      onCheckedChange={() => toggleQuestionSelection(question.id)}
                                                      onClick={(e) => e.stopPropagation()}
                                                    />
                                                  </div>
                                                </div>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </Card>
                                )
                              })}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  {searchQuery ? (
                    <Search className="h-12 w-12 text-gray-400" />
                  ) : (
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? "No results found" : "No libraries available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  {searchQuery
                    ? "No libraries match your search criteria. Try adjusting your search terms."
                    : "You don't have any libraries yet. Create a library first to import questions from it."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")} className="bg-transparent">
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedQuestions.size} question{selectedQuestions.size !== 1 ? "s" : ""} selected
                </span>
                {selectedQuestions.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedQuestions(new Set())}
                    className="bg-transparent text-xs"
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleImportSelected}
                  disabled={selectedQuestions.size === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Import Selected ({selectedQuestions.size})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
