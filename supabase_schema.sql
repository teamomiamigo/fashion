-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clothing items table
CREATE TABLE IF NOT EXISTS clothing_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_image_url TEXT NOT NULL,
    processed_image_url TEXT NOT NULL,
    category TEXT,
    sub_category TEXT,
    colors TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    brand TEXT,
    size TEXT,
    season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter', 'all')),
    occasion_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clothing categories table for reference
CREATE TABLE IF NOT EXISTS clothing_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    parent_category TEXT,
    subcategories TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for clothing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothing-images', 'clothing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for clothing images
CREATE POLICY "Users can upload their own clothing images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own clothing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own clothing images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own clothing images"
ON storage.objects FOR DELETE
USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Row Level Security policies for clothing_items
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clothing items"
ON clothing_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clothing items"
ON clothing_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clothing items"
ON clothing_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clothing items"
ON clothing_items FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS clothing_items_user_id_idx ON clothing_items(user_id);
CREATE INDEX IF NOT EXISTS clothing_items_category_idx ON clothing_items(category);
CREATE INDEX IF NOT EXISTS clothing_items_created_at_idx ON clothing_items(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_clothing_items_updated_at
    BEFORE UPDATE ON clothing_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default clothing categories
INSERT INTO clothing_categories (name, subcategories) VALUES 
    ('tops', ARRAY['t-shirt', 'shirt', 'blouse', 'tank-top', 'sweater', 'hoodie']),
    ('bottoms', ARRAY['jeans', 'pants', 'shorts', 'skirt', 'leggings']),
    ('dresses', ARRAY['casual-dress', 'formal-dress', 'sundress', 'maxi-dress']),
    ('outerwear', ARRAY['jacket', 'coat', 'blazer', 'cardigan', 'vest']),
    ('shoes', ARRAY['sneakers', 'dress-shoes', 'boots', 'sandals', 'heels']),
    ('accessories', ARRAY['bag', 'hat', 'jewelry', 'belt', 'scarf']),
    ('activewear', ARRAY['workout-top', 'workout-bottom', 'sports-bra', 'athletic-shoes']),
    ('swimwear', ARRAY['bikini', 'one-piece', 'swim-shorts', 'cover-up']),
    ('underwear', ARRAY['bra', 'underwear', 'socks', 'tights']),
    ('sleepwear', ARRAY['pajamas', 'nightgown', 'robe', 'slippers'])
ON CONFLICT DO NOTHING; 