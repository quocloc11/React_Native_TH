import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  isLoading = false,
  disabled = false,
  icon: Icon
}) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        styles[size],
        styles[variant],
        disabled && styles.disabled,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isOutline ? '#3b82f6' : '#fff'} size="small" />
      ) : (
        <View style={styles.content}>
          {Icon && <View style={styles.iconWrapper}>{Icon}</View>}
          <Text style={[
            styles.text,
            styles[`text_${size}`],
            isOutline && styles.textOutline,
            disabled && styles.textDisabled
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  // Variants
  primary: { backgroundColor: '#3b82f6' },
  secondary: { backgroundColor: '#f1f5f9' },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#3b82f6' },
  disabled: { backgroundColor: '#cbd5e1', borderColor: '#cbd5e1' },
  // Sizes
  small: { paddingVertical: 8, paddingHorizontal: 16 },
  medium: { paddingVertical: 14, paddingHorizontal: 24 },
  large: { paddingVertical: 18, paddingHorizontal: 32 },
  // Text Styles
  text: { fontWeight: 'bold', color: '#fff' },
  textOutline: { color: '#3b82f6' },
  textDisabled: { color: '#94a3b8' },
  text_small: { fontSize: 14 },
  text_medium: { fontSize: 16 },
  text_large: { fontSize: 18 },
});

export default CustomButton;