# 🔧 Phantom Wallet Troubleshooting Guide

## Common Errors & Solutions

### Error: "Unexpected error" when connecting

**Causes:**
1. User rejected the connection in Phantom
2. Phantom extension is locked
3. Browser extension conflict
4. Phantom not properly installed

**Solutions:**

#### Solution 1: Approve the Connection
```
1. Click "Connect Phantom Wallet"
2. Phantom popup will appear
3. Click "Connect" or "Approve" 
4. Do NOT close the popup
5. Wait for confirmation
```

#### Solution 2: Unlock Phantom
```
1. Click Phantom extension icon
2. Enter your password
3. Try connecting again
```

#### Solution 3: Reload and Retry
```
1. Refresh the page (F5 or Cmd+R)
2. Try connecting again
3. Make sure to approve in Phantom
```

#### Solution 4: Check Extension
```
1. Go to chrome://extensions/ (or browser://extensions/)
2. Find "Phantom"
3. Make sure it's enabled
4. Try refreshing the page
```

---

## Detailed Error Messages

### "Phantom wallet not found"

**What it means:** The Phantom extension is not installed or not detected.

**Fix:**
1. Install from [phantom.app](https://phantom.app)
2. Refresh the page
3. Make sure browser extension is enabled

---

### "Connection rejected"

**What it means:** You clicked "Cancel" or "Reject" in the Phantom popup.

**Fix:**
1. Click "Connect Phantom Wallet" again
2. This time click "Connect" or "Approve"
3. Wait for the success message

---

### "Failed to get wallet address"

**What it means:** Phantom connected but didn't provide an address.

**Fix:**
1. Make sure you have a wallet set up in Phantom
2. Try disconnecting and reconnecting
3. Check if Phantom is on the correct network (Mainnet/Devnet)

---

### "Wallet already connected to another account"

**What it means:** This wallet address is already linked to a different user account.

**Fix:**
1. Use a different wallet address
2. Or contact support to unlink the wallet from the other account

---

## Testing Workflow

### For Development/Testing:

1. **Install Phantom**
   ```
   1. Visit phantom.app
   2. Click "Download"
   3. Install browser extension
   4. Create or import wallet
   ```

2. **Get Test SOL (Devnet)**
   ```
   1. Switch Phantom to Devnet:
      - Click settings (⚙️)
      - Change network to "Devnet"
   
   2. Get your wallet address:
      - Click on your wallet name
      - Copy address
   
   3. Get free test SOL:
      - Visit faucet.solana.com
      - Paste your address
      - Click "Airdrop"
   ```

3. **Connect to App**
   ```
   1. Go to your profile page
   2. Click "Connect Phantom Wallet"
   3. Approve in popup
   4. See success message
   ```

---

## Browser Compatibility

### Supported Browsers:
- ✅ Chrome/Chromium
- ✅ Brave
- ✅ Edge
- ✅ Firefox (with Phantom extension)
- ❌ Safari (Phantom not available as extension)

### Mobile:
- ✅ Phantom mobile app (iOS/Android)
- ⚠️ Use in-app browser for best results
- ⚠️ External browsers may not work

---

## Debug Mode

### Enable Console Logs:

1. **Open Browser Console:**
   - Windows/Linux: `Ctrl + Shift + J`
   - Mac: `Cmd + Option + J`

2. **Try connecting wallet**

3. **Check console for:**
   ```
   ✅ "Using existing Phantom connection"
   ✅ "New Phantom connection established"
   ❌ Error messages with details
   ```

---

## Common Scenarios

### Scenario 1: First Time User

**Steps:**
1. Install Phantom → Create wallet → Connect to app
2. You'll see: "Wallet connected! Complete challenges to earn NFT badges."
3. No existing badges to claim (normal for new users)

---

### Scenario 2: Existing User Connecting Wallet

**Steps:**
1. You already have badges from completing challenges
2. Connect Phantom wallet
3. You'll see: "Success! X NFTs claimed for your existing badges! 🎉"
4. Check Phantom's "Collectibles" tab for NFTs

---

### Scenario 3: Reconnecting

**Steps:**
1. You disconnected your wallet
2. Click "Connect Phantom Wallet" again
3. Phantom may auto-connect (if trusted)
4. Or you'll need to approve again

---

## Network Considerations

### Development (Devnet)
```
- Free test SOL from faucet
- NFTs have no real value
- Perfect for testing
- Switch in Phantom settings
```

### Production (Mainnet)
```
- Real SOL required for fees
- NFTs have real value
- Users need actual SOL
- Default Phantom network
```

**Note:** Make sure your app's `SOLANA_RPC_URL` matches the network you're testing on!

---

## Security Best Practices

### For Users:
1. ✅ Only connect to trusted sites
2. ✅ Review what you're signing
3. ✅ Keep seed phrase secret
4. ✅ Use strong Phantom password
5. ❌ Never share private keys

### For Developers:
1. ✅ Use HTTPS in production
2. ✅ Validate wallet addresses
3. ✅ Handle rejections gracefully
4. ✅ Show clear error messages
5. ✅ Log errors for debugging

---

## Still Having Issues?

### Quick Fixes:
1. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear cache**: Clear browser cache and cookies
3. **Try incognito**: Test in private/incognito mode
4. **Update Phantom**: Make sure you have the latest version
5. **Restart browser**: Close and reopen your browser

### Check These:
- [ ] Phantom extension is installed and enabled
- [ ] Phantom is unlocked
- [ ] You're on the correct network (Devnet/Mainnet)
- [ ] Browser console shows no errors
- [ ] App server is running (http://localhost:3000)

---

## Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 4001 | User rejected | Click "Approve" in Phantom |
| 4100 | Not authorized | Unlock Phantom first |
| -32603 | Internal error | Refresh and retry |

---

## Testing Checklist

Before reporting an issue, try:
- [ ] Refresh the page
- [ ] Unlock Phantom wallet
- [ ] Check browser console for errors
- [ ] Try connecting in incognito mode
- [ ] Restart browser
- [ ] Check if Phantom extension is enabled
- [ ] Try a different browser

---

## Getting Help

### Self-Service:
1. Check browser console (F12)
2. Read error message carefully
3. Try solutions in this guide
4. Check Phantom's official docs

### Need More Help?
1. Include error message
2. Include browser/OS info
3. Include steps to reproduce
4. Check if issue persists in incognito mode

---

## Advanced Debugging

### Check Phantom State:
```javascript
// In browser console:
console.log(window.solana);
console.log(window.solana?.isPhantom);
console.log(window.solana?.isConnected);
console.log(window.solana?.publicKey?.toString());
```

### Manual Connect Test:
```javascript
// In browser console:
async function testConnect() {
  try {
    const resp = await window.solana.connect();
    console.log('Success!', resp.publicKey.toString());
  } catch (err) {
    console.error('Failed:', err);
  }
}
testConnect();
```

---

**Most issues are solved by refreshing and approving the connection in Phantom!** 🎮✨
