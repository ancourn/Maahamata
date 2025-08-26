# Google OAuth Setup Guide

## 🔧 Prerequisites

1. **Google Cloud Console Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Gmail API**
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Gmail API" and click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Orbit Mail" (or your preferred name)

4. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Orbit Mail"
     - User support email: your-email@example.com
     - Developer contact information: your-email@example.com
   - Add scopes:
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `https://www.googleapis.com/auth/gmail.readonly`
   - Add test users (your email address)

5. **Configure Redirect URIs**
   - Under "Authorized redirect URIs", add:
     - `http://localhost:3000/api/auth/callback/google`

6. **Get Your Credentials**
   - After creating the OAuth client, you'll get:
     - **Client ID**
     - **Client Secret**

## 🌟 Environment Configuration

Copy your Google OAuth credentials to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-key
```

### Generate NEXTAUTH_SECRET
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 🚀 Testing the Integration

1. **Restart the development server**
   ```bash
   npm run dev
   ```

2. **Test Gmail Connection**
   - Visit http://localhost:3000
   - Navigate to the "Smart Inbox" tab
   - Click "Connect Gmail" button
   - You should be redirected to Google's OAuth consent screen
   - After approving, you'll be redirected back to the app

3. **Sync Emails**
   - Once connected, click "Sync Inbox" to fetch and triage emails
   - Watch as AI categorizes and prioritizes your emails

## 🔍 Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Make sure `http://localhost:3000/api/auth/callback/google` is added to your Google OAuth client's authorized redirect URIs

2. **"access_denied" Error**
   - Make sure you've added your email as a test user in the OAuth consent screen
   - Make sure all required scopes are approved

3. **"Invalid client" Error**
   - Double-check your Client ID and Client Secret in the `.env` file
   - Make sure there are no extra spaces or characters

4. **Email Sync Not Working**
   - Check that the Gmail API is enabled in your Google Cloud project
   - Verify that you have the necessary permissions
   - Check the server logs for error messages

### Debug Mode

To enable debug logging, add this to your `.env` file:
```env
NEXTAUTH_DEBUG=true
```

## 🎯 Production Deployment

When deploying to production:

1. **Update NEXTAUTH_URL** to your production URL
2. **Update Google OAuth redirect URIs** to include your production domain
3. **Publish your OAuth app** (remove test user restrictions)
4. **Ensure your domain is verified** in Google Cloud Console

## 📱 Mobile Testing

The OAuth flow works on mobile devices. Make sure:
- Your redirect URIs include both http and https versions
- Your app is responsive (which it already is with our Tailwind setup)

---

**Note**: For development purposes, the app uses mock email data. To connect to a real Gmail account, you need to complete the Google OAuth setup above.