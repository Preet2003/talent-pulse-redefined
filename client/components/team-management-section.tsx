"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Plus,
  X,
  MoreHorizontal,
  Edit3,
  Trash2,
  UserPlus,
  Crown,
  Shield,
  User,
  Search,
  Filter,
} from "lucide-react"

interface Team {
  id: string
  name: string
  description?: string
  memberCount: number
  createdAt: string
  role: "owner" | "admin" | "member"
  members: TeamMember[]
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  avatar?: string
  joinedAt: string
}

export function TeamManagementSection() {
  const [isCreating, setIsCreating] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Engineering Team",
      description: "Core development and technical operations",
      memberCount: 8,
      createdAt: "2024-01-15",
      role: "owner",
      members: [
        {
          id: "1",
          name: "John Doe",
          email: "john@company.com",
          role: "admin",
          joinedAt: "2024-01-15",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@company.com",
          role: "member",
          joinedAt: "2024-01-20",
        },
      ],
    },
    {
      id: "2",
      name: "HR & Recruitment",
      description: "Talent acquisition and human resources",
      memberCount: 4,
      createdAt: "2024-01-20",
      role: "admin",
      members: [
        {
          id: "3",
          name: "Sarah Wilson",
          email: "sarah@company.com",
          role: "admin",
          joinedAt: "2024-01-20",
        },
      ],
    },
  ])

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        memberCount: 1,
        createdAt: new Date().toISOString().split("T")[0],
        role: "owner",
        members: [],
      }
      setTeams([...teams, newTeam])
      setNewTeamName("")
      setIsCreating(false)
    }
  }

  const handleCancelCreate = () => {
    setNewTeamName("")
    setIsCreating(false)
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      owner:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      admin: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      member: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    }

    return (
      <Badge variant="outline" className={`${styles[role as keyof typeof styles]} capitalize`}>
        {getRoleIcon(role)}
        <span className="ml-1">{role}</span>
      </Badge>
    )
  }

  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Team Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage teams to organize your organization members effectively.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Button variant="outline" className="bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Create New Team Section */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <span>Create New Team</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isCreating ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to create a new team?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Teams help you organize members and manage permissions more effectively across your organization.
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 group"
              >
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                Create Team
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="team-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Team Name
                </Label>
                <Input
                  id="team-name"
                  placeholder="Enter team name (e.g., Marketing Team, Development Team)"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateTeam()
                    if (e.key === "Escape") handleCancelCreate()
                  }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose a descriptive name that reflects the team's purpose or department.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleCancelCreate}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 bg-transparent"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teams List */}
      {filteredTeams.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Teams ({filteredTeams.length})</h3>
          </div>

          <div className="grid gap-6">
            {filteredTeams.map((team, index) => (
              <Card
                key={team.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h4>
                          {getRoleBadge(team.role)}
                        </div>
                        {team.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{team.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {team.memberCount} members
                          </span>
                          <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Members
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Team
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Team Members Preview */}
                  {team.members.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Members</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        >
                          View All
                        </Button>
                      </div>
                      <div className="flex items-center space-x-3">
                        {team.members.slice(0, 3).map((member) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8 border-2 border-white dark:border-gray-800 shadow-sm">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                            </div>
                          </div>
                        ))}
                        {team.members.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              +{team.members.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for No Teams */}
      {filteredTeams.length === 0 && searchQuery && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No teams found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              No teams match your search criteria. Try adjusting your search terms or create a new team.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
