"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Crown,
  Shield,
  User,
  Users,
  Building2,
  FileText,
  UserCheck,
  CreditCard,
  Eye,
  Edit3,
  Trash2,
  Settings,
  Save,
  RotateCcw,
} from "lucide-react"

interface Permission {
  id: string
  name: string
  description: string
  icon: any
  category: string
}

interface Role {
  id: string
  name: string
  description: string
  icon: any
  color: string
  permissions: Record<string, { view: boolean; edit: boolean; delete: boolean }>
  isCustom?: boolean
}

const organizationPermissions: Permission[] = [
  {
    id: "org_settings",
    name: "Organization Settings",
    description: "Manage organization configuration and preferences",
    icon: Building2,
    category: "Organization",
  },
  {
    id: "org_members",
    name: "Organization Members",
    description: "Invite, manage, and remove organization members",
    icon: Users,
    category: "Organization",
  },
  {
    id: "assessments",
    name: "Assessment and Libraries",
    description: "Create, edit, and manage assessments and question libraries",
    icon: FileText,
    category: "Content",
  },
  {
    id: "candidates",
    name: "Candidates and Reports",
    description: "View candidate results and generate reports",
    icon: UserCheck,
    category: "Content",
  },
  {
    id: "billing",
    name: "Usage and Billing",
    description: "Access billing information and usage analytics",
    icon: CreditCard,
    category: "Administration",
  },
]

const teamPermissions: Permission[] = [
  {
    id: "team_settings",
    name: "Team Settings",
    description: "Configure team settings and preferences",
    icon: Settings,
    category: "Team",
  },
  {
    id: "team_members",
    name: "Team Members",
    description: "Add, remove, and manage team members",
    icon: Users,
    category: "Team",
  },
]

export function RolesPermissionsSection() {
  const [activeTab, setActiveTab] = useState("organization")
  const [hasChanges, setHasChanges] = useState(false)

  const [organizationRoles, setOrganizationRoles] = useState<Role[]>([
    {
      id: "owner",
      name: "Owner",
      description: "Full access to all organization features and settings",
      icon: Crown,
      color: "text-yellow-600",
      permissions: {
        org_settings: { view: true, edit: true, delete: true },
        org_members: { view: true, edit: true, delete: true },
        assessments: { view: true, edit: true, delete: true },
        candidates: { view: true, edit: true, delete: true },
        billing: { view: true, edit: true, delete: true },
      },
    },
    {
      id: "admin",
      name: "Admin",
      description: "Administrative access with limited billing permissions",
      icon: Shield,
      color: "text-blue-600",
      permissions: {
        org_settings: { view: true, edit: false, delete: false },
        org_members: { view: true, edit: true, delete: true },
        assessments: { view: true, edit: true, delete: true },
        candidates: { view: true, edit: true, delete: true },
        billing: { view: true, edit: false, delete: false },
      },
    },
    {
      id: "interviewer",
      name: "Interviewer",
      description: "Can conduct interviews and view candidate reports",
      icon: UserCheck,
      color: "text-green-600",
      permissions: {
        org_settings: { view: true, edit: false, delete: false },
        org_members: { view: true, edit: false, delete: false },
        assessments: { view: true, edit: true, delete: true },
        candidates: { view: true, edit: true, delete: false },
        billing: { view: false, edit: false, delete: false },
      },
    },
    {
      id: "recruiter",
      name: "Recruiter",
      description: "Can manage candidates and view basic reports",
      icon: User,
      color: "text-purple-600",
      permissions: {
        org_settings: { view: true, edit: false, delete: false },
        org_members: { view: true, edit: false, delete: false },
        assessments: { view: true, edit: false, delete: false },
        candidates: { view: true, edit: true, delete: false },
        billing: { view: false, edit: false, delete: false },
      },
    },
    {
      id: "member",
      name: "Member",
      description: "Basic access to view assessments and candidates",
      icon: User,
      color: "text-gray-600",
      permissions: {
        org_settings: { view: true, edit: false, delete: false },
        org_members: { view: true, edit: false, delete: false },
        assessments: { view: true, edit: false, delete: false },
        candidates: { view: true, edit: false, delete: false },
        billing: { view: false, edit: false, delete: false },
      },
    },
  ])

  const [teamRoles, setTeamRoles] = useState<Role[]>([
    {
      id: "team_admin",
      name: "Admin",
      description: "Full access to team settings and members",
      icon: Shield,
      color: "text-blue-600",
      permissions: {
        team_settings: { view: true, edit: true, delete: true },
        team_members: { view: true, edit: true, delete: true },
      },
    },
    {
      id: "team_member",
      name: "Member",
      description: "Basic team access with limited permissions",
      icon: User,
      color: "text-gray-600",
      permissions: {
        team_settings: { view: true, edit: false, delete: false },
        team_members: { view: true, edit: false, delete: false },
      },
    },
  ])

  const updatePermission = (
    roleId: string,
    permissionId: string,
    action: "view" | "edit" | "delete",
    value: boolean,
    isTeamRole = false,
  ) => {
    setHasChanges(true)

    if (isTeamRole) {
      setTeamRoles((prev) =>
        prev.map((role) =>
          role.id === roleId
            ? {
                ...role,
                permissions: {
                  ...role.permissions,
                  [permissionId]: {
                    ...role.permissions[permissionId],
                    [action]: value,
                  },
                },
              }
            : role,
        ),
      )
    } else {
      setOrganizationRoles((prev) =>
        prev.map((role) =>
          role.id === roleId
            ? {
                ...role,
                permissions: {
                  ...role.permissions,
                  [permissionId]: {
                    ...role.permissions[permissionId],
                    [action]: value,
                  },
                },
              }
            : role,
        ),
      )
    }
  }

  const saveChanges = () => {
    setHasChanges(false)
    // Here you would typically save to backend
    console.log("Saving changes...")
  }

  const resetChanges = () => {
    setHasChanges(false)
    // Reset to original state
    console.log("Resetting changes...")
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Roles & Permissions</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure user roles and manage access permissions across your organization and teams.
          </p>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex space-x-3 animate-in fade-in slide-in-from-right-4 duration-300">
            <Button variant="outline" onClick={resetChanges} className="bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={saveChanges} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Roles & Permissions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="organization"
            className="flex items-center space-x-2 p-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Building2 className="h-4 w-4" />
            <span className="font-medium">Organization Roles</span>
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex items-center space-x-2 p-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            <span className="font-medium">Team Roles</span>
          </TabsTrigger>
        </TabsList>

        {/* Organization Roles Tab */}
        <TabsContent value="organization" className="mt-8">
          <PermissionsMatrix
            roles={organizationRoles}
            permissions={organizationPermissions}
            onPermissionChange={(roleId, permissionId, action, value) =>
              updatePermission(roleId, permissionId, action, value, false)
            }
          />
        </TabsContent>

        {/* Team Roles Tab */}
        <TabsContent value="team" className="mt-8">
          <PermissionsMatrix
            roles={teamRoles}
            permissions={teamPermissions}
            onPermissionChange={(roleId, permissionId, action, value) =>
              updatePermission(roleId, permissionId, action, value, true)
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PermissionsMatrixProps {
  roles: Role[]
  permissions: Permission[]
  onPermissionChange: (roleId: string, permissionId: string, action: "view" | "edit" | "delete", value: boolean) => void
}

function PermissionsMatrix({ roles, permissions, onPermissionChange }: PermissionsMatrixProps) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold">Permission Matrix</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 p-6 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">Roles / Permissions</h3>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">View</span>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Edit3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Edit</span>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Delete</span>
                </div>
              </div>
            </div>

            {/* Roles and Permissions */}
            {roles.map((role, roleIndex) => (
              <div
                key={role.id}
                className="animate-in fade-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${roleIndex * 100}ms` }}
              >
                {/* Role Header */}
                <div className="grid grid-cols-12 gap-4 p-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                  <div className="col-span-12">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}
                      >
                        <role.icon className={`h-5 w-5 ${role.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{role.name}</h4>
                          {role.isCustom && (
                            <Badge variant="outline" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions for this role */}
                {permissions.map((permission, permIndex) => (
                  <div
                    key={permission.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700/50"
                  >
                    <div className="col-span-6 flex items-center space-x-3 pl-4">
                      <permission.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{permission.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{permission.description}</p>
                      </div>
                    </div>

                    {/* View Permission */}
                    <div className="col-span-2 flex justify-center items-center">
                      <Switch
                        checked={role.permissions[permission.id]?.view || false}
                        onCheckedChange={(checked) => onPermissionChange(role.id, permission.id, "view", checked)}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </div>

                    {/* Edit Permission */}
                    <div className="col-span-2 flex justify-center items-center">
                      <Switch
                        checked={role.permissions[permission.id]?.edit || false}
                        onCheckedChange={(checked) => onPermissionChange(role.id, permission.id, "edit", checked)}
                        className="data-[state=checked]:bg-blue-600"
                        disabled={!role.permissions[permission.id]?.view}
                      />
                    </div>

                    {/* Delete Permission */}
                    <div className="col-span-2 flex justify-center items-center">
                      <Switch
                        checked={role.permissions[permission.id]?.delete || false}
                        onCheckedChange={(checked) => onPermissionChange(role.id, permission.id, "delete", checked)}
                        className="data-[state=checked]:bg-red-600"
                        disabled={!role.permissions[permission.id]?.view}
                      />
                    </div>
                  </div>
                ))}

                {roleIndex < roles.length - 1 && <Separator className="my-0" />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
