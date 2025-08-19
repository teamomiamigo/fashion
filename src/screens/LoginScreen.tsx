import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginFormData = z.infer<typeof loginSchema>;

interface LoginScreenProps { onBack: () => void; }

export default function LoginScreen({ onBack }: LoginScreenProps) {
  console.log('🎨 LoginScreen component rendered');
  
  const { signIn, signUp, resendConfirmation, isLoading, error, clearError } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }, // avoid uncontrolled->controlled warnings
    mode: 'onChange',
  });

  const email = watch('email');
  const password = watch('password');
  const emailValid = !!email && !errors.email;

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      setShowResendButton(false);
      if (isSignUp) {
        await signUp(data.email, data.password);
        Alert.alert('Account Created!', 'Check your email to confirm your account.');
        setIsSignUp(false);
        setShowResendButton(true);
      } else {
        await signIn(data.email, data.password);
        // TODO: if (remember) persist email to SecureStore
      }
    } catch (e: any) {
      if (e?.message?.toLowerCase()?.includes('confirmation')) setShowResendButton(true);
      console.log('Authentication error:', e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ===== Top Black Hero ===== */}
        <View className="bg-black px-6 pt-6 pb-6">
          {/* Back (optional) */}
          <TouchableOpacity
            onPress={onBack}
            accessibilityRole="button"
            className="absolute left-4 top-6"
          >
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <Text
            className="text-white text-center"
            style={{ fontSize: 36, lineHeight: 40, fontWeight: '800' }}
          >
            Login{' '}
            <Text
              className="text-white"
              style={{
                fontStyle: 'italic',
                fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
                fontWeight: '700',
              }}
            >
              Account
            </Text>
          </Text>

          {/* Switch pill */}
          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
              clearError();
              setShowResendButton(false);
            }}
            className="self-center mt-4 rounded-full px-5 py-3 bg-white/100 border border-gray-200"
          >
            <Text className="text-black font-medium">
              {isSignUp ? 'Have an account?  →' : "Haven't account yet?  →"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===== Form ===== */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 }}
        >
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-6">
                <Text className="text-black font-medium mb-3 text-base">Email Address</Text>
                <View className="relative">
                  <TextInput
                    placeholder="bidara@pc.com"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    onBlur={onBlur}
                    editable={!isLoading}
                    value={value}
                    onChangeText={onChange}
                    className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-black text-base pr-12 shadow-sm"
                  />
                  {emailValid && (
                    <View className="absolute right-3 top-1/2 -translate-y-1/2">
                      <View className="w-7 h-7 rounded-full bg-green-500 items-center justify-center">
                        <Feather name="check" size={16} color="white" />
                      </View>
                    </View>
                  )}
                </View>
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="mb-8">
                <Text className="text-black font-medium mb-3 text-base">Password</Text>
                <View className="relative">
                  <TextInput
                    placeholder="••••••••••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-black text-base pr-12 shadow-sm"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                )}
              </View>
            )}
          />

          {/* Error banner */}
          {!!error && (
            <View className="mb-6 bg-red-50 border border-red-200 rounded-xl p-3">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`rounded-full py-4 px-6 flex-row items-center justify-center gap-3 mb-4 ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600'
            }`}
            style={{
              shadowColor: '#2563eb',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text className="text-white text-base font-semibold">
                  {isSignUp ? 'Create Account' : 'Login Now!'}
                </Text>
                <Feather name="arrow-right" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Remember Password pill */}
          <TouchableOpacity
            onPress={() => setRemember(!remember)}
            className={`self-center rounded-full px-5 py-3 border ${
              remember ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'
            }`}
          >
            <Text className="text-black font-medium">Remember Password</Text>
          </TouchableOpacity>

          {/* Resend confirmation */}
          {showResendButton && (
            <TouchableOpacity
              onPress={async () => {
                if (!email) return Alert.alert('Error', 'Please enter your email first.');
                await resendConfirmation(email);
                Alert.alert('Confirmation Email Sent', 'Check your inbox for the link.');
              }}
              className="mt-4 self-center"
            >
              <Text className="text-blue-600">Resend Confirmation Email</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* ===== Bottom Bar (matches landing) ===== */}
        <View className="bg-black px-6 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="w-12 h-12 bg-black rounded-lg items-center justify-center">
              <Text className="text-white text-xl font-extrabold">F</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-12 h-12 bg-black rounded-lg items-center justify-center">
              <Feather name="mail" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-full px-4 py-2 flex-row items-center gap-2">
              <Feather name="user" size={16} color="black" />
              <Text className="text-black font-medium">Account</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-12 h-12 bg-black rounded-lg items-center justify-center">
              <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="w-32 h-1 bg-white rounded-full self-center mt-2" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
