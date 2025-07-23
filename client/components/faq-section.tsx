import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How secure is the platform?",
    answer:
      "TalentPulse uses enterprise-grade security with end-to-end encryption, secure data storage, and compliance with GDPR and SOC 2 standards. All proctoring data is processed securely and can be automatically deleted after assessment completion.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No installation required! TalentPulse runs entirely in the web browser. Candidates simply need a modern browser with camera and microphone access. Our platform is compatible with Chrome, Firefox, Safari, and Edge.",
  },
  {
    question: "How is cheating detected?",
    answer:
      "Our AI-powered proctoring system monitors multiple indicators including eye movement, face detection, audio anomalies, screen sharing attempts, and suspicious browser activity. The system flags potential issues in real-time and provides detailed reports.",
  },
  {
    question: "Can I brand the assessments for my company?",
    answer:
      "You can customize assessments with your company logo, colors, and branding. Create a seamless experience that reflects your organization's professional image throughout the entire assessment process.",
  },
  {
    question: "What types of questions can the AI generate?",
    answer:
      "Our AI can generate various question types including multiple choice, coding challenges, scenario-based questions, and skill-specific assessments across domains like programming, marketing, finance, and more. Questions adapt to difficulty based on candidate responses.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Get answers to common questions about TalentPulse</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg px-6 border-0 shadow-sm"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 dark:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pt-2">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
