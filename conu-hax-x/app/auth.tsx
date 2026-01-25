import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

function resolveEnv(primary?: string, fallback?: string) {
  return primary ?? fallback
}

async function getOrCreateUser(params: {
  email?: string | null
  name?: string | null
  image?: string | null
}) {
  const { email, name, image } = params
  if (!email) {
    return null
  }

  await connectToDatabase()

  const existing = await User.findOne({ email })
  if (existing) {
    let updated = false
    if (name && !existing.displayName) {
      existing.displayName = name
      updated = true
    }
    if (image && !existing.avatarUrl) {
      existing.avatarUrl = image
      updated = true
    }
    if (updated) {
      existing.lastActiveAt = new Date()
      await existing.save()
    }
    return existing
  }

  const base = (email.split("@")[0] || "user")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
  const seed = base.length >= 3 ? base : `user${base || "id"}`
  let username = seed
  let suffix = 0
  while (await User.exists({ username })) {
    suffix += 1
    username = `${seed}${suffix}`
  }

  const created = await User.create({
    username,
    email,
    displayName: name || username,
    avatarUrl: image || null,
    lastActiveAt: new Date(),
  })

  return created
}

export const authOptions: NextAuthOptions = {
  secret: resolveEnv(process.env.AUTH_SECRET, process.env.NEXTAUTH_SECRET),
  providers: [
    GithubProvider({
      clientId: resolveEnv(
        process.env.GITHUB_CLIENT_ID,
        process.env.GITHUB_ID
      ) as string,
      clientSecret: resolveEnv(
        process.env.GITHUB_CLIENT_SECRET,
        process.env.GITHUB_SECRET
      ) as string,
    }),
    GoogleProvider({
      clientId: resolveEnv(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_ID
      ) as string,
      clientSecret: resolveEnv(
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_SECRET
      ) as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      const dbUser = await getOrCreateUser({
        email: user.email,
        name: user.name,
        image: user.image,
      })
      if (dbUser?._id) {
        user.id = dbUser._id.toString()
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.uid = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid as string
      }
      return session
    },
  },
}
