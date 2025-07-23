"use client"

import { useState, useEffect } from "react"
import { Settings, Monitor, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Settings,
    title: "Setup Test",
    description: "Define skills and invite candidates",
    details:
      "Create customized assessments with AI-generated questions tailored to specific roles and skill requirements.",
  },
  {
    icon: Monitor,
    title: "Monitor in Real-Time",
    description: "AI watches behavior as candidate attempts",
    details:
      "Advanced proctoring technology monitors webcam, screen activity, and behavioral patterns during the assessment.",
  },
  {
    icon: TrendingUp,
    title: "Analyze Results",
    description: "Instantly view detailed performance & flags",
    details: "Get comprehensive reports with performance analytics, behavioral insights, and automated scoring.",
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    const section = document.getElementById("how-it-works-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <section
      id="how-it-works-section"
      className="py-24 pb-32 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-gray-900/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Simple, secure, and effective in just three steps</p>
        </div>

        {/* Steps Grid */}
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Card */}
                <div
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transition-all duration-500 border-2 ${
                    activeStep === index
                      ? "border-blue-500 shadow-2xl shadow-blue-500/20 scale-105"
                      : "border-transparent hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl"
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {activeStep > index ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${
                      activeStep === index
                        ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                        : "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
                    }`}
                  >
                    <step.icon
                      className={`h-10 w-10 transition-all duration-500 ${
                        activeStep === index ? "text-white" : "text-blue-600 dark:text-blue-400"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{step.description}</p>

                    {/* Expandable Details */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        activeStep === index ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic border-t border-gray-200 dark:border-gray-700 pt-4">
                        {step.details}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Arrow (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <ArrowRight
                        className={`h-6 w-6 transition-all duration-500 ${
                          activeStep >= index ? "text-blue-600 scale-110" : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Floating Animation Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-1000 pointer-events-none ${
                    activeStep === index ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mt-12 space-x-3">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index ? "bg-blue-600 scale-125" : "bg-gray-300 dark:bg-gray-600 hover:bg-blue-400"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
