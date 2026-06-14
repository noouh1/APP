import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { SOCIAL_PROVIDERS } from '@/constants/app';
import { useAppStore } from '@/hooks/use-app-store';

export default function LoginScreen() {
  const router = useRouter();
  const { isReady, signedIn, signIn } = useAppStore();

  useEffect(() => {
    if (isReady && signedIn) {
      router.replace('/settings' as never);
    }
  }, [isReady, router, signedIn]);

  const handleLogin = async (providerId: 'facebook' | 'google') => {
    await signIn(providerId);
    router.replace('/settings' as never);
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#0F4C81" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Setup center</Text>
        <Text style={styles.title}>Sign in, set the site, and send it to the web view.</Text>
        <Text style={styles.subtitle}>
          A compact flow for social login, URL configuration, and nearby printer selection.
        </Text>
      </View>

      <View style={styles.card}>
        {SOCIAL_PROVIDERS.map((provider) => (
          <View key={provider.id} style={styles.providerBlock}>
            <Button
              label={provider.label}
              accentColor={provider.accent}
              onPress={() => {
                void handleLogin(provider.id);
              }}
            />
            <Text style={styles.providerHelp}>{provider.description}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>This starter uses mocked social login so the flow stays self-contained.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3F8',
  },
  container: {
    flex: 1,
    backgroundColor: '#EEF3F8',
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 22,
    justifyContent: 'center',
  },
  hero: {
    gap: 12,
  },
  kicker: {
    color: '#0F4C81',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: '#102033',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.02,
  },
  subtitle: {
    color: '#5B6777',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 560,
  },
  card: {
    gap: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DCE5',
  },
  providerBlock: {
    gap: 10,
  },
  providerHelp: {
    color: '#5B6777',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    color: '#5B6777',
    fontSize: 13,
    lineHeight: 18,
  },
});