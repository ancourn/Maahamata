# 🌟 OrbitOS - Full-Stack Intelligence Platform

OrbitOS is a comprehensive full-stack intelligence platform that combines AI-powered email management, real-time system monitoring, and intelligent automation in a single, unified interface.

## 🚀 Features

### 🧠 AI Core Intelligence
- **AI Copilot**: Real-time AI assistant with natural language processing
- **Smart Email Triage**: Automatic email categorization and urgency assessment
- **Semantic Search**: Intelligent search across documents, emails, and tasks
- **Calendar Management**: AI-powered scheduling and conflict resolution
- **Auto-triage System**: Automated email processing with configurable intervals

### 📧 Gmail Integration
- **OAuth Authentication**: Secure Google account connection
- **Real-time Sync**: Live email synchronization from Gmail
- **AI Processing**: LLM-powered email analysis and categorization
- **Smart Inbox**: Intelligent email management with visual indicators
- **Attachment Support**: Complete email metadata and attachment handling

### 📊 System Monitoring
- **Real-time Health Monitoring**: Live system status across all layers
- **14 Intelligent Layers**: Comprehensive monitoring of system components
- **Performance Metrics**: Detailed performance analytics and insights
- **Security Posture**: Real-time security monitoring and threat detection
- **API Integration**: Comprehensive API endpoints for system data

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first responsive interface
- **Real-time Updates**: WebSocket-based live updates
- **Dark/Light Mode**: Complete theme support
- **Interactive Components**: Rich, interactive UI elements
- **Professional Design**: Modern, clean interface with shadcn/ui

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand and TanStack Query
- **Real-time**: Socket.IO Client
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with TypeScript
- **Real-time**: Socket.IO Server
- **Database**: Prisma ORM with SQLite
- **AI Integration**: z-ai-web-dev-sdk
- **Authentication**: Google OAuth2
- **Email Processing**: Gmail API
- **API**: RESTful endpoints with Next.js API Routes

### AI/ML
- **LLM Integration**: z-ai-web-dev-sdk for real AI processing
- **Email Analysis**: Natural language processing for email triage
- **Smart Categorization**: AI-powered email classification
- **Automation**: Intelligent workflow automation
- **Real-time Processing**: Live AI inference and response

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console account (for Gmail integration)

### Clone Repository
```bash
git clone https://github.com/ancourn/Maahamata.git
cd Maahamata
```

### Install Dependencies
```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Google OAuth (Required for Gmail integration)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXT_PUBLIC_URL="http://localhost:3000"

# Socket Server Port (Optional)
SOCKET_PORT=3001
```

### Database Setup
```bash
# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate
```

## 🚀 Running the Application

### Development Mode

1. **Start the main development server**:
```bash
npm run dev
```

2. **Start the Socket.IO server** (in a separate terminal):
```bash
npm run start:socket
```

3. **Open your browser** and navigate to:
```
http://localhost:3000
```

### Production Mode

1. **Build the application**:
```bash
npm run build
```

2. **Start the production server**:
```bash
npm start
```

3. **Start the Socket.IO server**:
```bash
npm run start:socket
```

## 🔧 Gmail Integration Setup

### Google Cloud Console Setup

1. **Create a new project** in [Google Cloud Console](https://console.cloud.google.com/)

2. **Enable APIs**:
   - Gmail API
   - Google OAuth2 API

3. **Create OAuth 2.0 Credentials**:
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`

4. **Download credentials** and add to your `.env` file

### Using Gmail Integration

1. **Navigate to AI Intelligence tab** in the OrbitOS dashboard
2. **Click "Sync Gmail"** to connect your Gmail account
3. **Complete OAuth authentication** when prompted
4. **Wait for sync completion** - emails will automatically process
5. **Enable Auto-triage** for automatic email processing

## 🎯 Usage Guide

### AI Copilot (Right Sidebar)
- **Natural Language Chat**: Ask questions in natural language
- **Quick Actions**: Use pre-built actions for common tasks
- **Real-time Responses**: Get instant AI feedback
- **Context Awareness**: Maintains conversation context

### Smart Inbox (AI Intelligence Tab)
- **Gmail Sync**: Connect and sync your Gmail account
- **Auto-triage**: Enable automatic email processing
- **Email Categories**: View AI-categorized emails (Priority, Action-Required, etc.)
- **Urgency Levels**: See 1-10 urgency assessments
- **AI Suggestions**: Get recommended actions for each email

### System Monitoring (Various Tabs)
- **Overview**: System health and quick stats
- **System Layers**: Detailed monitoring of all 14 system layers
- **AI Intelligence**: AI capabilities and training metrics
- **Security**: Security posture and threat detection

## 🌐 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Handle OAuth callback

### Gmail Integration
- `POST /api/gmail/sync` - Sync Gmail emails
- `GET /api/gmail/emails` - Retrieve user emails

### System Monitoring
- `GET /api/system/status` - System health status
- `GET /api/layers/metrics` - System layer metrics
- `GET /api/security/metrics` - Security metrics
- `GET /api/ai/insights` - AI insights and generation

## 🔄 Development Workflow

### Branch Strategy
After every development session, create a new branch:

```bash
# Create new branch for development
git checkout -b feature/your-feature-name

# Make your changes
# Add files, commit changes

# Push to remote
git push -u origin feature/your-feature-name

# Create pull request for review
```

### Code Quality
```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Run database operations
npm run db:push
npm run db:generate
```

### Commit Convention
Use descriptive commit messages:
```bash
feat: add new feature
fix: resolve specific issue
docs: update documentation
style: code formatting
refactor: code restructuring
test: add or modify tests
chore: maintenance tasks
```

## 📁 Project Structure

```
src/
├── ai-core/                    # AI Core system
│   ├── agents/                 # Specialized AI agents
│   ├── prompts/                # AI system prompts
│   ├── types/                  # TypeScript interfaces
│   └── CopilotAgent.ts       # Central AI routing
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── gmail/              # Gmail integration
│   │   ├── ai/                 # AI insights
│   │   ├── system/             # System monitoring
│   │   ├── layers/            # Layer metrics
│   │   └── security/           # Security metrics
│   ├── page.tsx               # Main dashboard
│   └── layout.tsx             # App layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── ai/                    # AI monitoring components
│   ├── AICopilot.tsx          # AI chat interface
│   └── SmartInbox.tsx         # Smart email management
├── lib/
│   ├── auth/                  # Authentication
│   ├── gmail.ts               # Gmail API integration
│   ├── email-triage.ts        # Email processing service
│   ├── socket-client.ts       # Socket.IO client
│   ├── db.ts                  # Database client
│   └── utils.ts               # Utility functions
├── socket/                     # Socket.IO server
└── prisma/
    └── schema.prisma          # Database schema
```

## 🔒 Security Features

### Authentication
- **Google OAuth2**: Secure third-party authentication
- **Token Management**: Secure token storage and refresh
- **Session Security**: HTTP-only cookies with secure flags
- **User Isolation**: Complete data separation between users

### Data Protection
- **Encryption**: Sensitive data encryption at rest
- **API Security**: Protected endpoints with authentication
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting and abuse prevention

### System Security
- **Post-Quantum Ready**: Future-proof encryption considerations
- **Audit Trails**: Comprehensive logging and monitoring
- **Threat Detection**: Real-time security monitoring
- **Access Control**: Role-based access control system

## 🚀 Deployment

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database**: Production database setup (PostgreSQL recommended)
- **SSL/TLS**: HTTPS configuration for production
- **Scaling**: Load balancing and horizontal scaling
- **Monitoring**: Production monitoring and alerting

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **AWS**: Full cloud infrastructure setup
- **Docker**: Containerized deployment
- **Self-hosted**: Complete control over infrastructure

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow commit conventions**
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration
- Write clean, documented code
- Include tests for new features
- Update documentation as needed

## 📄 Documentation

- [AI Core Documentation](./AI_CORE_README.md)
- [Gmail Integration Documentation](./GMAIL_INTEGRATION_README.md)
- [API Documentation](./docs/api.md) (coming soon)
- [Deployment Guide](./docs/deployment.md) (coming soon)

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <process-id>
```

**Database Issues**
```bash
# Reset database
npm run db:reset

# Regenerate client
npm run db:generate
```

**Gmail OAuth Issues**
- Verify Google Cloud Console configuration
- Check redirect URI settings
- Ensure environment variables are correct
- Clear browser cookies and try again

**Socket.IO Connection Issues**
- Ensure Socket.IO server is running
- Check firewall settings
- Verify port configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the excellent framework
- **shadcn/ui**: For the beautiful UI components
- **Google**: For Gmail API and OAuth services
- **OpenAI**: For AI capabilities and models
- **Socket.IO**: For real-time communication

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review troubleshooting section
- Contact the development team

---

**🌟 OrbitOS - Intelligence at Every Layer**

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

---

🤖 Generated with [Claude Code](https://claude.ai/code)