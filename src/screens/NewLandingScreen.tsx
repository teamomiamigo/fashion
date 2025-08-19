import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

interface NewLandingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function NewLandingScreen({ onGetStarted, onLogin }: NewLandingScreenProps) {
  const videoRef = useRef<Video>(null);
  const { width } = useWindowDimensions();

  // responsive type: scale headline with device width
  const base = Math.min(width, 430); // cap for tablets
  const fs1 = Math.round(base * 0.12); // "Finding"
  const fs2 = Math.round(base * 0.13); // "Outfits" (italic)
  const fs3 = Math.round(base * 0.12); // "Better"

  return (
    <SafeAreaView style={styles.root}>
      {/* Background video - commented out until you add the video file */}
      {/* <Video
        ref={videoRef}
        style={StyleSheet.absoluteFill}
        source={require('../../assets/landing.mp4')}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        posterSource={require('../../assets/landing-poster.jpg')}
      /> */}

      {/* Temporary background color until video is added */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#111827' }]} />

      {/* Scrim for readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onLogin} hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}>
          <Text style={styles.login}>Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Hero copy */}
      <View style={styles.heroContainer}>
        <Text style={[styles.h1, { fontSize: fs1 }]}>Finding</Text>
        <Text
          style={[
            styles.h2Italic,
            { fontSize: fs2, fontStyle: 'italic', fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: undefined }) },
          ]}
        >
          Outfits
        </Text>
        <Text style={[styles.h1, { fontSize: fs3 }]}>Better</Text>
      </View>

      {/* Bottom CTA(s) */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity onPress={onGetStarted} style={styles.primaryCta} accessibilityRole="button" accessibilityLabel="Start shopping">
          <Text style={styles.primaryIcon}>🛍️</Text>
          <Text style={styles.primaryText}>Let's Shopping</Text>
          <Text style={styles.primaryArrow}>→</Text>
        </TouchableOpacity>

        {/* Optional secondary button */}
        <TouchableOpacity onPress={onGetStarted} style={styles.secondaryCta}>
          <Text style={styles.secondaryIcon}>f</Text>
          <Text style={styles.secondaryText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111827' },
  header: { paddingHorizontal: 24, paddingTop: 8, alignItems: 'flex-end' },
  login: { color: 'white', fontSize: 18, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },

  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    // left-align like the design; push text slightly right so it doesn’t collide with device edges
  },

  h1: {
    color: 'white',
    fontWeight: '800',
    lineHeight: 1.05 * 56,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  h2Italic: {
    color: 'white',
    fontWeight: '700',
    lineHeight: 1.05 * 60,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  ctaWrap: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },

  primaryCta: {
    backgroundColor: '#2563eb',
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryIcon: { color: 'white', fontSize: 18 },
  primaryText: { color: 'white', fontSize: 18, fontWeight: '700' },
  primaryArrow: { color: 'white', fontSize: 18 },

  secondaryCta: {
    backgroundColor: 'rgba(17,24,39,0.9)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryIcon: { color: 'white', fontSize: 18, fontWeight: '900' },
  secondaryText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
