import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function HomeScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome to Fashion App
        </Text>
        <Text style={styles.subtitle}>
          {user ? `Hello, ${user.name || user.email}!` : 'Setting up your account...'}
        </Text>
        <Text style={styles.description}>
          Go to the Wardrobe tab to start adding your clothing items!
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
}); 