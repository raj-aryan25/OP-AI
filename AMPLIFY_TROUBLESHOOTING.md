# Amplify Deployment Troubleshooting - Quick Fix

## ⚠️ Monorepo Build Failing?

### Problem
Your build fails on Amplify even though you selected `frontend` as the monorepo directory.

### ✅ Solution

**Option 1: Repository Root Approach (Recommended)**

1. **Move `amplify.yml` to repository root:**
   ```bash
   # From your terminal in the OP-AI directory
   mv frontend/amplify.yml ./amplify.yml
   ```

2. **The file should now be at:**
   ```
   OP-AI/
   ├── amplify.yml          ← Here
   ├── frontend/
   └── backend/
   ```

3. **In AWS Amplify Console:**
   - App settings → General → App details → Edit
   - **App root directory:** Leave BLANK or set to `.`
   - Save changes

4. **Redeploy:**
   - Go to app → Deployments
   - Click "Redeploy this version"

**The `amplify.yml` at repo root already has the correct configuration:**
```yaml
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend       # Enters the frontend directory
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/dist  # Relative to repo root
```

---

**Option 2: Keep amplify.yml in frontend/ folder**

If you prefer to keep `amplify.yml` inside the frontend folder:

1. **Update `amplify.yml` in frontend/ to:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci        # No cd needed
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist  # Relative to frontend/
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

2. **In AWS Amplify Console:**
   - App settings → General → App details → Edit
   - **App root directory:** `frontend`
   - Save changes

3. **Build settings should auto-detect the amplify.yml**

---

## 🔍 Verify Deployment

After making changes, check the build logs:

1. Go to your app in Amplify Console
2. Click on the latest deployment
3. Expand each phase:

**✅ What success looks like:**

**Provision Phase:**
```
Cloning repository...
Repository cloned successfully
```

**Build Phase:**
```
cd frontend  # (if using repo root approach)
Running npm ci
Installing dependencies...
Running npm run build
Build completed successfully
```

**Deploy Phase:**
```
Uploading artifacts from frontend/dist  # or just dist
Deployment successful
```

**❌ Common error indicators:**

```
npm ERR! Cannot find module
→ Fix: Ensure npm ci runs in correct directory

ENOENT: no such file or directory 'dist'
→ Fix: Check baseDirectory path in amplify.yml

No artifacts found
→ Fix: Verify build actually creates dist/ folder
```

---

## 🚀 Quick Checklist

Before redeploying, verify:

- [ ] `amplify.yml` location matches your "App root directory" setting
- [ ] Build commands include `cd frontend` if amplify.yml is at repo root
- [ ] `baseDirectory` path is correct relative to where commands run
- [ ] `_redirects` file exists in `frontend/public/`
- [ ] All dependencies are in `frontend/package.json`
- [ ] Build works locally (`cd frontend && npm run build`)

---

## 💡 Pro Tips

1. **Test build locally first:**
   ```bash
   cd frontend
   npm ci
   npm run build
   # Check that dist/ folder exists with files
   ```

2. **Use Amplify's build image:**
   ```yaml
   # Add to amplify.yml if you need specific Node version
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - nvm use 18  # or your preferred version
   ```

3. **Enable build logs:**
   - App settings → Build settings → Build image settings
   - Enable "Live package updates" for detailed logs

---

## 📞 Still Having Issues?

Check the specific error in build logs:
- **"command not found"** → Missing dependency or wrong directory
- **"Module not found"** → Missing package in package.json
- **"Permission denied"** → File permissions issue (rare on Amplify)
- **"Artifacts not found"** → Wrong baseDirectory path

Share the specific error from the Build phase logs for more targeted help.
