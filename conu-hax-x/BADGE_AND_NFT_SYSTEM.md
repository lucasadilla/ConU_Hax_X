# Badge and NFT System

## Overview
This system separates **badges** (off-chain achievements) from **NFTs** (on-chain tokens):

- **Badges**: Always awarded when user completes a challenge (stored in database, shown on profile)
- **NFTs**: Only minted if user connects their Phantom wallet (optional, on-chain Solana NFTs)

## How It Works

### 1. User Completes Challenge
- User submits solution → Evaluation passes
- **Badge is automatically awarded** (off-chain, stored in database)
- Badge appears on user's profile immediately

### 2. User Connects Phantom Wallet (Optional)
- User can connect their Phantom wallet at any time
- When connected, all existing badges are automatically claimed as NFTs
- Future badges will automatically be minted as NFTs

### 3. NFT Minting
- NFTs are only minted if:
  - User has connected their Phantom wallet
  - User has earned the badge for that challenge
- NFTs are sent directly to user's Phantom wallet (not a shared wallet)

## Database Models

### User
- `phantomWalletAddress`: User's connected Phantom wallet (optional)
- No custodial wallet - users control their own wallets

### Attempt
- `badgeEarned`: Boolean - badge awarded on completion (always true if passed)
- `nftAddress`: String - NFT address if minted to Phantom wallet (optional)
- `nftMintedAt`: Date - when NFT was minted

## API Endpoints

### Connect Phantom Wallet
```typescript
POST /api/connect-wallet
Body: {
  userId: string,
  walletAddress: string
}

Response: {
  success: true,
  walletAddress: string,
  isNewConnection: boolean,
  claimedNFTs: number, // NFTs claimed for existing badges
  nftAddresses: string[]
}
```

### Get Connected Wallet
```typescript
GET /api/connect-wallet?userId=...
Response: {
  walletAddress: string | null,
  isConnected: boolean
}
```

### Claim NFT for Specific Badge
```typescript
POST /api/claim-nft
Body: {
  userId: string,
  ticketId: string
}

Response: {
  success: true,
  nftAddress: string
}
```

### Claim All NFTs
```typescript
PUT /api/claim-nft
Body: {
  userId: string
}

Response: {
  success: true,
  claimed: number,
  failed: number,
  nftAddresses: string[]
}
```

## Frontend Integration

### Connect Phantom Wallet
```typescript
// Using @solana/wallet-adapter-react
import { useWallet } from "@solana/wallet-adapter-react";

const { publicKey, connect } = useWallet();

const handleConnect = async () => {
  await connect();
  
  if (publicKey) {
    const response = await fetch("/api/connect-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        walletAddress: publicKey.toString(),
      }),
    });
    
    const data = await response.json();
    console.log(`Claimed ${data.claimedNFTs} NFTs!`);
  }
};
```

### Check Wallet Connection
```typescript
const checkWallet = async (userId: string) => {
  const response = await fetch(`/api/connect-wallet?userId=${userId}`);
  const data = await response.json();
  
  if (data.isConnected) {
    console.log("Wallet connected:", data.walletAddress);
  } else {
    console.log("No wallet connected");
  }
};
```

## Evaluation Flow

```typescript
import { evaluateSolution } from "@/services/evaluationService";

const result = await evaluateSolution(userId, ticketId, solutionCode);

if (result.passed) {
  // Badge is always awarded
  console.log("Badge earned:", result.badgeEarned);
  
  // NFT only minted if wallet connected
  if (result.nftAddress) {
    console.log("NFT minted:", result.nftAddress);
  } else {
    console.log("Connect Phantom wallet to claim NFT");
  }
}
```

## Key Functions

### `awardBadge(userId, ticketId)`
- Awards badge immediately on completion
- Always succeeds (off-chain)
- Returns boolean

### `mintCompletionNFT(userId, ticketId)`
- Mints NFT only if:
  - User has connected Phantom wallet
  - User has earned the badge
- Returns NFT address or null

### `claimAllBadgeNFTs(userId)`
- Claims all unclaimed badges as NFTs
- Called automatically when wallet is connected
- Returns count of claimed/failed NFTs

## User Experience

1. **User completes challenge** → Badge appears on profile ✅
2. **User connects wallet** → All badges automatically claimed as NFTs 🎁
3. **Future completions** → Badge + NFT (if wallet connected) 🎉

## Benefits

- **No shared wallet**: Users control their own NFTs
- **Optional NFTs**: Users can use the platform without a wallet
- **Flexible**: Connect wallet anytime to claim existing badges
- **Simple**: Badges always work, NFTs are bonus

## Security

- Wallet addresses are validated (Solana PublicKey format)
- One wallet per user (enforced by unique constraint)
- Wallet cannot be connected to multiple accounts
- NFTs sent directly to user's wallet (not custodial)
