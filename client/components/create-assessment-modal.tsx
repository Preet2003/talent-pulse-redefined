"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Sparkles, Settings, ArrowRight } from "lucide-react"

interface CreateAssessmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAssessmentModal({ open, onOpenChange }: CreateAssessmentModalProps) {
  const [selectedOption, setSelectedOption] = useState("ai")

  const handleContinue = () => {
    // Handle continue logic here
    console.log("Selected option:", selectedOption)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-8">
          <DialogHeader className="text-center mb-8">
            <DialogTitle className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Create New Assessment
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Choose how you'd like to build your assessment</p>
          </DialogHeader>

          <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-6">
            {/* Create Manually Option */}
            <div className="relative">
              <div
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                  selectedOption === "manual"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                }`}
                onClick={() => setSelectedOption("manual")}
              >
                <div className="flex items-start space-x-6">
                  {/* Radio Button */}
                  <div className="flex items-center pt-1">
                    <RadioGroupItem
                      value="manual"
                      id="manual"
                      className="w-5 h-5 border-2 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      selectedOption === "manual"
                        ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                        : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                    }`}
                  >
                    <Settings
                      className={`h-8 w-8 transition-all duration-300 ${
                        selectedOption === "manual" ? "text-white" : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor="manual"
                      className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer mb-3 block"
                    >
                      Create Manually
                    </Label>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      Build your assessment from scratch with complete control over questions, sections, and
                      configuration settings.
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {[
                        "Custom question creation",
                        "Flexible section management",
                        "Advanced configuration options",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 transform transition-all duration-200"
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedOption === "manual" && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Create with AI Option */}
            <div className="relative">
              <div
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                  selectedOption === "ai"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                }`}
                onClick={() => setSelectedOption("ai")}
              >
                <div className="flex items-start space-x-6">
                  {/* Radio Button */}
                  <div className="flex items-center pt-1">
                    <RadioGroupItem
                      value="ai"
                      id="ai"
                      className="w-5 h-5 border-2 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      selectedOption === "ai"
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-600/30"
                        : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                    }`}
                  >
                    <Sparkles
                      className={`h-8 w-8 transition-all duration-300 ${
                        selectedOption === "ai" ? "text-white" : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-3">
                      <Label
                        htmlFor="ai"
                        className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"
                      >
                        Create Assessment Using AI
                      </Label>
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-full">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      Build intelligent, role-specific assessments effortlessly with the power of AI.
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {[
                        "Smart role-based test generation",
                        "Describe the role in plain English — AI handles the rest",
                        "Adaptive question selection based on difficulty and relevance",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 transform transition-all duration-200"
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedOption === "ai" && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* AI Glow Effect */}
                {selectedOption === "ai" && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none" />
                )}
              </div>
            </div>
          </RadioGroup>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 group"
            >
              <span>Continue</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
