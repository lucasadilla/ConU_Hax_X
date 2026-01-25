# 🔧 Judge0 Setup Guide

## What is Judge0?

Judge0 is an open-source online code execution system. It's the same technology used by:
- LeetCode
- HackerRank
- CodeChef
- Many competitive programming platforms

## Option 1: Use Judge0 RapidAPI (Easiest)

### Step 1: Get API Key

1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Sign up for free
3. Subscribe to the free tier (50 requests/day)
4. Copy your API key

### Step 2: Add to .env

```bash
# Judge0 API Configuration
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
```

### Free Tier Limits:
- ✅ 50 requests/day
- ✅ All major languages supported
- ✅ 5 second execution timeout
- ✅ 128MB memory limit

### Paid Tiers (if needed):
- **Basic**: $10/month - 500 req/day
- **Pro**: $50/month - 5000 req/day
- **Ultra**: $200/month - 50000 req/day

---

## Option 2: Self-Host Judge0 (Unlimited, Free)

### Requirements:
- Docker & Docker Compose
- 2GB RAM minimum
- Linux/MacOS/Windows with WSL2

### Step 1: Clone Judge0

```bash
git clone https://github.com/judge0/judge0.git
cd judge0
```

### Step 2: Start Judge0

```bash
docker-compose up -d
```

Judge0 will be available at `http://localhost:2358`

### Step 3: Add to .env

```bash
# Judge0 Self-Hosted Configuration
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=  # Leave empty for self-hosted
```

### Advantages:
- ✅ Unlimited requests
- ✅ No costs
- ✅ Full control
- ✅ Better performance (local)
- ✅ Privacy (code never leaves your server)

---

## Testing Judge0

### Test with curl:

```bash
# Submit code
curl -X POST "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false" \
  -H "Content-Type: application/json" \
  -H "X-RapidAPI-Key: YOUR_KEY" \
  -H "X-RapidAPI-Host: judge0-ce.p.rapidapi.com" \
  -d '{
    "source_code": "console.log(\"Hello World\");",
    "language_id": 63
  }'

# Get result
curl "https://judge0-ce.p.rapidapi.com/submissions/TOKEN?base64_encoded=false" \
  -H "X-RapidAPI-Key: YOUR_KEY" \
  -H "X-RapidAPI-Host: judge0-ce.p.rapidapi.com"
```

---

## Language IDs

- JavaScript (Node.js): **63**
- TypeScript: **74**
- Python 3: **71**
- Java: **62**
- C++: **54**
- C: **50**
- Go: **60**
- Rust: **73**

[Full list of languages](https://github.com/judge0/judge0/blob/master/CHANGELOG.md#executors)

---

## How It Works in Our System

1. **User submits code** → `/api/quest/submit`
2. **Code is sent to Judge0** with test input
3. **Judge0 compiles and runs** code in isolated container
4. **Result is returned** (stdout, stderr, status)
5. **We compare output** with expected output
6. **User gets feedback** (pass/fail, error messages)

---

## Status Codes

Judge0 returns status codes:

- **1-2**: In Queue / Processing
- **3**: Accepted ✅
- **4**: Wrong Answer ❌
- **5**: Time Limit Exceeded ⏱️
- **6**: Compilation Error 🔴
- **11-12**: Runtime Error 💥
- **13**: Internal Error 🔧

---

## Rate Limiting Recommendations

For production with RapidAPI free tier (50 req/day):

- Each submission = 1 request per test case
- 3-stage quest with 6 test cases each = 18 requests per attempt
- ~2-3 full attempts per user per day

**Recommendations:**
1. Start with RapidAPI free tier for testing
2. Upgrade to Basic ($10/mo) when you have 10+ daily users
3. Self-host when you have 50+ daily users

---

## Troubleshooting

### "API key is invalid"
- Check your RapidAPI key is correct
- Make sure you're subscribed to Judge0 CE on RapidAPI

### "Connection refused"
- If self-hosting, check Docker containers are running: `docker ps`
- Check Judge0 is accessible: `curl http://localhost:2358`

### "Timeout"
- Judge0 might be slow, increase polling attempts
- Check network connectivity

### "Memory limit exceeded"
- User code uses too much memory
- This is expected for bad solutions

---

## Security

Judge0 runs code in isolated Docker containers:
- ✅ No access to your server
- ✅ Limited CPU/memory
- ✅ Time limits enforced
- ✅ Network access disabled
- ✅ File system is read-only

It's **safe** to run untrusted user code!

---

## Next Steps

1. Get Judge0 API key or self-host
2. Add credentials to `.env`
3. Run seed script: `npx tsx scripts/seed-project-nexus.ts`
4. Test at `/test-quest`

🚀 Your code execution is now powered by industry-standard technology!
