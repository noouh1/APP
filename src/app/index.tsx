import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { SOCIAL_PROVIDERS } from '@/constants/app';
import { useAppStore } from '@/hooks/use-app-store';

export default function LoginScreen() {
  const router = useRouter();
  const { isReady, signedIn, signIn } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  useEffect(() => {
    if (isReady && signedIn) {
      router.replace('/settings' as never);
    }
  }, [isReady, router, signedIn]);

  const handleLogin = async () => {
    setError(null);

    // Validate inputs
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll use a mock login with the google provider
      // In a real app, this would be a proper email/password authentication
      await signIn('google');
      router.replace('/settings' as never);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerId: 'facebook' | 'google') => {
    setSocialLoading(providerId);
    try {
      await signIn(providerId);
      router.replace('/settings' as never);
    } catch (err) {
      setError(`Login with ${providerId} failed. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F4C81" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Logo / Branding Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>Ea</Text>
        </View>
        <Text style={styles.title}>Easacc</Text>
        <Text style={styles.subtitle}>Configure and send web content to your device</Text>
      </View>

      {/* Social Login Section */}
      <View style={styles.socialSection}>
        <Text style={styles.sectionLabel}>Sign in with</Text>
        <View style={styles.socialButtons}>
          {SOCIAL_PROVIDERS.map((provider) => (
            <Button
              key={provider.id}
              label={socialLoading === provider.id ? 'Loading...' : provider.label}
              onPress={() => handleSocialLogin(provider.id as 'facebook' | 'google')}
              variant="primary"
              accentColor={provider.accent}
              loading={socialLoading === provider.id}
              accessibilityLabel={`Sign in with ${provider.id}`}
            />
          ))}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or with email</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email/Password Login Form */}
      <View style={styles.form}>
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          label={isLoading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          loading={isLoading}
          accessibilityLabel="Sign in to your account"
        />
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          A simple mobile app for authentication, URL configuration, and device selection.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3F8',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    minHeight: '100%',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3F8',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#0F4C81',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    color: '#102033',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#5B6777',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
  socialSection: {
    gap: 12,
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#102033',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  socialButtons: {
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D5DCE6',
  },
  dividerText: {
    color: '#5B6777',
    fontSize: 13,
    fontWeight: '500',
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  errorText: {
    color: '#C2410C',
    fontSize: 14,
    fontWeight: '500',
    marginTop: -12,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#5B6777',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 320,
  },
});