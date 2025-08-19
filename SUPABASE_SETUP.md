# Supabase Setup Guide

## Step 1: Create Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub (easiest) or email

## Step 2: Create Project
1. Click "New Project"
2. Fill in:
   - Name: `fashion-app`
   - Password: (create strong password - save it!)
   - Region: (choose closest to you)
3. Click "Create new project"
4. ⏰ Wait 2-3 minutes for setup

## Step 3: Get API Credentials
1. Go to **Settings** → **API**
2. Copy these two values:

### Project URL
```
https://your-project-id.supabase.co
```

### Anon Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Set Up Database
1. Go to **SQL Editor** in sidebar
2. Click **"New query"**
3. Copy everything from `supabase_schema.sql`
4. Paste into editor
5. Click **"Run"**

✅ This creates:
- Clothing items table
- Storage bucket for images
- Security policies
- Default categories

## Step 5: Continue Setup
Go back to your terminal and enter the credentials when prompted.

## Troubleshooting

### Can't find API page?
- Look for ⚙️ Settings in the left sidebar
- Then click "API"

### SQL errors?
- Make sure you copied the entire `supabase_schema.sql` file
- Run each section separately if there are errors

### Project not loading?
- Wait a few more minutes - initial setup can take 5+ minutes
- Refresh the page

## Free Tier Limits
- ✅ 500MB database storage
- ✅ 2GB bandwidth  
- ✅ 50,000 monthly active users
- Perfect for development and testing! 