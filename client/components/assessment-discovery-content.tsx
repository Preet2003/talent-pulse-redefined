"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PreAssessmentFlow } from "@/components/pre-assessment-flow"
import {
  Search,
  QrCode,
  Mail,
  Link,
  Clock,
  Users,
  Star,
  Eye,
  Play,
  BookOpen,
  Code,
  Brain,
  Briefcase,
  Globe,
  Award,
  Calendar,
  Timer,
  Target,
  TrendingUp,
  CheckCircle,
  Camera,
} from "lucide-react"

export function AssessmentDiscoveryContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [invitationCode, setInvitationCode] = useState("")
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [showPreAssessment, setShowPreAssessment] = useState(false)

  // Mock data for assessments
  const invitedAssessments = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      company: "TechCorp Inc.",
      description: "Comprehensive assessment covering ES6+, async programming, and modern JavaScript concepts.",
      duration: 45,
      questions: 25,
      difficulty: "Intermediate",
      category: "Programming",
      invitedBy: "john.doe@techcorp.com",
      expiresAt: "2024-01-15",
      status: "pending",
      estimatedTime: "45 minutes",
      passingScore: 70,
      attempts: 1,
      proctored: true,
    },
    {
      id: 2,
      title: "React Development Skills",
      company: "StartupXYZ",
      description: "Advanced React assessment including hooks, context, performance optimization, and testing.",
      duration: 60,
      questions: 30,
      difficulty: "Advanced",
      category: "Frontend",
      invitedBy: "hr@startupxyz.com",
      expiresAt: "2024-01-20",
      status: "scheduled",
      estimatedTime: "60 minutes",
      passingScore: 75,
      attempts: 2,
      proctored: true,
    },
    {
      id: 3,
      title: "Problem Solving & Logic",
      company: "Global Solutions",
      description: "Test your analytical thinking and problem-solving abilities with real-world scenarios.",
      duration: 30,
      questions: 20,
      difficulty: "Beginner",
      category: "Logic",
      invitedBy: "talent@globalsolutions.com",
      expiresAt: "2024-01-25",
      status: "available",
      estimatedTime: "30 minutes",
      passingScore: 65,
      attempts: 3,
      proctored: false,
    },
  ]

  const publicAssessments = [
    {
      id: 4,
      title: "Python Programming Basics",
      provider: "CodeAcademy Pro",
      description: "Learn and test your Python fundamentals including data structures, functions, and OOP.",
      duration: 40,
      questions: 22,
      difficulty: "Beginner",
      category: "Programming",
      rating: 4.8,
      completions: 15420,
      certificate: true,
      free: true,
      passingScore: 70,
      attempts: 3,
      proctored: false,
    },
    {
      id: 5,
      title: "Data Structures & Algorithms",
      provider: "TechSkill Institute",
      description: "Comprehensive assessment of DSA concepts including arrays, trees, graphs, and sorting.",
      duration: 90,
      questions: 40,
      difficulty: "Advanced",
      category: "Computer Science",
      rating: 4.9,
      completions: 8750,
      certificate: true,
      free: false,
      passingScore: 80,
      attempts: 2,
      proctored: true,
    },
    {
      id: 6,
      title: "UI/UX Design Principles",
      provider: "Design Masters",
      description: "Test your understanding of user experience design, wireframing, and design systems.",
      duration: 35,
      questions: 18,
      difficulty: "Intermediate",
      category: "Design",
      rating: 4.7,
      completions: 12300,
      certificate: true,
      free: true,
      passingScore: 75,
      attempts: 2,
      proctored: false,
    },
  ]

  const categories = [
    { id: "all", label: "All Categories", icon: Globe },
    { id: "programming", label: "Programming", icon: Code },
    { id: "frontend", label: "Frontend", icon: Globe },
    { id: "backend", label: "Backend", icon: Briefcase },
    { id: "design", label: "Design", icon: Star },
    { id: "logic", label: "Logic & Reasoning", icon: Brain },
    { id: "computer-science", label: "Computer Science", icon: BookOpen },
  ]

  const difficulties = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
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
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleInvitationCodeSubmit = () => {
    if (invitationCode.trim()) {
      console.log("Processing invitation code:", invitationCode)
    }
  }

  const handleQrScan = () => {
    setIsQrScannerOpen(true)
    console.log("Opening QR scanner...")
  }

  const handleStartAssessment = (assessment: any) => {
    setSelectedAssessment(assessment)
    setShowPreAssessment(true)
  }

  const handleAssessmentStart = () => {
    console.log("Starting assessment:", selectedAssessment)
    // Navigate to assessment taking interface
  }

  const handleAssessmentCancel = () => {
    setShowPreAssessment(false)
    setSelectedAssessment(null)
  }

  const filteredPublicAssessments = publicAssessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || assessment.category.toLowerCase().includes(selectedCategory)
    const matchesDifficulty = selectedDifficulty === "all" || assessment.difficulty.toLowerCase() === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  if (showPreAssessment && selectedAssessment) {
    return (
      <PreAssessmentFlow
        assessment={{
          ...selectedAssessment,
          company: selectedAssessment.company || selectedAssessment.provider,
        }}
        onStart={handleAssessmentStart}
        onCancel={handleAssessmentCancel}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assessment Discovery</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Find and access assessments through invitations or explore our public library
          </p>
        </div>
      </div>

      <Tabs defaultValue="invitations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invitations" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Invitations</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center space-x-2">
            <QrCode className="h-4 w-4" />
            <span>Quick Access</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Public Library</span>
          </TabsTrigger>
        </TabsList>

        {/* Invitations Tab */}
        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Assessment Invitations</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {invitedAssessments.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {invitedAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{assessment.title}</h3>
                          <Badge className={getDifficultyColor(assessment.difficulty)}>{assessment.difficulty}</Badge>
                          <Badge className={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                          {assessment.proctored && (
                            <Badge variant="outline" className="border-orange-300 text-orange-700">
                              <Camera className="h-3 w-3 mr-1" />
                              Proctored
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{assessment.company}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{assessment.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Timer className="h-4 w-4" />
                            <span>{assessment.duration} minutes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{assessment.questions} questions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>{assessment.passingScore}% to pass</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Expires: {assessment.expiresAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAssessment(assessment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedAssessment?.title}</DialogTitle>
                            </DialogHeader>
                            {selectedAssessment && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Company</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {selectedAssessment.company}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Invited By</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {selectedAssessment.invitedBy}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {selectedAssessment.duration} minutes
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Questions</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {selectedAssessment.questions} questions
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Passing Score</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {selectedAssessment.passingScore}%
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Attempts Allowed</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {selectedAssessment.attempts}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Description</Label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {selectedAssessment.description}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2 pt-4">
                                  <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleStartAssessment(selectedAssessment)}
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Assessment
                                  </Button>
                                  <Button variant="outline">Schedule Later</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStartAssessment(assessment)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Access Tab */}
        <TabsContent value="access" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Invitation Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="h-5 w-5 text-blue-600" />
                  <span>Invitation Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter the invitation code you received via email or direct link
                </p>
                <div className="space-y-3">
                  <Label htmlFor="invitation-code">Invitation Code</Label>
                  <Input
                    id="invitation-code"
                    placeholder="Enter invitation code (e.g., ABC123XYZ)"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    className="font-mono"
                  />
                  <Button onClick={handleInvitationCodeSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Access Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  <span>QR Code Scanner</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scan a QR code to quickly access an assessment
                </p>
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-12 w-12 text-gray-400" />
                  </div>
                  <Button onClick={handleQrScan} variant="outline" className="w-full bg-transparent">
                    <Camera className="mr-2 h-4 w-4" />
                    Open QR Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Recent Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">JavaScript Fundamentals</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Accessed via code: ABC123XYZ</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Access Again
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">React Development Skills</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Accessed via QR code</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Access Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Public Library Tab */}
        <TabsContent value="library" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search assessments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.id} value={difficulty.id}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublicAssessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{assessment.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.provider}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{assessment.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{assessment.description}</p>

                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(assessment.difficulty)}>{assessment.difficulty}</Badge>
                    {assessment.certificate && (
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        <Award className="h-3 w-3 mr-1" />
                        Certificate
                      </Badge>
                    )}
                    {assessment.free && (
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        Free
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Timer className="h-4 w-4" />
                      <span>{assessment.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{assessment.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{assessment.completions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{assessment.category}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{assessment.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Provider</Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.provider}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Rating</Label>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm">{assessment.rating}</span>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Duration</Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.duration} minutes</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Questions</Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {assessment.questions} questions
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Completions</Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {assessment.completions.toLocaleString()} candidates
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Certificate</Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {assessment.certificate ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assessment.description}</p>
                          </div>
                          <div className="flex items-center space-x-2 pt-4">
                            <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleStartAssessment(assessment)}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Start Assessment
                            </Button>
                            <Button variant="outline">Add to Favorites</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStartAssessment(assessment)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPublicAssessments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assessments found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or browse different categories
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
