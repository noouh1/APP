import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { DEFAULT_SITE_URL, STORAGE_KEYS, type LoginProvider, type PrinterDevice } from '@/constants/app';
import { normalizeSiteUrl } from '@/constants/urls';
import { useNearbyDevices } from '@/hooks/use-nearby-devices';

type AppStore = {
  isReady: boolean;
  signedIn: boolean;
  lastLoginProvider: LoginProvider | null;
  siteUrl: string;
  selectedDeviceId: string | null;
  devices: PrinterDevice[];
  selectedDevice: PrinterDevice | null;
  activeDevice: PrinterDevice | null;
  isScanningDevices: boolean;
  discoveryUpdatedAt: Date | null;
  refreshDevices: () => void;
  signIn: (provider: LoginProvider) => Promise<void>;
  signOut: () => Promise<void>;
  setSiteUrl: (siteUrl: string) => Promise<void>;
  setSelectedDeviceId: (deviceId: string) => Promise<void>;
};

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: PropsWithChildren) {
  const { devices = [], isScanning = false, lastUpdated = null, refresh = () => {} } = useNearbyDevices() ?? {};

  const [isReady, setIsReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [lastLoginProvider, setLastLoginProvider] = useState<LoginProvider | null>(null);
  const [siteUrl, setSiteUrlState] = useState(DEFAULT_SITE_URL);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [savedSignedIn, savedSiteUrl, savedSelectedDeviceId, savedProvider] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.signedIn),
        AsyncStorage.getItem(STORAGE_KEYS.siteUrl),
        AsyncStorage.getItem(STORAGE_KEYS.selectedDeviceId),
        AsyncStorage.getItem(STORAGE_KEYS.lastProvider),
      ]);

      if (!mounted) {
        return;
      }

      setSignedIn(savedSignedIn === 'true');
      setSiteUrlState(normalizeSiteUrl(savedSiteUrl ?? DEFAULT_SITE_URL) ?? DEFAULT_SITE_URL);
      setSelectedDeviceIdState(savedSelectedDeviceId || null);
      setLastLoginProvider(savedProvider === 'facebook' || savedProvider === 'google' ? savedProvider : null);
      setIsReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void AsyncStorage.multiSet([
      [STORAGE_KEYS.signedIn, String(signedIn)],
      [STORAGE_KEYS.siteUrl, siteUrl],
      [STORAGE_KEYS.selectedDeviceId, selectedDeviceId ?? ''],
      [STORAGE_KEYS.lastProvider, lastLoginProvider ?? ''],
    ]);
  }, [isReady, lastLoginProvider, selectedDeviceId, signedIn, siteUrl]);

  useEffect(() => {
    if (!isReady || (devices?.length ?? 0) === 0) {
      return;
    }

    const hasSelectedDevice = selectedDeviceId ? (devices ?? []).some((device) => device.id === selectedDeviceId) : false;

    if (!hasSelectedDevice) {
      setSelectedDeviceIdState((devices ?? [])[0].id);
    }
  }, [devices, isReady, selectedDeviceId]);

  const selectedDevice = useMemo(() => (devices ?? []).find((device) => device.id === selectedDeviceId) ?? null, [
    devices,
    selectedDeviceId,
  ]);

  const signIn = async (provider: LoginProvider) => {
    setSignedIn(true);
    setLastLoginProvider(provider);
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.signedIn, 'true'],
      [STORAGE_KEYS.lastProvider, provider],
    ]);
  };

  const signOut = async () => {
    setSignedIn(false);
    await AsyncStorage.setItem(STORAGE_KEYS.signedIn, 'false');
  };

  const setSiteUrl = async (value: string) => {
    const normalized = normalizeSiteUrl(value) ?? DEFAULT_SITE_URL;
    setSiteUrlState(normalized);
    await AsyncStorage.setItem(STORAGE_KEYS.siteUrl, normalized);
  };

  const setSelectedDeviceId = async (deviceId: string) => {
    setSelectedDeviceIdState(deviceId);
    await AsyncStorage.setItem(STORAGE_KEYS.selectedDeviceId, deviceId);
  };

  return (
    <AppStoreContext.Provider
      value={{
        isReady,
        signedIn,
        lastLoginProvider,
        siteUrl,
        selectedDeviceId,
        devices,
        selectedDevice,
        activeDevice: selectedDevice,
        isScanningDevices: isScanning,
        discoveryUpdatedAt: lastUpdated,
        refreshDevices: refresh,
        signIn,
        signOut,
        setSiteUrl,
        setSelectedDeviceId,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return context;
}