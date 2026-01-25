# 🆓 Free Code Execution - Self-Hosted Judge0

## Setup (5 minutes, 100% Free)

### Step 1: Install Docker

**Mac:**
```bash
brew install --cask docker
# Open Docker Desktop from Applications
```

**Windows:**
- Download Docker Desktop from docker.com
- Install and start it

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Step 2: Start Judge0

```bash
# Create a directory for Judge0
mkdir judge0-server
cd judge0-server

# Download docker-compose file
curl -o docker-compose.yml https://raw.githubusercontent.com/judge0/judge0/master/docker-compose.yml

# Start Judge0 (this will download everything automatically)
docker-compose up -d
```

Wait 30 seconds for it to start. That's it!

### Step 3: Add to Your `.env` File

```bash
# No API key needed for self-hosted!
JUDGE0_API_URL=http://localhost:2358
JUDGE0_API_KEY=
```

### Step 4: Test It Works

```bash
# Test submission
curl -X POST "http://localhost:2358/submissions?wait=true" \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "console.log(\"Hello World\");",
    "language_id": 63
  }'
```

You should see output with "Hello World" ✅

---

## What You Get (All FREE):

- ✅ **Unlimited** code executions
- ✅ **No credit card** required
- ✅ **No API limits**
- ✅ **All languages** supported
- ✅ **Runs locally** on your machine
- ✅ **Same tech** as LeetCode
- ✅ **100% private** - code never leaves your computer

---

## Managing Judge0

### Start Judge0:
```bash
cd judge0-server
docker-compose up -d
```

### Stop Judge0:
```bash
cd judge0-server
docker-compose down
```

### Check Status:
```bash
docker ps
```

You should see containers running with names like:
- `judge0-server`
- `judge0-workers`
- `judge0-db`

---

## System Requirements

- **RAM**: 2GB minimum (4GB recommended)
- **Disk**: 2GB for Docker images
- **OS**: Mac, Windows, or Linux

---

## Troubleshooting

### "Docker not found"
- Install Docker Desktop and make sure it's running

### "Port 2358 already in use"
- Change port in docker-compose.yml
- Update JUDGE0_API_URL in .env

### "Container exits immediately"
- Check logs: `docker-compose logs`
- Ensure Docker has enough memory (Settings → Resources)

---

## For Production

When you deploy to production (Vercel, AWS, etc.):

1. **Option 1**: Deploy Judge0 to same server
   - Include Judge0 in your docker-compose
   - Use internal network (faster, free)

2. **Option 2**: Separate Judge0 server
   - Deploy Judge0 to Railway/Render (free tier available)
   - Point JUDGE0_API_URL to that server

3. **Option 3**: RapidAPI for scaling
   - If you need 1000+ executions/day
   - Still cheaper than building your own

---

## Next Steps

1. ✅ Start Judge0: `docker-compose up -d`
2. ✅ Add to `.env`: `JUDGE0_API_URL=http://localhost:2358`
3. ✅ Seed quest: `npx tsx scripts/seed-project-nexus.ts`
4. ✅ Test: Navigate to `/test-quest`

🎉 You now have free, unlimited code execution!
