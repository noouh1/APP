import { StyleSheet, Text, TextInput, View } from 'react-native';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  errorText?: string | null;
  keyboardType?: 'default' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
};

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  errorText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
}: FieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#6B7686"
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, errorText ? styles.inputError : null]}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      {!errorText && helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: '#102033',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6DCE5',
    backgroundColor: '#FFFFFF',
    color: '#102033',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#C2410C',
  },
  helper: {
    color: '#5B6777',
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    color: '#9A3412',
    fontSize: 13,
    lineHeight: 18,
  },
});
