import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuthStore();
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Mock login - replace with actual Supabase auth
    login({
      id: '1',
      email: data.email,
      name: 'User',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-6">
        <Text className="text-3xl font-bold text-gray-800 text-center mb-8">
          Welcome Back
        </Text>

        <View className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  className="border border-gray-300 rounded-lg p-4 text-gray-800"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  className="border border-gray-300 rounded-lg p-4 text-gray-800"
                  secureTextEntry
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="bg-blue-500 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 