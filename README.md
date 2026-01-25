# ConU Hax X

A hackathon platform featuring AI-powered coding challenges, real-time code execution, and blockchain-based achievement badges.

## Features

- 🎯 AI-generated coding challenges using Google Gemini ✅ **CONFIGURED**
- 💻 In-browser code editor with syntax highlighting
- 🏃 Secure code execution environment
- 🏆 Solana blockchain-based NFT badges and medals
- 📊 User dashboard and progress tracking
- 🔐 MongoDB database for persistent storage

## ✨ Recent Updates

- **Gemini AI Integration**: Fully configured and ready to use
  - Test page: `/test-gemini`
  - API endpoints for ticket generation and evaluation
  - Comprehensive prompt templates
  - See `GEMINI_SETUP_COMPLETE.md` for details

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API routes, Mongoose (MongoDB)
- **AI**: Google Gemini API
- **Blockchain**: Solana Web3.js, Metaplex
- **Code Editor**: Monaco Editor (VSCode editor)

## Prerequisites

Before you begin, ensure you have installed:

- Node.js 18.x or higher
- npm or yarn
- MongoDB (local or Atlas account)
- Solana CLI (for blockchain features)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ConU_Hax_X.git
   cd ConU_Hax_X/conu-hax-x
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your configuration:
   
   - **MongoDB**: Get a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or use local MongoDB
   - **Gemini API**: ✅ Already configured! Test at http://localhost:3000/test-gemini
   - **Solana**: Use devnet for testing or mainnet for production

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
conu-hax-x/
├── app/                    # Next.js app directory
│   ├── dashboard/         # User dashboard page
│   ├── ticket/           # Ticket/challenge pages
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── CodeEditor.tsx    # Monaco code editor
│   ├── FileExplorer.tsx  # File navigation component
│   ├── Passport.tsx      # User profile/passport
│   └── TicketView.tsx    # Challenge display
├── lib/                   # Utility libraries
│   ├── gemini.ts         # Gemini AI integration
│   ├── mongodb.ts        # MongoDB connection
│   ├── runner.ts         # Code execution
│   └── solana.ts         # Blockchain integration
├── models/               # MongoDB schemas
│   ├── Attempt.ts        # Solution attempts
│   ├── Badge.ts          # Achievement badges
│   ├── Ticket.ts         # Challenges/tickets
│   └── User.ts           # User profiles
├── prompts/              # AI prompts
│   ├── codeReviewFeedback.ts
│   ├── evaluateSolution.ts
│   └── generateTicket.ts
├── runner/               # Code execution service
│   └── execute.js
└── services/             # Business logic
    ├── badgeService.ts
    ├── evaluationService.ts
    └── ticketService.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

### MongoDB Setup

For local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/conu-hax-x
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/conu-hax-x
```

### Solana Setup

For development (using devnet):
```
SOLANA_RPC_URL=https://api.devnet.solana.com
```

Generate a keypair:
```bash
solana-keygen new
```

## Security Notes

- Never commit `.env` files to version control
- Keep API keys and private keys secure
- Use environment variables for all sensitive data
- Run code execution in a sandboxed environment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@conuhax.com or open an issue on GitHub.
