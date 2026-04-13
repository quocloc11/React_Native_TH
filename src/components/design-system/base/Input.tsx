import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = ({ label, error, helperText, className, ...props }: InputProps) => (
  <View className="w-full mb-4">
    {label && <Text weight="bold" className="mb-2">{label}</Text>}
    <TextInput
      className={`w-full px-4 py-3 bg-white dark:bg-neutral-900 border rounded-md text-neutral-900 dark:text-white
        ${error ? 'border-semantic-error' : 'border-neutral-500'} ${className}
      `}
      placeholderTextColor="#6b7280"
      {...props}
    />
    {error ? <Text variant="caption" color="error" className="mt-1">{error}</Text>
      : helperText && <Text variant="caption" className="text-neutral-500 mt-1">{helperText}</Text>}
  </View>
);