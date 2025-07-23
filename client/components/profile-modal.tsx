"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  User,
  Shield,
  Settings,
  Eye,
  Camera,
  Upload,
  X,
  Edit3,
  Save,
  Link2Icon as Eye2,
  EyeOff,
  Copy,
  Smartphone,
  Monitor,
  Trash2,
  Download,
  Globe,
  Users,
  Lock,
  Sun,
  Moon,
  Laptop,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: string
}

export function ProfileModal({ open, onOpenChange, defaultTab = "personal" }: ProfileModalProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    jobTitle: "Senior Administrator",
    department: "IT Operations",
    bio: "Experienced administrator with a passion for streamlining processes and improving team efficiency.",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    assessmentReminders: true,
    weeklyReports: false,
    language: "en",
    timezone: "America/Los_Angeles",
    theme: "system",
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "organization",
    showActivityStatus: true,
    allowDataCollection: true,
  })

  // Update active tab when defaultTab changes
  useState(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false)
    // Show success toast
  }

  const generateRecoveryCodes = () => {
    const codes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 8).toUpperCase())
    setRecoveryCodes(codes)
    setShowRecoveryCodes(true)
  }

  const copyRecoveryCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // Show success toast
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const activeSessions = [
    {
      id: 1,
      device: "MacBook Pro",
      location: "San Francisco, CA",
      lastActive: "Current session",
      isCurrent: true,
    },
    {
      id: 2,
      device: "iPhone 14",
      location: "San Francisco, CA",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: 3,
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "1 day ago",
      isCurrent: false,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold">Profile Settings</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 py-2 border-b bg-muted/30">
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="personal" className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal Info</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                  <span className="sm:hidden">Security</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center space-x-2 text-sm">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                  <span className="sm:hidden">Prefs</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center space-x-2 text-sm">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                  <span className="sm:hidden">Privacy</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                {/* Personal Info Tab */}
                <TabsContent value="personal" className="mt-0 space-y-6">
                  {/* Profile Header */}
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative group">
                          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                            <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                              {getInitials(formData.name)}
                            </AvatarFallback>
                          </Avatar>
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
                                Upload Photo
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <X className="mr-2 h-4 w-4" />
                                Remove Photo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.name}</h3>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              Administrator
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{formData.jobTitle}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{formData.department}</p>
                        </div>

                        <Button
                          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        >
                          {isEditing ? (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          ) : (
                            <>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit Profile
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Information */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            disabled={!isEditing}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            disabled={!isEditing}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            disabled={!isEditing}
                            className="h-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          disabled={!isEditing}
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-0 space-y-6">
                  {/* Change Password */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            className="h-11 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              className="h-11 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              className="h-11 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Password</Button>
                    </CardContent>
                  </Card>

                  {/* Two-Factor Authentication */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Two-Factor Authentication
                        <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                          {twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable 2FA</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                      </div>
                      {twoFactorEnabled && (
                        <div className="space-y-4 pt-4 border-t">
                          <Button variant="outline" onClick={generateRecoveryCodes} className="w-full bg-transparent">
                            Generate Recovery Codes
                          </Button>
                          {showRecoveryCodes && recoveryCodes.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Recovery Codes:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {recoveryCodes.map((code, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono"
                                  >
                                    <span>{code}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyRecoveryCode(code)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Active Sessions */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activeSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              {session.device.includes("iPhone") ? (
                                <Smartphone className="h-5 w-5" />
                              ) : (
                                <Monitor className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{session.device}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {session.location} • {session.lastActive}
                              </p>
                            </div>
                          </div>
                          {session.isCurrent ? (
                            <Badge variant="default">Current</Badge>
                          ) : (
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="mt-0 space-y-6">
                  {/* Notification Preferences */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive email notifications for important updates
                          </p>
                        </div>
                        <Switch
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Assessment Reminders</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get reminded about pending assessments
                          </p>
                        </div>
                        <Switch
                          checked={preferences.assessmentReminders}
                          onCheckedChange={(checked) =>
                            setPreferences({ ...preferences, assessmentReminders: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weekly Reports</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive weekly performance reports</p>
                        </div>
                        <Switch
                          checked={preferences.weeklyReports}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyReports: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Regional Settings */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Regional Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select
                            value={preferences.language}
                            onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select
                            value={preferences.timezone}
                            onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="Europe/London">GMT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Theme Settings */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Theme Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Label>Choose your theme</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { value: "light", label: "Light", icon: Sun },
                            { value: "dark", label: "Dark", icon: Moon },
                            { value: "system", label: "System", icon: Laptop },
                          ].map((theme) => (
                            <Button
                              key={theme.value}
                              variant={preferences.theme === theme.value ? "default" : "outline"}
                              className="h-20 flex flex-col space-y-2"
                              onClick={() => setPreferences({ ...preferences, theme: theme.value })}
                            >
                              <theme.icon className="h-6 w-6" />
                              <span>{theme.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="mt-0 space-y-6">
                  {/* Profile Visibility */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Profile Visibility</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Who can see your profile?</Label>
                        <Select
                          value={privacy.profileVisibility}
                          onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>Public - Anyone can see</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="organization">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Organization - Only organization members</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="team">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Team - Only team members</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center space-x-2">
                                <Lock className="h-4 w-4" />
                                <span>Private - Only you</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Settings */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Activity Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Activity Status</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Let others see when you're online</p>
                        </div>
                        <Switch
                          checked={privacy.showActivityStatus}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, showActivityStatus: checked })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow Data Collection</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Help us improve by sharing usage data
                          </p>
                        </div>
                        <Switch
                          checked={privacy.allowDataCollection}
                          onCheckedChange={(checked) => setPrivacy({ ...privacy, allowDataCollection: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Management */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                          <p className="font-medium">Export Your Data</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Download a copy of all your data</p>
                        </div>
                        <Button variant="outline" className="shrink-0 bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          Export Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-red-700 dark:text-red-400 flex items-center space-x-2">
                        <Trash2 className="h-5 w-5" />
                        <span>Danger Zone</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <Button variant="destructive" className="shrink-0">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
