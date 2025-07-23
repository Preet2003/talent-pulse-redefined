"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Play,
  Eye,
  Award,
  BookOpen,
  Timer,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AssessmentResultsDashboard } from "./assessment-results-dashboard"

export function CandidateDashboardContent() {
  const { user } = useAuth()
  const [showResults, setShowResults] = useState(false)

  // Mock data - replace with real data from your API
  const stats = {
    pendingAssessments: 3,
    completedTests: 12,
    averageScore: 87,
    certificatesEarned: 5,
    totalSkillPoints: 2450,
    currentStreak: 7,
  }

  const upcomingAssessments = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      company: "TechCorp Inc.",
      scheduledFor: "Today, 2:00 PM",
      duration: "45 minutes",
      difficulty: "Intermediate",
      status: "scheduled",
      timeLeft: "2h 30m",
    },
    {
      id: 2,
      title: "React Development Skills",
      company: "StartupXYZ",
      scheduledFor: "Tomorrow, 10:00 AM",
      duration: "60 minutes",
      difficulty: "Advanced",
      status: "invited",
      timeLeft: "1d 14h",
    },
    {
      id: 3,
      title: "Problem Solving & Logic",
      company: "Global Solutions",
      scheduledFor: "Dec 28, 3:00 PM",
      duration: "30 minutes",
      difficulty: "Beginner",
      status: "pending",
      timeLeft: "3d 5h",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "assessment_completed",
      title: "Completed Python Programming Assessment",
      company: "DataTech Solutions",
      score: 92,
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "certificate_earned",
      title: "Earned JavaScript Certification",
      company: "CodeAcademy Pro",
      time: "1 day ago",
      icon: Award,
      color: "text-yellow-600",
    },
    {
      id: 3,
      type: "invitation_received",
      title: "New Assessment Invitation",
      company: "InnovateLabs",
      time: "2 days ago",
      icon: AlertCircle,
      color: "text-blue-600",
    },
    {
      id: 4,
      type: "skill_improved",
      title: "Algorithm Skills Improved",
      improvement: "+15 points",
      time: "3 days ago",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const skillProgress = [
    { skill: "JavaScript", level: 85, change: "+5" },
    { skill: "React", level: 78, change: "+12" },
    { skill: "Python", level: 92, change: "+3" },
    { skill: "Problem Solving", level: 89, change: "+8" },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "invited":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Handle viewing results
  const handleViewResults = () => {
    setShowResults(true)
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowResults(false)} className="flex items-center gap-2">
            ← Back to Dashboard
          </Button>
        </div>
        <AssessmentResultsDashboard />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name?.split(" ")[0]}! 🚀
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have {stats.pendingAssessments} pending assessments and {stats.completedTests} completed tests. Keep
              up the great work!
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Current Streak: {stats.currentStreak} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">{stats.totalSkillPoints} Skill Points</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Assessments</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingAssessments}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tests</p>
                <p className="text-3xl font-bold text-blue-600">{stats.completedTests}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.averageScore}%</p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</p>
                <p className="text-3xl font-bold text-purple-600">{stats.certificatesEarned}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assessments */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Upcoming Assessments</span>
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{assessment.title}</h4>
                        <Badge className={getDifficultyColor(assessment.difficulty)}>{assessment.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{assessment.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{assessment.scheduledFor}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Timer className="h-4 w-4" />
                          <span>{assessment.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                      <div className="text-sm font-medium text-orange-600">{assessment.timeLeft}</div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Skill Progress */}
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Skill Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillProgress.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 font-medium">{skill.change}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                    </div>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {activity.company && <p className="text-sm text-gray-600 dark:text-gray-400">{activity.company}</p>}
                    {activity.score && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        Score: {activity.score}%
                      </Badge>
                    )}
                    {activity.improvement && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      >
                        {activity.improvement}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Start Assessment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Begin your next scheduled assessment</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Eye className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Check your latest assessment results</p>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleViewResults}>
              View Results
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Practice</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Improve your skills with practice tests</p>
            <Button variant="outline" className="w-full bg-transparent">
              Start Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
