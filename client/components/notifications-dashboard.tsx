"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Check,
  X,
  Settings,
  Mail,
  Smartphone,
  Volume2,
  Clock,
  Award,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "assessment" | "reminder" | "achievement" | "system" | "deadline"
  priority: "high" | "medium" | "low"
  timestamp: string
  read: boolean
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Assessment Reminder",
    message: "Your JavaScript Advanced Assessment is scheduled for tomorrow at 10:00 AM",
    type: "reminder",
    priority: "high",
    timestamp: "2024-01-24T14:30:00Z",
    read: false,
    actionRequired: true,
  },
  {
    id: "2",
    title: "New Certificate Available",
    message: "Congratulations! Your React.js Professional certificate is ready for download",
    type: "achievement",
    priority: "medium",
    timestamp: "2024-01-24T12:15:00Z",
    read: false,
  },
  {
    id: "3",
    title: "Assessment Results",
    message: "Your Python Data Science assessment results are now available",
    type: "assessment",
    priority: "medium",
    timestamp: "2024-01-24T09:45:00Z",
    read: true,
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "Scheduled maintenance on January 26th from 2:00 AM to 4:00 AM EST",
    type: "system",
    priority: "low",
    timestamp: "2024-01-23T16:20:00Z",
    read: true,
  },
  {
    id: "5",
    title: "Deadline Approaching",
    message: "Project submission deadline is in 3 days",
    type: "deadline",
    priority: "high",
    timestamp: "2024-01-23T11:30:00Z",
    read: false,
    actionRequired: true,
  },
]

interface NotificationSettings {
  email: boolean
  push: boolean
  inApp: boolean
  assessmentReminders: boolean
  resultNotifications: boolean
  achievementAlerts: boolean
  systemUpdates: boolean
  marketingEmails: boolean
  soundEnabled: boolean
  quietHours: boolean
  quietStart: string
  quietEnd: string
}

const defaultSettings: NotificationSettings = {
  email: true,
  push: true,
  inApp: true,
  assessmentReminders: true,
  resultNotifications: true,
  achievementAlerts: true,
  systemUpdates: true,
  marketingEmails: false,
  soundEnabled: true,
  quietHours: true,
  quietStart: "22:00",
  quietEnd: "08:00",
}

export function NotificationsDashboard() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [settings, setSettings] = useState(defaultSettings)
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "reminder":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "achievement":
        return <Award className="h-4 w-4 text-yellow-500" />
      case "system":
        return <Info className="h-4 w-4 text-gray-500" />
      case "deadline":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    if (filter === "action") return notification.actionRequired && !notification.read
    return notification.type === filter
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with your assessments and achievements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Action Required</p>
                <p className="text-2xl font-bold text-red-600">{actionRequiredCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({notifications.length})
            </Button>
            <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </Button>
            <Button variant={filter === "action" ? "default" : "outline"} size="sm" onClick={() => setFilter("action")}>
              Action Required ({actionRequiredCount})
            </Button>
            <Button
              variant={filter === "assessment" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("assessment")}
            >
              Assessments
            </Button>
            <Button
              variant={filter === "achievement" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("achievement")}
            >
              Achievements
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          {notification.actionRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                            {notification.priority}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filter === "all" ? "You're all caught up!" : `No ${filter} notifications at the moment`}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="email">Email Notifications</Label>
                  </div>
                  <Switch
                    id="email"
                    checked={settings.email}
                    onCheckedChange={(checked) => setSettings({ ...settings, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="push">Push Notifications</Label>
                  </div>
                  <Switch
                    id="push"
                    checked={settings.push}
                    onCheckedChange={(checked) => setSettings({ ...settings, push: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="inApp">In-App Notifications</Label>
                  </div>
                  <Switch
                    id="inApp"
                    checked={settings.inApp}
                    onCheckedChange={(checked) => setSettings({ ...settings, inApp: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="sound">Sound Notifications</Label>
                  </div>
                  <Switch
                    id="sound"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>Control what types of notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="reminders">Assessment Reminders</Label>
                  </div>
                  <Switch
                    id="reminders"
                    checked={settings.assessmentReminders}
                    onCheckedChange={(checked) => setSettings({ ...settings, assessmentReminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="results">Result Notifications</Label>
                  </div>
                  <Switch
                    id="results"
                    checked={settings.resultNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, resultNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="achievements">Achievement Alerts</Label>
                  </div>
                  <Switch
                    id="achievements"
                    checked={settings.achievementAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, achievementAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="system">System Updates</Label>
                  </div>
                  <Switch
                    id="system"
                    checked={settings.systemUpdates}
                    onCheckedChange={(checked) => setSettings({ ...settings, systemUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="marketing">Marketing Emails</Label>
                  </div>
                  <Switch
                    id="marketing"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quiet Hours</CardTitle>
                <CardDescription>Set times when you don't want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quietHours">Enable Quiet Hours</Label>
                  <Switch
                    id="quietHours"
                    checked={settings.quietHours}
                    onCheckedChange={(checked) => setSettings({ ...settings, quietHours: checked })}
                  />
                </div>

                {settings.quietHours && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quietStart">Start Time</Label>
                      <input
                        id="quietStart"
                        type="time"
                        value={settings.quietStart}
                        onChange={(e) => setSettings({ ...settings, quietStart: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietEnd">End Time</Label>
                      <input
                        id="quietEnd"
                        type="time"
                        value={settings.quietEnd}
                        onChange={(e) => setSettings({ ...settings, quietEnd: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
