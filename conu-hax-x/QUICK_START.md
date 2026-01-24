# 🚀 Quick Start Guide

## ConU Hacks X - Ready to Code!

### Status: ✅ All Dependencies Installed & Gemini AI Configured

---

## 🎯 What's Ready

✅ Next.js 16 + React 19 + TypeScript  
✅ TailwindCSS for styling  
✅ **Gemini AI fully configured**  
✅ MongoDB integration ready  
✅ Solana Web3 integration ready  
✅ Monaco Code Editor  
✅ 690 npm packages installed

---

## 🏃 Start Development (3 Steps)

### 1. Navigate to project
```bash
cd conu-hax-x
```

### 2. Start dev server
```bash
npm run dev
```

### 3. Open browser
```
http://localhost:3000
```

---

## 🧪 Test Gemini AI

Visit: **http://localhost:3000/test-gemini**

This page lets you:
- ✅ Test API connection
- ✅ Generate sample tickets
- ✅ See real AI responses

---

## 📝 What You Need to Know

### Gemini AI is CONFIGURED ✨
- **Project**: conuhacksx
- **API Key**: Already set in `.env`
- **Test Page**: `/test-gemini`
- **Docs**: See `GEMINI_SETUP_COMPLETE.md`

### Still Need Setup
- ⚠️ MongoDB connection string (optional for now)
- ⚠️ Solana private key (optional for now)

---

## 🔑 Environment Variables

Current `.env` file has:
```env
✅ GEMINI_API_KEY          # Ready
✅ GEMINI_PROJECT_NAME     # conuhacksx
✅ GEMINI_PROJECT_ID       # projects/911472020955
⚠️ MONGODB_URI            # Set when you need database
⚠️ SOLANA_PRIVATE_KEY     # Set when you need blockchain
```

---

## 📚 Available API Endpoints

### Test Gemini
```bash
GET http://localhost:3000/api/test-gemini
```

### Generate Ticket
```bash
POST http://localhost:3000/api/tickets/generate
Body: { "difficulty": "easy", "topic": "arrays", "language": "javascript" }
```

### Evaluate Solution
```bash
POST http://localhost:3000/api/evaluate
Body: { "problemDescription": "...", "solution": "...", "language": "javascript" }
```

---

## 🛠️ Common Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Check code quality
```

---

## 📖 Documentation Files

- `README.md` - Main project documentation
- `SETUP.md` - Detailed setup instructions
- `GEMINI_SETUP_COMPLETE.md` - Gemini AI configuration details
- `GEMINI_USAGE_EXAMPLES.md` - Code examples for using Gemini
- `INSTALLATION_COMPLETE.md` - Full installation summary

---

## 🎨 Project Structure

```
conu-hax-x/
├── app/                # Pages and routes
│   ├── api/           # API endpoints (Gemini, tickets, etc.)
│   ├── test-gemini/   # Gemini test page ← START HERE
│   └── page.tsx       # Home page
├── lib/               # Core utilities
│   └── gemini.ts     # Gemini AI integration ← READY
├── prompts/           # AI prompts ← READY
└── components/        # React components
```

---

## 🎯 Next Steps

### Immediate (You can do right now)
1. ✅ Run `npm run dev`
2. ✅ Visit http://localhost:3000/test-gemini
3. ✅ Test Gemini API
4. ✅ Generate a sample ticket

### Soon (When ready)
1. Set up MongoDB for data persistence
2. Implement component UI
3. Add Solana for NFT badges
4. Build user authentication

### Build Features
1. Ticket generation system
2. Code editor interface
3. Solution evaluation
4. User dashboard
5. Badge/NFT minting

---

## 💡 Quick Examples

### Generate a Ticket
```typescript
const response = await fetch('/api/tickets/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    difficulty: 'easy',
    topic: 'arrays',
    language: 'javascript'
  })
});
const { ticket } = await response.json();
```

### Evaluate Code
```typescript
const response = await fetch('/api/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    problemDescription: 'Reverse a string',
    solution: 'function reverse(s) { return s.split("").reverse().join(""); }',
    language: 'javascript'
  })
});
const { evaluation } = await response.json();
```

---

## 🆘 Troubleshooting

### Port 3000 in use?
```bash
npm run dev -- -p 3001
```

### Need to reinstall?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Gemini not working?
1. Check `.env` file exists
2. Verify `GEMINI_API_KEY` is set
3. Restart dev server
4. Visit `/test-gemini` to test

---

## 🎉 You're Ready!

Everything is installed and configured. Just run:

```bash
npm run dev
```

Then visit: http://localhost:3000/test-gemini

---

**Questions?** Check the documentation files listed above!

**Ready to build?** Start coding in the `app/` and `components/` directories!
