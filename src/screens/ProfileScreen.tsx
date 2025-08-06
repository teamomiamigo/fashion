import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Profile
        </Text>
        
        <View className="bg-gray-50 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            User Information
          </Text>
          <Text className="text-gray-600">Email: {user?.email}</Text>
          {user?.name && (
            <Text className="text-gray-600">Name: {user.name}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={logout}
          className="bg-red-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 