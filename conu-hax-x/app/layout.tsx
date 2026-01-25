import React from "react"
import type { Metadata } from 'next'
import { Press_Start_2P, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SkyBackground } from '@/components/SkyBackground'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-display'
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'ConU Hax X - AI-Powered Coding Challenges',
  description: 'Level up your coding skills with AI-generated challenges, earn blockchain badges, and compete on the leaderboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${jetbrainsMono.variable} font-mono antialiased min-h-screen`}>
        <SkyBackground />
        <div className="relative z-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
