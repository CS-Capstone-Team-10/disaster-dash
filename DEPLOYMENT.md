# Atlas Alert - Vercel Deployment Guide

This guide will walk you through deploying **Atlas Alert** to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works great!)
- Your repository pushed to GitHub, GitLab, or Bitbucket
- Node.js 20+ (already configured in your project)

---

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Go to [Vercel](https://vercel.com) and sign in**

2. **Click "Add New Project"**

3. **Import your Git repository**
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select the `disaster-dash` repository
   - Click "Import"

4. **Configure your project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Set Environment Variables** (Optional)

   Click "Environment Variables" and add:

   | Name | Value | Notes |
   |------|-------|-------|
   | `NEXT_PUBLIC_USE_MOCK` | `true` | Use mock data (default) |
   | `NEXT_PUBLIC_API_URL` | (optional) | Only needed when using real API |

   > **Note**: By default, the app uses mock data. You can deploy with mock data first to verify everything works, then switch to your real API later.

6. **Click "Deploy"**

   Vercel will:
   - Install dependencies
   - Build your Next.js app
   - Deploy to a production URL
   - Give you a live URL like: `https://disaster-dash-xyz.vercel.app`

7. **Done!** 🎉

   Your app is now live. Click the URL to view it.

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to your project
cd /path/to/disaster-dash

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

The CLI will guide you through the setup process.

---

## Environment Variables Configuration

### For Mock Data (Default - Recommended for First Deploy)

No environment variables needed! The app works out of the box with realistic mock data.

```bash
# .env.local (optional, these are defaults)
NEXT_PUBLIC_USE_MOCK=true
```

### For Real API Integration

When you're ready to connect to your real API:

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add the following:

   ```
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```

2. **Redeploy** (Vercel will auto-deploy on git push, or manually redeploy from dashboard)

3. **Verify** your API endpoints match the expected format in `API_INTEGRATION_GUIDE.md`

---

## Custom Domain Setup (Optional)

### Add Your Own Domain

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Enter your domain (e.g., `atlasalert.com`)
4. Follow the DNS configuration instructions
5. Vercel automatically provisions SSL certificates

---

## Build Configuration

Your project is already configured with:

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_USE_MOCK": "true"
  }
}
```

### `package.json` Scripts
- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### `.npmrc`
Contains `legacy-peer-deps=true` to handle the React 19 + visx dependency resolution.

---

## Deployment Checklist

Before deploying, verify:

- ✅ All dependencies installed: `npm install`
- ✅ Build succeeds locally: `npm run build`
- ✅ No TypeScript errors: `npm run lint`
- ✅ Environment variables documented in `.env.example`
- ✅ `.gitignore` excludes `.env.local` and `.vercel`
- ✅ Git repository is clean and pushed

```bash
# Quick verification
npm install
npm run build
npm run lint

# If all pass, you're ready to deploy!
```

---

## Automatic Deployments

Vercel automatically deploys your app when you push to Git:

- **Production**: Pushes to `main` or `master` branch
- **Preview**: Pushes to any other branch (e.g., `feat/new-feature`)

Each preview deployment gets its own URL for testing!

---

## Monitoring & Analytics

### Vercel Dashboard Features

1. **Deployment Logs**: View build logs and runtime logs
2. **Analytics**: Track page views, performance metrics
3. **Speed Insights**: Monitor Core Web Vitals
4. **Error Tracking**: See runtime errors

Access via: Project → Analytics / Speed Insights / Logs

---

## Troubleshooting

### Build Fails with Dependency Errors

**Solution**: Ensure `.npmrc` is committed to your repository:
```
legacy-peer-deps=true
```

### Environment Variables Not Working

**Solution**:
- Verify variable names start with `NEXT_PUBLIC_` for client-side access
- Redeploy after changing environment variables
- Check the "Environment Variables" tab in Settings

### Build Succeeds Locally but Fails on Vercel

**Solution**:
- Check Node.js version matches (20+)
- Verify all files are committed to Git
- Check build logs in Vercel dashboard for specific errors

### Map Not Loading

**Solution**: This is expected during SSR. The Live Map uses dynamic imports with `ssr: false`:

```typescript
// Already configured in src/app/(app)/live-map/page.tsx
const LiveMapImpl = dynamic(() => import('./LiveMapImpl'), { ssr: false });
```

---

## Performance Optimization

Your app is already optimized with:

- ✅ **Next.js 15** with Turbopack for fast builds
- ✅ **React 19** for improved performance
- ✅ **Dynamic imports** for code splitting (Live Map)
- ✅ **Tailwind CSS 4** with PostCSS for optimized styling
- ✅ **Image optimization** (if you add images, use `next/image`)
- ✅ **Vercel Edge Network** for global CDN

### Additional Optimizations

Consider adding:
- Server-side caching for API responses
- React Query or SWR for client-side caching
- Image optimization with `next/image`
- Progressive Web App (PWA) features

---

## Scaling to Production

### When Your API is Ready

1. **Set Environment Variables** in Vercel:
   ```
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_API_URL=https://api.atlasalert.com
   ```

2. **Update API calls** in `src/lib/services/data-service.ts`:
   - Uncomment fetch calls
   - Add authentication headers if needed
   - Implement WebSocket for live feed

3. **Test thoroughly**:
   - Dashboard metrics
   - Live map markers
   - Alerts filtering
   - Analytics charts
   - Notifications history
   - Live feed streaming

4. **Monitor**:
   - Check Vercel Analytics for traffic
   - Monitor API response times
   - Watch for errors in Vercel logs

### Adding Authentication

If you need user authentication:
- Consider [NextAuth.js](https://next-auth.js.org/)
- Or integrate with your existing auth system
- Protect routes in `src/app/(app)/layout.tsx`

---

## Production URLs

After deployment, you'll have:

- **Production**: `https://disaster-dash.vercel.app`
- **Custom Domain** (optional): `https://atlasalert.com`
- **Preview Deployments**: Unique URLs for each branch/PR

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Your API Integration Guide**: See `API_INTEGRATION_GUIDE.md`
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

## Summary

**To deploy right now with mock data:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

**That's it!** No environment variables needed for the first deploy. The app will work with mock data immediately.

When you're ready to connect your real API, just add the environment variables in Vercel Settings and redeploy.

---

## Next Steps After Deployment

1. ✅ Share your live URL and gather feedback
2. ✅ Set up a custom domain (optional)
3. ✅ Monitor analytics and performance
4. ✅ Integrate real API when ready
5. ✅ Add authentication if needed
6. ✅ Set up production monitoring

**Happy deploying!** 🚀
