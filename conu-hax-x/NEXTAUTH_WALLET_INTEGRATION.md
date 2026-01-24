# NextAuth Wallet Integration Guide

## Overview
After NextAuth creates a user account, you need to generate a Solana wallet for them. This guide shows how to integrate wallet generation with NextAuth.

## Integration Options

### Option 1: In NextAuth `signIn` Callback (Recommended)

In your NextAuth configuration file (e.g., `app/api/auth/[...nextauth]/route.ts`):

```typescript
import { NextAuthOptions } from "next-auth";
import { generateWalletForUser } from "@/services/userService";

export const authOptions: NextAuthOptions = {
  // ... your other NextAuth config
  callbacks: {
    async signIn({ user, account, profile }) {
      // This runs after user is created/authenticated
      return true;
    },
    async jwt({ token, user, account }) {
      // Generate wallet when user first signs in
      if (user?.id && account) {
        try {
          await generateWalletForUser(user.id);
        } catch (error) {
          console.error("Failed to generate wallet:", error);
          // Don't block authentication if wallet generation fails
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add wallet address to session if needed
      if (token.sub) {
        const user = await getUserById(token.sub);
        if (user?.solanaWalletAddress) {
          session.user.walletAddress = user.solanaWalletAddress;
        }
      }
      return session;
    },
  },
};
```

### Option 2: In NextAuth `events` Callback

```typescript
import { NextAuthOptions } from "next-auth";
import { generateWalletForUser } from "@/services/userService";

export const authOptions: NextAuthOptions = {
  // ... your other NextAuth config
  events: {
    async createUser({ user }) {
      // This runs when a new user is created
      try {
        await generateWalletForUser(user.id);
        console.log(`Wallet generated for new user: ${user.id}`);
      } catch (error) {
        console.error("Failed to generate wallet for new user:", error);
      }
    },
  },
};
```

### Option 3: Separate API Route (If using database adapter)

If you're using a NextAuth database adapter, you can create a separate API route that gets called after signup:

```typescript
// app/api/generate-wallet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { generateWalletForUser } from "@/services/userService";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await generateWalletForUser(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      walletAddress: user.solanaWalletAddress,
    });
  } catch (error) {
    console.error("Failed to generate wallet:", error);
    return NextResponse.json(
      { error: "Failed to generate wallet" },
      { status: 500 }
    );
  }
}
```

Then call it from your frontend after signup completes.

## Key Functions

### `generateWalletForUser(userId)`
- Generates a wallet for an existing user
- Idempotent: won't fail if called multiple times
- Won't overwrite existing wallet
- Returns the updated user or null if user not found

### `generateWalletForUserByEmail(email)`
- Alternative method using email instead of ID
- Useful if you only have the email from NextAuth

### `userHasWallet(userId)`
- Check if a user already has a wallet
- Returns boolean

## Important Notes

1. **Idempotent**: The function is safe to call multiple times - it won't create duplicate wallets
2. **Error Handling**: Wallet generation errors won't block user authentication
3. **Timing**: Wallet is generated asynchronously, so it may not be immediately available
4. **Environment Variable**: Make sure `WALLET_ENCRYPTION_KEY` is set in your `.env` file

## Example: Checking Wallet Status

```typescript
import { userHasWallet, getUserById } from "@/services/userService";

// Check if user has wallet
const hasWallet = await userHasWallet(userId);

// Get user with wallet address
const user = await getUserById(userId);
if (user?.solanaWalletAddress) {
  console.log("User wallet:", user.solanaWalletAddress);
}
```
