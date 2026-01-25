# 🎮 NFT Minting on Quest Completion - Implementation Complete!

## ✅ What's Been Implemented

### 1. **Automatic Badge + NFT Minting**
When a user successfully completes a quest:
- ✅ **Badge is ALWAYS awarded** (off-chain, stored in database)
- ✅ **NFT is minted IF** user has connected Phantom wallet
- ✅ **NFT is sent directly to user's wallet**
- ✅ **No NFT?** Badge remains claimable later

### 2. **Smart Flow Logic**
```
User Completes Quest
        ↓
✅ Badge Awarded (Always)
        ↓
    Has Phantom Wallet?
        ├─ YES → Mint NFT to wallet 🎁
        └─ NO  → Badge stays off-chain 💎
```

### 3. **NFT Metadata System**
Each quest has:
- NFT Name: `"{Quest Title} Badge"`
- NFT Description: Quest details
- NFT Image: Links to badge SVG
- NFT Attributes: Theme, difficulty, points, etc.

---

## 🚀 How to Use

### Step 1: Add NFT Metadata to Quests

Visit: **`http://localhost:3000/admin/add-nft-metadata`**

1. Click "Add NFT Metadata to All Quests"
2. Wait for completion
3. See list of updated quests

This adds NFT information to all your existing quests.

### Step 2: Test Quest Completion

1. **Go to a quest page**
2. **Submit a solution**
3. **Pass the tests**
4. **Watch the server logs:**

```
🎖️  Awarding badge for quest completion...
✅ Badge awarded successfully
🎁 User has Phantom wallet, minting NFT...
✅ NFT minted successfully: ABC123...
```

OR if no wallet:

```
🎖️  Awarding badge for quest completion...
✅ Badge awarded successfully
💎 No Phantom wallet connected - badge remains off-chain
   User can connect wallet later to claim as NFT
```

### Step 3: Check Your Phantom Wallet

1. Open Phantom extension
2. Click "Collectibles" tab
3. See your quest completion NFT! 🎨

---

## 📁 Files Modified

### 1. **`services/evaluationService.ts`**
**What Changed:**
- Added import for `awardBadge` and `mintCompletionNFT`
- After quest completion, calls `awardBadge()` (always)
- If user has Phantom wallet, calls `mintCompletionNFT()`
- Logs all actions for debugging

**Key Code:**
```typescript
// Award off-chain badge
const badgeAwarded = await awardBadge(userId, ticketId);

// If user has Phantom wallet, mint NFT
if (user.phantomWalletAddress) {
  const nftAddress = await mintCompletionNFT(userId, ticketId);
}
```

### 2. **`app/api/quests/add-nft-metadata/route.ts`** (NEW)
**What It Does:**
- POST endpoint to add NFT metadata to all quests
- Generates NFT name, description, attributes
- Links to appropriate badge SVG image
- Updates all tickets in database

### 3. **`app/admin/add-nft-metadata/page.tsx`** (NEW)
**What It Does:**
- Admin UI to trigger NFT metadata addition
- Shows progress and results
- Lists all updated quests

---

## 🔍 How It Works

### Complete Flow

1. **User Submits Solution**
   ```
   POST /api/submit-solution
   ```

2. **Solution is Evaluated**
   - Tests run
   - AI evaluates code
   - Score calculated

3. **If Passed:**
   - User stats updated
   - Old badge system runs
   - **NEW:** `awardBadge()` called
   - **NEW:** Check for Phantom wallet
   - **NEW:** If wallet exists, `mintCompletionNFT()`

4. **NFT Minting Process** (if wallet connected):
   - Get ticket NFT metadata
   - Call Solana `mintNFT()`
   - Send to user's Phantom wallet
   - Update `Attempt` with NFT address

5. **Result:**
   - Badge always in profile
   - NFT in Phantom (if wallet connected)
   - User gets success notification

---

## 🎨 NFT Metadata Structure

Each quest NFT includes:

```json
{
  "name": "Quest Title Badge",
  "description": "Completion badge for: Quest Title. Description...",
  "image": "/badges/theme-quest-1-easy.svg",
  "attributes": [
    { "trait_type": "Theme", "value": "Bug Slayer" },
    { "trait_type": "Difficulty", "value": "easy" },
    { "trait_type": "Quest Number", "value": "1" },
    { "trait_type": "Points", "value": "100" },
    { "trait_type": "Category", "value": "Programming" }
  ]
}
```

---

## 📊 Database Structure

### `Attempt` Model
```typescript
{
  userId: ObjectId,
  ticketId: ObjectId,
  badgeEarned: boolean,      // Always true if passed
  nftAddress: string?,        // Solana NFT address (if minted)
  nftMintedAt: Date?,        // When NFT was minted
  // ... other fields
}
```

### `Ticket` Model
```typescript
{
  title: string,
  description: string,
  completionNFTName: string,           // "Quest Title Badge"
  completionNFTDescription: string,    // Full description
  completionNFTImageUrl: string,       // "/badges/..."
  completionNFTAttributes: Array,      // Metadata attributes
  // ... other fields
}
```

---

## 🧪 Testing Checklist

### Without Solana Configured
- [ ] Complete a quest
- [ ] See "Badge awarded successfully" in logs
- [ ] See "No Phantom wallet connected" message
- [ ] Badge appears on profile
- [ ] No NFT minted (expected)

### With Solana Configured + Wallet Connected
- [ ] Add NFT metadata to quests first
- [ ] Connect Phantom wallet on profile
- [ ] Complete a quest
- [ ] See "NFT minted successfully" in logs
- [ ] Check server logs for NFT address
- [ ] Open Phantom wallet
- [ ] See NFT in "Collectibles" tab

### Connect Wallet After Earning Badges
- [ ] Earn badges WITHOUT wallet
- [ ] Connect Phantom wallet
- [ ] See "X NFTs claimed" message
- [ ] All existing badges minted as NFTs

---

## 🎯 Server Logs to Watch For

### Successful Flow:
```
🎖️  Awarding badge for quest completion...
✅ Badge awarded successfully
🎁 User has Phantom wallet, minting NFT...
✅ NFT minted successfully: 7xK9...abc123
📤 NFT sent to wallet: CpMa...xyz789
```

### Without Wallet:
```
🎖️  Awarding badge for quest completion...
✅ Badge awarded successfully
💎 No Phantom wallet connected - badge remains off-chain
   User can connect wallet later to claim as NFT
```

### NFT Minting Failed:
```
🎖️  Awarding badge for quest completion...
✅ Badge awarded successfully
🎁 User has Phantom wallet, minting NFT...
⚠️  NFT minting failed or skipped (check logs above)
```

---

## 🔧 Admin Tools

### Add NFT Metadata
**URL:** `/admin/add-nft-metadata`
**Purpose:** Add NFT information to all quests
**When:** Run once after setting up, or when adding new quests

### Seed Quests
**URL:** `/admin/seed-quests`
**Purpose:** Generate new quests (update this to include NFT metadata by default)

---

## 🚨 Troubleshooting

### "SOLANA_PRIVATE_KEY not set"
**Issue:** Solana not configured
**Fix:** See `SOLANA_SETUP_GUIDE.md`
**Impact:** Badges work, NFTs won't mint

### "No NFT metadata for ticket"
**Issue:** Quest doesn't have NFT information
**Fix:** Visit `/admin/add-nft-metadata` to add it
**Impact:** NFT minting will fail for that quest

### "User has no Phantom wallet"
**Issue:** Not an issue! This is expected behavior
**Fix:** User can connect wallet later
**Impact:** Badge saved, NFT claimable later

### NFT Minting Fails Silently
**Check:**
1. Server logs for detailed error
2. Solana RPC URL is correct
3. Wallet has SOL for fees
4. NFT metadata exists on quest

---

## ✨ Next Steps

1. **Add Metadata**: Visit `/admin/add-nft-metadata`
2. **Test**: Complete a quest and check logs
3. **Configure Solana**: For actual NFT minting (optional)
4. **Deploy**: When ready for production

---

## 🎉 Success Criteria

You'll know it's working when:
- ✅ Server logs show "Badge awarded successfully"
- ✅ If wallet connected, logs show "NFT minted successfully"
- ✅ Badges appear on profile page
- ✅ NFTs appear in Phantom wallet (if connected)
- ✅ Users can connect wallet later to claim NFTs

---

**The NFT minting system is now fully integrated! 🚀**

Complete a quest and watch the magic happen! ✨
