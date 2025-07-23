"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, MapPin, Plus, Search, CheckCircle, AlertCircle, Users } from "lucide-react"

interface ScheduleEvent {
  id: string
  title: string
  type: "assessment" | "interview" | "meeting" | "deadline"
  date: string
  time: string
  duration: number
  location?: string
  status: "upcoming" | "completed" | "cancelled"
  participants?: string[]
  description?: string
}

const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "JavaScript Advanced Assessment",
    type: "assessment",
    date: "2024-01-25",
    time: "10:00",
    duration: 120,
    location: "Online",
    status: "upcoming",
    description: "Advanced JavaScript concepts and practical implementation",
  },
  {
    id: "2",
    title: "Technical Interview - Frontend Role",
    type: "interview",
    date: "2024-01-26",
    time: "14:30",
    duration: 60,
    location: "Conference Room A",
    status: "upcoming",
    participants: ["John Smith", "Sarah Johnson"],
    description: "Technical discussion about React and modern frontend practices",
  },
  {
    id: "3",
    title: "Python Data Science Assessment",
    type: "assessment",
    date: "2024-01-20",
    time: "09:00",
    duration: 90,
    location: "Online",
    status: "completed",
    description: "Data analysis and machine learning fundamentals",
  },
  {
    id: "4",
    title: "Project Submission Deadline",
    type: "deadline",
    date: "2024-01-28",
    time: "23:59",
    duration: 0,
    status: "upcoming",
    description: "Final project submission for Full Stack Development course",
  },
]

export function ScheduleDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("calendar")

  const upcomingEvents = mockEvents.filter((event) => event.status === "upcoming")
  const todayEvents = mockEvents.filter((event) => {
    const today = new Date().toISOString().split("T")[0]
    return event.date === today
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return <Search className="h-4 w-4" />
      case "interview":
        return <Users className="h-4 w-4" />
      case "meeting":
        return <CalendarIcon className="h-4 w-4" />
      case "deadline":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "assessment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "interview":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "meeting":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "deadline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your assessments and appointments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayEvents.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <Search className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view events</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Events for {selectedDate?.toLocaleDateString() || "Selected Date"}</CardTitle>
                <CardDescription>Your scheduled events and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents
                    .filter((event) => {
                      if (!selectedDate) return false
                      return event.date === selectedDate.toISOString().split("T")[0]
                    })
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">{getTypeIcon(event.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {event.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(event.status)}
                              <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time}
                            </span>
                            {event.duration > 0 && <span>{event.duration} min</span>}
                            {event.location && (
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.location}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}

                  {mockEvents.filter((event) => {
                    if (!selectedDate) return false
                    return event.date === selectedDate.toISOString().split("T")[0]
                  }).length === 0 && (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No events scheduled for this date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your scheduled assessments and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">{getTypeIcon(event.type)}</div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mt-1">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </span>
                          {event.duration > 0 && <span>{event.duration} min</span>}
                          {event.location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                {upcomingEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
              <CardDescription>Your completed and past events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents
                  .filter((event) => event.status === "completed")
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">{getTypeIcon(event.type)}</div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mt-1">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.time}
                            </span>
                            {event.duration > 0 && <span>{event.duration} min</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </div>
                  ))}

                {mockEvents.filter((event) => event.status === "completed").length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No completed events</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
