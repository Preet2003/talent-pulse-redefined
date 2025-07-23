import { Card, CardContent } from "@/components/ui/card"
import { Brain, Shield, Eye, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Generated Questions",
    description: "Adaptive, role-specific, and skill-focused assessments",
  },
  {
    icon: Shield,
    title: "Secure Remote Proctoring",
    description: "Webcam, screen & mic monitoring with anomaly detection",
  },
  {
    icon: Eye,
    title: "Behavioral Analysis",
    description: "Eye tracking, posture analysis, and event logging",
  },
  {
    icon: BarChart3,
    title: "Insightful Reports",
    description: "Auto-generated performance reports with visual analytics",
  },
]

export function FeatureHighlights() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Assessment
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to conduct secure, accurate, and insightful skill assessments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
