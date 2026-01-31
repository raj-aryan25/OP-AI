# AWS Amplify Deployment Checklist

## ✅ Pre-Deployment Verification

### Build Configuration
- [x] `vite.config.ts` uses relative paths (`base: './'`)
- [x] Single build output in `dist/` directory
- [x] Build completes without errors
- [x] TypeScript compilation successful

### Routing Configuration
- [x] `_redirects` file in `public/` folder
- [x] `_redirects` copied to `dist/` on build
- [x] Catch-all route: `/* /index.html 200`
- [x] React Router uses `<BrowserRouter>`
- [x] All routes properly configured

### Asset Paths
- [x] All asset references use relative paths
- [x] `index.html` links to `./assets/` (not `/assets/`)
- [x] Images and fonts use relative imports

### Performance
- [x] Source maps disabled in production
- [x] Code splitting optimized
- [x] Cache headers configured in `amplify.yml`

## 📋 Deployment Steps

### 1. AWS Amplify Console Setup
```bash
# Navigate to AWS Amplify Console
# Click "New app" → "Host web app"
# Connect GitHub repository
```

### 2. Build Settings
```yaml
# Amplify auto-detects amplify.yml
# Verify settings:
- Base directory: frontend
- Build command: npm run build
- Output directory: dist
```

### 3. Environment Variables (if needed)
```bash
# Add in Amplify Console → Environment variables
# Example:
VITE_API_URL=https://api.example.com
```

### 4. Deploy
```bash
# Automatic deployment on git push to main
# Manual: Click "Deploy" in Amplify Console
```

## 🧪 Post-Deployment Testing

### Routing Tests
- [ ] Navigate to `/` redirects to `/user`
- [ ] Navigate to `/admin` loads admin dashboard
- [ ] Navigate to `/operator` loads operator dashboard
- [ ] Navigate to `/user/route` loads route planner
- [ ] Refresh on `/admin/stations` stays on page (no 404)
- [ ] Direct URL access works for all routes

### Asset Loading Tests
- [ ] All CSS loads correctly
- [ ] All JavaScript executes
- [ ] Images display properly
- [ ] Fonts render correctly

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Lighthouse score > 90

## 🔧 Troubleshooting

### Problem: Routes return 404 on refresh
**Solution:** 
- Verify `_redirects` file exists in `dist/`
- Check Amplify rewrites configuration
- Ensure `base: './'` in `vite.config.ts`

### Problem: Assets fail to load
**Solution:**
- Check browser DevTools network tab
- Verify asset paths in `dist/index.html`
- Ensure no absolute paths (should be `./` not `/`)

### Problem: Build fails on Amplify
**Solution:**
- Check Node.js version compatibility
- Verify all dependencies in `package.json`
- Review build logs in Amplify Console

## 📊 Monitoring

### Amplify Console
- Build logs: Track deployment success/failures
- Access logs: Monitor traffic and errors
- Metrics: View performance data

### CloudWatch (Optional)
- Set up custom metrics
- Configure alarms for errors
- Monitor application health

## 🔄 Continuous Deployment

### Automatic Deployment
- Push to `main` branch triggers build
- Build completes in ~2-3 minutes
- Automatic rollback on failure

### Branch Previews (Optional)
```bash
# Enable in Amplify Console
# Creates preview URL for each PR
# Format: pr-[number].[app-id].amplifyapp.com
```

## 📝 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy)
- [React Router SPA Deployment](https://reactrouter.com/en/main/guides/deploying)
