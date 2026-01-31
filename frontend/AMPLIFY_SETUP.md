# AWS Amplify Local Setup - Quick Start

## ✅ Setup Complete

AWS Amplify Gen 2 has been initialized in your project with:
- Authentication resources (`amplify/auth/`)
- GraphQL API and database (`amplify/data/`)
- Backend configuration (`amplify/backend.ts`)

## 🚀 Next Steps

### 1. Start Local Development

Run the Amplify sandbox to deploy backend resources and test locally:

```bash
npx ampx sandbox
```

**What this does:**
- Deploys auth and data resources to your AWS account
- Generates `amplify_outputs.json` configuration file
- Watches for changes and auto-deploys
- Creates a local development environment

**First time setup:**
- You'll be prompted to log in to AWS
- Resources will be deployed to your AWS account
- Takes 2-3 minutes for initial deployment

### 2. Configure Frontend (After Sandbox Runs)

Once sandbox generates `amplify_outputs.json`, configure your app:

```typescript
// src/main.tsx or src/App.tsx
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

### 3. Use Amplify Features

**Authentication:**
```typescript
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

// Sign in
await signIn({ username, password });

// Get current user
const user = await getCurrentUser();

// Sign out
await signOut();
```

**GraphQL API:**
```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

// Query data
const { data } = await client.models.Todo.list();

// Create data
await client.models.Todo.create({ content: 'Build app' });
```

## 📁 Generated Files

After running `npx ampx sandbox`:
- `amplify_outputs.json` - Frontend configuration (auto-generated, gitignored)
- `.amplify/` - Local cache and build artifacts (gitignored)

## 🛠️ Common Commands

```bash
# Start local development environment
npx ampx sandbox

# Deploy to production
npx ampx deploy

# Generate TypeScript types for backend
npx ampx generate

# View all available commands
npx ampx help

# Stop sandbox
# Press Ctrl+C in the terminal running sandbox
```

## 🔧 Customizing Your Backend

### Modify Authentication

Edit `amplify/auth/resource.ts`:
```typescript
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    // Add social providers, phone, etc.
  },
});
```

### Modify Data Model

Edit `amplify/data/resource.ts`:
```typescript
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Station: a.model({
    name: a.string().required(),
    location: a.string(),
    capacity: a.integer(),
  }).authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema });
```

## 📊 Monitoring

View deployed resources:
1. Go to AWS Amplify Console
2. Select your app
3. Navigate to "Backend resources"
4. View Cognito, AppSync, DynamoDB, etc.

## 🔒 Security Notes

- Auth and API resources are deployed to your AWS account
- Default authorization uses Amazon Cognito
- Update authorization rules in `resource.ts` files
- Never commit `amplify_outputs.json` to git (already in .gitignore)

## 🆘 Troubleshooting

### Issue: "Unable to connect to AWS"
**Solution:** Configure AWS credentials:
```bash
aws configure
# Or use AWS CLI SSO:
aws sso login
```

### Issue: Sandbox fails to start
**Solution:** 
- Check AWS credentials are valid
- Ensure you have permissions to create resources
- Check CloudFormation in AWS Console for errors

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure `amplify_outputs.json` exists
- Verify `Amplify.configure()` is called before using auth/API
- Check browser console for errors

## 📚 Resources

- [Amplify Gen 2 Documentation](https://docs.amplify.aws/react/)
- [Authentication Guide](https://docs.amplify.aws/react/build-a-backend/auth/)
- [GraphQL API Guide](https://docs.amplify.aws/react/build-a-backend/data/)
- [Amplify CLI Reference](https://docs.amplify.aws/react/reference/cli-commands/)

## 🎯 Ready for Production?

When ready to deploy:
1. Commit your code (without `amplify_outputs.json`)
2. Push to GitHub
3. Connect repository in AWS Amplify Console
4. Amplify will build frontend AND deploy backend automatically
5. No need to run `npx ampx deploy` manually when using Amplify Hosting

Your app is now ready with:
- ✅ Local Amplify backend configured
- ✅ Authentication resources
- ✅ GraphQL API
- ✅ Ready for cloud deployment
