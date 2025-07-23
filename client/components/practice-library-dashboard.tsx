"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Search, Play, Bookmark, Clock, Target, TrendingUp, Star, CheckCircle, BarChart3 } from "lucide-react"

interface PracticeQuestion {
  id: string
  title: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  timeEstimate: number
  completed: boolean
  bookmarked: boolean
  score?: number
  tags: string[]
}

interface StudyPlan {
  id: string
  title: string
  description: string
  progress: number
  totalQuestions: number
  completedQuestions: number
  estimatedTime: number
  category: string
}

const mockQuestions: PracticeQuestion[] = [
  {
    id: "1",
    title: "JavaScript Closures and Scope",
    category: "JavaScript",
    difficulty: "medium",
    timeEstimate: 15,
    completed: true,
    bookmarked: false,
    score: 85,
    tags: ["closures", "scope", "functions"],
  },
  {
    id: "2",
    title: "React Hooks Implementation",
    category: "React",
    difficulty: "hard",
    timeEstimate: 25,
    completed: false,
    bookmarked: true,
    tags: ["hooks", "state", "effects"],
  },
  {
    id: "3",
    title: "CSS Flexbox Layout",
    category: "CSS",
    difficulty: "easy",
    timeEstimate: 10,
    completed: true,
    bookmarked: false,
    score: 92,
    tags: ["flexbox", "layout", "responsive"],
  },
  {
    id: "4",
    title: "Node.js Async Programming",
    category: "Node.js",
    difficulty: "hard",
    timeEstimate: 30,
    completed: false,
    bookmarked: true,
    tags: ["async", "promises", "callbacks"],
  },
]

const mockStudyPlans: StudyPlan[] = [
  {
    id: "1",
    title: "Frontend Development Fundamentals",
    description: "Master the basics of HTML, CSS, and JavaScript",
    progress: 65,
    totalQuestions: 20,
    completedQuestions: 13,
    estimatedTime: 180,
    category: "Frontend",
  },
  {
    id: "2",
    title: "React.js Complete Guide",
    description: "From basics to advanced React concepts",
    progress: 30,
    totalQuestions: 25,
    completedQuestions: 8,
    estimatedTime: 300,
    category: "React",
  },
  {
    id: "3",
    title: "JavaScript Advanced Concepts",
    description: "Deep dive into advanced JavaScript topics",
    progress: 80,
    totalQuestions: 15,
    completedQuestions: 12,
    estimatedTime: 200,
    category: "JavaScript",
  },
]

export function PracticeLibraryDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const categories = ["all", ...Array.from(new Set(mockQuestions.map((q) => q.category)))]
  const difficulties = ["all", "easy", "medium", "hard"]

  const filteredQuestions = mockQuestions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || question.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const completedQuestions = mockQuestions.filter((q) => q.completed).length
  const bookmarkedQuestions = mockQuestions.filter((q) => q.bookmarked).length
  const averageScore =
    mockQuestions.filter((q) => q.score).reduce((acc, q) => acc + (q.score || 0), 0) /
    mockQuestions.filter((q) => q.score).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Practice Library</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enhance your skills with practice questions and study plans
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockQuestions.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedQuestions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bookmarked</p>
                <p className="text-2xl font-bold text-yellow-600">{bookmarkedQuestions}</p>
              </div>
              <Bookmark className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(averageScore)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Tabs */}
      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">Practice Questions</TabsTrigger>
          <TabsTrigger value="plans">Study Plans</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search questions or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all"
                      ? "All Difficulties"
                      : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid gap-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{question.title}</h3>
                        {question.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {question.bookmarked && <Bookmark className="h-5 w-5 text-yellow-500 fill-current" />}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {question.timeEstimate} min
                        </span>
                        {question.score && (
                          <span className="text-sm font-medium text-green-600">Score: {question.score}%</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        {question.completed ? "Review" : "Start"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <Bookmark className="h-4 w-4" />
                        {question.bookmarked ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredQuestions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or filters</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-6">
            {mockStudyPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {plan.completedQuestions}/{plan.totalQuestions} questions
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">~{plan.estimatedTime} min</span>
                        </div>
                        <Badge variant="outline">{plan.category}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Continue
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Questions Completed</span>
                    <span className="font-medium">
                      {completedQuestions}/{mockQuestions.length}
                    </span>
                  </div>
                  <Progress value={(completedQuestions / mockQuestions.length) * 100} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                    <span className="font-medium">{Math.round(averageScore)}%</span>
                  </div>
                  <Progress value={averageScore} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Study Plans Progress</span>
                    <span className="font-medium">2/3 Active</span>
                  </div>
                  <Progress value={67} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">First Question</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Completed your first practice question</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">High Scorer</p>
                      <p className="text-sm text-green-700 dark:text-green-300">Achieved 90%+ on a question</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg opacity-50">
                    <Clock className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-400">Speed Demon</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Complete 10 questions in under 5 minutes each
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Your performance across different skill areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => {
                    const categoryQuestions = mockQuestions.filter((q) => q.category === category)
                    const completedInCategory = categoryQuestions.filter((q) => q.completed).length
                    const progress = (completedInCategory / categoryQuestions.length) * 100

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {completedInCategory}/{categoryQuestions.length}
                          </span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
