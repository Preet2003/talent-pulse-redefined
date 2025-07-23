"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { StatsCards } from "@/components/stats-cards"
import { LibraryStatsCards } from "@/components/library-stats-cards"
import { AssessmentTabs } from "@/components/assessment-tabs"
import { SettingsContent } from "@/components/settings-content"
import { LibraryManagementSection } from "@/components/library-management-section"

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("assessment")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/")
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-0" : "ml-0",
        )}
      >
        {/* Header */}
        <AdminHeader onSettingsClick={() => setActiveTab('settings')} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your assessments and track candidate performance from your dashboard.
              </p>
            </div>

            {/* Conditional Stats Cards */}
            {activeTab === "assessment" && (
              <div className="animate-in fade-in slide-in-from-top-6 duration-700">
                <StatsCards />
              </div>
            )}

            {activeTab === "libraries" && (
              <div className="animate-in fade-in slide-in-from-top-6 duration-700">
                <LibraryStatsCards />
              </div>
            )}

            {/* Content Sections */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              {activeTab === "assessment" && <AssessmentTabs />}

              {activeTab === "libraries" && <LibraryManagementSection />}

              {activeTab === "settings" && <SettingsContent />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
