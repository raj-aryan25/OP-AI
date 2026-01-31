# AWS Amplify Deployment Guide

## Prerequisites
- AWS Account with Amplify access
- GitHub repository connected to Amplify

## Deployment Steps

### 1. Connect Repository
1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select the `frontend` folder as the root directory

### 2. Build Settings
Amplify will automatically detect the `amplify.yml` configuration file.

### 3. Environment Variables (if needed)
Add any required environment variables in the Amplify Console:
- Go to App Settings → Environment variables
- Add variables as needed

### 4. Deploy
- Amplify will automatically build and deploy on every push to main
- Build takes approximately 2-3 minutes

## Key Features
- ✅ Client-side routing with React Router v6
- ✅ Relative paths for asset loading
- ✅ Single build output in `dist/` folder
- ✅ Catch-all routing via `_redirects` file
- ✅ Optimized caching headers
- ✅ Automatic rebuilds on git push

## Testing Locally
```bash
npm run build
npm run preview
```

## Custom Domain (Optional)
1. Go to App Settings → Domain management
2. Add your custom domain
3. Follow DNS configuration steps

## Troubleshooting

### Routes return 404
- Ensure `_redirects` file is in `public/` folder
- Check that `base: './'` is set in `vite.config.ts`

### Assets not loading
- Verify relative paths in `vite.config.ts`
- Check browser console for CORS errors

### Build fails
- Check build logs in Amplify Console
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility
