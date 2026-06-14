import { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}>;

export function Screen({ title, subtitle, action, children }: ScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {action ? <View>{action}</View> : null}
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 18,
    backgroundColor: '#EEF3F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 8,
  },
  title: {
    color: '#102033',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.02,
  },
  subtitle: {
    color: '#5B6777',
    fontSize: 15,
    lineHeight: 22,
  },
});
