# Deployment Guide (Railway)

## What this is
- **Frontend**: React + Vite (`artifacts/workshop/`)
- **Backend**: Express + Node.js (`artifacts/api-server/`)
- **Database**: PostgreSQL via Drizzle ORM (`lib/db/`)

## Steps

### 1. Push to GitHub
Create a GitHub repo and push this folder to it.

### 2. Deploy on Railway (railway.app)
1. Sign up at railway.app with your GitHub account
2. New Project → Deploy from GitHub repo → select your repo
3. Click **+ New** → Database → Add PostgreSQL
4. Railway auto-creates a `DATABASE_URL` env var

### 3. Set Environment Variables in Railway
| Variable | Value |
|---|---|
| `DATABASE_URL` | (auto-set by Railway Postgres) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 4. Set Build & Start Commands in Railway
- **Build command**: `npm install -g pnpm && pnpm install && pnpm build`
- **Start command**: `node artifacts/api-server/dist/index.mjs`

### 5. Run DB migrations (first deploy only)
In Railway's terminal for your service:
```
pnpm --filter @workspace/db drizzle-kit push
```

### 6. Done!
Railway gives you a free `.railway.app` URL.
