export interface ClothingItem {
  id: string;
  originalImageUrl: string;
  processedImageUrl: string;
  category?: string;
  subCategory?: string;
  colors: string[];
  tags: string[];
  brand?: string;
  size?: string;
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  occasionTags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ClothingCategory {
  id: string;
  name: string;
  parentCategory?: string;
  subcategories?: string[];
}

export interface AIProcessingResult {
  processedImageUrl: string;
  detectedCategory: string;
  detectedColors: string[];
  suggestedTags: string[];
  confidence: number;
}

export type ClothingFormData = {
  category: string;
  subCategory?: string;
  brand?: string;
  size?: string;
  season: string;
  occasionTags: string[];
  customTags: string[];
}; 