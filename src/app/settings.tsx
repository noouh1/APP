import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { DEFAULT_SITE_URL } from '@/constants/app';
import { formatHostname, normalizeSiteUrl } from '@/constants/urls';
import { useAppStore } from '@/hooks/use-app-store';
import { DevicePicker } from '../components/ui/device-picker';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    isReady,
    signedIn,
    siteUrl,
    selectedDeviceId,
    devices,
    activeDevice,
    isScanningDevices,
    discoveryUpdatedAt,
    setSiteUrl,
    setSelectedDeviceId,
    refreshDevices,
    signOut,
  } = useAppStore();

  const [draftUrl, setDraftUrl] = useState(siteUrl);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isReady && !signedIn) {
      router.replace('/' as never);
    }
  }, [isReady, router, signedIn]);

  useEffect(() => {
    setDraftUrl(siteUrl);
  }, [siteUrl]);

  const urlError = useMemo(() => {
    if (!draftUrl.trim()) {
      return 'Enter a web address to load in the browser view.';
    }

    return normalizeSiteUrl(draftUrl) ? null : 'Use a valid URL like https://example.com.';
  }, [draftUrl]);

  const handleSaveUrl = async () => {
    const normalized = normalizeSiteUrl(draftUrl);

    if (!normalized) {
      Alert.alert('Invalid URL', 'Enter a valid web address before saving.');
      return;
    }

    setIsSaving(true);

    try {
      await setSiteUrl(normalized);
      setDraftUrl(normalized);
      Alert.alert('Saved', 'The web view will use this address next time it opens.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#0f172a" />
      </View>
    );
  }

  return (
    <Screen
      title="Settings"
      subtitle="Set the target web address and choose a nearby printer or device."
      action={<Button label="Open site" onPress={() => router.push('/webview' as never)} variant="secondary" />}
    >
      <View style={styles.panel}>
        <Field
          label="Web URL"
          value={draftUrl}
          onChangeText={setDraftUrl}
          placeholder={DEFAULT_SITE_URL}
          helperText="This address is persisted locally and reused on the web view page."
          errorText={urlError}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.buttonRow}>
          <Button label="Save URL" onPress={() => void handleSaveUrl()} loading={isSaving} />
          <Button label="Reset" onPress={() => setDraftUrl(DEFAULT_SITE_URL)} variant="secondary" />
        </View>
      </View>

      <View style={styles.panel}>
        <DevicePicker
          devices={devices}
          value={selectedDeviceId ?? ''}
          onChange={(deviceId: string) => {
            void setSelectedDeviceId(deviceId);
          }}
          onRefresh={refreshDevices}
          discoveryStatus={isScanningDevices ? 'scanning' : 'ready'}
          lastUpdatedAt={discoveryUpdatedAt}
        />

        <View style={styles.summaryRow}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Current site</Text>
            <Text style={styles.summaryValue}>{formatHostname(siteUrl)}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Device target</Text>
            <Text style={styles.summaryValue}>
              {activeDevice ? `${activeDevice.name} · ${activeDevice.transport}` : 'None'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Account</Text>
        <Text style={styles.footerCopy}>Signed in on {Platform.OS}. Use sign out to return to the login screen.</Text>
        <Button label="Sign out" onPress={() => void signOut()} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3F8',
  },
  panel: {
    gap: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DCE5',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  summaryBlock: {
    flex: 1,
    minWidth: 160,
    gap: 4,
  },
  summaryLabel: {
    color: '#5B6777',
    fontSize: 13,
    fontWeight: '700',
  },
  summaryValue: {
    color: '#102033',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  footerCard: {
    gap: 10,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6DCE5',
  },
  footerTitle: {
    color: '#102033',
    fontSize: 16,
    fontWeight: '800',
  },
  footerCopy: {
    color: '#5B6777',
    fontSize: 13,
    lineHeight: 18,
  },
});