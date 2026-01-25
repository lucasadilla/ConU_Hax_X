"use client"

import { signIn } from "next-auth/react"
import { Chrome, Github, ArrowRight, Sword } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card 
        className="w-full max-w-md p-8"
        style={{
          backgroundColor: 'rgba(30, 30, 46, 0.95)',
          border: '4px solid #1e1e2e',
          boxShadow: '8px 8px 0 rgba(0,0,0,0.4)',
        }}
      >
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sword className="h-12 w-12 text-yellow-400" />
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 animate-pulse" />
            </div>
          </div>
          
          <h1 
            className="text-2xl font-display mb-3"
            style={{ 
              color: '#fde047',
              textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
            }}
          >
            Sign in
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Continue with Google or GitHub to access quests and earn rewards
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full justify-between font-bold transition-all hover:-translate-y-1"
            onClick={() => signIn("google", { callbackUrl: "/quests" })}
            style={{
              backgroundColor: '#fde047',
              color: '#1e1e2e',
              border: '3px solid #1e1e2e',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
            }}
          >
            <span className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Continue with Google
            </span>
            <ArrowRight className="h-5 w-5" />
          </Button>

          <Button
            className="w-full justify-between font-bold transition-all hover:-translate-y-1"
            onClick={() => signIn("github", { callbackUrl: "/quests" })}
            style={{
              backgroundColor: 'transparent',
              color: '#fde047',
              border: '3px solid #fde047',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <span className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Continue with GitHub
            </span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-sm text-slate-500 hover:text-yellow-400 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  )
}
