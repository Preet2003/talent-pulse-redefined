"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Search, BarChart3, Trophy, Calendar, BookOpen, User, Bell, Menu } from "lucide-react"

interface CandidateSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  pendingAssessments?: number
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "assessments",
    label: "Assessments",
    icon: Search,
    badge: "pending",
  },
  {
    id: "results",
    label: "Results & Analytics",
    icon: BarChart3,
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: Trophy,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: Calendar,
  },
  {
    id: "library",
    label: "Practice Library",
    icon: BookOpen,
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    badge: "notifications",
  },
]

export function CandidateSidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  pendingAssessments = 3,
}: CandidateSidebarProps) {
  const getBadgeCount = (item: any) => {
    if (item.badge === "pending") return pendingAssessments
    if (item.badge === "notifications") return 2
    return 0
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out relative flex flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "p-6 border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
          isCollapsed && "px-4",
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">TP</span>
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            <span className="text-xl font-bold whitespace-nowrap text-gray-900 dark:text-white">TalentPulse</span>
            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Candidate Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 transition-all duration-300", isCollapsed ? "px-2 py-4" : "p-4")}>
        <ul className="space-y-1">
          {navigationItems.map((item, index) => {
            const badgeCount = getBadgeCount(item)
            const isActive = activeTab === item.id

            return (
              <li
                key={item.id}
                className="transform transition-all duration-200 ease-in-out"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out group relative",
                    isActive &&
                      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/70 hover:text-blue-800 dark:hover:text-blue-300 border-r-2 border-blue-600",
                    isCollapsed ? "px-3 justify-center" : "px-4",
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200 group-hover:scale-105",
                      !isCollapsed && "mr-3",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400",
                    )}
                  />
                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-between flex-1",
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                    )}
                  >
                    <span className="whitespace-nowrap font-medium">{item.label}</span>
                    {badgeCount > 0 && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-2 h-5 min-w-5 text-xs px-1.5",
                          isActive
                            ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                        )}
                      >
                        {badgeCount}
                      </Badge>
                    )}
                  </div>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>{item.label}</span>
                        {badgeCount > 0 && (
                          <Badge variant="secondary" className="h-4 min-w-4 text-xs px-1">
                            {badgeCount}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 border-l border-b border-gray-700 dark:border-gray-600"></div>
                    </div>
                  )}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div
        className={cn(
          "border-t border-gray-200 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "p-2" : "p-4",
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={cn(
            "w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group",
            isCollapsed ? "justify-center px-2" : "justify-start px-3",
          )}
        >
          <Menu
            className={cn(
              "h-4 w-4 transition-all duration-300 group-hover:scale-105",
              isCollapsed ? "rotate-0" : "rotate-90",
            )}
          />
          <div
            className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-2",
            )}
          >
            <span className="whitespace-nowrap text-sm font-medium">Collapse</span>
          </div>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
              Expand
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 border-l border-b border-gray-700 dark:border-gray-600"></div>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
