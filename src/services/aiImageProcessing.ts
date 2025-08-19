import { AIProcessingResult } from '../types/clothing';

// Configuration for AI services
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

interface OpenAIVisionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface OpenAIImageResponse {
  data: Array<{
    url: string;
  }>;
}

/**
 * Processes ANY clothing image to make it look professional - works with any quality
 * @param imageUri - Local image URI from camera/gallery (any quality)
 * @returns Professional ironed, hanged clothing image
 */
export async function processClothingImageWithAI(imageUri: string): Promise<AIProcessingResult> {
  try {
    console.log('🎨 Starting image transformation for any photo quality...');
    
    // Transform any photo into professional clothing presentation
    const processedImageUrl = await transformAnyPhotoToProfessional(imageUri);
    
    console.log('✅ Image transformation complete!');
    
    return {
      processedImageUrl,
      detectedCategory: 'clothing',
      detectedColors: [],
      suggestedTags: ['wardrobe'],
      confidence: 1.0,
    };
  } catch (error) {
    console.error('❌ Error transforming image:', error);
    
    // Fallback: return original image
    return {
      processedImageUrl: imageUri,
      detectedCategory: 'clothing',
      detectedColors: [],
      suggestedTags: ['wardrobe'],
      confidence: 0,
    };
  }
}

/**
 * Transform ANY photo (blurry, wrinkled, bad lighting) into professional clothing presentation
 */
async function transformAnyPhotoToProfessional(imageUri: string): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not configured, using original image');
      return imageUri;
    }

    console.log('🔍 Analyzing photo to understand the clothing item...');

    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);

    // Use Vision API to understand what clothing item this is, regardless of photo quality
    const detailedDescription = await analyzeClothingFromAnyPhoto(base64Image);
    
    console.log('🪄 Creating professional version based on analysis...');
    
    // Generate professional version using the detailed description
    const professionalImage = await generateProfessionalClothing(detailedDescription);
    
    return professionalImage;
  } catch (error) {
    console.error('❌ Transformation failed:', error);
    console.log('📷 Using original image as fallback');
    return imageUri;
  }
}

/**
 * Analyze ANY photo (even poor quality) to understand the clothing item
 */
async function analyzeClothingFromAnyPhoto(base64Image: string): Promise<string> {
  try {
    console.log('🔍 Vision AI analyzing clothing from photo...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `I need you to analyze this clothing item photo and describe it in detail for creating a professional product photo. Even if the photo is blurry, wrinkled, poorly lit, or taken in bad conditions, please identify:

1. Type of garment (shirt, jacket, pants, dress, etc.)
2. Main colors and color combinations
3. Material/fabric type (cotton, denim, wool, etc.)
4. Key design features (buttons, zippers, pockets, patterns, logos)
5. Style details (collar type, sleeves, fit, etc.)
6. Brand if visible
7. Any distinctive characteristics

Ignore the photo quality and focus on the actual clothing item. Describe it as if you're creating a professional product listing. Be specific and detailed.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    if (response.ok) {
      const data: OpenAIVisionResponse = await response.json();
      const description = data.choices[0]?.message?.content || 'a clothing item';
      console.log('🔍 Detailed analysis:', description.substring(0, 100) + '...');
      return description;
    } else {
      console.log('⚠️ Vision analysis failed, using fallback approach');
      return 'a clothing item with neutral colors and standard design';
    }
  } catch (error) {
    console.log('⚠️ Vision analysis error, using fallback');
    return 'a clothing item with neutral colors and standard design';
  }
}

/**
 * Generate professional clothing image based on detailed description
 */
async function generateProfessionalClothing(clothingDescription: string): Promise<string> {
  const attempts = [
    // First try: High quality square format
    {
      model: "dall-e-3",
      quality: "hd",
      size: "1024x1024"
    },
    // Second try: Standard quality square
    {
      model: "dall-e-3", 
      quality: "standard",
      size: "1024x1024"
    },
    // Third try: Portrait format (good for hanging clothes)
    {
      model: "dall-e-3",
      quality: "standard", 
      size: "1024x1792"
    }
  ];

  for (let i = 0; i < attempts.length; i++) {
    const config = attempts[i];
    console.log(`🎯 Generation attempt ${i + 1}: ${config.quality} quality, ${config.size}`);
    
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model,
          prompt: `Create a professional, high-end fashion catalog photo based on this description: ${clothingDescription}

Requirements:
- The garment should look perfectly ironed, crisp, and pristine
- Hang it elegantly on a premium clothing hanger
- Use a clean, minimal white or soft gray studio background
- Professional studio lighting that's soft and even
- No wrinkles, stains, or imperfections
- Make it look like it belongs in a luxury boutique
- Focus on the exact design details, colors, and features described
- Maintain brand accuracy if mentioned
- Style it as a premium product photo that would make someone want to buy it

The result should look like professional retail photography, regardless of what the original photo looked like.`,
          n: 1,
          size: config.size,
          quality: config.quality,
          style: "natural"
        }),
      });

      if (response.ok) {
        const data: OpenAIImageResponse = await response.json();
        if (data.data && data.data[0]?.url) {
          console.log(`✅ Professional clothing image created on attempt ${i + 1}!`);
          return data.data[0].url;
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Attempt ${i + 1} failed: ${response.statusText}`);
        
        // If this is the last attempt, throw the error
        if (i === attempts.length - 1) {
          throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
        }
      }
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} error:`, (error as Error).message);
      
      // If this is the last attempt, throw the error
      if (i === attempts.length - 1) {
        throw error;
      }
    }
  }

  throw new Error('All image generation attempts failed');
}

/**
 * Convert image URI to base64 string
 */
async function imageToBase64(imageUri: string): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    throw error;
  }
} 