export type DeviceTransport = 'bluetooth' | 'wifi';

export type DeviceStatus = 'online' | 'sleeping';

export type DeviceSeed = {
  id: string;
  name: string;
  transport: DeviceTransport;
  location: string;
  status: DeviceStatus;
};

export type LoginProvider = 'facebook' | 'google';

export const DEFAULT_SITE_URL = 'https://expo.dev';

export const STORAGE_KEYS = {
  signedIn: 'easacc:signed-in',
  siteUrl: 'easacc:site-url',
  selectedDeviceId: 'easacc:selected-device-id',
  lastProvider: 'easacc:last-login-provider',
} as const;

export const SOCIAL_PROVIDERS = [
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    description: 'Use a Facebook account to enter the app.',
    accent: '#1877F2',
  },
  {
    id: 'google',
    label: 'Continue with Google',
    description: 'Use a Google account to enter the app.',
    accent: '#1F2937',
  },
] as const;

export const DEVICE_SEEDS: DeviceSeed[] = [
  {
    id: 'front-desk-printer',
    name: 'Front Desk Printer',
    transport: 'wifi',
    location: 'Reception',
    status: 'online',
  },
  {
    id: 'label-station',
    name: 'Label Station',
    transport: 'bluetooth',
    location: 'Packing table',
    status: 'online',
  },
  {
    id: 'warehouse-queue',
    name: 'Warehouse Queue Printer',
    transport: 'wifi',
    location: 'North aisle',
    status: 'sleeping',
  },
  {
    id: 'mobile-service-kit',
    name: 'Mobile Service Kit',
    transport: 'bluetooth',
    location: 'Field support',
    status: 'online',
  },
];

export const transportLabel: Record<DeviceTransport, string> = {
  wifi: 'Wi-Fi',
  bluetooth: 'Bluetooth',
};

export const statusLabel: Record<DeviceStatus, string> = {
  online: 'Online',
  sleeping: 'Sleeping',
};
