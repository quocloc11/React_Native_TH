import React from 'react';
import { TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}

export const Button = ({ title, variant = 'primary', size = 'medium', isLoading, disabled, className, ...props }: ButtonProps) => {
  const base = "flex-row justify-center items-center rounded-md";
  const variants = {
    primary: "bg-primary border border-primary",
    secondary: "bg-secondary border border-secondary",
    outline: "bg-transparent border-2 border-primary",
    ghost: "bg-transparent",
  };
  const sizes = { small: "px-3 py-2", medium: "px-4 py-3", large: "px-6 py-4" };
  const textColors = { primary: "text-white", secondary: "text-white", outline: "text-primary", ghost: "text-primary" };

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50' : 'opacity-100'} ${className}`}
      {...props}
    >
      {isLoading ? <ActivityIndicator color={variant === 'outline' ? '#3b82f6' : '#fff'} /> : (
        <Text weight="bold" className={textColors[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};