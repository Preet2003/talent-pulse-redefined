"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Download,
  ExternalLink,
  Search,
  Filter,
  Award,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"

interface Certificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  expiryDate: string
  status: "active" | "expiring" | "expired"
  score: number
  credentialId: string
  skills: string[]
  verificationUrl: string
}

const mockCertificates: Certificate[] = [
  {
    id: "1",
    title: "Advanced JavaScript Development",
    issuer: "TalentPulse",
    issueDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "active",
    score: 92,
    credentialId: "TP-JS-2024-001",
    skills: ["JavaScript", "ES6+", "Async Programming"],
    verificationUrl: "https://verify.talentpulse.com/TP-JS-2024-001",
  },
  {
    id: "2",
    title: "React.js Professional",
    issuer: "TalentPulse",
    issueDate: "2024-02-20",
    expiryDate: "2024-12-20",
    status: "expiring",
    score: 88,
    credentialId: "TP-REACT-2024-002",
    skills: ["React", "Hooks", "State Management"],
    verificationUrl: "https://verify.talentpulse.com/TP-REACT-2024-002",
  },
  {
    id: "3",
    title: "Python Data Analysis",
    issuer: "TalentPulse",
    issueDate: "2023-06-10",
    expiryDate: "2024-06-10",
    status: "expired",
    score: 85,
    credentialId: "TP-PY-2023-003",
    skills: ["Python", "Pandas", "NumPy"],
    verificationUrl: "https://verify.talentpulse.com/TP-PY-2023-003",
  },
]

const achievements = [
  { name: "First Certificate", icon: Trophy, earned: true },
  { name: "High Scorer", icon: Star, earned: true },
  { name: "Quick Learner", icon: CheckCircle, earned: false },
  { name: "Skill Master", icon: Award, earned: false },
]

export function CertificatesDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredCertificates = mockCertificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && cert.status === activeTab
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "expiring":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "expired":
        return <Clock className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "expiring":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificates</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and view your earned certificates</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">88%</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Achievements
          </CardTitle>
          <CardDescription>Your certification milestones and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 border-dashed transition-all ${
                  achievement.earned
                    ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <achievement.icon className={`h-8 w-8 ${achievement.earned ? "text-blue-600" : "text-gray-400"}`} />
                  <span
                    className={`text-sm font-medium ${
                      achievement.earned ? "text-blue-900 dark:text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {achievement.name}
                  </span>
                  {achievement.earned && (
                    <Badge variant="secondary" className="text-xs">
                      Earned
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search certificates or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Certificates Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expiring">Expiring</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6">
            {filteredCertificates.map((certificate) => (
              <Card key={certificate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{certificate.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Issued by {certificate.issuer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(certificate.status)}
                          <Badge className={getStatusColor(certificate.status)}>
                            {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
                          <p className="text-sm font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</p>
                          <p className="text-sm font-medium">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                          <p className="text-sm font-medium">{certificate.score}%</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Skills Covered</p>
                        <div className="flex flex-wrap gap-2">
                          {certificate.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Credential ID</p>
                        <p className="text-sm font-mono">{certificate.credentialId}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                      <Button size="sm" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <ExternalLink className="h-4 w-4" />
                        Verify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCertificates.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No certificates found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? "Try adjusting your search terms" : "Complete assessments to earn certificates"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
