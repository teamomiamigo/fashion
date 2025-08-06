import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function HomeScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Fashion App
        </Text>
        <Text className="text-lg text-gray-600 text-center">
          {user ? `Hello, ${user.name || user.email}!` : 'Please log in to continue.'}
        </Text>
      </View>
    </SafeAreaView>
  );
} 