import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import type { Session } from '@supabase/supabase-js';

import { AppColors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { adminEmail, getCurrentSession, supabase } from '@/lib/supabase';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const currentSession = await getCurrentSession();
        if (active) {
          setSession(currentSession);
        }
      } finally {
        if (active) {
          setIsSessionLoading(false);
        }
      }
    };

    loadSession();

    const subscription = supabase?.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsSessionLoading(false);
    });

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isSessionLoading) {
      return;
    }

    const publicPaths = new Set(['/', '/auth', '/modal', '/reset-password']);
    const isAuthRoute = pathname === '/auth';
    const isAdminSession = session?.user?.email?.toLowerCase() === adminEmail.toLowerCase();

    if (!session && !publicPaths.has(pathname)) {
      router.replace('/auth');
      return;
    }

    if (session && isAuthRoute) {
      router.replace(isAdminSession ? '/admin' : '/(tabs)');
    }
  }, [isSessionLoading, pathname, router, session]);

  if (isSessionLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: AppColors.bg,
        }}>
        <ActivityIndicator size="large" color={AppColors.accentStrong} />
      </View>
    );
  }

  return (
    <ThemeProvider
      value={{
        ...theme,
        colors: {
          ...theme.colors,
          background: Colors.light.background,
          card: Colors.light.background,
          text: Colors.light.text,
          primary: Colors.light.tint,
          border: AppColors.border,
        },
      }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Presentation Tasmim Web' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
