import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      experience?: number
      totalPoints?: number
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string
    experience?: number
    totalPoints?: number
  }
}
