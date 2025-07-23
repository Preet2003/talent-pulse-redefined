import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "TalentPulse has revolutionized our hiring process. The AI-generated questions are spot-on and the proctoring gives us complete confidence in results.",
    name: "Sarah Johnson",
    role: "HR Director",
    organization: "TechCorp Inc.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    quote:
      "The behavioral analysis feature helped us identify top performers we might have missed with traditional assessments. Game-changing technology.",
    name: "Michael Chen",
    role: "Talent Acquisition Manager",
    organization: "InnovateLabs",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    quote:
      "As an educator, I love how easy it is to create and monitor assessments. The detailed reports save me hours of manual evaluation.",
    name: "Dr. Emily Rodriguez",
    role: "Professor",
    organization: "State University",
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Trusted by thousands of organizations worldwide</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</blockquote>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}, {testimonial.organization}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
