"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  BookOpen,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Globe,
  Lock,
  Target,
  FileText,
  Calendar,
  User,
} from "lucide-react"
import { CreateLibraryModal } from "./create-library-modal"

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
  skillAreas: any[]
  totalQuestions: number
  createdAt: string
}

export function LibraryManagementSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [libraries, setLibraries] = useState<Library[]>([])

  const handleLibraryCreated = (newLibrary: Library) => {
    setLibraries((prev) => [newLibrary, ...prev])
  }

  const filteredLibraries = libraries.filter(
    (library) =>
      library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.domain.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  return (
    <div className="space-y-6">
      {/* Tabs and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <Tabs defaultValue="my-library" className="w-full lg:w-auto">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="my-library" className="px-6">
              My Library ({libraries.length})
            </TabsTrigger>
            <TabsTrigger value="talent-pulse-library" className="px-6">
              Talent Pulse Library
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 lg:ml-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or domain"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>

          {/* Filter Button */}
          <Button variant="outline" className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>

          {/* Create Library Button */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Library
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <Tabs defaultValue="my-library" className="w-full">
        <TabsContent value="my-library" className="space-y-4">
          {libraries.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLibraries.map((library) => (
                <Card key={library.id} className="hover:shadow-lg transition-all duration-200 group border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
                            {library.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
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
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Library
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs"
                        >
                          {library.domain}
                        </Badge>
                        <Badge variant="outline" className={`text-xs capitalize ${getLevelColor(library.level)}`}>
                          {library.level}
                        </Badge>
                      </div>

                      {library.topic && (
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{library.topic}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {library.totalQuestions} questions
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {library.skillAreas.length} areas
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{library.summary}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(library.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">You</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No libraries yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Get started by creating your first question library. Organize and reuse questions across multiple
                assessments.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Library
              </Button>
            </div>
          )}

          {searchQuery && filteredLibraries.length === 0 && libraries.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                No libraries match your search criteria. Try adjusting your search terms.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="bg-transparent">
                Clear Search
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="talent-pulse-library" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No libraries available</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Talent Pulse libraries will appear here. These are pre-built question collections created by our experts.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <CreateLibraryModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onLibraryCreated={handleLibraryCreated}
      />
    </div>
  )
}
