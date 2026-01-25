# 🎯 NFT Wallet Integration - Installation & Setup

## 📦 Required Packages

### Missing Dependencies
The following Solana packages need to be installed:

```bash
cd conu-hax-x
npm install @solana/web3.js @metaplex-foundation/js
```

**Note:** These packages were mentioned in the original summary but need to be installed if not already present.

---

## ✅ Complete Setup Checklist

### 1. Install Dependencies
```bash
npm install @solana/web3.js @metaplex-foundation/js
```

### 2. Verify Environment Variables
Edit `conu-hax-x/.env`:
```env
# Solana Configuration (Required for NFT minting)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_base58_private_key_here

# MongoDB (Existing)
MONGODB_URI=mongodb+srv://...

# NextAuth (Existing)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
```

### 3. Test Installation
```bash
# Start development server
npm run dev

# Visit these URLs to test:
# 1. Profile page: http://localhost:3000/profile/[userId]
# 2. Component preview: http://localhost:3000/nft-preview
```

---

## 🗂️ Files Summary

### ✨ New Files Created

#### Components (7 files)
1. `components/PhantomWalletConnect.tsx` - Main wallet widget
2. `components/UserBadgesDisplay.tsx` - Badge grid with NFT status
3. `components/ProfileClientWrapper.tsx` - Client wrapper
4. `components/ChallengeCompletionNotification.tsx` - Completion alerts

#### API Routes (1 file)
5. `app/api/user-badges/route.ts` - Badge status endpoint

#### Pages (1 file)
6. `app/nft-preview/page.tsx` - Component preview/demo

#### Documentation (3 files)
7. `NFT_USER_GUIDE.md` - Complete user guide
8. `NFT_WALLET_INTEGRATION_SUMMARY.md` - Technical summary
9. `PHANTOM_WALLET_QUICKSTART.md` - Quick start guide

### 📝 Modified Files

1. `app/profile/[userId]/page.tsx`
   - Added wallet widget in sidebar
   - Replaced badge display with NFT-aware version

---

## 🚀 Quick Test Commands

### Check if Phantom is installed
Open browser console and run:
```javascript
window.solana?.isPhantom
// Should return: true (if installed) or undefined (not installed)
```

### Test API endpoints
```bash
# Get wallet status
curl http://localhost:3000/api/connect-wallet?userId=YOUR_USER_ID

# Get badge status
curl http://localhost:3000/api/user-badges?userId=YOUR_USER_ID
```

---

## 🎯 User Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Completes Challenge             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Badge Earned (DB)   │
        │  ✓ Always happens    │
        └──────────┬───────────┘
                   │
        ┌──────────▼───────────┐
        │ Wallet Connected?    │
        └──┬──────────────┬────┘
           │              │
          NO             YES
           │              │
           ▼              ▼
    ┌──────────────┐  ┌────────────────┐
    │ Show badge   │  │ Mint NFT       │
    │ on profile   │  │ to wallet      │
    └──────────────┘  └────────────────┘
                         │
                         ▼
                   ┌──────────────┐
                   │ Update DB    │
                   │ nftAddress   │
                   └──────────────┘
                         │
                         ▼
                   ┌──────────────┐
                   │ Show NFT     │
                   │ indicator    │
                   └──────────────┘
```

---

## 📊 Architecture Overview

### Frontend (React Components)
```
PhantomWalletConnect
  ├─ Checks wallet status
  ├─ Connects to Phantom
  ├─ Sends address to API
  └─ Shows success/error

UserBadgesDisplay
  ├─ Fetches badge data
  ├─ Shows NFT indicators
  ├─ Hover tooltips
  └─ Loading states

ChallengeCompletionNotification
  ├─ Shows badge earned
  ├─ NFT minted status
  └─ Wallet connect prompt
```

### Backend (API Routes)
```
/api/connect-wallet
  ├─ POST: Connect wallet, claim NFTs
  └─ GET: Check wallet status

/api/user-badges
  └─ GET: Fetch badge & NFT data

/api/claim-nft
  ├─ POST: Claim specific NFT
  └─ PUT: Claim all NFTs
```

### Services (Business Logic)
```
nftRewardService
  ├─ awardBadge() - Off-chain badge
  ├─ mintCompletionNFT() - On-chain NFT
  └─ claimAllBadgeNFTs() - Batch claim

solana
  ├─ initializeSolana() - Setup Metaplex
  ├─ uploadMetadata() - IPFS/Arweave
  └─ mintNFT() - Mint to wallet
```

---

## 🧪 Testing Checklist

### Manual Tests
- [ ] Install Phantom wallet extension
- [ ] Connect wallet from profile page
- [ ] Disconnect and reconnect
- [ ] Complete a challenge (earn badge)
- [ ] Verify NFT indicator appears
- [ ] Hover to see NFT address
- [ ] Check Phantom wallet for NFT
- [ ] Test without wallet connected
- [ ] Test with wallet already connected to another account

### Browser Tests
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if supported)
- [ ] Mobile browsers (optional)

### API Tests
```bash
# Test connect wallet
curl -X POST http://localhost:3000/api/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","walletAddress":"ABC123..."}'

# Test get badges
curl http://localhost:3000/api/user-badges?userId=test123
```

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found: @solana/web3.js"
**Fix:**
```bash
npm install @solana/web3.js @metaplex-foundation/js
```

### Issue: "window.solana is undefined"
**Fix:**
- Install Phantom from phantom.app
- Refresh page
- Check browser extensions

### Issue: "Failed to mint NFT"
**Fix:**
- Check `SOLANA_RPC_URL` in .env
- Verify `SOLANA_PRIVATE_KEY` is correct
- Check Solana network status
- Ensure sufficient SOL for fees

### Issue: Badges not loading
**Fix:**
- Check MongoDB connection
- Verify API endpoint is accessible
- Check browser console for errors
- Clear browser cache

---

## 📖 Documentation Links

### For End Users
📘 **[NFT_USER_GUIDE.md](./NFT_USER_GUIDE.md)**
- Installation guide
- How to connect wallet
- How to claim NFTs
- FAQ & troubleshooting

### For Developers
📗 **[BADGE_AND_NFT_SYSTEM.md](./BADGE_AND_NFT_SYSTEM.md)**
- System architecture
- Database schema
- API specifications
- Integration guide

### Implementation Details
📙 **[NFT_WALLET_INTEGRATION_SUMMARY.md](./NFT_WALLET_INTEGRATION_SUMMARY.md)**
- Files created/modified
- Testing checklist
- Deployment guide
- Success metrics

### Quick Reference
📕 **[PHANTOM_WALLET_QUICKSTART.md](./PHANTOM_WALLET_QUICKSTART.md)**
- Quick start guide
- Common tasks
- Troubleshooting
- Customization

---

## 🎉 Ready to Go!

After completing the setup checklist above, your NFT wallet integration will be fully functional!

### Next Steps:
1. ✅ Install dependencies: `npm install @solana/web3.js @metaplex-foundation/js`
2. ✅ Configure environment variables
3. ✅ Test locally: `npm run dev`
4. ✅ Visit `/nft-preview` to see components
5. ✅ Test wallet connection on profile page
6. ✅ Deploy to staging/production

### Key Features:
- 🎁 **Auto-claim** - Existing badges become NFTs when wallet connects
- 🔗 **Visual indicators** - See which badges are NFTs
- 💎 **Optional** - Platform works perfectly without wallet
- 🚀 **Automatic** - Future badges auto-mint as NFTs

---

**Happy Building! 🎮🚀**

*For support, check the documentation or contact the development team.*
