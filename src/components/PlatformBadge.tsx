// src/components/PlatformBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isIOS, getPlatformName } from '@utils/platform';

const PlatformBadge = () => {
  return (
    // Đổi màu nền: iOS màu xanh dương, Android màu xanh lá
    <View style={[styles.container, isIOS ? styles.iosStyle : styles.androidStyle]}>
      <Text style={styles.text}>
        Đang chạy trên nền tảng: {getPlatformName().toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  iosStyle: {
    backgroundColor: '#007AFF', // Màu xanh đặc trưng iOS
  },
  androidStyle: {
    backgroundColor: '#3DDC84', // Màu xanh đặc trưng Android
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlatformBadge;