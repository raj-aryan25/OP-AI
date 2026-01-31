# AWS Amplify Deployment Guide

## Prerequisites
- AWS Account with Amplify access
- AWS CLI configured with credentials
- Node.js 18+ installed
- GitHub repository (optional for CI/CD)

## Local Amplify Setup

The project has been initialized with AWS Amplify Gen 2. The following files and folders were created:

```
amplify/
├── auth/              # Authentication resources
├── data/              # GraphQL API and database
├── backend.ts         # Backend configuration
├── package.json       # Amplify dependencies
└── tsconfig.json      # TypeScript config for backend
```

### Testing Backend Locally

Run the Amplify sandbox environment for local development:

```bash
npx ampx sandbox
```

This will:
- Deploy backend resources to AWS
- Generate `amplify_outputs.json` for frontend configuration
- Watch for backend changes and auto-deploy
- Provide a local development environment

### Amplify CLI Commands

```bash
# Start sandbox (local dev environment)
npx ampx sandbox

# Deploy to cloud
npx ampx deploy

# Generate backend client
npx ampx generate

# View help
npx ampx help

# Configure telemetry
npx ampx configure telemetry disable
```

## Deployment Steps

### 1. Connect Repository
1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select the `frontend` folder as the root directory (or repository root if using monorepo detection)

### 2. Build Settings
Amplify will automatically detect the `amplify.yml` configuration file in the repository root.

**Important:** If you have a backend defined in `amplify/` folder, Amplify will also deploy backend resources automatically.

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

### Monorepo Setup - Build Failures

**Problem:** Deployment fails even with "frontend" set as app root in Amplify Console

**Root Cause:** For monorepo setups, Amplify expects `amplify.yml` at the repository root, not inside the frontend folder.

**Solution:**

1. **Move `amplify.yml` to repository root:**
   ```
   OP-AI/
   ├── amplify.yml          ← Place here (repo root)
   ├── frontend/
   │   ├── package.json
   │   ├── src/
   │   └── ...
   └── backend/
   ```

2. **Update `amplify.yml` with correct paths:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend      # Navigate into subdirectory
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/dist  # Path from repo root
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
   ```

3. **In Amplify Console:**
   - Go to App settings → Build settings
   - Leave "App root directory" **blank** (or set to repo root)
   - Amplify will use the `cd frontend` command from amplify.yml

4. **Verify build logs:**
   - Check "Provision" phase: Should show repo clone
   - Check "Build" phase: Should show `cd frontend` then `npm ci`
   - Check artifacts: Should show files from `frontend/dist`

**Alternative:** If you want to keep amplify.yml in frontend/, you must:
- Set "App root directory" to `frontend` in Amplify Console
- Remove `cd frontend` from build commands
- Change `baseDirectory: frontend/dist` to `baseDirectory: dist`

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
