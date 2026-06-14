import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { statusLabel, transportLabel, type DeviceSeed } from '@/constants/app';

type DevicePickerProps = {
  devices: DeviceSeed[];
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
  discoveryStatus: 'scanning' | 'ready';
  lastUpdatedAt: Date | null;
};

export function DevicePicker({
  devices,
  value,
  onChange,
  onRefresh,
  discoveryStatus,
  lastUpdatedAt,
}: DevicePickerProps) {
  const [open, setOpen] = useState(false);

  const selectedDevice = useMemo(() => devices.find((device) => device.id === value) ?? null, [devices, value]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Printer / device</Text>

      <Pressable accessibilityRole="button" onPress={() => setOpen(true)} style={styles.field}>
        <View style={styles.fieldCopy}>
          <Text style={styles.fieldTitle}>{selectedDevice ? selectedDevice.name : 'Choose a nearby device'}</Text>
          <Text style={styles.fieldSubtitle}>
            {selectedDevice
              ? `${transportLabel[selectedDevice.transport]} · ${selectedDevice.location}`
              : discoveryStatus === 'scanning'
                ? 'Scanning nearby devices...'
                : 'Tap to pick a Wi-Fi or Bluetooth target'}
          </Text>
        </View>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>

      {selectedDevice ? (
        <View style={styles.metaRow}>
          <Badge label={transportLabel[selectedDevice.transport]} />
          <Badge label={statusLabel[selectedDevice.status]} tone={selectedDevice.status === 'online' ? 'success' : 'muted'} />
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <Button label={discoveryStatus === 'scanning' ? 'Scanning...' : 'Refresh devices'} onPress={onRefresh} variant="secondary" />
        {lastUpdatedAt ? (
          <Text style={styles.note}>Updated {lastUpdatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
        ) : (
          <Text style={styles.note}>{devices.length} devices found</Text>
        )}
      </View>

      <Modal animationType="slide" transparent visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Nearby devices</Text>
                <Text style={styles.sheetSubtitle}>Pick a printer or network device for the current workflow.</Text>
              </View>

              <Button label="Done" onPress={() => setOpen(false)} variant="ghost" />
            </View>

            <FlatList
              data={devices}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              contentContainerStyle={devices.length === 0 ? styles.emptyList : undefined}
              renderItem={({ item }) => {
                const isSelected = item.id === value;

                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [styles.deviceRow, isSelected && styles.deviceRowSelected, pressed && styles.deviceRowPressed]}
                  >
                    <View style={styles.deviceCopy}>
                      <Text style={styles.deviceName}>{item.name}</Text>
                      <Text style={styles.deviceMeta}>
                        {transportLabel[item.transport]} · {item.location}
                      </Text>
                    </View>
                    <View style={styles.badgeStack}>
                      <Badge label={transportLabel[item.transport]} />
                      <Badge label={statusLabel[item.status]} tone={item.status === 'online' ? 'success' : 'muted'} />
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No nearby devices found</Text>
                  <Text style={styles.emptyCopy}>Refresh to try again or add native discovery later.</Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Badge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'muted' }) {
  return <Text style={[styles.badge, tone === 'success' && styles.badgeSuccess, tone === 'muted' && styles.badgeMuted]}>{label}</Text>;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  field: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbe3f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldCopy: {
    flex: 1,
    gap: 4,
  },
  fieldTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  fieldSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#475569',
  },
  chevron: {
    fontSize: 22,
    color: '#475569',
    marginTop: -4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  note: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
    flexShrink: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#f8fafc',
    padding: 18,
    gap: 12,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#c9d1dd',
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  sheetTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  sheetSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
    maxWidth: 300,
  },
  divider: {
    height: 10,
  },
  deviceRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbe3f0',
    backgroundColor: '#ffffff',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  deviceRowSelected: {
    borderColor: '#0f172a',
    backgroundColor: '#eff6ff',
  },
  deviceRowPressed: {
    opacity: 0.94,
  },
  deviceCopy: {
    flex: 1,
    gap: 4,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  deviceMeta: {
    fontSize: 12,
    lineHeight: 17,
    color: '#475569',
  },
  badgeStack: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgeMuted: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyState: {
    paddingVertical: 28,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
    textAlign: 'center',
    maxWidth: 260,
  },
});