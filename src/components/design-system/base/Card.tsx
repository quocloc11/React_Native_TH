import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps { variant?: 'default' | 'elevated' | 'outlined'; }

export const Card = ({ variant = 'default', className, children, ...props }: CardProps) => {
  const variants = {
    default: "bg-white dark:bg-neutral-900",
    elevated: "bg-white dark:bg-neutral-900 shadow-lg elevation-5",
    outlined: "bg-transparent border border-neutral-500",
  };
  return <View className={`rounded-lg p-4 ${variants[variant]} ${className}`} {...props}>{children}</View>;
};