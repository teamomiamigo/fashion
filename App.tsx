import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppNavigator />
      <StatusBar style="auto" />
    </View>
  );
}
