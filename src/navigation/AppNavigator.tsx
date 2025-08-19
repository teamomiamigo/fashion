import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

// Import your screens here
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import NewLandingScreen from '../screens/NewLandingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WardrobeScreen from '../screens/WardrobeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Wardrobe" 
        component={WardrobeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, initSession } = useAuthStore();
  const [hasSeenLanding, setHasSeenLanding] = useState(false);

  useEffect(() => {
    // Initialize session on app start
    console.log('🔧 Initializing authentication session...');
    initSession();
  }, [initSession]);

  // Debug logging
  console.log('🔍 Navigation Debug:', {
    hasSeenLanding,
    isAuthenticated,
    isLoading
  });

  // TEMPORARY: Force login screen for testing
  const forceShowLogin = true; // Set this to false to restore normal behavior

  // Show loading screen while checking authentication
  if (isLoading) {
    console.log('📱 Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenLanding && !forceShowLogin ? (
          <Stack.Screen name="Landing">
            {() => {
              console.log('📱 Showing Landing Screen');
              return (
                <NewLandingScreen 
                  onGetStarted={() => setHasSeenLanding(true)} 
                  onLogin={() => setHasSeenLanding(true)}
                />
              );
            }}
          </Stack.Screen>
        ) : (isAuthenticated && !forceShowLogin) ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth">
            {() => {
              console.log('📱 Showing Login Screen');
              return <LoginScreen onBack={() => setHasSeenLanding(false)} />;
            }}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 