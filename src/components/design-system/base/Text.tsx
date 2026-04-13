import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'heading' | 'body' | 'caption';
  weight?: 'normal' | 'bold';
  color?: 'primary' | 'neutral' | 'error';
}

export const Text = ({ variant = 'body', weight = 'normal', color = 'neutral', className, children, ...props }: TypographyProps) => {
  const variants = { heading: 'text-2xl leading-8', body: 'text-base leading-6', caption: 'text-xs leading-4' };
  const weights = { normal: 'font-normal', bold: 'font-bold' };
  const colors = { primary: 'text-primary', neutral: 'text-neutral-900 dark:text-neutral-100', error: 'text-semantic-error' };

  return (
    <RNText className={`${variants[variant]} ${weights[weight]} ${colors[color]} ${className}`} {...props}>
      {children}
    </RNText>
  );
};