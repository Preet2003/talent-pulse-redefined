"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Edit3, Upload, Sparkles, FileText, BookOpen, Zap, Clock, Users, Target } from "lucide-react"

interface QuestionCreationOptionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOptionSelected: (option: string) => void
}

const creationOptions = [
  {
    id: "manual",
    title: "Manual Creation",
    subtitle: "Craft with precision",
    description: "Create questions from scratch with complete control over content, format, and difficulty",
    icon: Edit3,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    textColor: "text-blue-600 dark:text-blue-400",
    features: ["Full customization", "Step-by-step guidance", "Multiple question types"],
    estimatedTime: "5-10 min per question",
    difficulty: "Beginner",
    popular: false,
  },
  {
    id: "bulk-upload",
    title: "Bulk Upload",
    subtitle: "Import at scale",
    description: "Upload multiple questions simultaneously using our structured Excel/CSV template",
    icon: Upload,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
    textColor: "text-green-600 dark:text-green-400",
    features: ["Excel/CSV support", "Batch validation", "Template provided"],
    estimatedTime: "10-50 questions in minutes",
    difficulty: "Intermediate",
    popular: true,
  },
  {
    id: "ai-generate",
    title: "AI Generation",
    subtitle: "Intelligent automation",
    description: "Let advanced AI create contextually relevant questions based on your specifications",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    textColor: "text-purple-600 dark:text-purple-400",
    features: ["Bloom's Taxonomy", "Smart difficulty scaling", "Educational framework"],
    estimatedTime: "1-50 questions in seconds",
    difficulty: "Beginner",
    popular: true,
  },
  {
    id: "pdf-generate",
    title: "PDF Analysis",
    subtitle: "Document-driven",
    description: "Extract and generate questions directly from your PDF documents and manuals",
    icon: FileText,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    textColor: "text-orange-600 dark:text-orange-400",
    features: ["Content analysis", "Context-aware", "Source referencing"],
    estimatedTime: "1-3 minutes processing",
    difficulty: "Intermediate",
    popular: false,
  },
  {
    id: "library-import",
    title: "Library Import",
    subtitle: "Reuse & remix",
    description: "Select and import questions from your existing question libraries and collections",
    icon: BookOpen,
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-500",
    textColor: "text-indigo-600 dark:text-indigo-400",
    features: ["Browse libraries", "Filter & search", "Quick selection"],
    estimatedTime: "Instant import",
    difficulty: "Beginner",
    popular: false,
    comingSoon: false,
  },
]

export function QuestionCreationOptionsModal({
  open,
  onOpenChange,
  onOptionSelected,
}: QuestionCreationOptionsModalProps) {
  const handleOptionClick = (optionId: string, comingSoon?: boolean) => {
    if (comingSoon) return
    onOptionSelected(optionId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[95vh] overflow-y-auto p-0 [&>button]:hidden">
        <div className="p-8">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 z-10 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Enhanced Header */}
          <DialogHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30">
              <Target className="h-10 w-10 text-white" />
            </div>
            <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Choose Creation Method
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-xl max-w-2xl mx-auto leading-relaxed">
              Select the approach that best fits your workflow and requirements
            </p>
          </DialogHeader>

          {/* Enhanced Options Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-8">
            {creationOptions.map((option) => (
              <Card
                key={option.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border-2 relative overflow-hidden ${
                  option.comingSoon
                    ? "opacity-70 cursor-not-allowed border-gray-200 dark:border-gray-700"
                    : "hover:border-gray-300 dark:hover:border-gray-600 border-gray-200 dark:border-gray-700 hover:-translate-y-2"
                }`}
                onClick={() => handleOptionClick(option.id, option.comingSoon)}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Popular Badge */}
                {option.popular && !option.comingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-3 py-1 shadow-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                {/* Coming Soon Badge */}
                {option.comingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold px-3 py-1">
                      Coming Soon
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8 relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-500 ${
                      option.comingSoon
                        ? "bg-gray-100 dark:bg-gray-800"
                        : `${option.iconBg} group-hover:scale-110 group-hover:shadow-2xl`
                    }`}
                  >
                    <option.icon className={`h-10 w-10 ${option.comingSoon ? "text-gray-400" : "text-white"}`} />
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <h3
                        className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                          option.comingSoon
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white group-hover:" + option.textColor.split(" ")[0]
                        }`}
                      >
                        {option.title}
                      </h3>
                      <p
                        className={`text-sm font-medium mb-3 ${
                          option.comingSoon ? "text-gray-400 dark:text-gray-500" : option.textColor
                        }`}
                      >
                        {option.subtitle}
                      </p>
                      <p
                        className={`text-sm leading-relaxed mb-6 ${
                          option.comingSoon ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {option.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {option.features.map((feature, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-center space-x-2 text-sm ${
                            option.comingSoon ? "text-gray-400" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${option.comingSoon ? "bg-gray-300" : "bg-green-500"}`}
                          />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{option.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{option.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    {!option.comingSoon && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${option.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Footer */}
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Need Help Choosing?</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Edit3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">New to question creation?</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start with <strong>Manual Creation</strong>
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Upload className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">Have existing questions?</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use <strong>Bulk Upload</strong>
                  </p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Sparkles className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">Want speed & quality?</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try <strong>AI Generation</strong>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              All methods integrate seamlessly with your library structure. You can always combine different approaches
              to build comprehensive question sets.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
