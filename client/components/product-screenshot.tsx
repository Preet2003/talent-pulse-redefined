export function ProductScreenshot() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            See TalentPulse in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            A unified dashboard for creating, proctoring, and analyzing tests
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700">
            <img
              src="/placeholder.svg?height=600&width=1200&text=TalentPulse+Dashboard"
              alt="TalentPulse Platform Dashboard"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
