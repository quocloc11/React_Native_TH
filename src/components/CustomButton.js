import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function CustomButton({ title, onPress, variant = 'primary', size = 'md', icon: Icon, fullWidth, disabled, style }) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: COLORS.primaryLight };
      case 'outline': return { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border };
      default: return { backgroundColor: disabled ? COLORS.textLight : COLORS.dark };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary': return { color: COLORS.primary };
      case 'outline': return { color: COLORS.textMain };
      default: return { color: COLORS.white };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return { height: 36, paddingHorizontal: 16 };
      case 'lg': return { height: 56, paddingHorizontal: 32 };
      default: return { height: 48, paddingHorizontal: 24 };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.btnBase, getVariantStyle(), getSizeStyle(), fullWidth && { width: '100%' }, style]}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} color={getTextStyle().color} style={{ marginRight: 8 }} />}
      <Text style={[styles.btnText, getTextStyle(), size === 'sm' && { fontSize: 12 }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnBase: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  btnText: { fontWeight: 'bold' },
});