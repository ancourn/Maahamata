# 🚀 Orbit Mail - AI-Powered Email Management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC.svg)](https://tailwindcss.com/)

**Orbit Mail** is an intelligent email management system that uses AI to automatically categorize, prioritize, and triage your emails. Built with modern web technologies and designed for seamless Gmail integration.

## ✨ Key Features

### 🤖 AI-Powered Email Triage
- **Smart Categorization**: Automatically sorts emails into Priority, Action-Required, Informational, Follow-Up, and Spam
- **Urgency Scoring**: 1-10 scale priority assessment with confidence levels
- **Suggested Actions**: AI-recommended next steps for each email
- **Real-time Processing**: Instant email analysis and categorization

### 🔐 Secure Gmail Integration
- **Google OAuth2**: Secure authentication with token management
- **Background Sync**: Automatic email syncing every 15 minutes
- **Manual Sync**: On-demand email fetching and processing
- **Privacy First**: Your data stays yours - no tracking or mining

### 🎨 Modern User Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Live email updates via WebSocket
- **Interactive Actions**: Reply, Archive, Delete with one click
- **Visual Indicators**: Color-coded categories and urgency levels

### 🛠️ Technical Excellence
- **Next.js 15**: Latest React framework with App Router
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Modern utility-first CSS
- **Prisma ORM**: Type-safe database operations
- **Socket.IO**: Real-time communication
- **shadcn/ui**: Beautiful, accessible components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console account (for Gmail integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone -b feature/gmail-integration-smart-inbox https://github.com/ancourn/Maahamata.git
   cd Maahamata
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then configure your `.env` file:
   ```env
   DATABASE_URL=file:./db/custom.db
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

4. **Set up database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Gmail Integration Setup

### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Gmail API** from API Library
4. Create **OAuth 2.0 Credentials**:
   - Application type: Web application
   - Name: Orbit Mail
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`

### Step 2: OAuth Consent Screen
1. Configure OAuth consent screen
2. Add required scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `https://www.googleapis.com/auth/gmail.readonly`
3. Add your email as test user

### Step 3: Get Credentials
1. Copy **Client ID** and **Client Secret**
2. Add them to your `.env` file
3. Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## 📱 Usage Guide

### Connecting Gmail
1. Open the application and navigate to **Smart Inbox**
2. Click **Connect Gmail** button
3. Complete Google OAuth authentication
4. Once connected, click **Sync Inbox** to fetch emails

### Managing Emails
- **View Categories**: Emails are automatically categorized with color codes
- **Check Urgency**: See 1-10 urgency scores and confidence levels
- **Take Actions**: Use suggested actions or manual Reply/Archive/Delete
- **Real-time Updates**: New emails are processed automatically

### Understanding Categories
- 🔴 **Priority**: Urgent, time-sensitive matters
- 🔵 **Action-Required**: Needs response or specific action
- ⚪ **Informational**: General updates and newsletters
- 🟡 **Follow-Up**: Can be addressed later
- 🟣 **Spam**: Unwanted or promotional emails

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── emails/        # Email management
│   │   ├── sync-emails/   # Email synchronization
│   │   └── users/         # User management
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Navigation bar
│   ├── smart-inbox.tsx   # Main inbox UI
│   └── ...               # Other components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── gmail.ts          # Gmail API integration
│   ├── email-sync-worker.ts # Background sync
│   ├── db.ts             # Database client
│   └── ...               # Other utilities
└── hooks/                # Custom React hooks
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
```

### Database Management
The project uses **SQLite** with **Prisma ORM** for type-safe database operations.

```typescript
// Example database query
const emails = await db.email.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: 'desc' }
});
```

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/emails` - Fetch user emails
- `POST /api/sync-emails` - Sync and triage emails
- `GET /api/auth/[...nextauth]` - NextAuth routes

## 🔒 Security Features

### Authentication
- **NextAuth.js** for secure session management
- **Google OAuth2** with proper token handling
- **Encrypted tokens** stored in database
- **Automatic token refresh** for long-lived sessions

### Data Privacy
- **Zero data residency risk** - all data stored in your database
- **No tracking or data mining** - we protect, don't exploit
- **User control** - revoke access anytime
- **GDPR compliant** design

### API Security
- **Type-safe database operations** with Prisma
- **Input validation** on all endpoints
- **Error handling** with proper HTTP status codes
- **CORS protection** for cross-origin requests

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Production requires:
```env
DATABASE_URL=production-database-url
GOOGLE_CLIENT_ID=production-client-id
GOOGLE_CLIENT_SECRET=production-client-secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=production-secret
```

### Database
- **SQLite** for development and small deployments
- **PostgreSQL/MySQL** for large-scale production
- **Prisma Migrations** for schema management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for the beautiful component library
- **Prisma** for the next-generation ORM
- **Z.ai** for the AI-powered capabilities
- **Google** for the Gmail API and OAuth services

## 📞 Support

For support, please open an issue in the GitHub repository or check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

---

**Built with ❤️ using modern web technologies and AI-powered development.**

🤖 Generated with [Claude Code](https://claude.ai/code)