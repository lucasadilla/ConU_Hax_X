# 🔐 Solana Environment Setup Guide

## Current Status

✅ **App is running!** (http://localhost:3000)  
⚠️ **NFT features disabled** - Solana not configured

---

## What's Working Right Now

Without Solana configuration, you can still:
- ✅ View the profile page
- ✅ See badge displays
- ✅ View the wallet connection UI
- ✅ Test all visual components
- ✅ Preview at `/nft-preview`

What won't work:
- ❌ Actually minting NFTs
- ❌ Sending NFTs to wallets

---

## Setup Solana (Optional for Testing)

### Option 1: Quick Test Setup (Devnet - Free)

1. **Generate a Solana Keypair** (for testing only):
   ```bash
   npx @solana/web3.js keygen --outfile solana-keypair.json
   ```

2. **Get the private key**:
   ```bash
   cat solana-keypair.json
   # Copy the array of numbers, e.g., [123,45,67,...]
   ```

3. **Add to your `.env` file**:
   ```env
   # Add these lines to conu-hax-x/.env
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_PRIVATE_KEY='[123,45,67,...]'  # Paste the array from step 2
   ```

4. **Get some devnet SOL** (free test tokens):
   - Visit: https://faucet.solana.com/
   - Paste your public key
   - Request airdrop

5. **Restart the dev server**:
   ```bash
   # Press Ctrl+C to stop current server
   npm run dev
   ```

---

### Option 2: Skip Solana Setup (For Now)

You can continue developing without Solana! The NFT features will gracefully fail and show appropriate messages to users.

**To test the UI without actual minting:**
1. Visit `http://localhost:3000/nft-preview`
2. See all components working
3. Wallet connection UI works
4. Badge displays work
5. Just no actual on-chain NFTs

---

## How to Configure (Production)

### For Real NFT Minting (Mainnet):

1. **Get SOL for transaction fees**:
   - Buy SOL from an exchange
   - Transfer to a new wallet (don't use your personal wallet!)

2. **Export private key**:
   ```javascript
   // In Phantom wallet or using @solana/web3.js
   // Export as Uint8Array format
   ```

3. **Update `.env`**:
   ```env
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   SOLANA_PRIVATE_KEY='[your,mainnet,private,key,array]'
   ```

⚠️ **Security Warning**:
- NEVER commit `.env` to git
- Use a dedicated wallet for minting (not your personal funds)
- Keep private keys secure
- Consider using encrypted key storage for production

---

## Current Error Explained

The error you're seeing:
```
Error: SOLANA_PRIVATE_KEY environment variable is not set
```

This happens when:
- Someone tries to connect a Phantom wallet
- The app attempts to initialize Solana for NFT minting
- But the environment variable isn't configured

**This is not breaking!** The app will:
- Still save the wallet address
- Still show the UI correctly
- Just won't mint actual NFTs

---

## Testing Without Solana

### What You Can Do Right Now:

1. **View the integration**:
   ```
   http://localhost:3000/nft-preview
   ```

2. **Test the profile page**:
   ```
   http://localhost:3000/profile/[your-user-id]
   ```

3. **See wallet widget**:
   - Sidebar shows "Connect Phantom Wallet"
   - UI is fully functional
   - Badge display works

4. **Test badge display**:
   - Complete a challenge
   - Badge appears on profile
   - No NFT indicator (until Solana configured)

---

## When to Configure Solana

### Configure NOW if:
- ✅ You want to test actual NFT minting
- ✅ You have Phantom wallet installed
- ✅ You want to see NFTs in your wallet

### Configure LATER if:
- 📅 You're just building/testing UI
- 📅 You want to focus on other features first
- 📅 You'll deploy to production eventually

---

## Next Steps

### To Continue Without Solana:
```bash
# Already running! Visit:
http://localhost:3000
http://localhost:3000/nft-preview
```

### To Set Up Solana:
1. Follow "Option 1: Quick Test Setup" above
2. Restart dev server
3. Try connecting Phantom wallet
4. Complete a challenge
5. See NFT in Phantom!

---

## Quick Reference

### Current App URLs:
- **Home**: http://localhost:3000
- **Profile**: http://localhost:3000/profile/[userId]
- **NFT Preview**: http://localhost:3000/nft-preview
- **Badges**: http://localhost:3000/badges

### Important Files:
- **Environment**: `conu-hax-x/.env` (add Solana config here)
- **Solana Logic**: `conu-hax-x/lib/solana.ts`
- **NFT Service**: `conu-hax-x/services/nftRewardService.ts`

### Warnings You Can Ignore:
- ✅ Mongoose duplicate index warnings (cosmetic)
- ✅ Multiple lockfiles warning (won't affect functionality)
- ✅ bigint bindings warning (will use pure JS fallback)

---

**You're all set! The app is working, NFT UI is ready, and you can configure Solana whenever you're ready.** 🎮✨

