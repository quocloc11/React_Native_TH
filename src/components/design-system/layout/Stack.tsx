import React from 'react';
import { View, ViewProps } from 'react-native';

interface StackProps extends ViewProps { direction?: 'row' | 'col'; spacing?: number; }

export const Stack = ({ direction = 'col', spacing = 4, children, className, ...props }: StackProps) => (
  <View className={`flex ${direction === 'row' ? 'flex-row' : 'flex-col'} gap-${spacing} ${className}`} {...props}>
    {children}
  </View>
);