# Quick Setup Guide

## ✅ Installation Complete!

All dependencies have been installed successfully. Here's what was set up:

### Installed Packages

**Core Framework:**
- Next.js 16.1.4 (latest stable)
- React 19.2.3
- TypeScript 5.9.3

**AI & Blockchain:**
- Google Gemini AI (@google/generative-ai)
- Solana Web3.js
- Metaplex (NFT minting)

**Database:**
- Mongoose (MongoDB ODM)

**UI Components:**
- Monaco Editor (code editor)
- TailwindCSS (styling)

**Dev Tools:**
- ESLint
- PostCSS & Autoprefixer

## Next Steps

### 1. Configure Environment Variables

Create a `.env` file in the `conu-hax-x` directory:

```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your_solana_private_key
```

#### Getting API Keys:

**MongoDB:**
- Local: `mongodb://localhost:27017/conu-hax-x`
- Cloud: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

**Gemini API:**
- Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

**Solana:**
- Install Solana CLI: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`
- Generate keypair: `solana-keygen new`
- Get devnet SOL: `solana airdrop 2 --url devnet`

### 2. Start Development Server

```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
npm run build
npm start
```

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, specify a different port:
```bash
npm run dev -- -p 3001
```

### MongoDB Connection Issues
- Ensure MongoDB is running locally, or
- Check your Atlas connection string is correct
- Verify IP whitelist in MongoDB Atlas

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run build
```

## Project Status

✅ Dependencies installed
✅ TypeScript configured
✅ TailwindCSS set up
✅ Next.js configured
✅ MongoDB ready to connect
✅ Gemini AI ready to integrate
✅ Solana Web3 ready

⚠️ Need to configure: Environment variables
⚠️ Need to implement: Component logic
⚠️ Need to setup: Database schemas

## Development Workflow

1. Create/edit components in `components/`
2. Add pages in `app/`
3. Define MongoDB models in `models/`
4. Implement services in `services/`
5. Configure AI prompts in `prompts/`
6. Test locally with `npm run dev`
7. Build and deploy with `npm run build`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Solana Documentation](https://docs.solana.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

Happy coding! 🚀
