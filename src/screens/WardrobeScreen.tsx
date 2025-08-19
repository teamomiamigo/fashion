import * as ImagePicker from 'expo-image-picker';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useWardrobeStore } from '../store/useWardrobeStore';
import { ClothingItem } from '../types/clothing';

export default function WardrobeScreen() {
  const { 
    clothingItems, 
    isLoading, 
    addClothingItem, 
    loadClothingItems 
  } = useWardrobeStore();

  useEffect(() => {
    loadClothingItems();
  }, []);

  const handleAddClothing = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to add clothing items.');
        return;
      }

      // Show options for camera or gallery
      Alert.alert(
        'Add Clothing Item',
        'Choose how you want to add your clothing item',
        [
          {
            text: 'Camera',
            onPress: () => selectImageFromCamera(),
          },
          {
            text: 'Gallery',
            onPress: () => selectImageFromGallery(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const selectImageFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processClothingImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const selectImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processClothingImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const processClothingImage = async (imageUri: string) => {
    try {
      // This will process the image with AI (background removal, enhancement)
      await addClothingItem(imageUri);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process clothing item');
    }
  };

  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity 
      style={styles.clothingItem}
      onPress={() => {
        // Handle item selection/viewing
        console.log('Selected item:', item.id);
      }}
    >
      <Image 
        source={{ uri: item.processedImageUrl }} 
        style={styles.clothingImage}
        resizeMode="cover"
      />
      {item.category && (
        <View style={styles.categoryLabel}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Wardrobe</Text>
          <TouchableOpacity
            onPress={handleAddClothing}
            style={[styles.addButton, isLoading && styles.addButtonDisabled]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.addButtonText}>+ Add Item</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Clothing Grid */}
        {clothingItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your wardrobe is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add your first clothing item to get started
            </Text>
            <TouchableOpacity
              onPress={handleAddClothing}
              style={[styles.primaryButton, isLoading && styles.addButtonDisabled]}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>Add Your First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={clothingItems}
            renderItem={renderClothingItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  clothingItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clothingImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
}); 