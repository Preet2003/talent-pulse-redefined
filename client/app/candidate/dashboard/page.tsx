"use client"

import { useState } from "react"
import { CandidateSidebar } from "@/components/candidate-sidebar"
import { CandidateHeader } from "@/components/candidate-header"
import { CandidateDashboardContent } from "@/components/candidate-dashboard-content"
import { AssessmentDiscoveryContent } from "@/components/assessment-discovery-content"
import { AssessmentResultsDashboard } from "@/components/assessment-results-dashboard"
import { CertificatesDashboard } from "@/components/certificates-dashboard"
import { ScheduleDashboard } from "@/components/schedule-dashboard"
import { PracticeLibraryDashboard } from "@/components/practice-library-dashboard"
import { ProfileDashboard } from "@/components/profile-dashboard"
import { NotificationsDashboard } from "@/components/notifications-dashboard"

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <CandidateDashboardContent />
      case "assessments":
        return <AssessmentDiscoveryContent />
      case "results":
        return <AssessmentResultsDashboard />
      case "certificates":
        return <CertificatesDashboard />
      case "schedule":
        return <ScheduleDashboard />
      case "library":
        return <PracticeLibraryDashboard />
      case "profile":
        return <ProfileDashboard />
      case "notifications":
        return <NotificationsDashboard />
      default:
        return <CandidateDashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <CandidateSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingAssessments={3}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <CandidateHeader />

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
