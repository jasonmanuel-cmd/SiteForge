# Construction SaaS - AI-Powered Construction Management Platform

A comprehensive, multi-tenant SaaS platform designed specifically for small to medium-sized general contractors (15-person GCs). This platform automates tedious administrative tasks using AI, integrates with QuickBooks Online, and provides seamless project management tools.

## Features

### Core Features (All Implemented)

- **Multi-Tenant Architecture** - Secure, isolated data for each construction company
- **User Management** - Role-based access control (Owner, PM, Super, Bookkeeper)
- **Project Management** - Track multiple projects with budgets, timelines, and status
- **AI-Powered Invoice Processing** - Upload invoices/receipts, AI extracts data automatically
- **QuickBooks Integration** - OAuth2 connection, automatic bill creation and sync
- **RFI Management** - Create and track Requests for Information
- **Change Order Tracking** - Manage scope changes with financial impact tracking
- **Daily Reports** - Voice-to-text daily logs from the field
- **File Storage** - Document management with cloud storage support

### AI Capabilities

- **Invoice Extraction** - OCR + AI extracts vendor, amounts, line items, categories
- **Email Classification** - Automatically identifies RFIs and Change Orders from emails
- **Voice Transcription** - Convert superintendent voice logs to structured daily reports
- **Smart Suggestions** - AI suggests project assignments, cost codes, and categories

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: OpenAI GPT-4 & Whisper
- **Integrations**: QuickBooks Online API, Gmail/Microsoft 365 APIs
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Local filesystem (S3-compatible for production)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database (or use Prisma's local PostgreSQL)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**

Edit `.env` file with your credentials:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# OpenAI API (Required for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"

# QuickBooks (Get from developer.intuit.com)
QB_CLIENT_ID="your-quickbooks-client-id"
QB_CLIENT_SECRET="your-quickbooks-client-secret"
QB_REDIRECT_URI="http://localhost:3000/api/integrations/quickbooks/callback"
QB_ENVIRONMENT="sandbox"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

3. **Start local PostgreSQL** (if using Prisma's local DB)
```bash
npx prisma dev
```

4. **Run database migrations**
```bash
npx prisma migrate dev --name init
```

5. **Generate Prisma Client**
```bash
npx prisma generate
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open the app**
Navigate to [http://localhost:3000](http://localhost:3000)

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure-password",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "ABC Construction",
  "phoneNumber": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure-password"
}
```

### Projects

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Main Street Renovation",
  "address": "123 Main St",
  "city": "Bakersfield",
  "state": "CA"
}
```

### Invoices

#### Upload Invoice (AI Processing)
```http
POST /api/invoices/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <invoice-image>
projectId: <project-uuid>
```

### RFIs

#### Create RFI
```http
POST /api/rfis
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "<uuid>",
  "subject": "Clarification needed",
  "question": "What is the required outlet spacing?"
}
```

### Daily Reports

#### Create from Voice
```http
POST /api/daily-reports/voice
Authorization: Bearer <token>
Content-Type: multipart/form-data

audio: <audio-file>
projectId: <project-uuid>
```

## Deployment

### Production Checklist

1. **Database**: Use managed PostgreSQL (Supabase, AWS RDS, etc.)
2. **Environment Variables**: Update with production credentials
3. **File Storage**: Configure S3 or Cloudflare R2
4. **JWT Secret**: Use a cryptographically secure random string
5. **QuickBooks**: Switch to production environment
6. **Domain**: Update `NEXT_PUBLIC_APP_URL` and `QB_REDIRECT_URI`

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Security

- **Passwords**: Hashed with bcrypt (10 rounds)
- **Authentication**: JWT tokens with expiration
- **Multi-tenancy**: Database-level isolation
- **API Routes**: All protected with authentication middleware
- **File Uploads**: Type validation and sanitization

## Troubleshooting

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Database connection failed"
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Use `npx prisma dev` for local DB

### "OpenAI API errors"
- Verify OPENAI_API_KEY is valid
- Check API quota/billing

---

**Built for the construction industry**
