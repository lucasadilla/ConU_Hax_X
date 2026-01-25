"use client"

import { signIn } from "next-auth/react"
import { Chrome, Github, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-display text-primary mb-2">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Continue with Google or GitHub to access quests and rewards.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full justify-between"
            variant="secondary"
            onClick={() => signIn("google", { callbackUrl: "/quests" })}
          >
            <span className="flex items-center gap-2">
              <Chrome className="h-4 w-4" />
              Continue with Google
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            className="w-full justify-between"
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/quests" })}
          >
            <span className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              Continue with GitHub
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
