import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProblemList } from "@/components/problem-list"
import { Categories } from "@/components/categories"
import { DailyStreak } from "@/components/daily-streak"
import { Leaderboard } from "@/components/leaderboard"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProblemList />
        <Categories />
        <DailyStreak />
        <Leaderboard />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
