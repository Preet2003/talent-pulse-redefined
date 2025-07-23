"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  LineChart,
  PieChart,
  Share2,
  Star,
  Target,
  ThumbsUp,
  Timer,
  TrendingUp,
  XCircle,
} from "lucide-react"

// Mock data for the assessment results
const assessmentResult = {
  id: "a123456",
  title: "Full Stack Developer Assessment",
  company: "TechCorp Solutions",
  completedAt: "2024-01-15T14:30:00Z",
  duration: "2h 15m",
  totalQuestions: 45,
  answeredQuestions: 45,
  correctAnswers: 35,
  score: 78,
  passingScore: 70,
  percentile: 82,
  grade: "B+",
  certificate: {
    id: "cert-123456",
    title: "Full Stack Developer Certification",
    issueDate: "2024-01-15",
    validUntil: "2027-01-15",
    credentialId: "FSC-78945",
    issuer: "TechCorp Solutions",
  },
  timeManagement: {
    totalTime: 135, // minutes
    averageTimePerQuestion: 3, // minutes
    fastestQuestion: 0.5, // minutes
    slowestQuestion: 8, // minutes
    timeEfficiency: 85, // percentage
    timeByDifficulty: {
      easy: 1.2, // average minutes per easy question
      medium: 3.5, // average minutes per medium question
      hard: 6.2, // average minutes per hard question
    },
  },
  skillBreakdown: [
    { skill: "JavaScript", score: 85, total: 10, correct: 8.5, category: "Frontend" },
    { skill: "React", score: 75, total: 8, correct: 6, category: "Frontend" },
    { skill: "HTML/CSS", score: 90, total: 5, correct: 4.5, category: "Frontend" },
    { skill: "Node.js", score: 70, total: 7, correct: 4.9, category: "Backend" },
    { skill: "Express", score: 65, total: 5, correct: 3.25, category: "Backend" },
    { skill: "MongoDB", score: 80, total: 5, correct: 4, category: "Database" },
    { skill: "System Design", score: 60, total: 5, correct: 3, category: "Architecture" },
  ],
  strengths: [
    { skill: "HTML/CSS", score: 90, comment: "Excellent understanding of modern CSS techniques and responsive design" },
    { skill: "JavaScript", score: 85, comment: "Strong grasp of core JavaScript concepts and ES6+ features" },
    { skill: "MongoDB", score: 80, comment: "Good knowledge of document database operations and queries" },
  ],
  improvements: [
    { skill: "System Design", score: 60, comment: "Need to improve understanding of scalable architecture patterns" },
    { skill: "Express", score: 65, comment: "Review middleware concepts and error handling in Express" },
    { skill: "Node.js", score: 70, comment: "Focus on asynchronous programming patterns and event loop" },
  ],
  questions: [
    {
      id: 1,
      question: "What is the output of console.log(typeof null) in JavaScript?",
      correctAnswer: "object",
      userAnswer: "object",
      isCorrect: true,
      difficulty: "Medium",
      timeSpent: 1.5, // minutes
      points: 2,
      maxPoints: 2,
      category: "JavaScript",
    },
    {
      id: 2,
      question: "Which hook would you use to run side effects in a React component?",
      correctAnswer: "useEffect",
      userAnswer: "useEffect",
      isCorrect: true,
      difficulty: "Easy",
      timeSpent: 1, // minutes
      points: 1,
      maxPoints: 1,
      category: "React",
    },
    {
      id: 3,
      question: "Explain the concept of middleware in Express.js",
      correctAnswer: "Functions that have access to the request and response objects and the next middleware function",
      userAnswer: "Functions that process requests before they reach the route handlers",
      isCorrect: false,
      difficulty: "Hard",
      timeSpent: 4.5, // minutes
      points: 0,
      maxPoints: 3,
      category: "Express",
    },
    // More questions would be here in a real implementation
  ],
  recommendations: [
    {
      title: "System Design Fundamentals",
      type: "course",
      provider: "Educative",
      duration: "10 hours",
      rating: 4.8,
      link: "#",
      description: "Learn the fundamentals of designing scalable systems",
    },
    {
      title: "Advanced Express.js Patterns",
      type: "tutorial",
      provider: "Frontend Masters",
      duration: "6 hours",
      rating: 4.9,
      link: "#",
      description: "Master middleware, error handling, and authentication in Express",
    },
    {
      title: "Node.js Performance Optimization",
      type: "workshop",
      provider: "NodeSchool",
      duration: "4 hours",
      rating: 4.7,
      link: "#",
      description: "Optimize your Node.js applications for performance",
    },
  ],
}

export function AssessmentResultsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Helper function to get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 70) return "bg-blue-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  // Helper function to get badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  // Helper function to get grade color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800"
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800"
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{assessmentResult.title}</h1>
            <p className="text-blue-100">{assessmentResult.company}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-blue-100 border-blue-300">
                {new Date(assessmentResult.completedAt).toLocaleDateString()}
              </Badge>
              <Badge variant="outline" className="text-blue-100 border-blue-300">
                {assessmentResult.duration}
              </Badge>
              <Badge variant="outline" className="text-blue-100 border-blue-300">
                {assessmentResult.totalQuestions} Questions
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold">{assessmentResult.score}%</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-white/20">{assessmentResult.grade}</Badge>
              {assessmentResult.score >= assessmentResult.passingScore ? (
                <Badge className="bg-green-500">PASSED</Badge>
              ) : (
                <Badge className="bg-red-500">FAILED</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-4xl font-bold ${getScoreColor(assessmentResult.score)} mb-1`}>
                  {assessmentResult.score}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{assessmentResult.percentile}%</div>
                <div className="text-sm text-gray-600">Percentile Rank</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-1">
                  {assessmentResult.timeManagement.timeEfficiency}%
                </div>
                <div className="text-sm text-gray-600">Time Efficiency</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-4xl font-bold text-green-600 mb-1">{assessmentResult.grade}</div>
                <div className="text-sm text-gray-600">Grade</div>
              </CardContent>
            </Card>
          </div>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Score Breakdown
              </CardTitle>
              <CardDescription>Detailed breakdown of your assessment performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Correct Answers</span>
                        <span className="text-sm font-medium text-green-600">
                          {assessmentResult.correctAnswers} / {assessmentResult.totalQuestions}
                        </span>
                      </div>
                      <Progress
                        value={(assessmentResult.correctAnswers / assessmentResult.totalQuestions) * 100}
                        className="h-2 bg-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-sm font-medium text-blue-600">
                          {assessmentResult.answeredQuestions} / {assessmentResult.totalQuestions}
                        </span>
                      </div>
                      <Progress
                        value={(assessmentResult.answeredQuestions / assessmentResult.totalQuestions) * 100}
                        className="h-2 bg-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Passing Score</span>
                        <span className="text-sm font-medium text-orange-600">{assessmentResult.passingScore}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full relative">
                        <div
                          className="absolute h-full bg-orange-400 rounded-full"
                          style={{ width: `${assessmentResult.passingScore}%` }}
                        ></div>
                        <div
                          className="absolute h-full bg-blue-500 rounded-full"
                          style={{ width: `${assessmentResult.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div
                    className={`w-40 h-40 rounded-full flex items-center justify-center ${getScoreBgColor(
                      assessmentResult.score,
                    )}`}
                  >
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${getScoreColor(assessmentResult.score)}`}>
                        {assessmentResult.score}%
                      </div>
                      <div className="text-sm text-gray-600">Final Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-200">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <ThumbsUp className="h-5 w-5" />
                  Strengths
                </CardTitle>
                <CardDescription>Areas where you performed exceptionally well</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {assessmentResult.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{strength.skill}</h4>
                        <Badge className={getScoreBadgeColor(strength.score)}>{strength.score}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{strength.comment}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Target className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>Skills that need additional focus</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {assessmentResult.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Target className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{improvement.skill}</h4>
                        <Badge className={getScoreBadgeColor(improvement.score)}>{improvement.score}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{improvement.comment}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Certificate */}
          {assessmentResult.score >= assessmentResult.passingScore && (
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Award className="h-5 w-5" />
                  Certificate Earned
                </CardTitle>
                <CardDescription>Congratulations on earning your certification!</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <Award className="h-16 w-16 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{assessmentResult.certificate.title}</h3>
                  <p className="text-gray-600 mb-4">
                    Issued by {assessmentResult.certificate.issuer} on{" "}
                    {new Date(assessmentResult.certificate.issueDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline" className="bg-white">
                      Credential ID: {assessmentResult.certificate.credentialId}
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      Valid until: {new Date(assessmentResult.certificate.validUntil).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          {/* Skill Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Skill Performance
              </CardTitle>
              <CardDescription>Detailed breakdown of your performance by skill category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Frontend Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Frontend Development</h3>
                <div className="space-y-4">
                  {assessmentResult.skillBreakdown
                    .filter((skill) => skill.category === "Frontend")
                    .map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <Badge variant="outline" className="text-xs">
                              {skill.correct} / {skill.total} correct
                            </Badge>
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              skill.score >= 80
                                ? "bg-green-500"
                                : skill.score >= 70
                                  ? "bg-blue-500"
                                  : skill.score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${skill.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Backend Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Backend Development</h3>
                <div className="space-y-4">
                  {assessmentResult.skillBreakdown
                    .filter((skill) => skill.category === "Backend")
                    .map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <Badge variant="outline" className="text-xs">
                              {skill.correct} / {skill.total} correct
                            </Badge>
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              skill.score >= 80
                                ? "bg-green-500"
                                : skill.score >= 70
                                  ? "bg-blue-500"
                                  : skill.score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${skill.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Database Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Database</h3>
                <div className="space-y-4">
                  {assessmentResult.skillBreakdown
                    .filter((skill) => skill.category === "Database")
                    .map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <Badge variant="outline" className="text-xs">
                              {skill.correct} / {skill.total} correct
                            </Badge>
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              skill.score >= 80
                                ? "bg-green-500"
                                : skill.score >= 70
                                  ? "bg-blue-500"
                                  : skill.score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${skill.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Architecture Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Architecture</h3>
                <div className="space-y-4">
                  {assessmentResult.skillBreakdown
                    .filter((skill) => skill.category === "Architecture")
                    .map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <Badge variant="outline" className="text-xs">
                              {skill.correct} / {skill.total} correct
                            </Badge>
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div
                            className={`h-full rounded-full ${
                              skill.score >= 80
                                ? "bg-green-500"
                                : skill.score >= 70
                                  ? "bg-blue-500"
                                  : skill.score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${skill.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Skill Comparison
              </CardTitle>
              <CardDescription>How your skills compare to industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <LineChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Comparison Chart</h3>
                  <p className="text-gray-600 max-w-md">
                    This chart would show your skills compared to industry benchmarks and other candidates. It would be
                    implemented with a real chart library like Recharts in a production environment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Percentile Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Percentile Ranking
              </CardTitle>
              <CardDescription>How you compare to other candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Your Score</span>
                        <span className="text-sm font-medium text-blue-600">{assessmentResult.score}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full relative">
                        <div
                          className="absolute h-full bg-blue-500 rounded-full"
                          style={{ width: `${assessmentResult.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Score</span>
                        <span className="text-sm font-medium text-gray-600">68%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full relative">
                        <div className="absolute h-full bg-gray-400 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Top 20% Score</span>
                        <span className="text-sm font-medium text-gray-600">85%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full relative">
                        <div className="absolute h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="text-center">
                      <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <div>
                          <div className="text-4xl font-bold text-blue-600">{assessmentResult.percentile}%</div>
                          <div className="text-sm text-gray-600">Percentile</div>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-700">
                        You performed better than <span className="font-bold">{assessmentResult.percentile}%</span> of
                        candidates who took this assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Question Analysis
              </CardTitle>
              <CardDescription>Detailed breakdown of your performance on each question</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessmentResult.questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{question.question}</div>
                          <div className="text-sm text-gray-500">Category: {question.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {question.isCorrect ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorrect
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{question.timeSpent} min</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={question.points === question.maxPoints ? "text-green-600" : "text-orange-600"}>
                          {question.points}/{question.maxPoints}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Showing {assessmentResult.questions.length} of {assessmentResult.totalQuestions} questions
              </div>
              <Button variant="outline" className="bg-transparent">
                View All Questions
              </Button>
            </CardFooter>
          </Card>

          {/* Answer Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Answer Distribution
              </CardTitle>
              <CardDescription>Breakdown of your answers by category and correctness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <PieChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Answer Distribution Chart</h3>
                  <p className="text-gray-600 max-w-md">
                    This chart would show the distribution of your answers across different categories and correctness
                    levels. It would be implemented with a real chart library like Recharts in a production environment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Time Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Management
              </CardTitle>
              <CardDescription>Analysis of how you managed your time during the assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {assessmentResult.timeManagement.averageTimePerQuestion} min
                    </div>
                    <div className="text-sm text-gray-600">Average Time per Question</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Timer className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {assessmentResult.timeManagement.fastestQuestion} min
                    </div>
                    <div className="text-sm text-gray-600">Fastest Question</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Timer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {assessmentResult.timeManagement.slowestQuestion} min
                    </div>
                    <div className="text-sm text-gray-600">Slowest Question</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Time by Difficulty Level</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Easy Questions</span>
                      <span className="text-sm font-medium text-green-600">
                        {assessmentResult.timeManagement.timeByDifficulty.easy} min avg
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${
                            (assessmentResult.timeManagement.timeByDifficulty.easy /
                              assessmentResult.timeManagement.slowestQuestion) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Medium Questions</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {assessmentResult.timeManagement.timeByDifficulty.medium} min avg
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{
                          width: `${
                            (assessmentResult.timeManagement.timeByDifficulty.medium /
                              assessmentResult.timeManagement.slowestQuestion) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hard Questions</span>
                      <span className="text-sm font-medium text-red-600">
                        {assessmentResult.timeManagement.timeByDifficulty.hard} min avg
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${
                            (assessmentResult.timeManagement.timeByDifficulty.hard /
                              assessmentResult.timeManagement.slowestQuestion) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Time Efficiency Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your time efficiency score is{" "}
                      <span className="font-semibold text-blue-600">
                        {assessmentResult.timeManagement.timeEfficiency}%
                      </span>
                      . This indicates you managed your time well during the assessment. You spent an appropriate amount
                      of time on each question based on its difficulty level.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Tip: For hard questions, consider allocating a maximum time and moving on if you exceed it. You
                      can always come back to difficult questions later.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Performance Patterns
              </CardTitle>
              <CardDescription>Insights into your performance patterns during the assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <LineChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Pattern Chart</h3>
                  <p className="text-gray-600 max-w-md">
                    This chart would show your performance patterns throughout the assessment, including time spent per
                    question and accuracy over time. It would be implemented with a real chart library like Recharts in
                    a production environment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          {/* Recommended Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recommended Resources
              </CardTitle>
              <CardDescription>Curated learning resources to help you improve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessmentResult.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-start gap-4"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {recommendation.type === "course" ? (
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    ) : recommendation.type === "tutorial" ? (
                      <FileText className="h-5 w-5 text-blue-600" />
                    ) : (
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                      <Badge variant="outline" className="capitalize">
                        {recommendation.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">{recommendation.provider}</span>
                        <span className="text-xs text-gray-500">{recommendation.duration}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-500 ml-1">{recommendation.rating}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Resource
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skill Development Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skill Development Plan
              </CardTitle>
              <CardDescription>Personalized plan to improve your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Path</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">1. Learn</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Focus on the recommended resources for System Design and Express.js to strengthen your
                          understanding of these areas.
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">2. Practice</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Complete practice exercises focusing on middleware concepts in Express and asynchronous
                          programming patterns in Node.js.
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">3. Assess</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Take focused assessments on your improvement areas to measure your progress and identify any
                          remaining gaps.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Short-term Goals (1-2 weeks)</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Complete Express.js middleware tutorial</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Practice 5 system design exercises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Review Node.js asynchronous programming concepts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Long-term Goals (1-3 months)</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Complete System Design Fundamentals course</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Build a full-stack project using Express and MongoDB</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span>Retake this assessment and aim for 85%+ score</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
