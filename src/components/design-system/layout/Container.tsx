import React from 'react';
import { View, SafeAreaView, ViewProps } from 'react-native';

export const Container = ({ children, className, ...props }: ViewProps) => (
  <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900">
    <View className={`flex-1 w-full max-w-md mx-auto px-4 ${className}`} {...props}>
      {children}
    </View>
  </SafeAreaView>
);