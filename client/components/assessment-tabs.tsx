"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, FileText } from "lucide-react"
import { CreateAssessmentModal } from "./create-assessment-modal"

export function AssessmentTabs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Tabs and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <Tabs defaultValue="my-assessments" className="w-full lg:w-auto">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="my-assessments" className="px-6">
              My Assessment
            </TabsTrigger>
            <TabsTrigger value="talent-pulse" className="px-6">
              Talent Pulse Assessment
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 lg:ml-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>

          {/* Create Button */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <Tabs defaultValue="my-assessments" className="w-full">
        <TabsContent value="my-assessments" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No assessments yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Get started by creating your first assessment. You can build custom tests with AI-generated questions.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Assessment
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="talent-pulse" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No assessments yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Get started by creating your first assessment. You can build custom tests with AI-generated questions.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Assessment
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      <CreateAssessmentModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  )
}
