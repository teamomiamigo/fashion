import { create } from 'zustand';
import { processClothingImageWithAI } from '../services/aiImageProcessing';
import { supabase } from '../services/supabase';
import { AIProcessingResult, ClothingItem } from '../types/clothing';

interface WardrobeState {
  clothingItems: ClothingItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadClothingItems: () => Promise<void>;
  addClothingItem: (imageUri: string) => Promise<void>;
  updateClothingItem: (id: string, updates: Partial<ClothingItem>) => Promise<void>;
  deleteClothingItem: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  clothingItems: [],
  isLoading: false,
  error: null,

  loadClothingItems: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('📱 No authenticated user - starting with empty wardrobe');
        set({ clothingItems: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert snake_case to camelCase
      const clothingItems = (data || []).map(item => ({
        id: item.id,
        originalImageUrl: item.original_image_url,
        processedImageUrl: item.processed_image_url,
        category: item.category,
        subCategory: item.sub_category,
        colors: item.colors || [],
        tags: item.tags || [],
        brand: item.brand,
        size: item.size,
        season: item.season,
        occasionTags: item.occasion_tags || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        userId: item.user_id,
      }));

      set({ clothingItems, isLoading: false });
    } catch (error) {
      console.error('Error loading clothing items:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load clothing items',
        isLoading: false 
      });
    }
  },

  addClothingItem: async (imageUri: string) => {
    try {
      set({ isLoading: true, error: null });
      
      console.log('📸 Starting clothing item processing...');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Process image with AI (cleanup, iron, background removal)
      const aiResult: AIProcessingResult = await processClothingImageWithAI(imageUri);
      
      console.log('🎨 AI processing complete, saving item...');

      // For now, we'll store the image URLs directly without uploading to Supabase storage
      // This is a simplified approach - in production you'd want to upload to storage
      const originalImageUrl = imageUri;
      const processedImageUrl = aiResult.processedImageUrl;

      // Create clothing item record in database
      const { data: clothingData, error: clothingError } = await supabase
        .from('clothing_items')
        .insert({
          user_id: user.id,
          original_image_url: originalImageUrl,
          processed_image_url: processedImageUrl,
          category: aiResult.detectedCategory,
          colors: aiResult.detectedColors,
          tags: aiResult.suggestedTags,
        })
        .select()
        .single();

      if (clothingError) throw clothingError;

      // Convert to ClothingItem format
      const newItem: ClothingItem = {
        id: clothingData.id,
        originalImageUrl: clothingData.original_image_url,
        processedImageUrl: clothingData.processed_image_url,
        category: clothingData.category,
        colors: clothingData.colors || [],
        tags: clothingData.tags || [],
        createdAt: clothingData.created_at,
        updatedAt: clothingData.updated_at,
        userId: clothingData.user_id,
      };

      console.log('✅ Clothing item added successfully!');

      set(state => ({
        clothingItems: [newItem, ...state.clothingItems],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error adding clothing item:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add clothing item',
        isLoading: false 
      });
      throw error;
    }
  },

  updateClothingItem: async (id: string, updates: Partial<ClothingItem>) => {
    try {
      set({ isLoading: true, error: null });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Convert camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.subCategory !== undefined) dbUpdates.sub_category = updates.subCategory;
      if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.size !== undefined) dbUpdates.size = updates.size;
      if (updates.season !== undefined) dbUpdates.season = updates.season;
      if (updates.occasionTags !== undefined) dbUpdates.occasion_tags = updates.occasionTags;

      const { error } = await supabase
        .from('clothing_items')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      set(state => ({
        clothingItems: state.clothingItems.map(item =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating clothing item:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update clothing item',
        isLoading: false 
      });
    }
  },

  deleteClothingItem: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the item to delete (for image URLs)
      const itemToDelete = get().clothingItems.find(item => item.id === id);
      
      // Delete from database
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Note: In this simplified version, we're not deleting from storage
      // since we're storing local file URIs. In production, you'd want to
      // properly handle storage cleanup.

      // Remove from local state
      set(state => ({
        clothingItems: state.clothingItems.filter(item => item.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting clothing item:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete clothing item',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
})); 