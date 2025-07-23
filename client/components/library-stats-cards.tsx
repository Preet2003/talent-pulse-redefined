import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, FileText } from "lucide-react"

export function LibraryStatsCards() {
  const stats = [
    {
      title: "Total Libraries",
      value: "1",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Questions",
      value: "0",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
        >
          {/* Left accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
