"use client"

import { useState, useEffect } from "react"

const companies = [
  { name: "Microsoft", logo: "/placeholder.svg?height=60&width=120&text=Microsoft" },
  { name: "Google", logo: "/placeholder.svg?height=60&width=120&text=Google" },
  { name: "Amazon", logo: "/placeholder.svg?height=60&width=120&text=Amazon" },
  { name: "Meta", logo: "/placeholder.svg?height=60&width=120&text=Meta" },
  { name: "Apple", logo: "/placeholder.svg?height=60&width=120&text=Apple" },
  { name: "Netflix", logo: "/placeholder.svg?height=60&width=120&text=Netflix" },
  { name: "Tesla", logo: "/placeholder.svg?height=60&width=120&text=Tesla" },
  { name: "Spotify", logo: "/placeholder.svg?height=60&width=120&text=Spotify" },
]

export function UsedBySection() {
  const [currentIndex, setCurrentIndex] = useState(0)
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

    const section = document.getElementById("used-by-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= companies.length - 1) {
          // Reset to start after a pause
          setTimeout(() => setCurrentIndex(0), 1000)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible])

  // Calculate transform based on current index
  const getTransform = () => {
    const itemWidth = 200 // Width of each item including spacing
    const containerWidth = 1200 // Approximate container width
    const centerOffset = containerWidth / 2 - itemWidth / 2
    return `translateX(${centerOffset - currentIndex * itemWidth}px)`
  }

  return (
    <section id="used-by-section" className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Trusted by Leading Organizations
          </h2>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex items-center transition-transform duration-1000 ease-in-out"
              style={{ transform: getTransform() }}
            >
              {companies.map((company, index) => {
                const isCenter = index === currentIndex
                const distance = Math.abs(index - currentIndex)

                return (
                  <div key={company.name} className="flex-shrink-0 px-8 py-4" style={{ width: "200px" }}>
                    <div
                      className={`relative transition-all duration-700 ease-out ${
                        isCenter ? "transform scale-125" : distance === 1 ? "transform scale-100" : "transform scale-75"
                      }`}
                    >
                      <div
                        className={`p-6 rounded-2xl transition-all duration-700 ${
                          isCenter
                            ? "bg-white dark:bg-gray-800 shadow-2xl shadow-blue-500/20 border-2 border-blue-200 dark:border-blue-800"
                            : "bg-white/70 dark:bg-gray-800/70 shadow-md border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {/* Spotlight effect for center item */}
                        {isCenter && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl animate-pulse" />
                        )}

                        <div className="relative z-10">
                          <img
                            src={company.logo || "/placeholder.svg"}
                            alt={`${company.name} logo`}
                            className={`h-12 w-auto mx-auto transition-all duration-700 ${
                              isCenter ? "filter-none" : "filter grayscale opacity-60"
                            }`}
                          />

                          {/* Company name appears only for center item */}
                          <div
                            className={`mt-3 text-center transition-all duration-500 overflow-hidden ${
                              isCenter ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{company.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mt-8 space-x-1">
            {companies.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : index < currentIndex
                      ? "w-4 bg-blue-400"
                      : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-gray-900/50 to-transparent pointer-events-none z-10" />
        </div>

        {/* Stats */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Join 500+ organizations worldwide using TalentPulse for their assessment needs
          </p>
        </div>
      </div>
    </section>
  )
}
