# WatchTower

Professional Website Monitoring SaaS — know when your site is down before your users do.

A production-ready full-stack monitoring platform built with React, Express, PostgreSQL, and Prisma.

---

## Project Structure

```
watchtower/
├── backend/                  # Express API server
│   ├── prisma/schema.prisma  # Full DB schema
│   ├── src/
│   │   ├── config/           # App configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── lib/              # Prisma client
│   │   ├── middleware/       # Auth + rate limiting
│   │   ├── routes/           # Express routers
│   │   ├── utils/            # JWT, mailer, logger
│   │   └── workers/          # Background monitoring engine
│   ├── .env.example
│   └── package.json
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # Dashboard layout
│   │   ├── lib/              # Axios API client
│   │   ├── pages/            # Landing, auth, dashboard pages
│   │   └── store/            # Zustand auth store
│   ├── .env.example
│   └── package.json
├── render.yaml               # Render.com deployment blueprint
└── README.md
```

---

## Deploy on Render.com — Step by Step

### Prerequisites
- Render.com account (free tier works to start)
- Code pushed to GitHub or GitLab
- SMTP credentials (Gmail App Password, Resend, SendGrid)

---

### Step 1 — Push Code to GitHub

Initialize git in the project folder and push to your GitHub repository. Then connect that repo on Render.

---

### Step 2 — Create the PostgreSQL Database

1. Render dashboard → New + → PostgreSQL
2. Settings:
   - Name: watchtower-db
   - Database: watchtower
   - User: watchtower_admin
   - Region: Oregon
   - Plan: Free or Starter
3. Click Create Database — wait ~2 minutes
4. Copy the Internal Database URL

---

### Step 3 — Deploy the Backend API

1. New + → Web Service → connect your repo
2. Settings:
   - Name: watchtower-api
   - Root Directory: backend
   - Runtime: Node
   - Build Command: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   - Start Command: node dist/index.js
   - Region: Oregon
3. Environment Variables:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 5000 |
| DATABASE_URL | (Internal DB URL from Step 2) |
| JWT_SECRET | (random 64-char string) |
| JWT_EXPIRES_IN | 7d |
| FRONTEND_URL | (fill after Step 4) |
| SMTP_HOST | smtp.gmail.com |
| SMTP_PORT | 587 |
| SMTP_USER | your@gmail.com |
| SMTP_PASS | (Gmail App Password) |
| SMTP_FROM | WatchTower noreply@yourdomain.com |

4. Create Web Service — build takes 3-5 minutes
5. Copy your API URL: https://watchtower-api-xxxx.onrender.com

---

### Step 4 — Deploy the Frontend

1. New + → Static Site → connect your repo
2. Settings:
   - Name: watchtower-frontend
   - Root Directory: frontend
   - Build Command: npm install && npm run build
   - Publish Directory: dist
3. Environment Variables:

| Key | Value |
|-----|-------|
| VITE_API_URL | https://watchtower-api-xxxx.onrender.com/api/v1 |

4. Redirect/Rewrite Rules:
   - Source: /*  Destination: /index.html  Type: Rewrite
   (This enables React Router — critical step!)

5. Create Static Site
6. Copy your frontend URL: https://watchtower-frontend-xxxx.onrender.com

---

### Step 5 — Update FRONTEND_URL on Backend

1. Go to watchtower-api → Environment tab
2. Update FRONTEND_URL = https://watchtower-frontend-xxxx.onrender.com
3. Save Changes (auto-redeploys)

---

### Step 6 — Verify Everything Works

Visit: https://watchtower-api-xxxx.onrender.com/api/v1/health
Expected: {"status":"ok","timestamp":"..."}

Visit your frontend URL → register → check email → verify → login → add your first monitor.

---

## Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to: myaccount.google.com/apppasswords
3. App: Mail, Device: Other (WatchTower)
4. Copy the 16-character app password → use as SMTP_PASS

Alternative SMTP providers (recommended for production):
- Resend (resend.com) — 3,000 emails/month free, easiest setup
- SendGrid — 100 emails/day free
- Mailgun — 5,000 emails/month free (3 months)

---

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your local DATABASE_URL and SMTP settings

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

API runs on http://localhost:5000

### Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api/v1

npm install
npm run dev
```

Frontend runs on http://localhost:3000

---

## Database Schema

| Table | Purpose |
|-------|---------|
| User | Accounts, email verification, password reset |
| Monitor | URL/API/SSL/Domain monitors per user |
| Check | Individual check results (status, response time) |
| Incident | Downtime periods with duration tracking |
| AlertConfig | Email/Slack/Discord notification channels |
| Subscription | Plan limits (Free=5, Starter=20, Pro=100, Business=500) |
| AuditLog | Security audit trail |

---

## API Reference

### Auth (public)
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET  /api/v1/auth/me (protected)
- GET  /api/v1/auth/verify-email?token=
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password

### Monitors (all protected via Bearer token)
- GET    /api/v1/monitors
- POST   /api/v1/monitors
- GET    /api/v1/monitors/stats
- GET    /api/v1/monitors/:id
- PUT    /api/v1/monitors/:id
- DELETE /api/v1/monitors/:id
- PATCH  /api/v1/monitors/:id/pause

### Incidents
- GET /api/v1/incidents
- GET /api/v1/incidents/checks/:monitorId

### Alerts
- GET    /api/v1/alerts
- POST   /api/v1/alerts
- PUT    /api/v1/alerts/:id
- DELETE /api/v1/alerts/:id

### Profile
- PUT /api/v1/profile/update
- PUT /api/v1/profile/change-password

---

## Monitoring Worker

The background monitoring worker runs inside the API process (no Redis required). It:
- Polls due monitors every 30 seconds in batches of 50
- Makes HTTP checks with configurable timeout
- Stores results in the Check table
- Calculates rolling uptime over last 100 checks
- Creates/resolves Incident records automatically
- Triggers email alerts on status changes (DOWN/RECOVERED)

For production scale (1000+ monitors), replace the in-process worker with:
- Bull queue + separate worker service (Redis required)
- Add the worker as a separate Render Background Worker service

---

## Security

- JWT authentication with configurable expiry
- bcrypt password hashing (12 salt rounds)
- Rate limiting: 20 requests/15min on auth endpoints, 200 req/min on API
- Helmet.js security headers
- CORS restricted to FRONTEND_URL
- Email verification on registration
- Secure password reset with 1-hour token expiry
- Audit logs for login events
- All secrets via environment variables

---

## Plans & Limits

| Plan | Monitors | Check Interval | Price |
|------|----------|----------------|-------|
| Free | 5 | 5 min | $0 |
| Starter | 20 | 1 min | $9/mo |
| Pro | 100 | 30 sec | $29/mo |
| Business | 500 | 15 sec | $99/mo |

---

## Roadmap

- WhatsApp alerts (Twilio)
- Telegram bot alerts
- Discord webhook alerts
- Slack workspace alerts
- Public status pages
- Multi-region check nodes
- Two-factor authentication
- Team/organization accounts
- Bull queue for scale
- PDF/CSV report export

---

## License

MIT — free to use, modify, and deploy commercially.
