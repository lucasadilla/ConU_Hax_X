import React from "react"
import { Sword, Github, Twitter, Linkedin, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t-4 border-primary bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Sword className="h-8 w-8 text-primary" />
              <span className="font-[family-name:var(--font-display)] text-lg text-primary">
                CodeQuest
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Level up your coding skills through gamified challenges and epic quests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Quests</h4>
            <ul className="space-y-2">
              <FooterLink href="#">All Problems</FooterLink>
              <FooterLink href="#">Easy</FooterLink>
              <FooterLink href="#">Medium</FooterLink>
              <FooterLink href="#">Hard</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Study Guide</FooterLink>
              <FooterLink href="#">Interview Prep</FooterLink>
              <FooterLink href="#">Discussion</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t-2 border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-accent fill-accent" /> by CodeQuest Team
          </div>
          
          <div className="flex items-center gap-4">
            <SocialLink href="#" icon={Github} label="GitHub" />
            <SocialLink href="#" icon={Twitter} label="Twitter" />
            <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
          </div>

          <div className="text-sm text-muted-foreground">
            &copy; 2026 CodeQuest. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link 
      href={href}
      className="w-10 h-10 rounded-lg border-2 border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
    </Link>
  )
}
