import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';

export const Badge = ({ label, variant = 'default' }: { label: string, variant?: 'default' | 'success' | 'error' | 'warning' }) => {
  const variants = { default: "bg-neutral-100", success: "bg-semantic-success/20", error: "bg-semantic-error/20", warning: "bg-semantic-warning/20" };
  const textColors = { default: "text-neutral-900", success: "text-semantic-success", error: "text-semantic-error", warning: "text-semantic-warning" };

  return (
    <View className={`px-2 py-1 rounded-full self-start ${variants[variant]}`}>
      <Text variant="caption" weight="bold" className={textColors[variant]}>{label}</Text>
    </View>
  );
};