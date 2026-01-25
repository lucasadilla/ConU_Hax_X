"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "What is CodeQuest?",
    answer: "CodeQuest is a gamified coding challenge platform where you solve algorithmic problems, earn XP, unlock achievements, and compete with other developers on the global leaderboard. Think of it as LeetCode meets an RPG adventure!"
  },
  {
    question: "How does the XP system work?",
    answer: "You earn XP by completing quests (coding challenges). Easy quests reward 50 XP, Medium quests reward 100 XP, and Hard quests reward 200 XP. Bonus XP is awarded for maintaining daily streaks, achieving milestones, and participating in weekly contests."
  },
  {
    question: "What programming languages are supported?",
    answer: "CodeQuest supports over 20 programming languages including Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, Ruby, Swift, and more. Choose your weapon of choice for each quest!"
  },
  {
    question: "Is CodeQuest free to use?",
    answer: "Yes! CodeQuest offers a generous free tier with access to hundreds of quests. Premium warriors unlock additional challenges, detailed solution explanations, interview preparation tracks, and exclusive achievements."
  },
  {
    question: "How do I maintain my daily streak?",
    answer: "Complete at least one quest per day to maintain your streak. Longer streaks unlock bonus XP multipliers and exclusive badges. Don't worry - we offer streak freezes for those unexpected busy days!"
  },
  {
    question: "Can I use CodeQuest for interview preparation?",
    answer: "Absolutely! CodeQuest features curated problem sets from top tech companies, pattern-based learning tracks, and mock interview simulations. Many warriors have landed their dream jobs using our platform."
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-16" style={{ scrollMarginTop: '100px' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div 
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 mb-4"
              style={{
                backgroundColor: 'rgba(30, 30, 46, 0.9)',
                border: '3px solid #fde047',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
              }}
            >
              <HelpCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Got Questions?</span>
            </div>
            <h2 
              className="font-[family-name:var(--font-display)] text-2xl md:text-3xl mb-4"
              style={{ 
                color: '#1e1e2e',
                textShadow: '2px 2px 0 #fde047',
              }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-slate-700 font-medium">
              Everything you need to know about your coding adventure
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="rounded-xl px-6 transition-colors overflow-hidden"
                style={{
                  backgroundColor: 'rgba(30, 30, 46, 0.9)',
                  border: '3px solid #1e1e2e',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
                }}
              >
                <AccordionTrigger className="text-left font-medium text-white hover:text-yellow-400 py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
