import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { DEFAULT_SITE_URL } from '@/constants/app';
import { formatHostname, normalizeSiteUrl } from '@/constants/urls';
import { useAppStore } from '@/hooks/use-app-store';

function isValidUrl(value: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function WebViewScreen() {
  const router = useRouter();
  const { isReady, signedIn, siteUrl, activeDevice } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && !signedIn) {
      router.replace('/' as never);
    }
  }, [isReady, router, signedIn]);

  const url = useMemo(() => normalizeSiteUrl(siteUrl) ?? DEFAULT_SITE_URL, [siteUrl]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [url]);

  if (!isReady) {
    return (
      <View style={styles.loadingShell}>
        <ActivityIndicator color="#0f172a" />
      </View>
    );
  }

  if (!isValidUrl(url)) {
    return (
      <View style={styles.loadingShell}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>The saved URL is invalid.</Text>
          <Text style={styles.emptyText}>Return to settings and enter a complete web address.</Text>
          <Button label="Back to settings" onPress={() => router.replace('/settings' as never)} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingShell}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>We could not load the site.</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <View style={styles.actionRow}>
            <Button label="Retry" onPress={() => setError(null)} />
            <Button label="Settings" onPress={() => router.replace('/settings' as never)} variant="secondary" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <Screen
      title="Web view"
      subtitle={`Opening ${formatHostname(url)} with ${activeDevice?.name ?? 'no device selected'}.`}
      action={<Button label="Settings" onPress={() => router.replace('/settings' as never)} variant="secondary" />}
    >
      <View style={styles.panel}>
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Site</Text>
            <Text style={styles.metaValue}>{formatHostname(url)}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Printer</Text>
            <Text style={styles.metaValue}>{activeDevice?.name ?? 'None selected'}</Text>
          </View>
        </View>

        <View style={styles.viewer}>
          {isLoading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#0f172a" />
              <Text style={styles.loadingText}>Loading the configured site...</Text>
            </View>
          ) : null}

          <WebView
            source={{ uri: url }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={(event) => {
              setIsLoading(false);
              setError(event.nativeEvent.description || 'The web view failed to load.');
            }}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#0f172a" />
              </View>
            )}
            style={styles.webview}
          />
        </View>
      </View>

      <Pressable onPress={() => router.replace('/settings' as never)} style={styles.footerLink}>
        <Text style={styles.footerLinkText}>Change URL in settings</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingShell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3F8',
  },
  panel: {
    gap: 16,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaBlock: {
    flex: 1,
    minWidth: 160,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DCE5',
    gap: 4,
  },
  metaLabel: {
    color: '#5B6777',
    fontSize: 13,
    fontWeight: '700',
  },
  metaValue: {
    color: '#102033',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  viewer: {
    flex: 1,
    minHeight: 420,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DCE5',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  loadingText: {
    color: '#5B6777',
    fontSize: 13,
    fontWeight: '700',
  },
  footerLink: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 2,
    marginTop: 10,
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#475569',
    textAlign: 'center',
  },
  actionRow: {
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
});