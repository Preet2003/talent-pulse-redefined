import { Check } from "lucide-react"

const features = [
  "AI Question Generation",
  "Proctoring with Webcam, Screen, and Audio",
  "No login required for candidates",
  "Behavioral Event Logs",
  "Organization-branded assessments",
  "Real-time monitoring dashboard",
  "Automated report generation",
  "Multi-language support",
]

export function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose TalentPulse?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Advanced features that set us apart from traditional assessment tools
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-lg text-gray-900 dark:text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
