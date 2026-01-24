# NFT Reward System Setup Guide

## Overview
This system automatically mints Solana NFTs as completion rewards when users successfully complete challenges. Each user gets a custodial Solana wallet on signup.

## Environment Variables

Add these to your `.env` file:

```env
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/your-database-name

# Solana configuration
SOLANA_PRIVATE_KEY=["your","private","key","array"]
SOLANA_RPC_URL=https://api.devnet.solana.com  # Optional, defaults to devnet

# Wallet encryption key (use a strong random string)
WALLET_ENCRYPTION_KEY=your-strong-encryption-key-here
```

## User Signup Flow

After NextAuth creates a user account, generate their wallet:

```typescript
import { generateWalletForUser } from "@/services/userService";

// In NextAuth callback or after signup:
await generateWalletForUser(userId);

// User now has:
// - user.solanaWalletAddress (their public wallet address)
// - user.solanaPrivateKey (encrypted, stored in DB)
```

**See `NEXTAUTH_WALLET_INTEGRATION.md` for detailed NextAuth integration examples.**

## Creating Tickets with NFT Metadata

When creating a ticket, include NFT metadata:

```typescript
import Ticket from "@/models/Ticket";

const ticket = new Ticket({
  title: "Fix the Login Bug",
  description: "Fix the authentication issue...",
  difficulty: "medium",
  // NFT metadata
  completionNFTName: "Bug Fixer Badge",
  completionNFTDescription: "Awarded for fixing the login bug",
  completionNFTImageUrl: "https://your-cdn.com/bug-fixer-badge.png",
  completionNFTAttributes: [
    { trait_type: "Skill", value: "Bug Fixing" },
    { trait_type: "Difficulty", value: "Medium" }
  ]
});

await ticket.save();
```

## Evaluation and NFT Minting

The NFT is automatically minted when evaluation passes:

```typescript
import { evaluateSolution } from "@/services/evaluationService";

const result = await evaluateSolution(
  userId,
  ticketId,
  solutionCode
);

if (result.passed) {
  console.log("NFT minted:", result.nftAddress);
}
```

Or manually mint after evaluation:

```typescript
import { mintCompletionNFT } from "@/services/nftRewardService";

// Only mints if user doesn't already have NFT for this ticket
const nftAddress = await mintCompletionNFT(userId, ticketId);
```

## Duplicate Prevention

The system automatically prevents duplicate NFTs:
- Checks if user already has an NFT for the ticket
- If NFT exists, returns existing address instead of minting new one
- Stores NFT address in Attempt model

## Database Models

### User
- `solanaWalletAddress`: User's public wallet address (optional, generated on signup)
- `solanaPrivateKey`: Encrypted private key (optional, generated on signup)

### Ticket
- `completionNFTName`: Name of the NFT
- `completionNFTDescription`: Description
- `completionNFTImageUrl`: Image URL
- `completionNFTAttributes`: Array of attributes

### Attempt
- `nftAddress`: NFT address if minted
- `nftMintedAt`: Timestamp when minted

## Error Handling

If NFT minting fails:
- Error is logged to console
- Returns `null` (doesn't throw)
- Evaluation still succeeds
- User can retry later if needed

## Security Notes

1. **Encryption Key**: Use a strong, random encryption key for `WALLET_ENCRYPTION_KEY`
2. **Private Keys**: Never log or expose private keys
3. **Environment Variables**: Keep `.env` file secure and never commit it
4. **Production**: Switch to mainnet RPC URL and use proper IPFS/Arweave for metadata

## Future Enhancements

- Add endpoint for users to export their private key
- Add NFT collection view in user profile
- Implement IPFS/Arweave metadata storage
- Add NFT transfer functionality
