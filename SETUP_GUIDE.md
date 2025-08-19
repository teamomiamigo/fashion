# Fashion App Setup Guide

## Overview
This guide will help you set up the wardrobe feature with AI-powered image processing for background removal and clothing analysis.

## Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g @expo/cli`)
- Supabase account
- (Optional) AI service accounts for enhanced features

## 1. Database Setup

### Supabase Configuration
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env` and fill in your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Database Schema
1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase_schema.sql`
3. Run the SQL to create all necessary tables, policies, and storage buckets

This will create:
- `clothing_items` table for storing wardrobe items
- `clothing_categories` table for categorization
- Storage bucket for clothing images
- Row-level security policies
- Default clothing categories

## 2. AI Services Setup (Optional but Recommended)

### Background Removal - Replicate API
1. Sign up at [replicate.com](https://replicate.com)
2. Get your API token from your account settings
3. Add to your `.env` file:
   ```
   EXPO_PUBLIC_REPLICATE_API_TOKEN=your_replicate_token
   ```

### Clothing Analysis - OpenAI Vision API
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create an API key with vision model access
3. Add to your `.env` file:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

## 3. Installation & Running

### Install Dependencies
```bash
npm install
```

### Start the Development Server
```bash
npm start
```

## 4. Features

### Wardrobe Management
- **Add Clothing**: Take photos or select from gallery
- **AI Processing**: Automatic background removal and categorization
- **Smart Analysis**: AI detects colors, categories, and suggests tags
- **Grid Display**: Clean tile-based wardrobe view

### How It Works
1. User takes a photo or selects from gallery
2. Image is processed by Replicate API for background removal
3. OpenAI Vision API analyzes the clothing for:
   - Category detection (shirt, pants, dress, etc.)
   - Color identification
   - Style and occasion tags
4. Processed image and metadata are stored in Supabase
5. Item appears in the wardrobe grid

### Fallback Behavior
- If AI services are not configured, the app will still work with basic functionality
- Original images will be used without background removal
- Manual categorization will be available

## 5. Cost Considerations

### Replicate API
- Background removal: ~$0.01-0.03 per image
- First 1000 predictions per month are often free

### OpenAI Vision API
- Image analysis: ~$0.01-0.02 per image
- Pricing varies by usage

### Supabase
- Free tier includes 500MB storage and 2GB bandwidth
- Paid plans start at $25/month for production use

## 6. Customization

### Adding New Categories
Edit the `clothing_categories` table in Supabase or modify the default categories in `supabase_schema.sql`.

### Customizing AI Prompts
Modify the prompts in `src/services/aiImageProcessing.ts` to change how clothing items are analyzed.

### UI Customization
The wardrobe grid and add button can be customized in `src/screens/WardrobeScreen.tsx`.

## 7. Troubleshooting

### Image Upload Issues
- Check Supabase storage policies are correctly set
- Verify storage bucket `clothing-images` exists
- Ensure user is authenticated

### AI Processing Errors
- Verify API keys are correctly set in environment variables
- Check API quotas and billing status
- Review console logs for specific error messages

### Performance
- Images are automatically compressed to reduce bandwidth
- Consider implementing image caching for better performance
- Use pagination for large wardrobes

## Next Steps
Once the wardrobe feature is working:
1. Add outfit creation and management
2. Implement AI outfit recommendations
3. Add social features for sharing outfits
4. Integrate shopping recommendations 