import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_PRINTER_DEVICES, type PrinterDevice } from '@/constants/app';

type DeviceDiscoveryState = {
  devices: PrinterDevice[];
  isScanning: boolean;
  lastUpdated: Date | null;
  refresh: () => void;
};

export function useNearbyDevices(): DeviceDiscoveryState {
  const [devices, setDevices] = useState<PrinterDevice[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsScanning(true);

    timerRef.current = setTimeout(() => {
      setDevices(DEFAULT_PRINTER_DEVICES);
      setIsScanning(false);
      setLastUpdated(new Date());
    }, 650);
  }, []);

  useEffect(() => {
    refresh();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [refresh]);

  return { devices, isScanning, lastUpdated, refresh };
}
