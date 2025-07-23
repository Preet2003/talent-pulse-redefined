"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Shield, CreditCard, Puzzle, Upload, Trash2, Plus, Camera, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { TeamManagementSection } from "./team-management-section"
import { RolesPermissionsSection } from "./roles-permissions-section"

export function SettingsContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("organization")

  const settingsTabs = [
    {
      id: "organization",
      label: "Organization Management",
      icon: Building2,
    },
    {
      id: "team",
      label: "Team Management",
      icon: Users,
    },
    {
      id: "roles",
      label: "Roles & Permissions",
      icon: Shield,
    },
    {
      id: "billing",
      label: "Billing & Plans",
      icon: CreditCard,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Puzzle,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Settings Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your organization, team, and account preferences.</p>
      </div>

      {/* Settings Tabs */}
      <div className="animate-in fade-in slide-in-from-top-6 duration-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-gray-100 dark:bg-gray-800">
            {settingsTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Organization Management Tab */}
          <TabsContent value="organization" className="space-y-6 mt-8">
            <OrganizationSection user={user} />
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="mt-8">
            <TeamManagementSection />
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="mt-8">
            <RolesPermissionsSection />
          </TabsContent>

          {/* Other Tabs - Placeholder Content */}
          <TabsContent value="billing" className="mt-8">
            <PlaceholderSection
              title="Billing & Plans"
              description="Manage your subscription and billing information."
              icon={CreditCard}
            />
          </TabsContent>

          <TabsContent value="integrations" className="mt-8">
            <PlaceholderSection
              title="Integrations"
              description="Connect with third-party tools and services."
              icon={Puzzle}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function OrganizationSection({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Organization Info Card */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">Organization Details</span>
            <Button
              variant="outline"
              className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 bg-transparent"
            >
              Switch Organization
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Info */}
          <div className="flex items-start space-x-6">
            {/* Logo/Avatar */}
            <div className="relative group">
              <Avatar className="w-20 h-20 border-4 border-gray-100 dark:border-gray-700 shadow-lg">
                <AvatarImage src="/placeholder.svg" alt="Organization Logo" />
                <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                  {user?.organization?.charAt(0) || "O"}
                </AvatarFallback>
              </Avatar>

              {/* Logo Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Logo
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                    <X className="mr-2 h-4 w-4" />
                    Remove Logo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Organization Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.organization || "Your Organization"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  talentpulse.com/{(user?.organization || "your-org").toLowerCase().replace(/\s+/g, "-")}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                >
                  Active
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
                >
                  Pro Plan
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Members Card */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">Organization Members</span>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Empty State */}
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No members added yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start building your team by inviting members to your organization. They'll be able to create and manage
              assessments.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Invite Your First Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-red-700 dark:text-red-400 flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Delete Organization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Permanently delete this organization and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-red-600/30 shrink-0"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Organization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PlaceholderSection({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {description} This section will be available in a future update.
        </p>
      </CardContent>
    </Card>
  )
}
