import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  accentColor?: string;
  loading?: boolean;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  accentColor,
  loading = false,
  accessibilityLabel,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withTiming(0.85, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  };

  const containerStyle = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    accentColor ? { borderColor: accentColor, backgroundColor: accentColor } : null,
  ];

  const textStyle = [
    styles.label,
    variant === 'primary' && styles.labelPrimary,
    variant === 'secondary' && styles.labelSecondary,
    variant === 'ghost' && styles.labelGhost,
  ];

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={containerStyle}
      >
        <View style={styles.row}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : null}
          <Text style={textStyle}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: '#0F4C81',
    borderColor: '#0F4C81',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0F4C81',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: '#0F4C81',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  labelPrimary: {
    color: '#FFFFFF',
  },
  labelSecondary: {
    color: '#0F4C81',
  },
  labelGhost: {
    color: '#0F4C81',
  },
});
