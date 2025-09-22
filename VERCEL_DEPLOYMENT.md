# 🚀 Vercel Frontend Deployment Guide

## **✅ Prerequisites**
- ✅ Railway backend deployed: `https://youtube-production-4e85.up.railway.app`
- ✅ Frontend code ready in `client/` directory
- ✅ Vercel CLI available

## **🔧 Step 1: Prepare Environment Variables**

You need to set these environment variables in Vercel:

### **Required Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=https://youtube-production-4e85.up.railway.app
NEXTAUTH_URL=https://your-vercel-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## **🚀 Step 2: Deploy to Vercel**

### **Option A: Deploy via Vercel CLI (Recommended)**

1. **Navigate to project root:**
   ```bash
   cd /home/vibhor/Downloads/vibhorpersonal/Cactro/21-9-25-a
   ```

2. **Login to Vercel:**
   ```bash
   npx vercel login
   ```

3. **Deploy the project:**
   ```bash
   npx vercel --prod
   ```

4. **Follow the prompts:**
   - **Set up and deploy?** → `Y`
   - **Which scope?** → Choose your account
   - **Link to existing project?** → `N`
   - **What's your project's name?** → `youtube-dashboard` (or any valid name)
   - **In which directory is your code located?** → `./client`

### **Option B: Deploy via Vercel Dashboard**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Set Root Directory to `client`**
5. **Add Environment Variables:**
   - `NEXT_PUBLIC_API_URL` = `https://youtube-production-4e85.up.railway.app`
   - `NEXTAUTH_URL` = `https://your-app-name.vercel.app`
   - `NEXTAUTH_SECRET` = `your-secret-key`
   - `GOOGLE_CLIENT_ID` = `your-google-client-id`
   - `GOOGLE_CLIENT_SECRET` = `your-google-client-secret`

## **🔧 Step 3: Update Google OAuth Settings**

After deployment, update your Google OAuth settings:

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Navigate to APIs & Services > Credentials**
3. **Edit your OAuth 2.0 Client ID**
4. **Add to Authorized redirect URIs:**
   ```
   https://your-vercel-app-name.vercel.app/api/auth/callback/google
   ```

## **✅ Step 4: Test Your Deployment**

1. **Visit your Vercel URL**
2. **Sign in with Google**
3. **Test all features:**
   - Video sync
   - Comment management
   - Notes management

## **🐛 Troubleshooting**

### **Common Issues:**

1. **"Invalid characters" error:**
   - Use only letters, numbers, and underscores
   - Don't start with a number
   - Keep it short and simple

2. **Environment variables not working:**
   - Make sure to add them in Vercel dashboard
   - Redeploy after adding variables

3. **Google OAuth errors:**
   - Update redirect URIs in Google Console
   - Check client ID and secret

## **📋 Project Structure for Vercel:**
```
project-root/
├── client/          ← Vercel will deploy this
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
├── server/          ← Already deployed to Railway
└── vercel.json      ← Vercel configuration
```

## **🎯 Next Steps After Deployment:**

1. **Get your Vercel URL**
2. **Update Google OAuth redirect URIs**
3. **Test the complete application**
4. **Share the live URL!**

---

**Need help?** Check the Vercel logs in your dashboard or run `npx vercel logs` for debugging.
